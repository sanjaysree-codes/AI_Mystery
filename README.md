# AI Mystery Room

An AI-powered detective game that turns a scenario into a fictional case. Investigate suspects, messages, documents and a timeline, then make one final accusation. Gemini generates cases on the server; backend validation and game rules control the solution.

## Stack

React, Vite, React Router, Express, MongoDB/Mongoose, Google Gen AI SDK, Zod.

## Requirements

- Node.js 20 or newer and npm
- MongoDB (local or hosted)
- A Google Gemini API key and supported model ID

## Setup

1. Install dependencies from the repository root: `npm.cmd install` (PowerShell users can use this to avoid the blocked `npm.ps1` shim).
2. Copy `server/.env.example` to `server/.env` and fill in `GEMINI_API_KEY`, `GEMINI_MODEL`, and a long random `SESSION_SECRET`.
3. Set `MONGODB_URI` to your MongoDB instance.
4. Start both services with `npm run dev`.
5. Open `http://localhost:5173`; the API listens on `http://localhost:5000`.

The backend validates its configuration and MongoDB connection on startup. Generated cases need a reachable Gemini API and MongoDB. The mock provider is deliberately not used as a production fallback.

## Scripts

- `npm.cmd run dev` — frontend and backend
- `npm.cmd run build` — production frontend build
- `npm.cmd start` — production backend (serve the built client separately)
- `npm.cmd --workspace server test` — backend retry and delay parsing tests

## Privacy and security

Guest investigations are tied to a signed, HTTP-only server session cookie. The API constructs explicit public case responses; culprit, blueprint, private interpretations, and prompts stay server-side until a result or explicit reveal is authorized. Use HTTPS in production and set `NODE_ENV=production`.

See [API.md](API.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), and [SPEC.md](SPEC.md).
