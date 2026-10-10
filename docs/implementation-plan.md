# First Aid Guide — Implementation Plan, Design Patterns & Trade-offs

Source: *First-Aid-App-3-Week-Checklist* (Google Doc, last edited 12 Sep 2026), checked against the code on `redesign-learning-dashboard` @ `195942a`.

Each open item below maps to a GitHub issue created from [`docs/issues/issues.mjs`](issues/issues.mjs). The status column is based on the code, not on the checkboxes in the doc.

---

## 1. Status map

Legend: ✅ done · 🟡 partial · ⬜ not started

### Week 1 — Foundations

| Checklist item | Status | Evidence / gap | Issue |
|---|---|---|---|
| Postgres via docker-compose | ✅ | `docker-compose.yml` (port 5433) | — |
| Express: CORS, JSON, central error handler | ✅ | `server/src/app.js`, `middleware/errorHandler.js` | — |
| React (Vite) talking to API | ✅ | `client/src/api/client.js` | — |
| Migrations for users/courses/lessons/quizzes/questions | ✅ | `server/migrations/*` (node-pg-migrate) | — |
| `.env` config server + client | ✅ | `.env.example` in both | — |
| Registration + password hashing | ✅ | bcrypt, `routes/auth.js` (+ Google sign-in, beyond scope) | — |
| Login issuing JWT | ✅ | JWT in httpOnly cookie | — |
| Auth middleware | ✅ | `middleware/auth.js` (no role checks yet) | AUTHZ |
| AuthContext + protected route | ✅ | `context/AuthContext.jsx`, `ProtectedRoute.jsx` | — |
| Profile page | ✅ | `pages/ProfilePage.jsx` | — |
| **Admin-only CRUD for courses & lessons** | ⬜ | No course/lesson routes. Content is hard-coded in `client/src/data/courses.js` and the DB tables are unused | CONTENT-DB, ADMIN-CRUD |
| **Seed script with real content** | ⬜ | Real content exists, but only in the client bundle | SEED |
| Course list page | ✅ | `CoursesPage.jsx` | — |
| Lesson reader page | ✅ | `LessonPage.jsx` | — |
| Exit: register → login → browse → read | ✅ | Works today against static content | — |

### Week 2 — Core learning loop

| Checklist item | Status | Evidence / gap | Issue |
|---|---|---|---|
| Quiz model finalized (with `content_version`) | 🟡 | Tables exist; no `content_version`, no slug, no attempts table | QUIZ-MODEL |
| Server-side submit-and-grade endpoint | ⬜ | — | QUIZ-API |
| Grading isolated in a service function | ⬜ | — | QUIZ-API |
| Quiz UI with pass/fail feedback | ⬜ | — | QUIZ-UI |
| Lesson completion per user/lesson | ✅ | `lesson_attempts` + `routes/progress.js` | — |
| Course progress view (X of Y) | ✅ | `ProgressPage.jsx`, `CoursesPage.jsx` | — |
| Attempt history append-only | ✅ | `lesson_attempts` is insert-only | — |
| Certificate record + verification code on pass | ⬜ | — | CERT-ISSUE |
| Certificate view / PDF | ⬜ | — | CERT-VIEW |
| Public `/verify/:code` | ⬜ | — | CERT-VERIFY |

### Week 3 — Notifications, polish, hardening

| Checklist item | Status | Issue |
|---|---|---|
| Decoupled notification triggers (events/queue) | ⬜ | EVENTS |
| Email on certificate issuance | ⬜ | EMAIL-CERT |
| Scheduled "unfinished course" reminder | ⬜ | REMINDERS |
| Retry-on-reconnect for submissions | ⬜ | RETRY |
| Loading/error states on all screens | 🟡 (auth pages only; `LessonPage` swallows completion errors, `ProgressContext` hides fetch failures) | UI-STATES |
| Input validation on every endpoint | 🟡 (auth only; progress accepts any slug) | VALIDATION |
| Integration tests: grading + certificate verification | ⬜ (no test runner configured) | TESTS |
| Auth check on every protected route | 🟡 | AUTHZ |
| Rate limiting on login + quiz submit | ⬜ | RATE-LIMIT |
| Verification endpoint over-sharing review | ⬜ | CERT-VERIFY (acceptance criteria) |
| Deploy API + Postgres | 🟡 (`docker-compose.prod.yml`, Dockerfile exist) | DEPLOY-API |
| Deploy React build | ⬜ | DEPLOY-WEB |
| Seed production with 2–3 courses | ⬜ | SEED |
| README: setup + architecture | ⬜ (client README is the Vite template) | README |
| Demo dry-run | ⬜ | DEMO |

