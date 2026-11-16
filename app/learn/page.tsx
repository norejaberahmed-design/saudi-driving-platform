import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "الأكاديمية" };

export default async function LearnPage() {
  const lessons = await prisma.lesson.findMany({
    where: { status: "published" },
    orderBy: [{ category: "asc" }, { createdAt: "asc" }],
    select: { id: true, slug: true, title: true, summary: true, category: true, level: true, durationMinutes: true }
  });
  return <main className="dashboard-shell"><header className="dashboard-header"><Link className="brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><Link className="text-link" href="/dashboard">مساحة المتعلم ←</Link></header><section className="dashboard-welcome"><span className="section-kicker">الأكاديمية</span><h1>تعلّم على خطوات</h1><p>دروس قصيرة منظمة، ولا يظهر هنا إلا المحتوى الذي اجتاز المراجعة والنشر.</p></section>{lessons.length ? <div className="lesson-grid">{lessons.map((lesson,index)=><article className="lesson-card" key={lesson.id}><div className="lesson-top"><span className="lesson-number">0{index+1}</span><span className="lesson-level">{lesson.level}</span></div><h3>{lesson.title}</h3><p>{lesson.summary}</p><div className="lesson-footer"><span>{lesson.category} · {lesson.durationMinutes} دقائق</span><Link href={`/learn/${lesson.slug}`} className="text-link">ابدأ ←</Link></div></article>)}</div> : <div className="notice-panel">يجري تجهيز الدروس ومراجعة مصادرها. لن ننشر معلومات نظامية قبل توثيقها والتحقق من تاريخها.</div>}<p className="dashboard-footnote">المحتوى المنشور يخضع لمراجعة تحريرية ومصدرية، ويمكن تحديثه عند تغير المتطلبات.</p></main>;
}