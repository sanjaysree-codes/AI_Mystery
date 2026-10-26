# AI MYSTERY ROOM

## Master Specification — Single Source of Truth for Codex

**Document Type:** Product Requirements + Software Requirements + Technical Design
**Project Name:** AI Mystery Room
**Document Version:** 1.0.0
**Status:** Initial specification
**Architecture:** MERN Stack
**AI Provider:** Google Gemini
**Primary Purpose:** AI-generated, interactive mystery investigation game
**Target Platform:** Responsive web application
**Primary Users:** People who enjoy detective stories, puzzles, logical reasoning, and interactive investigations.

---

# 1. PROJECT OVERVIEW

## 1.1 What Is AI Mystery Room?

AI Mystery Room is an AI-powered mystery investigation platform where users can create and solve fictional detective cases.

A user provides a short scenario, story, or mystery idea. The application uses Google Gemini to transform that input into a complete fictional investigation.

Each investigation contains:

* A mystery scenario.
* A fictional crime or suspicious incident.
* Multiple suspects.
* Suspect profiles and alibis.
* AI-generated evidence.
* Fictional WhatsApp-style conversations.
* Images and photographs.
* Simulated CCTV recordings.
* Witness statements.
* A chronological timeline.
* Hidden clues and contradictions.
* One predetermined culprit.
* A final accusation interface.
* An explanation of the correct solution.

The player investigates the available evidence, connects the clues, identifies contradictions, and selects the person they believe is responsible.

After submitting their accusation, the player receives the result and an explanation of the case.

**Core product principle: The AI creates the mystery, but the game engine controls the investigation rules and validates the player's answer.**

The application must not reveal the culprit before the player submits an accusation or explicitly chooses to reveal the solution.

## 1.2 Example User Journey

A user enters the following scenario:

> A valuable diamond disappeared from a mansion during a birthday party. Five people were present, and the mansion's security camera stopped recording for ten minutes.

The application generates a mystery called:

**The Missing Diamond**

The investigation contains five suspects:

1. The mansion owner.
2. The owner's personal assistant.
3. The security guard.
4. A family member.
5. A party organizer.

The player can examine:

* WhatsApp conversations between suspects.
* Photographs taken during the party.
* A simulated CCTV recording.
* Statements from witnesses.
* The timeline of events.
* Contradictions between statements and evidence.

The player discovers that one suspect's statement conflicts with the CCTV timeline.

The player selects a suspect and submits the accusation.

The application displays whether the accusation is correct and explains how the evidence establishes the solution.

**Important:** This example is illustrative. The application must generate cases dynamically rather than using this example as a fixed investigation.

---

# 2. PRODUCT VISION AND OBJECTIVES

## 2.1 Product Vision

Build an engaging mystery-solving experience in which AI transforms a user's ideas into interactive detective investigations.

The product should combine:

* AI-generated storytelling.
* Logical reasoning.
* Evidence exploration.
* Interactive gameplay.
* Consistent mystery construction.
* Visually appealing investigation interfaces.

## 2.2 Primary Objectives

The application must:

1. Allow users to create mysteries from natural-language prompts.
2. Generate internally consistent fictional investigations.
3. Create multiple suspects with believable motives and alibis.
4. Generate diverse evidence supporting the investigation.
5. Ensure every playable case has one predetermined culprit.
6. Include evidence that helps distinguish the culprit from innocent suspects.
7. Let players investigate evidence before making accusations.
8. Validate accusations without exposing the solution prematurely.
9. Explain the solution using the actual evidence in the case.
10. Save investigations and their progress in MongoDB.
11. Provide a responsive, polished user interface.
12. Handle Gemini failures and malformed AI responses gracefully.

## 2.3 Non-Goals for the Initial MVP

The initial version will not include:

* Real police investigations.
* Real crime reporting.
* Real WhatsApp account integration.
* Real CCTV integration.
* Real-time multiplayer investigations.
* User-generated public case marketplaces.
* Live human investigators.
* Payments or subscriptions.
* Competitive leaderboards.
* Complex AI agent teams.
* A native Android or iOS application.

These features may be considered in future versions.

---

# 3. TARGET USERS

## 3.1 Mystery Enthusiasts

Users who enjoy detective fiction and want to solve original cases.

## 3.2 Casual Players

Users who want short, entertaining investigations without needing advanced detective knowledge.

## 3.3 Creative Users

Users who want to turn their own story ideas into playable mysteries.

## 3.4 Students and Puzzle Solvers

Users who want to exercise logical reasoning, observation, and evidence analysis.

---

# 4. TECHNOLOGY STACK

The project must use the MERN stack with Google Gemini.

## 4.1 Frontend

| Technology   | Purpose                                |
| ------------ | -------------------------------------- |
| React        | Build the user interface               |
| Vite         | Frontend development and build tooling |
| React Router | Client-side navigation                 |
| JavaScript   | Primary frontend language              |
| CSS          | Styling and responsive layouts         |
| Fetch API    | Communicate with the backend           |

Use JavaScript unless an explicit project-level decision later authorizes TypeScript.

Use React functional components and hooks.

Do not introduce Redux, Zustand, or another global state-management library unless the project genuinely requires it.

React Context and local component state are sufficient for the MVP.

## 4.2 Backend

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| Node.js            | Server runtime                  |
| Express.js         | REST API                        |
| MongoDB            | Persistent data storage         |
| Mongoose           | MongoDB object modeling         |
| Gemini API         | AI generation and case analysis |
| dotenv             | Environment configuration       |
| Zod or equivalent  | Runtime schema validation       |
| Helmet             | HTTP security headers           |
| express-rate-limit | API rate limiting               |

The backend must own all AI interactions and sensitive game logic.

## 4.3 AI Integration

Use the official Google Gen AI SDK for JavaScript on the backend.

The SDK must be installed and used according to its current official documentation.

Official documentation:

* Gemini API: https://ai.google.dev/gemini-api/docs
* Google Gen AI SDK: https://github.com/googleapis/js-genai
* MongoDB: https://www.mongodb.com/docs/
* Mongoose: https://mongoosejs.com/docs/
* Express: https://expressjs.com/
* React: https://react.dev/

Do not hardcode an outdated Gemini model name throughout the codebase.

Configure the selected model using an environment variable so the model can be changed without modifying application logic.

## 4.4 Development Tools

Recommended:

* Git for version control.
* npm for package management.
* Postman or an equivalent tool for API testing.
* ESLint for code quality.
* Vitest or Jest for automated tests.
* Supertest for backend API tests.

Codex should inspect the existing repository before installing dependencies or replacing configuration files.

If a repository already exists, preserve working configuration and functionality wherever possible.

---

# 5. APPLICATION STRUCTURE

The application will contain the following main areas.

## 5.1 Landing Page

Route: `/`

Purpose: Introduce AI Mystery Room and allow users to begin an investigation.

Required sections:

1. Navigation bar.
2. Hero section.
3. Product explanation.
4. How it works.
5. Mystery category previews.
6. Example evidence cards.
7. Primary call-to-action.
8. Footer.

Primary CTA:

**Create Your Mystery**

Secondary CTA:

**Explore a Mystery**

The landing page must communicate the product's purpose immediately.

## 5.2 Mystery Creation Page

