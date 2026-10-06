export type ExampleStatus = "ready" | "soon"

export type ExampleMeta = {
  id: string
  title: string
  description: string
  href: string
  status: ExampleStatus
}

/** Registry of FarsiUI showcase examples — Hub discovery only. */
export const EXAMPLES: ExampleMeta[] = [
  {
    id: "dashboard",
    title: "داشبورد",
    description:
      "پنل مالی برای مدیریت موجودی، تسویه‌ها، تراکنش‌ها و حساب‌های بانکی.",
    href: "/examples/dashboard",
    status: "ready",
  },
  {
    id: "analytics",
    title: "تحلیل‌ها",
    description:
      "نمایش متریک‌ها، روندها و مقایسه داده‌ها با فیلترها و نمودارهای تحلیلی.",
    href: "/examples/analytics",
    status: "ready",
  },
  {
    id: "tasks",
    title: "مدیریت کارها",
    description:
      "مدیریت پروژه‌ها و وظایف با برد، لیست، اولویت و وضعیت پیشرفت.",
    href: "/examples/tasks",
    status: "ready",
  },
  {
    id: "calendar",
    title: "تقویم",
    description:
      "تقویم شمسی برای مدیریت رویدادها، قرارها و برنامه‌های روزانه.",
    href: "/examples/calendar",
    status: "ready",
  },
  {
    id: "team-chat",
    title: "گفتگوی تیمی",
    description:
      "فضای گفت‌وگوی تیمی برای کانال‌ها، پیام‌ها، پاسخ‌ها و فایل‌های پیوست.",
    href: "/examples/team-chat",
    status: "ready",
  },
  {
    id: "ecommerce",
    title: "فروشگاه",
    description:
      "فروشگاه فارسی با محصولات، دسته‌بندی‌ها، سبد خرید و فرایند پرداخت.",
    href: "/examples/ecommerce",
    status: "ready",
  },
  {
    id: "ai-assistant",
    title: "دستیار هوش مصنوعی",
    description:
      "رابط گفت‌وگو با دستیار هوش مصنوعی برای پرسش، پاسخ و انجام کارها.",
    href: "/examples/ai-assistant",
    status: "ready",
  },
  {
    id: "landing",
    title: "صفحه فرود",
    description:
      "صفحه معرفی محصول با بخش‌های اصلی، مزایا، نمونه‌ها و دعوت به اقدام.",
    href: "/examples/landing",
    status: "ready",
  },
  {
    id: "blog",
    title: "وبلاگ",
    description:
      "وبلاگ فارسی با فهرست مطالب، دسته‌بندی‌ها و صفحه خواندن مقاله.",
    href: "/examples/blog",
    status: "ready",
  },
  {
    id: "settings",
    title: "تنظیمات",
    description:
      "مدیریت اطلاعات حساب، اعلان‌ها، ظاهر و سایر تنظیمات کاربر.",
    href: "/examples/settings",
    status: "ready",
  },
  {
    id: "authentication",
    title: "احراز هویت",
    description:
      "صفحات ورود، ثبت‌نام، بازیابی رمز و تأیید هویت کاربر.",
    href: "/examples/authentication",
    status: "ready",
  },
  {
    id: "pricing",
    title: "قیمت‌گذاری",
    description:
      "نمایش پلن‌ها، مقایسه امکانات و انتخاب اشتراک مناسب.",
    href: "/examples/pricing",
    status: "ready",
  },
]
