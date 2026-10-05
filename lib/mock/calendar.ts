/**
 * Mock calendar events for the Calendar example.
 * dateKey uses local Gregorian YYYY-MM-DD for filtering; UI shows Jalali.
 */

import { addDays, startOfDay, toDateKey } from "@/lib/calendar-date"

export type EventCategory = "جلسه" | "ددلاین" | "یادآوری" | "شخصی"

export type CalendarEvent = {
  id: string
  title: string
  dateKey: string
  startTime: string
  endTime: string
  location: string
  attendees: string[]
  description: string
  category: EventCategory
  status: "تأییدشده" | "موقت" | "لغوشده"
}

const EVENT_TEMPLATES: Omit<CalendarEvent, "dateKey">[] = [
  {
    id: "e1",
    title: "جلسه همسویی محصول",
    startTime: "۰۹:۳۰",
    endTime: "۱۰:۳۰",
    location: "اتاق گفت‌وگو — طبقه ۳",
    attendees: ["نیما کاظمی", "سارا محمدی", "رضا کریمی"],
    description: "بررسی اولویت‌های اسپرینت و وضعیت تحویل پنل همیار.",
    category: "جلسه",
    status: "تأییدشده",
  },
  {
    id: "e2",
    title: "بازبینی طراحی سایدبار",
    startTime: "۱۱:۰۰",
    endTime: "۱۲:۰۰",
    location: "فریمون / آنلاین",
    attendees: ["سارا محمدی", "مینا اکبری"],
    description: "مرور فریم‌های موبایل و حالت جمع‌شده ناوبری.",
    category: "جلسه",
    status: "تأییدشده",
  },
  {
    id: "e3",
    title: "ددلاین API کاربران",
    startTime: "۱۷:۰۰",
    endTime: "۱۷:۳۰",
    location: "—",
    attendees: ["مینا اکبری"],
    description: "مهلت تحویل اندپوینت لیست کاربران با صفحه‌بندی.",
    category: "ددلاین",
    status: "تأییدشده",
  },
  {
    id: "e4",
    title: "یادآوری آماده‌سازی دمو",
    startTime: "۰۸:۱۵",
    endTime: "۰۸:۳۰",
    location: "اعلان شخصی",
    attendees: ["نیما کاظمی"],
    description: "چک‌لیست نمایش Analytics و Tasks برای جلسه مشتری.",
    category: "یادآوری",
    status: "تأییدشده",
  },
  {
    id: "e5",
    title: "همگام‌سازی با پشتیبانی",
    startTime: "۱۴:۰۰",
    endTime: "۱۴:۴۵",
    location: "اتاق آبی",
    attendees: ["بهرام یوسفی", "نیما کاظمی"],
    description: "جمع‌بندی تیکت‌های پرتکرار هفته و پیشنهاد بهبود UX.",
    category: "جلسه",
    status: "موقت",
  },
  {
    id: "e6",
    title: "وقت تمرکز — مستند جریان سفارش",
    startTime: "۱۰:۰۰",
    endTime: "۱۲:۳۰",
    location: "میز کار",
    attendees: ["نیما کاظمی"],
    description: "بلاک زمانی بدون جلسه برای نوشتن مستند پشتیبانی.",
    category: "شخصی",
    status: "تأییدشده",
  },
  {
    id: "e7",
    title: "تست رگرسیون موبایل",
    startTime: "۱۵:۳۰",
    endTime: "۱۷:۰۰",
    location: "آزمایشگاه QA",
    attendees: ["بهرام یوسفی", "رضا کریمی"],
    description: "پوشش overflow و toolbar در عرض ۳۹۰ پیکسل.",
    category: "جلسه",
    status: "تأییدشده",
  },
  {
    id: "e8",
    title: "ددلاین انتشار نسخه ۰٫۳",
    startTime: "۱۹:۰۰",
    endTime: "۱۹:۱۵",
    location: "—",
    attendees: ["تیم محصول"],
    description: "مهلت بسته‌شدن تگ انتشار داخلی.",
    category: "ددلاین",
    status: "تأییدشده",
  },
  {
    id: "e9",
    title: "جلسه هفتگی طراحی",
    startTime: "۱۳:۰۰",
    endTime: "۱۴:۰۰",
    location: "آنلاین",
    attendees: ["سارا محمدی", "رضا کریمی", "نیما کاظمی"],
    description: "مرور پلی‌ته‌های باز و تصمیم‌گیری درباره فاصله‌گذاری فرم‌ها.",
    category: "جلسه",
    status: "تأییدشده",
  },
  {
    id: "e10",
    title: "یادآوری تمدید دامنه",
    startTime: "۰۹:۰۰",
    endTime: "۰۹:۱۰",
    location: "اعلان",
    attendees: ["نیما کاظمی"],
    description: "تمدید دامنه demo.hamyar.ir تا پایان فصل.",
    category: "یادآوری",
    status: "موقت",
  },
  {
    id: "e11",
    title: "مصاحبه طراح محصول",
    startTime: "۱۶:۰۰",
    endTime: "۱۷:۰۰",
    location: "اتاق مصاحبه",
    attendees: ["نیما کاظمی", "سارا محمدی"],
    description: "دور دوم مصاحبه برای نقش طراح محصول.",
    category: "جلسه",
    status: "تأییدشده",
  },
  {
    id: "e12",
    title: "تمرین ارائه فصلی",
    startTime: "۱۱:۳۰",
    endTime: "۱۲:۳۰",
    location: "سالن کنفرانس",
    attendees: ["تیم محصول", "فروش"],
    description: "مرور اسلایدهای عملکرد فصل و نکات کلیدی.",
    category: "شخصی",
    status: "لغوشده",
  },
]

export const calendarCategories: {
  id: EventCategory
  label: string
}[] = [
  { id: "جلسه", label: "جلسات" },
  { id: "ددلاین", label: "ددلاین‌ها" },
  { id: "یادآوری", label: "یادآوری‌ها" },
  { id: "شخصی", label: "شخصی" },
]

/** Offsets relative to today so the calendar always looks populated. */
const OFFSETS = [0, 0, 0, 1, 1, 2, 3, 4, 5, 7, 9, 11]

export function buildEventsAround(anchor: Date): CalendarEvent[] {
  const base = startOfDay(anchor)
  return EVENT_TEMPLATES.map((tpl, index) => ({
    ...tpl,
    dateKey: toDateKey(addDays(base, OFFSETS[index] ?? index)),
  }))
}
