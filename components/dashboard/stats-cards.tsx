import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { formatCount, formatPercent, formatToman } from "@/lib/format"
import { dashboardStats } from "@/lib/mock/stats"
import { DashboardPanel } from "@/components/dashboard/dashboard-panel"

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
    deltaSuffix: " تبدیل",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <DashboardPanel
          key={item.label}
          size="sm"
          className="relative overflow-hidden"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 start-0 w-1 bg-primary/80"
          />
          <p className="ps-2 text-sm text-muted-foreground">{item.label}</p>
          <p className="mt-0.5 ps-2 text-base font-semibold tracking-normal whitespace-nowrap sm:text-lg">
            {item.value}
          </p>
          <div
            className={`mt-1.5 ms-2 flex w-fit max-w-[calc(100%-0.5rem)] items-center gap-1.5 rounded-md px-2 py-1 text-xs tracking-normal ${
              item.up
                ? "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-red-500/15 text-red-800 dark:bg-red-500/20 dark:text-red-400"
            }`}
          >
            {item.up ? (
              <TrendingUpIcon className="size-3.5 shrink-0" />
            ) : (
              <TrendingDownIcon className="size-3.5 shrink-0" />
            )}
            <span className="min-w-0 leading-snug">
              {item.deltaSuffix
                ? `${formatPercent(item.delta)}${item.deltaSuffix}`
                : `${item.up ? "+" : "−"}${formatPercent(item.delta)} ${item.hint}`}
            </span>
          </div>
        </DashboardPanel>
      ))}
    </div>
  )
}
