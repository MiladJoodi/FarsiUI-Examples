import type { ReactNode } from "react"

import { TeamChatShell } from "@/components/team-chat/team-chat-shell"

export default function TeamChatExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return <TeamChatShell>{children}</TeamChatShell>
}
