import type { ReactNode } from "react"

export default function AiAssistantExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background">
      {children}
    </div>
  )
}
