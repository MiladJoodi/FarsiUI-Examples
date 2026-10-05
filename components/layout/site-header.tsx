"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellIcon, SearchIcon } from "lucide-react"

import { getPageMeta } from "@/lib/navigation"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { DesignSystemPicker } from "@/components/design-system/design-system-picker"
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function SiteHeader() {
  const pathname = usePathname()
  const meta = getPageMeta(pathname)
  const showBreadcrumb =
    Boolean(meta.breadcrumbs?.length) && meta.breadcrumbs![0] !== meta.title

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <Separator orientation="vertical" className="me-1 hidden h-4 sm:block" />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-medium sm:text-base">
            {meta.title}
          </h1>
          {showBreadcrumb ? (
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList className="text-xs">
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/" />}>
                    داشبورد
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{meta.breadcrumbs![0]}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          ) : meta.description ? (
            <p className="hidden truncate text-xs text-muted-foreground md:block">
              {meta.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5">
        <InputGroup className="hidden h-8 w-48 lg:flex xl:w-60">
          <InputGroupAddon align="inline-start">
            <SearchIcon className="size-4" />
          </InputGroupAddon>
          <InputGroupInput placeholder="جستجو در پنل…" />
        </InputGroup>

        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-label="جستجو"
        >
          <SearchIcon className="size-4" />
        </Button>

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

        <DesignSystemPicker />

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
            <DropdownMenuItem render={<Link href="/settings" />}>
              تنظیمات
            </DropdownMenuItem>
            <DropdownMenuItem>خروج</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
