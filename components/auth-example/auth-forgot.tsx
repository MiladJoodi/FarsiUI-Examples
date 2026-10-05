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
import { toPersianDigits } from "@/lib/digits"
import { PasswordInput } from "@/components/auth-example/password-input"
import { PasswordRequirements } from "@/components/auth-example/password-requirements"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const AUTH_BASE = "/examples/authentication"

type Step = "request" | "verify" | "reset" | "success"

export function AuthForgotPassword() {
  const [step, setStep] = React.useState<Step>("request")
  const [identifier, setIdentifier] = React.useState(demoCredentials.email)
  const [otp, setOtp] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [seconds, setSeconds] = React.useState(0)

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
      setError("ایمیل یا شماره موبایل معتبر وارد کنید.")
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
    if (otp.length < 6) {
      setError("کد ۶ رقمی را کامل وارد کنید.")
      return
    }
    setLoading(true)
    await fakeDelay(700)
    setLoading(false)
    if (otp !== demoCredentials.otp) {
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

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <Link
            href={AUTH_BASE}
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            بازگشت به ورود
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">بازیابی رمز</h1>
        <p className="text-sm text-muted-foreground">
          {step === "request" &&
            "ایمیل یا موبایل حساب را وارد کنید تا کد تأیید بفرستیم."}
          {step === "verify" &&
            "کد ۶ رقمی ارسال‌شده را وارد کنید تا هویت شما تأیید شود."}
          {step === "reset" && "رمز عبور جدید را انتخاب کنید."}
          {step === "success" && "رمز شما تغییر کرد؛ می‌توانید وارد شوید."}
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {step === "request" && (
        <form onSubmit={submitRequest} className="space-y-5" noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="forgot-id">ایمیل یا موبایل</FieldLabel>
              <Input
                id="forgot-id"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                dir={identifier.includes("@") ? "ltr" : undefined}
                className={identifier.includes("@") ? "text-start" : undefined}
                autoComplete="username"
              />
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "در حال ارسال…" : "ارسال کد تأیید"}
          </Button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={submitVerify} className="space-y-5" noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="forgot-otp">کد تأیید</FieldLabel>
              <InputOTP
                id="forgot-otp"
                maxLength={6}
                value={otp}
                onChange={setOtp}
                containerClassName="justify-center sm:justify-start"
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
              <FieldDescription>
                کد به{" "}
                <span
                  dir={identifier.includes("@") ? "ltr" : undefined}
                  className="font-medium text-foreground"
                >
                  {identifier}
                </span>{" "}
                ارسال شد.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "در حال بررسی…" : "تأیید کد"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {seconds > 0 ? (
              <span>
                ارسال مجدد تا {toPersianDigits(seconds)} ثانیه دیگر
              </span>
            ) : (
              <button
                type="button"
                className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
                onClick={resendCode}
                disabled={loading}
              >
                ارسال دوباره کد
              </button>
            )}
          </div>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={submitReset} className="space-y-5" noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="reset-password">رمز جدید</FieldLabel>
              <PasswordInput
                id="reset-password"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
              <div className="pt-1">
                <PasswordRequirements password={password} />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="reset-confirm">تکرار رمز جدید</FieldLabel>
              <PasswordInput
                id="reset-confirm"
                value={confirm}
                onChange={setConfirm}
                autoComplete="new-password"
              />
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "در حال ذخیره…" : "ذخیره رمز جدید"}
          </Button>
        </form>
      )}

      {step === "success" && (
        <div className="space-y-5">
          <Alert>
            <AlertTitle>رمز به‌روز شد</AlertTitle>
            <AlertDescription>
              از این بعد با رمز جدید وارد شوید. این جریان فقط نمایشی است.
            </AlertDescription>
          </Alert>
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href={AUTH_BASE} />}
          >
            رفتن به صفحه ورود
          </Button>
        </div>
      )}
    </div>
  )
}