Route: `/create`

Purpose: Collect the user's mystery idea and preferences.

Required fields:

* Mystery title: optional.
* Scenario description: required.
* Mystery genre: required.
* Difficulty: required.
* Number of suspects: configurable.
* Investigation length: configurable.

### Scenario Description

The user must be able to describe an idea in natural language.

Example:

"A famous painting disappeared from a hotel during a business conference. Four employees had access to the gallery."

Validation:

* Required.
* Trim leading and trailing whitespace.
* Minimum 20 characters.
* Maximum 2,000 characters.
* Reject empty or whitespace-only submissions.

### Mystery Genres

Initial supported genres:

* Theft.
* Missing object.
* Disappearance.
* Murder mystery.
* Corporate espionage.
* General detective mystery.

Murder mysteries must remain fictional and non-graphic.

### Difficulty

Support three levels:

**Easy**

* Three suspects by default.
* Relatively straightforward clues.
* Clear contradictions.
* Short investigation.

**Medium**

* Four suspects by default.
* Multiple evidence types.
* Some indirect clues.
* More complicated alibis.

**Hard**

* Five suspects by default.
* Multiple connected clues.
* Subtle contradictions.
* More extensive timelines.
* Greater reasoning complexity.

The number of suspects must remain configurable within the supported range.

### Number of Suspects

Allowed range: 3–6.

### Investigation Length

Options:

* Short.
* Standard.
* Extended.

Suggested defaults:

| Setting            |     Short |   Standard |   Extended |
| ------------------ | --------: | ---------: | ---------: |
| Suspects           |         3 |          4 |          5 |
| Evidence items     |         6 |         10 |         14 |
| Suggested playtime | 5 minutes | 10 minutes | 20 minutes |

These are product defaults, not strict AI output guarantees. The backend must validate the actual case before making it playable.

### Create Mystery Button

When clicked:

1. Validate the form.
2. Disable repeated submissions.
3. Send the configuration to the backend.
4. Display generation progress.
5. Wait for the backend to complete generation and validation.
6. Navigate to the investigation when the case is ready.
7. Display an actionable error if generation fails.

Do not generate the entire case directly in the browser.

## 5.3 Investigation Page

Route:

`/mystery/:mysteryId`

This is the main gameplay interface.

It must contain:

### A. Case Header

Display:

* Case title.
* Short case description.
* Genre.
* Difficulty.
* Number of suspects.
* Investigation status.

Do not display the culprit.

### B. Case Briefing

Display the initial incident and the information available to the investigator.

The briefing must not reveal hidden solution details.

### C. Suspect Board

Display suspect cards containing:

* Fictional profile image or avatar.
* Name.
* Age, where appropriate.
* Occupation.
* Relationship to the incident.
* Publicly available motive.
* Alibi summary.
* Evidence references.

Clicking a suspect opens the detailed suspect view.

Suspect views must not contain the culprit identity or other secret solution data.

### D. Evidence Room

Display evidence as interactive cards.

Supported evidence categories:

1. Messages.
2. Images.
3. CCTV recordings.
4. Documents.
5. Witness statements.
6. Physical evidence.
7. Timeline events.

Each evidence card should show:

* Evidence title.
* Evidence type.
* Short description.
* Relevant timestamp, when applicable.
* Source.
* Investigation relevance indicator, if appropriate.

The relevance indicator must not reveal whether the evidence proves guilt.

Clicking an evidence card opens its detailed viewer.

### E. Timeline

Display the known sequence of events.

The timeline must distinguish between:

* Confirmed events.
* Events reported by witnesses.
* Events inferred from evidence.

The interface must not present an unverified witness statement as a confirmed fact.

### F. Investigation Notes

Allow the player to record personal observations.

Users must be able to:

* Add a note.
* Edit a note.
* Delete a note.

Notes must be saved to the player's investigation progress.

The player must not be able to change the underlying generated evidence by editing notes.

### G. Accusation Panel

Allow the player to select one suspect and submit a final accusation.

Required elements:

* Suspect selection.
* Optional reasoning text.
* Confirmation dialog.
* Submit accusation button.

The player must confirm before submitting.

For the MVP, an accusation is final once submitted.

After submission, the player can view the result and solution.

### H. Reveal Solution

A solution-reveal button may be provided if the product allows players to skip the investigation.

Clicking it must clearly indicate that the solution will be revealed.

The reveal action must be handled by the backend, not by reading hidden data embedded in the frontend.

## 5.4 Results Page

Route:

`/mystery/:mysteryId/result`

Display:

* The selected suspect.
* The actual culprit.
* Correct or incorrect result.
* Explanation of the solution.
* Important evidence.
* The decisive contradictions.
* A chronological reconstruction.
* Why other suspects were not responsible.
* Optional score.
* Play again or create another mystery actions.

The solution must be generated or finalized from the stored case, not invented independently after the accusation.

The result page must use the exact culprit identity stored in the case record.

## 5.5 Dashboard

Route:

`/dashboard`

Display the user's saved investigations.

Each case card should contain:

* Title.
* Genre.
* Difficulty.
* Creation date.
* Investigation status.
* Completion status.

Actions:

* Continue investigation.
* View completed result.
* Delete a case.

If authentication is implemented in the MVP, users must see only cases they are authorized to access.

A guest user must not be able to access another user's private cases by changing an ID in the URL.

## 5.6 Navigation

Required navigation:

* Home.
* Create Mystery.
* Dashboard.
* About.

The About page may be implemented as a simple informational page.

Navigation must be responsive and usable on desktop and mobile.

---

# 6. USER AUTHENTICATION AND ACCESS

## 6.1 MVP Authentication Strategy

The initial MVP should support guest investigations.

Users should be able to create and play a mystery without creating an account.

Use a securely generated guest-session identifier to associate investigations and progress.

The guest identifier must not be predictable.

The backend must not trust arbitrary user IDs supplied by the frontend.

Recommended implementation:

* Generate a cryptographically random session identifier.
* Store it in an appropriately configured secure, HTTP-only cookie.
* Use `SameSite` protection and HTTPS in production.
* Use appropriate CSRF protections where necessary.
* Associate guest investigations with the authenticated server-side session.

Guest sessions should be scoped to the intended browser session or another explicitly defined session lifetime.

Do not use a user-editable local-storage value as the sole authorization mechanism.

## 6.2 Future Authentication

Full registration and login are not required for the initial MVP.

If accounts are added later, support:

* Registration.
* Login.
* Logout.
* Password hashing.
* Account ownership.
* Secure session management.
* Account-level case history.

Do not implement authentication by storing plaintext passwords.

---

# 7. AI MYSTERY GENERATION

This is the core feature of the application.

## 7.1 Generation Pipeline

The backend must implement the following pipeline:

1. Receive the mystery configuration.
2. Validate the input.
3. Apply rate limits and generation quotas.
4. Create a generation job.
5. Generate the case blueprint using Gemini.
6. Generate suspects and their relationships.
7. Establish the culprit and solution.
8. Generate evidence items.
9. Generate the chronological event sequence.
10. Validate consistency across the case.
11. Repair invalid content when possible.
12. Generate or prepare the required media assets.
13. Validate the final public and private case representations.
14. Store the completed case in MongoDB.
15. Mark the generation job as completed.
16. Return the playable mystery identifier.

