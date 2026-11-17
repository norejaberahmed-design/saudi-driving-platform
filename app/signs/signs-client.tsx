"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Device = {
  id: string;
  group: "لوحات" | "علامات أرضية";
  title: string;
  meaning: string;
  action: string;
  context: string;
  shape: "stop" | "yield" | "circle" | "warning" | "line-solid" | "line-dash" | "crosswalk" | "stopline";
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
};

const devices: Device[] = [
  { id:"stop",group:"لوحات",title:"قف",meaning:"تطلب من السائق التوقف التام عند موضع الوقوف المحدد، ثم التحقق قبل المتابعة.",action:"توقف تماماً، راقب الطريق والمشاة، ولا تتحرك إلا عندما يصبح العبور آمناً.",context:"عند تقاطع أو مدخل طريق توجد عنده أولوية للآخرين.",shape:"stop",question:"ماذا تفعل عند رؤية لوحة قف؟",choices:["أخفف السرعة فقط وأتابع","أتوقف تماماً ثم أتحقق قبل المتابعة","أستخدم المنبه وأعبر"],answer:1,explanation:"المطلوب توقف تام، وليس مجرد تخفيف السرعة."},
  { id:"yield",group:"لوحات",title:"أعط الأفضلية",meaning:"تنبهك إلى ضرورة إفساح الطريق للمركبات أو مستخدمي الطريق أصحاب الأولوية بحسب الموقف.",action:"خفف السرعة واستعد للتوقف، وأفسح الطريق عند وجود حركة لها أولوية.",context:"عند مداخل الطرق والتقاطعات ومناطق اندماج الحركة.",shape:"yield",question:"متى تتوقف عند لوحة أعط الأفضلية؟",choices:["عندما يتطلب إفساح الطريق ذلك","في كل الأحوال لمدة عشر ثوانٍ","لا أتوقف مهما كانت الحركة"],answer:0,explanation:"تخفف السرعة وتفسح الطريق، وتتوقف إذا كان ذلك ضرورياً لإعطاء الأولوية بأمان."},
  { id:"speed",group:"لوحات",title:"السرعة القصوى",meaning:"تحدد الحد الأعلى للسرعة المسموح بها في المقطع الذي تنطبق عليه اللوحة.",action:"لا تتجاوز الرقم المحدد، وخفف أكثر إذا كانت ظروف الطريق تستدعي ذلك.",context:"على الطرق الحضرية والسريعة ومناطق السرعات الخاصة.",shape:"circle",question:"ماذا يعني الرقم داخل لوحة تحديد السرعة القصوى؟",choices:["سرعة مستهدفة يجب بلوغها","حد أعلى لا يجوز تجاوزه","الحد الأدنى للسرعة"],answer:1,explanation:"الرقم يحدد السرعة القصوى، وقد يلزم السير بسرعة أقل لأسباب السلامة."},
  { id:"no-entry",group:"لوحات",title:"ممنوع الدخول",meaning:"تحظر دخول المركبات من الاتجاه الذي تواجهه اللوحة.",action:"لا تدخل من هذا الاتجاه، وابحث عن مدخل مسموح.",context:"مداخل الشوارع ذات الاتجاه الواحد أو المداخل المقيدة.",shape:"circle",question:"أنت تواجه لوحة ممنوع الدخول عند مدخل شارع، ماذا تفعل؟",choices:["أدخل إذا لم أر مركبات","أدخل لمسافة قصيرة فقط","لا أدخل من هذا الاتجاه"],answer:2,explanation:"خلو الطريق لا يلغي المنع؛ يجب استخدام مدخل مسموح."},
  { id:"curve",group:"لوحات",title:"منعطف أمامك",meaning:"تحذير من تغير اتجاه الطريق ووجود منعطف يتطلب الانتباه.",action:"خفف السرعة قبل المنعطف، وابق في مسارك وتجنب الكبح أو الانعطاف الحاد.",context:"الطرق الجبلية والطرق المفتوحة ومقاطع المنحنيات.",shape:"warning",question:"متى تستعد لتخفيف السرعة عند التحذير من منعطف؟",choices:["قبل دخول المنعطف","بعد تجاوز منتصفه","فقط إذا توقفت المركبة أمامي"],answer:0,explanation:"الاستعداد والتخفيف يكونان قبل المنعطف لتتمكن من اجتيازه بثبات."},
  { id:"solid-line",group:"علامات أرضية",title:"خط متصل",meaning:"خط طولي يفصل المسارات أو يحدد حافة الطريق، وقد يقيّد عبوره بحسب موضعه ونظام الطريق.",action:"لا تعبر الخط المتصل أو تتجاوزه عندما يكون ذلك ممنوعاً؛ اتبع تخطيط المسار واللوحات المصاحبة.",context:"على سطح الطريق بين المسارات أو بجانب حافة الطريق.",shape:"line-solid",question:"ماذا تفعل عندما يفصل بينك وبين المسار المجاور خط متصل يمنع التجاوز؟",choices:["أعبره إذا استعجلت","أبقى في مساري ولا أتجاوزه","أعبره دون إشارة"],answer:1,explanation:"الخط المتصل الذي يمنع التجاوز لا يُعبر لتغيير المسار؛ اتبع التخطيط والإشارات."},
  { id:"dashed-line",group:"علامات أرضية",title:"خط متقطع",meaning:"يستخدم لتحديد المسارات، وقد يسمح بتغيير المسار عندما تكون المناورة آمنة ولا توجد علامة أو قاعدة تمنعها.",action:"تحقق من المرايا والنقطة العمياء، استخدم إشارة الانعطاف، ثم غيّر المسار إذا كان آمناً ومسموحاً.",context:"بين المسارات على الطرق متعددة المسارات.",shape:"line-dash",question:"هل وجود خط متقطع يعني أن تغيير المسار آمن تلقائياً؟",choices:["نعم دائماً","لا، يجب التحقق من السلامة والسماح بالمناورة","نعم دون استخدام الإشارة"],answer:1,explanation:"الخط المتقطع لا يعفي السائق من فحص الحركة والإشارة والتأكد من خلو المسار."},
  { id:"crosswalk",group:"علامات أرضية",title:"ممر المشاة",meaning:"منطقة مخصصة لعبور المشاة ومحددة بعلامات على سطح الطريق، وقد تصاحبها لوحات أو إشارات.",action:"خفف السرعة وراقب جانبي الطريق، وأفسح للمشاة العابرين وفق قواعد الأولوية.",context:"قرب المدارس والمرافق والتقاطعات والمناطق المأهولة.",shape:"crosswalk",question:"ما التصرف الآمن عند اقترابك من ممر مشاة ويوجد شخص يعبر؟",choices:["أزيد السرعة قبل وصوله","أفسح له الطريق وأتوقف عند الحاجة","أستخدم المنبه وأواصل"],answer:1,explanation:"يجب حماية المشاة وإفساح المجال لهم، لا الضغط عليهم أو مفاجأتهم."},
  { id:"stop-line",group:"علامات أرضية",title:"خط الوقوف",meaning:"خط عرضي يحدد الموضع الذي ينبغي أن تتوقف عنده المركبة عندما تتطلب الإشارة أو اللوحة التوقف.",action:"توقف قبل الخط ولا تتجاوزه أثناء وجوب التوقف، مع إبقاء ممر المشاة خالياً.",context:"قبل التقاطعات وإشارات المرور وممرات المشاة.",shape:"stopline",question:"أين تتوقف عندما تكون مطالباً بالتوقف ويوجد خط وقوف واضح؟",choices:["بعد الخط داخل التقاطع","قبل خط الوقوف","فوق ممر المشاة"],answer:1,explanation:"خط الوقوف يحدد موضع التوقف؛ لا تتجاوزه ولا تسد ممر المشاة."}
];

