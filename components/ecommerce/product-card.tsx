import Link from "next/link"
import { StarIcon } from "lucide-react"

import { formatCount, formatToman } from "@/lib/format"
import {
  getDiscountPercent,
  type Product,
} from "@/lib/mock/ecommerce"
import { toPersianDigits } from "@/lib/digits"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ProductThumb({
  product,
  className,
}: {
  product: Product
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-muted",
        className
      )}
      style={{ backgroundColor: product.accent }}
      aria-hidden
    >
      <span className="text-3xl font-semibold tracking-tight text-foreground/70">
        {product.name.slice(0, 1)}
      </span>
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const discount = getDiscountPercent(product)
  const outOfStock = product.stock <= 0

  return (
    <article className="group flex h-full min-w-0 flex-col gap-3">
      <Link
        href={`/examples/ecommerce/products/${product.id}`}
        className="relative block overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ProductThumb product={product} />
        {discount > 0 ? (
          <Badge className="absolute top-2 start-2 tabular-nums">
            ٪{toPersianDigits(discount)}
          </Badge>
        ) : null}
        {outOfStock ? (
          <Badge variant="secondary" className="absolute top-2 end-2">
            ناموجود
          </Badge>
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="min-w-0 space-y-1">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <Link
            href={`/examples/ecommerce/products/${product.id}`}
            className="line-clamp-2 text-sm font-medium leading-snug outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {product.name}
          </Link>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 tabular-nums">
            <StarIcon className="size-3.5 fill-current text-foreground" />
            {toPersianDigits(product.rating.toFixed(1))}
          </span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">
            {formatCount(product.reviewCount)} نظر
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-semibold tabular-nums">
            {formatToman(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-xs text-muted-foreground line-through tabular-nums">
              {formatToman(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        <Button
          size="sm"
          className="w-full"
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