### Additions from 2 Sep 2026 (J = James, N = second team member)

| Item | Owner | Issue |
|---|---|---|
| Show real progress on the dashboard + pie/bar charts | J / N | PROGRESS-VIZ |
| Badges at the end of each basic procedure | J / N | BADGES |
| Drop CPR Basics from First Aid Essentials and add Nosebleeds | J | CONTENT-NOSEBLEED |
| AI chatbot entry point on dashboard | J | CHATBOT |
| Rename app to "First Aid Guide" | J | RENAME |
| Real images per course | N + J | COURSE-IMAGES |
| UI improvements + dark mode | N + J | DARK-MODE |

---

## 2. Target architecture

```
React (Vite)                       Express API                          Postgres
──────────────                     ───────────────────────────          ─────────────────────
pages/        ─┐                   routes/   (HTTP only: parse,         users, courses, lessons
hooks/queries  ├─ api/client.js ─► validate, call service, map DTO)     quizzes, questions
context/       ┘   (fetch +        services/ (business rules; pure      lesson_attempts  (append-only)
                    retry queue)    grading, certificate rules)          quiz_attempts    (append-only)
                                   repositories/ (SQL only)             certificates, user_badges
                                   events/   (domain events → outbox)   jobs (pg-boss queue)
                                   workers/  (email, reminders) ◄─────── 
```

Today SQL lives directly in route handlers. That is fine for auth and progress, but quizzes, certificates and badges need business rules that can be unit-tested. **Introduce `services/` and `repositories/` when you start the quiz work, not as a big-bang refactor.**

---

## 3. Design patterns and trade-offs

### 3.1 Content source of truth: static module vs database  ← *decide first, everything in Week 2 depends on it*

Course content currently lives in `client/src/data/courses.js`. The `courses`/`lessons` tables are empty, and `lesson_attempts` refers to content by **slug strings**, with no foreign keys.

| Option | Pros | Cons |
|---|---|---|
| A. Keep static content in the client | Zero backend work, content reviewed in PRs, works offline | Answers ship to the browser, so grading can't be trusted. Certificates/badges can't reference rows. No admin CRUD (a checklist requirement) |
| **B. DB as source of truth, seeded from content files (recommended)** | Server-side grading, FK integrity for quizzes/certs, admin CRUD possible, `content_version` meaningful | Migration plus seed work. The client must fetch content (loading states). Duplicate content until `courses.js` is deleted |
| C. Headless CMS | Non-dev editing | New service, cost, overkill for 3 weeks |

**Recommendation: B.** Keep **slugs as stable natural keys** alongside surrogate `id`s (add `slug` columns with unique constraints), so existing `lesson_attempts` rows and URLs keep working. The seed is an **idempotent upsert keyed by slug** (`INSERT … ON CONFLICT (slug) DO UPDATE`), so it can run on every deploy. Admin CRUD and the seed will both write the same rows. Pick one owner per environment: seed in dev/demo, admin UI in prod.

`courses.instructor_id` is `NOT NULL`, so the seed must create or look up a system admin user first.

### 3.2 Layering: Functional core, imperative shell

Grading must be a **pure function**: `grade(questions, answers) → { score, passed, perQuestion }`. It has no DB or `req` access. The route loads data, calls `grade`, and persists the result.

- *Trade-off:* more files and indirection, but grading becomes unit-testable without Postgres, and the same function can later grade offline-synced attempts.

### 3.3 Server-authoritative grading and DTOs

- `GET /quizzes/:id` returns questions **without `correct_answer`**. Use an explicit DTO mapper, never `select *`.
- `POST /quizzes/:id/submit` grades on the server. The client sends only answers.
- *Trade-off:* the client can't show instant per-question feedback offline. You accept that because certificates have to be trustworthy.

### 3.4 Append-only event log plus derived read models

`lesson_attempts` already follows this pattern. Extend it to `quiz_attempts` (answers JSONB, score, passed, `content_version`). Progress, "passed", badges and certificates are **derived** from the log.

