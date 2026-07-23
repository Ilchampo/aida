# after-agent-back

> **Note:** This document was AI-generated and reviewed against the current codebase. Verify environment-specific values (URLs, secrets, hosting settings) before deploying.

REST API for the After Agent interview-prep portfolio product. It handles Google authentication, practice-role listings, interview sessions, owner results, leaderboards, and speech processing through OpenRouter.

**Base URL (local):** `http://localhost:3000/api`

---

## Tech Stack

| Layer       | Technologies                              |
| ----------- | ----------------------------------------- |
| Runtime     | Node.js 22, TypeScript                    |
| Framework   | Express 5                                 |
| Database    | MongoDB, Mongoose                         |
| Validation  | Zod                                       |
| Auth        | Google ID token + JWT (`httpOnly` cookie) |
| AI / Speech | OpenRouter SDK (chat, STT, TTS)           |
| Uploads     | Multer (in-memory audio)                  |
| Tooling     | ESLint, Prettier, tsx                     |

---

## How to Deploy

### Prerequisites

- Node.js 22+
- MongoDB instance (local or hosted)
- [OpenRouter](https://openrouter.ai/) API key

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                         | Required | Description                              |
| -------------------------------- | -------- | ---------------------------------------- |
| `PORT`                           | No       | Server port (default: `3000`)            |
| `NODE_ENV`                       | No       | `development` or `production`            |
| `CORS_WHITELIST`                 | Prod     | Comma-separated allowed frontend origins |
| `MONGO_URI`                      | Yes      | MongoDB connection string                |
| `MONGO_DB_NAME`                  | No       | Database name (default: `ainterviewer`)  |
| `OPENROUTER_API_KEY`             | Yes      | OpenRouter API key                       |
| `OPENROUTER_INTERVIEWER_MODEL`   | No       | Model for live interview turns           |
| `OPENROUTER_EVALUATION_MODEL`    | No       | Model for final evaluation               |
| `OPENROUTER_STT_MODEL`           | No       | Speech-to-text model                     |
| `OPENROUTER_TTS_MODEL`           | No       | Text-to-speech model                     |
| `OPENROUTER_TTS_VOICE`           | No       | TTS voice name                           |
| `OPENROUTER_TTS_RESPONSE_FORMAT` | No       | `mp3` or `pcm`                           |
| `JWT_SECRET`                     | Yes      | Secret for signing session tokens        |
| `JWT_EXPIRES_IN`                 | No       | Token lifetime (default: `7d`)           |
| `GOOGLE_CLIENT_ID`               | Yes      | Google OAuth client ID (GIS / ID tokens) |

### Local development

```bash
npm install
npm run dev
```

Seed practice roles (jobs). Users are created via Google sign-in only:

```bash
npm run seed
```

Build and run production locally:

```bash
npm run build
npm start
```

Health check: `GET http://localhost:3000/health`

### Docker

Build the image from this directory:

```bash
docker build -t after-agent-back .
```

Run the container (example):

```bash
docker run -p 3000:3000 --env-file .env after-agent-back
```

The image exposes port `3000` and includes a `GET /health` health check.

### Production (Northflank)

The backend is deployed as a containerized Node service on [Northflank](https://northflank.com/):

1. Connect the repository and set the build context to `after-agent-back`.
2. Use the included `Dockerfile` (multi-stage build, production `node_modules` only).
3. Set all required environment variables in the Northflank service settings.
4. Set `NODE_ENV=production` and configure `CORS_WHITELIST` with your frontend URL(s).
5. Point `MONGO_URI` at your hosted MongoDB cluster.
6. Configure the health check path to `/health` on the service port.
7. After the first deploy, run the seed script against the production database (locally or via a one-off job) to load practice roles. Set `GOOGLE_CLIENT_ID` for sign-in.

DNS for the public API is managed through Cloudflare (see the root project `README.md`).

---

## MongoDB Documents

The application uses three collections. Field names below match the Mongoose schemas (snake_case in the database). API responses convert most fields to camelCase.

### `users`

Stores Google-authenticated accounts.

| Field         | Type           | Notes                    |
| ------------- | -------------- | ------------------------ |
| `_id`         | ObjectId       | Primary key              |
| `google_sub`  | string         | Unique Google subject ID |
| `email`       | string         | Unique, lowercase        |
| `given_name`  | string         | First name from Google   |
| `picture_url` | string \| null | Profile photo URL        |
| `created_at`  | Date           | Defaults to now          |

### `jobs`

Stores job postings, question banks, and grading rubrics.

| Field                                       | Type     | Notes                                          |
| ------------------------------------------- | -------- | ---------------------------------------------- |
| `_id`                                       | ObjectId | Primary key                                    |
| `slug`                                      | string   | Unique URL-friendly identifier                 |
| `title`                                     | string   | Display title                                  |
| `role`                                      | string   | One of the `JOB_ROLES` enum values (see below) |
| `description`                               | string   | Full job description                           |
| `tags`                                      | string[] | Search/filter tags                             |
| `rubric`                                    | object[] | Grading criteria                               |
| `rubric[].skill`                            | string   | Skill name                                     |
| `rubric[].weight`                           | number   | `1`–`3`                                        |
| `rubric[].signals`                          | string[] | Evidence phrases for scoring                   |
| `question_bank`                             | object[] | Interview questions                            |
| `question_bank[].text`                      | string   | Question text                                  |
| `question_bank[].category`                  | string   | `behavioral` \| `technical`                    |
| `question_bank[].skill`                     | string   | Rubric skill this question targets             |
| `question_bank[].follow_ups`                | object[] | Conditional follow-up questions                |
| `question_bank[].follow_ups[].text`         | string   | Follow-up question                             |
| `question_bank[].follow_ups[].trigger_hint` | string   | When the AI should ask it                      |

**`JOB_ROLES` values:**

- `Intern Node Backend`
- `Intern Next.js Frontend`
- `Intern Javascript Full Stack`
- `Intern AI Researcher`
- `Trainee Product Manager`
- `Trainee Human Resources`

Index: `{ role: 1 }` (non-unique).

### `interviews`

Stores interview sessions. A user may have multiple completed attempts per practice role (up to 3), and at most one `in_progress` session at a time.

| Field                         | Type             | Notes                                       |
| ----------------------------- | ---------------- | ------------------------------------------- |
| `_id`                         | ObjectId         | Primary key                                 |
| `job_id`                      | ObjectId         | Ref → `jobs`                                |
| `candidate_id`                | ObjectId         | Ref → `users`                               |
| `status`                      | string           | `in_progress` \| `completed` \| `abandoned` |
| `started_at`                  | Date             | Session start                               |
| `ended_at`                    | Date \| null     | Set on complete or abandon                  |
| `transcript`                  | object[]         | Turn-by-turn conversation                   |
| `transcript[].idx`            | number           | Turn index                                  |
| `transcript[].speaker`        | string           | `ai` \| `candidate`                         |
| `transcript[].text`           | string           | Spoken/text content                         |
| `transcript[].started_at`     | Date             | Turn start                                  |
| `transcript[].ended_at`       | Date             | Turn end                                    |
| `transcript[].question_id`    | ObjectId \| null | Linked question from bank                   |
| `transcript[].is_follow_up`   | boolean          | Whether this was a follow-up                |
| `transcript[].client_turn_id` | string \| null   | Client idempotency key                      |
| `decision_log`                | object[]         | AI interviewer decisions per turn           |
| `idempotent_turns`            | object[]         | Cached turn responses for retries           |
| `evaluation`                  | object \| null   | Final rubric scores (set on complete)       |

**Indexes:**

- Partial unique: `{ candidate_id: 1 }` where `status: 'in_progress'`
- `{ candidate_id: 1, job_id: 1, status: 1 }`
- `{ job_id: 1, status: 1, 'evaluation.overall_score': -1 }`
- `{ candidate_id: 1, status: 1, ended_at: -1 }`
- `{ candidate_id: 1, started_at: -1 }`

---

## Creating a New Job Object

There is no public API endpoint to create jobs. Jobs are loaded through the **seed script** or inserted directly into MongoDB.

### Option 1 — Seed file (recommended)

1. Open `src/seed/data/jobs.seed.ts`.
2. Add a new entry to the `SEED_JOBS` array following the `SeedJob` interface:

```typescript
{
    slug: 'acme-react-intern',
    title: 'Intern React Developer',
    role: 'Intern Next.js Frontend',
    description: 'Full practice-role description shown to users...',
    tags: ['react', 'typescript', 'frontend', 'internship'],
    rubric: [
        {
            skill: 'React fundamentals',
            weight: 3,
            signals: [
                'explains component state vs props',
                'describes when to use useEffect',
            ],
        },
    ],
    question_bank: [
        {
            text: 'How do you decide between lifting state up and using local state?',
            category: 'technical',
            skill: 'React fundamentals',
            follow_ups: [
                {
                    text: 'What problems appear when too much state is lifted to the root?',
                    trigger_hint: 'candidate mentions lifting state but not trade-offs',
                },
            ],
        },
    ],
},
```

3. Run the seed script:

```bash
npm run seed
```

The script upserts jobs by `slug`, removes stale jobs not in the seed list, and **deletes all interviews** before re-seeding jobs. Run it only when you intend to reset interview data.

**Validation rules to respect:**

- `slug` must be unique.
- `role` must match a `JOB_ROLES` value exactly.
- `rubric[].weight` must be between `1` and `3`.
- `question_bank[].category` must be `behavioral` or `technical`.
- Each job should include enough questions and follow-ups for the interviewer engine (see existing seed entries for reference).

### Option 2 — MongoDB insert

Insert a document directly into the `jobs` collection with the same shape as above. Use snake_case field names (`question_bank`, `follow_ups`, `trigger_hint`).

---

## Endpoints

### Conventions

**Success response:**

```json
{
    "success": true,
    "data": {}
}
```

**Error response:**

```json
{
    "success": false,
    "message": "Human-readable error message"
}
```

**Authentication:** Session uses an `httpOnly` cookie named `auth_token`. Send cookies on every request (`credentials: "include"` in the browser).

**API field naming:** Auth user objects use `created_at`. Jobs and interviews use **camelCase** at the API boundary (`questionBank`, `startedAt`, `overallScore`, etc.).

---

### Health

| Method | Path      | Auth   | Description          |
| ------ | --------- | ------ | -------------------- |
| `GET`  | `/health` | Public | Service health check |

---

### Auth — `/api/auth`

| Method | Path      | Auth   | Description                                       |
| ------ | --------- | ------ | ------------------------------------------------- |
| `POST` | `/google` | Public | Google ID-token sign-in; sets `auth_token` cookie |
| `POST` | `/logout` | Public | Clears session cookie                             |
| `GET`  | `/me`     | Cookie | Current user + quota summary                      |

**`POST /google` body:** `{ "idToken": "<Google ID token>" }`. Returns `200` with public user fields.

**`GET /me` response `data`:** `{ _id, email, given_name, picture_url, created_at, quota }`.

---

### Jobs — `/api/jobs`

Read-only. Requires a valid session.

| Method | Path   | Auth   | Description                                   |
| ------ | ------ | ------ | --------------------------------------------- |
| `GET`  | `/`    | Cookie | Paginated practice-role listing               |
| `GET`  | `/:id` | Cookie | Role detail + caller practice / quota summary |

**`GET /:id` `data`:** `{ _id, title, role, tags, description, practice }` where `practice` is `{ completedAttempts, remainingAttempts, bestScore, claimed }`.

---

### Interviews — `/api/interviews`

| Method | Path                     | Auth   | Description                                   |
| ------ | ------------------------ | ------ | --------------------------------------------- |
| `POST` | `/`                      | Cookie | Start an interview (quota-enforced)           |
| `GET`  | `/me/active`             | Cookie | Resume payload for active session, or `null`  |
| `GET`  | `/me`                    | Cookie | Completed attempts for progression            |
| `GET`  | `/:interviewId`          | Cookie | Owner detail (completed or in-progress)       |
| `POST` | `/:interviewId/abandon`  | Cookie | Abandon an in-progress session                |
| `POST` | `/:interviewId/turns`    | Cookie | Submit answer audio; receive next AI question |
| `POST` | `/:interviewId/complete` | Cookie | Run evaluation and close the session          |

**Quotas on create:** max 1 `in_progress`; max 3 completed per role; max 6 distinct completed roles.

**`POST /:interviewId/turns`:** `multipart/form-data` with `audio`, `startedAt`, `endedAt`, `clientTurnId`, optional `format`.

---

### Leaderboard — `/api/leaderboard`

| Method | Path           | Auth   | Description                                   |
| ------ | -------------- | ------ | --------------------------------------------- |
| `GET`  | `/global`      | Cookie | Top 10 by average of best scores across roles |
| `GET`  | `/jobs/:jobId` | Cookie | Top 10 by best completed score for a role     |

---

### Speech — `/api/speech`

| Method | Path          | Auth   | Description                       |
| ------ | ------------- | ------ | --------------------------------- |
| `POST` | `/synthesize` | Cookie | TTS for interview bootstrap audio |

---

### Quick reference

| Method | Path                                    | Auth   |
| ------ | --------------------------------------- | ------ |
| `GET`  | `/health`                               | —      |
| `POST` | `/api/auth/google`                      | —      |
| `POST` | `/api/auth/logout`                      | —      |
| `GET`  | `/api/auth/me`                          | cookie |
| `GET`  | `/api/jobs`                             | cookie |
| `GET`  | `/api/jobs/:id`                         | cookie |
| `POST` | `/api/interviews`                       | cookie |
| `GET`  | `/api/interviews/me/active`             | cookie |
| `GET`  | `/api/interviews/me`                    | cookie |
| `GET`  | `/api/interviews/:interviewId`          | cookie |
| `POST` | `/api/interviews/:interviewId/abandon`  | cookie |
| `POST` | `/api/interviews/:interviewId/turns`    | cookie |
| `POST` | `/api/interviews/:interviewId/complete` | cookie |
| `GET`  | `/api/leaderboard/global`               | cookie |
| `GET`  | `/api/leaderboard/jobs/:jobId`          | cookie |
| `POST` | `/api/speech/synthesize`                | cookie |

---

## Scripts

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `npm run dev`    | Start dev server with hot reload           |
| `npm run build`  | Compile TypeScript to `dist/`              |
| `npm start`      | Run compiled production server             |
| `npm run seed`   | Clear users, upsert jobs, reset interviews |
| `npm run lint`   | Run ESLint                                 |
| `npm run format` | Format with Prettier                       |
