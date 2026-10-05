"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { MinusIcon, PlusIcon, StarIcon } from "lucide-react"
import { toast } from "sonner"

import { formatCount, formatPercent, formatToman } from "@/lib/format"
import { formatPersianNumber, toPersianDigits } from "@/lib/digits"
import {
  categoryLabels,
  getDiscountPercent,
  type Product,
} from "@/lib/mock/ecommerce"
import { useCart } from "@/components/ecommerce/cart-context"
import {
  ProductThumb,
  ProductWireframeMedia,
} from "@/components/ecommerce/product-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function ProductDetailView({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem } = useCart()
  const [qty, setQty] = React.useState(1)
  const [color, setColor] = React.useState(product.colors?.[0] ?? "")
  const discount = getDiscountPercent(product)
  const outOfStock = product.stock <= 0
  const maxQty = Math.max(1, product.stock)

  function handleAdd() {
    if (outOfStock) return
    addItem(product.id, qty)
    toast.success("به سبد خرید اضافه شد", {
      description: product.name,
      action: {
        label: "مشاهده سبد",
        onClick: () => router.push("/examples/ecommerce/cart"),
      },
    })
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/examples/ecommerce" />}>
              فروشگاه
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link
                  href={`/examples/ecommerce?category=${product.category}`}
                />
              }
            >
              {categoryLabels[product.category]}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-3">
          <ProductThumb
            product={product}
            className="aspect-4/3 rounded-xl border border-border/70 sm:aspect-square"
          />
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <ProductWireframeMedia
                key={i}
                className={cn(
                  "aspect-square rounded-lg border border-border/70",
                  i === 0 && "ring-2 ring-primary/40 ring-offset-2"
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <Badge variant="outline" className="font-normal tracking-normal">
              {product.brand}
            </Badge>
            <h1 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
              {product.name}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>
          </div>

          <dl className="grid grid-cols-3 divide-x divide-x-reverse overflow-hidden rounded-xl border bg-muted/20 text-center text-xs">
            <div className="px-2 py-3">
              <dt className="sr-only">امتیاز</dt>
              <dd className="flex items-center justify-center gap-1 text-sm font-semibold tracking-normal text-foreground">
                <StarIcon className="size-4 fill-current" aria-hidden />
                {formatPersianNumber(product.rating, { useGrouping: false })}
              </dd>
              <dd className="mt-1 text-muted-foreground">امتیاز خریداران</dd>
            </div>
            <div className="px-2 py-3">
              <dt className="sr-only">تعداد نظر</dt>
              <dd className="text-sm font-semibold tracking-normal text-foreground">
                {formatCount(product.reviewCount)}
              </dd>
              <dd className="mt-1 text-muted-foreground">نظر ثبت‌شده</dd>
            </div>
            <div className="px-2 py-3">
              <dt className="sr-only">موجودی</dt>
              <dd className="text-sm font-semibold tracking-normal text-foreground">
                {outOfStock ? "۰" : formatCount(product.stock)}
              </dd>
              <dd className="mt-1 text-muted-foreground">
                {outOfStock ? "ناموجود" : "عدد موجود"}
              </dd>
            </div>
          </dl>

          <div className="rounded-xl border bg-card p-4 shadow-xs">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-semibold tracking-normal whitespace-nowrap">
                {formatToman(product.price)}
              </span>
              {product.compareAtPrice ? (
                <span className="text-sm tracking-normal text-muted-foreground line-through whitespace-nowrap">
                  {formatToman(product.compareAtPrice)}
                </span>
              ) : null}
              {discount > 0 ? (
                <Badge className="tracking-normal">{formatPercent(discount)}</Badge>
              ) : null}
            </div>
            {!outOfStock ? (
              <p className="mt-2 text-xs tracking-normal text-muted-foreground">
                موجود در انبار — ارسال معمولاً ۱ تا ۳ روز کاری
              </p>
            ) : null}
          </div>

          {product.colors?.length ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">رنگ: {color}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <Button
                    key={c}
                    type="button"
                    size="sm"
                    variant={color === c ? "default" : "outline"}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex items-center rounded-lg border"
              role="group"
              aria-label="تعداد"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="کاهش تعداد"
                disabled={outOfStock || qty <= 1}
                onClick={() => setQty((n) => Math.max(1, n - 1))}
              >
                <MinusIcon className="size-4" />
              </Button>
              <span className="min-w-8 text-center text-sm tracking-normal">
                {toPersianDigits(qty)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="افزایش تعداد"
                disabled={outOfStock || qty >= maxQty}
                onClick={() => setQty((n) => Math.min(maxQty, n + 1))}
              >
                <PlusIcon className="size-4" />
              </Button>
            </div>

            <Button
              className="min-w-40 flex-1 sm:flex-none"
              disabled={outOfStock}
              onClick={handleAdd}
            >
              {outOfStock ? "ناموجود" : "افزودن به سبد"}
            </Button>
          </div>

          <Separator />

          <Tabs defaultValue="desc">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="desc">توضیحات</TabsTrigger>
              <TabsTrigger value="specs">مشخصات</TabsTrigger>
            </TabsList>
            <TabsContent value="desc" className="pt-3 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </TabsContent>
            <TabsContent value="specs" className="pt-3">
              <dl className="space-y-2">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-4 border-b border-dashed py-2 text-sm last:border-0"
                  >
                    <dt className="text-muted-foreground">{spec.label}</dt>
                    <dd className="text-end font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
