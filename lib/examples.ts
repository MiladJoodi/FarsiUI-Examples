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
      "نمای کلی KPI، نمودارها، فعالیت‌ها و جداول یک پنل مدیریت فروش فارسی.",
    href: "/examples/dashboard",
    status: "ready",
  },
  {
    id: "analytics",
    title: "تحلیل‌ها",
    description:
      "متریک‌ها، روندها، مقایسه و گزارش‌های تحلیلی با فیلتر و ویژوال‌سازی.",
    href: "/examples/analytics",
    status: "ready",
  },
  {
    id: "tasks",
    title: "مدیریت کارها",
    description:
      "مدیریت وظایف، پروژه، برد، لیست، اولویت و پیشرفت تیم.",
    href: "/examples/tasks",
    status: "ready",
  },
  {
    id: "calendar",
    title: "تقویم",
    description:
      "رویدادها، نماهای تقویم شمسی، زمان‌بندی و جزئیات قرارها.",
    href: "/examples/calendar",
    status: "ready",
  },
  {
    id: "team-chat",
    title: "گفتگوی تیمی",
    description:
      "گفت‌وگوی تیمی، کانال‌ها، پیام‌ها و پیوست‌ها در رابط RTL.",
    href: "/examples/team-chat",
    status: "ready",
  },
  {
    id: "ecommerce",
    title: "فروشگاه",
    description:
      "فروشگاه، کاتالوگ، سبد خرید و تجربه خرید فارسی و RTL.",
    href: "/examples/ecommerce",
    status: "ready",
  },
  {
    id: "ai-assistant",
    title: "دستیار هوش مصنوعی",
    description:
      "دستیار هوش مصنوعی با گفت‌وگو، پیشنهاد و تعامل طبیعی فارسی.",
    href: "/examples/ai-assistant",
    status: "ready",
  },
  {
    id: "landing",
    title: "صفحه فرود",
    description:
      "صفحه فرود بازاریابی با سلسله‌مراتب بصری و CTAهای واضح.",
    href: "/examples/landing",
    status: "ready",
  },
  {
    id: "blog",
    title: "وبلاگ",
    description:
      "فهرست مطالب، مقاله و خوانایی تایپوگرافی فارسی برای وبلاگ.",
    href: "/examples/blog",
    status: "ready",
  },
  {
    id: "settings",
    title: "تنظیمات",
    description:
      "تنظیمات حساب، اعلان‌ها، ظاهر و ترجیحات سامانه.",
    href: "/examples/settings",
    status: "ready",
  },
  {
    id: "authentication",
    title: "احراز هویت",
    description:
      "ورود، ثبت‌نام، بازیابی رمز و جریان‌های احراز هویت فارسی.",
    href: "/examples/authentication",
    status: "ready",
  },
  {
    id: "pricing",
    title: "قیمت‌گذاری",
    description:
      "جدول قیمت‌گذاری، پلن‌ها، مقایسه ویژگی‌ها و انتخاب اشتراک.",
    href: "/examples/pricing",
    status: "ready",
  },
  {
    id: "contact",
    title: "تماس با ما",
    description: "فرم تماس ساده با حاشیهٔ نازک برای پیام و درخواست.",
    href: "/examples/contact",
    status: "ready",
  },
]
