import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questions = [
  {
    prompt: "ماذا يعني الشكل الثماني الأحمر الذي يحمل كلمة «قف»؟",
    choices: ["التوقف التام قبل متابعة السير", "زيادة السرعة", "ممنوع الوقوف فقط", "طريق للمركبات الثقيلة"],
    correctIndex: 0,
    explanation: "إشارة قف تعني التوقف التام، ثم التأكد من خلو الطريق ومتابعة السير عندما يكون ذلك آمناً.",
    category: "إشارات المرور",
    difficulty: "مبتدئ",
    status: "published",
    sourceNote: "سؤال تدريبي أصلي عن معنى إشارة معروفة؛ يجب مراجعته ضمن اعتماد محتوى الإشارات السعودي."
  },
  {
    prompt: "عند اقترابك من ممر مشاة ويوجد أشخاص يعبرون، ما التصرف الأكثر أماناً؟",
    choices: ["زيادة السرعة قبل وصولهم", "التوقف وإفساح المجال لهم", "استخدام المنبه فقط", "المرور من خلفهم بسرعة"],
    correctIndex: 1,
    explanation: "خفف السرعة وتوقف عند الحاجة لإفساح المجال للمشاة، ولا تبدأ الحركة حتى يصبح العبور آمناً.",
    category: "سلامة الطريق",
    difficulty: "مبتدئ",
    status: "published",
    sourceNote: "مبدأ توعوي عام للسلامة؛ لا يُستخدم بديلاً عن النص النظامي."
  },
  {
    prompt: "لماذا ينبغي ترك مسافة أمان كافية مع المركبة أمامك؟",
    choices: ["لتقليل استهلاك الوقود فقط", "لإتاحة وقت ومسافة للاستجابة والتوقف", "لمنع المركبات من تغيير المسار", "للسماح باستخدام الهاتف"],
    correctIndex: 1,
    explanation: "مسافة الأمان تمنح السائق وقتاً للاستجابة وتقلل احتمال الاصطدام عند التباطؤ أو التوقف المفاجئ.",
    category: "القيادة الآمنة",
    difficulty: "مبتدئ",
    status: "published",
    sourceNote: "مبدأ توعوي عام للقيادة الآمنة."
  },
  {
    prompt: "إذا اقتربت مركبة إسعاف تستخدم إشارات التحذير، فما الأولوية؟",
    choices: ["منافستها للوصول أولاً", "إفساح الطريق بأمان وفق ظروف الطريق", "التوقف المفاجئ في منتصف التقاطع", "اتباعها مباشرة"],
    correctIndex: 1,
    explanation: "انتبه للمركبة وأفسح لها الطريق بطريقة آمنة ومن دون خلق خطر جديد أو تنفيذ مناورة مفاجئة.",
    category: "قواعد الطريق",
    difficulty: "متوسط",
    status: "published",
    sourceNote: "سؤال توعوي أولي؛ يجب مطابقته مع النصوص السعودية قبل اعتباره مادة نظامية."
  },
  {
    prompt: "عند ضعف الرؤية بسبب الضباب، ما السلوك الأكثر أماناً؟",
    choices: ["زيادة السرعة للخروج من الضباب", "تقليل السرعة وزيادة مسافة الأمان", "تشغيل الضوء العالي دائماً", "القيادة قريباً جداً من المركبة الأمامية"],
    correctIndex: 1,
    explanation: "خفف السرعة، زد مسافة الأمان، واستخدم الإضاءة المناسبة للظروف وتجنب المناورات المفاجئة.",
    category: "القيادة الآمنة",
    difficulty: "متوسط",
    status: "published",
    sourceNote: "إرشاد سلامة عام، وليس اقتباساً من أسئلة الاختبار الرسمي."
  },
  {
    prompt: "قبل تغيير المسار، ما الإجراء الصحيح؟",
    choices: ["الانتقال فوراً إذا كان المسار يبدو فارغاً", "استخدام الإشارة والتحقق من المرايا والنقطة العمياء", "الاعتماد على المنبه", "التوقف في المسار"],
    correctIndex: 1,
    explanation: "أشر مبكراً، افحص المرايا والنقطة العمياء، ثم غيّر المسار فقط إذا كان ذلك آمناً.",
    category: "القيادة الآمنة",
    difficulty: "مبتدئ",
    status: "published",
    sourceNote: "مبدأ توعوي عام؛ يخضع للمراجعة التحريرية قبل النشر النهائي."
  }
];

