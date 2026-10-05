/**
 * Mock analytics series for the Analytics example.
 * Independent from dashboard operational mock data.
 */

export type AnalyticsRangeId = "7d" | "30d" | "90d" | "1404"

export const analyticsRanges: {
  id: AnalyticsRangeId
  label: string
  compareLabel: string
}[] = [
  { id: "7d", label: "۷ روز اخیر", compareLabel: "نسبت به ۷ روز قبل" },
  { id: "30d", label: "۳۰ روز اخیر", compareLabel: "نسبت به ماه قبل" },
  { id: "90d", label: "۹۰ روز اخیر", compareLabel: "نسبت به فصل قبل" },
  { id: "1404", label: "سال ۱۴۰۴", compareLabel: "نسبت به سال ۱۴۰۳" },
]

export type AnalyticsKpi = {
  id: string
  label: string
  value: number
  valueKind: "toman" | "count" | "percent"
  delta: number
  up: boolean
  context: string
}

export const analyticsKpis: AnalyticsKpi[] = [
  {
    id: "revenue",
    label: "درآمد خالص",
    value: 486_200_000,
    valueKind: "toman",
    delta: 12.4,
    up: true,
    context: "پس از کسر مرجوعی و تخفیف",
  },
  {
    id: "orders",
    label: "سفارش تکمیل‌شده",
    value: 3_482,
    valueKind: "count",
    delta: 6.1,
    up: true,
    context: "میانگین ۱۱۶ سفارش در روز",
  },
  {
    id: "conversion",
    label: "نرخ تبدیل",
    value: 3.8,
    valueKind: "percent",
    delta: 0.4,
    up: false,
    context: "از بازدید تا پرداخت موفق",
  },
  {
    id: "aov",
    label: "میانگین سبد",
    value: 1_395_000,
    valueKind: "toman",
    delta: 2.8,
    up: true,
    context: "بدون سفارش‌های سازمانی",
  },
]

/** Daily trend — last 14 points (Jalali day labels) */
export const revenueTrendData = [
  { day: "۲۶ شهریور", revenue: 28.4, orders: 98, visitors: 3120 },
  { day: "۲۷ شهریور", revenue: 31.2, orders: 112, visitors: 3340 },
  { day: "۲۸ شهریور", revenue: 27.6, orders: 94, visitors: 2980 },
  { day: "۲۹ شهریور", revenue: 35.8, orders: 128, visitors: 3610 },
  { day: "۳۰ شهریور", revenue: 33.1, orders: 119, visitors: 3480 },
  { day: "۳۱ شهریور", revenue: 29.4, orders: 105, visitors: 3210 },
  { day: "۱ مهر", revenue: 36.7, orders: 134, visitors: 3720 },
  { day: "۲ مهر", revenue: 38.2, orders: 141, visitors: 3890 },
  { day: "۳ مهر", revenue: 34.5, orders: 126, visitors: 3550 },
  { day: "۴ مهر", revenue: 41.0, orders: 152, visitors: 4120 },
  { day: "۵ مهر", revenue: 39.6, orders: 147, visitors: 4010 },
  { day: "۶ مهر", revenue: 42.8, orders: 158, visitors: 4280 },
  { day: "۷ مهر", revenue: 44.1, orders: 163, visitors: 4410 },
  { day: "۸ مهر", revenue: 46.3, orders: 171, visitors: 4560 },
]

/** Funnel stages */
export const funnelData = [
  { stage: "بازدید", value: 48200, fill: "var(--chart-1)" },
  { stage: "محصول", value: 21480, fill: "var(--chart-2)" },
  { stage: "سبد", value: 8640, fill: "var(--chart-3)" },
  { stage: "پرداخت", value: 5120, fill: "var(--chart-4)" },
  { stage: "موفق", value: 3482, fill: "var(--chart-5)" },
]

export const channelPerformance = [
  { channel: "جستجوی ارگانیک", revenue: 168.4, share: 34.6, sessions: 18240 },
  { channel: "تبلیغات کلیکی", revenue: 124.2, share: 25.5, sessions: 14620 },
  { channel: "شبکه‌های اجتماعی", revenue: 86.7, share: 17.8, sessions: 12110 },
  { channel: "ایمیل", revenue: 58.3, share: 12.0, sessions: 6840 },
  { channel: "ارجاع شرکا", revenue: 48.6, share: 10.1, sessions: 4210 },
]

export const deviceShare = [
  { name: "موبایل", value: 58, fill: "var(--chart-1)" },
  { name: "دسکتاپ", value: 31, fill: "var(--chart-2)" },
  { name: "تبلت", value: 11, fill: "var(--chart-3)" },
]

export type CampaignRow = {
  id: string
  name: string
  channel: string
  spend: number
  revenue: number
  roas: number
  conv: number
  status: "فعال" | "پایان‌یافته" | "پیش‌نویس"
}

export const campaignRows: CampaignRow[] = [
  {
    id: "c-01",
    name: "مهرِ خرید — لوازم جانبی",
    channel: "تبلیغات کلیکی",
    spend: 42_000_000,
    revenue: 186_400_000,
    roas: 4.4,
    conv: 4.2,
    status: "فعال",
  },
  {
    id: "c-02",
    name: "بازدید مجدد مشتریان وفادار",
    channel: "ایمیل",
    spend: 8_500_000,
    revenue: 61_200_000,
    roas: 7.2,
    conv: 9.1,
    status: "فعال",
  },
  {
    id: "c-03",
    name: "کمپین اینستاگرام صوتی",
    channel: "شبکه‌های اجتماعی",
    spend: 27_800_000,
    revenue: 74_600_000,
    roas: 2.7,
    conv: 2.4,
    status: "فعال",
  },
  {
    id: "c-04",
    name: "همکاری با فروشگاه‌یار",
    channel: "ارجاع شرکا",
    spend: 15_000_000,
    revenue: 48_900_000,
    roas: 3.3,
    conv: 3.6,
    status: "پایان‌یافته",
  },
  {
    id: "c-05",
    name: "جستجوی برند — خرید مستقیم",
    channel: "جستجوی ارگانیک",
    spend: 0,
    revenue: 112_300_000,
    roas: 0,
    conv: 5.8,
    status: "فعال",
  },
  {
    id: "c-06",
    name: "پیشنویس بلک‌فرایدی ۱۴۰۴",
    channel: "تبلیغات کلیکی",
    spend: 0,
    revenue: 0,
    roas: 0,
    conv: 0,
    status: "پیش‌نویس",
  },
]

export const analyticsInsights = [
  {
    title: "رشد درآمد در نیمهٔ اول مهر",
    body: "از ۱ تا ۸ مهر درآمد روزانه به‌طور میانگین ۱۸٪ بالاتر از میانگین شهریور بوده است.",
    tone: "positive" as const,
  },
  {
    title: "افت جزئی نرخ تبدیل",
    body: "نرخ تبدیل ۰٫۴ واحد درصد کمتر از دورهٔ قبل است؛ بیشترین ریزش بین «سبد» و «پرداخت» دیده می‌شود.",
    tone: "warning" as const,
  },
  {
    title: "ایمیل بالاترین بازده را دارد",
    body: "کمپین بازدید مجدد با ROAS ۷٫۲ بهترین بازده هزینه را در بین کانال‌های پولی ثبت کرده است.",
    tone: "neutral" as const,
  },
]

export const reportUpdatedAt = "۱۴۰۵/۰۷/۰۸ — ساعت ۱۸:۴۰"
