"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { MenuIcon, SearchIcon } from "lucide-react"

import { blogName, blogTagline, categories } from "@/lib/mock/blog"
import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { SearchField } from "@/components/shared/search-field"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import "@/styles/blog.css"

const BLOG_BASE = "/examples/blog"

export function BlogShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get("q") ?? ""
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [query, setQuery] = React.useState(urlQuery)
  const [syncedUrlQuery, setSyncedUrlQuery] = React.useState(urlQuery)

  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery)
    setQuery(urlQuery)
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `${BLOG_BASE}?q=${encodeURIComponent(q)}` : BLOG_BASE)
    setMenuOpen(false)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <ExampleHeaderChrome
        innerClassName="max-w-5xl"
        className="border-foreground/8"
        start={
          <Link
            href={BLOG_BASE}
            className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <p className="truncate text-sm font-semibold tracking-tight">
              {blogName}
            </p>
            <p className="hidden truncate text-[0.65rem] text-muted-foreground sm:block">
              {blogTagline}
            </p>
          </Link>
        }
        end={
          <>
            <form
              onSubmit={submitSearch}
              className="hidden min-w-0 max-w-[11rem] flex-1 xl:block xl:max-w-[13rem]"
            >
              <SearchField
                className="h-8 text-sm"
                placeholder="جستجوی مطلب…"
                aria-label="جستجوی مطلب"
                value={query}
                onChange={(e) => setQuery(e.target.value ?? "")}
              />
            </form>
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-label="باز کردن منو"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon className="size-4" />
            </Button>
          </>
        }
      />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-[min(18rem,100%)]">
          <SheetHeader className="text-start">
            <SheetTitle>{blogName}</SheetTitle>
            <SheetDescription>{blogTagline}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-6">
            <form onSubmit={submitSearch} className="flex items-center gap-1.5">
              <SearchField
                className="h-8 min-w-0 flex-1 text-sm"
                placeholder="جستجو…"
                aria-label="جستجوی مطلب"
                value={query}
                onChange={(e) => setQuery(e.target.value ?? "")}
              />
              <Button
                type="submit"
                size="icon-sm"
                className="blog-btn blog-btn-primary shrink-0"
                aria-label="جستجو"
              >
                <SearchIcon className="size-3.5" />
              </Button>
            </form>
            <nav className="flex flex-col gap-0.5" aria-label="موضوعات موبایل">
              <Link
                href={BLOG_BASE}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex h-8 items-center truncate rounded-md px-2.5 text-sm whitespace-nowrap transition-colors",
                  pathname === BLOG_BASE
                    ? "bg-foreground/6 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-foreground/4 hover:text-foreground"
                )}
              >
                همه مطالب
              </Link>
              {categories.map((cat) => {
                const href = `${BLOG_BASE}/categories/${cat.slug}`
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex h-8 items-center truncate rounded-md px-2.5 text-sm whitespace-nowrap transition-colors",
                      pathname === href
                        ? "bg-foreground/6 font-medium text-foreground"
                        : "text-muted-foreground hover:bg-foreground/4 hover:text-foreground"
                    )}
                  >
                    {cat.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </div>

      <footer className="mt-auto border-t border-foreground/8 bg-muted/20 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold tracking-tight">{blogName}</p>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              {blogTagline}. این صفحه یک نمونهٔ UI است.
            </p>
          </div>
          <nav
            aria-label="پاورقی"
            className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"
          >
            <Link
              href={BLOG_BASE}
              className="transition-colors hover:text-foreground"
            >
              صفحهٔ اصلی
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${BLOG_BASE}/categories/${cat.slug}`}
                className="transition-colors hover:text-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
