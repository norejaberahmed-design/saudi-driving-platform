import { learningCategories, starterLessons, platformPrinciples } from "@/lib/platform";

const stats = [
  { value: "5", label: "مسارات تعليمية", note: "تغطي أساسيات القيادة" },
  { value: "3", label: "دروس تأسيسية", note: "محتوى أولي قابل للتوسع" },
  { value: "∞", label: "فرص للتدرب", note: "تعلّم على وتيرتك" }
];

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="مسار الرخصة - الرئيسية">
          <span className="brand-mark">م</span>
          <span><strong>مسار الرخصة</strong><small>تعلّم بثقة، وقد بأمان</small></span>
        </a>
        <nav className="main-nav" aria-label="التنقل الرئيسي">
          <a href="#academy">الأكاديمية</a>
          <a href="#paths">المسارات</a>
          <a href="#about">عن المنصة</a>
        </nav>
        <a className="top-action" href="#academy">ابدأ التعلم <span aria-hidden="true">←</span></a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> رحلتك نحو قيادة أكثر وعياً</div>
          <h1>استعد للطريق.<br /><em>وافهم كل خطوة.</em></h1>
          <p className="hero-lead">منصة تعليمية تساعدك على فهم قواعد المرور في المملكة، والتدرّب على المواقف، والاستعداد لاختبار القيادة بخطة تناسب مستواك.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#academy">ابدأ رحلتك التعليمية <span>←</span></a>
            <a className="button button-quiet" href="#paths">اكتشف المسارات</a>
          </div>
          <div className="trust-line"><span className="shield">✓</span> محتوى توعوي مستقل · خصوصيتك أولاً · تعلّم وفق مستواك</div>
        </div>
        <div className="hero-art" aria-label="رسم توضيحي لطريق يقود إلى وجهة">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="sun-disc" />
          <div className="road-scene">
            <div className="road-line" />
            <div className="road-center" />
            <div className="road-sign"><span>قف</span></div>
            <div className="destination"><span>وجهتك</span><b>●</b></div>
          </div>
          <div className="art-caption"><span className="caption-dot" /> تعلّم خطوة بخطوة</div>
        </div>
      </section>

      <section className="stats-strip" aria-label="ملخص المنصة">
        {stats.map((stat) => <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.note}</small></div>)}
      </section>

      <section className="section-block" id="academy">
        <div className="section-heading">
          <div><span className="section-kicker">ابدأ من هنا</span><h2>أكاديمية القيادة</h2><p>محتوى مرتب يساعدك على بناء المعرفة من الأساس إلى التطبيق.</p></div>
          <a className="text-link" href="#paths">جميع المسارات <span>←</span></a>
        </div>
        <div className="lesson-grid">
          {starterLessons.map((lesson, index) => (
            <article className="lesson-card" key={lesson.id}>
              <div className="lesson-top"><span className="lesson-number">0{index + 1}</span><span className="lesson-level">{lesson.level}</span></div>
              <div className="lesson-icon">{["◉", "↗", "⌁"][index]}</div>
              <h3>{lesson.title}</h3><p>{lesson.description}</p>
              <div className="lesson-footer"><span>◷ {lesson.durationMinutes} دقائق</span><span className="lesson-soon">قريباً <b>←</b></span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="paths-section" id="paths">
        <div className="section-heading">
          <div><span className="section-kicker">منهج شامل</span><h2>مساراتك التعليمية</h2><p>خمسة محاور تأسيسية، تتوسع بمحتوى موثق ومراجَع.</p></div>
        </div>
        <div className="category-grid">
          {learningCategories.map((category, index) => (
            <article className="category-card" key={category.id}>
              <span className="category-index">0{index + 1}</span><span className="category-icon">{category.icon}</span>
              <h3>{category.title}</h3><p>{category.description}</p><span className="category-arrow">←</span>
            </article>
          ))}
        </div>
      </section>

      <section className="method-section" id="about">
        <div className="method-copy"><span className="section-kicker">ثقة قبل الاختبار</span><h2>المعرفة الصحيحة<br />تبدأ من مصدر موثوق.</h2><p>نبني المنصة على محتوى تعليمي واضح، ونفصل بين التوعية المرورية والمعلومات النظامية التي تحتاج إلى مراجعة رسمية مستمرة.</p></div>
        <div className="principles-list">{platformPrinciples.map((principle, i) => <div className="principle" key={principle}><span>0{i + 1}</span><p>{principle}</p><b>✓</b></div>)}</div>
      </section>

      <section className="disclaimer"><span>تنويه مهم</span><p>مسار الرخصة منصة تعليمية مستقلة وليست جهة حكومية. لا تصدر الرخص ولا تحجز الاختبارات نيابة عن الجهات الرسمية. يجب الرجوع إلى القنوات الحكومية للتحقق من المتطلبات والإجراءات المحدثة.</p></section>

      <footer className="footer"><a className="brand footer-brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></a><span>التعلّم مسؤولية، والسلامة أولوية.</span><span>© {new Date().getFullYear()} مسار الرخصة</span></footer>
    </main>
  );
}