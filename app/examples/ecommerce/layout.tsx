import type { ReactNode } from "react"
import { Suspense } from "react"

import { CartProvider } from "@/components/ecommerce/cart-context"
import { StoreHeader } from "@/components/ecommerce/store-header"

import "@/styles/ecommerce.css"

export default function EcommerceExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <CartProvider>
      <div className="ecom-page flex min-h-full flex-col overflow-x-hidden">
        <Suspense
          fallback={
            <header className="ecom-header h-[9.5rem]" />
          }
        >
          <StoreHeader />
        </Suspense>
        <div className="ecom-body">{children}</div>
      </div>
    </CartProvider>
  )
}
