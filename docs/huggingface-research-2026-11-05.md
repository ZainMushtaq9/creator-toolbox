# Hugging Face Inference Providers — research for CreatorToolbox Phase 4

Date: 2026-11-05. Verified from Hugging Face's own docs/pricing pages and the live
router model list (`GET https://router.huggingface.co/v1/models`, checked 2026-11-05).
No account created, no token generated, no payment made. Research only.

## Verdict: NOT the default — optional paid/BYOK fallback only

The user said "Use hugging face with api key", so HF should be wired as a provider
behind a Worker secret — but honestly: **for a free account, Hugging Face Inference
Providers is NOT free.** HF's own pricing page (fetched 2026-11-05) gives free users
**zero** included monthly credits. The old "$0.10/month free credit" figure in Aug 2026
guides is stale — HF removed it around 15 Oct 2026. With $0 credits, routed calls do
not work until credits are purchased (payment method required) or an upstream
provider's own key is added (BYOK route, below).

**Keep Cloudflare Workers AI as the default** (10,000 Neurons/day, no key, no card,
native `env.AI.run`). Wire HF as an optional fallback behind `HF_API_TOKEN`, labelled
NOT CONNECTED until credits or a BYOK key exist.

## 1. Free-credits question — settled from the official pricing page

Source: https://huggingface.co/docs/inference-providers/pricing (fetched 2026-11-05).

> "PRO users and Team or Enterprise organizations receive monthly credits to use
> with Inference Providers. Free users can use Inference Providers by purchasing
> credits, or by upgrading to PRO."

| Account type | Monthly credits | Extra usage |
|---|---|---|
| Free users | **None** | yes — credits purchase required |
| PRO users | $2.00 | yes |
| Team / Enterprise | $2.00 per seat | yes |

- PRO is $9/month (secondary sources citing huggingface.co/pricing; the $2 credit
  figure itself is from HF's official pricing doc).
- Credits are general-purpose compute credits (also usable on Inference Endpoints,
  Spaces hardware incl. ZeroGPU beyond quota, Jobs). HF charges the provider's rate
  with no markup.
- The $0.10/month free-credit figure: present in guides from Aug–Sep 2026, removed
  ~15 Oct 2026 (HF docs change tracked by usagepricing.com changelog). Do not use it.
- **What happens with $0 credits:** HF's docs say use requires purchasing credits;
  there is no free allowance to fall back on. The exact error is UNVERIFIED from
  official docs — HF forum staff report HTTP 402 "You have depleted your monthly
  included credits" when no payment method is on the account. Treat 402 as
  forum-reported, not official.

### BYOK route (the only genuinely free way through HF)

Official pricing doc: "Custom Provider Key — You set a custom provider key in HF
settings … Hugging Face won't charge you for the call" and "Billed directly by the
provider". Credits do not apply to custom-key requests.

- So the upstream provider's own free tier becomes the limit. Worked example from
  HF-adjacent guides: add a **Groq free key** in HF Inference Providers settings,
  then call `openai/gpt-oss-120b:groq` — Groq's own free limits apply (30 RPM,
  1,000 req/day, 200,000 tokens/day, no card — per the 2026-11-05 video-sources
  research, not re-verified here).
- Which upstream keys are accepted: the exact list is UNVERIFIED from official docs
  in this session. Groq is the documented/worked example (`:groq` suffix); Together
  and SambaNova are named as BYOK-able only in third-party docs. Check the live
  Inference Providers settings page before promising a specific provider.
- Note: BYOK through HF adds a hop for no benefit over calling Groq directly — its
  only value is a single router endpoint for several providers.

## 2. Base URL + API style

- **Base URL:** `https://router.huggingface.co/v1` — OpenAI-compatible.
- **Chat completions:** `POST /v1/chat/completions` — drop-in OpenAI replacement.
  Model IDs are Hub IDs with an optional routing suffix: `:fastest` (default),
  `:cheapest`, `:preferred`, or `:<provider>` (e.g. `openai/gpt-oss-120b:groq`).
- **Embeddings:** NOT available on the OpenAI-compatible `/v1` surface. HF docs:
  "This OpenAI-compatible endpoint is currently available for chat completion tasks
  only. For other tasks like text-to-image, embeddings, or speech processing, use
  the Hugging Face inference clients." Embeddings go through the task-specific
  feature-extraction API (`InferenceClient.feature_extraction` / task endpoint).
- **Auth:** `Authorization: Bearer $HF_TOKEN` — a **fine-grained** user access token
  with the **"Make calls to Inference Providers"** permission.
- **Model list:** `GET /v1/models` returns live models with per-provider pricing,
  context length, latency and throughput. Checked live 2026-11-05: **126 chat
  models, ZERO with `is_free: true` on any provider.**

## 3. Best model IDs per Phase 4 need (live router list, 2026-11-05)

Prices are $ per 1M tokens (input/output) from the live `GET /v1/models` response;
context length is per provider and varies — the value shown is the best verified
live option. All of these are billed from the first call on a free account.

### (a) Instruction LLM — SEO recommendations / outlines
**`openai/gpt-oss-120b`** — 131,072 ctx on every live provider. Not gated,
Apache-2.0. Cheapest live: DeepInfra $0.037 in / $0.17 out per 1M; Groq $0.15/$0.75.
Cheaper alternative: `openai/gpt-oss-20b`, 131,072 ctx, DeepInfra $0.03/$0.14.

