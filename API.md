# API

All routes are JSON under `/api/v1`. The first request receives an HTTP-only guest session cookie. Include cookies on subsequent requests (`fetch` uses `credentials: 'include'`). Success responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "error": { "code": "...", "message": "..." } }`.

| Method and path | Purpose | Access/notes |
| --- | --- | --- |
| `GET /health` | Health check | No case data |
| `POST /mysteries` | Create a case generation job | Validates scenario (20–2000 chars), genre, difficulty, 3–6 suspects and length; returns HTTP 202 with ID/status |
| `GET /mysteries` | List guest-owned cases | Current session only |
| `GET /mysteries/:id/status` | Poll generation | Current owner; returns status/progress |
| `GET /mysteries/:id` | Fetch public case and progress | Ready case only; no solution/private fields |
| `GET /mysteries/:id/suspects/:suspectId` | Fetch public suspect | Current owner |
| `GET /mysteries/:id/evidence/:evidenceId` | Fetch/discover evidence | Current owner; tracks viewed evidence |
| `PATCH /mysteries/:id/progress` | Track viewed evidence/selection or add, edit, delete notes | Current owner; validates case references |
| `POST /mysteries/:id/accusations` | Final accusation | `{ "suspectId": "s1", "reasoning": "..." }`; one submission, correctness calculated on server |
| `POST /mysteries/:id/reveal` | End investigation and reveal | Current owner; cannot override a submitted accusation |
| `GET /mysteries/:id/result` | Read solution and result | Only after final accusation or explicit reveal |
| `DELETE /mysteries/:id` | Delete case and progress | Current owner |

Creation request example:

```json
{
  "title": "The Last Gallery",
  "scenario": "A famous painting disappeared from a hotel during a business conference. Four employees had access to the gallery.",
  "genre": "theft",
  "difficulty": "medium",
  "suspectCount": 4,
  "investigationLength": "standard"
}
```

Supported genres: `theft`, `missing_object`, `disappearance`, `murder_mystery`, `corporate_espionage`, `general_detective`. Difficulties: `easy`, `medium`, `hard`. Lengths: `short`, `standard`, `extended`.

Common errors include `INVALID_INPUT` (400), `INVALID_ID` (400), `MYSTERY_NOT_FOUND` (404), `MYSTERY_NOT_READY` (409), `RESULT_LOCKED` (403), and `ACCUSATION_FINAL` (409). The general API budget is 600 requests per 15 minutes per guest session; case creation has a separate limit of 3 per hour. Both limit responses use the standard JSON error format. Internal error details are logged server-side and not returned.
