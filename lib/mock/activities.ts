export type Activity = {
  id: string
  title: string
  detail: string
  time: string
}

export const activities: Activity[] = [
  {
    id: "a1",
    title: "واریز تأیید شد",
    detail: "سارا محمدی — ۲٬۴۵۰٬۰۰۰ تومان از درگاه",
    time: "۱۲ دقیقه پیش",
  },
  {
    id: "a2",
    title: "درخواست تسویه ثبت شد",
    detail: "بانک ملت — ۱۲٬۴۵۰٬۰۰۰ تومان",
    time: "۴۵ دقیقه پیش",
  },
  {
    id: "a3",
    title: "طرف‌حساب جدید",
    detail: "فروشگاه آریا به فهرست اضافه شد",
    time: "۲ ساعت پیش",
  },
  {
    id: "a4",
    title: "برداشت ناموفق",
    detail: "نگار صالحی — موجودی کافی نبود",
    time: "دیروز",
  },
  {
    id: "a5",
    title: "گزارش ماهانه آماده است",
    detail: "خلاصه مهر ۱۴۰۵ تولید شد",
    time: "دیروز",
  },
  {
    id: "a6",
    title: "سقف روزانه تغییر کرد",
    detail: "سقف برداشت به ۵۰ میلیون تومان رسید",
    time: "۲ روز پیش",
  },
]