If a required validation step fails, the backend must not publish the case as playable.

## 7.2 Establish the Solution Before Evidence

**Mandatory rule: The culprit must be determined before the evidence is generated.**

The AI must not generate arbitrary evidence and then choose a culprit afterward.

The recommended order is:

1. Define the incident.
2. Create all suspects.
3. Select exactly one culprit.
4. Establish the culprit's motive and opportunity.
5. Create the complete event timeline.
6. Define the actual sequence of events.
7. Generate alibis for all suspects.
8. Generate evidence consistent with that timeline.
9. Add contradictions and misleading but explainable evidence.
10. Verify that the culprit is identifiable from the available evidence.

This order minimizes contradictions and arbitrary solutions.

## 7.3 Case Blueprint

The initial Gemini response should produce a structured case blueprint.

It should contain:

* Case title.
* Genre.
* Difficulty.
* Incident description.
* Incident location.
* Incident date and time within the fictional world.
* Suspect identities.
* Suspect relationships.
* Motives.
* Opportunities.
* Alibis.
* Actual event timeline.
* Culprit identity.
* Culprit motive.
* Explanation of the incident.
* Required evidence items.
* Key deductions.
* Alternative suspect explanations.
* Solution verification criteria.

The blueprint is private.

The application must never return the entire blueprint to the player during an active investigation.

## 7.4 Evidence Generation

Each evidence item must be grounded in the case blueprint.

For example, if a suspect claims to have left the building at 9:00 PM, the evidence must not arbitrarily place them inside the building at 9:30 PM unless the case explicitly explains the contradiction.

Evidence generation should consider:

* Time consistency.
* Location consistency.
* Character knowledge.
* Character relationships.
* Event causality.
* Suspect opportunity.
* Clue relevance.
* Contradictions.
* Alternative explanations.

The generator must distinguish between:

**Direct evidence:** Information that directly supports or contradicts a claim.

**Circumstantial evidence:** Information that supports a deduction when combined with other clues.

**Red herrings:** Misleading clues that have a plausible explanation and do not invalidate the true solution.

Red herrings must not make an innocent suspect equally or more conclusively guilty than the predetermined culprit.

## 7.5 Structured AI Output

All critical Gemini outputs must use a defined schema.

Do not rely on unstructured prose when the application expects machine-readable case data.

Use the SDK's supported structured-output or JSON-schema capabilities when available.

Regardless of Gemini's response format, validate the returned data on the server.

Validation must check:

* Required fields.
* Correct data types.
* Allowed enum values.
* Suspect count.
* Evidence count.
* Unique identifiers.
* Valid suspect references.
* Valid evidence references.
* Culprit membership in the suspect list.
* Timeline consistency.
* Valid media references.
* Solution completeness.

If the output is invalid:

1. Attempt a controlled repair.
2. Validate the repaired response.
3. Retry generation within a strict attempt limit.
4. Mark the generation as failed if validation still fails.

Do not silently convert malformed output into a playable investigation.

## 7.6 Generation Reliability

Use a bounded retry policy.

Recommended initial limit:

* One initial generation attempt.
* Up to two repair or regeneration attempts.

The exact number must be configurable.

Implement:

* Request timeouts.
* Error classification.
* Structured logs.
* Generation status tracking.
* Failure recovery.
* Protection against duplicate generation jobs.

The application must not expose API keys, internal prompts, private solution objects, or provider error details to the browser.

---

# 8. GEMINI PROMPT DESIGN

Prompts must be stored in a dedicated backend module.

Suggested structure:

`server/src/modules/ai/prompts/`

Separate prompts should be used for:

* Case blueprint generation.
* Evidence generation.
* Consistency checking.
* Case repair.
* Solution explanation.
* Optional media descriptions.

Avoid placing long prompts directly inside Express route handlers.

## 8.1 Master Case Generation Instructions

The following requirements must be encoded into the appropriate Gemini prompts:

> You are the mystery-design engine for a fictional detective investigation game.
>
> Transform the supplied scenario into a coherent, playable mystery.
>
> Create the requested number of suspects and establish exactly one culprit before generating evidence.
>
> Every suspect must have a distinct identity, personality, relationship to the incident, and plausible account of their activities.
>
> Construct a consistent chronological timeline of the actual events.
>
> Generate evidence that follows the established timeline and the characters' knowledge.
>
> Include a sufficient number of clues to support a logical deduction of the culprit.
>
> Include contradictions, circumstantial clues, and plausible red herrings where appropriate.
>
> Red herrings must have a coherent explanation. They must not create a second equally valid solution.
>
> Ensure that at least two independent clues support the intended deduction, and that at least one clue or combination of clues helps distinguish the culprit from the strongest alternative suspect.
>
> Every evidence item must have a source, a description, a timestamp when applicable, and a relationship to the case.
>
> Do not introduce facts that contradict established events.
>
> Generate fictional messages, photographs, documents, and simulated CCTV evidence where required.
>
> Treat all generated people, events, conversations, and media as fictional.
>
> Do not claim that generated evidence is authentic real-world evidence.
>
> Return data matching the required schema exactly.
>
> Keep the culprit identity and solution details in the private case blueprint. Never place the answer in player-facing case descriptions, public suspect profiles, public evidence descriptions, or public timelines.
>
> The final mystery must be solvable from the evidence made available to the player.

This prompt is a baseline. The actual implementation must use separate prompts for different generation stages.

## 8.2 Consistency Checker

A separate validation prompt may be used to identify semantic inconsistencies.

It should examine:

* Timeline conflicts.
* Contradictory alibis.
* Evidence that contradicts the established truth.
* Missing decisive clues.
* Unsupported accusations.
* Ambiguous solutions.
* Suspects whose knowledge is impossible.
* Red herrings that undermine the intended solution.

However, an AI consistency check must not replace deterministic validation.

The backend must independently validate identifiers, references, field constraints, and other mechanically verifiable rules.

## 8.3 Solution Explanation

The solution explanation must be based on the stored case.

The AI may generate a readable explanation, but the backend must ensure that:

* The selected culprit matches the stored culprit.
* Every referenced evidence item exists.
* Every referenced suspect exists.
* The explanation does not contradict the actual timeline.
* The explanation does not introduce unsupported evidence.

A failed explanation-generation request must not change the correct answer.

The system should be able to display a deterministic fallback explanation derived from the case data.

---

# 9. AI-GENERATED MEDIA

The investigation must support different forms of fictional evidence.

However, text generation, image generation, and video generation are different capabilities and must not be treated as interchangeable.

## 9.1 WhatsApp-Style Messages

Generate fictional conversations between characters.

Each conversation should include:

* Conversation ID.
* Participants.
* Message text.
* Timestamp.
* Sender.
* Optional attachment.
* Optional relationship to a clue.

Example:

**Conversation: Security Guard and Assistant**

Security Guard — 8:42 PM
"Did you lock the gallery entrance?"

Assistant — 8:44 PM
"Yes, I checked it before leaving."

Assistant — 9:03 PM
"Why is the alarm showing as offline?"

The example is illustrative only.

The actual conversation must be generated from the case timeline.

The interface may resemble a familiar messaging application, but it must be clearly identified as fictional in-game evidence.

