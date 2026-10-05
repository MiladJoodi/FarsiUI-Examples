import { OrdersBoard } from "@/components/orders/orders-board"

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">برد سفارش‌ها</h2>
        <p className="text-sm text-muted-foreground">
          پیگیری وضعیت سفارش‌ها در ستون‌های مرحله‌ای
        </p>
      </div>
      <OrdersBoard />
    </div>
  )
}
