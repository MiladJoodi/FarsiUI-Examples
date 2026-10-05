"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { MenuIcon, SearchIcon } from "lucide-react"

import {
  blogName,
  blogTagline,
  categories,
} from "@/lib/mock/blog"
import { DesignSystemPicker } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

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
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="relative mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2">
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

            <nav
              aria-label="موضوعات"
              className="ms-1 hidden items-center gap-0.5 xl:flex"
            >
              {categories.map((cat) => {
                const href = `${BLOG_BASE}/categories/${cat.slug}`
                const active = pathname === href
                return (
                  <Button
                    key={cat.id}
                    size="sm"
                    variant="ghost"
                    nativeButton={false}
                    render={<Link href={href} />}
                    className={cn(active && "bg-muted")}
                  >
                    {cat.name}
                  </Button>
                )
              })}
            </nav>
          </div>

          <div className="pointer-events-none absolute inset-x-0 flex justify-center px-2">
            <div className="pointer-events-auto max-w-[min(100%,16rem)] sm:max-w-none">
              <DesignSystemPicker />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-1">
            <form
              onSubmit={submitSearch}
              className="hidden min-w-0 max-w-[11rem] flex-1 lg:block xl:max-w-xs"
            >
              <InputGroup className="h-8">
                <InputGroupAddon align="inline-start">
                  <SearchIcon className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="جستجوی مطلب…"
                  aria-label="جستجوی مطلب"
                  value={query}
                  onChange={(e) => setQuery(e.target.value ?? "")}
                />
              </InputGroup>
            </form>
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-label="باز کردن منو"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-[min(20rem,100%)]">
          <SheetHeader className="text-start">
            <SheetTitle>{blogName}</SheetTitle>
            <SheetDescription>{blogTagline}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-6">
            <form onSubmit={submitSearch}>
              <InputGroup className="h-9">
                <InputGroupAddon align="inline-start">
                  <SearchIcon className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="جستجوی مطلب…"
                  aria-label="جستجوی مطلب"
                  value={query}
                  onChange={(e) => setQuery(e.target.value ?? "")}
                />
              </InputGroup>
            </form>
            <nav className="flex flex-col gap-1" aria-label="موضوعات موبایل">
              <Button
                variant="ghost"
                className="justify-start"
                nativeButton={false}
                render={<Link href={BLOG_BASE} />}
                onClick={() => setMenuOpen(false)}
              >
                همه مطالب
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant="ghost"
                  className="justify-start"
                  nativeButton={false}
                  render={
                    <Link href={`${BLOG_BASE}/categories/${cat.slug}`} />
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.name}
                </Button>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </div>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="space-y-1">
            <p className="text-sm font-semibold">{blogName}</p>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              {blogTagline}
            </p>
          </div>
          <nav
            aria-label="پاورقی"
            className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"
          >
            <Link href={BLOG_BASE} className="hover:text-foreground">
              صفحهٔ اصلی
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${BLOG_BASE}/categories/${cat.slug}`}
                className="hover:text-foreground"
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
