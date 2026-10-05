"use client"

import * as React from "react"
import { SlidersHorizontalIcon } from "lucide-react"

import { formatCount, formatToman } from "@/lib/format"
import {
  brands,
  categoryLabels,
  PRICE_MAX,
  PRICE_MIN,
  type ProductCategory,
} from "@/lib/mock/ecommerce"
import { toPersianDigits } from "@/lib/digits"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"

export type CatalogFiltersState = {
  category: ProductCategory | "all"
  brands: string[]
  priceRange: [number, number]
  minRating: number
  inStockOnly: boolean
}

export const defaultFilters: CatalogFiltersState = {
  category: "all",
  brands: [],
  priceRange: [PRICE_MIN, PRICE_MAX],
  minRating: 0,
  inStockOnly: false,
}

export function FiltersSidebar({
  value,
  onChange,
  resultCount,
}: {
  value: CatalogFiltersState
  onChange: (next: CatalogFiltersState) => void
  resultCount: number
}) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
      <FiltersPanel
        value={value}
        onChange={onChange}
        resultCount={resultCount}
        showCount
      />
    </aside>
  )
}

export function FiltersSheetButton({
  value,
  onChange,
  resultCount,
}: {
  value: CatalogFiltersState
  onChange: (next: CatalogFiltersState) => void
  resultCount: number
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden"
        aria-label="باز کردن فیلترها"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontalIcon className="size-4" />
        فیلترها
      </Button>
      <SheetContent side="right" className="w-[min(22rem,100%)] overflow-y-auto p-0">
        <SheetHeader className="border-b p-4 text-start">
          <SheetTitle>فیلتر محصولات</SheetTitle>
          <SheetDescription>
            {formatCount(resultCount)} نتیجه
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <FiltersPanel
            value={value}
            onChange={onChange}
            resultCount={resultCount}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function FiltersPanel({
  value,
  onChange,
  resultCount,
  showCount,
}: {
  value: CatalogFiltersState
  onChange: (next: CatalogFiltersState) => void
  resultCount: number
  showCount?: boolean
}) {
  const categories = Object.entries(categoryLabels) as [
    ProductCategory,
    string,
  ][]

  function toggleBrand(brand: string) {
    const exists = value.brands.includes(brand)
    onChange({
      ...value,
      brands: exists
        ? value.brands.filter((b) => b !== brand)
        : [...value.brands, brand],
    })
  }

  return (
    <div className="space-y-5">
      {showCount ? (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">فیلترها</p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {formatCount(resultCount)} کالا
          </p>
        </div>
      ) : null}

      <section className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">دسته‌بندی</p>
        <RadioGroup
          value={value.category}
          onValueChange={(next) =>
            onChange({
              ...value,
              category: (next as ProductCategory | "all") ?? "all",
            })
          }
          className="gap-2"
        >
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <RadioGroupItem value="all" />
            همه کالاها
          </label>
          {categories.map(([id, label]) => (
            <label
              key={id}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <RadioGroupItem value={id} />
              {label}
            </label>
          ))}
        </RadioGroup>
      </section>

      <Separator />

      <section className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">بازه قیمت</p>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50_000}
          value={value.priceRange}
          onValueChange={(next) => {
            if (!Array.isArray(next) || next.length < 2) return
            onChange({
              ...value,
              priceRange: [next[0], next[1]] as [number, number],
            })
          }}
          aria-label="بازه قیمت"
        />
        <div className="flex justify-between gap-2 text-xs tabular-nums text-muted-foreground">
          <span>{formatToman(value.priceRange[0])}</span>
          <span>{formatToman(value.priceRange[1])}</span>
        </div>
      </section>

      <Separator />

      <section className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">برند</p>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Checkbox
                checked={value.brands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">حداقل امتیاز</p>
        <RadioGroup
          value={String(value.minRating)}
          onValueChange={(next) =>
            onChange({ ...value, minRating: Number(next ?? 0) })
          }
          className="gap-2"
        >
          {[0, 3, 4, 4.5].map((rating) => (
            <label
              key={rating}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <RadioGroupItem value={String(rating)} />
              {rating === 0
                ? "همه امتیازها"
                : `از ${toPersianDigits(rating)} به بالا`}
            </label>
          ))}
        </RadioGroup>
      </section>

      <Separator />

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <Checkbox
          checked={value.inStockOnly}
          onCheckedChange={(checked) =>
            onChange({ ...value, inStockOnly: checked === true })
          }
        />
        <span>فقط کالاهای موجود</span>
      </label>

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => onChange(defaultFilters)}
      >
        پاک کردن فیلترها
      </Button>
    </div>
  )
}
