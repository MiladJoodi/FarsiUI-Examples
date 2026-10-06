"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { ShoppingBagIcon, UserIcon } from "lucide-react"

import { formatCount } from "@/lib/format"
import {
  categoryLabels,
  storeName,
  storeTagline,
  type ProductCategory,
} from "@/lib/mock/ecommerce"
import { useCart } from "@/components/ecommerce/cart-context"
import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { SearchField } from "@/components/shared/search-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const categories = Object.entries(categoryLabels) as [
  ProductCategory,
  string,
][]

export function StoreHeader() {
  const { itemCount } = useCart()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get("q") ?? ""
  const activeCategory = searchParams.get("category")
  const [draftQuery, setDraftQuery] = React.useState<string | null>(null)
  const localQuery = draftQuery ?? urlQuery

  const isCatalog = pathname === "/examples/ecommerce"

  function pushCatalog(next: { q?: string; category?: string | null }) {
    const params = new URLSearchParams(searchParams.toString())
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q)
      else params.delete("q")
    }
    if (next.category !== undefined) {
      if (next.category) params.set("category", next.category)
      else params.delete("category")
    }
    const qs = params.toString()
    setDraftQuery(null)
    router.push(qs ? `/examples/ecommerce?${qs}` : "/examples/ecommerce")
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    pushCatalog({ q: localQuery.trim() })
  }

  return (
    <header className="ecom-header">
      <ExampleHeaderChrome
        className="static z-auto border-b-0 bg-transparent backdrop-blur-none"
        innerClassName="max-w-[92rem]"
        start={
          <Link
            href="/examples/ecommerce"
            className="ecom-brand rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="ecom-brand-mark" aria-hidden>
              ن
            </span>
            <span className="ecom-brand-text">
              <strong>{storeName}</strong>
              <span>{storeTagline}</span>
            </span>
          </Link>
        }
        end={
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="حساب کاربری (نمایشی)"
              type="button"
            >
              <UserIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              nativeButton={false}
              render={<Link href="/examples/ecommerce/cart" />}
              aria-label={
                itemCount > 0
                  ? `سبد خرید، ${formatCount(itemCount)} کالا`
                  : "سبد خرید"
              }
              className="relative"
            >
              <ShoppingBagIcon className="size-4" />
              {itemCount > 0 ? (
                <Badge className="ecom-cart-badge ecom-num">
                  {formatCount(itemCount)}
                </Badge>
              ) : null}
            </Button>
            <ModeToggle />
          </>
        }
      />

      <div className="ecom-search-wrap">
        <form onSubmit={handleSearchSubmit}>
          <SearchField
            wrapperClassName="w-full"
            placeholder="جستجو..."
            aria-label="جستجوی محصول"
            value={localQuery}
            onChange={(e) => setDraftQuery(e.target.value ?? "")}
          />
        </form>

        <nav aria-label="دسته‌بندی‌ها" className="ecom-cats">
          <button
            type="button"
            onClick={() => pushCatalog({ category: null })}
            data-active={isCatalog && !activeCategory ? "true" : "false"}
            className="ecom-cat"
          >
            همه
          </button>
          {categories.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => pushCatalog({ category: id })}
              data-active={
                isCatalog && activeCategory === id ? "true" : "false"
              }
              className="ecom-cat"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
