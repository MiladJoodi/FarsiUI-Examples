import Link from "next/link"
import type { CSSProperties } from "react"
import { StarIcon } from "lucide-react"

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
  accent,
  category,
}: {
  className?: string
  label?: string
  accent?: string
  category?: Product["category"]
}) {
  const kind = category ?? "electronics"
  const catVar = category
    ? (`var(--ecom-cat-${category})` as string)
    : undefined

  return (
    <div
      className={cn("ecom-media", className)}
      data-kind={kind}
      aria-hidden
      style={
        {
          "--ecom-product": accent ?? catVar ?? "var(--ecom-accent)",
        } as CSSProperties
      }
    >
      <div className="ecom-media-stage" />
      <div className="ecom-media-glow" />
      <div className="ecom-media-grain" />
      <div className="ecom-media-orbit" />
      <div className="ecom-media-object">
        <span className="ecom-media-shell" />
        <span className="ecom-media-face" />
        <span className="ecom-media-spec" />
        <span className="ecom-media-mark" />
      </div>
      <div className="ecom-media-pedestal" />
      {label ? <span className="ecom-media-label">{label}</span> : null}
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
      className={className}
      label={categoryLabels[product.category]}
      category={product.category}
    />
  )
}

export function ProductCard({ product }: { product: Product }) {
  const discount = getDiscountPercent(product)
  const outOfStock = product.stock <= 0

  return (
    <article className="ecom-card group">
      <Link
        href={`/examples/ecommerce/products/${product.id}`}
        className="relative block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ProductThumb product={product} />
        {discount > 0 ? (
          <Badge className="ecom-badge-sale ecom-num">
            {formatPercent(discount)}
          </Badge>
        ) : null}
        {outOfStock ? (
          <Badge className="ecom-badge-out">ناموجود</Badge>
        ) : null}
      </Link>

      <div className="ecom-card-body">
        <div className="min-w-0 space-y-1">
          <p className="ecom-card-brand">{product.brand}</p>
          <Link
            href={`/examples/ecommerce/products/${product.id}`}
            className="ecom-card-title outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {product.name}
          </Link>
        </div>

        <div className="ecom-card-price ecom-num">
          <strong>{formatToman(product.price)}</strong>
          {product.compareAtPrice ? (
            <s>{formatToman(product.compareAtPrice)}</s>
          ) : null}
        </div>

        <div className="ecom-card-meta ecom-num">
          <span className="star">
            <StarIcon className="size-3.5 fill-current" />
            {formatPersianNumber(product.rating, { useGrouping: false })}
          </span>
          <span aria-hidden>·</span>
          <span>{formatCount(product.reviewCount)} نظر</span>
        </div>

        <Button
          size="sm"
          className="ecom-card-cta"
          data-outline={outOfStock ? "true" : "false"}
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
