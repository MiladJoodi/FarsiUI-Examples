"use client"

import * as React from "react"
import {
  ArrowLeftIcon,
  CheckIcon,
  FileTextIcon,
  FlagIcon,
  ListTodoIcon,
  MenuIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const brand = "سپهر"
const navLinks = [
  { href: "#features", label: "امکانات" },
  { href: "#workflow", label: "گردش کار" },
  { href: "#pricing", label: "قیمت‌ها" },
  { href: "#faq", label: "پرسش‌ها" },
] as const

const features = [
  {
    icon: ListTodoIcon,
    title: "کارها در یک صفحه",
    description:
      "وضعیت، مسئول و موعد را کنار هم ببینید؛ بدون جابه‌جایی بین چند ابزار پراکنده.",
  },
  {
    icon: FileTextIcon,
    title: "اسناد کنار پروژه",
    description:
      "مشخصات، تصمیم‌ها و یادداشت‌ها در همان فضای کاری می‌مانند و گم نمی‌شوند.",
  },
  {
    icon: FlagIcon,
    title: "انتشار با چک‌لیست",
    description:
      "قبل از انتشار، موارد RTL، دسترس‌پذیری و حالت خالی را با یک چک‌لیست مشترک مرور کنید.",
  },
  {
    icon: MessageSquareIcon,
    title: "بحث روی همان مورد",
    description:
      "نظرها به کار یا سند وصل می‌شوند؛ دیگر رشته‌های طولانی در پیام‌رسان لازم نیست.",
  },
  {
    icon: UsersIcon,
    title: "نقش‌های واضح",
    description:
      "دسترسی مشاهده، ویرایش و مدیریت را برای هر فضای کاری جداگانه تنظیم کنید.",
  },
  {
    icon: ShieldCheckIcon,
    title: "آماده تیم‌های فارسی",
    description:
      "رابط RTL، اعداد فارسی و تاریخ شمسی از روز اول در تجربه کاربری لحاظ شده‌اند.",
  },
] as const

const steps = [
  {
    title: "فضای کاری بسازید",
    description: "تیم، نقش‌ها و پروژه اول را در چند دقیقه تعریف کنید.",
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
    a: "در این نمونه، خروجی واقعی پیاده‌سازی نشده است. در محصول نهایی، خروجی اسناد و فهرست کارها به‌صورت فایل در دسترس خواهد بود.",
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

  function scrollTo(href: string) {
    setMenuOpen(false)
    const id = href.replace("#", "")
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <a
              href="#top"
              className="truncate text-base font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {brand}
            </a>
            <nav
              aria-label="ناوبری اصلی"
              className="ms-2 hidden items-center gap-1 xl:flex"
            >
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollTo(link.href)}
                >
                  {link.label}
                </Button>
              ))}
            </nav>
          </div>
          <div className="pointer-events-none absolute inset-x-0 flex justify-center px-2">
            <div className="pointer-events-auto max-w-[min(100%,16rem)] sm:max-w-none">
              <DesignSystemPicker />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-1.5">
            <Button
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => scrollTo("#pricing")}
            >
              شروع رایگان
            </Button>
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-label="باز کردن منو"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-[min(20rem,100%)]">
          <SheetHeader className="text-start">
            <SheetTitle>{brand}</SheetTitle>
            <SheetDescription>ناوبری صفحه</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4 pb-6" aria-label="منوی موبایل">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                className="justify-start"
                onClick={() => scrollTo(link.href)}
              >
                {link.label}
              </Button>
            ))}
            <Button className="mt-2" onClick={() => scrollTo("#pricing")}>
              شروع رایگان
            </Button>
          </nav>
        </SheetContent>
      </Sheet>

      <main id="top">
        {/* Hero */}
        <section className="border-b">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-12 pb-0 sm:px-6 sm:pt-16 lg:pt-20">
            <div className="mx-auto max-w-2xl space-y-5 text-center">
              <p className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {brand}
              </p>
              <h1 className="text-balance text-xl font-medium tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                کار تیم را از پراکنده بودن نجات دهید
              </h1>
              <p className="mx-auto max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                فضای کاری برای تیم‌های محصول فارسی: کارها، اسناد و انتشار در یک
                رابط RTL، بدون جابه‌جایی بین ابزارهای جدا.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <Button size="lg" onClick={() => scrollTo("#pricing")}>
                  شروع رایگان
                  <ArrowLeftIcon data-icon="inline-end" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollTo("#workflow")}
                >
                  مشاهده گردش کار
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-t-2xl border border-b-0 bg-muted/30">
              <ProductPreview />
            </div>
          </div>
        </section>

        {/* Social logos */}
        <section
          aria-label="تیم‌هایی که از سپهر استفاده می‌کنند"
          className="border-b py-10"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="mb-6 text-center text-xs text-muted-foreground">
              مورد اعتماد تیم‌های محصول فارسی
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {logos.map((name) => (
                <li
                  key={name}
                  className="text-sm font-medium tracking-tight text-muted-foreground"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-16 border-b py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                آنچه برای تحویل لازم دارید
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                سپهر روی چند جریان اصلی تمرکز می‌کند تا تیم‌تان کمتر ابزار عوض
                کند و بیشتر جلو برود.
              </p>
            </div>
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <li key={feature.title} className="space-y-3">
                  <div className="flex size-9 items-center justify-center rounded-lg border bg-muted/40">
                    <feature.icon className="size-4" aria-hidden />
                  </div>
                  <h3 className="text-base font-medium">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="scroll-mt-16 border-b py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                از ایده تا انتشار، یک مسیر
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                به‌جای کپی‌کردن وضعیت بین ابزارها، هر مرحله در همان فضای کاری
                دیده می‌شود.
              </p>
              <ol className="space-y-5">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums">
                      {formatCount(index + 1)}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-muted/20">
              <WorkflowPreview />
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="border-b py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                تیم‌ها کمتر پراکنده کار می‌کنند
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                اعداد و نقل‌قول‌ها نمایشی‌اند و برای نشان‌دادن لحن واقعی صفحه
                آمده‌اند.
              </p>
            </div>

            <dl className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { label: "فضای کاری فعال", value: formatCount(1200) },
                { label: "میانگین زمان ریویو", value: "٪۳۸ کمتر" },
                { label: "رضایت هفتگی", value: "۴٫۷ از ۵" },
                { label: "پشتیبانی پاسخ", value: "زیر ۴ ساعت" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1 text-center">
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd className="text-lg font-semibold tabular-nums tracking-tight sm:text-xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="grid gap-6 md:grid-cols-3">
              {testimonials.map((item) => (
                <li key={item.name} className="space-y-4 border-t pt-5">
                  <p className="text-sm leading-relaxed text-foreground">
                    «{item.quote}»
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
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
        <section id="pricing" className="scroll-mt-16 border-b py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                قیمت ساده، بدون شگفتی
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                همه مبلغ‌ها ماهانه و به تومان است. پرداخت واقعی در این نمونه
                وجود ندارد.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "flex flex-col rounded-2xl border p-5",
                    plan.featured && "border-foreground/25 bg-muted/20"
                  )}
                >
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold">{plan.name}</h3>
                    {plan.featured ? <Badge>پیشنهادی</Badge> : null}
                  </div>
                  <p className="text-2xl font-semibold tabular-nums tracking-tight">
                    {plan.price === 0 ? "رایگان" : formatToman(plan.price)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {plan.hint}
                    {plan.price > 0 ? " · ماهانه" : null}
                  </p>
                  <Separator className="my-4" />
                  <ul className="mb-6 flex-1 space-y-2">
                    {plan.features.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
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
                    className="w-full"
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
        <section id="faq" className="scroll-mt-16 border-b py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                پرسش‌های پرتکرار
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                اگر پاسخ‌تان اینجا نیست، از بخش تماس در پاورقی پیام بگذارید.
              </p>
            </div>
            <Accordion>
              {faqs.map((item, index) => (
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
        <section className="border-b py-16 sm:py-20">
          <div className="mx-auto max-w-3xl space-y-5 px-4 text-center sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              همین امروز فضای کاری‌تان را بسازید
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              بدون کارت بانکی شروع کنید. اگر مناسب نبود، داده‌های نمایشی را پاک
              کنید و بروید.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button size="lg" onClick={() => scrollTo("#pricing")}>
                شروع رایگان
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("#faq")}
              >
                خواندن پرسش‌ها
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div className="space-y-3 lg:col-span-1">
            <p className="text-base font-semibold tracking-tight">{brand}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
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
              { href: "#pricing", label: "تماس با فروش" },
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
        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t px-4 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {toPersianDigits(1405)} سپهر. همه حقوق محفوظ است.</p>
          <p>این صفحه یک نمونه نمایشی FarsiUI است.</p>
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
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <button
              type="button"
              onClick={() => onNavigate(link.href)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductPreview() {
  return (
    <div className="p-3 sm:p-5" aria-hidden>
      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="flex items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-foreground/30" />
            <span className="text-xs font-medium">انتشار نسخهٔ ۲٫۴</span>
          </div>
          <Badge variant="secondary" className="text-[0.65rem]">
            در حال انجام
          </Badge>
        </div>
        <div className="grid sm:grid-cols-[11rem_minmax(0,1fr)]">
          <div className="hidden border-e p-3 sm:block">
            <p className="mb-2 text-[0.65rem] font-medium text-muted-foreground">
              پروژه‌ها
            </p>
            <ul className="space-y-1.5 text-xs">
              {["اپ فروشگاهی", "پنل پشتیبانی", "سایت بازاریابی"].map(
                (item, i) => (
                  <li
                    key={item}
                    className={cn(
                      "rounded-md px-2 py-1.5",
                      i === 0 ? "bg-muted font-medium" : "text-muted-foreground"
                    )}
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="space-y-2 p-3 sm:p-4">
            {[
              { title: "بازبینی فرم پرداخت RTL", owner: "سارا", done: true },
              { title: "چک‌لیست دسترس‌پذیری", owner: "رضا", done: false },
              { title: "یادداشت تصمیم فیلترها", owner: "مینا", done: false },
              { title: "آماده‌سازی اعلان انتشار", owner: "بهرام", done: false },
            ].map((row) => (
              <div
                key={row.title}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium sm:text-sm">
                    {row.title}
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground">
                    مسئول: {row.owner}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[0.65rem]",
                    row.done
                      ? "bg-muted text-foreground"
                      : "border text-muted-foreground"
                  )}
                >
                  {row.done ? "انجام شد" : "باز"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkflowPreview() {
  return (
    <div className="space-y-3 p-4 sm:p-5" aria-hidden>
      <div className="rounded-xl border bg-background p-3">
        <p className="text-xs font-medium">مشخصات نسخه</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          فیلتر کانال فقط نمایشی است. اسلاید دمو تا ساعت ۱۵ آماده می‌شود.
        </p>
      </div>
      <div className="rounded-xl border bg-background p-3">
        <p className="mb-2 text-xs font-medium">کارهای متصل</p>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li className="flex justify-between gap-2 border-b border-dashed pb-2">
            <span>تست موبایل ۳۹۰px</span>
            <span className="tabular-nums">امروز</span>
          </li>
          <li className="flex justify-between gap-2 border-b border-dashed pb-2">
            <span>بازبینی کپی CTA</span>
            <span className="tabular-nums">فردا</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>تأیید چک‌لیست RTL</span>
            <span className="tabular-nums">پنج‌شنبه</span>
          </li>
        </ul>
      </div>
      <div className="rounded-xl border bg-background p-3">
        <p className="text-xs font-medium">چک‌لیست انتشار</p>
        <ul className="mt-2 space-y-1.5 text-xs">
          {["اعداد فارسی", "بدون overflow", "حالت خالی"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckIcon className="size-3.5 text-foreground" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
