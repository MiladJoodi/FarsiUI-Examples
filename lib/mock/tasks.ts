/**
 * Mock data for Task Management example — independent workspace.
 */

export type TaskStatus =
  | "جدید"
  | "در حال انجام"
  | "در انتظار بررسی"
  | "تکمیل‌شده"

export type TaskPriority = "پایین" | "متوسط" | "بالا" | "فوری"

export type TeamMember = {
  id: string
  name: string
  initials: string
  role: string
}

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string
  dueDate: string
  label: string
  progress: number
  projectId: string
}

export type Project = {
  id: string
  name: string
  description: string
  progress: number
  dueDate: string
}

export const taskStatuses: TaskStatus[] = [
  "جدید",
  "در حال انجام",
  "در انتظار بررسی",
  "تکمیل‌شده",
]

export const taskPriorities: TaskPriority[] = [
  "پایین",
  "متوسط",
  "بالا",
  "فوری",
]

export const teamMembers: TeamMember[] = [
  { id: "m1", name: "نیما کاظمی", initials: "ن‌ک", role: "مدیر محصول" },
  { id: "m2", name: "سارا محمدی", initials: "س‌م", role: "طراح UI" },
  { id: "m3", name: "رضا کریمی", initials: "ر‌ک", role: "فرانت‌اند" },
  { id: "m4", name: "مینا اکبری", initials: "م‌ا", role: "بک‌اند" },
  { id: "m5", name: "بهرام یوسفی", initials: "ب‌ی", role: "QA" },
]

export const activeProject: Project = {
  id: "p1",
  name: "بازطراحی پنل همیار",
  description: "طراحی و پیاده‌سازی نسخهٔ جدید پنل مدیریت فروش",
  progress: 62,
  dueDate: "۱۴۰۵/۰۸/۱۵",
}

