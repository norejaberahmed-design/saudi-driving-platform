import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/app/dashboard/sign-out-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [attempts, attemptCount, progressCount, answers] = await Promise.all([
    prisma.quizAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
      take: 5,
      select: { id: true, score: true, correctCount: true, totalCount: true, completedAt: true }
    }),
    prisma.quizAttempt.count({ where: { userId: session.user.id } }),
    prisma.lessonProgress.count({ where: { userId: session.user.id } }),
    prisma.quizAnswer.findMany({
      where: { attempt: { userId: session.user.id } },
      orderBy: { attempt: { completedAt: "desc" } },
      take: 300,
      select: { isCorrect: true, question: { select: { category: true } } }
    })
  ]);
  const average = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length) : 0;
  const categoryStats = new Map<string, { total: number; correct: number }>();
  for (const answer of answers) {
    const stat = categoryStats.get(answer.question.category) ?? { total: 0, correct: 0 };
    stat.total += 1;
    if (answer.isCorrect) stat.correct += 1;
    categoryStats.set(answer.question.category, stat);
  }
  const weakAreas = [...categoryStats.entries()]
    .map(([name, stat]) => ({ name, total: stat.total, accuracy: Math.round(stat.correct / stat.total * 100) }))
    .filter(item => item.total >= 2)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 4);

  return <main className="dashboard-shell">
    <header className="dashboard-header"><Link className="brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><SignOutButton /></header>
    <section className="dashboard-welcome"><span className="section-kicker">مساحة المتعلم</span><h1>أهلاً، {session.user.name}</h1><p>هذه مساحتك لمتابعة التعلم والاستعداد بثقة.</p></section>
    <div className="dashboard-stats"><article><strong>{attemptCount}</strong><span>اختبارات مكتملة</span></article><article><strong>{average}%</strong><span>متوسط آخر 5 اختبارات</span></article><article><strong>{progressCount}</strong><span>دروس أتممتها</span></article></div>
    <section className="dashboard-actions">
      <Link href="/quiz" className="dashboard-action"><span>01</span><div><h2>اختبار تجريبي متنوع</h2><p>اختر المجال وعدد الأسئلة وراجع الإجابات بعد التصحيح.</p></div><b>←</b></Link>
      <Link href="/signs" className="dashboard-action"><span>02</span><div><h2>موسوعة الإشارات والعلامات</h2><p>تعرف على أجهزة الطريق وتدرّب على تمييزها.</p></div><b>←</b></Link>
      <Link href="/learn" className="dashboard-action"><span>03</span><div><h2>الأكاديمية والدروس</h2><p>تابع الدروس المنظمة واحفظ تقدمك في حسابك.</p></div><b>←</b></Link>
      <Link href="/license-guide" className="dashboard-action"><span>04</span><div><h2>دليل إجراءات الرخصة</h2><p>تعرّف على المسارات العامة ومصادر التحقق الرسمية.</p></div><b>←</b></Link>
    </section>
    {weakAreas.length > 0 && <section className="attempts-panel"><h2>المجالات التي تحتاج مراجعة</h2><p className="dashboard-footnote">مبنية على إجاباتك المسجلة في آخر 300 إجابة، وليست تقييماً رسمياً لمهارة القيادة.</p>{weakAreas.map(item=><div className="weak-area" key={item.name}><div><strong>{item.name}</strong><span>{item.accuracy}% · {item.total} إجابات</span></div><div className="weak-track"><i style={{width:`${item.accuracy}%`}} /></div></div>)}</section>}
    <section className="attempts-panel"><h2>آخر محاولاتك</h2>{attempts.length ? attempts.map(item=><div className="attempt-row" key={item.id}><span>{item.correctCount} من {item.totalCount} إجابات صحيحة</span><strong>{item.score}%</strong><time>{new Intl.DateTimeFormat("ar-SA",{dateStyle:"medium"}).format(item.completedAt)}</time></div>) : <p className="empty-state">لم تبدأ اختباراً بعد. ابدأ باختبار قصير لتكوين سجل تقدمك.</p>}</section>
    <p className="dashboard-footnote">نتائج المنصة تدريبية ولا تمثل درجة اختبار حكومي أو ضماناً للنجاح.</p>
  </main>;
}
