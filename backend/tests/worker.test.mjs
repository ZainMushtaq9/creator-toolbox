// Worker integration smoke tests (Phase 4) — run with `node --test`
// from the backend directory. Uses a fake D1 backed by node:sqlite with
// the real migrations applied, and the real Worker fetch handler.
// No network, no Cloudflare, no secrets.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import worker from "../src/index.js";

const ENV = {
  ALLOWED_ORIGIN: "https://example.com",
  ADMIN_TOKEN: "test-admin-token-123",
  AI_PROVIDER: "workers-ai",
  // No AI binding and no API key on purpose: AI must return the labelled dev mock.
};

function makeFakeDb() {
  const db = new DatabaseSync(":memory:");
  for (const f of ["0001_initial.sql", "0002_keywords.sql", "0003_audits.sql", "0004_search_console.sql"]) {
    db.exec(readFileSync(new URL(`../migrations/${f}`, import.meta.url), "utf8"));
  }
  return {
    prepare(sql) {
      const stmt = db.prepare(sql);
      return {
        first: () => stmt.get() ?? null,
        all: () => ({ results: stmt.all() }),
        run: () => { const r = stmt.run(); return { success: true, meta: { success: true, changes: r.changes } }; },
        bind(...args) {
          return {
            first: () => stmt.get(...args) ?? null,
            all: () => ({ results: stmt.all(...args) }),
            run: () => { const r = stmt.run(...args); return { success: true, meta: { success: true, changes: r.changes } }; },
          };
        },
      };
    },
  };
}

const env = { ...ENV, DB: makeFakeDb() };

