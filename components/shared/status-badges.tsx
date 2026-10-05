import type { ReactNode } from "react"
import type { OrderStatus } from "@/lib/mock/orders"
import type { UserStatus } from "@/lib/mock/users"
import type { ProductStatus } from "@/lib/mock/products"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const toneClass = {
  success:
    "border-transparent bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  warning:
    "border-transparent bg-amber-500/14 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  danger:
    "border-transparent bg-red-500/12 text-red-700 dark:bg-red-400/15 dark:text-red-300",
  muted:
    "border-transparent bg-zinc-500/10 text-zinc-600 dark:bg-zinc-400/15 dark:text-zinc-300",
  info: "border-transparent bg-sky-500/12 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
} as const

function StatusBadge({
  children,
  tone,
  className,
}: {
  children: ReactNode
  tone: keyof typeof toneClass
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-lg px-2.5 text-[0.75rem] font-semibold",
        toneClass[tone],
        className
      )}
    >
      {children}
    </Badge>
  )
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const tone =
    status === "موفق"
      ? "success"
      : status === "در انتظار"
        ? "warning"
        : status === "ناموفق"
          ? "danger"
          : "muted"

  return <StatusBadge tone={tone}>{status}</StatusBadge>
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const tone =
    status === "فعال" ? "success" : status === "معلق" ? "warning" : "muted"

  return <StatusBadge tone={tone}>{status}</StatusBadge>
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const tone =
    status === "فعال"
      ? "success"
      : status === "در انتظار تأیید"
        ? "warning"
        : "danger"

  return <StatusBadge tone={tone}>{status}</StatusBadge>
}
