"use client"

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  DownloadIcon,
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

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
import { formatCount, formatPercent, formatToman } from "@/lib/format"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const trendConfig = {
  revenue: { label: "درآمد (میلیون)", color: "var(--chart-1)" },
  orders: { label: "سفارش", color: "var(--chart-2)" },
} satisfies ChartConfig

const CHANNEL_FILTERS = [
  { id: "all", label: "همه" },
  { id: "organic", label: "ارگانیک" },
  { id: "paid", label: "کلیکی" },
  { id: "social", label: "اجتماعی" },
  { id: "email", label: "ایمیل" },
] as const

type ChannelFilterId = (typeof CHANNEL_FILTERS)[number]["id"]
type ViewId = "overview" | "channels" | "campaigns"

function formatDelta(delta: number, up: boolean) {
  const sign = up ? "+" : "−"
  return `${sign}${formatPercent(delta)}`
}

function formatKpiValue(kpi: (typeof analyticsKpis)[number]) {
  if (kpi.valueKind === "toman") return formatToman(kpi.value)
  if (kpi.valueKind === "percent") return formatPercent(kpi.value)
  return formatCount(kpi.value)
}

function showAnalyticsToast(title: string, description: string) {
  toast.custom(
    () => (
      <div className="ax-toast" role="status">
        <span className="ax-toast-mark" aria-hidden />
        <div>
          <p className="ax-toast-title">{title}</p>
          <p className="ax-toast-desc">{description}</p>
        </div>
      </div>
    ),
    { duration: 4200 }
  )
}

