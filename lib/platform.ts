export type LearningCategory =
  | "traffic-signs"
  | "road-rules"
  | "safe-driving"
  | "intersections"
  | "vehicle-basics";

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
  { id: "traffic-signs", title: "إشارات المرور", description: "افهم العلامات التحذيرية والتنظيمية والإرشادية", icon: "◉" },
  { id: "road-rules", title: "قواعد الطريق", description: "الأولوية والمسارات والسرعات والالتزام", icon: "↗" },
  { id: "safe-driving", title: "القيادة الآمنة", description: "مسافة الأمان والانتباه وتجنب المخاطر", icon: "盾" },
  { id: "intersections", title: "التقاطعات", description: "التعامل الصحيح مع التقاطعات والدوارات", icon: "✣" },
  { id: "vehicle-basics", title: "أساسيات المركبة", description: "الفحص الأساسي ومكونات السلامة", icon: "▣" }
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