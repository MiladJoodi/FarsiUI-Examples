import type { ReactNode } from "react"

import { CalendarShell } from "@/components/calendar-example/calendar-shell"

export default function CalendarExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return <CalendarShell>{children}</CalendarShell>
}
