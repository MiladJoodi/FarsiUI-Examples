"use client"

import * as React from "react"
import {
  PackageIcon,
  SearchIcon,
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
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
    <div className="space-y-5">
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button className="w-full shrink-0 sm:w-auto">افزودن محصول</Button>
        <InputGroup className="h-9 w-full min-w-0 flex-1 sm:max-w-md">
          <InputGroupAddon align="inline-start">
            <SearchIcon className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="جستجوی نام محصول…"
            aria-label="جستجوی محصولات"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="فیلتر دسته‌بندی"
      >
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

      {filtered.length === 0 ? (
        <Empty className="border border-dashed py-14">
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

  return (
    <Card className="overflow-hidden bg-card">
      <div className={`flex h-24 items-end px-4 pb-3 ${product.tone}`}>
        <span className="text-sm font-medium">{product.category}</span>
      </div>
      <CardHeader className="pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <CardTitle className="leading-snug">{product.name}</CardTitle>
            <CardDescription>{formatToman(product.price)}</CardDescription>
          </div>
          <EntityActionsMenu label={`عملیات محصول ${product.name}`}>
            <DropdownMenuItem>ویرایش</DropdownMenuItem>
            <DropdownMenuItem>به‌روزرسانی موجودی</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">حذف</DropdownMenuItem>
          </EntityActionsMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <ProductStatusBadge status={product.status} />
          <span className="text-xs text-muted-foreground">
            فروش: {formatCount(product.sold)}
          </span>
        </div>
        <Progress value={stockPercent} className="gap-2">
          <div className="flex w-full items-center justify-between gap-2 text-xs">
            <ProgressLabel>
              موجودی {toPersianDigits(product.stock)} از{" "}
              {toPersianDigits(product.maxStock)}
            </ProgressLabel>
            <ProgressValue />
          </div>
        </Progress>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          جزئیات
        </Button>
      </CardFooter>
    </Card>
  )
}
