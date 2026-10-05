"use client"

import { CheckIcon, InfoIcon, MinusIcon, XIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { formatToman } from "@/lib/format"
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
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function PricingView() {
  const [period, setPeriod] = React.useState<BillingPeriod>("monthly")
  const [selected, setSelected] = React.useState<PlanId>("team")

  function handleCta(plan: PricingPlan) {
    setSelected(plan.id)
    toast.success(`${plan.cta} — ${plan.name}`, {
      description: "در این نمونه پرداخت واقعی انجام نمی‌شود.",
    })
  }

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero */}
      <header className="mx-auto max-w-2xl space-y-4 text-center">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          پلنی که با اندازهٔ تیم‌تان جور است
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          قیمت شفاف به تومان. بین ماهانه و سالانه جابه‌جا شوید، پلن‌ها را مقایسه
          کنید و بدون پیچیدگی اضافه تصمیم بگیرید.
        </p>

        <div className="flex flex-col items-center gap-2 pt-2">
          <Tabs
            value={period}
            onValueChange={(v) => {
              if (v === "monthly" || v === "yearly") setPeriod(v)
            }}
          >
            <TabsList aria-label="دورهٔ صورتحساب">
              <TabsTrigger value="monthly">ماهانه</TabsTrigger>
              <TabsTrigger value="yearly">سالانه</TabsTrigger>
            </TabsList>
          </Tabs>
          {period === "yearly" ? (
            <p className="text-xs text-muted-foreground">
              با پرداخت سالانه حدود ۲۰٪ کمتر از مجموع ماهانه می‌پردازید.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              می‌توانید هر زمان به سالانه تغییر دهید.
            </p>
          )}
        </div>
      </header>

      {/* Plans */}
      <section id="plans" className="scroll-mt-20 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            پلن‌ها
          </h2>
          <p className="text-sm text-muted-foreground">
            هر پلن برای مرحلهٔ متفاوتی از رشد تیم طراحی شده است.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
          {pricingPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              period={period}
              selected={selected === plan.id}
              onSelect={() => handleCta(plan)}
            />
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="scroll-mt-20 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            مقایسهٔ امکانات
          </h2>
          <p className="text-sm text-muted-foreground">
            ببینید هر پلن چه چیزی را پوشش می‌دهد و کجا محدودیت دارد.
          </p>
        </div>

        {/* Desktop / tablet table */}
        <div className="hidden md:block">
          <ComparisonTable selected={selected} onSelect={setSelected} />
        </div>

        {/* Mobile accordion pattern */}
        <div className="md:hidden">
          <MobileComparison selected={selected} onSelect={setSelected} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 space-y-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              پرسش‌های پرتکرار
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              دربارهٔ صورتحساب، تغییر پلن و محدودیت‌ها.
            </p>
          </div>
          <Accordion>
            {pricingFaqs.map((item, index) => (
              <AccordionItem key={item.q} value={`faq-${index}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="space-y-5 border-t pt-12 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          آمادهٔ انتخاب پلن هستید؟
        </h2>
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground">
          پلن پیشنهادی را انتخاب کنید یا از رایگان شروع کنید. همهٔ دکمه‌ها در
          این نمونه فقط نمایشی‌اند.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="lg"
            onClick={() => {
              const team = pricingPlans.find((p) => p.id === "team")!
              handleCta(team)
              document.getElementById("plans")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }}
          >
            انتخاب پلن تیم
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const start = pricingPlans.find((p) => p.id === "start")!
              handleCta(start)
              document.getElementById("plans")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }}
          >
            شروع رایگان
          </Button>
        </div>
      </section>
    </div>
  )
}

function PlanCard({
  plan,
  period,
  selected,
  onSelect,
}: {
  plan: PricingPlan
  period: BillingPeriod
  selected: boolean
  onSelect: () => void
}) {
  const monthly = effectiveMonthly(plan, period)
  const savings = yearlySavings(plan)
  const isFree = plan.monthlyPrice === 0

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border p-5 transition-colors",
        plan.featured && "border-foreground/30 bg-muted/25 shadow-sm",
        selected && !plan.featured && "border-foreground/20",
        selected && plan.featured && "ring-2 ring-ring/40"
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-base font-semibold tracking-tight">{plan.name}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {plan.description}
          </p>
        </div>
        {plan.featured ? <Badge>پیشنهادی</Badge> : null}
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-semibold tabular-nums tracking-tight">
          {isFree ? "رایگان" : formatToman(monthly)}
        </p>
        <p className="text-xs text-muted-foreground">
          {isFree
            ? "بدون کارت بانکی"
            : period === "monthly"
              ? "در ماه · صورتحساب ماهانه"
              : "معادل ماهانه · صورتحساب سالانه"}
        </p>
        {!isFree && period === "yearly" ? (
          <p className="text-xs text-muted-foreground">
            مجموع سال: {formatToman(plan.yearlyPrice)}
            {savings > 0 ? (
              <> · صرفه‌جویی {formatToman(savings)}</>
            ) : null}
          </p>
        ) : null}
      </div>

      <Separator className="my-4" />

      <ul className="mb-3 flex-1 space-y-2">
        {plan.features.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <CheckIcon
              className="mt-0.5 size-4 shrink-0 text-foreground"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {plan.limits.length > 0 ? (
        <ul className="mb-4 space-y-1.5">
          {plan.limits.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <MinusIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mb-4" />
      )}

      <Button
        className="w-full"
        variant={plan.featured ? "default" : "outline"}
        aria-pressed={selected}
        onClick={onSelect}
      >
        {plan.cta}
      </Button>
    </article>
  )
}

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1 text-foreground">
        <CheckIcon className="size-4" aria-hidden />
        <span className="sr-only">دارد</span>
      </span>
    )
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <XIcon className="size-4" aria-hidden />
        <span className="sr-only">ندارد</span>
      </span>
    )
  }
  return <span className="text-sm">{value}</span>
}

function FeatureLabel({
  name,
  hint,
}: {
  name: string
  hint?: string
}) {
  if (!hint) return <span>{name}</span>
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{name}</span>
      <Tooltip>
        <TooltipTrigger
          type="button"
          className="inline-flex rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`توضیح ${name}`}
        >
          <InfoIcon className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">{hint}</TooltipContent>
      </Tooltip>
    </span>
  )
}

function ComparisonTable({
  selected,
  onSelect,
}: {
  selected: PlanId
  onSelect: (id: PlanId) => void
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[12rem] min-w-[10rem]">امکانات</TableHead>
            {pricingPlans.map((plan) => (
              <TableHead key={plan.id} className="min-w-[7.5rem]">
                <button
                  type="button"
                  onClick={() => onSelect(plan.id)}
                  className={cn(
                    "rounded-md px-1 py-0.5 text-start outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected === plan.id && "bg-muted"
                  )}
                >
                  <span className="font-semibold">{plan.name}</span>
                  {plan.featured ? (
                    <Badge variant="secondary" className="ms-1.5 font-normal">
                      پیشنهادی
                    </Badge>
                  ) : null}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisonGroups.map((group) => (
            <React.Fragment key={group.id}>
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="bg-muted/40 py-2 text-xs font-medium text-muted-foreground"
                >
                  {group.title}
                </TableCell>
              </TableRow>
              {group.features.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell className="whitespace-normal text-muted-foreground">
                    <FeatureLabel name={feature.name} hint={feature.hint} />
                  </TableCell>
                  {pricingPlans.map((plan) => (
                    <TableCell key={plan.id}>
                      <FeatureCell value={feature.values[plan.id]} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function MobileComparison({
  selected,
  onSelect,
}: {
  selected: PlanId
  onSelect: (id: PlanId) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="انتخاب پلن برای مقایسه">
        {pricingPlans.map((plan) => (
          <Button
            key={plan.id}
            size="sm"
            variant={selected === plan.id ? "default" : "outline"}
            onClick={() => onSelect(plan.id)}
            aria-pressed={selected === plan.id}
          >
            {plan.name}
          </Button>
        ))}
      </div>

      <Accordion>
        {comparisonGroups.map((group) => (
          <AccordionItem key={group.id} value={group.id}>
            <AccordionTrigger>{group.title}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                {group.features.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="min-w-0 text-sm text-muted-foreground">
                      <FeatureLabel name={feature.name} hint={feature.hint} />
                    </span>
                    <span className="shrink-0 text-end">
                      <FeatureCell value={feature.values[selected]} />
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                در حال مشاهدهٔ پلن «
                {pricingPlans.find((p) => p.id === selected)?.name}»
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
