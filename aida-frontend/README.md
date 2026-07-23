# after-agent-front

> **Note:** This document was AI-generated and reviewed against the current codebase. Verify environment-specific values (URLs, secrets, hosting settings) before deploying.

Single-page application for the After Agent AI interviewer platform. Candidates browse jobs, complete voice interviews, and recruiters review transcripts and evaluations.

**Local dev URL:** `http://localhost:5173`

---

## Tech Stack

| Layer       | Technologies                              |
| ----------- | ----------------------------------------- |
| Framework   | React 19, TypeScript                      |
| Build       | Vite 8                                    |
| Routing     | React Router 7                            |
| Styling     | Tailwind CSS 4                            |
| State       | Zustand                                   |
| HTTP        | Axios (`withCredentials` for cookie auth) |
| UI / Motion | Lucide React, Framer Motion               |
| Tooling     | ESLint, Prettier                          |

---

## How to Deploy

### Prerequisites

- Node.js 22+
- Running backend API (see [`after-agent-back/README.md`](../after-agent-back/README.md))

### Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable                | Required | Description                                                         |
| ----------------------- | -------- | ------------------------------------------------------------------- |
| `VITE_API_BASE_URL`     | No       | API prefix or full URL (default: `/api`)                            |
| `VITE_GOOGLE_CLIENT_ID` | Yes      | Google OAuth Web Client ID (GIS). Never put client secrets in Vite. |

**Local development:** keep `VITE_API_BASE_URL=/api`. Vite proxies `/api` to `http://localhost:3000` (see `vite.config.ts`). Match `VITE_GOOGLE_CLIENT_ID` with the backend `GOOGLE_CLIENT_ID`.

**Production:** set `VITE_API_BASE_URL` and `VITE_GOOGLE_CLIENT_ID` at **build time**. These values are baked into the static bundle.

### Local development

Start the backend first, then:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Sign in with Google (users are created on first sign-in).

Build and preview production assets locally:

```bash
npm run build
npm run preview
```

### Docker

Build the image from this directory:

```bash
docker build -t after-agent-front .
```

Build with a custom API URL:

```bash
docker build --build-arg VITE_API_BASE_URL=https://api.example.com/api -t after-agent-front .
```

Run the container:

```bash
docker run -p 8080:8080 after-agent-front
```

The image serves the compiled SPA with **nginx** on port `8080`. The included nginx config only handles static files and client-side routing (`try_files` → `index.html`). API requests are sent directly from the browser to `VITE_API_BASE_URL`.

### Production (Northflank)

