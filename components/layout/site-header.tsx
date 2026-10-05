"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellIcon, SearchIcon } from "lucide-react"

import { DASHBOARD_BASE, getPageMeta } from "@/lib/navigation"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { DesignSystemPicker } from "@/components/design-system/design-system-picker"
import { SearchField } from "@/components/shared/search-field"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

function HeaderSearchField({
  id,
  className,
}: {
  id: string
  className?: string
}) {
  return (
    <SearchField
      id={id}
      placeholder="جستجو در پنل…"
      aria-label="جستجو در پنل"
      wrapperClassName={cn("w-auto", className)}
      className="h-8 text-sm"
    />
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const meta = getPageMeta(pathname)
  const isHome = pathname === DASHBOARD_BASE
  const showBreadcrumb = !isHome

  return (
    <header className="relative sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-backdrop-filter:bg-background/80 sm:gap-3 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <Separator orientation="vertical" className="me-1 hidden h-4 sm:block" />
        <div className="min-w-0">
          {showBreadcrumb ? (
            <Breadcrumb>
              <BreadcrumbList className="text-xs sm:text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href={DASHBOARD_BASE} />}>
                    داشبورد
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{meta.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 flex justify-center px-2">
        <div className="pointer-events-auto max-w-[min(100%,16rem)] sm:max-w-none">
          <DesignSystemPicker />
        </div>
      </div>

      {/* RTL DOM order = visual start→end: search → alerts → theme → avatar */}
      <div className="flex flex-1 shrink-0 items-center justify-end gap-1 sm:gap-1.5">
        <HeaderSearchField
          id="header-search-desktop"
          className="hidden h-8 w-36 lg:flex xl:w-48"
        />

        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                aria-label="جستجو در پنل"
              />
            }
          >
            <SearchIcon className="size-4" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[min(18rem,calc(100vw-1.5rem))] p-2">
            <HeaderSearchField
              id="header-search-mobile"
              className="h-9 w-full"
            />
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="اعلان‌ها"
                className="relative"
              />
            }
          >
            <BellIcon className="size-4" />
            <span className="absolute top-1.5 end-1.5 size-1.5 rounded-full bg-primary" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-64">
            <DropdownMenuLabel>اعلان‌ها</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="text-sm">۳ سفارش جدید در انتظار بررسی</span>
              <span className="text-xs text-muted-foreground">۱۰ دقیقه پیش</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="text-sm">موجودی کیبورد مکانیکی کم است</span>
              <span className="text-xs text-muted-foreground">۱ ساعت پیش</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="text-sm">گزارش هفتگی آماده شد</span>
              <span className="text-xs text-muted-foreground">دیروز</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                aria-label="منوی کاربر"
              />
            }
          >
            <Avatar size="sm">
              <AvatarFallback>ن‌ک</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">نیما کاظمی</span>
                <span className="text-xs text-muted-foreground">مدیر فروش</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href={`${DASHBOARD_BASE}/settings`} />}
            >
              تنظیمات
            </DropdownMenuItem>
            <DropdownMenuItem>خروج</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
