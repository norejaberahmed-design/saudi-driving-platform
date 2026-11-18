import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/dal";
import SchoolExperience from "./school-experience";

export const dynamic = "force-dynamic";
export const metadata = { title: "مدرسة القيادة الرقمية" };

export default async function DrivingSchoolPage() {
  const session = await getSession();
  const userId = session?.user.id;
  let accountLessonsCompleted = 0;
  let latestQuizScore: number | null = null;

  if (userId) {
    const [completedCount, latestAttempt] = await Promise.all([
      prisma.lessonProgress.count({ where: { userId } }),
      prisma.quizAttempt.findFirst({
        where: { userId },
        orderBy: { completedAt: "desc" },
        select: { score: true }
      })
    ]);
    accountLessonsCompleted = completedCount;
    latestQuizScore = latestAttempt?.score ?? null;
  }

  return <SchoolExperience
    learnerName={session?.user.name ?? "بالمتعلم"}
    accountLessonsCompleted={accountLessonsCompleted}
    latestQuizScore={latestQuizScore}
  />;
}
