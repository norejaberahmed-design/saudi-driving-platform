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
- Assessment: published question bank, attempts, and individual answers.
- License guidance: public informational pages linking to official channels.

## Security boundaries
- Correct answers are only read by the server during grading.
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