export const tasks: Task[] = [
  {
    id: "T-104",
    title: "طراحی سیستم ناوبری سایدبار",
    description:
      "ساختار منوی اصلی، حالت جمع‌شده و حالت موبایل برای پنل جدید.",
    status: "در حال انجام",
    priority: "بالا",
    assigneeId: "m2",
    dueDate: "۱۴۰۵/۰۷/۱۲",
    label: "طراحی",
    progress: 70,
    projectId: "p1",
  },
  {
    id: "T-105",
    title: "پیاده‌سازی جدول سفارش‌ها",
    description: "جدول واکنش‌گرا با فیلتر وضعیت و منوی عملیات ردیف.",
    status: "در انتظار بررسی",
    priority: "متوسط",
    assigneeId: "m3",
    dueDate: "۱۴۰۵/۰۷/۱۰",
    label: "فرانت",
    progress: 90,
    projectId: "p1",
  },
  {
    id: "T-106",
    title: "API فهرست کاربران",
    description: "اندپوینت لیست کاربران با صفحه‌بندی و فیلتر نقش.",
    status: "در حال انجام",
    priority: "بالا",
    assigneeId: "m4",
    dueDate: "۱۴۰۵/۰۷/۱۴",
    label: "بک‌اند",
    progress: 45,
    projectId: "p1",
  },
  {
    id: "T-107",
    title: "سناریوهای تست ورود",
    description: "پوشش خطاهای اعتبارسنجی و بازیابی رمز در فرم ورود.",
    status: "جدید",
    priority: "متوسط",
    assigneeId: "m5",
    dueDate: "۱۴۰۵/۰۷/۱۸",
    label: "QA",
    progress: 0,
    projectId: "p1",
  },
  {
    id: "T-108",
    title: "تعریف توکن‌های رنگ برند",
    description: "هماهنگ‌سازی توکن‌های primary و chart با دیزاین‌سیستم.",
    status: "تکمیل‌شده",
    priority: "بالا",
    assigneeId: "m2",
    dueDate: "۱۴۰۵/۰۷/۰۵",
    label: "طراحی",
    progress: 100,
    projectId: "p1",
  },
  {
    id: "T-109",
    title: "بهینه‌سازی کوئری گزارش فروش",
    description: "کاهش زمان پاسخ گزارش ماهانه زیر ۸۰۰ میلی‌ثانیه.",
    status: "در حال انجام",
    priority: "فوری",
    assigneeId: "m4",
    dueDate: "۱۴۰۵/۰۷/۰۹",
    label: "بک‌اند",
    progress: 55,
    projectId: "p1",
  },
  {
    id: "T-110",
    title: "کارت‌های KPI داشبورد",
    description: "چهار کارت خلاصه با delta و حالت تاریک.",
    status: "تکمیل‌شده",
    priority: "متوسط",
    assigneeId: "m3",
    dueDate: "۱۴۰۵/۰۷/۰۳",
    label: "فرانت",
    progress: 100,
    projectId: "p1",
  },
  {
    id: "T-111",
    title: "بازبینی دسترسی نقش‌ها",
    description: "ماتریس نقش مدیر، پشتیبانی و فروشنده برای صفحات پنل.",
    status: "جدید",
    priority: "بالا",
    assigneeId: "m1",
    dueDate: "۱۴۰۵/۰۷/۲۰",
    label: "محصول",
    progress: 10,
    projectId: "p1",
  },
  {
    id: "T-112",
    title: "تست رگرسیون موبایل",
    description: "بررسی overflow و toolbar در عرض ۳۹۰ پیکسل.",
    status: "در انتظار بررسی",
    priority: "بالا",
    assigneeId: "m5",
    dueDate: "۱۴۰۵/۰۷/۱۱",
    label: "QA",
    progress: 80,
    projectId: "p1",
  },
  {
    id: "T-113",
    title: "مستند جریان ثبت سفارش",
    description: "نوشتن مراحل از سبد تا پرداخت برای تیم پشتیبانی.",
    status: "جدید",
    priority: "پایین",
    assigneeId: "m1",
    dueDate: "۱۴۰۵/۰۷/۲۵",
    label: "مستندات",
    progress: 0,
    projectId: "p1",
  },
  {
    id: "T-114",
    title: "حالت خالی لیست محصولات",
    description: "Empty state و CTA افزودن محصول در کاتالوگ.",
    status: "در حال انجام",
    priority: "متوسط",
    assigneeId: "m3",
    dueDate: "۱۴۰۵/۰۷/۱۳",
    label: "فرانت",
    progress: 35,
    projectId: "p1",
  },
  {
    id: "T-115",
    title: "اعلان کمبود موجودی",
    description: "تریگر نوتیفیکیشن وقتی موجودی زیر آستانه برود.",
    status: "تکمیل‌شده",
    priority: "فوری",
    assigneeId: "m4",
    dueDate: "۱۴۰۵/۰۷/۰۱",
    label: "بک‌اند",
    progress: 100,
    projectId: "p1",
  },
  {
    id: "T-116",
    title: "پالایش تایپوگرافی فرم‌ها",
    description: "فاصله برچسب و فیلد در تنظیمات حساب.",
    status: "در انتظار بررسی",
    priority: "پایین",
    assigneeId: "m2",
    dueDate: "۱۴۰۵/۰۷/۱۵",
    label: "طراحی",
    progress: 95,
    projectId: "p1",
  },
  {
    id: "T-117",
    title: "چک‌لیست انتشار نسخه ۰٫۳",
    description: "موارد smoke قبل از انتشار داخلی پنل.",
    status: "جدید",
    priority: "فوری",
    assigneeId: "m5",
    dueDate: "۱۴۰۵/۰۷/۰۸",
    label: "QA",
    progress: 5,
    projectId: "p1",
  },
]

export function getMember(id: string) {
  return teamMembers.find((m) => m.id === id) ?? teamMembers[0]
}

export function getTaskCounts(list: Task[]) {
  return {
    total: list.length,
    doing: list.filter((t) => t.status === "در حال انجام").length,
    done: list.filter((t) => t.status === "تکمیل‌شده").length,
    overdue: list.filter(
      (t) => t.status !== "تکمیل‌شده" && t.dueDate <= "۱۴۰۵/۰۷/۰۹"
    ).length,
  }
}