Do not connect to real WhatsApp accounts or send actual messages.

## 9.2 Image Evidence

Examples:

* Scene photographs.
* Suspect photographs.
* Photographs of objects.
* Photographs containing hidden clues.
* Fictional security-camera still frames.

Each image must have:

* Asset ID.
* Evidence ID.
* Storage reference.
* MIME type.
* Description.
* Associated timestamp when applicable.
* Optional clue metadata.

### Image Generation Architecture

Use a separate media-generation abstraction.

Do not assume that every Gemini text-generation model can generate images.

The backend must use an explicitly configured image-generation provider that supports the requested operation.

If image generation is unavailable, do not present unrelated stock photographs as AI-generated evidence.

Provide an appropriate fallback using generated fictional illustrations or text-based evidence, and indicate the asset's actual format.

## 9.3 CCTV Evidence

CCTV evidence must behave like a fictional investigation artifact.

The MVP must support:

* Camera identifier.
* Recording date.
* Start and end times.
* Recording description.
* Timeline events.
* Timestamped frames.
* Optional generated transcript.
* Playback controls.

For the initial MVP, implement simulated CCTV recordings using a sequence of AI-generated frames and a timeline-based player.

The player may advance through frames to create a basic recording-like experience.

This is a simulated reconstruction, not an authentic recording.

If an actual AI video-generation provider is integrated later, it may supply playable video files through the same media abstraction.

Do not claim that a simulated slideshow is a real video recording.

## 9.4 Asset Storage

Do not store large binary image or video files directly inside ordinary MongoDB case documents.

Store media in a suitable object-storage service when configured.

MongoDB should store asset metadata and storage references.

Recommended abstraction:

`MediaProvider`

Responsibilities:

* Generate image assets.
* Generate or assemble simulated CCTV assets.
* Upload or persist media.
* Return asset metadata.
* Validate asset types.
* Handle provider failures.

The application must remain usable when optional media generation fails.

Required textual evidence must still be available if the case can be completed without the failed optional asset.

---

# 10. DATA MODEL

Use MongoDB with Mongoose.

The following schemas define the required logical data model. Codex may refine implementation details without changing the product behavior or exposing private data.

## 10.1 Mystery Schema

Collection: `mysteries`

Fields:

| Field                | Type     | Purpose                            |
| -------------------- | -------- | ---------------------------------- |
| `_id`                | ObjectId | Unique mystery ID                  |
| `ownerSessionId`     | String   | Server-validated owner/session     |
| `title`              | String   | Mystery title                      |
| `scenario`           | String   | Original user scenario             |
| `genre`              | String   | Mystery genre                      |
| `difficulty`         | String   | easy, medium, hard                 |
| `status`             | String   | generation and play status         |
| `publicCase`         | Object   | Player-visible case data           |
| `solution`           | Object   | Private answer and explanation     |
| `blueprint`          | Object   | Private canonical case data        |
| `evidence`           | Array    | Evidence records or references     |
| `suspects`           | Array    | Suspect records                    |
| `timeline`           | Array    | Event records                      |
| `mediaAssets`        | Array    | Media metadata references          |
| `generationMetadata` | Object   | Provider/model/version information |
| `createdAt`          | Date     | Creation timestamp                 |
| `updatedAt`          | Date     | Last update                        |

Allowed mystery statuses:

* `generating`
* `validating`
* `ready`
* `failed`
* `archived`

A mystery is playable only when its status is `ready`.

The application must not return `blueprint` or `solution` as part of the public case response.

Prefer separate database subdocuments or clearly separated service-layer representations for private and public information.

Do not rely solely on frontend filtering to hide secrets.

## 10.2 Suspect Schema

Each suspect should contain:

| Field                    | Type        | Purpose                      |
| ------------------------ | ----------- | ---------------------------- |
| `id`                     | String      | Unique case-local suspect ID |
| `name`                   | String      | Fictional name               |
| `age`                    | Integer     | Optional fictional age from 5 to 110, inclusive; minors are allowed when appropriate to the scenario |
| `occupation`             | String      | Occupation                   |
| `profileImageAssetId`    | String/null | Optional portrait            |
| `relationshipToIncident` | String      | Public relationship          |
| `publicDescription`      | String      | Player-visible profile       |
| `publicMotive`           | String      | Publicly discoverable motive |
| `publicAlibi`            | String      | Suspect's stated alibi       |
| `privateMotive`          | String      | Actual motive                |
| `privateKnowledge`       | Array       | What the suspect knows       |
| `isCulprit`              | Boolean     | Private truth value          |

**Security rule:** The `isCulprit` field must never appear in public API responses.

When an age is provided, it must be an integer from 5 through 110, inclusive. Ages are optional; use `null` or omit the field when the age is not established. Do not invent an age. Mystery scenarios involving school students may use age-appropriate minor suspects.

Only the backend's trusted game logic may access it.

## 10.3 Evidence Schema

Each evidence item should contain:

| Field                   | Type             | Purpose                                 |
| ----------------------- | ---------------- | --------------------------------------- |
| `id`                    | String           | Unique case-local evidence ID           |
| `title`                 | String           | Evidence title                          |
| `type`                  | String           | Evidence category                       |
| `description`           | String           | Player-visible description              |
| `source`                | String           | Origin of evidence                      |
| `timestamp`             | Date/String/null | Relevant fictional time                 |
| `assetId`               | String/null      | Associated media                        |
| `relatedSuspectIds`     | Array            | Related suspects                        |
| `relatedEvidenceIds`    | Array            | Connected clues                         |
| `visibility`            | String           | Discovery/access rules                  |
| `privateInterpretation` | String           | Intended meaning                        |
| `clueRole`              | String           | Core clue, supporting clue, red herring |
| `createdAt`             | Date             | Creation time                           |

Private fields such as `privateInterpretation` and internal clue classifications must not be exposed through the ordinary player-facing API unless explicitly needed by an authorized result view.

## 10.4 Timeline Schema

Each event should contain:

* `id`
* `timestamp`
* `eventDescription`
* `location`
* `involvedSuspectIds`
* `sourceEvidenceIds`
* `confidence`
* `visibility`

The actual event timeline must be stored privately.

The player-facing timeline must contain only information that has been intentionally made discoverable.

## 10.5 Solution Schema

The solution object must contain:

* `culpritSuspectId`
* `motive`
* `method`
* `opportunity`
* `actualTimeline`
* `decisiveEvidenceIds`
* `supportingEvidenceIds`
* `redHerringExplanations`
* `innocentSuspectExplanations`
* `solutionSummary`

All solution fields are private until the result or reveal endpoint authorizes disclosure.

## 10.6 Investigation Progress Schema

Collection: `investigationProgress`

Fields:

* `_id`
* `mysteryId`
* `ownerSessionId`
* `viewedEvidenceIds`
* `notes`
* `selectedSuspectId`
* `status`
* `startedAt`
* `completedAt`
* `createdAt`
* `updatedAt`

Allowed progress statuses:

* `in_progress`
* `completed`
* `abandoned`

A progress record must belong to the current authorized session.

## 10.7 Accusation Schema

Collection: `accusations`

Fields:

