import type { ReactNode } from "react"

import { AnalyticsShell } from "@/components/analytics/analytics-shell"

export default function AnalyticsExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return <AnalyticsShell>{children}</AnalyticsShell>
}
