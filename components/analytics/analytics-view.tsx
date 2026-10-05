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
  cityPerformance,
  deviceShare,
  funnelData,
  hourlyTraffic,
  periodGoals,
  reportUpdatedAt,
  revenueTrendData,
  secondaryKpis,
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
  if (kpi.valueKind === "toman") return formatCompactNumber(kpi.value)
  if (kpi.valueKind === "percent") return formatPercent(kpi.value)
  return formatCompactNumber(kpi.value)
}

/** Persian digits with locale grouping — keep ٬ (not ASCII ,) to avoid bidi gaps */
function formatCompactNumber(value: number) {
  return formatPersianNumber(value)
}

function KpiAmount({
  kpi,
  className,
}: {
  kpi: (typeof analyticsKpis)[number]
  className?: string
}) {
  return (
    <span className={className}>
      <span className="ax-num">{formatKpiValue(kpi)}</span>
      {kpi.valueKind === "toman" ? (
        <span className="ax-unit"> تومان</span>
      ) : null}
    </span>
  )
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
  const channelLabel =
    CHANNEL_FILTERS.find((c) => c.id === channel)?.label ?? "همه"
  const revenueKpi = analyticsKpis[0]!
  const companionKpis = analyticsKpis.slice(1)

  return (
    <div className="ax-root">
      <section className="ax-spotlight" aria-label="شاخص اصلی">
        <div className="ax-spotlight-top">
          <span className="ax-live">
            <span className="ax-live-dot" aria-hidden />
            زنده
          </span>
          <p className="ax-spotlight-updated">{reportUpdatedAt}</p>
        </div>

        <p className="ax-spotlight-label">{revenueKpi.label}</p>
        <p className="ax-spotlight-value">
          <KpiAmount kpi={revenueKpi} />
        </p>
        <p className="ax-spotlight-trend">
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
          <span className="ax-spotlight-compare">
            {rangeMeta.compareLabel}
          </span>
          <span className="ax-spotlight-dot ax-hide-mobile" aria-hidden />
          <span className="ax-spotlight-hint ax-hide-mobile">
            {revenueKpi.context}
          </span>
        </p>

        <ul className="ax-companions" aria-label="شاخص‌های همراه">
          {companionKpis.map((kpi) => {
            const shortLabel =
              kpi.id === "orders"
                ? "سفارش"
                : kpi.id === "conversion"
                  ? "تبدیل"
                  : kpi.id === "aov"
                    ? "سبد"
                    : kpi.label
            return (
              <li key={kpi.id} className="ax-companion">
                <span className="ax-companion-label">
                  <span className="ax-companion-label-full">{kpi.label}</span>
                  <span className="ax-companion-label-short">{shortLabel}</span>
                </span>
                <div className="ax-companion-row">
                  <span className="ax-companion-value">
                    <KpiAmount kpi={kpi} />
                  </span>
                  <span
                    className="ax-delta ax-delta-plain"
                    data-up={kpi.up ? "true" : "false"}
                  >
                    {formatDelta(kpi.delta, kpi.up)}
                  </span>
                </div>
                <span className="ax-companion-hint ax-hide-mobile">
                  {kpi.context}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="ax-dock" aria-label="فیلترهای گزارش">
        <div className="ax-dock-scroll">
          <div className="ax-range" role="group" aria-label="بازه زمانی">
            {analyticsRanges.map((item) => (
              <button
                key={item.id}
                type="button"
                className="ax-range-btn"
                aria-pressed={range === item.id}
                onClick={() => setRange(item.id)}
              >
                <span className="ax-range-full">{item.label}</span>
                <span className="ax-range-short">
                  {item.id === "7d"
                    ? "۷ روز"
                    : item.id === "30d"
                      ? "۳۰ روز"
                      : item.id === "90d"
                        ? "۹۰ روز"
                        : "۱۴۰۴"}
                </span>
              </button>
            ))}
          </div>
          <span className="ax-dock-sep" aria-hidden />
          <div className="ax-channel-row" role="group" aria-label="فیلتر کانال">
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
        </div>
        <Button
          className="ax-export"
          variant="outline"
          onClick={() =>
            showAnalyticsToast(
              "خروجی آماده شد",
              `${rangeMeta.label} · ${channelLabel}`
            )
          }
        >
          <DownloadIcon data-icon="inline-start" />
          <span className="ax-export-label">خروجی</span>
        </Button>
      </div>

      <div className="ax-rail" role="tablist" aria-label="نماهای تحلیل">
        {(
          [
            { id: "overview", label: "تحلیل" },
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
  const maxHour = Math.max(...hourlyTraffic.map((h) => h.value))
  const topCampaigns = campaignRows.filter((c) => c.status === "فعال").slice(0, 4)

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

      <section className="ax-extra" aria-label="شاخص‌های تکمیلی">
        {secondaryKpis.map((kpi) => (
          <article key={kpi.id} className="ax-extra-item">
            <p className="ax-extra-label">{kpi.label}</p>
            <p className="ax-extra-value">
              <KpiAmount kpi={kpi} />
            </p>
            <div className="ax-extra-foot">
              <span
                className="ax-delta ax-delta-plain"
                data-up={kpi.up ? "true" : "false"}
              >
                {formatDelta(kpi.delta, kpi.up)}
              </span>
              <span className="ax-extra-hint">{kpi.context}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="ax-frame ax-goals-frame" aria-label="اهداف دوره">
        <div className="ax-frame-head">
          <div>
            <h2>اهداف دوره</h2>
            <p>پیشرفت نسبت به هدف تعریف‌شده برای مهر</p>
          </div>
        </div>
        <div className="ax-frame-body">
          <div className="ax-goals">
            {periodGoals.map((goal) => {
              const pct = Math.min(
                100,
                Math.round((goal.current / goal.target) * 1000) / 10
              )
              return (
                <div key={goal.id} className="ax-goal">
                  <div className="ax-goal-top">
                    <span className="ax-goal-label">{goal.label}</span>
                    <span className="ax-goal-pct">
                      {formatPersianNumber(pct)}٪
                    </span>
                  </div>
                  <div className="ax-goal-track" aria-hidden>
                    <div
                      className="ax-goal-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="ax-goal-meta">
                    {formatPersianNumber(goal.current)} از{" "}
                    {formatPersianNumber(goal.target)} {goal.unit}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="ax-grid-3">
        <section className="ax-frame">
          <div className="ax-frame-head">
            <div>
              <h2>کانال‌های برتر</h2>
              <p>سهم درآمد در بازهٔ جاری</p>
            </div>
          </div>
          <div className="ax-frame-body">
            <ul className="ax-mini-list">
              {channelPerformance.slice(0, 4).map((row) => (
                <li key={row.channel} className="ax-mini-row">
                  <span className="ax-mini-name">{row.channel}</span>
                  <span className="ax-mini-val">
                    {formatPersianNumber(row.share)}٪
                  </span>
                  <span className="ax-mini-sub">
                    {formatPersianNumber(row.revenue)} م
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ax-frame">
          <div className="ax-frame-head">
            <div>
              <h2>شهرهای پرتراکنش</h2>
              <p>تمرکز جغرافیایی سفارش موفق</p>
            </div>
          </div>
          <div className="ax-frame-body">
            <ul className="ax-mini-list">
              {cityPerformance.map((row) => (
                <li key={row.city} className="ax-mini-row">
                  <span className="ax-mini-name">{row.city}</span>
                  <span className="ax-mini-val">
                    {formatPersianNumber(row.share)}٪
                  </span>
                  <span className="ax-mini-sub">
                    {formatPersianNumber(row.orders)} سفارش
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ax-frame">
          <div className="ax-frame-head">
            <div>
              <h2>ساعات اوج</h2>
              <p>شدت نشست در ساعات منتخب امروز</p>
            </div>
          </div>
          <div className="ax-frame-body">
            <div className="ax-hours" role="img" aria-label="نمودار ساعات اوج">
              {hourlyTraffic.map((slot) => (
                <div key={slot.hour} className="ax-hour">
                  <div className="ax-hour-bar-wrap" aria-hidden>
                    <div
                      className="ax-hour-bar"
                      style={{ height: `${(slot.value / maxHour) * 100}%` }}
                    />
                  </div>
                  <span className="ax-hour-label">{slot.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="ax-frame">
        <div className="ax-frame-head">
          <div>
            <h2>کمپین‌های فعال</h2>
            <p>نگاهی سریع به بازده کمپین‌های در حال اجرا</p>
          </div>
        </div>
        <div className="ax-frame-body ax-frame-body-flush">
          <div className="ax-sheet ax-sheet-flush" role="region" aria-label="کمپین‌های فعال">
            <table>
              <thead>
                <tr>
                  <th scope="col">کمپین</th>
                  <th scope="col">کانال</th>
                  <th scope="col">ROAS</th>
                  <th scope="col">تبدیل</th>
                  <th scope="col">درآمد</th>
                </tr>
              </thead>
              <tbody>
                {topCampaigns.map((row) => (
                  <tr key={row.id}>
                    <td className="font-medium">{row.name}</td>
                    <td>{row.channel}</td>
                    <td>
                      {row.roas === 0 ? "—" : formatPersianNumber(row.roas)}
                    </td>
                    <td>
                      {row.conv === 0
                        ? "—"
                        : `${formatPersianNumber(row.conv)}٪`}
                    </td>
                    <td>
                      {row.revenue === 0 ? "—" : formatToman(row.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

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
