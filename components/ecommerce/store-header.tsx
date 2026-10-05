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
import { cn } from "@/lib/utils"

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
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <ExampleHeaderChrome
        className="static z-auto border-b-0 bg-transparent backdrop-blur-none"
        innerClassName="max-w-7xl"
        start={
          <Link
            href="/examples/ecommerce"
            className="min-w-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <p className="truncate text-sm font-semibold tracking-tight">
              {storeName}
            </p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {storeTagline}
            </p>
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
                <Badge className="absolute -top-1 -start-1 h-4 min-w-4 justify-center px-1 text-[0.6rem] tracking-normal">
                  {formatCount(itemCount)}
                </Badge>
              ) : null}
            </Button>
            <ModeToggle />
          </>
        }
      />

      <div className="mx-auto max-w-7xl space-y-2 px-4 pb-3 pt-0 sm:px-6">
        <form onSubmit={handleSearchSubmit} className="w-full">
          <SearchField
            wrapperClassName="w-full"
            placeholder="جستجوی محصول…"
            aria-label="جستجوی محصول"
            value={localQuery}
            onChange={(e) => setDraftQuery(e.target.value ?? "")}
          />
        </form>

        <nav
          aria-label="دسته‌بندی‌ها"
          className="-mx-1 flex gap-1 overflow-x-auto pb-0.5"
        >
          <button
            type="button"
            onClick={() => pushCatalog({ category: null })}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs transition-colors",
              isCatalog && !activeCategory
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            همه
          </button>
          {categories.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => pushCatalog({ category: id })}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs transition-colors",
                isCatalog && activeCategory === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
