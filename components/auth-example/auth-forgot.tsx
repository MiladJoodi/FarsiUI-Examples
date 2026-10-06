"use client"

import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"

import {
  demoCredentials,
  fakeDelay,
  getPasswordStrength,
  isEmailOrMobile,
} from "@/lib/mock/auth"
import { normalizeDigits, toPersianDigits } from "@/lib/digits"
import { AuthStage } from "@/components/auth-example/auth-stage"
import { PasswordInput } from "@/components/auth-example/password-input"
import { PasswordRequirements } from "@/components/auth-example/password-requirements"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const AUTH_BASE = "/examples/authentication"

type Step = "request" | "verify" | "reset" | "success"

const STEPS: Step[] = ["request", "verify", "reset", "success"]

function otpFromInput(value: string) {
  return normalizeDigits(value).replace(/\D/g, "").slice(0, 6)
}

export function AuthForgotPassword() {
  const [step, setStep] = React.useState<Step>("request")
  const [identifier, setIdentifier] = React.useState<string>(demoCredentials.email)
  const [otp, setOtp] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [seconds, setSeconds] = React.useState(0)

  const stepIndex = STEPS.indexOf(step)

  React.useEffect(() => {
    if (seconds <= 0) return
    const id = window.setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [seconds])

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!isEmailOrMobile(identifier)) {
      setError("ایمیل یا موبایل معتبر وارد کنید.")
      return
    }
    setLoading(true)
    await fakeDelay()
    setLoading(false)
    setStep("verify")
    setSeconds(60)
    setOtp("")
    toast.message("کد ارسال شد", {
      description: `کد نمونه: ${toPersianDigits(demoCredentials.otp)}`,
    })
  }

  async function submitVerify(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const code = otpFromInput(otp)
    if (code.length < 6) {
      setError("کد ۶ رقمی را کامل وارد کنید.")
      return
    }
    setLoading(true)
    await fakeDelay(700)
    setLoading(false)
    if (code !== demoCredentials.otp) {
      setError("کد نادرست است. دوباره بررسی کنید.")
      return
    }
    setStep("reset")
    setError(null)
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const strength = getPasswordStrength(password)
    if (strength.score < 3) {
      setError("رمز جدید شرایط لازم را ندارد.")
      return
    }
    if (password !== confirm) {
      setError("تکرار رمز با رمز جدید یکسان نیست.")
      return
    }
    setLoading(true)
    await fakeDelay()
    setLoading(false)
    setStep("success")
    toast.success("رمز عبور به‌روز شد")
  }

  async function resendCode() {
    if (seconds > 0) return
    setLoading(true)
    await fakeDelay(600)
    setLoading(false)
    setSeconds(60)
    setOtp("")
    setError(null)
    toast.message("کد دوباره ارسال شد", {
      description: `کد نمونه: ${toPersianDigits(demoCredentials.otp)}`,
    })
  }

  const leadByStep =
    step === "request"
      ? "ایمیل یا موبایل حساب را بدهید تا کد تأیید بفرستیم."
      : step === "verify"
        ? "کد ۶ رقمی را وارد کنید تا هویت شما تأیید شود."
        : step === "reset"
          ? "رمز عبور جدید را انتخاب کنید."
          : "رمز عوض شد؛ می‌توانید دوباره وارد شوید."

  return (
    <AuthStage>
      <Link href={AUTH_BASE} className="auth-back">
        بازگشت به ورود
      </Link>

      <div className="auth-steps" aria-hidden>
        {STEPS.map((id, i) => (
          <span
            key={id}
            className="auth-step"
            data-on={i === stepIndex ? "true" : "false"}
            data-done={i < stepIndex ? "true" : "false"}
          />
        ))}
      </div>

      <div className="mb-4">
        <h2 className="auth-rail-title">بازیابی رمز</h2>
        <p className="auth-rail-sub">{leadByStep}</p>
      </div>

      {error ? (
        <Alert
          variant="destructive"
          className="auth-alert auth-alert-error mb-4"
        >
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {step === "request" ? (
        <form onSubmit={submitRequest} className="space-y-4" noValidate>
          <div className="auth-field">
            <label htmlFor="forgot-id" className="auth-label">
              ایمیل یا موبایل
            </label>
            <Input
              id="forgot-id"
              className="auth-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              dir={identifier.includes("@") ? "ltr" : undefined}
              autoComplete="username"
            />
          </div>
          <Button
            type="submit"
            className="auth-btn auth-btn-primary w-full"
            disabled={loading}
          >
            {loading ? "در حال ارسال…" : "ارسال کد تأیید"}
          </Button>
        </form>
      ) : null}

      {step === "verify" ? (
        <form onSubmit={submitVerify} className="space-y-4" noValidate>
          <div className="auth-field">
            <label htmlFor="forgot-otp" className="auth-label">
              کد تأیید
            </label>
            <InputOTP
              id="forgot-otp"
              maxLength={6}
              value={otp}
              onChange={(v) => setOtp(otpFromInput(v))}
              containerClassName="justify-start"
              aria-invalid={error ? true : undefined}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="auth-otp-hint">
              ارسال به{" "}
              <span dir={identifier.includes("@") ? "ltr" : undefined}>
                {identifier}
              </span>
              {" · "}
              کد نمونه: <span>{toPersianDigits(demoCredentials.otp)}</span>
            </p>
          </div>

          <Button
            type="submit"
            className="auth-btn auth-btn-primary w-full"
            disabled={loading}
          >
            {loading ? "در حال بررسی…" : "تأیید کد"}
          </Button>

          <div className="text-center text-[0.8rem] auth-muted">
            {seconds > 0 ? (
              <span>
                ارسال مجدد تا {toPersianDigits(seconds)} ثانیه دیگر
              </span>
            ) : (
              <button
                type="button"
                className="auth-link font-medium text-white"
                onClick={resendCode}
                disabled={loading}
              >
                ارسال دوباره کد
              </button>
            )}
          </div>
        </form>
      ) : null}

      {step === "reset" ? (
        <form onSubmit={submitReset} className="space-y-4" noValidate>
          <div className="auth-field">
            <label htmlFor="reset-password" className="auth-label">
              رمز جدید
            </label>
            <PasswordInput
              id="reset-password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
            <div className="pt-1">
              <PasswordRequirements password={password} />
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="reset-confirm" className="auth-label">
              تکرار رمز جدید
            </label>
            <PasswordInput
              id="reset-confirm"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
            />
          </div>
          <Button
            type="submit"
            className="auth-btn auth-btn-primary w-full"
            disabled={loading}
          >
            {loading ? "در حال ذخیره…" : "ذخیره رمز جدید"}
          </Button>
        </form>
      ) : null}

      {step === "success" ? (
        <div className="space-y-4">
          <Alert className="auth-alert">
            <AlertTitle>رمز به‌روز شد</AlertTitle>
            <AlertDescription>
              از این بعد با رمز جدید وارد شوید. این جریان فقط نمایشی است.
            </AlertDescription>
          </Alert>
          <Button
            className="auth-btn auth-btn-primary w-full"
            nativeButton={false}
            render={<Link href={AUTH_BASE} />}
          >
            رفتن به صفحه ورود
          </Button>
        </div>
      ) : null}
    </AuthStage>
  )
}
