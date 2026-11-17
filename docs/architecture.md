# Architecture overview

## Runtime
- Next.js App Router and React Server Components for the web experience.
- Route Handlers under `app/api` for server-side APIs.
- PostgreSQL as the persistent relational store.
- Prisma 6 as the ORM and migration system.
- Better Auth for email/password accounts and database-backed sessions.
- Zod for server-side request validation.

## Core domains
- Identity: user, session, account, verification.
- Learning: lesson, source, lesson-source, lesson progress.
- Assessment: published question bank, attempts, individual answers, and saved wrong-answer review.
- Learner analytics: category-level weak-area summaries across general and traffic-device exams.
- Traffic-device learning: PostgreSQL-backed starter catalogue, server-side answer keys, device attempts, and individual responses.
- License guidance: public informational pages linking to official channels.

## Security boundaries
- Correct answers for the database-backed quiz and traffic-device exams are only read by the server during grading.
- Public traffic-device reads explicitly omit the answer index and explanation; those are returned only after a validated submission.
- Better Auth refuses to initialize if BETTER_AUTH_SECRET is missing or shorter than 32 characters.
- Quiz submissions are validated and graded server-side.
- Authenticated attempt history is associated with the verified session user.
- The data access helper is server-only.
- Public DTOs omit answer keys, password hashes, tokens, and internal source notes.
- Never collect Absher passwords, OTPs, national IDs, or unnecessary personal information.
- Do not treat client-supplied visitor identifiers as authentication.

## Content governance
- Draft lessons and questions are not exposed by public queries.
- Only records explicitly marked `published` are returned.
- Official requirements need a source URL, reviewed date, and human review before publication.
- Training questions must be original and must not be represented as actual government exam questions.
- Content must be reviewed when the referenced law or service changes.

## Environment
Copy `.env.example` to `.env`, set a PostgreSQL URL and a random Better Auth secret of at least 32 characters. Do not commit secrets.


## API contracts
- `GET /api/lessons?category=...`: published lesson summaries and source metadata; includes completion state for the signed-in learner.
- `GET /api/lessons/:slug`: one published lesson and its source references.
- `GET /api/quiz?count=20&category=...`: randomized public questions and available category counts; never returns answer keys.
- `POST /api/quiz`: validates unique question selections, grades on the server and persists the attempt.
- `GET /api/attempts`: authenticated learner's recent attempt history with answer review data.
- `GET /api/traffic-devices?group=...`: published traffic-device study cards; answer keys are excluded.
- `POST /api/traffic-devices/attempt`: validates and grades the traffic-device exam on the server and persists the result.

## Database rollout
The traffic-device tables are additive. Apply migrations with `npm run db:deploy`, then run the idempotent seed command with `npm run db:seed`. Do not reset or drop existing tables. The starter catalogue is not an exhaustive official Saudi inventory.
