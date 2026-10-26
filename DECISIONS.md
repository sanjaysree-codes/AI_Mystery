# Implementation decisions

## 2026-10-26 — Mongo-backed guest sessions

- **Decision:** Use `express-session` with `connect-mongo` and a signed, HTTP-only cookie to own guest cases.
- **Reason:** A browser-editable ID is not an authorization boundary; a Mongo session survives API process restarts.
- **Alternatives:** User accounts (outside MVP), in-memory sessions (not restart-safe).
- **Specification change:** None.

## 2026-10-26 — In-process asynchronous generation

- **Decision:** Return a generation ID immediately and run the bounded job in the API process; the browser polls status.
- **Reason:** Matches the asynchronous UX without adding a worker/Redis dependency to the MVP.
- **Alternatives:** Synchronous request (long request timeout), dedicated distributed queue (extra operations).
- **Limitation:** A process restart during generation can leave a record in progress; durable worker recovery is a future improvement.
- **Specification change:** None.

## 2026-10-26 — One structured generation response with strict validation

- **Decision:** Generate a canonical case and solution together as structured JSON, requiring the model prompt to establish culprit/timeline before evidence, then validate all IDs, counts, and references on the server. Retry within the shared three-attempt limit, then fail closed.
- **Reason:** Keeps evidence and answer grounded in one canonical response while enforcing the mandatory private boundary.
- **Alternatives:** Multiple AI calls for blueprint and evidence (more latency and partial-failure paths); unstructured prose (not safely machine-checkable).
- **Specification change:** None; the generation order remains explicit in the prompt and validation.

## 2026-10-26 — Simulated optional media

- **Decision:** Keep generated evidence textual, label CCTV as simulated, and do not require external image storage in the initial implementation.
- **Reason:** The spec allows optional media to fail without blocking a playable case; no media credentials were supplied.
- **Alternatives:** Add an image generation/storage provider (requires configuration and spend).
- **Specification change:** None; richer media remains a documented MVP limitation.

## 2026-10-26 — Bounded Gemini retries and model configuration

- **Decision:** The initial `gemini-3.8-flash` setting was listed for the server-side key, but live generation returned Gateway Timeout. A full case request to `gemini-3.6-flash` returned 503 Service Unavailable. Switched `server/.env` to `gemini-3.5-flash-lite`; a full short mystery then generated and passed server validation. The API key listed this model for `generateContent`, and Google's model documentation confirms stable structured-output support.
- **Request limits:** Removed the legacy `temperature` parameter and capped output at 16,384 tokens, below the model's documented 65,536-token output limit. Empty or truncated structured responses now fail with a clear internal reason.
- **Retry behavior:** Disable SDK retries and retry transient 429/500/502/503/504 errors at the generation-job layer, at most three total API calls. Apply exponential backoff with jitter and honor returned retry-delay metadata. Reuse the same mystery record throughout.
- **Diagnostics:** Keep the player-facing message friendly, while logging and storing the original provider status, message, model, attempt count, and retry delay in a private field for diagnosis.
- **Reason:** The configured model was accessible but repeatedly timing out under case-generation load. A verified model that completed the actual case schema is a better fit for this workload.
- **Alternatives:** Relying on a minimal model-list check alone; relying on SDK defaults; returning fake local data.
- **Specification change:** None.
