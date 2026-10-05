/**
 * Mock data for Pricing example — independent monetization UX.
 */

export const pricingBrandName = "همیار"
export const pricingBrandTagline = "قیمت‌گذاری فضای کاری محصول"

export type BillingPeriod = "monthly" | "yearly"

export type PlanId = "start" | "team" | "org"

export type PricingPlan = {
  id: PlanId
  name: string
  description: string
  /** Monthly price in Toman; 0 = free */
  monthlyPrice: number
  /** Yearly total in Toman (billed once per year) */
  yearlyPrice: number
  cta: string
  featured?: boolean
  features: string[]
  limits: string[]
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "start",
    name: "شروع",
    description: "برای یک نفر یا تیم خیلی کوچک که تازه می‌خواهد امتحان کند.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: "شروع رایگان",
    features: [
      "تا ۵ عضو",
      "۲ فضای کاری",
      "اسناد پایه",
      "پشتیبانی ایمیلی",
    ],
    limits: ["بدون چک‌لیست انتشار", "بدون نقش سفارشی"],
  },
  {
    id: "team",
    name: "تیم",
    description: "برای تیم‌های محصول فعال که کار، سند و انتشار را یک‌جا می‌خواهند.",
    monthlyPrice: 890_000,
    yearlyPrice: 8_544_000, // ~20% off vs 12× monthly
    cta: "آزمایش ۱۴ روزه",
    featured: true,
    features: [
      "تا ۲۵ عضو",
      "فضای کاری نامحدود",
      "چک‌لیست انتشار",
      "اعلان یکپارچه",
      "پشتیبانی اولویت‌دار",
    ],
    limits: ["SSO در پلن سازمان"],
  },
  {
    id: "org",
    name: "سازمان",
    description: "برای چند تیم با کنترل نقش، گزارش و امنیت بیشتر.",
    monthlyPrice: 2_490_000,
    yearlyPrice: 23_904_000,
    cta: "گفتگو با فروش",
    features: [
      "اعضای نامحدود",
      "نقش‌های سفارشی",
      "گزارش فعالیت",
      "SSO نمایشی",
      "مدیر حساب اختصاصی",
    ],
    limits: [],
  },
]

export type FeatureValue = boolean | string

export type ComparisonFeature = {
  id: string
  name: string
  hint?: string
  values: Record<PlanId, FeatureValue>
}

export type ComparisonGroup = {
  id: string
  title: string
  features: ComparisonFeature[]
}

export const comparisonGroups: ComparisonGroup[] = [
  {
    id: "workspace",
    title: "فضای کاری",
    features: [
      {
        id: "members",
        name: "تعداد اعضا",
        values: { start: "تا ۵ نفر", team: "تا ۲۵ نفر", org: "نامحدود" },
      },
      {
        id: "spaces",
        name: "فضای کاری",
        values: { start: "۲ فضا", team: "نامحدود", org: "نامحدود" },
      },
      {
        id: "docs",
        name: "اسناد و مشخصات",
        values: { start: true, team: true, org: true },
      },
      {
        id: "release",
        name: "چک‌لیست انتشار",
        hint: "مرور RTL، دسترس‌پذیری و حالت خالی قبل از انتشار.",
        values: { start: false, team: true, org: true },
      },
    ],
  },
  {
    id: "collab",
    title: "همکاری",
    features: [
      {
        id: "mentions",
        name: "منشن و بحث روی کار",
        values: { start: true, team: true, org: true },
      },
      {
        id: "notify",
        name: "اعلان یکپارچه",
        values: { start: false, team: true, org: true },
      },
      {
        id: "activity",
        name: "گزارش فعالیت",
        values: { start: false, team: false, org: true },
      },
    ],
  },
  {
    id: "security",
    title: "امنیت و پشتیبانی",
    features: [
      {
        id: "roles",
        name: "نقش‌های سفارشی",
        values: { start: false, team: false, org: true },
      },
      {
        id: "sso",
        name: "SSO",
        hint: "در این نمونه فقط نمایشی است و اتصال واقعی ندارد.",
        values: { start: false, team: false, org: "نمایشی" },
      },
      {
        id: "support",
        name: "پشتیبانی",
        values: {
          start: "ایمیل",
          team: "اولویت‌دار",
          org: "مدیر حساب",
        },
      },
    ],
  },
]

export const pricingFaqs = [
  {
    q: "صورتحساب چطور محاسبه می‌شود؟",
    a: "در پلن‌های پولی، مبلغ ماهانه یا سالانه به تومان نمایش داده می‌شود. پرداخت واقعی در این نمونه وجود ندارد.",
  },
  {
    q: "اگر دورهٔ سالانه را انتخاب کنم چه تغییری می‌کند؟",
    a: "قیمت معادل ماهانه کمتر می‌شود و صورتحساب یک‌جا برای دوازده ماه نمایش داده می‌شود. حدود ۲۰٪ نسبت به پرداخت ماهانه صرفه‌جویی می‌کنید.",
  },
  {
    q: "می‌توانم پلن را وسط دوره عوض کنم؟",
    a: "در محصول واقعی، ارتقا معمولاً فوری و کاهش پلن در پایان دوره اعمال می‌شود. اینجا فقط وضعیت انتخاب پلن را می‌بینید.",
  },
  {
    q: "لغو اشتراک چطور است؟",
    a: "می‌توانید هر زمان لغو کنید؛ دسترسی تا پایان دورهٔ پرداخت‌شده باقی می‌ماند. در این نمونه دکمه‌ها نمایشی‌اند.",
  },
  {
    q: "محدودیت اعضا در پلن شروع چیست؟",
    a: "پلن شروع تا ۵ عضو و ۲ فضای کاری را پوشش می‌دهد. برای تیم بزرگ‌تر، پلن تیم پیشنهاد می‌شود.",
  },
  {
    q: "آزمایش ۱۴ روزه شامل چه چیزهایی است؟",
    a: "روی پلن تیم، امکانات اصلی تا ۱۴ روز بدون کارت بانکی در محصول واقعی در دسترس است. اینجا فقط جریان رابط را نشان می‌دهیم.",
  },
]

/** Yearly savings vs paying monthly for 12 months */
export function yearlySavings(plan: PricingPlan) {
  if (plan.monthlyPrice === 0) return 0
  return plan.monthlyPrice * 12 - plan.yearlyPrice
}

export function effectiveMonthly(plan: PricingPlan, period: BillingPeriod) {
  if (plan.monthlyPrice === 0) return 0
  if (period === "monthly") return plan.monthlyPrice
  return Math.round(plan.yearlyPrice / 12)
}
