import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboardIcon,
  UsersIcon,
  ArrowLeftRightIcon,
  LandmarkIcon,
  ChartColumnIcon,
  SettingsIcon,
} from "lucide-react"

/** Base path for the Dashboard reference example (internal nav only). */
export const DASHBOARD_BASE = "/examples/dashboard"

export const BRAND_NAME = "تراز"
export const BRAND_TAGLINE = "عملیات مالی"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { title: "امروز", href: DASHBOARD_BASE, icon: LayoutDashboardIcon },
  {
    title: "تراکنش‌ها",
    href: `${DASHBOARD_BASE}/orders`,
    icon: ArrowLeftRightIcon,
  },
  {
    title: "طرف‌حساب‌ها",
    href: `${DASHBOARD_BASE}/users`,
    icon: UsersIcon,
  },
  {
    title: "حساب‌ها",
    href: `${DASHBOARD_BASE}/products`,
    icon: LandmarkIcon,
  },
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
    title: "امروز",
    description: "موجودی، تسویه و کارهای فوری روز",
  },
  [`${DASHBOARD_BASE}/users`]: {
    title: "طرف‌حساب‌ها",
    description: "مشتریان، تأمین‌کنندگان و مانده‌ها",
  },
  [`${DASHBOARD_BASE}/orders`]: {
    title: "تراکنش‌ها",
    description: "دفتر ورود و خروج وجوه",
  },
  [`${DASHBOARD_BASE}/products`]: {
    title: "حساب‌ها",
    description: "حساب‌های بانکی و کیف پول‌ها",
  },
  [`${DASHBOARD_BASE}/reports`]: {
    title: "گزارش‌ها",
    description: "خلاصه عملکرد مالی دوره",
  },
  [`${DASHBOARD_BASE}/settings`]: {
    title: "تنظیمات",
    description: "اعلان‌ها، امنیت برداشت و نمایش",
  },
}

export function getPageMeta(pathname: string) {
  return pageMeta[pathname] ?? { title: BRAND_NAME }
}