function DeviceVisual({device}:{device:Device}) {
  if (device.shape === "line-solid") return <div className="road-visual"><div className="road-asphalt"><i className="mark-solid"/></div></div>;
  if (device.shape === "line-dash") return <div className="road-visual"><div className="road-asphalt"><i className="mark-dashed"/></div></div>;
  if (device.shape === "crosswalk") return <div className="road-visual"><div className="road-asphalt"><i className="mark-crosswalk"/></div></div>;
  if (device.shape === "stopline") return <div className="road-visual"><div className="road-asphalt"><i className="mark-stopline"/></div></div>;
  return <div className="sign-visual">
    {device.shape==="stop" && <div className="sign-octagon">قف</div>}
    {device.shape==="yield" && <div className="sign-yield"><span>أعط الأفضلية</span></div>}
    {device.shape==="circle" && <div className={device.id==="speed"?"sign-speed":"sign-no-entry"}>{device.id==="speed"?"٨٠":<i/>}</div>}
    {device.shape==="warning" && <div className="sign-warning"><span>↶</span></div>}
  </div>;
}

export default function SignsClient() {
  const [tab,setTab]=useState<"تعلم"|"اختبر">("تعلم");
  const [group,setGroup]=useState<"الكل"|"لوحات"|"علامات أرضية">("الكل");
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<Record<string,number>>({});
  const [submitted,setSubmitted]=useState(false);
  const visible=useMemo(()=>devices.filter(d=>group==="الكل"||d.group===group),[group]);
  const score=devices.filter(d=>answers[d.id]===d.answer).length;
  const current=visible[index];
  function changeGroup(value:"الكل"|"لوحات"|"علامات أرضية"){setGroup(value);setIndex(0);setSubmitted(false);setAnswers({});}
  return <main className="signs-shell">
    <header className="quiz-header"><Link className="brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><Link href="/quiz" className="text-link">الاختبار النظري العام ←</Link></header>
    <section className="signs-intro"><span className="section-kicker">تدريب بصري للسائق</span><h1>اقرأ الطريق قبل أن تقوده</h1><p>تعرّف على اللوحات، ثم انتقل إلى العلامات المرسومة على سطح الطريق. تعلّم معناها وما يجب عليك فعله، وبعدها اختبر فهمك.</p></section>
    <div className="signs-toolbar"><div className="signs-tabs"><button className={tab==="تعلم"?"active":""} onClick={()=>{setTab("تعلم");setIndex(0);setSubmitted(false);}}>دليل العلامات</button><button className={tab==="اختبر"?"active":""} onClick={()=>{setTab("اختبر");setIndex(0);setSubmitted(false);}}>اختبار نظري</button></div><div className="signs-filters">{(["الكل","لوحات","علامات أرضية"] as const).map(v=><button key={v} className={group===v?"active":""} onClick={()=>changeGroup(v)}>{v}</button>)}</div></div>
    <div className="signs-count"><span>{group==="الكل"?"اللوحات والعلامات":group}</span><span>{visible.length} عناصر تدريبية في هذه الدفعة</span></div>
    {tab==="تعلم" ? <div className="device-grid">{visible.map(device=><article className="device-card" key={device.id}><div className="device-card-top"><span>{device.group}</span><span>مثال تعليمي</span></div><DeviceVisual device={device}/><h2>{device.title}</h2><p>{device.meaning}</p><div className="driver-action"><strong>تصرف السائق</strong><p>{device.action}</p></div><small>موقف على الطريق: {device.context}</small><button className="device-test-link" onClick={()=>{setTab("اختبر");setIndex(visible.findIndex(d=>d.id===device.id));}}>اختبر نفسك في هذه العلامة ←</button></article>)}</div> :
      <section className="device-exam">
        {!submitted ? <><div className="device-exam-head"><span>السؤال {index+1} من {visible.length}</span><span>{Object.keys(answers).length} إجابات</span></div><div className="exam-progress"><i style={{width:`${(Object.keys(answers).length/visible.length)*100}%`}}/></div><article className="device-question"><DeviceVisual device={current}/><span className="section-kicker">{current.group}</span><h2>{current.question}</h2><div className="device-options">{current.choices.map((choice,i)=><button key={i} className={answers[current.id]===i?"selected":""} onClick={()=>setAnswers(a=>({...a,[current.id]:i}))}><b>{["أ","ب","ج"][i]}</b>{choice}</button>)}</div><div className="exam-nav"><button disabled={index===0} onClick={()=>setIndex(i=>i-1)}>السابق</button><button disabled={answers[current.id]===undefined} onClick={()=>index===visible.length-1?setSubmitted(true):setIndex(i=>i+1)}>{index===visible.length-1?"إنهاء الاختبار":"التالي"}</button></div></article></> :
        <div className="device-results"><span className="section-kicker">نتيجة الدفعة التدريبية</span><strong className="device-score">{score} / {visible.length}</strong><p>إجابات صحيحة</p>{visible.map(d=><article key={d.id} className="device-review"><b>{answers[d.id]===d.answer?"✓":"×"} {d.title}</b><p>{d.explanation}</p></article>)}<button className="button button-primary" onClick={()=>{setAnswers({});setIndex(0);setSubmitted(false);}}>إعادة الاختبار</button></div>}
      </section>}
    <aside className="signs-note"><strong>ملاحظة عن دقة المحتوى</strong><p>هذه دفعة أولية برسوم توضيحية أصلية للتدريب على المفاهيم، وليست الكتالوج السعودي الكامل ولا صوراً رسمية معتمدة. يجري استكمال المطابقة لوحةً لوحة وعلامةً علامة مع الدليل السعودي SHC 602 قبل اعتمادها كمحتوى نهائي.</p></aside>
    <p className="quiz-disclaimer">اختبار تدريبي مستقل، وليس اختبار المرور الحكومي الفعلي ولا يضمن اجتيازه.</p>
  </main>;
}
