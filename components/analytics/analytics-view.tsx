"use client"

import * as React from "react"
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  DownloadIcon,
  FilterIcon,
} from "lucide-react"

import {
  analyticsInsights,
  analyticsKpis,
  analyticsRanges,
  campaignRows,
  channelPerformance,
  deviceShare,
  funnelData,
  reportUpdatedAt,
  revenueTrendData,
  type AnalyticsRangeId,
  type CampaignRow,
} from "@/lib/mock/analytics"
import { formatPersianNumber } from "@/lib/digits"
import { formatToman } from "@/lib/format"
import {
  DashboardPanel,
  DashboardPanelBody,
  DashboardPanelDescription,
  DashboardPanelHeader,
  DashboardPanelTitle,
} from "@/components/dashboard/dashboard-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { toast } from "sonner"

const trendConfig = {
  revenue: { label: "درآمد (میلیون)", color: "var(--chart-1)" },
  orders: { label: "سفارش", color: "var(--chart-2)" },
} satisfies ChartConfig

const funnelConfig = {
  value: { label: "تعداد" },
} satisfies ChartConfig

const channelConfig = {
  revenue: { label: "درآمد (میلیون)", color: "var(--chart-3)" },
} satisfies ChartConfig

const deviceConfig = {
  value: { label: "سهم" },
} satisfies ChartConfig

function formatDelta(delta: number, up: boolean) {
  const sign = up ? "+" : "−"
  return `${sign}${formatPersianNumber(delta)}٪`
}

function CampaignStatusBadge({ status }: { status: CampaignRow["status"] }) {
  const variant =
    status === "فعال"
      ? "default"
      : status === "پایان‌یافته"
        ? "secondary"
        : "outline"
  return <Badge variant={variant}>{status}</Badge>
}

