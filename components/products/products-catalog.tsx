"use client"

import * as React from "react"
import {
  PackageIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { formatCount, formatToman } from "@/lib/format"
import { toPersianDigits } from "@/lib/digits"
import {
  productCategories,
  products,
  type Product,
} from "@/lib/mock/products"
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu"
import { SearchField } from "@/components/shared/search-field"
import { ProductStatusBadge } from "@/components/shared/status-badges"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

export function ProductsCatalog() {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<string>("همه")

  const lowStock = products.filter((p) => p.status === "کم‌موجود").length

  const filtered = products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.includes(query) ||
      product.category.includes(query)
    const matchesCategory =
      category === "همه" || product.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <div className="space-y-4">
      {lowStock > 0 ? (
        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>
            {toPersianDigits(lowStock)} محصول موجودی پایینی دارد
          </AlertTitle>
          <AlertDescription>
            قبل از اتمام موجودی، تأمین مجدد را در اولویت قرار دهید.
          </AlertDescription>
        </Alert>
      ) : null}

      {/* RTL: start (راست) = افزودن + فیلترها · end (چپ) = جستجو */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="اقدامات و فیلتر دسته‌بندی"
        >
          <Button size="sm" className="shrink-0">
            افزودن محصول
          </Button>
          {productCategories.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={category === item ? "default" : "outline"}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        <SearchField
          wrapperClassName="sm:max-w-xs"
          placeholder="جستجوی نام محصول…"
          aria-label="جستجوی محصولات"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Empty className="border border-dashed py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageIcon />
            </EmptyMedia>
            <EmptyTitle>محصولی یافت نشد</EmptyTitle>
            <EmptyDescription>
              دسته یا عبارت جستجو را تغییر دهید.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const stockPercent = Math.round((product.stock / product.maxStock) * 100)
  const initial = product.name.trim().charAt(0)

  return (
    <Card size="sm" className="gap-3 overflow-hidden bg-card py-0">
      <div
        className="relative flex aspect-[16/9] items-center justify-center bg-muted/60"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-foreground)_0%,transparent_68%)] opacity-[0.04]" />
        <span className="relative flex size-11 items-center justify-center rounded-xl border border-border/70 bg-background/80 text-base font-semibold text-muted-foreground shadow-xs">
          {initial}
        </span>
        <span className="absolute start-2.5 bottom-2 rounded-md border border-border/60 bg-background/90 px-1.5 py-0.5 text-[0.65rem] text-muted-foreground backdrop-blur-sm">
          {product.category}
        </span>
      </div>
      <CardHeader className="px-3 pt-0 pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            <CardTitle className="text-sm leading-snug">{product.name}</CardTitle>
            <CardDescription className="tracking-normal whitespace-nowrap">
              {formatToman(product.price)}
            </CardDescription>
          </div>
          <EntityActionsMenu label={`عملیات محصول ${product.name}`}>
            <DropdownMenuItem>ویرایش</DropdownMenuItem>
            <DropdownMenuItem>به‌روزرسانی موجودی</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">حذف</DropdownMenuItem>
          </EntityActionsMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-3">
        <div className="flex items-center justify-between gap-2">
          <ProductStatusBadge status={product.status} />
          <span className="text-xs tracking-normal text-muted-foreground">
            فروش: {formatCount(product.sold)}
          </span>
        </div>
        <Progress value={stockPercent} className="gap-1.5">
          <div className="flex w-full items-center justify-between gap-2 text-[0.7rem] tracking-normal">
            <ProgressLabel>
              موجودی {toPersianDigits(product.stock)} از{" "}
              {toPersianDigits(product.maxStock)}
            </ProgressLabel>
            <ProgressValue />
          </div>
        </Progress>
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent px-3 pt-2 pb-3">
        <Button variant="outline" size="sm" className="h-8 w-full">
          جزئیات
        </Button>
      </CardFooter>
    </Card>
  )
}
