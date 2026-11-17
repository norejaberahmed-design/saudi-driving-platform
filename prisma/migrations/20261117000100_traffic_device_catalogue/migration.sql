CREATE TABLE "TrafficDevice" (
  "id" TEXT NOT NULL,
  "group" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "meaning" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "context" TEXT NOT NULL,
  "shape" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "choices" JSONB NOT NULL,
  "answer" INTEGER NOT NULL,
  "explanation" TEXT NOT NULL,
  "officialReference" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TrafficDevice_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrafficDeviceAttempt" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "visitorKey" TEXT,
  "score" INTEGER NOT NULL,
  "correctCount" INTEGER NOT NULL,
  "totalCount" INTEGER NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TrafficDeviceAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrafficDeviceAnswer" (
  "id" TEXT NOT NULL,
  "attemptId" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "selectedIndex" INTEGER NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,
  CONSTRAINT "TrafficDeviceAnswer_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TrafficDevice_group_status_idx" ON "TrafficDevice"("group", "status");
CREATE INDEX "TrafficDeviceAttempt_userId_completedAt_idx" ON "TrafficDeviceAttempt"("userId", "completedAt");
CREATE INDEX "TrafficDeviceAttempt_visitorKey_completedAt_idx" ON "TrafficDeviceAttempt"("visitorKey", "completedAt");
CREATE INDEX "TrafficDeviceAnswer_attemptId_idx" ON "TrafficDeviceAnswer"("attemptId");
CREATE INDEX "TrafficDeviceAnswer_deviceId_idx" ON "TrafficDeviceAnswer"("deviceId");

ALTER TABLE "TrafficDeviceAttempt" ADD CONSTRAINT "TrafficDeviceAttempt_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrafficDeviceAnswer" ADD CONSTRAINT "TrafficDeviceAnswer_attemptId_fkey"
  FOREIGN KEY ("attemptId") REFERENCES "TrafficDeviceAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrafficDeviceAnswer" ADD CONSTRAINT "TrafficDeviceAnswer_deviceId_fkey"
  FOREIGN KEY ("deviceId") REFERENCES "TrafficDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
