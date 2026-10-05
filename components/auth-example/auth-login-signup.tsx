"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckIcon, XIcon } from "lucide-react"
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
  const [tab, setTab] = React.useState(initialTab)
  const [panelTab, setPanelTab] = React.useState(initialTab)
  const [phase, setPhase] = React.useState<"in" | "out">("in")
  const switchTimer = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (switchTimer.current) window.clearTimeout(switchTimer.current)
    }
  }, [])

  function switchTab(next: "login" | "signup") {
    if (next === tab || phase === "out") return
    setTab(next)
    setPhase("out")
    if (switchTimer.current) window.clearTimeout(switchTimer.current)
    switchTimer.current = window.setTimeout(() => {
      setPanelTab(next)
      setPhase("in")
    }, 200)
  }

  return (
    <div className="auth-stage">
      <div className="auth-visual" aria-hidden>
        <Image
          src="/parsian.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="auth-visual-img"
        />
        <div className="auth-visual-veil" />
      </div>

      <section className="auth-glass" aria-label="ورود و ثبت‌نام">
        <div className="auth-panel-inner space-y-5">
          <header className="space-y-2">
            <p className="text-[0.65rem] font-medium tracking-[0.18em] auth-muted">
              {authBrandTagline}
            </p>
            <h1 className="auth-brand">
              {authBrandName}
              <span className="auth-brand-mark" aria-hidden />
            </h1>
            <p className="auth-muted max-w-[22rem] text-[0.875rem] leading-relaxed">
              ورود و ثبت‌نام در یک جا — امن، فارسی، و فقط نمایشی برای این نمونه.
            </p>
          </header>

          <div
            className="auth-switch"
            role="tablist"
            aria-label="ورود یا ثبت‌نام"
          >
            <button
              type="button"
              role="tab"
              className="auth-switch-btn"
              aria-selected={tab === "login"}
              aria-pressed={tab === "login"}
              onClick={() => switchTab("login")}
            >
              ورود
            </button>
            <button
              type="button"
              role="tab"
              className="auth-switch-btn"
              aria-selected={tab === "signup"}
              aria-pressed={tab === "signup"}
              onClick={() => switchTab("signup")}
            >
              ثبت‌نام
            </button>
          </div>

          <div
            role="tabpanel"
            className={cn(
              "auth-tab-panel",
              phase === "out" && "auth-tab-panel-leaving"
            )}
            key={panelTab}
          >
            {panelTab === "login" ? (
              <LoginForm />
            ) : (
              <SignupForm onGoLogin={() => switchTab("login")} />
            )}
          </div>
        </div>
      </section>
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
        "ایمیل/موبایل یا رمز نادرست است. برای تست موفق از رمز نمونه استفاده کنید."
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
      <div className="space-y-0.5">
        <h2 className="text-base font-semibold tracking-tight text-white">
          ورود به حساب
        </h2>
        <p className="text-[0.8125rem] auth-muted">
          با ایمیل یا موبایل وارد شوید.
        </p>
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
          <label htmlFor="login-id" className="auth-label">
            ایمیل یا موبایل
          </label>
          <Input
            id="login-id"
            className="auth-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            dir={identifier.includes("@") ? "ltr" : undefined}
            autoComplete="username"
            inputMode="email"
            aria-invalid={error ? true : undefined}
          />
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
          <span className="text-[0.8125rem] auth-check-label">مرا به خاطر بسپار</span>
        </label>
      </div>

      <Button
        type="submit"
        className="auth-btn auth-btn-primary w-full"
        disabled={loading}
      >
        {loading ? "در حال ورود…" : "ورود به همیار"}
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
      <div className="space-y-0.5">
        <h2 className="text-base font-semibold tracking-tight text-white">
          ساخت حساب
        </h2>
        <p className="text-[0.8125rem] auth-muted">
          بعد از ثبت‌نام، کد تأیید می‌آید.
        </p>
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
          <div className="auth-meter" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span key={n} data-on={strength.score >= n ? "true" : "false"} />
            ))}
          </div>
          <p className="text-[0.68rem] auth-muted">
            حداقل ۸ نویسه، یک حرف و یک رقم
          </p>
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
            شرایط استفاده و حریم خصوصی همیار را می‌پذیرم. (نمایشی)
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
