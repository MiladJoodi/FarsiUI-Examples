"use client"

import type { CSSProperties } from "react"
import { Cell, Pie, PieChart } from "recharts"

import { formatPersianNumber } from "@/lib/digits"
import { formatToman } from "@/lib/format"
import { cashflowData, channelShareData } from "@/lib/mock/stats"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

const chartConfig = {
  inflow: { label: "ورود", color: "var(--tz-chart-in)" },
  outflow: { label: "خروج", color: "var(--tz-chart-out)" },
} satisfies ChartConfig

const DONUT_COLORS = [
  "var(--tz-donut-1)",
  "var(--tz-donut-2)",
  "var(--tz-donut-3)",
  "var(--tz-donut-4)",
]

const donutData = channelShareData.map((row, i) => ({
  name: row.channel,
  value: row.share,
  amount: row.amount,
  fill: DONUT_COLORS[i % DONUT_COLORS.length]!,
}))

const donutConfig = {
  value: { label: "سهم" },
  ...Object.fromEntries(
    donutData.map((d) => [d.name, { label: d.name, color: d.fill }])
  ),
} satisfies ChartConfig

export function CashflowChart() {
  const weekIn = cashflowData.reduce((s, d) => s + d.inflow, 0)
  const weekOut = cashflowData.reduce((s, d) => s + d.outflow, 0)

  return (
    <section className="taraz-chart taraz-chart-flow taraz-panel min-w-0">
      <div className="taraz-chart-head">
        <div className="min-w-0">
          <h2 className="taraz-subtitle">جریان نقدی هفت روز</h2>
          <p className="taraz-muted mt-0.5">ورود و خروج وجوه</p>
        </div>
        <div className="taraz-chart-legend">
          <span data-tone="in">
            ورود {formatPersianNumber(Math.round(weekIn / 1_000_000))}م
          </span>
          <span data-tone="out">
            خروج {formatPersianNumber(Math.round(weekOut / 1_000_000))}م
          </span>
        </div>
      </div>

      <ChartContainer
        config={chartConfig}
        className="aspect-[16/9] w-full max-h-[240px] sm:max-h-[280px]"
        initialDimension={{ width: 520, height: 240 }}
        style={
          {
            "--color-inflow": "var(--tz-chart-in)",
            "--color-outflow": "var(--tz-chart-out)",
          } as CSSProperties
        }
      >
        <AreaChart
          data={cashflowData}
          margin={{ top: 12, right: 4, left: -8, bottom: 0 }}
        >
          <defs>
            <linearGradient id="tzInflowFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--tz-chart-in)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--tz-chart-in)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="tzOutflowFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--tz-chart-out)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--tz-chart-out)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="var(--tz-line)"
            strokeDasharray="4 6"
          />
          <XAxis
            dataKey="day"
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
            dataKey="inflow"
            stroke="var(--tz-chart-in)"
            fill="url(#tzInflowFill)"
            strokeWidth={2.5}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="outflow"
            stroke="var(--tz-chart-out)"
            fill="url(#tzOutflowFill)"
            strokeWidth={2}
            strokeDasharray="0"
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ChartContainer>
      <p className="taraz-caption mt-1">محور عمودی: میلیون تومان</p>
    </section>
  )
}

export function ChannelDonutChart() {
  const total = donutData.reduce((sum, d) => sum + d.amount, 0)

  return (
    <section className="taraz-chart taraz-chart-donut taraz-panel taraz-donut min-w-0">
      <div className="taraz-chart-head">
        <div className="min-w-0">
          <h2 className="taraz-subtitle">سهم کانال‌ها</h2>
          <p className="taraz-muted mt-0.5">ترکیب ورودی هفته</p>
        </div>
      </div>

      <div className="taraz-donut-layout">
        <div className="taraz-donut-ring relative mx-auto w-full max-w-[200px] sm:max-w-[220px]">
          <ChartContainer
            config={donutConfig}
            className="mx-auto aspect-square w-full max-h-[200px] sm:max-h-[220px]"
            initialDimension={{ width: 220, height: 220 }}
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={4}
                strokeWidth={0}
                cornerRadius={8}
              >
                {donutData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4">
            <span className="taraz-caption">مجموع</span>
            <span className="taraz-amount mt-0.5 text-center text-sm font-extrabold leading-snug sm:text-base">
              {formatToman(total)}
            </span>
          </div>
        </div>

        <ul className="taraz-donut-legend">
          {donutData.map((row) => (
            <li key={row.name}>
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ background: row.fill }}
                />
                <span className="truncate">{row.name}</span>
              </span>
              <span className="taraz-amount shrink-0 font-bold">
                {formatPersianNumber(row.value)}٪
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** @deprecated use ChannelDonutChart */
export function ChannelBreakdown() {
  return <ChannelDonutChart />
}
