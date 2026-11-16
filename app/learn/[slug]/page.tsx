import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CompleteButton from "@/app/learn/[slug]/complete-button";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await prisma.lesson.findFirst({
    where: { slug, status: "published" },
    include: { sources: { include: { source: true } } }
  });
  if (!lesson) notFound();
  return <main className="dashboard-shell"><header className="dashboard-header"><Link className="brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><Link className="text-link" href="/learn">كل الدروس ←</Link></header><article className="lesson-detail"><span className="section-kicker">{lesson.category} · {lesson.level}</span><h1>{lesson.title}</h1><p className="lesson-summary">{lesson.summary}</p><div className="lesson-content">{lesson.content.split("\\n").map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div><CompleteButton slug={lesson.slug} /><section className="source-list"><h2>مصادر المراجعة</h2>{lesson.sources.map(({source})=><a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗ <small>{source.publisher}</small></a>)}</section></article></main>;
}