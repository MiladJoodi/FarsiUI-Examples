"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { formatCount } from "@/lib/format"
import {
  categoryLabels,
  products,
  type ProductCategory,
} from "@/lib/mock/ecommerce"
import { ProductCard } from "@/components/ecommerce/product-card"
import {
  defaultFilters,
  FiltersSheetButton,
  FiltersSidebar,
  type CatalogFiltersState,
} from "@/components/ecommerce/product-filters"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "discount"

function resolveCategory(
  param: string | null
): ProductCategory | "all" {
  if (
    param &&
    Object.prototype.hasOwnProperty.call(categoryLabels, param)
  ) {
    return param as ProductCategory
  }
  return "all"
}

export function CatalogView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = (searchParams.get("q") ?? "").trim()
  const category = resolveCategory(searchParams.get("category"))

  const [filters, setFilters] = React.useState<CatalogFiltersState>({
    ...defaultFilters,
    category,
  })
  const [sort, setSort] = React.useState<SortKey>("featured")

  const activeFilters: CatalogFiltersState = {
    ...filters,
    category,
  }

  function handleFiltersChange(next: CatalogFiltersState) {
    setFilters(next)
    const params = new URLSearchParams(searchParams.toString())
    if (next.category === "all") params.delete("category")
    else params.set("category", next.category)
    const qs = params.toString()
    router.replace(qs ? `/examples/ecommerce?${qs}` : "/examples/ecommerce")
  }

  const filtered = products
    .filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.shortDescription}`
        if (!hay.includes(q)) return false
      }
      if (activeFilters.category !== "all" && p.category !== activeFilters.category) {
        return false
      }
      if (
        activeFilters.brands.length &&
        !activeFilters.brands.includes(p.brand)
      ) {
        return false
      }
      if (
        p.price < activeFilters.priceRange[0] ||
        p.price > activeFilters.priceRange[1]
      ) {
        return false
      }
      if (p.rating < activeFilters.minRating) return false
      if (activeFilters.inStockOnly && p.stock <= 0) return false
      return true
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "discount": {
          const da = a.compareAtPrice ? a.compareAtPrice - a.price : 0
          const db = b.compareAtPrice ? b.compareAtPrice - b.price : 0
          return db - da
        }
        default:
          return 0
      }
    })

  const title =
    activeFilters.category === "all"
      ? "منتخب اتلیه"
      : categoryLabels[activeFilters.category]

  const showHero = !q && activeFilters.category === "all"

  return (
    <div>
      {showHero ? (
        <section className="ecom-hero" aria-label="پیشنهاد ویژه">
          <div>
            <span className="ecom-hero-kicker">
              <span aria-hidden>●</span>
              پیشنهاد هفته
            </span>
            <h2>خرید با سلیقه، نه فقط لیست کالا</h2>
            <p>
              اتلیهٔ نورا منتخب الکترونیک، پوشاک و خانه را مثل یک ویترین سردبیری
              چیده است — فیلتر کن، مقایسه کن، سریع بخر.
            </p>
            <div className="ecom-hero-actions">
              <Button
                className="ecom-hero-cta"
                nativeButton={false}
                render={
                  <Link href="/examples/ecommerce?category=electronics" />
                }
              >
                الکترونیک منتخب
              </Button>
              <Button
                className="ecom-hero-ghost"
                variant="outline"
                nativeButton={false}
                render={<Link href="/examples/ecommerce?category=home" />}
              >
                خانه و آشپزخانه
              </Button>
            </div>
          </div>
          <div className="ecom-hero-stage" aria-hidden>
            <div className="ecom-hero-orb" />
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <FiltersSidebar
          value={activeFilters}
          onChange={handleFiltersChange}
          resultCount={filtered.length}
        />

        <div className="min-w-0 flex-1 space-y-4">
          <div className="ecom-toolbar">
            <div className="min-w-0">
              <h1>{title}</h1>
              <p className="ecom-num">
                {q
                  ? `نتایج «${q}» · ${formatCount(filtered.length)} کالا`
                  : `${formatCount(filtered.length)} کالا در اتلیه`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FiltersSheetButton
                value={activeFilters}
                onChange={handleFiltersChange}
                resultCount={filtered.length}
              />
              <Select
                value={sort}
                onValueChange={(v) => setSort((v as SortKey) ?? "featured")}
                items={{
                  featured: "پیشنهادی",
                  "price-asc": "ارزان‌ترین",
                  "price-desc": "گران‌ترین",
                  rating: "بالاترین امتیاز",
                  discount: "بیشترین تخفیف",
                }}
              >
                <SelectTrigger
                  className="w-full rounded-full sm:w-[11.5rem]"
                  aria-label="مرتب‌سازی"
                >
                  <SelectValue placeholder="مرتب‌سازی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">پیشنهادی</SelectItem>
                  <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
                  <SelectItem value="price-desc">گران‌ترین</SelectItem>
                  <SelectItem value="rating">بالاترین امتیاز</SelectItem>
                  <SelectItem value="discount">بیشترین تخفیف</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="ecom-empty">
              <p>محصولی پیدا نشد</p>
              <p>فیلترها یا عبارت جستجو را تغییر دهید.</p>
            </div>
          ) : (
            <div className="ecom-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