- *Pro:* full audit trail, no lost history, safe concurrent writes.
- *Con:* reads aggregate over growing tables, and retries create duplicates (see 3.9). Mitigate with composite indexes (already present) and, if needed later, a summary table or materialized view.

### 3.5 Content versioning

Store `content_version` on `quizzes` and copy it into each `quiz_attempt`. When a quiz is edited, increment the version instead of mutating it in place, or snapshot the questions into the attempt.

- *Trade-off:* immutable versions keep old certificates explainable ("passed v2 of the CPR quiz") at the cost of more rows and editor complexity. For the 3-week scope, **bump the version and snapshot question IDs and answers in the attempt**. Don't build full version tables yet.

### 3.6 Certificates and verification codes

| Option | Pros | Cons |
|---|---|---|
| **Random code stored in DB (recommended)** e.g. 10-char Crockford base32 from `crypto.randomBytes` | Revocable, short, typeable, no secret management | Needs DB lookup |
| Signed token (HMAC/JWT) in URL | Stateless verification | Long URLs, can't revoke without a denylist, secret rotation invalidates all certificates |

- Issue the certificate in the **same transaction** as the passing `quiz_attempt`, with a unique `(user_id, course_id)` index so passing twice doesn't create duplicates (idempotent issuance).
- **PDF:** start with a print-styled HTML page (`@media print`, browser "Save as PDF"). It costs nothing and works everywhere. Server-side PDF (pdfkit, ~light) only if you need email attachments. Avoid Puppeteer: it's heavy for a small VPS.
- **Public verify endpoint:** return only *name as printed, course title, issue date, valid/revoked*. No email, user ID, score or attempt history. Make codes unguessable (≥50 bits of entropy) and rate-limit the endpoint so it can't be enumerated.

### 3.7 Notifications: Observer and transactional outbox

The checklist asks for triggers decoupled from controllers.

| Option | Pros | Cons |
|---|---|---|
| In-process `EventEmitter` | Trivial | Events are lost on crash or restart, and email failures surface in the request path |
| **Postgres-backed queue, e.g. `pg-boss` (recommended)** | No new infra (reuses Postgres), retries/backoff, **cron scheduling for reminders built in**, enqueue in the same transaction as the domain write | Needs a worker process (can run in the API process at first), adds its own tables |
| Redis + BullMQ | Mature, fast | Extra service to deploy and pay for |

Services publish domain events (`CertificateIssued`, `CourseCompleted`). Subscribers turn them into jobs (`send-certificate-email`, `award-badge`). Email sending sits behind a **Strategy/Adapter** (`ConsoleMailer` in dev, Resend/SMTP in prod). Push notifications can be added later as one more subscriber.

### 3.8 Badges: derived vs persisted

| Option | Pros | Cons |
|---|---|---|
| Derived on read (completed all lessons ⇒ badge) | No drift, no writes | No "earned on" date, can't notify, logic duplicated in client and server |
| **Persisted `user_badges` (recommended)** | Earned date, notifications, stable once awarded | Must be idempotent (`UNIQUE(user_id, badge_slug)`) and backfilled for existing users |

Award badges from the same event pipeline as certificates (3.7). Badge *definitions* (slug, title, image, rule) live with course content (3.1).

### 3.9 Resilience: idempotency keys plus a client retry queue

The append-only log makes naive retries dangerous: a retried POST creates a duplicate attempt.

- The client generates a UUID `Idempotency-Key` per submission. The server stores it with a unique constraint (`lesson_attempts.client_id`, `quiz_attempts.client_id`) and returns the original result on replay.
- The client queues failed mutations (in memory, persisted to `localStorage`) and flushes them on the `online` event with exponential backoff.
- **Front-end data layer decision:** adopt **TanStack Query**. Retries, loading/error states, cache invalidation and mutation persistence come built in, which covers both RETRY and UI-STATES. The alternative is extending the hand-rolled contexts (no dependency, but you rebuild those features). Recommended: TanStack Query, migrating one context at a time.

Per the checklist's own cut rule, **full offline sync is out of scope**. Retry-on-reconnect is the floor.

### 3.10 Validation

