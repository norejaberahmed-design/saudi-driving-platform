import Link from "next/link";
import { learningCategories } from "@/lib/platform";

const highlights = [
  { number: "01", title: "أكاديمية القيادة", description: "دروس قصيرة ومنظمة لفهم قواعد الطريق ومبادئ القيادة الآمنة.", href: "/learn", action: "استكشف الدروس" },
  { number: "02", title: "اختبارات تدريبية", description: "أجب عن أسئلة أصلية، واعرف نتيجتك، وافهم سبب صحة كل إجابة.", href: "/quiz", action: "ابدأ الاختبار" },
  { number: "03", title: "دليل إجراءات الرخصة", description: "تعرف على مسارات الإصدار والتجديد والرخص الأجنبية ومصادر التحقق.", href: "/license-guide", action: "اعرف الإجراءات" }
];

export default function HomePage() {
  return <main className="site-shell">
    <header className="topbar">
      <Link className="brand" href="/" aria-label="مسار الرخصة - الرئيسية"><span className="brand-mark">م</span><span><strong>مسار الرخصة</strong><small>تعلّم بثقة، وقد بأمان</small></span></Link>
      <nav className="main-nav" aria-label="التنقل الرئيسي"><Link href="/learn">الأكاديمية</Link><Link href="/quiz">الاختبارات</Link><Link href="/license-guide">إجراءات الرخصة</Link></nav>
      <Link className="top-action" href="/dashboard">مساحة المتعلم <span>←</span></Link>
    </header>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="pulse" /> رحلتك نحو قيادة أكثر وعياً</div>
        <h1>استعد للطريق.<br/><em>وافهم كل خطوة.</em></h1>
        <p className="hero-lead">منصة تعليمية سعودية مستقلة تجمع التعلم النظري، والتدريب، ودليل إجراءات الرخصة في مكان واحد. ابدأ من مستواك، وتقدم خطوة بخطوة.</p>
        <div className="hero-actions"><Link className="button button-primary" href="/quiz">ابدأ اختباراً تدريبياً <span>←</span></Link><Link className="button button-quiet" href="/license-guide">دليل إصدار الرخصة</Link></div>
        <div className="trust-line"><span className="shield">✓</span> لا نطلب بيانات أبشر · مصادر واضحة · نتائج تدريبية</div>
      </div>
      <div className="hero-art" aria-label="رسم توضيحي لطريق يقود إلى وجهة"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="sun-disc"/><div className="road-scene"><div className="road-line"/><div className="road-center"/><div className="road-sign"><span>قف</span></div><div className="destination"><span>وجهتك</span><b>●</b></div></div><div className="art-caption"><span className="caption-dot"/> تعلّم خطوة بخطوة</div></div>
    </section>
    <section className="stats-strip"><div className="stat"><strong>5</strong><span>مسارات تعليمية</span><small>من الإشارات إلى أساسيات المركبة</small></div><div className="stat"><strong>6</strong><span>أسئلة تدريبية أولية</span><small>مع التصحيح والتفسير</small></div><div className="stat"><strong>3</strong><span>أنواع من المساعدة</span><small>تعلم، تدريب، وإرشاد للإجراءات</small></div></section>
    <section className="section-block"><div className="section-heading"><div><span className="section-kicker">منصة واحدة لرحلتك</span><h2>كل ما تحتاجه لتستعد بوعي</h2><p>ابدأ بالتعلم، اختبر فهمك، ثم تحقق من الإجراءات الرسمية.</p></div></div><div className="feature-grid">{highlights.map(item=><article className="feature-card" key={item.number}><span className="feature-number">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p><Link href={item.href}>{item.action} ←</Link></article>)}</div></section>
    <section className="paths-section"><div className="section-heading"><div><span className="section-kicker">منهج شامل</span><h2>المحاور التعليمية</h2><p>هيكل تعليمي قابل للتوسع بمحتوى سعودي موثق ومراجع.</p></div></div><div className="category-grid">{learningCategories.map((category,index)=><article className="category-card" key={category.id}><span className="category-index">0{index+1}</span><span className="category-icon">{category.icon}</span><h3>{category.title}</h3><p>{category.description}</p><span className="category-arrow">←</span></article>)}</div></section>
    <section className="method-section"><div className="method-copy"><span className="section-kicker">الثقة والسلامة أولاً</span><h2>معلومة واضحة.<br/>ومصدر يمكن الرجوع إليه.</h2><p>نفصل بين التوعية المرورية والمعلومة النظامية. كل معلومة إجرائية يجب أن ترتبط بمصدر رسمي وتاريخ مراجعة قبل اعتمادها.</p></div><div className="principles-list">{["محتوى تدريبي أصلي لا ينتحل أسئلة الاختبار الفعلي","التصحيح يتم على الخادم ولا نرسل الإجابة الصحيحة للمتصفح قبل التسليم","حساب مستقل بكلمة مرور خاصة بالمنصة","عدم طلب كلمات مرور أبشر أو رموز التحقق","لا وعود بالنجاح ولا ادعاء بأننا جهة حكومية"].map((item,index)=><div className="principle" key={item}><span>0{index+1}</span><p>{item}</p><b>✓</b></div>)}</div></section>
    <section className="disclaimer"><span>تنويه مهم</span><p>مسار الرخصة منصة تعليمية مستقلة وليست جهة حكومية. لا تصدر الرخص ولا تحجز الاختبارات نيابة عن الجهات الرسمية. المتطلبات والرسوم والمواعيد قد تتغير؛ تحقق منها عبر القنوات الحكومية الرسمية.</p></section>
    <footer className="footer"><Link className="brand footer-brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><span>التعلّم مسؤولية، والسلامة أولوية.</span><span>© {new Date().getFullYear()} مسار الرخصة</span></footer>
  </main>;
}