export function AnalyticsView() {
  const [range, setRange] = React.useState<AnalyticsRangeId>("30d")
  const rangeMeta =
    analyticsRanges.find((item) => item.id === range) ?? analyticsRanges[1]

  return (
    <div className="flex flex-col gap-6">
      {/* Page header + filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            تحلیل عملکرد
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            روند درآمد، تبدیل و کانال‌ها در بازهٔ انتخابی — آخرین به‌روزرسانی{" "}
            {reportUpdatedAt}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Select
            value={range}
            onValueChange={(value) =>
              setRange((value as AnalyticsRangeId) ?? "30d")
            }
            items={Object.fromEntries(
              analyticsRanges.map((item) => [item.id, item.label])
            )}
          >
            <SelectTrigger className="w-full sm:w-[160px]" aria-label="بازه زمانی">
              <SelectValue placeholder="بازه زمانی" />
            </SelectTrigger>
            <SelectContent>
              {analyticsRanges.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue="all"
            items={{
              all: "همه کانال‌ها",
              organic: "جستجوی ارگانیک",
              paid: "تبلیغات کلیکی",
              social: "شبکه‌های اجتماعی",
              email: "ایمیل",
            }}
          >
            <SelectTrigger
              className="w-full sm:w-[150px]"
              aria-label="فیلتر کانال"
            >
              <FilterIcon className="size-3.5 opacity-70" />
              <SelectValue placeholder="کانال" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه کانال‌ها</SelectItem>
              <SelectItem value="organic">جستجوی ارگانیک</SelectItem>
              <SelectItem value="paid">تبلیغات کلیکی</SelectItem>
              <SelectItem value="social">شبکه‌های اجتماعی</SelectItem>
              <SelectItem value="email">ایمیل</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() =>
              toast.success("خلاصه گزارش برای خروجی آماده شد (نمونه)")
            }
          >
            <DownloadIcon data-icon="inline-start" />
            خروجی خلاصه
          </Button>
        </div>
      </div>

      {/* KPI strip — denser, comparison-first */}
      <section aria-label="شاخص‌های کلیدی" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsKpis.map((kpi) => (
          <div
            key={kpi.id}
            data-slot="card"
            className="rounded-xl border bg-card px-4 py-3 text-card-foreground shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-medium tabular-nums ${
                  kpi.up
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-amber-700 dark:text-amber-400"
                }`}
              >
                {kpi.up ? (
                  <ArrowUpRightIcon className="size-3.5" aria-hidden />
                ) : (
                  <ArrowDownRightIcon className="size-3.5" aria-hidden />
                )}
                {formatDelta(kpi.delta, kpi.up)}
              </span>
            </div>
            <p className="mt-1 text-base font-semibold tracking-tight sm:text-lg">
              {kpi.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {rangeMeta.compareLabel} · {kpi.context}
            </p>
          </div>
        ))}
      </section>

      <Tabs defaultValue="overview" className="gap-4">
        <TabsList
          variant="line"
          className="h-auto w-full flex-wrap justify-start gap-1"
        >
          <TabsTrigger value="overview">نمای تحلیلی</TabsTrigger>
          <TabsTrigger value="channels">کانال‌ها</TabsTrigger>
          <TabsTrigger value="campaigns">کمپین‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <DashboardPanel>
              <DashboardPanelHeader>
                <div>
                  <DashboardPanelTitle>روند درآمد و سفارش</DashboardPanelTitle>
                  <DashboardPanelDescription>
                    درآمد به میلیون تومان در کنار تعداد سفارش روزانه
                  </DashboardPanelDescription>
                </div>
              </DashboardPanelHeader>
              <DashboardPanelBody>
                <ChartContainer
                  config={trendConfig}
                  className="aspect-[5/3] w-full min-h-[220px] sm:aspect-video"
                >
                  <AreaChart
                    data={revenueTrendData}
                    margin={{ top: 8, right: 4, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      reversed
                      interval="preserveStartEnd"
                      minTickGap={28}
                    />
                    <YAxis
                      yAxisId="revenue"
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      width={40}
                      tickFormatter={(v) => formatPersianNumber(Number(v))}
                    />
                    <YAxis
                      yAxisId="orders"
                      orientation="left"
                      tickLine={false}
                      axisLine={false}
                      width={36}
                      tickFormatter={(v) => formatPersianNumber(Number(v))}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      yAxisId="revenue"
                      dataKey="revenue"
                      type="monotone"
                      stroke="var(--color-revenue)"
                      fill="var(--color-revenue)"
                      fillOpacity={0.14}
                      strokeWidth={2}
                    />
                    <Area
                      yAxisId="orders"
                      dataKey="orders"
                      type="monotone"
                      stroke="var(--color-orders)"
                      fill="var(--color-orders)"
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </DashboardPanelBody>
            </DashboardPanel>

            <DashboardPanel>
              <DashboardPanelHeader>
                <div>
                  <DashboardPanelTitle>قیف تبدیل</DashboardPanelTitle>
                  <DashboardPanelDescription>
                    مسیر کاربر از بازدید تا پرداخت موفق
                  </DashboardPanelDescription>
                </div>
              </DashboardPanelHeader>
              <DashboardPanelBody className="space-y-4">
                <ChartContainer
                  config={funnelConfig}
                  className="aspect-[4/3] w-full min-h-[200px]"
                >
                  <BarChart
                    data={funnelData}
                    layout="vertical"
                    margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <XAxis
                      type="number"
                      reversed
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => formatPersianNumber(Number(v))}
                    />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      orientation="right"
                      width={64}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="value" radius={[4, 0, 0, 4]}>
                      {funnelData.map((entry) => (
                        <Cell key={entry.stage} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {funnelData.map((step, index) => {
                    const prev = funnelData[index - 1]
                    const rate = prev
                      ? Math.round((step.value / prev.value) * 1000) / 10
                      : 100
                    return (
                      <li
                        key={step.stage}
                        className="flex items-center justify-between gap-2 border-b border-border/60 pb-2 last:border-0 last:pb-0"
                      >
                        <span>{step.stage}</span>
                        <span className="tabular-nums text-foreground">
                          {formatPersianNumber(step.value)}
                          {prev ? (
                            <span className="ms-2 text-muted-foreground">
                              ({formatPersianNumber(rate)}٪ از مرحله قبل)
                            </span>
                          ) : null}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </DashboardPanelBody>
            </DashboardPanel>
          </div>

          <InsightsBlock />
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <DashboardPanel>
              <DashboardPanelHeader>
                <div>
                  <DashboardPanelTitle>عملکرد کانال‌ها</DashboardPanelTitle>
                  <DashboardPanelDescription>
                    درآمد به میلیون تومان بر اساس منبع جذب
                  </DashboardPanelDescription>
                </div>
              </DashboardPanelHeader>
              <DashboardPanelBody>
                <ChartContainer
                  config={channelConfig}
                  className="aspect-[5/3] w-full min-h-[240px]"
                >
                  <BarChart
                    data={channelPerformance}
                    layout="vertical"
                    margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <XAxis
                      type="number"
                      reversed
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => formatPersianNumber(Number(v))}
                    />
                    <YAxis
                      type="category"
                      dataKey="channel"
                      orientation="right"
                      width={110}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="revenue"
                      fill="var(--color-revenue)"
                      radius={[4, 0, 0, 4]}
                    />
                  </BarChart>
                </ChartContainer>
              </DashboardPanelBody>
            </DashboardPanel>

            <DashboardPanel>
              <DashboardPanelHeader>
                <div>
                  <DashboardPanelTitle>سهم دستگاه</DashboardPanelTitle>
                  <DashboardPanelDescription>
                    توزیع نشست‌ها بر اساس نوع دستگاه
                  </DashboardPanelDescription>
                </div>
              </DashboardPanelHeader>
              <DashboardPanelBody>
                <ChartContainer
                  config={deviceConfig}
                  className="mx-auto aspect-square max-h-[240px] w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="name" />}
                    />
                    <Pie
                      data={deviceShare}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={84}
                      strokeWidth={2}
                    >
                      {deviceShare.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <ul className="mt-3 grid gap-2 text-sm">
                  {deviceShare.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ background: item.fill }}
                          aria-hidden
                        />
                        {item.name}
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatPersianNumber(item.value)}٪
                      </span>
                    </li>
                  ))}
                </ul>
              </DashboardPanelBody>
            </DashboardPanel>
          </div>

          <DashboardPanel>
            <DashboardPanelHeader>
              <div>
                <DashboardPanelTitle>خلاصه کانال</DashboardPanelTitle>
                <DashboardPanelDescription>
                  نشست، سهم درآمد و عملکرد نسبی
                </DashboardPanelDescription>
              </div>
            </DashboardPanelHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>کانال</TableHead>
                    <TableHead className="text-end">نشست</TableHead>
                    <TableHead className="text-end">سهم درآمد</TableHead>
                    <TableHead className="text-end">درآمد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelPerformance.map((row) => (
                    <TableRow key={row.channel}>
                      <TableCell className="font-medium">{row.channel}</TableCell>
                      <TableCell className="text-end tabular-nums">
                        {formatPersianNumber(row.sessions)}
                      </TableCell>
                      <TableCell className="text-end tabular-nums">
                        {formatPersianNumber(row.share)}٪
                      </TableCell>
                      <TableCell className="text-end tabular-nums">
                        {formatPersianNumber(row.revenue)} م
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DashboardPanel>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <DashboardPanel>
            <DashboardPanelHeader>
              <div>
                <DashboardPanelTitle>جدول عملکرد کمپین</DashboardPanelTitle>
                <DashboardPanelDescription>
                  هزینه، درآمد، ROAS و نرخ تبدیل در بازهٔ جاری
                </DashboardPanelDescription>
              </div>
            </DashboardPanelHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[12rem]">کمپین</TableHead>
                    <TableHead>کانال</TableHead>
                    <TableHead className="text-end">هزینه</TableHead>
                    <TableHead className="text-end">درآمد</TableHead>
                    <TableHead className="text-end">ROAS</TableHead>
                    <TableHead className="text-end">تبدیل</TableHead>
                    <TableHead className="text-center">وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.channel}
                      </TableCell>
                      <TableCell className="text-end whitespace-nowrap tabular-nums">
                        {row.spend === 0 ? "—" : formatToman(row.spend)}
                      </TableCell>
                      <TableCell className="text-end whitespace-nowrap tabular-nums">
                        {row.revenue === 0 ? "—" : formatToman(row.revenue)}
                      </TableCell>
                      <TableCell className="text-end tabular-nums">
                        {row.roas === 0
                          ? "—"
                          : formatPersianNumber(row.roas)}
                      </TableCell>
                      <TableCell className="text-end tabular-nums">
                        {row.conv === 0
                          ? "—"
                          : `${formatPersianNumber(row.conv)}٪`}
                      </TableCell>
                      <TableCell className="text-center">
                        <CampaignStatusBadge status={row.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DashboardPanel>

          <InsightsBlock />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InsightsBlock() {
  return (
    <section aria-label="نکات کلیدی دوره">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-medium">نکات کلیدی دوره</h2>
        <Separator className="flex-1" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {analyticsInsights.map((item) => (
          <div
            key={item.title}
            data-slot="card"
            className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium leading-snug">{item.title}</h3>
              <Badge
                variant={
                  item.tone === "positive"
                    ? "default"
                    : item.tone === "warning"
                      ? "outline"
                      : "secondary"
                }
                className="shrink-0"
              >
                {item.tone === "positive"
                  ? "مثبت"
                  : item.tone === "warning"
                    ? "توجه"
                    : "اطلاع"}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
