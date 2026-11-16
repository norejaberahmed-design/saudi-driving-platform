CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "token" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Account" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP(3),
  "refreshTokenExpiresAt" TIMESTAMP(3),
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Verification" (
  "id" TEXT NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Lesson" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "level" TEXT NOT NULL DEFAULT 'مبتدئ',
  "durationMinutes" INTEGER NOT NULL DEFAULT 5,
  "content" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "lastReviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Source" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "publisher" TEXT NOT NULL,
  "isOfficial" BOOLEAN NOT NULL DEFAULT false,
  "reviewedAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "LessonSource" (
  "lessonId" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  CONSTRAINT "LessonSource_pkey" PRIMARY KEY ("lessonId","sourceId")
);
CREATE TABLE "QuizQuestion" (
  "id" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "choices" JSONB NOT NULL,
  "correctIndex" INTEGER NOT NULL,
  "explanation" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "difficulty" TEXT NOT NULL DEFAULT 'مبتدئ',
  "status" TEXT NOT NULL DEFAULT 'draft',
  "sourceNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QuizAttempt" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "visitorKey" TEXT,
  "score" INTEGER NOT NULL,
  "correctCount" INTEGER NOT NULL,
  "totalCount" INTEGER NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QuizAnswer" (
  "id" TEXT NOT NULL,
  "attemptId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "selectedIndex" INTEGER NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,
  CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "LessonProgress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE INDEX "Verification_identifier_idx" ON "Verification"("identifier");
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");
CREATE UNIQUE INDEX "LessonSource_lessonId_sourceId_key" ON "LessonSource"("lessonId","sourceId");
CREATE INDEX "QuizQuestion_category_status_idx" ON "QuizQuestion"("category","status");
CREATE INDEX "QuizAttempt_userId_completedAt_idx" ON "QuizAttempt"("userId","completedAt");
CREATE INDEX "QuizAttempt_visitorKey_completedAt_idx" ON "QuizAttempt"("visitorKey","completedAt");
CREATE INDEX "QuizAnswer_attemptId_idx" ON "QuizAnswer"("attemptId");
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId","lessonId");
CREATE INDEX "LessonProgress_userId_idx" ON "LessonProgress"("userId");
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LessonSource" ADD CONSTRAINT "LessonSource_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LessonSource" ADD CONSTRAINT "LessonSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;