"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react"

import { formatCount } from "@/lib/format"
import {
  categoryLabels,
  storeName,
  storeTagline,
  type ProductCategory,
} from "@/lib/mock/ecommerce"
import { useCart } from "@/components/ecommerce/cart-context"
import { DesignSystemPicker } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
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
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="relative flex items-center justify-between gap-3">
          <Link
            href="/examples/ecommerce"
            className="min-w-0 flex-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <p className="truncate text-sm font-semibold tracking-tight">
              {storeName}
            </p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {storeTagline}
            </p>
          </Link>

          <div className="pointer-events-none absolute inset-x-0 flex justify-center px-2">
            <div className="pointer-events-auto max-w-[min(100%,16rem)] sm:max-w-none">
              <DesignSystemPicker />
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden min-w-0 max-w-xs flex-1 justify-center lg:flex xl:max-w-md"
          >
            <InputGroup className="h-9 w-full">
              <InputGroupAddon align="inline-start">
                <SearchIcon className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="جستجوی محصول…"
                aria-label="جستجوی محصول"
                value={localQuery}
                onChange={(e) => setDraftQuery(e.target.value ?? "")}
              />
            </InputGroup>
          </form>

          <div className="flex flex-1 shrink-0 items-center justify-end gap-1">
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
                <Badge className="absolute -top-1 -start-1 h-4 min-w-4 justify-center px-1 text-[0.6rem] tabular-nums">
                  {formatCount(itemCount)}
                </Badge>
              ) : null}
            </Button>
            <ModeToggle />
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="md:hidden">
          <InputGroup className="h-9 w-full">
            <InputGroupAddon align="inline-start">
              <SearchIcon className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="جستجوی محصول…"
              aria-label="جستجوی محصول"
              value={localQuery}
              onChange={(e) => setDraftQuery(e.target.value ?? "")}
            />
          </InputGroup>
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
