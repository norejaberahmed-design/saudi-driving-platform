"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Device } from "@/lib/traffic-devices";

type PublicDevice = Omit<Device, "answer"> & { officialReference: string | null };
type ExamResult = {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
  correctAnswer: string | null;
  isCorrect: boolean;
  explanation: string;
  title: string;
  prompt: string;
};
type ExamAttempt = { id: string; score: number; correctCount: number; totalCount: number };

function DeviceVisual({device}:{device:Pick<Device, "id" | "title" | "shape">}) {
  if (["red-signal","yellow-signal","green-signal","flashing-red","flashing-yellow","arrow-signal","temporary-signal","audible-pedestrian"].includes(device.id)) {
    return <div className="sign-visual" aria-label={device.title}>
      <svg viewBox="0 0 240 150" role="img" aria-hidden="true" style={{width:"100%",maxWidth:260,height:150}}>
        <rect x="82" y="8" width="76" height="132" rx="14" fill="#252a30" stroke="#111820" strokeWidth="4"/>
        <circle cx="120" cy="34" r="17" fill={device.id==="red-signal"||device.id==="flashing-red"||device.id==="temporary-signal"?"#d52d32":"#63383a"} stroke="#111" strokeWidth="2"/>
        <circle cx="120" cy="74" r="17" fill={device.id==="yellow-signal"||device.id==="flashing-yellow"?"#f2bd36":"#66552e"} stroke="#111" strokeWidth="2"/>
        <circle cx="120" cy="114" r="17" fill={device.id==="green-signal"?"#269b61":"#315344"} stroke="#111" strokeWidth="2"/>
        {device.id==="arrow-signal" && <path d="M94 74h43m-14-14 14 14-14 14" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>}
        {device.id==="audible-pedestrian" && <g fill="none" stroke="#263746" strokeWidth="5" strokeLinecap="round"><circle cx="190" cy="47" r="8" fill="#263746"/><path d="M190 58v35m0-23-17 16m17-16 15 13m-15 10-14 24m14-24 15 24M211 48q12 12 0 24m8-32q20 20 0 40"/></g>}
        {device.id==="temporary-signal" && <g><path d="M42 138 60 83l18 55Z" fill="#ef8c27" stroke="#8a4b16" strokeWidth="3"/><path d="M46 125h28" stroke="#fff" strokeWidth="6"/></g>}
      </svg>
    </div>;
  }
  if (device.shape === "text") return <div className="sign-visual"><div className="sign-info-board"><small>{device.id.toUpperCase()}</small><b>{device.title}</b></div></div>;
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
  const [devices,setDevices]=useState<PublicDevice[]>([]);
  const [tab,setTab]=useState<"تعلم"|"اختبر">("تعلم");
  const [group,setGroup]=useState<"الكل"|"لوحات"|"علامات أرضية"|"أجهزة الطريق">("الكل");
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<Record<string,number>>({});
  const [submitted,setSubmitted]=useState(false);
  const [attempt,setAttempt]=useState<ExamAttempt|null>(null);
  const [results,setResults]=useState<ExamResult[]>([]);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const visible=useMemo(()=>devices.filter(d=>group==="الكل"||d.group===group),[devices,group]);
  const score=attempt?.score ?? 0;
  const current=visible[index];

  useEffect(()=>{
    let active=true;
    fetch("/api/traffic-devices",{cache:"no-store"})
      .then(async response=>{
        if(!response.ok) throw new Error("تعذر تحميل دليل الإشارات من قاعدة البيانات.");
        return response.json();
      })
      .then(data=>{if(active)setDevices(data.devices as PublicDevice[]);})
      .catch(reason=>{if(active)setError(reason instanceof Error?reason.message:"حدث خطأ أثناء تحميل المحتوى.");})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[]);

  function resetExam(){
    setIndex(0);setAnswers({});setSubmitted(false);setAttempt(null);setResults([]);setError("");
  }
  function changeGroup(value:"الكل"|"لوحات"|"علامات أرضية"|"أجهزة الطريق"){
    setGroup(value);resetExam();
  }

  async function submitExam(){
    if(Object.keys(answers).length!==visible.length){
      setError("أجب عن جميع الأسئلة قبل إنهاء الاختبار.");
      return;
    }
    setBusy(true);setError("");
    try{
      let visitorKey=localStorage.getItem("masar-visitor-key");
      if(!visitorKey){visitorKey=crypto.randomUUID();localStorage.setItem("masar-visitor-key",visitorKey);}
      const response=await fetch("/api/traffic-devices/attempt",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          visitorKey,
          answers:visible.map(device=>({deviceId:device.id,selectedIndex:answers[device.id]}))
        })
      });
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"تعذر تصحيح الاختبار.");
      setAttempt(data.attempt as ExamAttempt);
      setResults(data.results as ExamResult[]);
      setSubmitted(true);
    }catch(reason){
      setError(reason instanceof Error?reason.message:"حدث خطأ أثناء تصحيح الاختبار.");
    }finally{setBusy(false);}
  }

  return <main className="signs-shell">
    <header className="quiz-header"><Link className="brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><div className="quiz-header-links"><Link href="/quiz" className="text-link">الاختبار العام ←</Link><Link href="/dashboard" className="text-link">مساحة المتعلم ←</Link></div></header>
    <section className="signs-intro"><span className="section-kicker">تدريب بصري للسائق</span><h1>اقرأ الطريق قبل أن تقوده</h1><p>تعرّف على اللوحات، ثم انتقل إلى العلامات المرسومة على سطح الطريق. تعلّم معناها وما يجب عليك فعله، وبعدها اختبر فهمك. الرقم الظاهر في لوحة السرعة رسم توضيحي فقط وليس تحديداً لسرعة طريق بعينه.</p></section>
    <div className="signs-toolbar"><div className="signs-tabs"><button className={tab==="تعلم"?"active":""} onClick={()=>{setTab("تعلم");resetExam();}}>دليل العلامات</button><button className={tab==="اختبر"?"active":""} onClick={()=>{setTab("اختبر");resetExam();}}>اختبار الإشارات</button></div><div className="signs-filters">{(["الكل","لوحات","علامات أرضية","أجهزة الطريق"] as const).map(v=><button key={v} className={group===v?"active":""} onClick={()=>changeGroup(v)}>{v}</button>)}</div></div>
    <div className="signs-count"><span>{group==="الكل"?"اللوحات والعلامات":group}</span><span>{loading?"جارٍ التحميل...":visible.length+" عناصر تدريبية محفوظة في قاعدة البيانات"}</span></div>
    {error&&!submitted&&<p className="form-error" role="alert">{error}</p>}
    {loading&&<p className="empty-state">جارٍ تحميل الموسوعة...</p>}
    {!loading&&!devices.length&&<div className="notice-panel">{error||"لا توجد عناصر منشورة حالياً. شغّل ترحيلات قاعدة البيانات وبيانات البداية."}</div>}
    {!loading&&devices.length>0&&tab==="تعلم"&&<div className="device-grid">{visible.map(device=><article className="device-card" key={device.id}><div className="device-card-top"><span>{device.group}</span><span>مثال تعليمي</span></div><DeviceVisual device={device}/><h2>{device.title}</h2><p>{device.meaning}</p><div className="driver-action"><strong>تصرف السائق</strong><p>{device.action}</p></div><small>موقف على الطريق: {device.context}</small><small>{device.officialReference?"مرجع للمراجعة — يحتاج تدقيقاً نهائياً: "+device.officialReference:"مرجع المراجعة: SHC 602 — يلزم تحديد الكود والصفحة بعد المطابقة التفصيلية"}</small><button className="device-test-link" onClick={()=>{setTab("اختبر");setIndex(visible.findIndex(d=>d.id===device.id));setAnswers({});setSubmitted(false);setAttempt(null);setResults([]);}}>اختبر نفسك في هذه العلامة ←</button></article>)}</div>}
    {!loading&&devices.length>0&&tab==="اختبر"&&<section className="device-exam">
      {!submitted&&current&&<><div className="device-exam-head"><span>السؤال {index+1} من {visible.length}</span><span>{Object.keys(answers).length} إجابات</span></div><div className="exam-progress"><i style={{width:`${(Object.keys(answers).length/Math.max(visible.length,1))*100}%`}}/></div><article className="device-question"><DeviceVisual device={current}/><span className="section-kicker">{current.group}</span><h2>{current.question}</h2><div className="device-options">{current.choices.map((choice,i)=><button key={i} className={answers[current.id]===i?"selected":""} onClick={()=>setAnswers(a=>({...a,[current.id]:i}))}><b>{["أ","ب","ج","د","هـ","و"][i]}</b>{choice}</button>)}</div><div className="exam-nav"><button disabled={index===0||busy} onClick={()=>setIndex(i=>i-1)}>السابق</button><button disabled={answers[current.id]===undefined||busy} onClick={()=>index===visible.length-1?void submitExam():setIndex(i=>i+1)}>{busy?"جارٍ التصحيح...":index===visible.length-1?"إنهاء الاختبار وحفظ النتيجة":"التالي"}</button></div>{error&&<p className="form-error" role="alert">{error}</p>}</article></>}
      {submitted&&attempt&&<div className="device-results"><span className="section-kicker">نتيجة الاختبار المحفوظة</span><strong className="device-score">{score}%</strong><p>{attempt.correctCount} إجابات صحيحة من {attempt.totalCount}</p>{results.map((result,i)=><article className="device-review" key={result.questionId}><b>{result.isCorrect?"✓":"×"} {result.title}</b>{!result.isCorrect&&result.correctAnswer&&<p><strong>الإجابة الصحيحة:</strong> {result.correctAnswer}</p>}<p>{result.explanation}</p></article>)}<button className="button button-primary" onClick={resetExam}>إعادة الاختبار</button></div>}
    </section>}
    <aside className="signs-note"><strong>ملاحظة عن دقة المحتوى</strong><p>هذه دفعة تعليمية أولية من 45 عنصراً، وليست الكتالوج السعودي الكامل ولا صوراً رسمية معتمدة. تُحمّل العناصر من PostgreSQL، وتُرسل الإجابات إلى الخادم للتصحيح وحفظ المحاولة. المراجع المحددة لبعض العناصر أولية وتحتاج مطابقة نهائية مع شكل اللوحة أو جدول الكتالوج قبل الاعتماد.</p><p><a href="https://istitlaa.ncc.gov.sa/ar/transportation/mot/saudihighwaycode/Documents/SHC%20602%20final.pdf" target="_blank" rel="noreferrer">مرجع السعودية: كود الطرق SHC 602 (PDF)</a></p><p>المرجع الأمريكي للمقارنة التعليمية فقط: <a href="https://mutcd.fhwa.dot.gov/kno_11th_Editionr1.htm" target="_blank" rel="noreferrer">FHWA MUTCD — الطبعة 11، Revision 1</a>. لا تُنقل القواعد الأمريكية إلى اختبار السعودية.</p></aside>
    <p className="quiz-disclaimer">اختبار تدريبي مستقل، وليس اختبار المرور الحكومي الفعلي ولا يضمن اجتيازه.</p>
  </main>;
}
