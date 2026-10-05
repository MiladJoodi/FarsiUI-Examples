import type { ReactNode } from "react"

import {
  ExampleHeaderChrome,
} from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"

export default function TeamChatExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <ExampleHeaderChrome
        className="shrink-0"
        innerClassName="max-w-none px-3 sm:px-4"
        start={
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              گفتگوی تیمی
            </p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              گفتگو و همکاری تیمی
            </p>
          </div>
        }
        end={<ModeToggle />}
      />
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
