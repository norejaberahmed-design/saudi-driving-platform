"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Question = { id: string; prompt: string; choices: string[]; category: string; difficulty: string };
type Result = { questionId: string; prompt: string; selectedIndex: number; isCorrect: boolean; explanation: string };
type Attempt = { id: string; score: number; correctCount: number; totalCount: number };

export default function QuizClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Result[] | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quiz", { cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("تعذر تحميل الأسئلة. تأكد من إعداد قاعدة البيانات وتشغيل بيانات البداية.");
        return response.json();
      })
      .then(data => setQuestions(data.questions as Question[]))
      .catch(reason => setError(reason instanceof Error ? reason.message : "حدث خطأ غير متوقع."))
      .finally(() => setLoading(false));
  }, []);

  async function submit() {
    if (Object.keys(answers).length !== questions.length) {
      setError("أجب عن جميع الأسئلة قبل إنهاء الاختبار.");
      return;
    }
    setBusy(true); setError("");
    try {
      let visitorKey = localStorage.getItem("masar-visitor-key");
      if (!visitorKey) {
        visitorKey = crypto.randomUUID();
        localStorage.setItem("masar-visitor-key", visitorKey);
      }
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorKey,
          answers: questions.map(question => ({ questionId: question.id, selectedIndex: answers[question.id] }))
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تصحيح الاختبار.");
      setResults(data.results as Result[]);
      setAttempt(data.attempt as Attempt);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "حدث خطأ أثناء إرسال الإجابات.");
    } finally { setBusy(false); }
  }

  return <main className="quiz-shell">
    <header className="quiz-header"><Link className="brand" href="/"><span className="brand-mark">م</span><strong>مسار الرخصة</strong></Link><div className="quiz-header-links"><Link href="/signs" className="text-link">اختبار الإشارات والعلامات ←</Link><Link href="/dashboard" className="text-link">مساحة المتعلم ←</Link></div></header>
    <section className="quiz-intro"><span className="section-kicker">تدريب قصير</span><h1>اختبر فهمك</h1><p>أسئلة تدريبية أصلية مع تفسير لكل إجابة. ليست أسئلة الاختبار الحكومي الفعلية.</p></section>
    {loading && <p className="empty-state">جارٍ تحميل الاختبار...</p>}
    {!loading && !questions.length && <div className="notice-panel">{error || "لا توجد أسئلة منشورة حالياً."}</div>}
    {questions.length > 0 && !results && <><div className="quiz-progress"><span>{Object.keys(answers).length} من {questions.length} تمت الإجابة</span><div><i style={{width:`${Object.keys(answers).length / questions.length * 100}%`}} /></div></div>
      <div className="question-list">{questions.map((question,index)=><article className="question-card" key={question.id}><div className="question-meta"><span>السؤال {index+1}</span><span>{question.category}</span></div><h2>{question.prompt}</h2><div className="choice-list">{question.choices.map((choice,choiceIndex)=><label className={answers[question.id]===choiceIndex?"choice selected":"choice"} key={choiceIndex}><input type="radio" name={question.id} checked={answers[question.id]===choiceIndex} onChange={()=>setAnswers(current=>({...current,[question.id]:choiceIndex}))}/><span className="choice-letter">{["أ","ب","ج","د","هـ","و"][choiceIndex]}</span><span>{choice}</span></label>)}</div></article>)}</div>
      {error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary quiz-submit" onClick={submit} disabled={busy}>{busy?"جارٍ التصحيح...":"إنهاء الاختبار وعرض النتيجة"}</button>
    </>}
    {results && attempt && <section className="results-panel"><span className="section-kicker">نتيجتك التدريبية</span><div className="score-circle"><strong>{attempt.score}%</strong><span>نتيجتك</span></div><h2>{attempt.correctCount} إجابات صحيحة من {attempt.totalCount}</h2><p>راجع التفسيرات التالية لتتعلم من كل سؤال.</p><div className="result-list">{results.map((result,index)=><article className="result-item" key={result.questionId}><span className={result.isCorrect?"result-mark correct":"result-mark wrong"}>{result.isCorrect?"✓":"×"}</span><div><h3>{index+1}. {result.prompt}</h3><p>{result.explanation}</p></div></article>)}</div><div className="hero-actions"><button className="button button-primary" onClick={()=>{setAnswers({});setResults(null);setAttempt(null);}}>إعادة الاختبار</button><Link className="button button-quiet" href="/dashboard">مساحة المتعلم</Link></div></section>}
    <p className="quiz-disclaimer">هذا اختبار تدريبي لأغراض التعلّم فقط. لا يمثل الاختبار الرسمي ولا يضمن اجتيازه.</p>
  </main>;
}