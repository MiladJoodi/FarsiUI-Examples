import type { ReactNode } from "react"
import { Suspense } from "react"

import { CartProvider } from "@/components/ecommerce/cart-context"
import { StoreHeader } from "@/components/ecommerce/store-header"

export default function EcommerceExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <CartProvider>
      <div className="flex min-h-full flex-col overflow-x-hidden">
        <Suspense
          fallback={
            <header className="sticky top-0 z-20 h-[7.5rem] border-b bg-background" />
          }
        >
          <StoreHeader />
        </Suspense>
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </div>
    </CartProvider>
  )
}
