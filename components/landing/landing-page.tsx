"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeftIcon, CheckIcon, MenuIcon } from "lucide-react"

import { formatCount, formatToman } from "@/lib/format"
import { toPersianDigits } from "@/lib/digits"
import { DesignSystemPicker } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import "@/styles/landing.css"

const brand = "سپهر"
const numericClass =
  "tracking-normal [font-variant-numeric:normal] [font-feature-settings:normal]"

const navLinks = [
  { href: "#features", label: "امکانات" },
  { href: "#workflow", label: "گردش کار" },
  { href: "#pricing", label: "قیمت‌ها" },
  { href: "#faq", label: "پرسش‌ها" },
] as const

const features = [
  {
    title: "کارها در یک صفحه",
    description:
      "وضعیت، مسئول و موعد کنار هم می‌مانند؛ دیگر بین چند ابزار پراکنده جابه‌جا نمی‌شوید.",
  },
  {
    title: "اسناد کنار پروژه",
    description:
      "مشخصات، تصمیم‌ها و یادداشت‌ها در همان فضای کاری می‌مانند و گم نمی‌شوند.",
  },
  {
    title: "انتشار با چک‌لیست",
    description:
      "قبل از عرضه، RTL، دسترس‌پذیری و حالت خالی را با یک چک‌لیست مشترک مرور کنید.",
  },
  {
    title: "بحث روی همان مورد",
    description:
      "نظرها به کار یا سند وصل می‌شوند؛ رشته‌های طولانی در پیام‌رسان لازم نیست.",
  },
  {
    title: "نقش‌های واضح",
    description:
      "دسترسی مشاهده، ویرایش و مدیریت را برای هر فضای کاری جداگانه تنظیم کنید.",
  },
  {
    title: "آماده تیم‌های فارسی",
    description:
      "رابط RTL، اعداد فارسی و تاریخ شمسی از روز اول در تجربه لحاظ شده‌اند.",
  },
] as const

const steps = [
  {
    title: "فضای کاری بسازید",
    description: "تیم، نقش‌ها و پروژهٔ اول را در چند دقیقه تعریف کنید.",
  },
  {
    title: "کار و سند را وصل کنید",
    description: "هر تسک به مشخصات و تصمیم مرتبط لینک می‌شود.",
  },
  {
    title: "با چک‌لیست منتشر کنید",
    description: "قبل از عرضه، موارد ضروری را با هم تأیید کنید.",
  },
] as const

const logos = ["آوند", "پارس‌لاین", "کاوان", "نوانور", "سپید", "زرین"] as const

const testimonials = [
  {
    quote:
      "دیگر بین تسک‌ترکر و داکیومنت جابه‌جا نمی‌شویم. ریویو انتشار نصف زمان قبل طول می‌کشد.",
    name: "مینا اکبری",
    role: "مدیر محصول · پارس‌لاین",
    initials: "م‌ا",
  },
  {
    quote:
      "چک‌لیست RTL و دسترس‌پذیری را داخل همان گردش کار گذاشتیم؛ کیفیت PRها یکدست‌تر شد.",
    name: "رضا کریمی",
    role: "لید فرانت · کاوان",
    initials: "ر‌ک",
  },
  {
    quote:
      "تیم پشتیبانی و محصول بالاخره روی یک منبع حقیقت کار می‌کنند؛ پیگیری درخواست‌ها روشن‌تر است.",
    name: "سارا محمدی",
    role: "عملیات محصول · نوانور",
    initials: "س‌م",
  },
] as const

const plans = [
  {
    id: "start",
    name: "شروع",
    price: 0,
    hint: "برای تیم‌های کوچک و آزمایش",
    features: ["تا ۵ نفر", "۲ فضای کاری", "اسناد پایه", "پشتیبانی ایمیلی"],
    cta: "شروع رایگان",
    featured: false,
  },
  {
    id: "team",
    name: "تیم",
    price: 890_000,
    hint: "برای تیم‌های محصول فعال",
    features: [
      "تا ۲۵ نفر",
      "فضای کاری نامحدود",
      "چک‌لیست انتشار",
      "یکپارچگی اعلان",
      "پشتیبانی اولویت‌دار",
    ],
    cta: "آزمایش ۱۴ روزه",
    featured: true,
  },
  {
    id: "org",
    name: "سازمان",
    price: 2_490_000,
    hint: "برای چند تیم و کنترل بیشتر",
    features: [
      "اعضای نامحدود",
      "نقش‌های سفارشی",
      "گزارش فعالیت",
      "SSO نمایشی",
      "مدیر حساب اختصاصی",
    ],
    cta: "گفتگو با فروش",
    featured: false,
  },
] as const