export function AnalyticsView() {
  const [range, setRange] = React.useState<AnalyticsRangeId>("30d")
  const [channel, setChannel] = React.useState<ChannelFilterId>("all")
  const [view, setView] = React.useState<ViewId>("overview")

  const rangeMeta =
    analyticsRanges.find((item) => item.id === range) ?? analyticsRanges[1]
  const revenueKpi = analyticsKpis.find((k) => k.id === "revenue")!
  const satelliteKpis = analyticsKpis.filter((k) => k.id !== "revenue")

  return (
    <div>
      <header className="ax-hero">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="ax-kicker">تحلیل عملکرد</p>
            <span className="ax-live">
              <span className="ax-live-dot" aria-hidden />
              زنده
            </span>
          </div>
          <h1 className="ax-title">سیگنال‌های رشد را یک‌جا ببینید</h1>
          <p className="ax-lead">
            روند درآمد، قیف تبدیل و بازده کانال‌ها در بازهٔ انتخابی — آخرین
            به‌روزرسانی {reportUpdatedAt}
          </p>
        </div>

        <div className="ax-controls">
          <div
            className="ax-range"
            role="group"
            aria-label="بازه زمانی"
          >
            {analyticsRanges.map((item) => (
              <button
                key={item.id}
                type="button"
                className="ax-range-btn"
                aria-pressed={range === item.id}
                onClick={() => setRange(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            className="ax-channel-row"
            role="group"
            aria-label="فیلتر کانال"
          >
            {CHANNEL_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="ax-chip"
                aria-pressed={channel === item.id}
                onClick={() => setChannel(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <Button
            className="ax-export"
            variant="outline"
            onClick={() =>
              showAnalyticsToast(
                "خروجی خلاصه آماده شد",
                `بازه ${rangeMeta.label} · فیلتر ${CHANNEL_FILTERS.find((c) => c.id === channel)?.label} — نمونه نمایشی`
              )
            }
          >
            <DownloadIcon data-icon="inline-start" />
            خروجی خلاصه
          </Button>
        </div>
      </header>

      <section className="ax-focal" aria-label="شاخص کانونی">
        <div className="ax-focal-grid">
          <div>
            <p className="ax-focal-label">{revenueKpi.label}</p>
            <p className="ax-focal-value">{formatKpiValue(revenueKpi)}</p>
            <div className="ax-focal-meta">
              <span
                className="ax-delta"
                data-up={revenueKpi.up ? "true" : "false"}
              >
                {revenueKpi.up ? (
                  <ArrowUpRightIcon
                    className="size-3.5 rtl:-scale-x-100"
                    aria-hidden
                  />
                ) : (
                  <ArrowDownRightIcon
                    className="size-3.5 rtl:-scale-x-100"
                    aria-hidden
                  />
                )}
                {formatDelta(revenueKpi.delta, revenueKpi.up)}
              </span>
              <span>
                {rangeMeta.compareLabel} · {revenueKpi.context}
              </span>
            </div>
          </div>

          <div className="ax-meters" aria-label="شاخص‌های همراه">
            {satelliteKpis.map((kpi) => {
              const fill = Math.min(100, Math.max(18, 40 + kpi.delta * 6))
              return (
                <div
                  key={kpi.id}
                  className="ax-meter"
                  data-tone={kpi.up ? "ok" : "warn"}
                >
                  <div className="ax-meter-top">
                    <span className="ax-meter-label">{kpi.label}</span>
                    <span className="ax-meter-value">
                      {formatKpiValue(kpi)}
                    </span>
                  </div>
                  <div className="ax-meter-track" aria-hidden>
                    <div
                      className="ax-meter-fill"
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                  <div className="ax-meter-top">
                    <span className="ax-meter-label">{kpi.context}</span>
                    <span
                      className="ax-delta"
                      data-up={kpi.up ? "true" : "false"}
                    >
                      {formatDelta(kpi.delta, kpi.up)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="ax-rail" role="tablist" aria-label="نماهای تحلیل">
        {(
          [
            { id: "overview", label: "نمای تحلیلی" },
            { id: "channels", label: "کانال‌ها" },
            { id: "campaigns", label: "کمپین‌ها" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className="ax-rail-btn"
            aria-pressed={view === item.id}
            aria-selected={view === item.id}
            onClick={() => setView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {view === "overview" ? <OverviewPane /> : null}
      {view === "channels" ? <ChannelsPane /> : null}
      {view === "campaigns" ? <CampaignsPane /> : null}
    </div>
  )
}

function OverviewPane() {
  const maxFunnel = funnelData[0]?.value ?? 1

  return (
    <div>
      <div className="ax-grid-2">
        <section className="ax-frame">
          <div className="ax-frame-head">
            <div>
              <h2>روند درآمد و سفارش</h2>
              <p>درآمد به میلیون تومان در کنار تعداد سفارش روزانه</p>
            </div>
          </div>
          <div className="ax-frame-body">
            <ChartContainer
              config={trendConfig}
              className="aspect-[5/3] w-full min-h-[220px] sm:aspect-video"
            >
              <AreaChart
                data={revenueTrendData}
                margin={{ top: 8, right: 4, left: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="axRevFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 6" />
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
                  fill="url(#axRevFill)"
                  strokeWidth={2.25}
                />
                <Area
                  yAxisId="orders"
                  dataKey="orders"
                  type="monotone"
                  stroke="var(--color-orders)"
                  fill="transparent"
                  strokeWidth={1.75}
                  strokeDasharray="4 3"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </section>

        <section className="ax-frame">
          <div className="ax-frame-head">
            <div>
              <h2>قیف تبدیل</h2>
              <p>مسیر کاربر از بازدید تا پرداخت موفق</p>
            </div>
          </div>
          <div className="ax-frame-body">
            <div className="ax-funnel">
              {funnelData.map((step, index) => {
                const prev = funnelData[index - 1]
                const rate = prev
                  ? Math.round((step.value / prev.value) * 1000) / 10
                  : 100
                const width = Math.max(8, (step.value / maxFunnel) * 100)
                return (
                  <div key={step.stage} className="ax-funnel-row">
                    <span className="ax-funnel-stage">{step.stage}</span>
                    <div className="ax-funnel-bar-wrap">
                      <div
                        className="ax-funnel-bar"
                        style={{
                          width: `${width}%`,
                          background: step.fill,
                        }}
                      />
                    </div>
                    <span className="ax-funnel-val">
                      {formatPersianNumber(step.value)}
                      {prev ? (
                        <span className="ms-1 text-[0.65rem] font-medium text-[color-mix(in_oklch,var(--foreground)_45%,transparent)]">
                          {formatPersianNumber(rate)}٪
                        </span>
                      ) : null}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="ax-funnel-note">
              بیشترین ریزش بین سبد و پرداخت است — نقطهٔ تمرکز بهینه‌سازی دوره.
            </p>
          </div>
        </section>
      </div>

      <InsightsBlock />
    </div>
  )
}

function ChannelsPane() {
  const maxShare = Math.max(...channelPerformance.map((c) => c.share))

  return (
    <div>
      <div className="ax-grid-channels">
        <section className="ax-frame">
          <div className="ax-frame-head">
            <div>
              <h2>عملکرد کانال‌ها</h2>
              <p>سهم درآمد و نشست بر اساس منبع جذب</p>
            </div>
          </div>
          <div className="ax-frame-body">
            <div className="ax-channel-list">
              {channelPerformance.map((row) => (
                <div key={row.channel} className="ax-channel-item">
                  <div className="ax-channel-top">
                    <span className="ax-channel-name">{row.channel}</span>
                    <span className="ax-channel-stats">
                      {formatPersianNumber(row.share)}٪ ·{" "}
                      {formatPersianNumber(row.revenue)} م
                    </span>
                  </div>
                  <div className="ax-channel-track" aria-hidden>
                    <div
                      className="ax-channel-fill"
                      style={{
                        width: `${(row.share / maxShare) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="ax-channel-top">
                    <span className="ax-channel-stats">
                      {formatPersianNumber(row.sessions)} نشست
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ax-frame">
          <div className="ax-frame-head">
            <div>
              <h2>سهم دستگاه</h2>
              <p>توزیع نشست‌ها بر اساس نوع دستگاه</p>
            </div>
          </div>
          <div className="ax-frame-body">
            <div className="ax-devices">
              {deviceShare.map((item) => (
                <div key={item.name} className="ax-device">
                  <div
                    className="ax-device-ring"
                    style={{ ["--p" as string]: item.value }}
                    aria-hidden
                  >
                    <span>{formatPersianNumber(item.value)}٪</span>
                  </div>
                  <div className="ax-device-meta">
                    <strong>{item.name}</strong>
                    <span>از کل نشست‌های بازه</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="ax-sheet" role="region" aria-label="خلاصه کانال">
        <table>
          <thead>
            <tr>
              <th scope="col">کانال</th>
              <th scope="col">نشست</th>
              <th scope="col">سهم درآمد</th>
              <th scope="col">درآمد</th>
            </tr>
          </thead>
          <tbody>
            {channelPerformance.map((row) => (
              <tr key={row.channel}>
                <td className="font-medium">{row.channel}</td>
                <td>{formatPersianNumber(row.sessions)}</td>
                <td>{formatPersianNumber(row.share)}٪</td>
                <td>{formatPersianNumber(row.revenue)} م</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CampaignsPane() {
  const maxRoas = Math.max(...campaignRows.map((r) => r.roas), 1)

  return (
    <div>
      <section className="ax-frame">
        <div className="ax-frame-head">
          <div>
            <h2>جدول عملکرد کمپین</h2>
            <p>هزینه، درآمد، ROAS و نرخ تبدیل در بازهٔ جاری</p>
          </div>
        </div>
        <div className="ax-frame-body">
          <div className="ax-campaigns">
            {campaignRows.map((row) => (
              <CampaignCard key={row.id} row={row} maxRoas={maxRoas} />
            ))}
          </div>
        </div>
      </section>

      <InsightsBlock />
    </div>
  )
}

function CampaignCard({
  row,
  maxRoas,
}: {
  row: CampaignRow
  maxRoas: number
}) {
  const roasPct = row.roas === 0 ? 0 : Math.max(8, (row.roas / maxRoas) * 100)

  return (
    <article className="ax-campaign">
      <div className="ax-campaign-head">
        <div>
          <h3 className="ax-campaign-name">{row.name}</h3>
          <p className="ax-campaign-channel">{row.channel}</p>
        </div>
        <span className="ax-status" data-status={row.status}>
          {row.status}
        </span>
      </div>

      <dl className="ax-campaign-stats">
        <div className="ax-stat">
          <dt>هزینه</dt>
          <dd>{row.spend === 0 ? "—" : formatToman(row.spend)}</dd>
        </div>
        <div className="ax-stat">
          <dt>درآمد</dt>
          <dd>{row.revenue === 0 ? "—" : formatToman(row.revenue)}</dd>
        </div>
        <div className="ax-stat">
          <dt>ROAS</dt>
          <dd>{row.roas === 0 ? "—" : formatPersianNumber(row.roas)}</dd>
        </div>
        <div className="ax-stat">
          <dt>تبدیل</dt>
          <dd>
            {row.conv === 0 ? "—" : `${formatPersianNumber(row.conv)}٪`}
          </dd>
        </div>
      </dl>

      <div className="ax-roas-track" aria-hidden>
        <div className="ax-roas-fill" style={{ width: `${roasPct}%` }} />
      </div>
    </article>
  )
}

function InsightsBlock() {
  return (
    <section className="ax-insights" aria-label="نکات کلیدی دوره">
      {analyticsInsights.map((item) => (
        <article
          key={item.title}
          className="ax-insight"
          data-tone={item.tone}
        >
          <span className="ax-insight-bar" aria-hidden />
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <span className="ax-insight-tag">
              {item.tone === "positive"
                ? "سیگنال مثبت"
                : item.tone === "warning"
                  ? "نیاز به توجه"
                  : "اطلاع"}
            </span>
          </div>
        </article>
      ))}
    </section>
  )
}
