"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import { formatCount, formatPercent, formatToman } from "@/lib/format"
import {
  categoryShareData,
  channelSalesData,
  salesChartData,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPersianNumber } from "@/lib/digits"

const salesConfig = {
  sales: { label: "فروش", color: "var(--chart-1)" },
  target: { label: "هدف", color: "var(--chart-2)" },
} satisfies ChartConfig

const ordersConfig = {
  orders: { label: "سفارش", color: "var(--chart-3)" },
  returned: { label: "مرجوعی", color: "var(--chart-5)" },
} satisfies ChartConfig

const channelConfig = {
  sales: { label: "سهم", color: "var(--chart-4)" },
} satisfies ChartConfig

const summary = [
  { label: "مجموع فروش دوره", value: formatToman(401_200_000) },
  { label: "میانگین ماهانه", value: formatToman(57_314_000) },
  { label: "رشد نسبت به دوره قبل", value: formatPercent(12.4) },
  { label: "سفارش‌های موفق", value: formatCount(1_284) },
]

export function ReportsOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">گزارش عملکرد</h1>
          <p className="text-sm text-muted-foreground">
            تحلیل فروش، سفارش‌ها و کانال‌های جذب بدون اتصال به داده زنده
          </p>
        </div>
        <Select
          defaultValue="7m"
          items={{
            "1m": "یک ماه اخیر",
            "3m": "سه ماه اخیر",
            "7m": "هفت ماه اخیر",
            "1y": "یک سال اخیر",
          }}
        >
          <SelectTrigger className="w-[150px]" aria-label="بازه زمانی گزارش">
            <SelectValue placeholder="بازه زمانی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">یک ماه اخیر</SelectItem>
            <SelectItem value="3m">سه ماه اخیر</SelectItem>
            <SelectItem value="7m">هفت ماه اخیر</SelectItem>
            <SelectItem value="1y">یک سال اخیر</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border bg-background px-4 py-3"
          >
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-base font-semibold tracking-normal whitespace-nowrap sm:text-lg">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="sales" className="gap-4">
        <TabsList>
          <TabsTrigger value="sales">فروش</TabsTrigger>
          <TabsTrigger value="orders">سفارش‌ها</TabsTrigger>
          <TabsTrigger value="channels">کانال‌ها</TabsTrigger>
        </TabsList>

        <TabsContent
          value="sales"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div className="rounded-xl border sm:col-span-2 lg:col-span-1">
            <div className="border-b px-3 py-2.5">
              <h3 className="text-sm font-medium">فروش در برابر هدف</h3>
            </div>
            <div className="p-3">
              <ChartContainer
                config={salesConfig}
                className="aspect-[5/3] w-full max-h-[200px]"
              >
                <AreaChart
                  data={salesChartData}
                  margin={{ top: 6, right: 4, left: 4, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    reversed
                    tickMargin={6}
                  />
                  <YAxis
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    tickFormatter={(v) =>
                      formatPersianNumber(Number(v) / 1_000_000)
                    }
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    dataKey="target"
                    type="monotone"
                    stroke="var(--color-target)"
                    fill="var(--color-target)"
                    fillOpacity={0.08}
                    strokeDasharray="4 4"
                  />
                  <Area
                    dataKey="sales"
                    type="monotone"
                    stroke="var(--color-sales)"
                    fill="var(--color-sales)"
                    fillOpacity={0.16}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>

          <div className="rounded-xl border">
            <div className="border-b px-3 py-2.5">
              <h3 className="text-sm font-medium">ترکیب دسته‌ها</h3>
            </div>
            <div className="p-3">
              <ChartContainer
                config={{ value: { label: "سهم" } }}
                className="mx-auto aspect-square max-h-[180px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="name" />}
                  />
                  <Pie
                    data={categoryShareData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={68}
                  >
                    {categoryShareData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <h3 className="mb-2.5 text-sm font-medium">نکات دوره</h3>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>بهترین ماه: شهریور با فروش بالای هدف</li>
              <li>بیشترین سهم دسته: لوازم جانبی</li>
              <li>پیشنهاد: کمپین برای دسته‌های تصویری و نمایشگر</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="rounded-xl border">
            <div className="border-b px-3 py-2.5">
              <h3 className="text-sm font-medium">سفارش و مرجوعی هفتگی</h3>
            </div>
            <div className="p-3">
              <ChartContainer
                config={ordersConfig}
                className="aspect-[5/3] w-full max-h-[220px]"
              >
                <BarChart
                  data={weeklyOrdersData}
                  margin={{ top: 6, right: 4, left: 4, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    reversed
                  />
                  <YAxis
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    width={32}
                    tickFormatter={(v) => formatPersianNumber(Number(v))}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
                  <Bar
                    dataKey="returned"
                    fill="var(--color-returned)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="channels">
          <div className="rounded-xl border">
            <div className="border-b px-3 py-2.5">
              <h3 className="text-sm font-medium">سهم کانال‌های فروش</h3>
            </div>
            <div className="p-3">
              <ChartContainer
                config={channelConfig}
                dir="ltr"
                className="aspect-[5/3] w-full max-h-[220px]"
              >
                <BarChart
                  data={channelSalesData}
                  layout="vertical"
                  margin={{ top: 6, right: 12, left: 4, bottom: 6 }}
                >
                  <CartesianGrid horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v) =>
                      `${formatPersianNumber(Number(v))}٪`
                    }
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    type="category"
                    dataKey="channel"
                    width={88}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="sales"
                    fill="var(--color-sales)"
                    radius={[0, 4, 4, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
