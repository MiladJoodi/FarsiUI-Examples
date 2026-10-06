"use client"

import type { ReactNode } from "react"
import { Suspense } from "react"

import { CartProvider } from "@/components/ecommerce/cart-context"
import { useDesignSystemPreview } from "@/components/design-system/design-system-preview"
import { StoreHeader } from "@/components/ecommerce/store-header"

function FarsiUICredit() {
  return (
    <footer className="ecom-credit-wrap">
      <a
        href="https://farsiui.ir"
        target="_blank"
        rel="noopener noreferrer"
        className="ecom-credit"
        title="ساخته‌شده با FarsiUI"
      >
        <span className="ecom-credit-prefix">ساخته‌شده با</span>
        <strong>FarsiUI</strong>
      </a>
    </footer>
  )
}

export function EcommerceShell({ children }: { children: ReactNode }) {
  const { designSystemId } = useDesignSystemPreview()

  return (
    <CartProvider>
      <div
        className="ecom-page flex min-h-full flex-col overflow-x-hidden"
        data-ds={designSystemId}
      >
        <Suspense fallback={<header className="ecom-header h-[9.5rem]" />}>
          <StoreHeader />
        </Suspense>
        <div className="ecom-body flex-1">{children}</div>
        <FarsiUICredit />
      </div>
    </CartProvider>
  )
}
