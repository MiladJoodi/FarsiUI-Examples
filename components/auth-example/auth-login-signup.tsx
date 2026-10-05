"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import {
  authBrandName,
  authBrandTagline,
  demoCredentials,
  fakeDelay,
  getPasswordStrength,
  isEmailOrMobile,
  isValidEmail,
} from "@/lib/mock/auth"
import { normalizeDigits } from "@/lib/digits"
import { PasswordInput } from "@/components/auth-example/password-input"
import { PasswordRequirements } from "@/components/auth-example/password-requirements"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AUTH_BASE = "/examples/authentication"

export function AuthLoginSignup({
  initialTab = "login",
}: {
  initialTab?: "login" | "signup"
}) {
  const [tab, setTab] = React.useState(initialTab)

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
      <aside className="hidden space-y-3 lg:block">
        <p className="text-sm text-muted-foreground">{authBrandTagline}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{authBrandName}</h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          ورود امن به فضای کاری؛ همه جریان‌های این صفحه فقط نمایشی‌اند و به
          سرور متصل نیستند.
        </p>
        <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
          <li>ورود و ثبت‌نام در یک جا</li>
          <li>بازیابی رمز و تأیید کد یک‌بارمصرف</li>
          <li>پیام‌های خطای واقعی‌نما برای تست رابط</li>
        </ul>
      </aside>

      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-1 lg:hidden">
          <h1 className="text-2xl font-semibold tracking-tight">
            {authBrandName}
          </h1>
          <p className="text-sm text-muted-foreground">{authBrandTagline}</p>
        </div>

        <Tabs
          value={tab}
          onValueChange={(v) => {
            if (v === "login" || v === "signup") setTab(v)
          }}
          className="gap-5"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">ورود</TabsTrigger>
            <TabsTrigger value="signup">ثبت‌نام</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="outline-none">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup" className="outline-none">
            <SignupForm onGoLogin={() => setTab("login")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function LoginForm() {
  const [identifier, setIdentifier] = React.useState(demoCredentials.email)
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!isEmailOrMobile(identifier)) {
      setError("ایمیل یا شماره موبایل معتبر وارد کنید.")
      return
    }
    if (!password) {
      setError("رمز عبور را وارد کنید.")
      return
    }

    setLoading(true)
    await fakeDelay()
    setLoading(false)

    const normalizedId = identifier.trim().toLowerCase()
    const phoneDigits = normalizeDigits(identifier).replace(/\D/g, "")
    const idOk =
      normalizedId === demoCredentials.email ||
      phoneDigits.endsWith("9121234567")
    const passOk = password === demoCredentials.password

    if (!idOk || !passOk) {
      setError(
        "ایمیل/موبایل یا رمز عبور نادرست است. برای تست موفق از رمز نمونه استفاده کنید."
      )
      return
    }

    setSuccess(true)
    toast.success("ورود موفق", {
      description: remember
        ? "نشست نمایشی ذخیره شد."
        : "وارد فضای کاری شدید (نمایشی).",
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">ورود به حساب</h2>
        <p className="text-sm text-muted-foreground">
          با ایمیل یا موبایل وارد شوید.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>ورود ناموفق</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert>
          <AlertTitle>خوش آمدید</AlertTitle>
          <AlertDescription>
            ورود نمایشی انجام شد. در محصول واقعی به داشبورد هدایت می‌شوید.
          </AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="login-id">ایمیل یا موبایل</FieldLabel>
          <Input
            id="login-id"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            dir={identifier.includes("@") ? "ltr" : undefined}
            className={identifier.includes("@") ? "text-start" : undefined}
            autoComplete="username"
            inputMode="email"
            aria-invalid={error ? true : undefined}
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="login-password">رمز عبور</FieldLabel>
            <Link
              href={`${AUTH_BASE}/forgot-password`}
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              فراموشی رمز؟
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            aria-invalid={error ? true : undefined}
          />
          <FieldDescription>
            رمز نمونه برای تست موفق:{" "}
            <span dir="ltr" className="font-mono text-xs">
              {demoCredentials.password}
            </span>
          </FieldDescription>
        </Field>

        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            checked={remember}
            onCheckedChange={(c) => setRemember(c === true)}
          />
          <span className="text-sm">مرا به خاطر بسپار</span>
        </label>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "در حال ورود…" : "ورود"}
      </Button>
    </form>
  )
}

function SignupForm({ onGoLogin }: { onGoLogin: () => void }) {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [terms, setTerms] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const strength = getPasswordStrength(password)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("نام را وارد کنید.")
      return
    }
    if (!isValidEmail(email)) {
      setError("یک ایمیل معتبر وارد کنید.")
      return
    }
    if (strength.score < 3) {
      setError("رمز عبور هنوز شرایط لازم را ندارد.")
      return
    }
    if (password !== confirm) {
      setError("تکرار رمز با رمز عبور یکسان نیست.")
      return
    }
    if (!terms) {
      setError("برای ادامه، شرایط استفاده را بپذیرید.")
      return
    }

    setLoading(true)
    await fakeDelay(1100)
    setLoading(false)

    toast.success("حساب ساخته شد", {
      description: "برای تأیید، کد یک‌بارمصرف را وارد کنید.",
    })
    router.push(
      `${AUTH_BASE}/verify?from=signup&email=${encodeURIComponent(email.trim())}`
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">ساخت حساب</h2>
        <p className="text-sm text-muted-foreground">
          چند فیلد کوتاه؛ بعد از ثبت‌نام کد تأیید می‌آید.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>ثبت‌نام ناقص است</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="signup-name">نام و نام خانوادگی</FieldLabel>
          <Input
            id="signup-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            persianDigits={false}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-email">ایمیل</FieldLabel>
          <Input
            id="signup-email"
            type="email"
            dir="ltr"
            className="text-start"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            persianDigits={false}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-password">رمز عبور</FieldLabel>
          <PasswordInput
            id="signup-password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          <div className="pt-1">
            <PasswordRequirements password={password} />
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-confirm">تکرار رمز عبور</FieldLabel>
          <PasswordInput
            id="signup-confirm"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            aria-invalid={confirm && confirm !== password ? true : undefined}
          />
        </Field>
        <label className="flex cursor-pointer items-start gap-2">
          <Checkbox
            className="mt-0.5"
            checked={terms}
            onCheckedChange={(c) => setTerms(c === true)}
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            شرایط استفاده و حریم خصوصی همیار را می‌پذیرم. (نمایشی)
          </span>
        </label>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "در حال ایجاد حساب…" : "ایجاد حساب"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        قبلاً حساب دارید؟{" "}
        <button
          type="button"
          className="font-medium text-foreground underline-offset-4 hover:underline"
          onClick={onGoLogin}
        >
          ورود
        </button>
      </p>
    </form>
  )
}
