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
  swatchForColor,
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
    <div className="ecom-detail space-y-6">
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
        <div className="ecom-detail-gallery space-y-3">
          <ProductThumb
            product={product}
            className="ecom-detail-media aspect-4/3 sm:aspect-square"
          />
          <div className="ecom-detail-thumbs grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <ProductWireframeMedia
                key={i}
                category={product.category}
                className={cn(
                  "aspect-square overflow-hidden",
                  i === 0 && "ecom-thumb-active"
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

          <dl className="ecom-detail-stats grid grid-cols-3 divide-x divide-x-reverse overflow-hidden text-center text-xs">
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

          <div className="ecom-detail-price rounded-xl border p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="ecom-num text-2xl font-semibold tracking-normal whitespace-nowrap">
                {formatToman(product.price)}
              </span>
              {product.compareAtPrice ? (
                <span className="ecom-num text-sm tracking-normal text-muted-foreground line-through whitespace-nowrap">
                  {formatToman(product.compareAtPrice)}
                </span>
              ) : null}
              {discount > 0 ? (
                <Badge className="tracking-normal">
                  {formatPercent(discount)}
                </Badge>
              ) : null}
            </div>
            {!outOfStock ? (
              <p className="mt-2 text-xs tracking-normal text-muted-foreground">
                موجود در انبار — ارسال معمولاً ۱ تا ۳ روز کاری
              </p>
            ) : null}
          </div>

          {product.colors?.length ? (
            <div className="ecom-color-field space-y-2.5">
              <p className="text-sm font-medium">
                رنگ: <span className="text-muted-foreground">{color}</span>
              </p>
              <div
                className="ecom-color-swatches"
                role="radiogroup"
                aria-label="انتخاب رنگ"
              >
                {product.colors.map((c) => {
                  const selected = color === c
                  const swatch = swatchForColor(c)
                  const light = ["سفید", "کرم", "سفید مات", "خاکستری روشن"].includes(
                    c
                  )
                  return (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={c}
                      title={c}
                      className={cn(
                        "ecom-color-swatch",
                        selected && "is-selected",
                        light && "is-light"
                      )}
                      style={{ "--ecom-swatch": swatch } as React.CSSProperties}
                      onClick={() => setColor(c)}
                    >
                      <span className="ecom-color-dot" aria-hidden />
                      <span className="ecom-color-name">{c}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="ecom-qty inline-flex items-center"
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
              <span className="ecom-num min-w-8 text-center text-sm tracking-normal">
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
              className="ecom-add-btn min-w-40 flex-1 sm:flex-none"
              disabled={outOfStock}
              onClick={handleAdd}
            >
              {outOfStock ? "ناموجود" : "افزودن به سبد"}
            </Button>
          </div>

          <Separator />

          <Tabs defaultValue="desc" className="ecom-detail-tabs">
            <TabsList variant="line" className="ecom-tabs-list w-full justify-start">
              <TabsTrigger value="desc" className="ecom-tabs-trigger">
                توضیحات
              </TabsTrigger>
              <TabsTrigger value="specs" className="ecom-tabs-trigger">
                مشخصات
              </TabsTrigger>
            </TabsList>
            <TabsContent value="desc" className="ecom-tabs-panel">
              {product.description.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </TabsContent>
            <TabsContent value="specs" className="ecom-tabs-panel">
              <dl className="ecom-specs">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="ecom-spec-row">
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
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
