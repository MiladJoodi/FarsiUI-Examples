import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboardIcon,
  UsersIcon,
  ShoppingCartIcon,
  PackageIcon,
  ChartColumnIcon,
  SettingsIcon,
} from "lucide-react"

/** Base path for the Dashboard reference example (internal nav only). */
export const DASHBOARD_BASE = "/examples/dashboard"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { title: "داشبورد", href: DASHBOARD_BASE, icon: LayoutDashboardIcon },
  { title: "کاربران", href: `${DASHBOARD_BASE}/users`, icon: UsersIcon },
  {
    title: "سفارش‌ها",
    href: `${DASHBOARD_BASE}/orders`,
    icon: ShoppingCartIcon,
  },
  { title: "محصولات", href: `${DASHBOARD_BASE}/products`, icon: PackageIcon },
  {
    title: "گزارش‌ها",
    href: `${DASHBOARD_BASE}/reports`,
    icon: ChartColumnIcon,
  },
  {
    title: "تنظیمات",
    href: `${DASHBOARD_BASE}/settings`,
    icon: SettingsIcon,
  },
]

export const pageMeta: Record<
  string,
  { title: string; description?: string; breadcrumbs?: string[] }
> = {
  [DASHBOARD_BASE]: {
    title: "داشبورد",
    description: "نمای کلی فروش و فعالیت‌های امروز",
  },
  [`${DASHBOARD_BASE}/users`]: {
    title: "کاربران",
    description: "مدیریت حساب‌های کاربران",
  },
  [`${DASHBOARD_BASE}/orders`]: {
    title: "سفارش‌ها",
    description: "پیگیری و بررسی سفارش‌ها",
  },
  [`${DASHBOARD_BASE}/products`]: {
    title: "محصولات",
    description: "فهرست و وضعیت موجودی",
  },
  [`${DASHBOARD_BASE}/reports`]: {
    title: "گزارش‌ها",
    description: "خلاصه عملکرد فروش",
  },
  [`${DASHBOARD_BASE}/settings`]: {
    title: "تنظیمات",
    description: "مدیریت حساب، اعلان‌ها و ظاهر پنل",
  },
}

export function getPageMeta(pathname: string) {
  return pageMeta[pathname] ?? { title: "همیار" }
}