### (b) Embeddings — keyword clustering / semantic similarity
**`BAAI/bge-m3`** (1024-dim, multilingual) — served live by `hf-inference` for the
sentence-similarity task (verified via Hub API `inferenceProviderMapping`).
Alternative: `Qwen/Qwen3-Embedding-0.6B` (1024-dim) — live on DeepInfra for
feature-extraction. Neither is on the router `/v1/models` chat list and neither
is reachable via an OpenAI-style `/v1/embeddings` call — use the task API.
`hf-inference` bills per compute time past any credits (it is CPU-focused since
Jul 2025). Embedding prices per token were NOT published in the fetched docs —
UNVERIFIED.

### (c) Long-context LLM — competitor page comparison
**`deepseek-ai/DeepSeek-V4.1-Flash`** — 1,048,576 ctx (Novita/Baseten/DeepInfra),
DeepInfra $0.20 in / $0.60 out per 1M. Not gated, MIT.
Alternative: `zai-org/GLM-5.3-Flash` — 1,048,576 ctx, $0.15/$0.50.
`moonshotai/Kimi-K2.6` — 262,144 ctx, $0.75/$3.50. `Qwen/Qwen3.8-27B` — up to
1,048,576 ctx via nscale ($0.20/$2.50).

### Gated models — avoid without separate approval
`meta-llama/Llama-3.3-70B-Instruct` and `meta-llama/Llama-4-Scout-17B-16E-Instruct`
are **gated: manual** (licence acceptance required on the model page). Do not wire
them unless the user accepts the licence.

## 4. Rate limits, reliability, terms

- No per-minute/RPM inference limit is published by HF — limits come from the
  upstream provider (a 429 means the provider's throughput ceiling, not the credit
  balance). Hub API limits (1,000 calls/5 min on free accounts) are third-party
  reported — UNVERIFIED from official docs.
- Cold starts: routed providers run warm capacity; `hf-inference` is mostly CPU
  since Jul 2025 (embeddings, small/legacy models).
- Whether any upstream provider trains on free-tier prompts: UNVERIFIED from
  official sources — each upstream provider's own terms apply, and HF routes to
  many of them. Do not send sensitive user data through HF until this is checked
  per provider.
- ZeroGPU Spaces (free 5 GPU-min/day) is NOT a Worker-callable API and is not a
  substitute for Inference Providers.

## 5. Honest comparison vs Cloudflare Workers AI (current default)

| Axis | Cloudflare Workers AI | Hugging Face Inference Providers |
|---|---|---|
| Cost (free account) | **Better** — 10,000 Neurons/day recurring, forever, $0 | **Worse** — $0 included credits; paid from the first call (or PRO $9/mo for $2 credits) |
| Key / card | **Better** — none needed, native `env.AI.run` | **Worse** — HF token + purchased credits (payment method) or a BYOK key |
| Model choice | Narrower (CF catalog) | **Better** — 126 live chat models: DeepSeek V4, GLM 5.3, Kimi, Qwen3.8, gpt-oss |
| Context length | 131K served (Llama-4-Scout) | **Better** — 1,048,576 ctx (DeepSeek V4.1 Flash, GLM-5.3 Flash) |
| Embeddings | **Better** — `@cf/baai/bge-m3` on the same binding, same free pool | **Worse** — no OpenAI `/v1/embeddings`; separate task API, still billed |
| Worker integration | **Better** — native binding, no secret | **Worse** — HTTPS + secret, extra hop |

Cost illustration (verified live prices): PRO's $2 of credits buys, at DeepInfra
`gpt-oss-120b` rates ($0.037 in / $0.17 out per 1M), roughly 54M input tokens or
~12M output tokens. On a free account that same usage costs $2 out of pocket —
there is no free slice.

## 6. Token steps (user does this; nothing created here)

Account already exists: username **zainmushtaq54**, email 5439, signed in before,
login saved. No token was created in this research.

1. Sign in at huggingface.co as zainmushtaq54.
2. Go to **Settings → Access Tokens** (`huggingface.co/settings/tokens`) →
   **Create new token** → type **fine-grained** → name it e.g. `CreatorToolbox-Worker`.
3. Under the **Inference** section, enable ONLY **"Make calls to Inference Providers"**.
   Do not enable repository write or any other permission.
4. Copy the token once (it starts `hf_…`). Store it as the Cloudflare Worker secret
   **`HF_API_TOKEN`** (e.g. `wrangler secret put HF_API_TOKEN`) — never paste it in
   chat, never write it in a file.
5. **NEVER reuse the 2026-11-04 chat-shared HF token** — it was treated as exposed.
   This CreatorToolbox token must also be **separate from the PSX project's token**
   (different token value, even though both may be stored under the name
   `HF_API_TOKEN` in their own environments).
6. To make the token actually usable, one of: (a) buy credits at
   huggingface.co/settings/billing (payment method required), (b) upgrade to PRO
   ($9/mo, $2 credits), or (c) add an upstream provider's own key (e.g. Groq free
   key) in Inference Providers settings and call that provider with the
   `:<provider>` suffix. Until one of these is done, the integration stays labelled
   NOT CONNECTED with the dev mock.

## Sources (all fetched 2026-11-05)
- https://huggingface.co/docs/inference-providers/pricing (official — free credits: None)
- https://huggingface.co/docs/inference-providers/index (official — auth, OpenAI-compat, chat-only note)
- https://huggingface.co/docs/inference-providers/tasks/feature-extraction (official — embeddings via task API)
- Live `GET https://router.huggingface.co/v1/models` (126 models, 0 free) and Hub API
  `inferenceProviderMapping` for BAAI/bge-m3, Qwen3-Embedding-0.6B, gated status of
  Llama models.
- PRO $9/mo: secondary sources citing huggingface.co/pricing (usagepricing.com,
  aiketra.com) — not confirmed on the fetched pricing page itself.
