// Issue definitions derived from docs/implementation-plan.md.
// Ordered so every {{KEY}} reference points at an issue created earlier;
// create-issues.mjs replaces {{KEY}} with the real "#123" number.

const PLAN = "See `docs/implementation-plan.md`";

export const labels = [
  { name: "week-1", color: "c5def5", description: "Checklist Week 1 — foundations" },
  { name: "week-2", color: "bfd4f2", description: "Checklist Week 2 — core learning loop" },
  { name: "week-3", color: "d4c5f9", description: "Checklist Week 3 — notifications, hardening, deploy" },
  { name: "sept-update", color: "fbca04", description: "Added to the checklist on 2 Sep 2026" },
  { name: "backend", color: "0e8a16", description: "Express / Postgres" },
  { name: "frontend", color: "1d76db", description: "React client" },
  { name: "infra", color: "5319e7", description: "Deploy, CI, environments" },
  { name: "security", color: "b60205", description: "Auth, validation, abuse prevention" },
  { name: "testing", color: "006b75", description: "Automated tests" },
  { name: "design", color: "f9d0c4", description: "UI / visual design" },
  { name: "content", color: "fef2c0", description: "Course content" },
  { name: "decision", color: "000000", description: "Requires an architecture decision first" },
  { name: "epic", color: "3e4b9e", description: "Tracking issue" },
];

