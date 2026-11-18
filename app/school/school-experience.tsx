"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { licenseTracks, schoolStages, type LicenseTrackId, type SchoolLesson } from "@/lib/driving-school";

type Props = { learnerName: string; accountLessonsCompleted: number; latestQuizScore: number | null };

const diagnostic = [
  { q: "عند تغيير المسار، ما الذي يجب فعله؟", a: ["الإشارة والتحقق من المرايا والنقطة العمياء", "الانتقال فوراً", "استخدام المنبه فقط"], correct: 0 },
  { q: "عند ضعف الرؤية بسبب الغبار أو الضباب؟", a: ["زيادة السرعة", "تقليل السرعة وزيادة مسافة الأمان", "الاقتراب من المركبة الأمامية"], correct: 1 },
  { q: "إذا لم تفهم أداة تحكم في مركبتك؟", a: ["تجربتها أثناء الحركة", "تتجاهلها", "تراجع دليل المركبة وتسأل المدرب"], correct: 2 }
];

export default function SchoolExperience({ learnerName, accountLessonsCompleted, latestQuizScore }: Props) {
  const [trackId, setTrackId] = useState<LicenseTrackId>("private");
  const [stage, setStage] = useState(0);
  const [lessonId, setLessonId] = useState("road-signs");
  const [answers, setAnswers] = useState<number[]>([-1, -1, -1]);
  const [diagnosticDone, setDiagnosticDone] = useState(false);
  const [lessonAnswer, setLessonAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showAllStages, setShowAllStages] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("masar-driving-school-v1");
      if (raw) {
        const saved = JSON.parse(raw) as { trackId?: LicenseTrackId; completed?: string[]; diagnosticDone?: boolean; answers?: number[] };
        if (saved.trackId && licenseTracks.some(track => track.id === saved.trackId)) setTrackId(saved.trackId);
        if (Array.isArray(saved.completed)) setCompleted(saved.completed.filter((item): item is string => typeof item === "string"));
        if (saved.diagnosticDone) setDiagnosticDone(true);
        if (Array.isArray(saved.answers)) setAnswers(saved.answers.slice(0, 3));
      }
    } catch { /* Ignore invalid local progress; the learner can start again. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("masar-driving-school-v1", JSON.stringify({ trackId, completed, diagnosticDone, answers }));
  }, [trackId, completed, diagnosticDone, answers, hydrated]);

  const track = useMemo(() => licenseTracks.find(item => item.id === trackId) ?? licenseTracks[0], [trackId]);
  const activeLesson: SchoolLesson = track.modules.find(item => item.id === lessonId) ?? track.modules[0];
  const diagnosticScore = answers.reduce((sum, value, index) => sum + (value === diagnostic[index].correct ? 1 : 0), 0);
  const allAnswered = answers.every(value => value >= 0);
  const lessonPassed = lessonAnswer === activeLesson.answer;
  const digitalPercent = Math.round((completed.filter(id => track.modules.some(item => item.id === id)).length / track.modules.length) * 100);

  function changeTrack(value: LicenseTrackId) {
    setTrackId(value);
    setLessonId("road-signs");
    setLessonAnswer(null);
    setStage(0);
  }

  function finishDiagnostic() {
    if (!allAnswered) return;
    setDiagnosticDone(true);
    setStage(2);
  }

  function completeLesson() {
    if (!lessonPassed) return;
    setCompleted(previous => previous.includes(activeLesson.id) ? previous : [...previous, activeLesson.id]);
    const next = track.modules.find(item => !completed.includes(item.id) && item.id !== activeLesson.id);
    if (next) setLessonId(next.id);
    setLessonAnswer(null);
  }

  return (
    <main className="school-shell">
      <header className="school-topbar">
        <a href="/" className="school-brand"><span className="school-brand-mark">م</span><span><strong>مسار الرخصة</strong><small>مدرسة القيادة الرقمية</small></span></a>
        <nav><a href="/learn">المكتبة التعليمية</a><a href="/quiz">الاختبارات</a><a href="/dashboard">حسابي</a></nav>
      </header>

      <section className="school-welcome">
        <div><span className="school-kicker">أكاديمية تعليم القيادة</span><h1>مرحباً {learnerName || "بالمتعلم"}، لنبدأ رحلتك</h1><p>مسار تعليمي متدرج يجمع المعرفة المرورية والتدريب البصري والمواقف التفاعلية.</p></div>
        <div className="school-progress-ring" style={{ "--progress": digitalPercent + "%" } as CSSProperties}><strong>{digitalPercent}%</strong><span>منهج رقمي</span></div>
      </section>

      <section className="school-track-panel">
        <div className="school-section-head"><div><span className="school-kicker">الخطوة الأولى</span><h2>اختر فئة الرخصة التي تستعد لها</h2></div><span className="school-local-label">يحفظ الاختيار على هذا الجهاز</span></div>
        <div className="school-track-grid">
          {licenseTracks.map(item => <button key={item.id} type="button" className={"school-track-card " + (trackId === item.id ? "is-selected" : "")} onClick={() => changeTrack(item.id)} aria-pressed={trackId === item.id}>
            <span className="school-track-icon">{item.id === "private" ? "🚘" : item.id === "public" ? "🚌" : item.id === "motorcycle" ? "🏍️" : "🚜"}</span><strong>{item.title}</strong><small>{item.subtitle}</small><span className="school-track-check">{trackId === item.id ? "✓ محدد" : "اختيار المسار"}</span>
          </button>)}
        </div>
        <div className="school-track-focus"><strong>تركيز المنهج:</strong> {track.focus}</div>
      </section>

      <section className="school-main-grid">
        <aside className="school-stage-panel">
          <div className="school-section-head"><div><span className="school-kicker">رحلتك التعليمية</span><h2>مراحل المدرسة</h2></div><button className="school-text-button" onClick={() => setShowAllStages(value => !value)}>{showAllStages ? "عرض المختصر" : "عرض الكل"}</button></div>
          <ol className="school-stage-list">
            {(showAllStages ? schoolStages : schoolStages.slice(0, 5)).map((item, index) => <li key={item} className={index === stage ? "current" : index < stage ? "done" : ""}><button type="button" onClick={() => setStage(index)}><span className="school-stage-number">{index < stage ? "✓" : String(index + 1).padStart(2, "0")}</span><span>{item}</span></button></li>)}
          </ol>
          <div className="school-stage-note"><strong>تنبيه مهم</strong><p>المراحل العملية هنا شرح ومحاكاة تعليمية. لا تسجل ساعات تدريب مدرسة أو مهارات ميدانية مكتملة.</p></div>
        </aside>

        <section className="school-learning-panel">
          {stage === 0 && <div className="school-stage-content">
            <span className="school-kicker">التسجيل وتحديد المسار</span><h2>منهج {track.title}</h2><p>تم إعداد المسار وفق نوع المركبة والمهارات المرتبطة بها. اختر فئة الرخصة أعلاه لتحديث المنهج.</p>
            <div className="school-info-grid"><div><small>المركبة المستهدفة</small><strong>{track.vehicle}</strong></div><div><small>الوحدات الرقمية</small><strong>{track.modules.length} وحدات تعليمية</strong></div><div><small>سجل حسابك الحالي</small><strong>{accountLessonsCompleted} دروس منشورة مكتملة</strong></div></div>
            <button className="school-primary-button" onClick={() => setStage(1)}>ابدأ التقييم المبدئي ←</button>
          </div>}

          {stage === 1 && <div className="school-stage-content">
            <span className="school-kicker">التقييم المبدئي</span><h2>دعنا نتعرف على مستواك الحالي</h2><p>أجب عن الأسئلة التالية. هذا تقييم تعليمي أولي وليس اختبار قبول أو تحديد ساعات مدرسة.</p>
            <div className="school-diagnostic-list">{diagnostic.map((item, index) => <fieldset className="school-question" key={item.q}><legend>{index + 1}. {item.q}</legend>{item.a.map((choice, option) => <label key={choice} className={answers[index] === option ? "chosen" : ""}><input type="radio" name={"diagnostic-" + index} checked={answers[index] === option} onChange={() => setAnswers(previous => previous.map((value, i) => i === index ? option : value))}/><span>{choice}</span></label>)}</fieldset>)}</div>
            {diagnosticDone && <p className="school-feedback">نتيجتك الأولية: {diagnosticScore} من {diagnostic.length}. سنقترح عليك مراجعة الموضوعات التي تحتاج إلى تعزيز.</p>}
            <button className="school-primary-button" disabled={!allAnswered} onClick={finishDiagnostic}>اعتماد التقييم وعرض الخطة ←</button>
          </div>}

          {stage === 2 && <div className="school-stage-content">
            <span className="school-kicker">خطتك التعليمية</span><h2>خطة {track.title}</h2><p>خطة رقمية قابلة للتخصيص بحسب تقدمك. لا تمثل جدول المدرسة المرخصة أو عدد ساعاتها.</p>
            <div className="school-plan-summary"><div><strong>{diagnosticDone ? diagnosticScore + "/" + diagnostic.length : "لم يكتمل"}</strong><small>التقييم المبدئي</small></div><div><strong>{completed.length}/{track.modules.length}</strong><small>وحدات رقمية أنجزتها على هذا الجهاز</small></div><div><strong>{track.modules.length - completed.length}</strong><small>وحدات رقمية متبقية</small></div></div>
            <div className="school-recommendation"><strong>توصية تعليمية</strong><p>{diagnosticDone && diagnosticScore < 2 ? "ابدأ بمراجعة الملاحظة ومسافة الأمان، ثم أعد التدرب على المواقف." : "ابدأ بالأساسيات، ثم انتقل إلى وحدات المركبة والمهارات والمواقف الخاصة بفئتك."}</p></div>
            <button className="school-primary-button" onClick={() => setStage(3)}>ابدأ الفصل النظري ←</button>
          </div>}

          {stage === 3 && <div className="school-stage-content">
            <span className="school-kicker">الفصول التعليمية</span><h2>الفصل النظري والتطبيقي</h2><p>اختر حصة من المنهج. كل حصة تتضمن شرح المدرّس، مثالاً، أخطاء شائعة، وسؤالاً أثناء التعلم.</p>
            <div className="school-module-list">{track.modules.map((item, index) => <button key={item.id} className={"school-module-row " + (lessonId === item.id ? "active" : "")} onClick={() => { setLessonId(item.id); setLessonAnswer(null); }}><span className="school-module-index">{String(index + 1).padStart(2, "0")}</span><span className="school-module-copy"><strong>{item.title}</strong><small>{item.kind} · {item.objective}</small></span><span className="school-module-status">{completed.includes(item.id) ? "✓" : "←"}</span></button>)}</div>
            <button className="school-primary-button" onClick={() => setStage(4)}>التعرف على المركبة ←</button>
          </div>}

          {stage === 4 && <div className="school-stage-content">
            <span className="school-kicker">التعرف على المركبة</span><h2>{track.vehicle}: ما الذي يجب أن تعرفه؟</h2><p>{track.id === "private" ? "تعرف على المقود والدواسات وناقل الحركة والإضاءة والتحذير وفق دليل المركبة." : track.id === "public" ? "تعرف على أدوات المركبة وأنظمة سلامة الركاب والحمولة وحدود الرؤية بحسب الفئة." : track.id === "motorcycle" ? "تعرف على أدوات التحكم والتوازن ومعدات الحماية ودليل الدراجة." : "تعرف على نوع المعدة وأدواتها ومناطق الخطر وفق دليل المصنع وإجراءات الموقع."}</p>
            <div className="school-vehicle-visual"><div className="school-vehicle-symbol">{track.id === "private" ? "🚘" : track.id === "public" ? "🚌" : track.id === "motorcycle" ? "🏍️" : "🚜"}</div><div><strong>تعلم بصري قبل التطبيق</strong><p>استخدم رسوماً تعليمية مرخصة أو أصلية، وراجع دليل المركبة. لا تنفذ أي تمرين تشغيل فعلي دون مدرب ومكان آمن.</p></div></div>
            <button className="school-primary-button" onClick={() => { setLessonId(track.modules.find(item => item.id.endsWith("controls") || item.id === "pre-drive")?.id ?? "pre-drive"); setStage(3); }}>افتح حصة أجهزة التحكم ←</button>
          </div>}

          {stage === 5 && <div className="school-stage-content">
            <span className="school-kicker">المهارات العملية</span><h2>تدرب على تسلسل المهارة قبل تنفيذها</h2><p>هذه محاكاة ذهنية وبصرية. تنفيذ المهارات على مركبة حقيقية يكون مع مدرب مؤهل في بيئة تدريب مناسبة.</p>
            <div className="school-skill-grid">{["ضبط المقعد والمرايا", "تشغيل المركبة وإيقافها", "الانطلاق والتوقف", "التحكم والتوجيه", "تغيير المسار", "الانعطاف والرجوع", "الوقوف والاصطفاف", "فحص المحيط قبل الحركة"].map((skill, index) => <div key={skill}><span>{String(index + 1).padStart(2, "0")}</span><strong>{skill}</strong><small>شرح بصري + تسلسل قرار</small></div>)}</div>
            <button className="school-primary-button" onClick={() => setStage(6)}>انتقل إلى المواقف المرورية ←</button>
          </div>}

          {stage === 6 && <div className="school-stage-content">
            <span className="school-kicker">المواقف المرورية</span><h2>اتخذ القرار قبل أن يتحول الخطر إلى حادث</h2><p>تدرب على قراءة الموقف وتوقع ما قد يحدث، وليس حفظ إجابة واحدة.</p>
            <div className="school-scenario-card"><span>سيناريو تدريبي</span><h3>{activeLesson.title}</h3><p>{activeLesson.example}</p><strong>ما التصرف الذي يقلل الخطر؟</strong><div className="school-scenario-actions"><button onClick={() => { setLessonAnswer(activeLesson.answer); setStage(3); }}>ادرس الحصة المرتبطة</button><button onClick={() => setStage(7)}>اذهب إلى الاختبار النظري</button></div></div>
          </div>}

          {stage === 7 && <div className="school-stage-content">
            <span className="school-kicker">الاختبارات النظرية</span><h2>اختبار نهاية الحصة</h2><p>اختر حصة ثم أجب عن سؤالها. التصحيح هنا تدريبي ويشرح سبب الاختيار.</p>
            <div className="school-test-picker">{track.modules.map(item => <button key={item.id} className={lessonId === item.id ? "active" : ""} onClick={() => { setLessonId(item.id); setLessonAnswer(null); }}>{item.title}</button>)}</div>
            <div className="school-inline-test"><strong>{activeLesson.question}</strong>{activeLesson.choices.map((choice, index) => <label key={choice} className={lessonAnswer === index ? "chosen" : ""}><input type="radio" name="lesson-answer" checked={lessonAnswer === index} onChange={() => setLessonAnswer(index)}/>{choice}</label>)}{lessonAnswer !== null && <p className={lessonPassed ? "correct" : "incorrect"}>{lessonPassed ? "إجابة صحيحة. " : "ليست الإجابة الأفضل. "}{activeLesson.feedback}</p>}<button className="school-primary-button" disabled={!lessonPassed} onClick={completeLesson}>إكمال الوحدة الرقمية ←</button></div>
          </div>}

          {stage === 8 && <div className="school-stage-content">
            <span className="school-kicker">التقييم العملي التجريبي</span><h2>قائمة ملاحظة ذاتية قبل التدريب</h2><p>راجع ما ينبغي أن تلاحظه مع المدرب. لا يمكن للتطبيق مشاهدة أداء القيادة أو إثبات إتقانها.</p>
            <div className="school-checklist">{["أفهم مواضع أدوات التحكم في المركبة المستهدفة", "أعرف تسلسل ضبط الجلسة ومعدات الحماية", "أفهم فحص المرايا والنقطة العمياء", "أستطيع شرح خطوات الانطلاق والتوقف", "أتعرف على أخطار التقاطعات والمشاة", "أعرف متى أتوقف وأطلب مساعدة المدرب"].map(item => <label key={item}><input type="checkbox"/><span>{item}</span></label>)}</div>
            <div className="school-stage-note"><strong>التقييم الميداني</strong><p>يجب أن يسجل المدرب المؤهل نتيجة المهارة في سجل المدرسة المعتمد. هذه القائمة ليست سجلاً رسمياً.</p></div>
            <button className="school-primary-button" onClick={() => setStage(9)}>عرض تقرير الجاهزية التعليمية ←</button>
          </div>}

          {stage === 9 && <div className="school-stage-content">
            <span className="school-kicker">تقرير الجاهزية التعليمية</span><h2>ملخص تعلمك الحالي</h2><p>هذا التقرير يصف نشاطك داخل المنصة فقط ولا يقرر أهليتك أو جاهزيتك للقيادة في الطريق.</p>
            <div className="school-readiness-grid"><div><strong>{completed.filter(id => track.modules.some(item => item.id === id)).length}/{track.modules.length}</strong><small>وحدات رقمية مكتملة</small></div><div><strong>{diagnosticDone ? diagnosticScore + "/3" : "—"}</strong><small>التقييم المبدئي</small></div><div><strong>{latestQuizScore === null ? "—" : latestQuizScore + "%"}</strong><small>آخر اختبار محفوظ بالحساب</small></div></div>
            <div className="school-readiness-warning"><strong>المهارات العملية: غير مثبتة</strong><p>لا توجد في هذا التقرير ساعات تدريب ميداني أو تقييم معتمد من مدرسة. اطلب من مدرسة قيادة مرخصة تقييمك وتسجيل تدريبك الفعلي.</p></div>
            <div className="school-next-steps"><strong>الخطوة التالية</strong><p>راجع الوحدات التي لم تكملها، ثم واصل التدريب العملي مع مدرب مؤهل، وتحقق من إجراءات الرخصة عبر القنوات الرسمية.</p><a href="/license-guide">دليل إجراءات الرخصة ←</a></div>
          </div>}
        </section>
      </section>
      <footer className="school-footer"><span>مسار الرخصة · أكاديمية تعليمية مستقلة</span><span>لا تصدر رخصاً ولا تستبدل التدريب أو الاختبارات الرسمية.</span></footer>
    </main>
  );
}
