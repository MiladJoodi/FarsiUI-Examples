import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { formatCount, formatToman } from "@/lib/format"
import { formatPersianNumber } from "@/lib/digits"
import { dashboardStats } from "@/lib/mock/stats"

const items = [
  {
    label: "فروش امروز",
    value: formatToman(dashboardStats.todaySales),
    hint: "نسبت به دیروز",
    delta: 8.4,
    up: true,
  },
  {
    label: "سفارش‌های جدید",
    value: formatCount(dashboardStats.newOrders),
    hint: "نسبت به میانگین هفته",
    delta: 3.1,
    up: true,
  },
  {
    label: "کاربران فعال",
    value: formatCount(dashboardStats.users),
    hint: "عضویت این ماه",
    delta: 1.2,
    up: false,
  },
  {
    label: "میانگین سبد",
    value: formatToman(dashboardStats.avgOrder),
    hint: "نرخ تبدیل",
    delta: dashboardStats.conversion,
    up: true,
    deltaSuffix: "٪ تبدیل",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border bg-background px-4 py-3"
        >
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="mt-0.5 text-lg font-semibold tracking-tight sm:text-xl">
            {item.value}
          </p>
          <div
            className={`mt-1.5 flex items-center gap-1.5 text-xs ${
              item.up
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-amber-700 dark:text-amber-400"
            }`}
          >
            {item.up ? (
              <TrendingUpIcon className="size-3.5 shrink-0" />
            ) : (
              <TrendingDownIcon className="size-3.5 shrink-0" />
            )}
            <span>
              {item.deltaSuffix
                ? `${formatPersianNumber(item.delta)}${item.deltaSuffix}`
                : `${item.up ? "+" : "−"}${formatPersianNumber(item.delta)}٪ ${item.hint}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
