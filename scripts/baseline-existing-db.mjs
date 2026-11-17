import { PrismaClient } from "@prisma/client";
import { execFileSync } from "node:child_process";

const prisma = new PrismaClient();
const initialMigration = "20261116000100_initial";
const expectedColumns = {
  Account: ["id","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","createdAt","updatedAt"],
  Lesson: ["id","slug","title","summary","category","level","durationMinutes","content","status","lastReviewedAt","createdAt","updatedAt"],
  LessonProgress: ["id","userId","lessonId","completedAt"],
  LessonSource: ["lessonId","sourceId"],
  QuizAnswer: ["id","attemptId","questionId","selectedIndex","isCorrect"],
  QuizAttempt: ["id","userId","visitorKey","score","correctCount","totalCount","completedAt"],
  QuizQuestion: ["id","prompt","choices","correctIndex","explanation","category","difficulty","status","sourceNote","createdAt","updatedAt"],
  Session: ["id","expiresAt","token","createdAt","updatedAt","ipAddress","userAgent","userId"],
  Source: ["id","title","url","publisher","isOfficial","reviewedAt","notes","createdAt"],
  User: ["id","name","email","emailVerified","image","createdAt","updatedAt"],
  Verification: ["id","identifier","value","expiresAt","createdAt","updatedAt"]
};

async function main() {
  const rows = await prisma.$queryRaw`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name <> '_prisma_migrations'
    ORDER BY table_name, ordinal_position
  `;
  const actual = new Map();
  for (const row of rows) {
    const columns = actual.get(row.table_name) ?? [];
    columns.push(row.column_name);
    actual.set(row.table_name, columns);
  }

  if (actual.size === 0) {
    console.log("No existing application tables; Prisma will apply all migrations normally.");
    return;
  }

  const expectedNames = Object.keys(expectedColumns).sort();
  const actualNames = [...actual.keys()].sort();
  if (JSON.stringify(actualNames) !== JSON.stringify(expectedNames)) {
    throw new Error("Existing database tables do not exactly match the known initial schema. Refusing to baseline automatically.");
  }
  for (const [table, expected] of Object.entries(expectedColumns)) {
    const actualColumns = actual.get(table) ?? [];
    if (JSON.stringify(actualColumns) !== JSON.stringify(expected)) {
      throw new Error(`Existing table ${table} does not match the known initial schema. Refusing to baseline automatically.`);
    }
  }

  const migrationTable = await prisma.$queryRaw`
    SELECT to_regclass('public."_prisma_migrations"') IS NOT NULL AS exists
  `;
  if (migrationTable[0]?.exists) {
    const history = await prisma.$queryRaw`
      SELECT migration_name, finished_at FROM public."_prisma_migrations"
    `;
    const initialRecord = history.find(row => row.migration_name === initialMigration);
    if (initialRecord?.finished_at) {
      console.log("Initial migration is already recorded; no baseline action needed.");
      return;
    }
    if (initialRecord && !initialRecord.finished_at) {
      throw new Error("The initial migration has an unfinished history record. Manual review is required.");
    }
    if (history.length > 0) {
      throw new Error("Prisma migration history exists but does not contain the expected baseline. Manual review is required.");
    }
  }

  console.log("Verified the existing 11-table schema. Recording the initial migration as applied without changing application data.");
  execFileSync("npx", ["prisma", "migrate", "resolve", "--applied", initialMigration], { stdio: "inherit" });
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
