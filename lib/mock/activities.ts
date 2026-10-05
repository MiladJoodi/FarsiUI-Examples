export type Activity = {
  id: string
  title: string
  detail: string
  time: string
}

export const activities: Activity[] = [
  {
    id: "a1",
    title: "سفارش جدید ثبت شد",
    detail: "سارا محمدی سفارش ۱۰۴۸۲ را ثبت کرد",
    time: "12 دقیقه پیش",
  },
  {
    id: "a2",
    title: "موجودی به‌روز شد",
    detail: "موجودی هدفون بی‌سیم آوا به 42 عدد رسید",
    time: "45 دقیقه پیش",
  },
  {
    id: "a3",
    title: "کاربر جدید",
    detail: "بهرام یوسفی به سامانه پیوست",
    time: "2 ساعت پیش",
  },
  {
    id: "a4",
    title: "پرداخت تأیید شد",
    detail: "پرداخت سفارش ۱۰۴۷۹ با موفقیت انجام شد",
    time: "دیروز",
  },
  {
    id: "a5",
    title: "گزارش هفتگی آماده است",
    detail: "خلاصه فروش هفته گذشته تولید شد",
    time: "دیروز",
  },
]
