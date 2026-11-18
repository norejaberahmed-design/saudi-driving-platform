import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/app/dashboard/sign-out-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [attempts, progressCount] = await Promise.all([
    prisma.quizAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
      take: 5,
      select: { id: true, score: true, correctCount: true, totalCount: true, completedAt: true }
    }),
    prisma.lessonProgress.count({ where: { userId: session.user.id } })
  ]);
  const average = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length) : 0;

  return <main className="dashboard-shell">
    <header className="dashboard-header"><Link className="brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><SignOutButton /></header>
    <section className="dashboard-welcome"><span className="section-kicker">مساحة المتعلم</span><h1>أهلاً، {session.user.name}</h1><p>هذه مساحتك لمتابعة التعلم والاستعداد بثقة.</p></section>
    <div className="dashboard-stats"><article><strong>{attempts.length}</strong><span>اختبارات مكتملة</span></article><article><strong>{average}%</strong><span>متوسط نتائجك الأخيرة</span></article><article><strong>{progressCount}</strong><span>دروس أتممتها</span></article></div>
    <section className="dashboard-actions"><Link href="/school" className="dashboard-action"><span>00</span><div><h2>مدرسة القيادة الرقمية</h2><p>اختر فئة الرخصة وابدأ التقييم والخطة التعليمية التفاعلية.</p></div><b>←</b></Link><Link href="/quiz" className="dashboard-action"><span>01</span><div><h2>ابدأ اختباراً تدريبياً</h2><p>اختبر فهمك وتعرّف على الإجابات مع التفسير.</p></div><b>←</b></Link><Link href="/learn" className="dashboard-action"><span>02</span><div><h2>تابع الأكاديمية</h2><p>تعلّم الإشارات وقواعد الطريق والقيادة الآمنة.</p></div><b>←</b></Link><Link href="/license-guide" className="dashboard-action"><span>03</span><div><h2>دليل إجراءات الرخصة</h2><p>تعرّف على المسارات العامة ومصادر التحقق الرسمية.</p></div><b>←</b></Link></section>
    <section className="attempts-panel"><h2>آخر محاولاتك</h2>{attempts.length ? attempts.map(item=><div className="attempt-row" key={item.id}><span>{item.correctCount} من {item.totalCount} إجابات صحيحة</span><strong>{item.score}%</strong><time>{new Intl.DateTimeFormat("ar-SA",{dateStyle:"medium"}).format(item.completedAt)}</time></div>) : <p className="empty-state">لم تبدأ اختباراً بعد. ابدأ باختبار قصير لتكوين سجل تقدمك.</p>}</section>
    <p className="dashboard-footnote">نتائج المنصة تدريبية ولا تمثل درجة اختبار حكومي أو ضماناً للنجاح.</p>
  </main>;
}