async function main() {
  for (const item of questions) {
    await prisma.quizQuestion.upsert({
      where: { id: `starter-${questions.indexOf(item) + 1}` },
      update: item,
      create: { id: `starter-${questions.indexOf(item) + 1}`, ...item }
    });
  }
  await prisma.source.upsert({
    where: { id: "source-saudi-traffic-law" },
    update: {},
    create: {
      id: "source-saudi-traffic-law",
      title: "نظام المرور السعودي",
      publisher: "هيئة الخبراء بمجلس الوزراء",
      url: "https://laws.boe.gov.sa/",
      isOfficial: true,
      notes: "مرجع رسمي؛ يجب ربط كل مادة تعليمية بالمادة المحددة وتاريخ التحقق."
    }
  });
  await prisma.source.upsert({
    where: { id: "source-trainee-handbook" },
    update: {},
    create: {
      id: "source-trainee-handbook",
      title: "الدليل النظري للمتدرب",
      publisher: "الدليل السعودي المنشور على DDC",
      url: "https://www.ddc.sa/uploads/image/downloadables_pdf/Theoretical%20Driving%20Handbook%20Trainee-Moroor.pdf",
      isOfficial: false,
      notes: "نسخة منشورة على موقع وسيط؛ لا يُفترض أنها نسخة حديثة أو أن إعادة استخدام محتواها مسموحة قبل التحقق."
    }
  });

  const lessons = [
    {
      slug: "understanding-traffic-signs",
      title: "كيف تفهم إشارات المرور؟",
      summary: "مدخل إلى تصنيف الإشارات وقراءة الرسالة التي تنقلها للسائق.",
      category: "إشارات المرور",
      level: "مبتدئ",
      durationMinutes: 8,
      status: "draft",
      content: "تساعد إشارات المرور على تنظيم حركة الطريق وتنبيه السائقين وإرشادهم. ابدأ بملاحظة شكل الإشارة ولونها ومكانها، ثم اقرأ معناها من المرجع المعتمد. لا تعتمد على اللون وحده عند وجود لوحة إضافية أو ظرف مروري خاص.\\n\\nهذه مادة تأسيسية داخلية، وتحتاج إلى تدقيق بصري ومراجعة مرورية سعودية قبل النشر."
    },
    {
      slug: "safe-following-distance",
      title: "مسافة الأمان أثناء القيادة",
      summary: "لماذا تحتاج إلى مساحة ووقت كافيين للاستجابة والتوقف؟",
      category: "القيادة الآمنة",
      level: "مبتدئ",
      durationMinutes: 7,
      status: "draft",
      content: "تمنحك مسافة الأمان وقتاً إضافياً لملاحظة ما يحدث أمامك والاستجابة بهدوء. قد تحتاج إلى زيادة المسافة عندما تقل الرؤية أو يصبح سطح الطريق زلقاً أو تتغير ظروف الحركة.\\n\\nهذه مادة توعوية أولية، وتحتاج إلى مراجعة المحتوى السعودي المعتمد قبل النشر."
    },
    {
      slug: "safe-lane-change",
      title: "الاستعداد لتغيير المسار",
      summary: "خطوات التحقق من المرايا والمنطقة غير المرئية قبل الانتقال.",
      category: "قواعد الطريق",
      level: "مبتدئ",
      durationMinutes: 6,
      status: "draft",
      content: "لا تنتقل إلى مسار آخر اعتماداً على النظر إلى المرآة وحدها. استخدم إشارة الاتجاه، وتحقق من المرايا والمنطقة غير المرئية، وتأكد من وجود مساحة كافية قبل تنفيذ الحركة بسلاسة.\\n\\nهذه مادة توعوية أولية، وتحتاج إلى مراجعة مرورية سعودية قبل النشر."
    }
  ];

  for (const lesson of lessons) {
    const saved = await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: lesson,
      create: lesson
    });
    await prisma.lessonSource.upsert({
      where: { lessonId_sourceId: { lessonId: saved.id, sourceId: "source-saudi-traffic-law" } },
      update: {},
      create: { lessonId: saved.id, sourceId: "source-saudi-traffic-law" }
    });
    await prisma.lessonSource.upsert({
      where: { lessonId_sourceId: { lessonId: saved.id, sourceId: "source-trainee-handbook" } },
      update: {},
      create: { lessonId: saved.id, sourceId: "source-trainee-handbook" }
    });
  }
}

main().finally(async () => prisma.$disconnect());