const faqs = [
  {
    q: "سپهر برای چه تیم‌هایی مناسب است؟",
    a: "برای تیم‌های محصول، طراحی و مهندسی که روی محصولات فارسی کار می‌کنند و می‌خواهند کار، سند و انتشار را در یک فضای RTL نگه دارند.",
  },
  {
    q: "آیا می‌توانیم داده‌ها را بعداً خارج کنیم؟",
    a: "در این دمو، خروجی واقعی پیاده‌سازی نشده است. در محصول نهایی، خروجی اسناد و فهرست کارها به‌صورت فایل در دسترس خواهد بود.",
  },
  {
    q: "آزمایش پلن تیم چطور کار می‌کند؟",
    a: "۱۴ روز بدون نیاز به کارت بانکی نمایشی است. بعد از پایان دوره می‌توانید به پلن رایگان برگردید یا ارتقا دهید.",
  },
  {
    q: "آیا تاریخ شمسی و اعداد فارسی پشتیبانی می‌شود؟",
    a: "بله. موعدها، گزارش‌ها و برچسب‌های زمانی برای رابط فارسی و RTL طراحی شده‌اند.",
  },
] as const

export function LandingPage() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [sheetHost, setSheetHost] = React.useState<HTMLDivElement | null>(null)

  function scrollTo(href: string) {
    setMenuOpen(false)
    const id = href.replace("#", "")
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div
      ref={setSheetHost}
      className="landing-page min-h-dvh overflow-x-hidden bg-background text-foreground"
    >
      <header className="landing-elev-nav sticky top-0 z-30 border-b border-foreground/8 bg-[color-mix(in_oklch,var(--background)_68%,transparent)] backdrop-blur-xl">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <a
              href="#top"
              className="truncate text-lg font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {brand}
            </a>
            <nav
              aria-label="ناوبری اصلی"
              className="hidden items-center gap-5 xl:flex"
            >
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="pointer-events-none absolute inset-x-0 flex justify-center px-2">
            <div className="pointer-events-auto max-w-[min(100%,16rem)] sm:max-w-none">
              <DesignSystemPicker />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-1.5">
            <a
              href="https://farsiui.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-credit hidden sm:inline-flex"
              title="ساخته‌شده با FarsiUI"
            >
              <span className="landing-credit-prefix">ساخته‌شده با</span>
              <strong>FarsiUI</strong>
            </a>
            <Button
              size="sm"
              className="landing-btn landing-btn-primary hidden sm:inline-flex"
              onClick={() => scrollTo("#pricing")}
            >
              شروع رایگان
            </Button>
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              className="xl:hidden"
              aria-label="باز کردن منو"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          container={sheetHost}
          className="flex w-[min(19rem,100%)] flex-col gap-0 p-0"
        >
          <SheetHeader className="border-b">
            <SheetTitle>{brand}</SheetTitle>
            <SheetDescription>ناوبری صفحه</SheetDescription>
          </SheetHeader>
          <nav
            className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3"
            aria-label="منوی موبایل"
          >
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                className="h-10 justify-start px-3"
                onClick={() => scrollTo(link.href)}
              >
                {link.label}
              </Button>
            ))}
            <Button
              className="landing-btn landing-btn-primary mt-2 h-10"
              onClick={() => scrollTo("#pricing")}
            >
              شروع رایگان
            </Button>
          </nav>
        </SheetContent>
      </Sheet>

      <main id="top">
        {/* Hero */}
        <section className="landing-ambient relative overflow-hidden">
          <div className="landing-grain" aria-hidden />
          <div
            aria-hidden
            className="landing-orb pointer-events-none absolute -top-16 start-[6%] size-40 opacity-70"
          />
          <div
            aria-hidden
            className="landing-orb landing-orb-slow pointer-events-none absolute -end-12 top-24 size-32 opacity-60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22] dark:opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(to left, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "linear-gradient(180deg, black 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10 lg:pt-12">
            <div className="landing-reveal mx-auto max-w-3xl space-y-4 text-center">
              <p className="landing-brand text-2xl font-semibold sm:text-3xl">
                {brand}
              </p>
              <h1 className="mx-auto max-w-xl text-balance text-base font-medium leading-relaxed tracking-tight text-foreground/85 sm:text-lg">
                فضای کاری فارسی برای تیم‌هایی که
                <span className="text-muted-foreground"> یکجا می‌سازند</span>
              </h1>
              <p className="mx-auto max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
                کارها، اسناد و انتشار در یک فضای RTL — ساده و همیشه در دسترس.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <Button
                  className="landing-btn landing-btn-primary min-w-28 gap-2 px-4"
                  onClick={() => scrollTo("#pricing")}
                >
                  شروع رایگان
                  <ArrowLeftIcon data-icon="inline-end" className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  className="landing-btn landing-btn-soft min-w-28 px-4"
                  onClick={() => scrollTo("#workflow")}
                >
                  دیدن جریان کار
                </Button>
              </div>
            </div>

            <div
              className="landing-float relative mt-8 sm:mt-10"
              style={{ animationDelay: "0.4s" }}
            >
              <div
                aria-hidden
                className="landing-orb absolute inset-x-10 -bottom-4 top-1/2 -z-10 opacity-40"
              />
              <div
                aria-hidden
                className="landing-sheet landing-elev-card absolute inset-x-10 -bottom-2 top-8 -z-[1] rounded-t-xl opacity-45 sm:inset-x-14"
              />
              <ProductPreview />
            </div>
          </div>
        </section>

        {/* Manifesto strip */}
        <section className="landing-manifesto border-y border-foreground/8 py-5 sm:py-6">
          <p className="landing-reveal mx-auto max-w-2xl px-6 text-center text-sm font-medium leading-relaxed tracking-tight text-foreground/75 sm:text-base">
            «یک منبع حقیقت برای تیم — از ایده تا لحظه‌ای که محصول زنده می‌شود.»
          </p>
        </section>

        {/* Logos */}
        <section
          aria-label="تیم‌هایی که از سپهر استفاده می‌کنند"
          className="bg-background py-8"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="mb-5 text-center text-xs tracking-[0.16em] text-muted-foreground">
              همراه تیم‌هایی که فارسی می‌سازند
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {logos.map((name) => (
                <li
                  key={name}
                  className="text-base font-semibold tracking-tight text-foreground/30 transition-all duration-300 hover:scale-105 hover:text-foreground/65"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-16 bg-background py-10 sm:py-12"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
                امکانات
              </p>
              <h2 className="landing-section-title text-xl font-semibold tracking-tight sm:text-2xl">
                آنچه لازم دارید —{" "}
                <span className="text-muted-foreground">نه بیشتر، نه کمتر</span>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                سپهر روی چند جریان اصلی تمرکز می‌کند تا تیم‌تان کمتر ابزار عوض
                کند و بیشتر جلو برود.
              </p>
            </div>

            <ul className="landing-feature-list mt-10">
              {features.map((feature, index) => (
                <li key={feature.title} className="landing-feature-row">
                  <span
                    className={cn("landing-feature-num", numericClass)}
                    aria-hidden
                  >
                    {toPersianDigits(String(index + 1).padStart(2, "0"))}
                  </span>
                  <div className="landing-feature-copy">
                    <h3 className="landing-feature-title">{feature.title}</h3>
                    <p className="landing-feature-desc">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Workflow */}
        <section
          id="workflow"
          className="landing-ambient scroll-mt-16 py-10 sm:py-12"
        >
          <div className="landing-grain opacity-[0.03]" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] lg:items-center lg:gap-12">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
                  گردش کار
                </p>
                <h2 className="landing-section-title text-xl font-semibold tracking-tight sm:text-2xl">
                  از جرقهٔ ایده تا انتشار
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  هر مرحله در همان فضای کاری دیده می‌شود؛ بدون کپی‌کردن وضعیت بین
                  ابزارها.
                </p>
              </div>
              <ol className="space-y-0">
                {steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="relative flex gap-4 border-s border-foreground/12 ps-5 pb-7 last:pb-0"
                  >
                    <span
                      className="absolute -start-[0.4rem] top-1.5 size-3 rounded-full bg-foreground shadow-[0_0_0_4px_color-mix(in_oklch,var(--background)_85%,transparent)]"
                      aria-hidden
                    />
                    <div className="space-y-2">
                      <p
                        className={cn(
                          "text-xs tracking-[0.12em] text-muted-foreground",
                          numericClass
                        )}
                      >
                        مرحله {formatCount(index + 1)}
                      </p>
                      <h3 className="text-base font-medium">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="relative">
              <div
                aria-hidden
                className="landing-orb absolute -inset-6 -z-10 opacity-35"
              />
              <WorkflowPreview />
            </div>
          </div>
        </section>

        {/* Proof */}
        <section className="bg-background py-10 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
                نتیجه
              </p>
              <h2 className="landing-section-title text-xl font-semibold tracking-tight sm:text-2xl">
                وقتی تمرکز برمی‌گردد،{" "}
                <span className="text-muted-foreground">تیم جلو می‌رود</span>
              </h2>
            </div>

            <dl className="landing-elev-panel landing-sheet mt-8 grid grid-cols-2 gap-x-5 gap-y-6 rounded-2xl p-5 sm:grid-cols-4 sm:p-7">
              {[
                { label: "فضای کاری فعال", value: formatCount(1200) },
                { label: "میانگین زمان ریویو", value: "۳۸٪ کمتر" },
                { label: "رضایت هفتگی", value: "۴٫۷ از ۵" },
                { label: "پشتیبانی پاسخ", value: "زیر ۴ ساعت" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2.5">
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd
                    className={cn(
                      "text-xl font-semibold tracking-tight sm:text-2xl",
                      numericClass
                    )}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <li
                  key={item.name}
                  className="landing-elev-card landing-sheet relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5 sm:p-6"
                >
                  <span className="landing-quote-mark" aria-hidden>
                    «
                  </span>
                  <p className="relative z-[1] flex-1 text-[0.95rem] leading-relaxed text-foreground/90">
                    {item.quote}
                  </p>
                  <div className="relative z-[1] flex items-center gap-3">
                    <Avatar
                      size="sm"
                      className="shadow-[0_8px_20px_-10px_color-mix(in_oklch,var(--foreground)_50%,transparent)]"
                    >
                      <AvatarFallback className="text-[0.65rem]">
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="landing-ambient scroll-mt-16 py-10 sm:py-12"
        >
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
                قیمت‌گذاری
              </p>
              <h2 className="landing-section-title text-xl font-semibold tracking-tight sm:text-2xl">
                شفاف. آرام.{" "}
                <span className="text-muted-foreground">بدون شگفتی ماهانه</span>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                همه مبلغ‌ها ماهانه و به تومان است. پرداخت واقعی در این دمو وجود
                ندارد.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:items-stretch">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "landing-sheet flex flex-col rounded-2xl p-5 sm:p-6",
                    plan.featured
                      ? "landing-elev-featured relative z-[1]"
                      : "landing-elev-card"
                  )}
                >
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-semibold tracking-tight">
                      {plan.name}
                    </h3>
                    {plan.featured ? (
                      <span className="rounded-md bg-primary/12 px-2 py-0.5 text-[0.65rem] font-medium tracking-[0.08em] text-primary">
                        پیشنهادی
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={cn(
                      "text-xl font-semibold tracking-tight whitespace-nowrap",
                      numericClass
                    )}
                  >
                    {plan.price === 0 ? "رایگان" : formatToman(plan.price)}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {plan.hint}
                    {plan.price > 0 ? " · ماهانه" : null}
                  </p>
                  <ul className="my-5 flex-1 space-y-2.5 border-t border-foreground/8 pt-5">
                    {plan.features.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-foreground/80"
                      >
                        <CheckIcon
                          className="mt-0.5 size-4 shrink-0 text-foreground"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn(
                      "landing-btn w-full",
                      plan.featured
                        ? "landing-btn-primary"
                        : "landing-btn-soft"
                    )}
                    variant={plan.featured ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="scroll-mt-16 bg-background py-10 sm:py-12"
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
                پشتیبانی
              </p>
              <h2 className="landing-section-title text-xl font-semibold tracking-tight sm:text-2xl">
                پرسش‌هایی که معمولاً{" "}
                <span className="text-muted-foreground">پرسیده می‌شوند</span>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                اگر پاسخ‌تان اینجا نیست، از{" "}
                <a
                  href="/examples/contact"
                  className="text-foreground underline underline-offset-2"
                >
                  تماس با ما
                </a>{" "}
                پیام بگذارید.
              </p>
            </div>
            <div className="landing-elev-panel landing-sheet rounded-2xl px-2 py-2 sm:px-3 sm:py-2.5">
              <Accordion>
                {faqs.map((item, index) => (
                  <AccordionItem key={item.q} value={`faq-${index}`}>
                    <AccordionTrigger className="px-3 text-start sm:px-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 sm:px-4">
                      <p className="leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="landing-ambient relative overflow-hidden py-12 sm:py-14">
          <div
            aria-hidden
            className="landing-orb absolute start-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 opacity-45"
          />
          <div className="landing-elev-cta landing-sheet relative mx-auto max-w-xl space-y-3 rounded-2xl px-6 py-10 text-center backdrop-blur-md sm:px-10 sm:py-12">
            <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground">
              همین حالا
            </p>
            <h2 className="landing-section-title text-xl font-semibold tracking-tight sm:text-2xl">
              فضای کاری‌تان را شروع کنید
            </h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              بدون کارت بانکی شروع کنید. اگر مناسب نبود، داده‌های نمایشی را پاک
              کنید و بروید — بدون دلخوری.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <Button
                className="landing-btn landing-btn-primary min-w-28 px-4"
                onClick={() => scrollTo("#pricing")}
              >
                شروع رایگان
                <ArrowLeftIcon data-icon="inline-end" className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                className="landing-btn landing-btn-soft min-w-28 px-4"
                onClick={() => scrollTo("#faq")}
              >
                خواندن پرسش‌ها
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-foreground/8 bg-background py-10">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div className="space-y-3 lg:col-span-1">
            <p className="text-lg font-semibold tracking-tight">{brand}</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              فضای کاری تیم‌های محصول فارسی برای کار، سند و انتشار.
            </p>
          </div>
          <FooterColumn
            title="محصول"
            links={[
              { href: "#features", label: "امکانات" },
              { href: "#workflow", label: "گردش کار" },
              { href: "#pricing", label: "قیمت‌ها" },
            ]}
            onNavigate={scrollTo}
          />
          <FooterColumn
            title="شرکت"
            links={[
              { href: "#faq", label: "پرسش‌ها" },
              { href: "#top", label: "درباره سپهر" },
              { href: "/examples/contact", label: "تماس با ما" },
            ]}
            onNavigate={scrollTo}
          />
          <FooterColumn
            title="منابع"
            links={[
              { href: "#workflow", label: "راهنمای شروع" },
              { href: "#faq", label: "وضعیت سرویس" },
              { href: "#top", label: "امنیت" },
            ]}
            onNavigate={scrollTo}
          />
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-foreground/8 px-4 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className={numericClass}>
            © {toPersianDigits(1405)} سپهر. همه حقوق محفوظ است.
          </p>
          <a
            href="https://farsiui.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-credit landing-credit-footer"
            title="ساخته‌شده با FarsiUI"
          >
            <span className="landing-credit-prefix">ساخته‌شده با</span>
            <strong>FarsiUI</strong>
          </a>
        </div>
      </footer>
    </div>
  )
}

function FooterColumn({
  title,
  links,
  onNavigate,
}: {
  title: string
  links: { href: string; label: string }[]
  onNavigate: (href: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{title}</p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("/") ? (
              <Link
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate(link.href)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductPreview() {
  return (
    <div
      className="landing-elev-float landing-sheet overflow-hidden rounded-t-xl"
      aria-hidden
    >
      <div className="flex items-center gap-2 bg-[color-mix(in_oklch,var(--muted)_45%,var(--background))] px-3 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-foreground/18" />
          <span className="size-2 rounded-full bg-foreground/18" />
          <span className="size-2 rounded-full bg-foreground/18" />
        </span>
        <span className="ms-2 truncate text-xs text-muted-foreground">
          سپهر · انتشار نسخهٔ ۲٫۴
        </span>
        <span className="ms-auto rounded-md bg-foreground/8 px-2 py-0.5 text-[0.65rem] text-foreground/70">
          در حال انجام
        </span>
      </div>
      <div className="grid min-h-[13rem] sm:min-h-[15rem] sm:grid-cols-[11rem_minmax(0,1fr)]">
        <div className="hidden border-e border-foreground/8 p-4 sm:block">
          <p className="mb-2.5 text-[0.65rem] font-medium tracking-[0.14em] text-muted-foreground">
            پروژه‌ها
          </p>
          <ul className="space-y-1 text-sm">
            {["اپ فروشگاهی", "پنل پشتیبانی", "سایت بازاریابی"].map(
              (item, i) => (
                <li
                  key={item}
                  className={cn(
                    "rounded-md px-2.5 py-2 transition-shadow",
                    i === 0
                      ? "bg-foreground text-background shadow-[0_8px_20px_-12px_color-mix(in_oklch,var(--foreground)_55%,transparent)]"
                      : "text-muted-foreground"
                  )}
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
        <div className="space-y-1 p-4 sm:p-5">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium">برد انتشار</p>
              <p className="text-xs text-muted-foreground">
                ۴ کار · مهلت پنج‌شنبه
              </p>
            </div>
            <span className={cn("text-xs text-muted-foreground", numericClass)}>
              ۷۲٪
            </span>
          </div>
          {[
            { title: "بازبینی فرم پرداخت RTL", owner: "سارا", done: true },
            { title: "چک‌لیست دسترس‌پذیری", owner: "رضا", done: false },
            { title: "یادداشت تصمیم فیلترها", owner: "مینا", done: false },
            { title: "آماده‌سازی اعلان انتشار", owner: "بهرام", done: false },
          ].map((row) => (
            <div
              key={row.title}
              className="flex items-center justify-between gap-3 border-b border-foreground/6 py-3 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{row.title}</p>
                <p className="text-xs text-muted-foreground">
                  مسئول: {row.owner}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 text-xs",
                  row.done ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {row.done ? "انجام شد" : "باز"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WorkflowPreview() {
  return (
    <div
      className="landing-elev-panel landing-sheet overflow-hidden rounded-2xl"
      aria-hidden
    >
      <div className="border-b border-foreground/8 px-6 py-5">
        <p className="text-sm font-medium">مشخصات نسخه</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          فیلتر کانال فقط نمایشی است. اسلاید دمو تا ساعت ۱۵ آماده می‌شود.
        </p>
      </div>
      <div className="border-b border-foreground/8 px-6 py-5">
        <p className="mb-3 text-sm font-medium">کارهای متصل</p>
        <ul className="space-y-3.5 text-sm">
          {[
            ["تست موبایل ۳۹۰px", "امروز"],
            ["بازبینی کپی CTA", "فردا"],
            ["تأیید چک‌لیست RTL", "پنج‌شنبه"],
          ].map(([title, when]) => (
            <li key={title} className="flex justify-between gap-3">
              <span className="text-foreground/85">{title}</span>
              <span className={cn("shrink-0 text-muted-foreground", numericClass)}>
                {when}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 py-5">
        <p className="mb-3 text-sm font-medium">چک‌لیست انتشار</p>
        <ul className="space-y-3 text-sm">
          {["اعداد فارسی", "بدون overflow", "حالت خالی"].map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <CheckIcon className="size-4 text-foreground" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
