export type LearningCategory =
  | "traffic-signs"
  | "road-rules"
  | "safe-driving"
  | "intersections"
  | "vehicle-basics"
  | "vehicle-control"
  | "vulnerable-road-users"
  | "adverse-conditions"
  | "emergency-response"
  | "driver-fitness";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  category: LearningCategory;
  durationMinutes: number;
  level: "مبتدئ" | "متوسط" | "متقدم";
  status: "available" | "coming-soon";
};

export const learningCategories: Array<{
  id: LearningCategory;
  title: string;
  description: string;
  icon: string;
}> = [
  { id: "traffic-signs", title: "الإشارات وعلامات الطريق", description: "افهم اللوحات والخطوط والإشارات المؤقتة.", icon: "◉" },
  { id: "road-rules", title: "قواعد الطريق والأولوية", description: "تعلم قراءة المواقف واتخاذ القرار الصحيح.", icon: "↗" },
  { id: "safe-driving", title: "القيادة الوقائية", description: "توقع المخاطر ومسافة الأمان والانتباه.", icon: "盾" },
  { id: "intersections", title: "التقاطعات والدوارات", description: "الاقتراب والتموضع والعبور الآمن.", icon: "✣" },
  { id: "vulnerable-road-users", title: "سلامة مرتادي الطريق", description: "المشاة والأطفال والدراجات والمركبات الكبيرة.", icon: "♧" },
  { id: "adverse-conditions", title: "الظروف الصعبة", description: "المطر والضباب والغبار والليل والطرق المفتوحة.", icon: "☼" },
  { id: "vehicle-basics", title: "سلامة المركبة", description: "الفحص الأساسي والإطارات والأنوار وحماية الركاب.", icon: "▣" },
  { id: "emergency-response", title: "الطوارئ والحوادث", description: "التصرف الآمن عند التعطل أو وقوع حادث.", icon: "＋" },
  { id: "driver-fitness", title: "جاهزية السائق والسلوك", description: "التعب والتشتت والتهور والمسؤولية.", icon: "◌" }
];

export const starterLessons: Lesson[] = [
  {
    id: "signs-intro",
    title: "مقدمة في إشارات المرور",
    description: "تعرف على وظيفة الإشارات وكيفية قراءة أشكالها وألوانها.",
    category: "traffic-signs",
    durationMinutes: 8,
    level: "مبتدئ",
    status: "available"
  },
  {
    id: "right-of-way",
    title: "مبادئ حق الأولوية",
    description: "متى تتوقف ومتى تفسح الطريق وكيف تتصرف بأمان.",
    category: "road-rules",
    durationMinutes: 10,
    level: "مبتدئ",
    status: "available"
  },
  {
    id: "safe-distance",
    title: "مسافة الأمان",
    description: "كيف تحافظ على مسافة مناسبة وتستجيب للتوقف المفاجئ.",
    category: "safe-driving",
    durationMinutes: 7,
    level: "مبتدئ",
    status: "available"
  }
];

export const platformPrinciples = [
  "معلومة مرورية واضحة ومفهومة",
  "مصدر موثق وتاريخ مراجعة لكل معلومة نظامية",
  "تدريب أصلي لا يدّعي أنه أسئلة الاختبار الفعلي",
  "خصوصية المتعلم وعدم طلب بيانات دخول أبشر"
] as const;