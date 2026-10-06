"use client"

import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { formatCount } from "@/lib/format"
import {
  categoryLabels,
  products,
  type ProductCategory,
} from "@/lib/mock/ecommerce"
import { HeroBannerSlider } from "@/components/ecommerce/hero-banner-slider"
import { ProductCard } from "@/components/ecommerce/product-card"
import { ProductRail } from "@/components/ecommerce/product-rail"
import {
  defaultFilters,
  FiltersSheetButton,
  FiltersSidebar,
  type CatalogFiltersState,
} from "@/components/ecommerce/product-filters"
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

function applyFilters(
  list: typeof products,
  activeFilters: CatalogFiltersState,
  q: string,
  sort: SortKey
) {
  return list
    .filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.shortDescription}`
        if (!hay.includes(q)) return false
      }
      if (
        activeFilters.category !== "all" &&
        p.category !== activeFilters.category
      ) {
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
    if (next.category === category) return
    const params = new URLSearchParams(searchParams.toString())
    if (next.category === "all") params.delete("category")
    else params.set("category", next.category)
    const qs = params.toString()
    router.replace(qs ? `/examples/ecommerce?${qs}` : "/examples/ecommerce")
  }

  const filtered = applyFilters(products, activeFilters, q, sort)

  const title =
    activeFilters.category === "all"
      ? "همه کالاها"
      : categoryLabels[activeFilters.category]

  const showEditorial = !q && activeFilters.category === "all"

  const curated = React.useMemo(
    () => products.filter((p) => p.rating >= 4.5).slice(0, 8),
    []
  )

  return (
    <div className="ecom-catalog">
      {showEditorial ? (
        <>
          <HeroBannerSlider />
          <ProductRail
            title="منتخب سردبیری"
            subtitle="بالاترین امتیازها در فروشگاه"
            products={curated}
            autoPlay
          />
        </>
      ) : null}

      <div className="ecom-shop-layout">
        <FiltersSidebar
          value={activeFilters}
          onChange={handleFiltersChange}
          resultCount={filtered.length}
        />

        <div className="ecom-shop-main">
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