async function call(path, { method = "GET", body, token, origin, envOverride } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (origin) headers.Origin = origin;
  const req = new Request(`https://worker.test${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const res = await worker.fetch(req, envOverride || env, {});
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* non-JSON */ }
  return { status: res.status, headers: res.headers, json };
}

test("health returns the envelope", async () => {
  const r = await call("/api/v1/health");
  assert.equal(r.status, 200);
  assert.equal(r.json.success, true);
  assert.equal(r.json.data.status, "ok");
  assert.equal(r.json.data.db, true);
  assert.equal(r.json.error, null);
});

test("unknown endpoint returns a structured 404 envelope", async () => {
  const r = await call("/api/v1/nope");
  assert.equal(r.status, 404);
  assert.equal(r.json.success, false);
  assert.equal(r.json.error.code, "not_found");
});

test("CORS reflects only the configured origin", async () => {
  const ok = await call("/api/v1/health", { origin: "https://example.com" });
  assert.equal(ok.headers.get("Access-Control-Allow-Origin"), "https://example.com");
  const bad = await call("/api/v1/health", { origin: "https://evil.example" });
  assert.equal(bad.headers.get("Access-Control-Allow-Origin"), null);
});

test("AI endpoints require ADMIN_TOKEN", async () => {
  const noToken = await call("/api/v1/ai/models");
  assert.equal(noToken.status, 401);
  const wrong = await call("/api/v1/ai/models", { token: "wrong" });
  assert.equal(wrong.status, 401);
});

test("AI recommendations return the labelled dev mock without an AI binding", async () => {
  const r = await call("/api/v1/ai/recommendations", {
    method: "POST",
    token: ENV.ADMIN_TOKEN,
    body: { task: "seoAnalysis", prompt: "Review the homepage" },
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.success, true);
  assert.equal(r.json.data.mode, "mock");
  assert.equal(r.json.data.provider, "workers-ai");
  assert.match(r.json.data.note, /NOT production-connected/);
  assert.match(r.json.data.text, /DEV MOCK/);
  assert.ok(r.json.data.evidenceRequired);
});

test("AI recommendations go live through a stubbed Workers AI binding", async () => {
  const fakeAI = {
    run: async (model, input) => {
      assert.equal(model, "@cf/meta/llama-4-scout-17b-16e-instruct");
      assert.ok(Array.isArray(input.messages));
      return { response: "Stubbed Workers AI answer." };
    },
  };
  const r = await call("/api/v1/ai/recommendations", {
    method: "POST",
    token: ENV.ADMIN_TOKEN,
    body: { task: "seoAnalysis", prompt: "Review the homepage" },
    envOverride: { ...env, AI: fakeAI },
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.data.mode, "live");
  assert.equal(r.json.data.provider, "workers-ai");
  assert.equal(r.json.data.text, "Stubbed Workers AI answer.");
});

test("AI recommendations fall back to the Hugging Face mock when selected", async () => {
  const r = await call("/api/v1/ai/recommendations", {
    method: "POST",
    token: ENV.ADMIN_TOKEN,
    body: { task: "seoAnalysis", prompt: "Review the homepage" },
    envOverride: { ...env, AI_PROVIDER: "huggingface" },
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.data.mode, "mock");
  assert.equal(r.json.data.provider, "huggingface");
  assert.match(r.json.data.note, /NOT CONNECTED/);
});

test("AI recommendations fall back to the AnyRouter mock when selected", async () => {
  const r = await call("/api/v1/ai/recommendations", {
    method: "POST",
    token: ENV.ADMIN_TOKEN,
    body: { task: "seoAnalysis", prompt: "Review the homepage" },
    envOverride: { ...env, AI_PROVIDER: "anyrouter" },
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.data.mode, "mock");
  assert.equal(r.json.data.provider, "anyrouter");
});

test("Over-long input overflows to Gemini and reports NOT CONNECTED without a key", async () => {
  // The HTTP route caps prompts at 4,000 chars, so the overflow path is
  // exercised directly at the provider layer (it exists for long
  // evidence assembled server-side, e.g. a full-site audit bundle).
  const { callAI } = await import("../src/services/aiProvider.js");
  const result = await callAI(env, { task: "seoAnalysis", prompt: "x".repeat(500_001) });
  assert.equal(result.mode, "unavailable");
  assert.equal(result.provider, "gemini");
  assert.match(result.error, /NOT CONNECTED/);
});

test("AI models endpoint reports configured-only without a live call", async () => {
  const r = await call("/api/v1/ai/models", { token: ENV.ADMIN_TOKEN });
  assert.equal(r.status, 200);
  assert.equal(r.json.data.provider, "workers-ai");
  assert.equal(r.json.data.configured.tasks.seoAnalysis.model, "@cf/meta/llama-4-scout-17b-16e-instruct");
  assert.equal(r.json.data.configured.tasks.keywordClustering.model, "@cf/baai/bge-m3");
  assert.equal(r.json.data.configured.longContext.model, "gemini-2.5-flash");
  assert.ok(["live-catalog", "configured-only"].includes(r.json.data.live.source));
});

test("keyword research labels volume/difficulty unavailable", async () => {
  const r = await call("/api/v1/keyword/research", {
    method: "POST",
    token: ENV.ADMIN_TOKEN,
    body: { keyword: "video editing" },
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.success, true);
  assert.ok(Array.isArray(r.json.data.suggestions) && r.json.data.suggestions.length > 0);
  for (const s of r.json.data.suggestions) {
    assert.equal(s.searchVolume, "unavailable");
    assert.equal(s.difficulty, "unavailable");
  }
});

test("page audit on supplied HTML scores and surfaces findings", async () => {
  const html = "<!doctype html><html><head><title>Test Page Title Here</title><meta name=\"description\" content=\"A short description.\"></head><body><h1>Heading</h1><p>Some text about video editing tools.</p><img src=\"/a.png\"></body></html>";
  const r = await call("/api/v1/audit/page", {
    method: "POST",
    token: ENV.ADMIN_TOKEN,
    body: { url: "https://example.com/page", html },
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.success, true);
  assert.ok(r.json.data.score >= 0 && r.json.data.score <= 100);
  assert.ok(Array.isArray(r.json.data.findings));
  const imgFinding = r.json.data.findings.find((f) => f.category === "images");
  assert.ok(imgFinding, "missing alt text should be flagged");
});

test("SSRF: localhost audit URL is rejected", async () => {
  const r = await call("/api/v1/audit/page", {
    method: "POST",
    token: ENV.ADMIN_TOKEN,
    body: { url: "http://localhost:8787/admin" },
  });
  assert.equal(r.status, 422);
  assert.equal(r.json.success, false);
  assert.equal(r.json.error.code, "fetch_failed");
});

test("reports round-trip through the fake D1", async () => {
  const created = await call("/api/v1/reports", {
    method: "POST",
    token: ENV.ADMIN_TOKEN,
    body: { type: "audit", reportData: { score: 80 } },
  });
  assert.equal(created.status, 201);
  assert.ok(created.json.data.id);
  const list = await call("/api/v1/reports", { token: ENV.ADMIN_TOKEN });
  assert.equal(list.status, 200);
  assert.equal(list.json.data.reports.length, 1);
  assert.equal(list.json.data.reports[0].type, "audit");
  const one = await call(`/api/v1/reports/${created.json.data.id}`, { token: ENV.ADMIN_TOKEN });
  assert.equal(one.status, 200);
  assert.equal(one.json.data.report_data.score, 80);
  const del = await call(`/api/v1/reports/${created.json.data.id}`, { method: "DELETE", token: ENV.ADMIN_TOKEN });
  assert.equal(del.status, 200);
  assert.equal(del.json.data.deleted, true);
});

test("GSC status is NOT CONNECTED without credentials", async () => {
  const r = await call("/api/v1/gsc/status", { token: ENV.ADMIN_TOKEN });
  assert.equal(r.status, 200);
  assert.equal(r.json.data.connected, false);
  assert.match(r.json.data.note, /NOT CONNECTED/);
});

test("admin health requires a token and reports mock-only AI", async () => {
  const denied = await call("/api/v1/admin/health");
  assert.equal(denied.status, 401);
  const r = await call("/api/v1/admin/health", { token: ENV.ADMIN_TOKEN });
  assert.equal(r.status, 200);
  assert.equal(r.json.data.aiProvider, "workers-ai");
  assert.equal(r.json.data.aiMode, "mock-only");
  assert.equal(r.json.data.aiBound, false);
  assert.equal(r.json.data.secretsConfigured.GEMINI_API_KEY, false);
  assert.equal(r.json.data.secretsConfigured.HF_API_TOKEN, false);
  assert.equal(r.json.data.secretsConfigured.ANYROUTER_API_KEY, false);
});
