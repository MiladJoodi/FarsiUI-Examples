"use client"

import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"

import { demoCredentials, fakeDelay } from "@/lib/mock/auth"
import { normalizeDigits, toPersianDigits } from "@/lib/digits"
import { AuthStage } from "@/components/auth-example/auth-stage"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const AUTH_BASE = "/examples/authentication"

function otpFromInput(value: string) {
  return normalizeDigits(value).replace(/\D/g, "").slice(0, 6)
}

export function AuthVerify({
  email,
  from,
}: {
  email?: string
  from?: string
}) {
  const target = email?.trim() || demoCredentials.email
  const [otp, setOtp] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [seconds, setSeconds] = React.useState(60)

  React.useEffect(() => {
    if (seconds <= 0) return
    const id = window.setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [seconds])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const code = otpFromInput(otp)
    if (code.length < 6) {
      setError("کد ۶ رقمی را کامل وارد کنید.")
      return
    }
    setLoading(true)
    await fakeDelay(800)
    setLoading(false)
    if (code !== demoCredentials.otp) {
      setError("کد نادرست است. رقم‌ها را دوباره وارد کنید.")
      return
    }
    setSuccess(true)
    toast.success("تأیید شد", {
      description:
        from === "signup"
          ? "حساب شما آماده استفاده است."
          : "هویت شما تأیید شد.",
    })
  }

  async function resend() {
    if (seconds > 0) return
    setLoading(true)
    await fakeDelay(500)
    setLoading(false)
    setSeconds(60)
    setOtp("")
    setError(null)
    toast.message("کد دوباره ارسال شد", {
      description: `کد نمونه: ${toPersianDigits(demoCredentials.otp)}`,
    })
  }

  return (
    <AuthStage>
      <Link href={AUTH_BASE} className="auth-back">
        بازگشت به ورود
      </Link>

      <div className="mb-4">
        <h2 className="auth-rail-title">تأیید هویت</h2>
        <p className="auth-rail-sub">
          کد ۶ رقمی را وارد کنید. ترتیب ارقام از چپ به راست است.
        </p>
      </div>

      {error ? (
        <Alert
          variant="destructive"
          className="auth-alert auth-alert-error mb-4"
        >
          <AlertTitle>کد نامعتبر</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <div className="space-y-4">
          <Alert className="auth-alert">
            <AlertTitle>تأیید موفق</AlertTitle>
            <AlertDescription>
              {from === "signup"
                ? "ثبت‌نام شما کامل شد. می‌توانید وارد شوید."
                : "تأیید انجام شد."}
            </AlertDescription>
          </Alert>
          <Button
            className="auth-btn auth-btn-primary w-full"
            nativeButton={false}
            render={<Link href={AUTH_BASE} />}
          >
            رفتن به ورود
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="auth-field">
            <label htmlFor="verify-otp" className="auth-label">
              کد تأیید
            </label>
            <InputOTP
              id="verify-otp"
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
              ارسال به <span dir="ltr">{target}</span>
              {" · "}
              کد نمونه: <span>{toPersianDigits(demoCredentials.otp)}</span>
            </p>
          </div>

          <Button
            type="submit"
            className="auth-btn auth-btn-primary w-full"
            disabled={loading}
          >
            {loading ? "در حال تأیید…" : "تأیید کد"}
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
                onClick={resend}
                disabled={loading}
              >
                ارسال دوباره کد
              </button>
            )}
          </div>
        </form>
      )}
    </AuthStage>
  )
}
