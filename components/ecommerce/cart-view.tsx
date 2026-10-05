"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { toPersianDigits } from "@/lib/digits"
import { formatCount, formatToman } from "@/lib/format"
import { useCart } from "@/components/ecommerce/cart-context"
import { ProductThumb } from "@/components/ecommerce/product-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const SHIPPING_ESTIMATE = 45_000

export function CartView() {
  const router = useRouter()
  const { lines, subtotal, setQuantity, removeItem, getLineProduct } = useCart()
  const shipping = lines.length > 0 ? SHIPPING_ESTIMATE : 0
  const total = subtotal + shipping

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
        <h1 className="text-xl font-semibold tracking-tight">سبد خرید</h1>
        <p className="text-sm text-muted-foreground">
          سبد شما خالی است. از فروشگاه کالایی انتخاب کنید.
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">سبد خرید</h1>
        <p className="text-sm text-muted-foreground">
          {formatCount(lines.reduce((s, l) => s + l.quantity, 0))} کالا
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ul className="space-y-4">
          {lines.map((line) => {
            const product = getLineProduct(line.productId)
            if (!product) return null
            return (
              <li
                key={line.productId}
                className="flex gap-3 border-b pb-4 last:border-0 sm:gap-4"
              >
                <Link
                  href={`/examples/ecommerce/products/${product.id}`}
                  className="shrink-0"
                >
                  <ProductThumb
                    product={product}
                    className="size-20 rounded-lg sm:size-24"
                  />
                </Link>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/examples/ecommerce/products/${product.id}`}
                        className="line-clamp-2 text-sm font-medium hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {product.brand}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`حذف ${product.name}`}
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div
                      className="inline-flex items-center rounded-lg border"
                      role="group"
                      aria-label={`تعداد ${product.name}`}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="کاهش تعداد"
                        onClick={() =>
                          setQuantity(product.id, line.quantity - 1)
                        }
                      >
                        <MinusIcon className="size-4" />
                      </Button>
                      <span className="min-w-8 text-center text-sm tabular-nums">
                        {toPersianDigits(line.quantity)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="افزایش تعداد"
                        disabled={line.quantity >= product.stock}
                        onClick={() =>
                          setQuantity(product.id, line.quantity + 1)
                        }
                      >
                        <PlusIcon className="size-4" />
                      </Button>
                    </div>
                    <p className="text-sm font-medium tabular-nums">
                      {formatToman(product.price * line.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <aside className="h-fit space-y-4 rounded-xl border p-4 lg:sticky lg:top-24">
          <p className="text-sm font-medium">خلاصه سفارش</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">جمع جزء</span>
              <span className="tabular-nums">{formatToman(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">ارسال (تخمینی)</span>
              <span className="tabular-nums">{formatToman(shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between gap-3 font-medium">
              <span>مبلغ قابل پرداخت</span>
              <span className="tabular-nums">{formatToman(total)}</span>
            </div>
          </div>
          <Button className="w-full" onClick={() => router.push("/examples/ecommerce/checkout")}>
            ادامه تسویه
          </Button>
          <Button
            variant="outline"
            className="w-full"
            nativeButton={false}
            render={<Link href="/examples/ecommerce" />}
          >
            ادامه خرید
          </Button>
        </aside>
      </div>
    </div>
  )
}
