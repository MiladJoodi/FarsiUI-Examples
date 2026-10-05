import type { ReactNode } from "react"

import "@/styles/ai-assistant.css"

export default function AiAssistantExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="ai-page">
      {children}
    </div>
  )
}
