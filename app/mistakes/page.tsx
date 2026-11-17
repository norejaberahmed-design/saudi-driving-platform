import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function choicesFromJson(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export default async function MistakesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [quizMistakes, deviceMistakes] = await Promise.all([
    prisma.quizAnswer.findMany({
      where: { isCorrect: false, attempt: { userId: session.user.id } },
      orderBy: { attempt: { completedAt: "desc" } },
      take: 100,
      select: {
        id: true,
        selectedIndex: true,
        question: { select: { prompt: true, choices: true, correctIndex: true, explanation: true, category: true } }
      }
    }),
    prisma.trafficDeviceAnswer.findMany({
      where: { isCorrect: false, attempt: { userId: session.user.id } },
      orderBy: { attempt: { completedAt: "desc" } },
      take: 100,
      select: {
        id: true,
        selectedIndex: true,
        device: { select: { title: true, question: true, choices: true, answer: true, explanation: true, group: true } }
      }
    })
  ]);

  const mistakes = [
    ...quizMistakes.map(item => {
      const choices = choicesFromJson(item.question.choices);
      return {
        id: "quiz-" + item.id,
        title: item.question.prompt,
        category: item.question.category,
        selected: choices[item.selectedIndex] ?? "إجابة غير متاحة",
        correct: choices[item.question.correctIndex] ?? "الإجابة غير متاحة",
        explanation: item.question.explanation
      };
    }),
    ...deviceMistakes.map(item => {
      const choices = choicesFromJson(item.device.choices);
      return {
        id: "device-" + item.id,
        title: item.device.title + ": " + item.device.question,
        category: item.device.group,
        selected: choices[item.selectedIndex] ?? "إجابة غير متاحة",
        correct: choices[item.device.answer] ?? "الإجابة غير متاحة",
        explanation: item.device.explanation
      };
    })
  ];

  return <main className="dashboard-shell">
    <header className="dashboard-header"><Link className="brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><Link className="text-link" href="/dashboard">مساحة المتعلم ←</Link></header>
    <section className="dashboard-welcome"><span className="section-kicker">مراجعة الأخطاء</span><h1>تعلّم من إجاباتك السابقة</h1><p>هذه مراجعة خاصة بمحاولاتك المحفوظة في حسابك. أعد قراءة التفسير ثم جرّب الاختبار مرة أخرى.</p></section>
    <div className="mistakes-summary"><strong>{mistakes.length}</strong><span>إجابة غير صحيحة مسجلة في آخر 100 خطأ من كل نوع اختبار</span></div>
    {mistakes.length ? <div className="mistakes-list">{mistakes.map((item,index)=><article className="mistake-card" key={item.id}><div className="question-meta"><span>مراجعة {index+1}</span><span>{item.category}</span></div><h2>{item.title}</h2><p className="mistake-selected"><strong>إجابتك:</strong> {item.selected}</p><p className="mistake-correct"><strong>الإجابة الصحيحة:</strong> {item.correct}</p><p>{item.explanation}</p></article>)}</div> : <div className="notice-panel">لا توجد أخطاء محفوظة بعد. ابدأ اختباراً تدريبياً وستظهر هنا الإجابات التي تحتاج إلى مراجعة.</div>}
    <div className="hero-actions"><Link className="button button-primary" href="/quiz">ابدأ اختباراً جديداً</Link><Link className="button button-quiet" href="/signs">تدرب على الإشارات</Link></div>
  </main>;
}
