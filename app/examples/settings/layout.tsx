import type { ReactNode } from "react"

import { SettingsShell } from "@/components/settings-example/settings-shell"

export default function SettingsExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return <SettingsShell>{children}</SettingsShell>
}
