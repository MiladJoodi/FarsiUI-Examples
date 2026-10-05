import type { ReactNode } from "react"

import { PricingShell } from "@/components/pricing-example/pricing-shell"

export default function PricingExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return <PricingShell>{children}</PricingShell>
}
