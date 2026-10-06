import type { ReactNode } from "react"

import { EcommerceShell } from "@/components/ecommerce/ecommerce-shell"

import "@/styles/ecommerce.css"

export default function EcommerceExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return <EcommerceShell>{children}</EcommerceShell>
}
