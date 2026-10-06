import type { ReactNode } from "react"

import { TasksShell } from "@/components/tasks/tasks-shell"

export default function TasksExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return <TasksShell>{children}</TasksShell>
}
