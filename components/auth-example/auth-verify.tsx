"use client"

import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"

import { demoCredentials, fakeDelay } from "@/lib/mock/auth"
import { toPersianDigits } from "@/lib/digits"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const AUTH_BASE = "/examples/authentication"

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
    if (otp.length < 6) {
      setError("کد ۶ رقمی را کامل وارد کنید.")
      return
    }
    setLoading(true)
    await fakeDelay(800)
    setLoading(false)
    if (otp !== demoCredentials.otp) {
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
        <h1 className="text-2xl font-semibold tracking-tight">تأیید هویت</h1>
        <p className="text-sm text-muted-foreground">
          کد ۶ رقمی ارسال‌شده را وارد کنید. ورودی OTP از چپ به راست خوانده
          می‌شود تا ترتیب ارقام حفظ شود.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>کد نامعتبر</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <div className="space-y-5">
          <Alert>
            <AlertTitle>تأیید موفق</AlertTitle>
            <AlertDescription>
              {from === "signup"
                ? "ثبت‌نام شما کامل شد. می‌توانید وارد شوید."
                : "تأیید انجام شد."}
            </AlertDescription>
          </Alert>
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href={AUTH_BASE} />}
          >
            رفتن به ورود
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="verify-otp">کد تأیید</FieldLabel>
              <InputOTP
                id="verify-otp"
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
                ارسال‌شده به{" "}
                <span dir="ltr" className="font-medium text-foreground">
                  {target}
                </span>
              </FieldDescription>
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "در حال تأیید…" : "تأیید کد"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {seconds > 0 ? (
              <span>
                ارسال مجدد تا {toPersianDigits(seconds)} ثانیه دیگر
              </span>
            ) : (
              <button
                type="button"
                className="font-medium text-foreground underline-offset-4 hover:underline"
                onClick={resend}
                disabled={loading}
              >
                ارسال دوباره کد
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
