"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckIcon, XIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import {
  authBrandName,
  demoCredentials,
  fakeDelay,
  getPasswordStrength,
  isValidEmail,
  isValidMobile,
} from "@/lib/mock/auth"
import { normalizeDigits, toPersianDigits } from "@/lib/digits"
import { AuthCaptcha } from "@/components/auth-example/auth-captcha"
import { AuthStage } from "@/components/auth-example/auth-stage"
import { PasswordInput } from "@/components/auth-example/password-input"
import { PasswordRequirements } from "@/components/auth-example/password-requirements"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const AUTH_BASE = "/examples/authentication"

function showAuthSuccessToast({
  title,
  description,
}: {
  title: string
  description: string
}) {
  toast.custom(
    (id) => (
      <div className="auth-toast" role="status">
        <span className="auth-toast-icon" aria-hidden>
          <CheckIcon className="size-4" strokeWidth={2.4} />
        </span>
        <div className="auth-toast-body">
          <p className="auth-toast-title">{title}</p>
          <p className="auth-toast-desc">{description}</p>
        </div>
        <button
          type="button"
          className="auth-toast-close"
          aria-label="بستن"
          onClick={() => toast.dismiss(id)}
        >
          <XIcon className="mx-auto size-3.5" />
        </button>
      </div>
    ),
    { duration: 4800 }
  )
}

export function AuthLoginSignup({
  initialTab = "login",
}: {
  initialTab?: "login" | "signup"
}) {
  const [mode, setMode] = React.useState<"login" | "signup">(initialTab)

  return (
    <AuthStage>
      <div className="space-y-5">
        <header className="mb-1 space-y-1 md:hidden">
          <p className="text-[0.65rem] font-medium tracking-[0.14em] auth-muted">
            فضای کاری فارسی
          </p>
          <h2 className="auth-rail-title">{authBrandName}</h2>
        </header>

        <div className="auth-tab-panel" key={mode}>
          {mode === "login" ? (
            <LoginForm onGoSignup={() => setMode("signup")} />
          ) : (
            <SignupForm onGoLogin={() => setMode("login")} />
          )}
        </div>
      </div>
    </AuthStage>
  )
}