* `_id`
* `mysteryId`
* `progressId`
* `ownerSessionId`
* `selectedSuspectId`
* `reasoning`
* `isCorrect`
* `submittedAt`

Only one final accusation is permitted per investigation attempt in the MVP.

The server must calculate `isCorrect` by comparing the submitted suspect ID with the stored culprit ID.

Never accept the correctness value from the client.

## 10.8 Media Asset Schema

Fields:

* `_id`
* `mysteryId`
* `assetType`
* `provider`
* `storageKey`
* `mimeType`
* `sizeBytes`
* `metadata`
* `status`
* `createdAt`

Allowed asset types:

* `image`
* `video`
* `cctv_frame`
* `audio`
* `document`

Only implement the asset types actually required by the current MVP.

---

# 11. REST API SPECIFICATION

All backend endpoints must use the `/api/v1` prefix.

Return JSON responses.

Use consistent error formats and appropriate HTTP status codes.

## 11.1 Create Mystery

`POST /api/v1/mysteries`

Request:

```json
{
  "scenario": "A diamond disappeared from a mansion during a party.",
  "genre": "theft",
  "difficulty": "medium",
  "suspectCount": 4,
  "investigationLength": "standard"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "mysteryId": "example-mystery-id",
    "status": "generating"
  }
}
```

The actual ID must be generated by the backend.

If the implementation performs generation synchronously, it may return the completed mystery instead.

For the recommended asynchronous implementation, return a job identifier or mystery identifier and let the client poll for completion.

## 11.2 Get Generation Status

`GET /api/v1/mysteries/:id/status`

Response:

```json
{
  "success": true,
  "data": {
    "mysteryId": "example-mystery-id",
    "status": "validating",
    "progress": 75
  }
}
```

The progress percentage is an estimate for the UI, not a guarantee of exact remaining time.

## 11.3 Get Public Mystery

`GET /api/v1/mysteries/:id`

Return:

* Public case description.
* Public suspects.
* Public evidence.
* Public timeline.
* Available media metadata.
* Current investigation status.

Never return:

* Culprit identity.
* Private solution.
* Private blueprint.
* Hidden motive.
* Internal clue interpretation.
* Generation prompts.
* API credentials.

The backend must construct an explicit public response rather than serializing the entire MongoDB document.

## 11.4 Get Suspect Details

`GET /api/v1/mysteries/:id/suspects/:suspectId`

Return the selected suspect's public profile.

Validate both IDs.

Do not expose private fields.

## 11.5 Get Evidence Details

`GET /api/v1/mysteries/:id/evidence/:evidenceId`

Return the player-visible evidence record and authorized media references.

Do not return private clue interpretations.

## 11.6 Update Investigation Progress

`PATCH /api/v1/mysteries/:id/progress`

Request:

```json
{
  "viewedEvidenceId": "evidence-001"
}
```

The backend must verify that the evidence belongs to the requested mystery.

It must also verify ownership and update the correct progress record.

Support separate operations for adding, editing, and deleting investigation notes.

## 11.7 Submit Accusation

`POST /api/v1/mysteries/:id/accusations`

Request:

```json
{
  "suspectId": "suspect-003",
  "reasoning": "The timeline contradicts the suspect's alibi."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accusationId": "example-accusation-id",
    "isCorrect": false,
    "resultUrl": "/mystery/example-mystery-id/result"
  }
}
```

The response above is illustrative.

The backend must compute correctness using the canonical stored solution.

The result endpoint may reveal the culprit after a final accusation.

The application must reject:

* Unknown suspects.
* Suspects from another case.
* Repeated final submissions.
* Submissions for cases that are not ready.
* Submissions from unauthorized sessions.

## 11.8 Reveal Solution

`POST /api/v1/mysteries/:id/reveal`

This endpoint must:

1. Verify session ownership.
2. Verify that the mystery is ready.
3. Record the reveal action.
4. Return the authorized solution.
5. Mark the investigation as revealed or completed.

Do not expose the solution through an ordinary GET request before the player chooses to reveal it.

## 11.9 Get Result

`GET /api/v1/mysteries/:id/result`

This endpoint must authorize solution access.

The result must be available only after:

* A valid final accusation, or
* An explicitly authorized solution reveal.

The backend must not trust a frontend flag indicating that the game has ended.

## 11.10 Dashboard

`GET /api/v1/mysteries`

Return only the current session's authorized cases.

Support pagination if needed.

## 11.11 Delete Mystery

`DELETE /api/v1/mysteries/:id`

Delete or archive the mystery according to the implemented retention policy.

Verify ownership.

Ensure associated progress and media references are handled consistently.

---

# 12. STANDARD API RESPONSE FORMAT

Successful responses should follow this pattern:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

Failed responses should follow this pattern:

```json
{
  "success": false,
  "error": {
    "code": "MYSTERY_NOT_FOUND",
    "message": "The requested mystery could not be found."
  }
}
```

Use stable machine-readable error codes.

Suggested error codes:

* `VALIDATION_ERROR`
* `MYSTERY_NOT_FOUND`
* `MYSTERY_NOT_READY`
* `GENERATION_FAILED`
* `AI_PROVIDER_ERROR`
* `INVALID_EVIDENCE`
* `INVALID_SUSPECT`
* `ALREADY_SUBMITTED`
* `UNAUTHORIZED`
* `RATE_LIMIT_EXCEEDED`
* `MEDIA_UNAVAILABLE`
* `INTERNAL_SERVER_ERROR`

Do not return stack traces or sensitive internal errors in production.

---

# 13. GAME RULES

These rules are mandatory.

## 13.1 One Culprit

Every playable mystery must have exactly one culprit.

The culprit must reference an existing suspect.

## 13.2 Solvability

The investigation must provide enough evidence for a logical solution.

A player must not need access to the hidden solution to identify the culprit.

## 13.3 Evidence Consistency

Evidence must agree with the canonical event timeline unless the contradiction is intentional and explained by the mystery.

For example, a deliberately falsified alibi is acceptable if the case provides a way to discover the deception.

## 13.4 No Premature Disclosure

The culprit must not be revealed through:

* API responses.
* HTML attributes.
* React component props.
* Browser storage.
* Public timeline events.
* Image filenames.
* Media metadata.
* Frontend source constants.
* Unprotected result endpoints.

The server must control all solution disclosure.

## 13.5 Final Accusation

The MVP allows one final accusation per investigation attempt.

The player may inspect evidence and change their tentative suspect selection before submitting.

The accusation is final after confirmation.

## 13.6 Score System

Implement a simple score.

Recommended scoring:

* Correct accusation: 100 points.
* Incorrect accusation: 0 points.
* Optional reasoning bonus: 0–20 points.

For the initial MVP, the reasoning bonus should be disabled unless a reliable evaluation method is implemented.

The final score should be determined by deterministic backend logic.

Do not use an unconstrained AI judgment as the sole authority for the correctness score.

## 13.7 Replay

The player may create a new mystery based on the same scenario.

The new mystery must be a separate case with its own solution and evidence.

Do not silently modify an existing mystery after the player has started investigating it.

---

# 14. USER INTERFACE AND DESIGN SYSTEM

## 14.1 Design Direction

The website should feel like a modern detective investigation workspace.

The design should be:

* Dark.
* Atmospheric.
* Professional.
* Cinematic.
* Immersive.
* Readable.
* Responsive.

