/**
 * Mock data for کارنما (tasks desk) — independent workspace.
 * teamMembers is also imported by the calendar example — keep export stable.
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
  /** Public path under /public for avatar photo */
  avatar: string
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

/** Display labels for board columns / status chips. */
export const statusStageLabel: Record<TaskStatus, string> = {
  جدید: "جدید",
  "در حال انجام": "در حال انجام",
  "در انتظار بررسی": "در انتظار بررسی",
  "تکمیل‌شده": "تکمیل‌شده",
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
  {
    id: "m1",
    name: "نیما کاظمی",
    initials: "ن‌ک",
    role: "هماهنگ‌کننده",
    avatar: "/avatars/01.jpg",
  },
  {
    id: "m2",
    name: "سارا محمدی",
    initials: "س‌م",
    role: "طراح",
    avatar: "/avatars/02.jpg",
  },
  {
    id: "m3",
    name: "رضا کریمی",
    initials: "ر‌ک",
    role: "توسعه‌دهنده",
    avatar: "/avatars/03.jpg",
  },
  {
    id: "m4",
    name: "مینا اکبری",
    initials: "م‌ا",
    role: "محتوا",
    avatar: "/avatars/04.jpg",
  },
  {
    id: "m5",
    name: "بهرام یوسفی",
    initials: "ب‌ی",
    role: "بازبین",
    avatar: "/avatars/05.jpg",
  },
]

export const activeProject: Project = {
  id: "p1",
  name: "راه‌اندازی ویترین نوروز",
  description: "دستورهای آماده‌سازی ویترین فصلی آتلیه تا تحویل نهایی",
  progress: 62,
  dueDate: "۱۴۰۵/۰۸/۱۵",
}

export const tasks: Task[] = [
  {
    id: "T-104",
    title: "طراحی قاب ویترین ورودی",
    description: "ساختار قاب اصلی، نسبت نور و فضای قرارگیری محصولات نوروزی.",
    status: "در حال انجام",
    priority: "بالا",
    assigneeId: "m2",
    dueDate: "۱۴۰۵/۰۷/۱۲",
    label: "ویترین",
    progress: 70,
    projectId: "p1",
  },
  {
    id: "T-105",
    title: "چیدمان قفسهٔ هدایا",
    description: "ترتیب قفسه‌ها و برچسب قیمت برای بخش هدایای کوچک.",
    status: "در انتظار بررسی",
    priority: "متوسط",
    assigneeId: "m3",
    dueDate: "۱۴۰۵/۰۷/۱۰",
    label: "چیدمان",
    progress: 90,
    projectId: "p1",
  },
  {
    id: "T-106",
    title: "متن معرفی مجموعه نوروز",
    description: "نگارش متن کوتاه ویترین و کارت‌های توضیح محصول.",
    status: "در حال انجام",
    priority: "بالا",
    assigneeId: "m4",
    dueDate: "۱۴۰۵/۰۷/۱۴",
    label: "محتوا",
    progress: 45,
    projectId: "p1",
  },
  {
    id: "T-107",
    title: "چک نورپردازی شب",
    description: "آزمایش شدت نور ویترین در ساعات عصر و شب.",
    status: "جدید",
    priority: "متوسط",
    assigneeId: "m5",
    dueDate: "۱۴۰۵/۰۷/۱۸",
    label: "بازبینی",
    progress: 0,
    projectId: "p1",
  },
  {
    id: "T-108",
    title: "پالت رنگ فصل",
    description: "هماهنگ‌سازی سبز، کرم و طلایی ملایم برای همهٔ سطوح.",
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
    title: "سفارش پارچهٔ پس‌زمینه",
    description: "پیگیری تحویل پارچه و آماده‌سازی دوخت قاب پشتی.",
    status: "در حال انجام",
    priority: "فوری",
    assigneeId: "m1",
    dueDate: "۱۴۰۵/۰۷/۰۹",
    label: "تدارکات",
    progress: 55,
    projectId: "p1",
  },
  {
    id: "T-110",
    title: "عکس محصول دمو",
    description: "عکاسی از سه محصول شاخص برای کارت ویترین.",
    status: "تکمیل‌شده",
    priority: "متوسط",
    assigneeId: "m3",
    dueDate: "۱۴۰۵/۰۷/۰۳",
    label: "رسانه",
    progress: 100,
    projectId: "p1",
  },
  {
    id: "T-111",
    title: "برنامهٔ شیفت افتتاحیه",
    description: "تقسیم حضور تیم در سه روز اول نوروز.",
    status: "جدید",
    priority: "بالا",
    assigneeId: "m1",
    dueDate: "۱۴۰۵/۰۷/۲۰",
    label: "هماهنگی",
    progress: 10,
    projectId: "p1",
  },
  {
    id: "T-112",
    title: "بازبینی مسیر مشتری",
    description: "تست جریان ورود مشتری از در تا صندوق در فضای ویترین.",
    status: "در انتظار بررسی",
    priority: "بالا",
    assigneeId: "m5",
    dueDate: "۱۴۰۵/۰۷/۱۱",
    label: "بازبینی",
    progress: 80,
    projectId: "p1",
  },
  {
    id: "T-113",
    title: "راهنمای نگهداری گل‌ها",
    description: "دستور کوتاه آبیاری و تعویض گل‌های تزئینی برای شیفت‌ها.",
    status: "جدید",
    priority: "پایین",
    assigneeId: "m4",
    dueDate: "۱۴۰۵/۰۷/۲۵",
    label: "مستندات",
    progress: 0,
    projectId: "p1",
  },
  {
    id: "T-114",
    title: "برچسب‌های قیمت دست‌نویس",
    description: "طراحی و چاپ برچسب‌های کوچک با خط خوانا.",
    status: "در حال انجام",
    priority: "متوسط",
    assigneeId: "m2",
    dueDate: "۱۴۰۵/۰۷/۱۳",
    label: "طراحی",
    progress: 35,
    projectId: "p1",
  },
  {
    id: "T-115",
    title: "هماهنگی ارسال از انبار",
    description: "زمان‌بندی رسیدن جعبه‌های محصول به آتلیه.",
    status: "تکمیل‌شده",
    priority: "فوری",
    assigneeId: "m1",
    dueDate: "۱۴۰۵/۰۷/۰۱",
    label: "تدارکات",
    progress: 100,
    projectId: "p1",
  },
  {
    id: "T-116",
    title: "پالایش فونت کارت‌ها",
    description: "یکدست‌سازی فاصله و اندازهٔ متن روی کارت‌های توضیح.",
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
    title: "چک‌لیست افتتاح ویترین",
    description: "موارد نهایی قبل از باز شدن ویترین به روی مشتری.",
    status: "جدید",
    priority: "فوری",
    assigneeId: "m5",
    dueDate: "۱۴۰۵/۰۷/۰۸",
    label: "بازبینی",
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

const priorityRank: Record<TaskPriority, number> = {
  فوری: 4,
  بالا: 3,
  متوسط: 2,
  پایین: 1,
}

/** Hero «دستور جاری»: active work first, then urgency, then nearest due. */
export function pickFocusTask(list: Task[]): Task | null {
  const open = list.filter((t) => t.status !== "تکمیل‌شده")
  if (open.length === 0) return list[0] ?? null
  const doing = open.filter((t) => t.status === "در حال انجام")
  const pool = doing.length > 0 ? doing : open
  return [...pool].sort((a, b) => {
    const pr = priorityRank[b.priority] - priorityRank[a.priority]
    if (pr !== 0) return pr
    return a.dueDate.localeCompare(b.dueDate, "fa")
  })[0]
}
