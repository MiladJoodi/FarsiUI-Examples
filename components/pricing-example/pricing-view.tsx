"use client"

import { CheckIcon, InfoIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { formatToman } from "@/lib/format"
import { formatPersianNumber } from "@/lib/digits"
import { toPersianDigits } from "@/lib/digits"
import {
  comparisonGroups,
  effectiveMonthly,
  pricingFaqs,
  pricingPlans,
  yearlySavings,
  type BillingPeriod,
  type FeatureValue,
  type PlanId,
  type PricingPlan,
} from "@/lib/mock/pricing"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

function showPricingToast(title: string, description: string) {
  toast.custom(() => (
    <div className="pricing-toast" role="status">
      <span className="pricing-toast-mark" aria-hidden />
      <div>
        <p className="pricing-toast-title">{title}</p>
        <p className="pricing-toast-desc">{description}</p>
      </div>
    </div>
  ), { duration: 4200 })
}

export function PricingView() {
  const [period, setPeriod] = React.useState<BillingPeriod>("yearly")
  const [selected, setSelected] = React.useState<PlanId>("team")
  const [openFaq, setOpenFaq] = React.useState<number | null>(0)

  function handleCta(plan: PricingPlan) {
    setSelected(plan.id)
    showPricingToast(
      `${plan.cta} · ${plan.name}`,
      "در این نمونه پرداخت واقعی انجام نمی‌شود."
    )
  }

  return (
    <div>
      <header className="pricing-hero">
        <div>
          <p className="pricing-kicker">قیمت‌گذاری · تومان</p>
          <h1 className="pricing-title">
            تعرفهٔ شفاف برای <em>تیم‌هایی که می‌سازند</em>
          </h1>
          <p className="pricing-lead">
            سه پلهٔ رشد — از آزمایش شخصی تا سازمان. ماهانه یا سالانه را جابه‌جا
            کنید و ببینید هر پلن دقیقاً چه چیزی می‌دهد.
          </p>

          <div className="pricing-ladder" aria-hidden={false}>
            <p className="pricing-ladder-label">نردبان تعرفه</p>
            <div
              className="pricing-ladder-track"
              role="group"
              aria-label="انتخاب سریع پلن"
            >
              {pricingPlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  className="pricing-ladder-step"
                  data-active={selected === plan.id ? "true" : "false"}
                  aria-label={plan.name}
                  aria-pressed={selected === plan.id}
                  onClick={() => {
                    setSelected(plan.id)
                    document
                      .getElementById("plans")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                />
              ))}
            </div>
            <div className="pricing-ladder-cap">
              {pricingPlans.map((plan) => (
                <span key={plan.id}>{plan.name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="pricing-bill">
          <div
            className="pricing-bill-switch"
            data-period={period}
            role="group"
            aria-label="دورهٔ صورتحساب"
          >
            <span className="pricing-bill-thumb" aria-hidden />
            <button
              type="button"
              className="pricing-bill-btn"
              aria-pressed={period === "monthly"}
              onClick={() => setPeriod("monthly")}
            >
              ماهانه
            </button>
            <button
              type="button"
              className="pricing-bill-btn"
              aria-pressed={period === "yearly"}
              onClick={() => setPeriod("yearly")}
            >
              سالانه
              <span className="pricing-save-pill">٪۲۰</span>
            </button>
          </div>
          <p className="pricing-bill-note">
            {period === "yearly"
              ? "صورتحساب یک‌جا برای دوازده ماه؛ حدود ۲۰٪ کمتر."
              : "هر زمان می‌توانید به سالانه تغییر دهید."}
          </p>
        </div>
      </header>

      <section id="plans" className="scroll-mt-20">
        <div className="pricing-rail" role="list">
          {pricingPlans.map((plan, index) => (
            <PlanBand
              key={plan.id}
              plan={plan}
              index={index}
              period={period}
              selected={selected === plan.id}
              onSelect={() => handleCta(plan)}
            />
          ))}
        </div>
      </section>

      <section id="compare" className="pricing-section scroll-mt-20">
        <div className="pricing-section-head">
          <div>
            <h2>ماتریس امکانات</h2>
            <p>روی ستون پلن بزنید تا همان‌جا انتخاب شود.</p>
          </div>
        </div>
        <ComparisonMatrix selected={selected} onSelect={setSelected} />
      </section>

      <section id="faq" className="pricing-section scroll-mt-20">
        <div className="pricing-faq">
          <div>
            <p className="pricing-kicker">پشتیبانی</p>
            <h2 className="mt-2 text-[1.15rem] font-bold tracking-tight">
              پرسش‌های پرتکرار
            </h2>
            <p className="mt-2 max-w-xs text-[0.8rem] leading-relaxed text-[color-mix(in_oklch,var(--foreground)_55%,transparent)]">
              صورتحساب، تغییر پلن و محدودیت‌ها — کوتاه و روشن.
            </p>
          </div>

          <div className="pricing-faq-list">
            {pricingFaqs.map((item, index) => {
              const open = openFaq === index
              return (
                <div key={item.q} className="pricing-faq-item">
                  <button
                    type="button"
                    className="pricing-faq-trigger"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span className="pricing-faq-num">
                      {toPersianDigits(String(index + 1).padStart(2, "0"))}
                    </span>
                    <span className="pricing-faq-q">{item.q}</span>
                    {open ? (
                      <MinusIcon className="size-3.5 opacity-50" />
                    ) : (
                      <PlusIcon className="size-3.5 opacity-50" />
                    )}
                  </button>
                  {open ? (
                    <div className="pricing-faq-body">{item.a}</div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="pricing-close">
        <div>
          <h2>پلن را انتخاب کنید و جلو بروید</h2>
          <p>
            پیشنهاد ما پلن تیم است — یا از رایگان شروع کنید. همهٔ دکمه‌ها در این
            نمونه نمایشی‌اند.
          </p>
        </div>
        <div className="pricing-close-actions">
          <Button
            className="pricing-btn pricing-btn-primary"
            onClick={() => {
              const team = pricingPlans.find((p) => p.id === "team")!
              handleCta(team)
              document
                .getElementById("plans")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
          >
            انتخاب پلن تیم
          </Button>
          <Button
            className="pricing-btn pricing-btn-soft"
            variant="outline"
            onClick={() => {
              const start = pricingPlans.find((p) => p.id === "start")!
              handleCta(start)
              document
                .getElementById("plans")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
          >
            شروع رایگان
          </Button>
        </div>
      </section>

      <footer className="pricing-footer">
        <p>همه قیمت‌ها نمایشی و به تومان است. پرداخت واقعی وجود ندارد.</p>
        <nav aria-label="پاورقی" className="flex flex-wrap gap-x-4 gap-y-2">
          <a href="#plans">پلن‌ها</a>
          <a href="#compare">مقایسه</a>
          <a href="#faq">پرسش‌ها</a>
        </nav>
      </footer>
    </div>
  )
}

function PlanBand({
  plan,
  index,
  period,
  selected,
  onSelect,
}: {
  plan: PricingPlan
  index: number
  period: BillingPeriod
  selected: boolean
  onSelect: () => void
}) {
  const monthly = effectiveMonthly(plan, period)
  const savings = yearlySavings(plan)
  const isFree = plan.monthlyPrice === 0
  const ordinal = toPersianDigits(String(index + 1).padStart(2, "0"))

  return (
    <article
      role="listitem"
      className="pricing-band"
      data-featured={plan.featured ? "true" : "false"}
      data-selected={selected ? "true" : "false"}
      data-index={ordinal}
      style={{ ["--band-i" as string]: index }}
    >
      <div className="pricing-band-meta">
        <div className="pricing-band-name">
          {plan.name}
          {plan.featured ? (
            <span className="pricing-band-badge">پیشنهادی</span>
          ) : null}
        </div>
        <p className="pricing-band-desc">{plan.description}</p>
      </div>

      <div className="min-w-0 space-y-3">
        <div className="pricing-band-price">
          {isFree ? (
            <span className="pricing-band-amount">رایگان</span>
          ) : (
            <>
              <span className="pricing-band-amount">
                {formatPersianNumber(monthly)}
              </span>
              <span className="pricing-band-unit">تومان / ماه</span>
            </>
          )}
          {!isFree && period === "yearly" && savings > 0 ? (
            <span className="pricing-band-saving">
              سالانه {formatToman(savings)} صرفه‌جویی نسبت به ماهانه
            </span>
          ) : null}
          {!isFree && period === "yearly" ? (
            <span className="pricing-band-unit w-full">
              صورتحساب سالانه: {formatToman(plan.yearlyPrice)}
            </span>
          ) : null}
        </div>

        <ul className="pricing-chips">
          {plan.features.map((f) => (
            <li key={f} className="pricing-chip">
              {f}
            </li>
          ))}
          {plan.limits.map((l) => (
            <li key={l} className="pricing-chip pricing-chip-mute">
              {l}
            </li>
          ))}
        </ul>
      </div>

      <div className="pricing-band-actions">
        <Button
          className={cn(
            "pricing-btn w-full",
            plan.featured || selected
              ? "pricing-btn-primary"
              : "pricing-btn-soft"
          )}
          variant={plan.featured || selected ? "default" : "outline"}
          onClick={onSelect}
        >
          {plan.cta}
        </Button>
      </div>
    </article>
  )
}

function renderValue(value: FeatureValue) {
  if (value === true) {
    return (
      <CheckIcon className="pricing-ok size-4" aria-label="دارد" />
    )
  }
  if (value === false) {
    return (
      <XIcon className="pricing-no size-3.5" aria-label="ندارد" />
    )
  }
  return <span>{value}</span>
}

function ComparisonMatrix({
  selected,
  onSelect,
}: {
  selected: PlanId
  onSelect: (id: PlanId) => void
}) {
  return (
    <div className="pricing-matrix">
      <div className="pricing-matrix-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">امکان</th>
              {pricingPlans.map((plan) => (
                <th
                  key={plan.id}
                  scope="col"
                  data-active={selected === plan.id ? "true" : "false"}
                >
                  <button
                    type="button"
                    className="font-semibold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => onSelect(plan.id)}
                  >
                    {plan.name}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonGroups.map((group) => (
              <React.Fragment key={group.id}>
                <tr className="group-row">
                  <td colSpan={4}>{group.title}</td>
                </tr>
                {group.features.map((feature) => (
                  <tr key={feature.id}>
                    <th scope="row" className="font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        {feature.name}
                        {feature.hint ? (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <button
                                  type="button"
                                  className="inline-flex text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  aria-label={`راهنما: ${feature.name}`}
                                >
                                  <InfoIcon className="size-3.5" />
                                </button>
                              }
                            />
                            <TooltipContent className="max-w-xs">
                              {feature.hint}
                            </TooltipContent>
                          </Tooltip>
                        ) : null}
                      </span>
                    </th>
                    {pricingPlans.map((plan) => (
                      <td
                        key={plan.id}
                        data-active={selected === plan.id ? "true" : "false"}
                      >
                        {renderValue(feature.values[plan.id])}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