function LoginForm({ onGoSignup }: { onGoSignup: () => void }) {
  const [method, setMethod] = React.useState<"mobile" | "email">("mobile")
  const [identifier, setIdentifier] = React.useState(demoCredentials.mobile)
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [captchaOk, setCaptchaOk] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  function setMethodAndPrefill(next: "mobile" | "email") {
    setMethod(next)
    setError(null)
    setSuccess(false)
    setIdentifier(
      next === "mobile" ? demoCredentials.mobile : demoCredentials.email
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (method === "email") {
      if (!isValidEmail(identifier)) {
        setError("ایمیل معتبر وارد کنید.")
        return
      }
    } else if (!isValidMobile(identifier)) {
      setError("شماره موبایل معتبر وارد کنید.")
      return
    }

    if (!password) {
      setError("رمز عبور را وارد کنید.")
      return
    }
    if (!captchaOk) {
      setError("ابتدا کپچا را کامل کنید.")
      return
    }

    setLoading(true)
    await fakeDelay()
    setLoading(false)

    const normalizedId = identifier.trim().toLowerCase()
    const phoneDigits = normalizeDigits(identifier).replace(/\D/g, "")
    const idOk =
      method === "email"
        ? normalizedId === demoCredentials.email
        : phoneDigits.endsWith("9121234567")
    const passOk = password === demoCredentials.password

    if (!idOk || !passOk) {
      setError(
        method === "email"
          ? "ایمیل یا رمز نادرست است. از رمز نمونه استفاده کنید."
          : "موبایل یا رمز نادرست است. از رمز نمونه استفاده کنید."
      )
      return
    }

    setSuccess(true)
    showAuthSuccessToast({
      title: "ورود موفق",
      description: remember
        ? "نشست نمایشی ذخیره شد — آماده‌اید."
        : "وارد فضای کاری شدید (نمایشی).",
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <h2 className="auth-rail-title">ورود به حساب</h2>
        <p className="auth-rail-sub">با موبایل یا ایمیل وارد همیار شوید.</p>
      </div>

      <div className="auth-method" role="group" aria-label="روش ورود">
        <button
          type="button"
          className="auth-method-btn"
          aria-pressed={method === "mobile"}
          onClick={() => setMethodAndPrefill("mobile")}
        >
          موبایل
        </button>
        <button
          type="button"
          className="auth-method-btn"
          aria-pressed={method === "email"}
          onClick={() => setMethodAndPrefill("email")}
        >
          ایمیل
        </button>
      </div>

      {error ? (
        <Alert variant="destructive" className="auth-alert auth-alert-error">
          <AlertTitle>ورود ناموفق</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert className="auth-alert">
          <AlertTitle>خوش آمدید</AlertTitle>
          <AlertDescription>
            ورود نمایشی انجام شد. در محصول واقعی به داشبورد می‌روید.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-3.5">
        <div className="auth-field">
          <label
            htmlFor={method === "email" ? "login-email" : "login-mobile"}
            className="auth-label"
          >
            {method === "email" ? "ایمیل" : "شماره موبایل"}
          </label>
          {method === "email" ? (
            <Input
              id="login-email"
              className="auth-input text-start"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              dir="ltr"
              autoComplete="email"
              inputMode="email"
              persianDigits={false}
              aria-invalid={error ? true : undefined}
            />
          ) : (
            <Input
              id="login-mobile"
              className="auth-input text-start"
              value={toPersianDigits(identifier)}
              onChange={(e) =>
                setIdentifier(normalizeDigits(e.target.value).replace(/\D/g, "").slice(0, 11))
              }
              dir="ltr"
              autoComplete="tel"
              inputMode="tel"
              persianDigits={false}
              aria-invalid={error ? true : undefined}
            />
          )}
        </div>

        <div className="auth-field">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="login-password" className="auth-label">
              رمز عبور
            </label>
            <Link
              href={`${AUTH_BASE}/forgot-password`}
              className="auth-link text-[0.7rem]"
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
          <p className="text-[0.68rem] auth-muted">
            رمز نمونه:{" "}
            <span dir="ltr" className="font-mono text-[0.7rem]">
              {demoCredentials.password}
            </span>
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 pt-0.5">
          <Checkbox
            checked={remember}
            onCheckedChange={(c) => setRemember(c === true)}
          />
          <span className="text-[0.8125rem] auth-check-label">
            مرا به خاطر بسپار
          </span>
        </label>

        <AuthCaptcha verified={captchaOk} onVerifiedChange={setCaptchaOk} />
      </div>

      <Button
        type="submit"
        className="auth-btn auth-btn-primary w-full"
        disabled={loading || !captchaOk}
      >
        {loading ? "در حال ورود…" : "ورود به همیار"}
      </Button>

      <p className="text-center text-[0.8125rem] auth-muted">
        اکانت ندارید؟{" "}
        <button
          type="button"
          className={cn("auth-link font-medium text-white")}
          onClick={onGoSignup}
        >
          ثبت‌نام
        </button>
      </p>
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

    showAuthSuccessToast({
      title: "حساب ساخته شد",
      description: "برای تأیید، کد یک‌بارمصرف را وارد کنید.",
    })
    router.push(
      `${AUTH_BASE}/verify?from=signup&email=${encodeURIComponent(email.trim())}`
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <h2 className="auth-rail-title">ساخت حساب</h2>
        <p className="auth-rail-sub">بعد از ثبت‌نام، کد تأیید می‌آید.</p>
      </div>

      {error ? (
        <Alert variant="destructive" className="auth-alert auth-alert-error">
          <AlertTitle>ثبت‌نام ناقص است</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-3.5">
        <div className="auth-field">
          <label htmlFor="signup-name" className="auth-label">
            نام و نام خانوادگی
          </label>
          <Input
            id="signup-name"
            className="auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            persianDigits={false}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-email" className="auth-label">
            ایمیل
          </label>
          <Input
            id="signup-email"
            type="email"
            dir="ltr"
            className="auth-input text-start"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            persianDigits={false}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password" className="auth-label">
            رمز عبور
          </label>
          <PasswordInput
            id="signup-password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          <div
            className="auth-meter"
            role="meter"
            aria-label="قدرت رمز عبور"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={strength.score}
          >
            <span
              data-on={strength.lengthOk ? "true" : "false"}
              data-seg="len"
            />
            <span
              data-on={strength.letterOk ? "true" : "false"}
              data-seg="letter"
            />
            <span
              data-on={strength.digitOk ? "true" : "false"}
              data-seg="digit"
            />
          </div>
          <PasswordRequirements password={password} />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-confirm" className="auth-label">
            تکرار رمز عبور
          </label>
          <PasswordInput
            id="signup-confirm"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            aria-invalid={confirm && confirm !== password ? true : undefined}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-2">
          <Checkbox
            className="mt-0.5"
            checked={terms}
            onCheckedChange={(c) => setTerms(c === true)}
          />
          <span className="text-[0.8125rem] leading-relaxed auth-muted">
            شرایط استفاده و حریم خصوصی همیار را می‌پذیرم.
          </span>
        </label>
      </div>

      <Button
        type="submit"
        className="auth-btn auth-btn-primary w-full"
        disabled={loading}
      >
        {loading ? "در حال ایجاد حساب…" : "ایجاد حساب"}
      </Button>

      <p className="text-center text-[0.8125rem] auth-muted">
        قبلاً حساب دارید؟{" "}
        <button
          type="button"
          className={cn("auth-link font-medium text-white")}
          onClick={onGoLogin}
        >
          ورود
        </button>
      </p>
    </form>
  )
}
