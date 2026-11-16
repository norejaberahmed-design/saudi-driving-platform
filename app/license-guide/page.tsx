import Link from "next/link";

const paths = [
  { title: "إصدار رخصة لأول مرة", text: "ابدأ بالتحقق من الشروط والفئة المناسبة، ثم راجع خطوات التدريب والتقييم عبر القنوات الرسمية.", url: "https://www.absher.sa/wps/portal/individuals/static/guide/service-contents/" },
  { title: "تجديد رخصة القيادة", text: "تحقق من صلاحية الرخصة والمتطلبات والرسوم وأي فحوصات لازمة من خلال الخدمات الرسمية.", url: "https://www.absher.sa/wps/portal/individuals/static/guide/service-contents/" },
  { title: "استبدال أو الاعتراف برخصة أجنبية", text: "تختلف الإجراءات بحسب الدولة ونوع الرخصة وحالتها. لا تعتمد على تجربة شخص آخر؛ تحقق من الجهة الرسمية.", url: "https://www.moi.gov.sa/" },
  { title: "التدريب ومدارس القيادة", text: "استعرض قنوات الجهات المرخصة وتحقق من المواعيد والمتطلبات قبل الحضور.", url: "https://www.absher.sa/wps/portal/individuals/static/guide/service-contents/" }
];

export const metadata = { title: "دليل إجراءات الرخصة" };

export default function LicenseGuidePage() {
  return <main className="dashboard-shell"><header className="dashboard-header"><Link className="brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><Link className="text-link" href="/dashboard">مساحة المتعلم ←</Link></header><section className="dashboard-welcome"><span className="section-kicker">دليل الإجراءات</span><h1>اعرف مسارك قبل أن تبدأ</h1><p>معلومات إرشادية عامة تساعدك على الوصول إلى الجهة الصحيحة، وليست بديلاً عن التحقق من حالتك عبر القنوات الرسمية.</p></section><div className="guide-grid">{paths.map((path,index)=><article className="guide-card" key={path.title}><span>0{index+1}</span><h2>{path.title}</h2><p>{path.text}</p><a href={path.url} target="_blank" rel="noreferrer">تحقق من القناة الرسمية ↗</a></article>)}</div><div className="notice-panel">تنبيه: لا تدخل كلمة مرور أبشر أو رمز التحقق في هذه المنصة. لا ننفذ معاملات أو حجوزات حكومية ولا نعرض رسوماً أو شروطاً غير موثقة.</div></main>;
}