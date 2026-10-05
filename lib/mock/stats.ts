export const dashboardStats = {
  availableBalance: 186_420_000,
  pendingSettlement: 24_850_000,
  blockedBalance: 3_200_000,
  todayInflow: 42_680_000,
  todayOutflow: 18_940_000,
  feeToday: 312_000,
  settlementProgress: 68,
}

export const salesChartData = [
  { month: "فروردین", sales: 42_000_000, target: 45_000_000 },
  { month: "اردیبهشت", sales: 51_200_000, target: 48_000_000 },
  { month: "خرداد", sales: 47_800_000, target: 50_000_000 },
  { month: "تیر", sales: 58_400_000, target: 55_000_000 },
  { month: "مرداد", sales: 62_100_000, target: 58_000_000 },
  { month: "شهریور", sales: 71_500_000, target: 65_000_000 },
  { month: "مهر", sales: 68_200_000, target: 70_000_000 },
]

/** Cashflow for the last 7 days (تومان) */
export const cashflowData = [
  { day: "شنبه", inflow: 18_200_000, outflow: 9_400_000 },
  { day: "یکشنبه", inflow: 22_500_000, outflow: 11_100_000 },
  { day: "دوشنبه", inflow: 19_800_000, outflow: 8_650_000 },
  { day: "سه‌شنبه", inflow: 25_400_000, outflow: 14_200_000 },
  { day: "چهارشنبه", inflow: 21_100_000, outflow: 10_800_000 },
  { day: "پنجشنبه", inflow: 28_600_000, outflow: 16_400_000 },
  { day: "جمعه", inflow: 12_300_000, outflow: 5_200_000 },
]

/** @deprecated alias — home/reports now use cashflowData */
export const weeklyOrdersData = cashflowData.map((d) => ({
  day: d.day,
  orders: Math.round(d.inflow / 400_000),
  returned: Math.round(d.outflow / 2_000_000),
}))

export const channelShareData = [
  { channel: "درگاه آنلاین", amount: 78_400_000, share: 42 },
  { channel: "کارت‌به‌کارت", amount: 41_200_000, share: 22 },
  { channel: "چک / حواله", amount: 35_600_000, share: 19 },
  { channel: "کیف پول", amount: 31_800_000, share: 17 },
]

export const categoryShareData = channelShareData.map((c, i) => ({
  name: c.channel,
  value: c.share,
  fill: `var(--color-chart-${(i % 5) + 1})`,
}))

export const channelSalesData = channelShareData.map((c) => ({
  channel: c.channel,
  sales: c.share,
}))

export const reportBreakdown = {
  inflow: 186_900_000,
  outflow: 112_400_000,
  fees: 4_820_000,
  net: 69_680_000,
}

export const goalProgress = {
  monthlySales: 78,
  newCustomers: 64,
  fulfillment: 91,
}

export type ActionItem = {
  id: string
  title: string
  detail: string
  urgency: "فوری" | "امروز" | "این هفته"
  href?: string
}

export const actionItems: ActionItem[] = [
  {
    id: "act1",
    title: "تسویه معلق بانک ملت",
    detail: "۱۲٬۴۵۰٬۰۰۰ تومان از دیروز در انتظار تأیید",
    urgency: "فوری",
  },
  {
    id: "act2",
    title: "مغایرت واریز شبا",
    detail: "مبلغ اعلام‌شده با رسید بانکی هم‌خوان نیست",
    urgency: "فوری",
  },
  {
    id: "act3",
    title: "فاکتور سررسید فروشگاه آریا",
    detail: "سررسید ۱۴۰۵/۰۷/۱۴ — ۸٬۲۰۰٬۰۰۰ تومان",
    urgency: "امروز",
  },
  {
    id: "act4",
    title: "برداشت در انتظار تأیید دوم",
    detail: "درخواست نیما کاظمی برای ۵٬۰۰۰٬۰۰۰ تومان",
    urgency: "امروز",
  },
  {
    id: "act5",
    title: "به‌روزرسانی سقف روزانه",
    detail: "سقف برداشت فعلی کمتر از میانگین هفته است",
    urgency: "این هفته",
  },
]
