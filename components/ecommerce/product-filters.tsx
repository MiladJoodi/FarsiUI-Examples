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
import { formatPersianNumber } from "@/lib/digits"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

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

const PRICE_STEP = 50_000

const PRICE_PRESETS: {
  id: string
  label: string
  range: [number, number]
}[] = [
  { id: "all", label: "همه", range: [PRICE_MIN, PRICE_MAX] },
  { id: "under1m", label: "تا ۱م", range: [PRICE_MIN, 1_000_000] },
  {
    id: "1m-3m",
    label: "۱–۳م",
    range: [1_000_000, 3_000_000],
  },
  {
    id: "3m-max",
    label: "۳–۵م",
    range: [3_000_000, PRICE_MAX],
  },
]

function activePricePresetId(range: [number, number]) {
  return (
    PRICE_PRESETS.find(
      (preset) => preset.range[0] === range[0] && preset.range[1] === range[1]
    )?.id ?? "custom"
  )
}

function clampPriceRange(raw: number[]): [number, number] {
  const a = Math.min(PRICE_MAX, Math.max(PRICE_MIN, raw[0] ?? PRICE_MIN))
  const b = Math.min(PRICE_MAX, Math.max(PRICE_MIN, raw[1] ?? PRICE_MAX))
  return a <= b ? [a, b] : [b, a]
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
    <aside className="ecom-filters hidden w-56 shrink-0 lg:block xl:w-64">
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
  const activePreset = activePricePresetId(value.priceRange)

  function toggleBrand(brand: string) {
    const exists = value.brands.includes(brand)
    onChange({
      ...value,
      brands: exists
        ? value.brands.filter((b) => b !== brand)
        : [...value.brands, brand],
    })
  }

  function setPriceRange(next: [number, number]) {
    onChange({ ...value, priceRange: next })
  }

  return (
    <div className="space-y-5">
      {showCount ? (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">فیلترها</p>
          <p className="text-xs tracking-normal text-muted-foreground">
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

      <section className="ecom-price-filter space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">بازه قیمت</p>
          {activePreset === "custom" ? (
            <button
              type="button"
              className="text-[0.65rem] font-medium text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}
            >
              بازنشانی
            </button>
          ) : null}
        </div>

        <div className="ecom-price-display grid grid-cols-2 gap-2">
          <div className="rounded-lg border bg-muted/25 px-2.5 py-2">
            <p className="text-[0.65rem] text-muted-foreground">از</p>
            <p className="ecom-num mt-0.5 text-xs font-semibold leading-snug">
              {formatToman(value.priceRange[0])}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/25 px-2.5 py-2">
            <p className="text-[0.65rem] text-muted-foreground">تا</p>
            <p className="ecom-num mt-0.5 text-xs font-semibold leading-snug">
              {formatToman(value.priceRange[1])}
            </p>
          </div>
        </div>

        <Slider
          className="ecom-price-slider px-1"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={[value.priceRange[0], value.priceRange[1]]}
          onValueChange={(next) => {
            if (!Array.isArray(next) || next.length < 2) return
            setPriceRange(clampPriceRange(next))
          }}
          aria-label="بازه قیمت"
        />

        <div className="ecom-num flex items-center justify-between text-[0.65rem] text-muted-foreground">
          <span>{formatToman(PRICE_MIN)}</span>
          <span>{formatToman(PRICE_MAX)}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const selected = activePreset === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPriceRange([...preset.range])}
                className={
                  selected
                    ? "rounded-full bg-foreground px-2.5 py-1 text-[0.68rem] font-semibold text-background"
                    : "rounded-full border px-2.5 py-1 text-[0.68rem] font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }
              >
                {preset.label}
              </button>
            )
          })}
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
                : `از ${formatPersianNumber(rating, { useGrouping: false })} به بالا`}
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
