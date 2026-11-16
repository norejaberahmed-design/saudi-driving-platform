import Link from "next/link";
import { learningCategories } from "@/lib/platform";

const highlights = [
  { number: "01", title: "أكاديمية الطريق والسلامة", description: "تعلم الإشارات والقيادة الوقائية وسلامة المشاة والتعامل مع المخاطر والطوارئ.", href: "/learn", action: "ابدأ التعلم" },
  { number: "02", title: "اختبارات ومواقف مرورية", description: "تدرب على أسئلة أصلية، وافهم لماذا يكون القرار آمناً أو خطراً.", href: "/quiz", action: "اختبر فهمك" },
  { number: "03", title: "دليل إجراءات الرخصة", description: "راجع المسار الإرشادي ومصادر التحقق الرسمية في المملكة.", href: "/license-guide", action: "اعرف الإجراءات" }
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
        <div className="eyebrow"><span className="pulse" /> السلامة أولاً في كل رحلة</div>
        <h1>افهم الطريق.<br/><em>واحْمِ نفسك والآخرين.</em></h1>
        <p className="hero-lead">منصة تعليمية سعودية مستقلة لا تكتفي بحفظ أسئلة الرخصة. تتعلم فيها قراءة الطريق، وتوقع المخاطر، واحترام جميع مرتاديه، والاستعداد للتدريب العملي والاختبار.</p>
        <div className="hero-actions"><Link className="button button-primary" href="/learn">ابدأ رحلة التعلم <span>←</span></Link><Link className="button button-quiet" href="/quiz">اختبر معلوماتك</Link></div>
        <div className="trust-line"><span className="shield">✓</span> لا نطلب بيانات أبشر · مصادر واضحة · نتائج تدريبية</div>
      </div>
      <div className="hero-art" aria-label="رسم توضيحي لطريق يقود إلى وجهة"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="sun-disc"/><div className="road-scene"><div className="road-line"/><div className="road-center"/><div className="road-sign"><span>قف</span></div><div className="destination"><span>وجهتك</span><b>●</b></div></div><div className="art-caption"><span className="caption-dot"/> تعلّم خطوة بخطوة</div></div>
    </section>
    <section className="stats-strip"><div className="stat"><strong>9</strong><span>محاور تعلم وسلامة</span><small>من الإشارات إلى سلوك السائق</small></div><div className="stat"><strong>24</strong><span>سؤالاً تدريبياً أولياً</span><small>تُصحح الإجابات على الخادم</small></div><div className="stat"><strong>3</strong><span>مسارات مساندة</span><small>تعلم، اختبار، وإرشاد للرخصة</small></div></section>
    <section className="section-block"><div className="section-heading"><div><span className="section-kicker">منصة واحدة لرحلتك</span><h2>كل ما تحتاجه لتستعد بوعي</h2><p>تعلم المعلومة، افهم الخطر، ثم اختبر قدرتك على اتخاذ القرار.</p></div></div><div className="feature-grid">{highlights.map(item=><article className="feature-card" key={item.number}><span className="feature-number">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p><Link href={item.href}>{item.action} ←</Link></article>)}</div></section>
    <section className="paths-section"><div className="section-heading"><div><span className="section-kicker">منهج شامل</span><h2>محاور التعلم التسعة</h2><p>السلامة أساس المنهج، والمسار السعودي هو المرجع الأول للقواعد والإجراءات.</p></div></div><div className="category-grid">{learningCategories.map((category,index)=><article className="category-card" key={category.id}><span className="category-index">0{index+1}</span><span className="category-icon">{category.icon}</span><h3>{category.title}</h3><p>{category.description}</p><span className="category-arrow">←</span></article>)}</div></section>
    <section className="method-section"><div className="method-copy"><span className="section-kicker">الثقة والسلامة أولاً</span><h2>لا نحفظك الإجابة.<br/>نعلّمك كيف تتصرف.</h2><p>نفصل بين القاعدة النظامية السعودية ومبدأ السلامة العام. نوضح المصدر، ولا ندّعي أن إكمال التطبيق يثبت مهارة القيادة العملية.</p></div><div className="principles-list">{["محتوى تدريبي أصلي وليس بنك أسئلة حكومياً","التصحيح يتم على الخادم ولا نكشف الإجابة قبل التسليم","احفظ تقدمك عبر حسابك الشخصي","لا نطلب كلمات مرور أبشر أو رموز التحقق","التدريب العملي مع مدرب مؤهل ضروري لإثبات المهارة"].map((item,index)=><div className="principle" key={item}><span>0{index+1}</span><p>{item}</p><b>✓</b></div>)}</div></section>
    <section className="disclaimer"><span>تنويه مهم</span><p>مسار الرخصة منصة تعليمية مستقلة وليست جهة حكومية. لا تصدر الرخص ولا تحجز الاختبارات نيابة عن الجهات الرسمية. المتطلبات والرسوم والمواعيد قد تتغير؛ تحقق منها عبر القنوات الحكومية الرسمية.</p></section>
    <footer className="footer"><Link className="brand footer-brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><span>التعلّم مسؤولية، والسلامة أولوية.</span><span>© {new Date().getFullYear()} مسار الرخصة</span></footer>
  </main>;
}