import { TarazShell } from "@/components/dashboard/shell/taraz-shell"

export default function DashboardExampleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TarazShell>{children}</TarazShell>
}
