import { Suspense } from "react"

import { OrderConfirmationView } from "@/components/ecommerce/order-confirmation-view"

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-muted-foreground">
          در حال بارگذاری…
        </div>
      }
    >
      <OrderConfirmationView />
    </Suspense>
  )
}
