import Link from "next/link"
import { ImageIcon, StarIcon } from "lucide-react"

import { formatPersianNumber } from "@/lib/digits"
import { formatCount, formatPercent, formatToman } from "@/lib/format"
import {
  categoryLabels,
  getDiscountPercent,
  type Product,
} from "@/lib/mock/ecommerce"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ProductWireframeMedia({
  className,
  label,
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-muted/45",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklch, var(--border) 90%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--border) 90%, transparent) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative mx-4 flex w-full max-w-[72%] flex-col items-center rounded-lg border border-dashed border-muted-foreground/30 bg-background/70 px-4 py-5 shadow-xs">
        <ImageIcon className="size-8 text-muted-foreground/75 stroke-[1.25]" />
        {label ? (
          <span className="mt-2 text-center text-[0.65rem] font-medium tracking-normal text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function ProductThumb({
  product,
  className,
}: {
  product: Product
  className?: string
}) {
  return (
    <ProductWireframeMedia
      className={cn("aspect-square rounded-none border-0", className)}
      label={categoryLabels[product.category]}
    />
  )
}

export function ProductCard({ product }: { product: Product }) {
  const discount = getDiscountPercent(product)
  const outOfStock = product.stock <= 0

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow hover:shadow-sm">
      <Link
        href={`/examples/ecommerce/products/${product.id}`}
        className="relative block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ProductThumb product={product} />
        {discount > 0 ? (
          <Badge className="absolute top-2 start-2 tracking-normal shadow-xs">
            {formatPercent(discount)}
          </Badge>
        ) : null}
        {outOfStock ? (
          <Badge variant="secondary" className="absolute top-2 end-2 shadow-xs">
            ناموجود
          </Badge>
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 border-t p-3">
        <div className="min-w-0 space-y-1">
          <p className="text-[0.65rem] font-medium tracking-normal text-muted-foreground">
            {product.brand}
          </p>
          <Link
            href={`/examples/ecommerce/products/${product.id}`}
            className="line-clamp-2 text-sm font-semibold leading-snug outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-semibold tracking-normal whitespace-nowrap">
            {formatToman(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-xs tracking-normal text-muted-foreground line-through whitespace-nowrap">
              {formatToman(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs tracking-normal text-muted-foreground">
          <span className="inline-flex items-center gap-1 text-foreground">
            <StarIcon className="size-3.5 fill-current" />
            {formatPersianNumber(product.rating, { useGrouping: false })}
          </span>
          <span aria-hidden className="text-border">
            ·
          </span>
          <span>{formatCount(product.reviewCount)} نظر</span>
        </div>

        <Button
          size="sm"
          className="mt-auto w-full"
          variant={outOfStock ? "outline" : "default"}
          nativeButton={false}
          render={
            <Link href={`/examples/ecommerce/products/${product.id}`} />
          }
        >
          {outOfStock ? "مشاهده جزئیات" : "مشاهده و خرید"}
        </Button>
      </div>
    </article>
  )
}
