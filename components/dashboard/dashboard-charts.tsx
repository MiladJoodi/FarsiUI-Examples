"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import { formatPersianNumber } from "@/lib/digits"
import {
  categoryShareData,
  channelSalesData,
  weeklyOrdersData,
} from "@/lib/mock/stats"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const ordersConfig = {
  orders: { label: "سفارش", color: "var(--chart-3)" },
  returned: { label: "مرجوعی", color: "var(--chart-5)" },
} satisfies ChartConfig

const categoryConfig = {
  value: { label: "سهم" },
} satisfies ChartConfig

const channelConfig = {
  sales: { label: "سهم فروش", color: "var(--chart-4)" },
} satisfies ChartConfig

export function WeeklyOrdersChart() {
  return (
    <div className="rounded-xl border">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-medium">سفارش‌های هفته</h2>
        <p className="text-xs text-muted-foreground">
          تعداد سفارش موفق و مرجوعی در هفت روز اخیر
        </p>
      </div>
      <div className="p-4">
        <ChartContainer
          config={ordersConfig}
          className="aspect-[5/4] w-full sm:aspect-video"
        >
          <BarChart
            data={weeklyOrdersData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              tickFormatter={(v) => formatPersianNumber(Number(v))}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="orders"
              fill="var(--color-orders)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="returned"
              fill="var(--color-returned)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}

export function CategoryShareChart() {
  return (
    <div className="rounded-xl border">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-medium">سهم دسته‌بندی‌ها</h2>
        <p className="text-xs text-muted-foreground">
          توزیع فروش بر اساس دسته محصول
        </p>
      </div>
      <div className="p-4">
        <ChartContainer
          config={categoryConfig}
          className="mx-auto aspect-square max-h-[260px] w-full"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie
              data={categoryShareData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              strokeWidth={2}
            >
              {categoryShareData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <ul className="mt-2 grid grid-cols-2 gap-2 text-xs">
          {categoryShareData.map((item) => (
            <li key={item.name} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ background: item.fill }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="ms-auto font-medium">
                {formatPersianNumber(item.value)}٪
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ChannelSalesChart() {
  return (
    <div className="rounded-xl border">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-medium">کانال‌های فروش</h2>
        <p className="text-xs text-muted-foreground">
          سهم هر کانال از کل فروش ماه
        </p>
      </div>
      <div className="p-4">
        <ChartContainer config={channelConfig} className="aspect-[5/4] w-full">
          <BarChart
            data={channelSalesData}
            layout="vertical"
            margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${formatPersianNumber(Number(v))}٪`}
            />
            <YAxis
              type="category"
              dataKey="channel"
              width={88}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="sales"
              fill="var(--color-sales)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
