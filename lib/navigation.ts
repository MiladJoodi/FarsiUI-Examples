import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboardIcon,
  UsersIcon,
  ShoppingCartIcon,
  PackageIcon,
  ChartColumnIcon,
  SettingsIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { title: "داشبورد", href: "/", icon: LayoutDashboardIcon },
  { title: "کاربران", href: "/users", icon: UsersIcon },
  { title: "سفارش‌ها", href: "/orders", icon: ShoppingCartIcon },
  { title: "محصولات", href: "/products", icon: PackageIcon },
  { title: "گزارش‌ها", href: "/reports", icon: ChartColumnIcon },
  { title: "تنظیمات", href: "/settings", icon: SettingsIcon },
]

export const pageMeta: Record<
  string,
  { title: string; description?: string; breadcrumbs?: string[] }
> = {
  "/": {
    title: "داشبورد",
    description: "نمای کلی فروش و فعالیت‌های امروز",
  },
  "/users": {
    title: "کاربران",
    description: "مدیریت حساب‌های کاربران",
  },
  "/orders": {
    title: "سفارش‌ها",
    description: "پیگیری و بررسی سفارش‌ها",
  },
  "/products": {
    title: "محصولات",
    description: "فهرست و وضعیت موجودی",
  },
  "/reports": {
    title: "گزارش‌ها",
    description: "خلاصه عملکرد فروش",
  },
  "/settings": {
    title: "تنظیمات",
    description: "مدیریت حساب، اعلان‌ها و ظاهر پنل",
  },
}

export function getPageMeta(pathname: string) {
  return pageMeta[pathname] ?? { title: "همیار" }
}