export const issues = [
  // ───────────── Foundations / content ─────────────
  {
    key: "CONTENT-DB",
    title: "Make Postgres the source of truth for course & lesson content",
    labels: ["week-1", "backend", "frontend", "decision"],
    body: `## Context
Course content is hard-coded in \`client/src/data/courses.js\`. The \`courses\` and \`lessons\` tables exist but are unused, and \`lesson_attempts\` refers to content only by slug strings. Quizzes, certificates and badges all need real rows to reference, and answers must not ship to the browser.

## Scope
- [ ] Migration: add \`slug\` (unique) to \`courses\`, and \`slug\` (unique per course) plus \`minutes\` to \`lessons\`. Store the lesson \`body\` as JSONB blocks matching the current \`{type, text|items}\` shape. Add \`category\`, \`tagline\`, \`icon\`, \`image_url\`, \`objectives\` (JSONB) to \`courses\`
- [ ] Read endpoints: \`GET /courses\`, \`GET /courses/:slug\`, \`GET /courses/:slug/lessons/:lessonSlug\` (authenticated)
- [ ] Client: replace \`courses.js\` imports with API calls (loading and error states). Delete \`courses.js\` once parity is reached
- [ ] Keep URLs and existing \`lesson_attempts\` rows working (slugs stay the public key)

## Acceptance criteria
- Dashboard, course detail and lesson pages render from the API with identical content
- No content module remains in the client bundle

## Design & trade-offs
Option B in §3.1: the DB is the source of truth, with slugs as stable natural keys alongside surrogate IDs. This costs a fetch and loading states on the client, but enables server-side grading, foreign keys for certificates, and admin CRUD. ${PLAN} §3.1.`,
  },
  {
    key: "SEED",
    title: "Idempotent seed script with real course content (dev + production)",
    labels: ["week-1", "week-3", "backend", "content"],
    body: `## Context
The checklist requires a seed with 1–2 real courses in Week 1 and 2–3 demoable courses in production on Day 21. The real content already exists in \`client/src/data/courses.js\`.

## Scope
- [ ] Move content to \`server/seeds/content/*.js\` (or JSON), one file per course
- [ ] \`npm run seed\` upserts by slug (\`INSERT … ON CONFLICT (slug) DO UPDATE\`) so it is safe to rerun on every deploy
- [ ] Create or look up a system admin user first (\`courses.instructor_id\` is NOT NULL)
- [ ] Include quiz questions once the quiz-model tables land (follow-up commit is fine)

## Acceptance criteria
- Fresh DB + \`migrate:up\` + \`seed\` produces all courses; running \`seed\` twice changes nothing
- Production has ≥ 2–3 complete courses with quizzes

Depends on {{CONTENT-DB}}. ${PLAN} §3.1.`,
  },
  {
    key: "AUTHZ",
    title: "Role-based authorization + audit auth on every route",
    labels: ["week-3", "backend", "security"],
    body: `## Context
\`requireAuth\` only sets \`req.userId\`. There is no \`requireRole\`, yet the checklist needs admin-only CRUD and "auth check confirmed on every route that requires it".

## Scope
- [ ] \`requireRole(...roles)\` middleware that loads the role from the DB per request
- [ ] Route inventory test: walk the Express router stack and fail if a non-allow-listed route lacks \`requireAuth\` (allow-list: \`/health\`, \`/auth/*\` public endpoints, \`/verify/:code\`)
- [ ] Fail fast on boot if \`JWT_SECRET\` is unset

## Design & trade-offs
Looking up the role per request on admin routes costs one query but is always current. A role baked into the JWT would stay stale for up to 7 days. ${PLAN} §3.11.`,
  },
  {
    key: "ADMIN-CRUD",
    title: "Admin-only CRUD endpoints for courses and lessons",
    labels: ["week-1", "backend"],
    body: `## Scope
- [ ] \`POST/PATCH/DELETE /admin/courses\`, \`/admin/courses/:id/lessons\` behind \`requireRole('admin')\`
- [ ] Lesson reordering via \`position\`
- [ ] Bump \`content_version\` on any quiz whose lesson changes (see quiz model)
- [ ] Optional minimal admin UI (cut first if behind schedule; keep the API)

## Acceptance criteria
- Student role gets 403; admin can create, edit and delete; validation errors return 400

## Design & trade-offs
Seed and admin CRUD write the same rows. Decide per environment which one owns content: seed in dev/demo, admin in prod.

Depends on {{CONTENT-DB}}, {{AUTHZ}}. ${PLAN} §3.1, §3.11.`,
  },
  {
    key: "VALIDATION",
    title: "Schema-based input validation on every API endpoint",
    labels: ["week-3", "backend", "security"],
    body: `## Context
Only the auth routes validate input. \`POST /progress/lessons/:course/:lesson/complete\` accepts any slug, including ones that don't exist.

## Scope
- [ ] Add \`zod\` and a \`validate({ body, params, query })\` middleware that returns 400 with field errors
- [ ] Apply it to every route (auth, progress, courses, quizzes, certificates, admin)
- [ ] Validate that course/lesson slugs exist before recording progress

## Design & trade-offs
One dependency in exchange for a single source of truth for request shapes. The schemas can later be shared with the client. ${PLAN} §3.10.`,
  },

  // ───────────── Quiz engine ─────────────
  {
    key: "QUIZ-MODEL",
    title: "Finalize quiz/question data model with content_version and append-only quiz_attempts",
    labels: ["week-2", "backend"],
    body: `## Scope
- [ ] Migration: \`quizzes.content_version int not null default 1\`, \`quizzes.pass_mark\` (e.g. 80%), quiz slug or one-quiz-per-course link
- [ ] \`quiz_attempts\` (append-only): \`user_id\`, \`quiz_id\`, \`content_version\`, \`answers jsonb\`, \`score\`, \`passed\`, \`client_id uuid unique\` (idempotency), \`created_at\`
- [ ] Decide quiz granularity: one quiz per course (gates the certificate) vs per lesson. Recommend **per course** for the demo
- [ ] Seed questions for every seeded course

## Design & trade-offs
- Append-only attempts keep a full audit trail. Reads aggregate, and retries need idempotency keys (§3.4, §3.9)
- Bump \`content_version\` and snapshot answers in the attempt rather than building full version tables (§3.5)

Depends on {{CONTENT-DB}}. ${PLAN} §3.4–3.5.`,
  },
  {
    key: "QUIZ-API",
    title: "Server-side quiz grading service + submit endpoint",
    labels: ["week-2", "backend", "security"],
    body: `## Scope
- [ ] \`services/grading.js\`: pure \`grade(questions, answers) → { score, total, passed, perQuestion }\` with no DB or \`req\` access
- [ ] \`GET /quizzes/:id\` returns questions through a DTO that **omits \`correct_answer\`**
- [ ] \`POST /quizzes/:id/submit\` loads questions, calls \`grade\`, inserts \`quiz_attempt\`, returns the result (honours \`Idempotency-Key\`)
- [ ] Unit tests for \`grade\` (all question types, partial answers, unknown IDs, case/whitespace for short answer)

## Acceptance criteria
- No endpoint ever returns correct answers before submission
- Tampering with client payloads cannot raise the score

## Design & trade-offs
Functional core, imperative shell: the service is testable without Postgres, at the cost of a bit more indirection. Server-authoritative grading gives up offline instant feedback for trustworthy certificates. ${PLAN} §3.2–3.3.

Depends on {{QUIZ-MODEL}}.`,
  },
  {
    key: "QUIZ-UI",
    title: "Quiz-taking UI with immediate pass/fail feedback",
    labels: ["week-2", "frontend"],
    body: `## Scope
- [ ] Quiz page reachable from course detail after all lessons are complete (or always, decide)
- [ ] Multiple choice, true/false and short answer inputs; one question per screen or full form
- [ ] Submit → result screen: score, pass/fail, per-question correctness, retry button
- [ ] Loading, error and retry states. Disable double-submit

## Acceptance criteria
- Passing leads to the certificate (once certificates exist); failing shows what to review

Depends on {{QUIZ-API}}.`,
  },

  // ───────────── Certificates ─────────────
  {
    key: "CERT-ISSUE",
    title: "Issue certificate with unique verification code on quiz pass",
    labels: ["week-2", "backend"],
    body: `## Scope
- [ ] \`certificates\` table: \`id\`, \`user_id\`, \`course_id\`, \`quiz_attempt_id\`, \`code\` (unique), \`recipient_name\` (snapshot), \`issued_at\`, \`revoked_at\`
- [ ] \`UNIQUE(user_id, course_id)\`: issuance is idempotent
- [ ] Issue in the **same transaction** as the passing \`quiz_attempt\`
- [ ] Code: ≥ 50 bits of entropy from \`crypto.randomBytes\`, Crockford base32, ~10 chars, formatted like \`FA-7K3M-Q9XD\`
- [ ] \`GET /certificates\` (mine) and \`GET /certificates/:id\`
- [ ] Publish a \`CertificateIssued\` domain event (consumed by the email work)

## Design & trade-offs
A random stored code is revocable and short. A signed token is stateless, but long and can't be revoked. ${PLAN} §3.6.

Depends on {{QUIZ-API}}.`,
  },
  {
    key: "CERT-VIEW",
    title: "Certificate view page + PDF/print export",
    labels: ["week-2", "frontend", "design"],
    body: `## Scope
- [ ] Styled certificate page: recipient name, course, date, verification code, QR code or link to \`/verify/:code\`
- [ ] \`@media print\` stylesheet so "Save as PDF" produces a clean single page
- [ ] Share button (copy verify link)
- [ ] "My certificates" list on profile/progress

## Design & trade-offs
Start with print CSS: zero dependencies, and the browser produces the PDF. Add server-side \`pdfkit\` only if email attachments are needed. Avoid Puppeteer on the VPS. ${PLAN} §3.6.

Depends on {{CERT-ISSUE}}.`,
  },
  {
    key: "CERT-VERIFY",
    title: "Public /verify/:code endpoint and page (no login, minimal data)",
    labels: ["week-2", "week-3", "backend", "frontend", "security"],
    body: `## Scope
- [ ] \`GET /verify/:code\`: public, rate-limited per IP
- [ ] Public \`/verify/:code\` React route outside \`ProtectedRoute\`
- [ ] Response contains **only**: recipient name as printed, course title, issue date, status (valid/revoked). Uniform 404 for unknown codes

## Acceptance criteria (security review item from the checklist)
- No email, user ID, score, attempt history or internal IDs in the response
- Codes cannot be enumerated (entropy + rate limit)

Depends on {{CERT-ISSUE}}. ${PLAN} §3.6.`,
  },

  // ───────────── Notifications ─────────────
  {
    key: "EVENTS",
    title: "Decouple side effects with domain events + Postgres-backed job queue",
    labels: ["week-3", "backend", "decision"],
    body: `## Context
The checklist asks for notification triggers decoupled from controllers, "keeps push notifications easy to add later".

## Scope
- [ ] Add \`pg-boss\` (Postgres-backed queue; no new infra)
- [ ] \`events/\` module: \`publish(eventName, payload, { tx })\` enqueues jobs in the same transaction as the domain write (outbox semantics)
- [ ] Worker bootstrap (in the API process for now, behind a flag so it can split later)
- [ ] \`Mailer\` interface with \`ConsoleMailer\` (dev) and a real adapter (Resend/SMTP) selected by env (Strategy/Adapter)

## Design & trade-offs
| Option | Verdict |
|---|---|
| In-process EventEmitter | Events lost on crash; email failures surface in the request path |
| **pg-boss** | Retries, backoff, and cron for reminders, with no new service |
| Redis + BullMQ | Extra infra for the same result |

${PLAN} §3.7.`,
  },
  {
    key: "EMAIL-CERT",
    title: "Email the learner when a certificate is issued",
    labels: ["week-3", "backend"],
    body: `## Scope
- [ ] Subscriber for \`CertificateIssued\` → \`send-certificate-email\` job
- [ ] Email template: congratulations, course, verify link, certificate page link
- [ ] Retries with backoff. A failure never affects issuance

## Acceptance criteria
- Passing a quiz in dev logs the email via \`ConsoleMailer\`; in prod a real email arrives

Depends on {{EVENTS}}, {{CERT-ISSUE}}.`,
  },
  {
    key: "REMINDERS",
    title: "Scheduled reminder job: \"you haven't finished this course\"",
    labels: ["week-3", "backend"],
    body: `## Scope
- [ ] Daily cron job (pg-boss schedule) that finds users with a course started but not finished and no activity in N days (default 3)
- [ ] Throttle: at most one reminder per user per course per 7 days (\`notifications_sent\` table)
- [ ] Unsubscribe flag on \`users\` + link in email

Depends on {{EVENTS}}. ${PLAN} §3.7.`,
  },

  // ───────────── Resilience ─────────────
  {
    key: "UI-STATES",
    title: "Loading and error states across all major screens",
    labels: ["week-3", "frontend"],
    body: `## Context
- \`ProgressContext.refresh\` swallows fetch errors and shows zero progress
- \`LessonPage.handleMarkComplete\` has \`try/finally\` with no \`catch\`, so failures are an unhandled rejection with no UI
- Once content moves to the API, every page needs loading states

## Scope
- [ ] Shared \`<LoadingState>\`, \`<ErrorState onRetry>\` components
- [ ] Apply them to the dashboard, course detail, lesson, progress, profile, quiz, certificate and verify pages
- [ ] Route-level error boundary

## Design & trade-offs
Recommend adopting **TanStack Query**, which gives loading, error and retry states plus cache invalidation in one dependency. The alternative is extending the hand-rolled contexts. Migrate one context at a time. ${PLAN} §3.9.`,
  },
  {
    key: "RETRY",
    title: "Retry-on-reconnect for lesson completion and quiz submission",
    labels: ["week-3", "frontend", "backend"],
    body: `## Context
\`lesson_attempts\` is append-only, so a naive retry records duplicate attempts.

## Scope
- [ ] Client generates a UUID per submission and sends it as \`Idempotency-Key\`
- [ ] Server: \`client_id uuid unique\` on \`lesson_attempts\` and \`quiz_attempts\`. A replay returns the original row
- [ ] Client queue for failed mutations, persisted to \`localStorage\`, flushed on the \`online\` event with exponential backoff, plus an "offline — will sync" indicator

## Out of scope
Full offline sync (first item on the checklist's cut list).

Depends on {{QUIZ-API}}. ${PLAN} §3.9.`,
  },

  // ───────────── Security & testing ─────────────
  {
    key: "RATE-LIMIT",
    title: "Rate limiting on login, quiz submit and certificate verification",
    labels: ["week-3", "backend", "security"],
    body: `## Scope
- [ ] \`express-rate-limit\`. Login keyed by IP + email, quiz submit by user ID, \`/verify\` by IP
- [ ] \`app.set('trust proxy', 1)\` in production (the API sits behind a reverse proxy on 127.0.0.1:4001). Without it, every client shares one bucket
- [ ] 429 responses go through the central error handler

## Design & trade-offs
The memory store is fine for a single container. It resets on restart and doesn't work across replicas, so switch stores only when scaling out. ${PLAN} §3.12.

Depends on {{QUIZ-API}}.`,
  },
  {
    key: "TESTS",
    title: "Test harness + integration tests for quiz grading and certificate verification",
    labels: ["week-3", "backend", "testing"],
    body: `## Context
No test runner is configured in \`server/\` or \`client/\`.

## Scope
- [ ] Add \`vitest\` + \`supertest\` to the server. Test DB via docker-compose (\`first_aid_test\`), migrated before the suite, truncated between tests
- [ ] Unit: \`grade()\` edge cases
- [ ] Integration: submit quiz → attempt stored → pass issues exactly one certificate (idempotent on resubmit)
- [ ] Integration: \`/verify/:code\` valid, revoked and unknown; response contains no private fields
- [ ] Integration: auth route inventory (from the authorization work)
- [ ] GitHub Actions workflow running lint + tests on PRs

Depends on {{QUIZ-API}}, {{CERT-VERIFY}}, {{AUTHZ}}.`,
  },

  // ───────────── Sept 2 product updates ─────────────
  {
    key: "RENAME",
    title: "Rename the app to \"First Aid Guide\"",
    labels: ["sept-update", "frontend"],
    body: `Owner (per checklist): **J**

## Scope
- [ ] Single \`APP_NAME\` constant used by \`AppHeader\`, auth layout and certificates
- [ ] \`client/index.html\` \`<title>\` (currently "First Aid Training")
- [ ] README, package names, email templates`,
  },
  {
    key: "CONTENT-NOSEBLEED",
    title: "Remove CPR Basics from First Aid Essentials and add a Nosebleeds course",
    labels: ["sept-update", "content"],
    body: `Owner (per checklist): **J**

## Scope
- [ ] Move \`cpr\` out of the essentials category (keep it as its own category, or retire it; decide)
- [ ] New \`nosebleeds\` course with real, reviewed content: when to worry, correct head position (lean forward, not back), pinching technique and duration, when to seek care
- [ ] Objectives, lessons, quiz questions, image, badge
- [ ] Existing \`lesson_attempts\` for \`cpr\` remain valid

Lands in the seed content once {{CONTENT-DB}} is done (or in \`courses.js\` until then).`,
  },
  {
    key: "PROGRESS-VIZ",
    title: "Dashboard: real progress data + pie and bar charts",
    labels: ["sept-update", "frontend", "design"],
    body: `Owners (per checklist): **J** (real progress), **N** (visuals)

## Scope
- [ ] Audit the dashboard, hub and progress pages: every number derives from \`ProgressContext\` (no placeholder values from the mockup)
- [ ] Pie/donut: overall lessons completed vs remaining
- [ ] Bar: completion % per course
- [ ] Accessible: text equivalent, works in dark mode (tokens)

## Design & trade-offs
Hand-rolled SVG components (0 KB, themeable) vs Recharts (~100 KB). Recommend SVG unless more chart types are planned. ${PLAN} §3.15.`,
  },
  {
    key: "BADGES",
    title: "Badges for completing each basic first-aid procedure",
    labels: ["sept-update", "backend", "frontend", "design"],
    body: `Owners (per checklist): **J** (logic), **N** (badge artwork)

## Scope
- [ ] Badge definitions alongside course content (slug, title, artwork, rule e.g. "all lessons in course X complete")
- [ ] \`user_badges\` table with \`UNIQUE(user_id, badge_slug)\` and \`earned_at\`
- [ ] Award from a \`CourseCompleted\` event (idempotent). Backfill for existing users
- [ ] Badge shown at the end of the last lesson + badge shelf on the dashboard/profile
- [ ] Artwork for every course (N)

## Design & trade-offs
Persisted badges give an earned date and notifications but need idempotency and a backfill. Derived badges can't drift but have no history. ${PLAN} §3.8.

Depends on {{EVENTS}} (can start with a synchronous award and switch over later).`,
  },
  {
    key: "COURSE-IMAGES",
    title: "Real images for each course on the dashboard",
    labels: ["sept-update", "frontend", "design", "content"],
    body: `Owners (per checklist): **N and J**

## Scope
- [ ] One image per course. Licensed (own photos, CC0, or properly attributed) and medically accurate
- [ ] Optimized: WebP/AVIF, ≤ 150 KB, explicit width/height, \`loading="lazy"\`, meaningful \`alt\`
- [ ] Stored in \`client/public/courses/\` (or object storage) and referenced via \`courses.image_url\`

Matches the Stitch mockup linked in the checklist.`,
  },
  {
    key: "DARK-MODE",
    title: "UI polish + dark mode via design tokens",
    labels: ["sept-update", "frontend", "design"],
    body: `Owners (per checklist): **N and J**

## Scope
- [ ] Token sweep: move every color in \`index.css\`, \`App.css\`, \`pages/*.css\`, \`AppHeader.css\` to CSS custom properties on \`:root\`
- [ ] Dark palette under \`[data-theme="dark"]\` + \`@media (prefers-color-scheme: dark)\`
- [ ] Toggle in the header, persisted to \`localStorage\`, no flash on load (inline script in \`index.html\`)
- [ ] Contrast check (WCAG AA) on the crimson palette in both themes

## Design & trade-offs
Do the token sweep first. Otherwise you maintain two palettes by hand. ${PLAN} §3.14.`,
  },
  {
    key: "CHATBOT",
    title: "AI first-aid assistant entry point on the dashboard",
    labels: ["sept-update", "frontend", "decision"],
    body: `Owner (per checklist): **J**

## Scope (this issue)
- [ ] Floating chatbot icon/button on the dashboard opening a panel ("coming soon" or a scripted FAQ)

## Before building a real assistant (follow-up epic)
- Proxy through the API; never expose a model key to the browser
- Persistent banner: not a substitute for emergency services
- Emergency-phrase detection (not breathing, unconscious, severe bleeding) → "call emergency services now" screen
- Ground answers in course content (retrieval over lessons) rather than free generation

${PLAN} §3.16.`,
  },

  // ───────────── Deploy & demo ─────────────
  {
    key: "DEPLOY-API",
    title: "Deploy API + Postgres to production",
    labels: ["week-3", "infra"],
    body: `## Context
\`docker-compose.prod.yml\` and \`server/Dockerfile\` exist (API on 127.0.0.1:4001 behind a reverse proxy).

## Scope
- [ ] Run migrations on deploy (\`migrate:up\` before \`start\`), then the idempotent seed
- [ ] TLS reverse proxy, \`trust proxy\`, \`CLIENT_ORIGIN\`, \`NODE_ENV=production\`
- [ ] Postgres backups (nightly \`pg_dump\`) and a health check against \`/health\`
- [ ] Secrets: JWT secret, Google client ID, mail provider key

## ⚠️ Cookie decision
\`lib/token.js\` assumes Vercel and a VPS on different sites with \`SameSite=None\`. Safari blocks third-party cookies, so login will fail there. Prefer \`app.<domain>\` + \`api.<domain>\` (same site) or a Vercel rewrite of \`/api/*\`. ${PLAN} §3.13.`,
  },
  {
    key: "DEPLOY-WEB",
    title: "Deploy React build (Vercel)",
    labels: ["week-3", "infra", "frontend"],
    body: `## Scope
- [ ] Vercel project for \`client/\`, \`VITE_API_URL\` and \`VITE_GOOGLE_CLIENT_ID\` set
- [ ] SPA fallback rewrite so deep links (\`/courses/...\`, \`/verify/...\`) work
- [ ] Custom domain on the same site as the API, per the cookie decision
- [ ] Add the production origin to the Google OAuth authorized origins

Depends on {{DEPLOY-API}}.`,
  },
  {
    key: "README",
    title: "Write README: setup steps + architecture overview",
    labels: ["week-3", "infra"],
    body: `## Context
There is no root README. \`client/README.md\` is the Vite template.

## Scope
- [ ] Root README: what the app is, stack, prerequisites, \`docker compose up\`, env setup, \`migrate:up\`, \`seed\`, \`npm run dev\` for both apps, running tests
- [ ] Architecture overview (diagram from \`docs/implementation-plan.md\` §2) and key decisions
- [ ] Deployment notes
- [ ] Replace \`client/README.md\` with a short pointer`,
  },
  {
    key: "DEMO",
    title: "Dry-run the full demo path end to end on production",
    labels: ["week-3", "testing"],
    body: `## Demo script
- [ ] Register (email) and sign in with Google
- [ ] Browse a course → read lessons → progress and charts update
- [ ] Take the quiz → fail once → pass
- [ ] Certificate issued → email received → print to PDF
- [ ] Open \`/verify/:code\` in a private window (logged out)
- [ ] Badge appears; dark mode toggle; mobile viewport
- [ ] Test in Safari as well as Chrome (cookie check)

Depends on {{DEPLOY-WEB}}.`,
  },
];

export const epic = {
  title: "Epic: First Aid Guide — 3-week build checklist tracker",
  labels: ["epic"],
  intro: `Tracking issue generated from the *First-Aid-App-3-Week-Checklist* doc, checked against the code on \`redesign-learning-dashboard\`.

Design patterns, trade-offs and the status of already-completed items are in \`docs/implementation-plan.md\`.

**Already done (no issue):** docker Postgres, Express skeleton, Vite client, migrations, env config, register/login/JWT cookie (+ Google), auth middleware, AuthContext/ProtectedRoute, profile, course list, lesson reader, lesson completion, course progress view, append-only lesson attempts.

**Cut order if behind:** offline sync → push notifications → admin CRUD UI → certificate PDF.
`,
};
