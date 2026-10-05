"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2Icon } from "lucide-react"

import { toPersianDigits } from "@/lib/digits"
import { formatToman } from "@/lib/format"
import {
  paymentMethods,
  shippingMethods,
} from "@/lib/mock/ecommerce"
import { Button } from "@/components/ui/button"

export function OrderConfirmationView() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") ?? "NR-000000"
  const total = Number(searchParams.get("total") ?? 0)
  const shippingId = searchParams.get("shipping")
  const paymentId = searchParams.get("payment")

  const shipping = shippingMethods.find((m) => m.id === shippingId)
  const payment = paymentMethods.find((m) => m.id === paymentId)

  return (
    <div className="mx-auto max-w-lg space-y-6 py-10 text-center sm:py-16">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
        <CheckCircle2Icon className="size-6 text-foreground" aria-hidden />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          سفارش ثبت شد
        </h1>
        <p className="text-sm text-muted-foreground">
          این تأییدیه نمایشی است و پرداخت واقعی انجام نشده است.
        </p>
      </div>

      <dl className="space-y-3 rounded-xl border p-4 text-start text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">شماره سفارش</dt>
          <dd className="font-medium tabular-nums">
            {toPersianDigits(orderId)}
          </dd>
        </div>
        {shipping ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">روش ارسال</dt>
            <dd>{shipping.title}</dd>
          </div>
        ) : null}
        {payment ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">روش پرداخت</dt>
            <dd>{payment.title}</dd>
          </div>
        ) : null}
        {Number.isFinite(total) && total > 0 ? (
          <div className="flex justify-between gap-3 border-t pt-3 font-medium">
            <dt>مبلغ</dt>
            <dd className="tabular-nums">{formatToman(total)}</dd>
          </div>
        ) : null}
      </dl>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button
          nativeButton={false}
          render={<Link href="/examples/ecommerce" />}
        >
          بازگشت به فروشگاه
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/examples/ecommerce/cart" />}
        >
          مشاهده سبد
        </Button>
      </div>
    </div>
  )
}