The frontend is deployed as a containerized static site on [Northflank](https://northflank.com/):

1. Connect the repository and set the build context to `after-agent-front`.
2. Use the included `Dockerfile` (Node build stage → nginx runtime).
3. Pass `VITE_API_BASE_URL` as a **build argument** pointing to the deployed backend API.
4. Expose port `8080` and map it to your public domain.
5. Ensure the backend `CORS_WHITELIST` includes this frontend origin.
6. Configure DNS through Cloudflare (see the root project `README.md`).

---

## Application Overview

### User roles

| Role        | Capabilities                                                              |
| ----------- | ------------------------------------------------------------------------- |
| `candidate` | Browse jobs, read job details, start and complete voice interviews        |
| `recruiter` | Browse jobs, view question banks and rubrics, review completed interviews |

The UI only exposes **sign-in**. User registration exists on the backend but is not wired in the frontend; demo accounts are loaded via the backend seed script.

### Routes

| Path                                   | Access        | Page            | Description                             |
| -------------------------------------- | ------------- | --------------- | --------------------------------------- |
| `/sign-in`                             | Guest         | `LoginPage`     | Sign in with username and password      |
| `/`                                    | Authenticated | `HomePage`      | Paginated job listing with title filter |
| `/jobs/:jobId`                         | Authenticated | `JobPage`       | Job detail; role-specific content       |
| `/interview/:jobId`                    | Candidate     | `RoomPage`      | Voice interview room                    |
| `/jobs/:jobId/interviews/:interviewId` | Recruiter     | `InterviewPage` | Transcript and evaluation review        |

Unauthenticated users are redirected to `/sign-in`. Wrong-role access redirects to `/`.

### Candidate flow

1. Sign in → job listing on `/`.
2. Open a job → `/jobs/:jobId` with description and **Start interview**.
3. Enter the interview room → `/interview/:jobId`.
4. Bootstrap: create session, synthesize welcome audio, request microphone access.
5. Turn-based loop: record answer → submit audio → receive AI question + TTS audio.
6. On completion: evaluate session server-side and return to the job page.

If the candidate already has an interview for that job (`applied: true`), the room shows a read-only applied state instead of starting a new session.

### Recruiter flow

1. Sign in → job listing on `/`.
2. Open a job → `/jobs/:jobId` with question bank, rubric, and interview list.
3. Open a completed interview → `/jobs/:jobId/interviews/:interviewId` with transcript and scores.

---

## Project Structure

```
src/
├── api/              # Backend API clients (auth, jobs, interviews, speech)
├── components/
│   ├── Auth/         # Route guards (Guest, Protected, Candidate, Recruiter)
│   ├── Common/       # Shared UI (header, paginator, form fields)
│   ├── Feedback/     # Loading and error panels
│   ├── Interview/    # Recruiter interview list, transcript, evaluation
│   ├── Job/          # Job cards, hero, rubric, question bank
│   ├── Layout/       # Page shell wrapper
│   └── Room/         # Interview room UI and comms log
├── hooks/            # Data fetching and interview session logic
├── lib/
│   ├── constants/    # Pagination, room, and interview constants
│   ├── interfaces/   # Shared TypeScript types (mirrors API shapes)
│   └── utils/        # API caller, speech helpers, formatting
├── pages/            # Route-level page components
├── stores/           # Zustand stores (auth)
├── App.tsx           # Router and auth bootstrap
└── main.tsx          # App entry point
```

### Path aliases

Configured in `vite.config.ts` and `tsconfig.app.json`:

| Alias         | Path             |
| ------------- | ---------------- |
| `@api`        | `src/api`        |
| `@components` | `src/components` |
| `@hooks`      | `src/hooks`      |
| `@lib`        | `src/lib`        |
| `@pages`      | `src/pages`      |
| `@stores`     | `src/stores`     |

---

## State and API Layer

### Authentication

`stores/auth.store.ts` (Zustand) manages session state:

- **`bootstrap`** — calls `GET /api/auth/me` on app load to restore the session from the `auth_token` cookie.
- **`login`** — `POST /api/auth/sign-in`.
- **`logout`** — `POST /api/auth/logout`.

All API calls go through `lib/utils/apiCaller.ts`, which:

- Uses Axios with `withCredentials: true` for cookie-based auth.
- Unwraps the backend `{ success, data }` envelope.
- Throws typed `ApiError` instances with status codes and validation details.

### API modules

| Module                 | Backend routes                                                                                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api/auth.api.ts`      | `POST /auth/sign-in`, `POST /auth/logout`, `GET /auth/me`                                                                                                   |
| `api/job.api.ts`       | `GET /jobs`, `GET /jobs/:id`                                                                                                                                |
| `api/interview.api.ts` | `POST /interviews`, `POST /interviews/:id/turns`, `POST /interviews/:id/complete`, `POST /interviews/:id/abandon`, `GET /interviews`, `GET /interviews/:id` |
| `api/speech.api.ts`    | `POST /speech/synthesize`                                                                                                                                   |

### Data hooks

| Hook                  | Purpose                                                        |
| --------------------- | -------------------------------------------------------------- |
| `useAuth`             | Auth store selectors and actions                               |
| `useJobListing`       | Paginated job search on the home page                          |
| `useJobDetail`        | Single job fetch for the job detail page                       |
| `useJobInterviews`    | Recruiter interview list for a job                             |
| `useInterviewDetail`  | Full interview transcript and evaluation                       |
| `useRoomJob`          | Job context for the interview room                             |
| `useInterviewSession` | Full interview lifecycle (bootstrap, turns, complete, abandon) |
| `useAudioCapture`     | Microphone recording via `MediaRecorder`                       |
| `useAudioPlayback`    | TTS audio playback from base64 responses                       |

---

## Interview Room

The interview room (`RoomPage` + `useInterviewSession`) implements a turn-based voice pipeline:

1. **Create session** — `POST /api/interviews` with `{ jobId }`.
2. **Bootstrap audio** — synthesize welcome and goodbye messages via `POST /api/speech/synthesize`.
3. **Record answer** — `MediaRecorder` captures audio (WebM, max 60 seconds per turn).
4. **Submit turn** — `POST /api/interviews/:id/turns` as `multipart/form-data` with audio blob and metadata (`startedAt`, `endedAt`, `clientTurnId`).
5. **Playback** — decode base64 AI audio from the response and play through the Web Audio API.
6. **Complete** — `POST /api/interviews/:id/complete` when the interviewer signals the session is final.
7. **Abandon** — `POST /api/interviews/:id/abandon` on leave; uses `keepalive` fetch on page unload.

### Browser requirements

Voice interviews require:

- `MediaRecorder` and `navigator.mediaDevices.getUserMedia`
- `Audio` element for playback

Unsupported browsers see `RoomUnsupportedBrowser` instead of the mic controls. Microphone permission must be granted before the session starts.

### Client-side constants

Defined in `lib/constants/room.constants.ts`:

| Constant                       | Value  | Purpose                    |
| ------------------------------ | ------ | -------------------------- |
| `INTERVIEW_ANSWER_MAX_SECONDS` | `60`   | Auto-stop recording limit  |
| `INTERVIEW_MAX_QUESTIONS`      | `12`   | UI question counter cap    |
| `MIN_RECORDING_MS`             | `800`  | Minimum recording duration |
| `MIN_AUDIO_BYTES`              | `1024` | Minimum audio payload size |

Turn submission retries once on network or 5xx errors. Idempotency is handled server-side via `clientTurnId` (UUID per turn).

---

## Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR                    |
| `npm run build`   | Type-check and build production bundle to `dist/` |
| `npm run preview` | Serve the production build locally                |
| `npm run lint`    | Run ESLint                                        |
| `npm run format`  | Format with Prettier                              |
