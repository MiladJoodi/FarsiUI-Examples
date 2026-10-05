"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellIcon, ChevronRightIcon, MenuIcon, SearchIcon } from "lucide-react"

import {
  BRAND_NAME,
  BRAND_TAGLINE,
  DASHBOARD_BASE,
  getPageMeta,
  navItems,
} from "@/lib/navigation"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { DesignSystemPicker } from "@/components/design-system/design-system-picker"
import { useDesignSystemPreview } from "@/components/design-system/design-system-preview"
import { SearchField } from "@/components/shared/search-field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import "@/styles/taraz.css"

const PROFILE = {
  name: "نیما کاظمی",
  role: "مدیر مالی",
  initials: "ن‌ک",
  avatar: "/avatar/01.jpg",
} as const

function ProfileAvatar({ className }: { className?: string }) {
  return (
    <Avatar className={cn("size-10 shrink-0", className)}>
      <AvatarImage src={PROFILE.avatar} alt={PROFILE.name} />
      <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
        {PROFILE.initials}
      </AvatarFallback>
    </Avatar>
  )
}

function BrandMark({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn("taraz-brand-mark", `taraz-brand-mark--${size}`, className)}
    >
      فا
    </span>
  )
}

/** Showcase credit — makes it obvious this product UI was built with FarsiUI. */
function FarsiUICredit({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  return (
    <a
      href="https://farsiui.ir"
      target="_blank"
      rel="noopener noreferrer"
      className={cn("taraz-farsiui-credit", compact && "is-compact", className)}
      title="ساخته‌شده با FarsiUI"
    >
      {compact ? (
        <span className="taraz-farsiui-credit-mark" aria-hidden>
          Fu
        </span>
      ) : null}
      <span className="taraz-farsiui-credit-text">
        {compact ? null : (
          <span className="taraz-farsiui-credit-prefix">ساخته‌شده با</span>
        )}
        <strong>FarsiUI</strong>
      </span>
    </a>
  )
}

function HeaderSearchField({
  id,
  className,
  wrapperClassName,
}: {
  id: string
  className?: string
  wrapperClassName?: string
}) {
  return (
    <SearchField
      id={id}
      placeholder="جستجو…"
      aria-label="جستجو در تراز"
      wrapperClassName={cn("w-auto min-w-0", wrapperClassName)}
      className={cn("taraz-control text-base", className)}
    />
  )
}

function SidebarNav({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const pathname = usePathname()

  return (
    <nav aria-label="منوی اصلی" className="taraz-nav">
      {navItems.map((item) => {
        const active =
          item.href === DASHBOARD_BASE
            ? pathname === DASHBOARD_BASE
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            data-active={active}
            className="taraz-nav-link"
            title={collapsed ? item.title : undefined}
            aria-label={collapsed ? item.title : undefined}
          >
            <item.icon aria-hidden />
            <span className="taraz-sidebar-label">{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function TarazShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const meta = getPageMeta(pathname)
  const isHome = pathname === DASHBOARD_BASE
  const { designSystemId } = useDesignSystemPreview()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [period, setPeriod] = React.useState("today")
  const [collapsed, setCollapsed] = React.useState(false)

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem("taraz-sidebar-collapsed")
      if (stored === "1") setCollapsed(true)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem("taraz-sidebar-collapsed", next ? "1" : "0")
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return (
    <div className="taraz-page overflow-x-clip" data-ds={designSystemId}>
      <div className="taraz-shell">
        <aside
          className="taraz-sidebar"
          aria-label="ناوبری تراز"
          data-collapsed={collapsed ? "true" : "false"}
        >
          <div className="taraz-sidebar-brand">
            <Link
              href={DASHBOARD_BASE}
              className="taraz-sidebar-brand-link"
              title={BRAND_NAME}
            >
              <BrandMark size="lg" />
              <span className="taraz-sidebar-label">
                <strong>{BRAND_NAME}</strong>
                <span>{BRAND_TAGLINE}</span>
              </span>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="taraz-sidebar-toggle shrink-0"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "باز کردن منو" : "بستن منو"}
              aria-pressed={collapsed}
              title={collapsed ? "باز کردن منو" : "بستن منو"}
            >
              <ChevronRightIcon
                className={cn(
                  "size-4 transition-transform",
                  collapsed
                    ? "rtl:-rotate-180 rotate-0"
                    : "rtl:rotate-0 -rotate-180"
                )}
              />
            </Button>
          </div>

          <SidebarNav collapsed={collapsed} />

          <div className="taraz-sidebar-foot">
            <div
              className="flex items-center gap-3"
              title={collapsed ? `${PROFILE.name} · ${PROFILE.role}` : undefined}
            >
              <ProfileAvatar className="size-11" />
              <div className="taraz-sidebar-label min-w-0 leading-tight">
                <p className="taraz-body-text truncate font-semibold">
                  {PROFILE.name}
                </p>
                <p className="truncate text-sm text-[color:var(--tz-mute)]">
                  {PROFILE.role}
                </p>
              </div>
            </div>
            <FarsiUICredit
              compact={collapsed}
              className="taraz-sidebar-farsiui"
            />
          </div>
        </aside>

        <div className="taraz-main">
          <header className="taraz-topbar">
            {/* Centered design-system picker — mobile + desktop */}
            <div className="taraz-topbar-center">
              <DesignSystemPicker className="taraz-topbar-ds" />
            </div>

            <div className="taraz-topbar-start">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0 lg:hidden"
                      aria-label="باز کردن منو"
                    />
                  }
                >
                  <MenuIcon className="size-5" />
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="flex w-[min(20rem,100%)] flex-col p-0"
                >
                  <SheetHeader className="border-b px-4 py-4 text-start">
                    <SheetTitle className="flex items-center gap-3 text-base">
                      <BrandMark size="md" />
                      <span className="flex flex-col gap-0.5">
                        <span className="font-bold">{BRAND_NAME}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {BRAND_TAGLINE}
                        </span>
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="taraz-sheet-nav min-h-0 flex-1 overflow-y-auto p-3">
                    <SidebarNav onNavigate={() => setMobileOpen(false)} />
                  </div>

                  <div className="space-y-3 border-t p-4">
                    <HeaderSearchField
                      id="taraz-search-sheet"
                      wrapperClassName="w-full"
                    />
                    <Select
                      value={period}
                      onValueChange={(v) => v && setPeriod(v)}
                      items={{
                        today: "امروز",
                        "7d": "۷ روز",
                        month: "این ماه",
                      }}
                    >
                      <SelectTrigger
                        className="taraz-control w-full"
                        aria-label="بازه زمانی"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">امروز</SelectItem>
                        <SelectItem value="7d">۷ روز</SelectItem>
                        <SelectItem value="month">این ماه</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">ظاهر</span>
                      <ModeToggle />
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <ProfileAvatar className="size-11" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {PROFILE.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {PROFILE.role}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                        nativeButton={false}
                        render={
                          <Link
                            href={`${DASHBOARD_BASE}/settings`}
                            onClick={() => setMobileOpen(false)}
                          />
                        }
                      >
                        تنظیمات
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link
                href={DASHBOARD_BASE}
                className="taraz-topbar-brand flex min-w-0 items-center gap-2 lg:hidden"
              >
                <BrandMark size="sm" />
                <span className="taraz-topbar-brand-text min-w-0 truncate text-sm font-bold">
                  {isHome ? BRAND_NAME : meta.title}
                </span>
              </Link>

              <div className="hidden min-w-0 lg:block">
                {!isHome ? (
                  <div className="min-w-0">
                    <p className="taraz-title truncate">{meta.title}</p>
                    {meta.description ? (
                      <p className="taraz-muted truncate">
                        {meta.description}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="taraz-muted font-semibold">
                    خلاصه عملیات امروز
                  </p>
                )}
              </div>
            </div>

            <div className="taraz-topbar-end">
              <div className="taraz-topbar-actions hidden lg:flex">
                <Select
                  value={period}
                  onValueChange={(v) => v && setPeriod(v)}
                  items={{
                    today: "امروز",
                    "7d": "۷ روز",
                    month: "این ماه",
                  }}
                >
                  <SelectTrigger
                    className="taraz-control taraz-control-pill relative z-10 w-32"
                    aria-label="بازه زمانی"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="today">امروز</SelectItem>
                    <SelectItem value="7d">۷ روز</SelectItem>
                    <SelectItem value="month">این ماه</SelectItem>
                  </SelectContent>
                </Select>

                <HeaderSearchField
                  id="taraz-search-desktop"
                  wrapperClassName="relative z-10 w-52"
                />

                <div className="taraz-topbar-icons relative z-10">
                  <NotificationsMenu />
                  <ModeToggle />
                </div>
                <UserMenu />
              </div>

              <div className="taraz-topbar-mobile-actions flex shrink-0 items-center gap-1 lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9"
                        aria-label="جستجو"
                      />
                    }
                  >
                    <SearchIcon className="size-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[min(18rem,calc(100vw-2rem))] p-2"
                  >
                    <HeaderSearchField
                      id="taraz-search-mobile"
                      wrapperClassName="w-full"
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
                <NotificationsMenu />
              </div>
            </div>
          </header>

          {!isHome ? (
            <div className="taraz-mobile-pagehead lg:hidden">
              <h1 className="taraz-title">{meta.title}</h1>
              {meta.description ? (
                <p className="taraz-muted mt-1">{meta.description}</p>
              ) : null}
            </div>
          ) : null}

          <main className="taraz-body">{children}</main>
        </div>
      </div>
    </div>
  )
}

function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="اعلان‌ها"
            className="relative size-9 shrink-0"
          />
        }
      >
        <span className="relative grid size-4 place-items-center">
          <BellIcon className="size-4" />
          <span className="absolute -top-0.5 -end-0.5 size-1.5 rounded-full bg-[var(--tz-yellow)] ring-2 ring-[color:var(--tz-panel)]" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64 max-w-[calc(100vw-2rem)] text-base">
        <DropdownMenuLabel className="text-base">اعلان‌ها</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex-col items-start gap-0.5 py-2.5">
          <span>تسویه ملت هنوز تأیید نشده</span>
          <span className="text-sm text-muted-foreground">۱۰ دقیقه پیش</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex-col items-start gap-0.5 py-2.5">
          <span>مغایرت واریز شبا ثبت شد</span>
          <span className="text-sm text-muted-foreground">۱ ساعت پیش</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex-col items-start gap-0.5 py-2.5">
          <span>گزارش مهر آماده است</span>
          <span className="text-sm text-muted-foreground">دیروز</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative z-10 size-10 overflow-hidden rounded-full p-0"
            aria-label="منوی کاربر"
          />
        }
      >
        <ProfileAvatar className="size-9" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52 text-base">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <ProfileAvatar className="size-10" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-semibold">{PROFILE.name}</span>
              <span className="text-sm text-muted-foreground">
                {PROFILE.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={`${DASHBOARD_BASE}/settings`} />}>
          تنظیمات
        </DropdownMenuItem>
        <DropdownMenuItem>خروج</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
