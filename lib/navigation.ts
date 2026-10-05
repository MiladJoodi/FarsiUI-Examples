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
    breadcrumbs: ["کاربران"],
  },
  "/orders": {
    title: "سفارش‌ها",
    description: "پیگیری و بررسی سفارش‌ها",
    breadcrumbs: ["سفارش‌ها"],
  },
  "/products": {
    title: "محصولات",
    description: "فهرست و وضعیت موجودی",
    breadcrumbs: ["محصولات"],
  },
  "/reports": {
    title: "گزارش‌ها",
    description: "خلاصه عملکرد فروش",
    breadcrumbs: ["گزارش‌ها"],
  },
  "/settings": {
    title: "تنظیمات",
    description: "پیکربندی حساب و سامانه",
    breadcrumbs: ["تنظیمات"],
  },
}

export function getPageMeta(pathname: string) {
  return pageMeta[pathname] ?? { title: "همیار" }
}
