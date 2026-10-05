import type { ReactNode } from "react"

import {
  ExampleHeaderChrome,
} from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"

export default function AnalyticsExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-full flex-col overflow-x-hidden">
      <ExampleHeaderChrome
        start={
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              تحلیل‌ها
            </p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              تحلیل عملکرد و روندهای کسب‌وکار
            </p>
          </div>
        }
        end={<ModeToggle />}
      />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </div>
    </div>
  )
}
