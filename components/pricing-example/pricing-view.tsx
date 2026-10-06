"use client"

import { CheckIcon, InfoIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { formatToman } from "@/lib/format"
import { formatPersianNumber, toPersianDigits } from "@/lib/digits"
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
  toast.custom(
    () => (
      <div className="pricing-toast" role="status">
        <span className="pricing-toast-mark" aria-hidden />
        <div>
          <p className="pricing-toast-title">{title}</p>
          <p className="pricing-toast-desc">{description}</p>
        </div>
      </div>
    ),
    { duration: 4200 }
  )
}

export function PricingView() {
  const [period, setPeriod] = React.useState<BillingPeriod>("yearly")
  const [selected, setSelected] = React.useState<PlanId>("team")
  const [openFaq, setOpenFaq] = React.useState<number | null>(0)

  function handleCta(plan: PricingPlan) {
    setSelected(plan.id)
    showPricingToast(
      `${plan.cta} · ${plan.name}`,
      "در این دمو پرداخت واقعی انجام نمی‌شود."
    )
  }

  return (
    <div className="pricing-stage">
      <header className="pricing-hero">
        <div className="pricing-hero-copy">
          <p className="pricing-kicker">تعرفه · تومان</p>
          <h1 className="pricing-title">
            پلن مناسب تیم‌تان را
            <span className="pricing-title-mark"> با اطمینان </span>
            انتخاب کنید
          </h1>
          <p className="pricing-lead">
            سه پلهٔ رشد شفاف — از آزمایش شخصی تا سازمان. دوره را عوض کنید و
            ببینید هر پلن دقیقاً چه چیزی می‌دهد.
          </p>
        </div>

        <aside className="pricing-bill" aria-label="دورهٔ صورتحساب">
          <div
            className="pricing-bill-switch"
            data-period={period}
            role="group"
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
              ? "صورتحساب سالانه — حدود ۲۰٪ کمتر از پرداخت ماهانه."
              : "هر زمان می‌توانید به سالانه تغییر دهید."}
          </p>
        </aside>
      </header>

      <section id="plans" className="pricing-plans scroll-mt-24">
        <div className="pricing-gallery" role="list">
          {pricingPlans.map((plan, index) => (
            <PlanCard
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

      <section id="compare" className="pricing-section scroll-mt-24">
        <div className="pricing-section-head">
          <div>
            <p className="pricing-kicker">مقایسه</p>
            <h2>ماتریس امکانات</h2>
            <p>روی نام پلن بزنید تا همان‌جا انتخاب شود.</p>
          </div>
        </div>
        <ComparisonMatrix selected={selected} onSelect={setSelected} />
      </section>

      <section id="faq" className="pricing-section scroll-mt-24">
        <div className="pricing-faq">
          <div className="pricing-faq-intro">
            <p className="pricing-kicker">پشتیبانی</p>
            <h2>پرسش‌های پرتکرار</h2>
            <p>صورتحساب، تغییر پلن و محدودیت‌ها — کوتاه و روشن.</p>
          </div>

          <div className="pricing-faq-list">
            {pricingFaqs.map((item, index) => {
              const open = openFaq === index
              return (
                <div
                  key={item.q}
                  className="pricing-faq-item"
                  data-open={open ? "true" : "false"}
                >
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
        <div className="pricing-close-copy">
          <h2>پلن را انتخاب کنید و جلو بروید</h2>
          <p>
            پیشنهاد ما پلن تیم است — یا از رایگان شروع کنید. همهٔ دکمه‌ها در این
            دمو نمایشی‌اند.
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

function PlanCard({
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
      className="pricing-card"
      data-featured={plan.featured ? "true" : "false"}
      data-selected={selected ? "true" : "false"}
      style={{ ["--card-i" as string]: index }}
    >
      <div className="pricing-card-top">
        <span className="pricing-card-index" aria-hidden>
          {ordinal}
        </span>
        <div className="pricing-card-name-row">
          <h3 className="pricing-card-name">{plan.name}</h3>
          {plan.featured ? (
            <span className="pricing-card-badge">پیشنهادی</span>
          ) : null}
        </div>
        <p className="pricing-card-desc">{plan.description}</p>
      </div>

      <div className="pricing-card-price">
        {isFree ? (
          <span className="pricing-card-amount">رایگان</span>
        ) : (
          <>
            <span className="pricing-card-amount">
              {formatPersianNumber(monthly)}
            </span>
            <span className="pricing-card-unit">تومان / ماه</span>
          </>
        )}
        {!isFree && period === "yearly" && savings > 0 ? (
          <span className="pricing-card-saving">
            سالانه {formatToman(savings)} صرفه‌جویی
          </span>
        ) : null}
        {!isFree && period === "yearly" ? (
          <span className="pricing-card-bill">
            صورتحساب: {formatToman(plan.yearlyPrice)}
          </span>
        ) : null}
      </div>

      <ul className="pricing-card-features">
        {plan.features.map((f) => (
          <li key={f}>
            <CheckIcon className="pricing-card-check" aria-hidden />
            <span>{f}</span>
          </li>
        ))}
        {plan.limits.map((l) => (
          <li key={l} className="is-limit">
            <XIcon className="pricing-card-x" aria-hidden />
            <span>{l}</span>
          </li>
        ))}
      </ul>

      <div className="pricing-card-actions">
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
    return <CheckIcon className="pricing-ok size-4" aria-label="دارد" />
  }
  if (value === false) {
    return <XIcon className="pricing-no size-3.5" aria-label="ندارد" />
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
                  data-featured={plan.featured ? "true" : "false"}
                >
                  <button
                    type="button"
                    className="pricing-matrix-plan"
                    onClick={() => onSelect(plan.id)}
                  >
                    {plan.name}
                    {plan.featured ? (
                      <span className="pricing-matrix-dot" aria-hidden />
                    ) : null}
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
                    <th scope="row">
                      <span className="pricing-matrix-feat">
                        {feature.name}
                        {feature.hint ? (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <button
                                  type="button"
                                  className="pricing-matrix-hint"
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