Avoid making the interface look like a generic administrative dashboard.

The mystery theme should be evident without compromising usability.

## 14.2 Color Palette

Use these initial design tokens:

| Token            | Value     | Usage                        |
| ---------------- | --------- | ---------------------------- |
| Background       | `#0B0F14` | Main background              |
| Surface          | `#121922` | Cards and panels             |
| Elevated Surface | `#1A2430` | Modals and elevated cards    |
| Primary          | `#D6A85F` | Main actions and highlights  |
| Secondary        | `#8FA7BF` | Secondary information        |
| Text Primary     | `#F4F1EA` | Main text                    |
| Text Secondary   | `#A5AFBC` | Supporting text              |
| Border           | `#2B3542` | Borders and separators       |
| Success          | `#45B881` | Correct results              |
| Error            | `#E56B6F` | Errors and incorrect results |

Use the tokens consistently.

Do not scatter unrelated hardcoded colors throughout components.

## 14.3 Typography

Use a readable sans-serif typeface for the main interface.

A restrained serif typeface may be used for case titles or narrative headings.

Typography must maintain clear hierarchy:

* Page title.
* Section title.
* Card title.
* Body text.
* Metadata.
* Captions.

Do not sacrifice readability for visual effects.

## 14.4 Components

Build reusable components such as:

* `Navbar`
* `Footer`
* `Button`
* `Input`
* `Textarea`
* `Select`
* `Modal`
* `LoadingIndicator`
* `ErrorMessage`
* `MysteryCard`
* `SuspectCard`
* `EvidenceCard`
* `EvidenceViewer`
* `MessageViewer`
* `CCTVViewer`
* `Timeline`
* `InvestigationNotes`
* `AccusationPanel`
* `ResultSummary`

Use consistent naming and avoid duplicating the same UI logic across multiple pages.

## 14.5 Responsive Behavior

The interface must work on:

* Desktop.
* Laptop.
* Tablet.
* Mobile.

On desktop, the investigation page may use a multi-column layout.

On mobile, the interface must collapse into a readable single-column layout or a compact tabbed investigation workspace.

Buttons and interactive elements must have appropriate touch targets.

## 14.6 Accessibility

Implement:

* Semantic HTML.
* Keyboard-accessible controls.
* Visible focus indicators.
* Accessible labels.
* Appropriate color contrast.
* Dialog focus management.
* Meaningful alternative text for informative images.
* Clear error messages.

Do not communicate critical information through color alone.

---

# 15. FRONTEND ARCHITECTURE

Recommended structure:

```text
client/
├── public/
│   └── assets/
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   └── router.jsx
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── mystery/
│   │   ├── evidence/
│   │   └── investigation/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CreateMysteryPage.jsx
│   │   ├── InvestigationPage.jsx
│   │   ├── ResultPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── hooks/
│   ├── services/
│   │   └── mysteryApi.js
│   ├── context/
│   ├── utils/
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   └── components/
│   └── main.jsx
├── package.json
└── vite.config.js
```

This is the recommended organization, not a requirement to create empty folders.

Create files when they have a defined responsibility.

## 15.1 Frontend Responsibilities

The frontend is responsible for:

* Rendering pages.
* Collecting input.
* Displaying progress.
* Fetching public case data.
* Displaying evidence.
* Managing temporary UI state.
* Saving notes through API calls.
* Submitting accusations.
* Displaying authorized results.

The frontend must not:

* Store Gemini API keys.
* Generate the canonical culprit.
* Determine accusation correctness.
* Expose private solution objects.
* Bypass server-side authorization.

---

# 16. BACKEND ARCHITECTURE

Recommended structure:

```text
server/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── env.js
│   │   └── database.js
│   ├── routes/
│   │   ├── mystery.routes.js
│   │   ├── evidence.routes.js
│   │   └── progress.routes.js
│   ├── controllers/
│   ├── services/
│   │   ├── mystery.service.js
│   │   ├── investigation.service.js
│   │   ├── accusation.service.js
│   │   └── result.service.js
│   ├── modules/
│   │   ├── ai/
│   │   │   ├── gemini.provider.js
│   │   │   ├── prompts/
│   │   │   ├── schemas/
│   │   │   └── ai.service.js
│   │   ├── media/
│   │   │   ├── media.provider.js
│   │   │   └── media.service.js
│   │   └── validation/
│   ├── models/
│   │   ├── Mystery.js
│   │   ├── InvestigationProgress.js
│   │   ├── Accusation.js
│   │   └── MediaAsset.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── session.js
│   └── utils/
├── tests/
├── package.json
└── .env.example
```

The structure may be adjusted to suit a small MVP.

Do not introduce unnecessary abstractions merely to fill out the folder tree.

## 16.1 Separation of Responsibilities

**Routes:** Define endpoint paths and middleware.

**Controllers:** Handle HTTP requests and responses.

**Services:** Implement business rules and coordinate application workflows.

**AI module:** Communicate with Gemini, manage prompts, and validate AI output.

**Media module:** Generate or assemble fictional evidence assets.

**Models:** Define MongoDB data structures.

**Middleware:** Handle authentication, validation, rate limits, and errors.

Business logic must not be duplicated across controllers.

---

# 17. ENVIRONMENT CONFIGURATION

Create `server/.env.example`.

Suggested variables:

```dotenv
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room

GEMINI_API_KEY=
GEMINI_MODEL=

CLIENT_ORIGIN=http://localhost:5173

SESSION_SECRET=

MEDIA_PROVIDER=simulated
MEDIA_STORAGE_BUCKET=
```

The selected Gemini model must be configured using a supported model identifier.

Any additional media provider credentials must remain on the server.

Do not commit `.env` files containing real credentials.

The frontend must never receive the Gemini API key.

Validate required environment variables when the backend starts.

If MongoDB or a mandatory service is unavailable, the backend should fail clearly rather than silently operating in an inconsistent state.

---

# 18. SECURITY REQUIREMENTS

Security is mandatory even for an early prototype.

## 18.1 API Key Protection

The Gemini API key must be stored in backend environment variables.

Never place it in:

* React source code.
* Frontend environment variables exposed to the browser.
* HTML.
* Public API responses.
* Git repositories.

## 18.2 Session Security

Use cryptographically secure session identifiers.

Configure cookies appropriately for development and production.

Protect sensitive state-changing operations against unauthorized cross-site requests.

## 18.3 Authorization

Every operation involving a mystery must verify that the current session is allowed to access that mystery.

Never assume that possession of a MongoDB ID grants permission.

## 18.4 Input Validation

Validate:

* Scenario text.
* Genre.
* Difficulty.
* Suspect count.
* Mystery ID.
* Suspect ID.
* Evidence ID.
* Notes.
* Accusation reasoning.
* Pagination parameters.

Reject invalid requests before calling Gemini.

## 18.5 Prompt Injection

Treat the user-provided scenario as untrusted content.

The scenario may contain instructions attempting to override the game's rules.

The AI must interpret the input as story material, not as instructions to disclose system prompts, credentials, hidden solutions, or internal data.

The backend must enforce the schema and game rules independently of the model's response.

## 18.6 AI Cost Protection

Implement:

* Rate limiting.
* Maximum scenario length.
* Maximum suspect count.
* Maximum evidence count.
* Bounded generation retries.
* Request timeouts.
* Per-session generation quotas.
* Duplicate-request protection.

Do not allow unlimited regeneration requests.

## 18.7 Media Security

Validate media MIME types and file sizes.

Do not allow arbitrary file paths from user input.

Use authorized asset URLs or signed URLs when required.

Do not expose private storage credentials.

---

# 19. PERFORMANCE AND RELIABILITY

## 19.1 Generation Performance

AI generation may take longer than a normal API request.

The preferred architecture is an asynchronous generation workflow.

Suggested flow:

1. Create a mystery record.
2. Set status to `generating`.
3. Start the generation workflow.
4. Return the mystery ID.
5. Let the frontend poll the status endpoint.
6. Display progress messages.
7. Redirect when status becomes `ready`.

For the MVP, a MongoDB-backed job workflow is acceptable.

Do not add Redis, BullMQ, or a distributed worker system unless the implementation requires it.

If a worker queue is introduced, document its operational requirements.

## 19.2 Retry Safety

Repeated requests must not create uncontrolled duplicate mysteries.

Use idempotency or another duplicate-submission protection strategy where appropriate.

## 19.3 Database Indexes

Create indexes for frequently queried fields.

Recommended candidates:

* Mystery owner/session and creation date.
* Investigation progress owner/session and mystery ID.
* Accusation mystery ID and progress ID.
* Generation status and creation time if used for worker recovery.

Choose compound indexes based on the actual query patterns.

## 19.4 Error Handling

Provide friendly user-facing messages for:

* AI provider unavailable.
* Generation timeout.
* Invalid generated case.
* Missing evidence asset.
* Missing mystery.
* Unauthorized access.
* Database connection failure.

Do not display raw internal errors to the user.

---

# 20. TESTING REQUIREMENTS

## 20.1 Unit Tests

Test:

* Input validation.
* AI response validation.
* Culprit reference validation.
* Evidence reference validation.
* Timeline consistency rules.
* Accusation scoring.
* Result authorization.
* Public/private data separation.

## 20.2 API Tests

Test:

* Mystery creation.
* Generation status.
* Public mystery retrieval.
* Evidence retrieval.
* Progress updates.
* Note management.
* Accusation submission.
* Solution reveal.
* Result retrieval.
* Mystery deletion.
* Session ownership.

## 20.3 AI Integration Tests

Test representative Gemini responses for:

* Valid case generation.
* Malformed structured output.
* Missing culprit.
* Multiple culprits.
* Invalid suspect references.
* Contradictory timestamps.
* Missing decisive clues.
* Provider errors.
* Retry exhaustion.

Use mocked Gemini responses in routine automated tests to reduce cost and avoid flaky tests.

Run separate integration tests against the actual provider when appropriate.

## 20.4 Frontend Tests

Test:

* Form validation.
* Loading states.
* Generation failure.
* Suspect selection.
* Evidence viewing.
* Note editing.
* Accusation confirmation.
* Correct result rendering.
* Incorrect result rendering.
* Mobile navigation.

## 20.5 End-to-End Acceptance Test

The complete application must support this flow:

1. A user opens the landing page.
2. The user creates a mystery.
3. The application generates a case.
4. The user opens the investigation.
5. The user inspects suspects.
6. The user opens evidence.
7. The user reviews the timeline.
8. The user saves notes.
9. The user selects a suspect.
10. The user submits an accusation.
11. The server validates the answer.
12. The result page displays the outcome.
13. The player can review the solution.
14. The user can return to the dashboard.

This workflow must function without manually editing MongoDB documents.

---

# 21. IMPLEMENTATION PHASES

Codex must implement the application in small, verifiable phases.

## Phase 1: Repository Inspection and Foundation

Tasks:

* Inspect the existing repository.
* Identify existing working code.
* Confirm Node.js and npm availability.
* Configure the frontend.
* Configure the backend.
* Configure MongoDB.
* Add environment-variable validation.
* Add a health endpoint.
* Configure development scripts.
* Add the initial application layout.

Acceptance criteria:

* Frontend starts successfully.
* Backend starts successfully.
* MongoDB connects.
* Environment configuration works.
* Health endpoint responds correctly.

Do not replace existing working code without a clear reason.

## Phase 2: UI Foundation

Tasks:

* Implement the navigation.
* Implement the landing page.
* Establish the design tokens.
* Implement reusable components.
* Implement the mystery creation form.
* Add responsive styling.
* Add loading and error states.

Acceptance criteria:

* All primary pages render.
* Form validation works.
* Navigation works.
* The interface works on desktop and mobile.
* No major page depends on hardcoded mystery data in production code.

Temporary mock data may be used during development, but it must be clearly isolated and replaced before completing integration.

## Phase 3: Gemini Integration

Tasks:

* Configure the official SDK.
* Implement the AI provider.
* Create structured prompts.
* Define response schemas.
* Generate the case blueprint.
* Generate suspects.
* Generate evidence.
* Generate the actual timeline.
* Implement consistency checks.
* Implement repair and retry logic.

Acceptance criteria:

* Valid scenarios can generate structured cases.
* Invalid responses are rejected or repaired.
* Exactly one culprit is established.
* Every evidence reference points to valid case data.
* Private solution fields remain inaccessible through public endpoints.

## Phase 4: Persistence and APIs

Tasks:

* Implement Mongoose models.
* Implement mystery creation.
* Implement generation status.
* Persist completed cases.
* Implement public case retrieval.
* Implement evidence retrieval.
* Implement session-based ownership.
* Implement progress persistence.
* Implement API error handling.

Acceptance criteria:

* Generated cases persist in MongoDB.
* Cases can be retrieved after page refresh.
* Session ownership is enforced.
* Failed generation jobs are not playable.
* Public endpoints do not leak private fields.

## Phase 5: Investigation Gameplay

Tasks:

* Implement the investigation page.
* Implement suspect cards.
* Implement evidence cards.
* Implement message viewer.
* Implement image viewer.
* Implement simulated CCTV viewer.
* Implement timeline.
* Implement notes.
* Implement evidence discovery tracking.

Acceptance criteria:

* All generated evidence can be inspected.
* Evidence references resolve correctly.
* Notes persist.
* The timeline is readable.
* The culprit remains hidden.

## Phase 6: Accusation and Results

Tasks:

* Implement suspect selection.
* Implement accusation confirmation.
* Implement final submission.
* Implement backend answer validation.
* Implement result persistence.
* Implement solution reveal.
* Implement the results page.
* Implement solution explanations.

Acceptance criteria:

* Correct accusations are marked correct.
* Incorrect accusations are marked incorrect.
* The client cannot manipulate correctness.
* Repeated final submissions are rejected.
* The result explanation references actual case evidence.
* The solution is inaccessible before an authorized reveal.

## Phase 7: Media and Polish

Tasks:

* Implement the media-provider abstraction.
* Generate or prepare fictional images.
* Assemble simulated CCTV recordings.
* Add media-loading states.
* Add media-failure fallbacks.
* Improve responsive layouts.
* Improve accessibility.
* Refine visual feedback.

Acceptance criteria:

* Available media renders correctly.
* Failed optional media does not corrupt a case.
* Simulated CCTV is clearly represented as simulated evidence.
* The application remains usable on mobile.

## Phase 8: Testing and Delivery

Tasks:

* Run unit tests.
* Run API tests.
* Run frontend tests.
* Run the end-to-end acceptance flow.
* Check security boundaries.
* Check environment configuration.
* Fix major defects.
* Document setup and deployment.

Acceptance criteria:

* The MVP works from beginning to end.
* No critical secrets are exposed.
* No major data-leak vulnerabilities remain.
* The setup instructions work on a fresh development environment.
* The repository is ready for further development.

---

# 22. REQUIRED PROJECT DOCUMENTATION

Codex must maintain the following files.

## 22.1 `SPEC.md`

This document is the canonical product and technical specification.

All implementation decisions must be consistent with it.

## 22.2 `README.md`

Must include:

* Project description.
* Features.
* Technology stack.
* Prerequisites.
* Installation instructions.
* Environment setup.
* Frontend startup.
* Backend startup.
* Database setup.
* Testing instructions.
* Troubleshooting.

## 22.3 `.env.example`

Must list all required environment variables without real credentials.

## 22.4 `ARCHITECTURE.md`

Must describe:

* Frontend architecture.
* Backend architecture.
* AI generation workflow.
* Database model.
* Public/private data boundaries.
* Media generation.
* Request lifecycle.

## 22.5 `API.md`

Must document:

* API endpoints.
* Request bodies.
* Response bodies.
* Error codes.
* Authentication and authorization requirements.

## 22.6 `DECISIONS.md`

Record significant implementation decisions.

Each entry should explain:

* The decision.
* The reason.
* The alternatives considered.
* Whether the decision changes this specification.

Do not silently change a mandatory product requirement.

---

# 23. CODING RULES FOR CODEX

These rules apply to all implementation work.

## 23.1 General Rules

1. Read `SPEC.md` before implementing a feature.
2. Inspect the repository before changing files.
3. Build the project incrementally.
4. Prefer readable, maintainable code.
5. Use reusable components when they provide genuine value.
6. Keep frontend and backend responsibilities separate.
7. Validate all untrusted input.
8. Handle asynchronous operations explicitly.
9. Avoid unnecessary dependencies.
10. Never expose API keys or private case data.
11. Do not leave core features as placeholder buttons.
12. Do not mark a feature complete until it has been tested.
13. Do not silently substitute mock AI responses for actual Gemini integration.
14. Keep mock providers isolated from production providers.
15. Update documentation when an implementation decision changes.
16. Run the relevant tests after making changes.
17. Do not rewrite unrelated working code.
18. Avoid duplicate business logic.
19. Do not introduce speculative infrastructure without a demonstrated need.
20. Keep the application runnable after each major implementation phase.

## 23.2 Source-of-Truth Rule

If an implementation request conflicts with `SPEC.md`, identify the conflict.

Do not silently choose an arbitrary interpretation.

When the product owner explicitly approves a change, update `SPEC.md` before or alongside the implementation.

The updated specification becomes the source of truth.

## 23.3 Definition of Done

A feature is complete only when:

* Its behavior matches the specification.
* Its frontend is connected to the required backend API.
* Its input is validated.
* Its error states are implemented.
* Its security requirements are met.
* Relevant tests pass.
* Documentation is updated where necessary.

A visually complete screen connected only to hardcoded data is not considered a completed feature.

---

# 24. MVP ACCEPTANCE CRITERIA

The project is considered ready for its initial release when all of the following are true.

### Mystery Creation

* Users can submit a scenario.
* Genre, difficulty, suspect count, and investigation length are configurable.
* Invalid input is rejected.
* Gemini generates a structured mystery.
* Failed generation is handled gracefully.

### Mystery Quality

* Every playable case has exactly one culprit.
* Every culprit references an existing suspect.
* The case contains enough evidence to support a logical solution.
* Important timestamps and events are internally consistent.
* Red herrings do not create an equally valid alternative solution.
* The case passes server-side validation.

### Investigation

* Users can inspect suspect profiles.
* Users can view messages.
* Users can inspect images when available.
* Users can inspect simulated CCTV evidence.
* Users can view the public timeline.
* Users can create and edit notes.
* Users can submit a final accusation.

### Results

* The backend validates the accusation.
* Correct and incorrect outcomes are displayed correctly.
* The solution is revealed only when authorized.
* The explanation references actual evidence.
* The final result persists.

### Security

* The Gemini API key remains on the server.
* Public APIs do not expose the private culprit.
* Mystery ownership is verified.
* User input is validated.
* Generation is rate-limited.
* Repeated final accusations are rejected.
* Internal errors are not exposed to users.

### Reliability

* MongoDB persistence works.
* Page refreshes do not destroy saved investigations.
* AI failures are handled.
* Invalid AI output cannot create a playable case.
* Missing optional media does not prevent an otherwise valid investigation from working.

### User Experience

* The site is responsive.
* Navigation works.
* Loading states are clear.
* Error states are understandable.
* The investigation interface is usable.
* The application has no major broken interactions.

---

# 25. FINAL PRODUCT PRINCIPLES

The following principles take precedence over convenience during implementation.

**1. Consistent mysteries over random mysteries.**

A mystery must have a coherent solution and consistent evidence.

**2. Real AI integration over simulated AI integration.**

Mock data is acceptable during isolated development, but the final MVP must use the configured Gemini API for mystery generation.

**3. Server-side security over frontend secrecy.**

The browser must never receive hidden solution data before authorization.

**4. Evidence-based solutions over arbitrary answers.**

The correct culprit must be identifiable through the available evidence.

**5. Functional gameplay over decorative UI.**

Every primary interaction must work.

**6. Incremental development over uncontrolled code generation.**

Codex must implement, test, and verify one phase at a time.

**7. Simple architecture over premature complexity.**

Use the MERN stack effectively without introducing unnecessary infrastructure.

**8. Fictional evidence must remain clearly fictional.**

Generated messages, photographs, documents, and simulated CCTV must not be presented as authentic real-world evidence.

**9. This specification governs the implementation.**

Do not silently alter mandatory requirements, data boundaries, or game rules.

---

# 26. INITIAL CODEX EXECUTION INSTRUCTIONS

When beginning implementation:

1. Inspect the current repository and identify the project structure.
2. Read this specification completely.
3. Create or update `SPEC.md` with this document.
4. Create a concise implementation plan based on Section 21.
5. Identify any missing external configuration, including MongoDB and Gemini credentials.
6. Implement Phase 1.
7. Verify that Phase 1 works.
8. Continue to the next phase only after the previous phase passes its acceptance criteria.
9. Keep the README and technical documentation synchronized with the implementation.
10. At the end of each phase, report the files changed, tests executed, test results, and any remaining blockers.

Do not attempt to implement every feature in one uncontrolled code-generation step.

The objective is to produce a working, tested, maintainable application rather than merely generating a large amount of source code.

---

# END OF MASTER SPECIFICATION

**Canonical file:** `SPEC.md`
**Project:** AI Mystery Room
**Architecture:** MERN
**AI provider:** Google Gemini
**Implementation owner:** Codex
**Source-of-truth policy:** All implementation must comply with the latest approved version of this specification.