Use a **schema-first validation middleware** (`zod`) for `body`/`params`/`query` on every route. Also validate that slugs refer to real content: today `POST /progress/lessons/anything/anything/complete` succeeds.

- *Trade-off:* adds a dependency, but gives you one source of truth for shapes. The schemas can later be shared with the client.

### 3.11 Authorization

`requireAuth` only knows the user ID. Add `requireRole('admin')`.

| Option | Pros | Cons |
|---|---|---|
| Role inside JWT | No DB hit | Role changes don't take effect for up to 7 days (token lifetime) |
| **Look up role per request on admin routes (recommended)** | Always current | One extra query, only on admin routes |

Add a route inventory test that fails if any non-public route lacks `requireAuth`.

### 3.12 Rate limiting

Use `express-rate-limit` with the in-memory store. That's fine for a single API container. Requirements:
- `app.set('trust proxy', 1)` in prod (the API sits behind a reverse proxy on `127.0.0.1:4001`). Without it, every request appears to come from one IP.
- Login: key by IP **and** email. Quiz submit: key by user ID. Verify: key by IP.
- *Trade-off:* the memory store resets on restart and doesn't work across replicas. Move to a Postgres or Redis store only if you scale out.

### 3.13 Deployment topology and cookies ⚠️

`lib/token.js` assumes the frontend on Vercel and the API on a VPS, using `SameSite=None` cookies. **Safari (ITP), and increasingly Chrome, block third-party cookies.** If the two run on unrelated domains (e.g. `*.vercel.app` and a VPS IP/domain), login will fail for some demo viewers.

| Option | Pros | Cons |
|---|---|---|
| **Same site: `app.example.com` + `api.example.com` (recommended)** | First-party cookies, `SameSite=Lax` works | Needs a custom domain |
| Vercel rewrites `/api/*` → VPS (same origin) | No CORS, first-party cookies | Adds Vercel-proxy latency |
| Bearer token in memory/localStorage | No cookie issues | XSS exposure, larger refactor |

Also: run migrations on deploy (`npm run migrate:up` before `start`), fail fast if `JWT_SECRET` is missing, and set `CLIENT_ORIGIN` explicitly.

### 3.14 Front-end theming (dark mode and rename)

- Put all colors in CSS custom properties on `:root`. Override them under `[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`. Persist the toggle in `localStorage`.
- *Trade-off:* the redesign CSS needs a token sweep first. Do that before adding dark mode or you'll maintain two palettes by hand.
- Centralize the app name in one constant (`APP_NAME`) used by `index.html`, `AppHeader`, and certificates.

### 3.15 Progress charts

Pie (overall completion) and bar (per course) are simple. Use hand-rolled SVG (0 KB, fully themeable with tokens) unless more chart types are planned, in which case use Recharts (~100 KB gzipped). Recommended: hand-rolled SVG components. Chart data must come from `ProgressContext`, never hard-coded.

### 3.16 AI chatbot

The checklist asks only for the **icon/entry point** on the dashboard. If a real assistant follows, it must:
- be proxied through the API (never expose a model key to the browser),
- carry a clear "not a substitute for emergency services, call your local emergency number" banner,
- escalate on emergency phrases (unconscious, not breathing, severe bleeding) to a call-for-help screen,
- be grounded in course content (retrieval over lessons) rather than free generation.

Treat it as a separate, post-demo epic.

---

## 4. Suggested order and critical path

```
CONTENT-DB ─► SEED ─► QUIZ-MODEL ─► QUIZ-API ─► QUIZ-UI ─► CERT-ISSUE ─► CERT-VIEW / CERT-VERIFY
     │                                  │                       │
     └► ADMIN-CRUD (needs AUTHZ)        └► RATE-LIMIT           └► EVENTS ─► EMAIL-CERT, BADGES, REMINDERS
VALIDATION, UI-STATES, RETRY run alongside, TESTS follow QUIZ-API & CERT-VERIFY
Design track (parallel, no backend deps): RENAME, CONTENT-NOSEBLEED, COURSE-IMAGES, DARK-MODE, PROGRESS-VIZ, CHATBOT
Ship: DEPLOY-API ─► DEPLOY-WEB ─► README ─► DEMO
```

**Cut order if behind** (from the checklist): offline sync → push notifications → admin CRUD UI (keep the API) → certificate PDF (keep the HTML view).
