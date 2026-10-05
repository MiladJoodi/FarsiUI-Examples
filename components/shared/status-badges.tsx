import type { OrderStatus } from "@/lib/mock/orders"
import type { UserStatus } from "@/lib/mock/users"
import type { ProductStatus } from "@/lib/mock/products"
import { Badge } from "@/components/ui/badge"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variant =
    status === "تکمیل شده"
      ? "default"
      : status === "لغو شده"
        ? "destructive"
        : status === "در حال پردازش"
          ? "secondary"
          : "outline"

  return <Badge variant={variant}>{status}</Badge>
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const variant =
    status === "فعال"
      ? "default"
      : status === "معلق"
        ? "secondary"
        : "outline"

  return <Badge variant={variant}>{status}</Badge>
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const variant =
    status === "موجود"
      ? "default"
      : status === "کم‌موجود"
        ? "secondary"
        : "destructive"

  return <Badge variant={variant}>{status}</Badge>
}
