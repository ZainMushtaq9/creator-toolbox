// Consistent JSON response envelope (Brief §4 / Roadmap PDF §4.3).
// Every /api/v1 response uses this shape:
//   { success, data, meta: { generatedAt, source, cache }, error: { code, message } | null }
// Never include stack traces, provider secrets or internal details.
export function envelope(data, { source = "worker", cache = "miss", status = 200 } = {}) {
  const body = {
    success: true,
    data,
    meta: { generatedAt: new Date().toISOString(), source, cache },
    error: null,
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function envelopeError(code, message, status = 400) {
  const body = {
    success: false,
    data: null,
    meta: { generatedAt: new Date().toISOString(), source: "worker", cache: "miss" },
    error: { code, message },
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Parse a JSON request body with a size cap. Returns { ok, value } or
// { ok:false, error } — never throws a stack trace to the client.
export async function parseJsonBody(request, { maxBytes = 65536 } = {}) {
  let text;
  try {
    text = await request.text();
  } catch {
    return { ok: false, error: "Could not read request body." };
  }
  if (text.length > maxBytes) {
    return { ok: false, error: `Request body too large (max ${maxBytes} bytes).` };
  }
  if (!text.trim()) return { ok: true, value: {} };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, error: "Request body is not valid JSON." };
  }
}

// Validate with a zod schema. Returns { ok, value } or { ok:false, error }.
export function validateBody(schema, value) {
  const result = schema.safeParse(value);
  if (result.success) return { ok: true, value: result.data };
  const first = result.error.issues[0];
  return {
    ok: false,
    error: `Invalid ${first.path.join(".") || "request"}: ${first.message}`,
  };
}
