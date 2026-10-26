# Architecture

## Request flow

The React/Vite client calls the Express API under `/api/v1` with credentials enabled. Express applies Helmet, a strict CORS origin, JSON size limits, rate limiting, and an HTTP-only Mongo-backed guest session. All case operations are scoped to the server session ID. The general limit is 600 requests per 15 minutes per session so status polling does not consume a low IP-wide budget; case creation separately remains limited to 3 per hour.

## Mystery generation

1. `POST /api/v1/mysteries` validates the scenario and options with Zod, creates a `generating` Mongo document, returns its ID, and starts a bounded asynchronous generation task.
2. The server calls the official Google Gen AI SDK with a structured response schema. The prompt treats the scenario as untrusted story data and requires one culprit, set before evidence, plus a coherent event sequence.
3. The server validates suspect/evidence counts, unique IDs, culprit membership, and cross references. Invalid output is never marked playable; the generation job may request another structured response within its three-attempt ceiling.
4. The service constructs an explicit public case representation with private fields removed and stores the private solution and blueprint in separate fields excluded from ordinary Mongoose selection.
5. The client polls the status endpoint and opens the investigation only when the record is `ready`.

The current MVP runs the async job in the API process, which avoids queue infrastructure. A process restart during generation can leave an in-flight record unfinished; production job recovery is a follow-up operational improvement.

Gemini calls disable SDK-internal retries and use one server-controlled retry loop with a maximum of three total generation requests per case. HTTP 429, 500, 502, 503, and 504 responses use exponential backoff with jitter; a `Retry-After`, `retry-after-ms`, or Google `RetryInfo.retryDelay` value takes precedence when it asks for a longer wait. Invalid structured output can be regenerated within the same three-attempt ceiling. Retried calls reuse the original mystery record and ID.

The selected model comes from `server/.env`. The current `gemini-3.5-flash-lite` setting was checked against the key's model list and used to generate a short case that passed the server validator. Requests use JSON structured output, no unsupported sampling controls, and a 16,384-token output cap. Provider failures remain available in server logs and a private `generationFailure` field; the status endpoint returns only the friendly player message.

## Data and privacy boundaries

- `Mystery` stores public case data, private solution, private suspect fields, evidence interpretations, and the actual timeline.
- `InvestigationProgress` stores viewed clues, notes, tentative selection, completion, and solution reveal state per guest session.
- `Accusation` stores the final suspect and server-computed correctness/score. A unique index prevents a second accusation for the same attempt.
- Public mystery and evidence routes return explicit allowlisted structures. Culprit and solution data are returned only by the authorized result endpoint after accusation or reveal.
- Session cookies are HTTP-only, SameSite=Lax, secure in production, and backed by MongoDB.

## Media

Evidence is generated as fictional textual descriptions and references. CCTV records are labeled as simulated in the viewer. The media provider is configured as `simulated`; image/video asset generation and object storage are not configured in this initial build, and cases remain playable without optional media.

## Frontend

`client/src/App.jsx` contains the responsive landing, creation, dashboard, investigation, and result routes. `client/src/api.js` centralizes credentialed JSON requests. The browser handles rendering and temporary UI state only; answer validation and hidden solution disclosure are server-owned.
