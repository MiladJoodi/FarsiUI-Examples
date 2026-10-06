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

function FarsiUICredit({ className }: { className?: string }) {
  return (
    <a
      href="https://farsiui.ir"
      target="_blank"
      rel="noopener noreferrer"
      className={cn("blog-credit", className)}
      title="ساخته‌شده با FarsiUI"
    >
      <span className="blog-credit-prefix">ساخته‌شده با</span>
      <strong>FarsiUI</strong>
    </a>
  )
}

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

  const isHome = pathname === BLOG_BASE && !urlQuery

  return (
    <div className="blog-page">
      <ExampleHeaderChrome
        innerClassName="max-w-[68rem]"
        className="blog-chrome"
        start={
          <Link
            href={BLOG_BASE}
            className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <p className="truncate text-sm font-bold tracking-tight">{blogName}</p>
            <p className="hidden truncate text-[0.65rem] text-[var(--blog-mute)] sm:block">
              نشریهٔ طراحی محصول
            </p>
          </Link>
        }
        end={
          <>
            <FarsiUICredit className="hidden sm:inline-flex" />
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
            <FarsiUICredit />
          </div>
        </SheetContent>
      </Sheet>

      <div className="blog-stage">
        <header
          className={cn("blog-masthead", !isHome && "blog-masthead-compact")}
        >
          <div className="blog-masthead-inner">
            <div>
              {isHome ? (
                <h1 className="blog-mark">{blogName}</h1>
              ) : (
                <p className="blog-mark">
                  <Link href={BLOG_BASE}>{blogName}</Link>
                </p>
              )}
              {isHome ? <p className="blog-deck">{blogTagline}</p> : null}
            </div>
            {isHome ? (
              <div className="blog-issue" aria-label="شماره نشریه">
                <strong>شمارهٔ ۱۲ · پاییز ۱۴۰۵</strong>
                <span>یادداشت‌های حاشیهٔ طراحی فارسی</span>
              </div>
            ) : null}
          </div>
        </header>

        <nav className="blog-topics" aria-label="موضوعات">
          <Link href={BLOG_BASE} data-active={pathname === BLOG_BASE && !urlQuery}>
            همه
          </Link>
          <span className="blog-topics-sep" aria-hidden />
          {categories.map((cat, i) => {
            const href = `${BLOG_BASE}/categories/${cat.slug}`
            return (
              <React.Fragment key={cat.id}>
                {i > 0 ? (
                  <span className="blog-topics-sep" aria-hidden />
                ) : null}
                <Link href={href} data-active={pathname === href}>
                  {cat.name}
                </Link>
              </React.Fragment>
            )
          })}
        </nav>

        {children}
      </div>

      <footer className="blog-footer">
        <div className="blog-footer-inner">
          <div>
            <p className="blog-footer-brand">{blogName}</p>
            <p className="blog-footer-note">
              {blogTagline}. این صفحه یک دموی UI است و محتوای واقعی منتشر
              نمی‌کند.
            </p>
          </div>
          <nav aria-label="پاورقی" className="blog-footer-nav">
            <Link href={BLOG_BASE}>صفحهٔ اصلی</Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${BLOG_BASE}/categories/${cat.slug}`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="blog-footer-credit-row sm:hidden">
          <FarsiUICredit />
        </div>
      </footer>
    </div>
  )
}
