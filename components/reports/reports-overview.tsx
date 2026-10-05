"use client"

import * as React from "react"
import type { CSSProperties } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { formatPersianNumber } from "@/lib/digits"
import { formatPercent, formatToman } from "@/lib/format"
import {
  reportBreakdown,
  salesChartData,
} from "@/lib/mock/stats"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const salesConfig = {
  sales: { label: "تحقق", color: "var(--tz-chart-in)" },
  target: { label: "هدف", color: "var(--tz-chart-out)" },
} satisfies ChartConfig

const breakdownRows = [
  {
    label: "ورود وجوه",
    value: formatToman(reportBreakdown.inflow),
    tone: "text-emerald-700 dark:text-emerald-400",
  },
  {
    label: "خروج وجوه",
    value: formatToman(reportBreakdown.outflow),
    tone: "text-red-700 dark:text-red-400",
  },
  {
    label: "کارمزدها",
    value: formatToman(reportBreakdown.fees),
    tone: "text-muted-foreground",
  },
  {
    label: "خالص دوره",
    value: formatToman(reportBreakdown.net),
    tone: "font-semibold text-foreground",
  },
]

export function ReportsOverview() {
  const [period, setPeriod] = React.useState("7m")

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={period}
          onValueChange={(v) => v && setPeriod(v)}
          items={{
            "1m": "یک ماه اخیر",
            "3m": "سه ماه اخیر",
            "7m": "هفت ماه اخیر",
            "1y": "یک سال اخیر",
          }}
        >
          <SelectTrigger
            className="taraz-control taraz-control-pill w-full sm:w-40"
            aria-label="بازه زمانی گزارش"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">یک ماه اخیر</SelectItem>
            <SelectItem value="3m">سه ماه اخیر</SelectItem>
            <SelectItem value="7m">هفت ماه اخیر</SelectItem>
            <SelectItem value="1y">یک سال اخیر</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <section className="taraz-chart taraz-chart-flow taraz-panel min-w-0">
          <div className="taraz-chart-head">
            <div className="min-w-0">
              <h2 className="taraz-subtitle">تحقق در برابر هدف</h2>
              <p className="taraz-muted mt-0.5">ارقام ماهانه به تومان</p>
            </div>
            <div className="taraz-chart-legend">
              <span data-tone="in">تحقق</span>
              <span data-tone="out">هدف</span>
              <span className="taraz-muted font-medium">
                رشد {formatPercent(12.4)}
              </span>
            </div>
          </div>
          <ChartContainer
            config={salesConfig}
            className="aspect-[16/9] w-full max-h-[300px]"
            initialDimension={{ width: 520, height: 280 }}
            style={
              {
                "--color-sales": "var(--tz-chart-in)",
                "--color-target": "var(--tz-chart-out)",
              } as CSSProperties
            }
          >
            <AreaChart
              data={salesChartData}
              margin={{ top: 12, right: 4, left: -8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tzReportSalesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--tz-chart-in)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--tz-chart-in)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient id="tzReportTargetFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--tz-chart-out)"
                    stopOpacity={0.18}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--tz-chart-out)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--tz-line)"
                strokeDasharray="4 6"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={11}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                fontSize={11}
                tickFormatter={(v) =>
                  formatPersianNumber(Math.round(Number(v) / 1_000_000))
                }
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="target"
                stroke="var(--tz-chart-out)"
                fill="url(#tzReportTargetFill)"
                strokeWidth={1.75}
                strokeDasharray="5 5"
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="var(--tz-chart-in)"
                fill="url(#tzReportSalesFill)"
                strokeWidth={2.5}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartContainer>
          <p className="taraz-caption mt-1">محور عمودی: میلیون تومان</p>
        </section>

        <section className="taraz-panel min-w-0 p-5 sm:p-6">
          <h2 className="taraz-subtitle mb-4">جمع‌بندی دوره</h2>
          <ul className="divide-y divide-[color:var(--tz-line)]">
            {breakdownRows.map((row) => (
              <li
                key={row.label}
                className="flex items-baseline justify-between gap-4 py-3.5"
              >
                <span className="taraz-muted">{row.label}</span>
                <span className={`taraz-amount font-semibold ${row.tone}`}>
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <p className="taraz-muted leading-relaxed">
            این گزارش بر اساس تراکنش‌های تأییدشده تراز محاسبه شده و کارمزد
            درگاه‌ها را جدا نشان می‌دهد.
          </p>
        </section>
      </div>
    </div>
  )
}
