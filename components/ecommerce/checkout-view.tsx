"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { toPersianDigits } from "@/lib/digits"
import { formatToman } from "@/lib/format"
import {
  paymentMethods,
  shippingMethods,
} from "@/lib/mock/ecommerce"
import { useCart } from "@/components/ecommerce/cart-context"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export function CheckoutView() {
  const router = useRouter()
  const { lines, subtotal, clear, getLineProduct } = useCart()
  const [shippingId, setShippingId] = React.useState(shippingMethods[1].id)
  const [paymentId, setPaymentId] = React.useState(paymentMethods[0].id)
  const [submitting, setSubmitting] = React.useState(false)

  const shipping =
    shippingMethods.find((m) => m.id === shippingId)?.price ?? 0
  const total = subtotal + shipping

  if (lines.length === 0 && !submitting) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
        <h1 className="text-xl font-semibold tracking-tight">تسویه حساب</h1>
        <p className="text-sm text-muted-foreground">
          سبد خرید خالی است و امکان تسویه وجود ندارد.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/examples/ecommerce" />}
        >
          بازگشت به فروشگاه
        </Button>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const orderId = `NR-${Date.now().toString().slice(-6)}`
    const href = `/examples/ecommerce/order?id=${orderId}&total=${total}&shipping=${shippingId}&payment=${paymentId}`
    router.push(href)
    clear()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">تسویه حساب</h1>
        <p className="text-sm text-muted-foreground">
          اطلاعات ارسال و پرداخت به‌صورت نمایشی است.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-medium">اطلاعات گیرنده</h2>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="fullName">نام و نام خانوادگی</FieldLabel>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    autoComplete="name"
                    defaultValue="سارا محمدی"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">شماره موبایل</FieldLabel>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    defaultValue="09121234567"
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="city">شهر</FieldLabel>
                <Input
                  id="city"
                  name="city"
                  required
                  defaultValue="تهران"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="address">آدرس کامل</FieldLabel>
                <Textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  defaultValue="ونک، خیابان ملاصدرا، پلاک ۱۲، واحد ۵"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="postal">کد پستی</FieldLabel>
                <Input
                  id="postal"
                  name="postal"
                  required
                  inputMode="numeric"
                  defaultValue="1991812345"
                />
              </Field>
            </FieldGroup>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-sm font-medium">روش ارسال</h2>
            <RadioGroup
              value={shippingId}
              onValueChange={(v) => v && setShippingId(v as typeof shippingId)}
              className="gap-3"
            >
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-data-checked:border-primary"
                >
                  <RadioGroupItem value={method.id} className="mt-0.5" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{method.title}</span>
                      <span className="text-sm tracking-normal">
                        {method.price === 0
                          ? "رایگان"
                          : formatToman(method.price)}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {method.hint}
                    </span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-sm font-medium">روش پرداخت</h2>
            <RadioGroup
              value={paymentId}
              onValueChange={(v) => v && setPaymentId(v as typeof paymentId)}
              className="gap-3"
            >
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-data-checked:border-primary"
                >
                  <RadioGroupItem value={method.id} className="mt-0.5" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {method.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {method.hint}
                    </span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </section>
        </div>

        <aside className="h-fit space-y-4 rounded-xl border p-4 lg:sticky lg:top-24">
          <p className="text-sm font-medium">خلاصه سفارش</p>
          <ul className="space-y-2 text-sm">
            {lines.map((line) => {
              const product = getLineProduct(line.productId)
              if (!product) return null
              return (
                <li
                  key={line.productId}
                  className="flex justify-between gap-3"
                >
                  <span className="min-w-0 truncate text-muted-foreground">
                    {product.name} × {toPersianDigits(line.quantity)}
                  </span>
                  <span className="shrink-0 tracking-normal">
                    {formatToman(product.price * line.quantity)}
                  </span>
                </li>
              )
            })}
          </ul>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">جمع جزء</span>
              <span className="tracking-normal">{formatToman(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">هزینه ارسال</span>
              <span className="tracking-normal">
                {shipping === 0 ? "رایگان" : formatToman(shipping)}
              </span>
            </div>
            <div className="flex justify-between gap-3 font-medium">
              <span>مبلغ نهایی</span>
              <span className="tracking-normal">{formatToman(total)}</span>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "در حال ثبت…" : "ثبت سفارش نمایشی"}
          </Button>
          <p className="text-[0.65rem] leading-relaxed text-muted-foreground">
            این جریان فقط برای نمایش UI است؛ پرداخت واقعی انجام نمی‌شود.
          </p>
        </aside>
      </form>
    </div>
  )
}
