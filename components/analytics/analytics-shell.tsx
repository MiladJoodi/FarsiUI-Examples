"use client"

import type { ReactNode } from "react"

import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"

import "@/styles/analytics.css"

export function AnalyticsShell({ children }: { children: ReactNode }) {
  return (
    <div className="analytics-page">
      <ExampleHeaderChrome
        className="analytics-header"
        innerClassName="max-w-7xl"
        start={
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              رصدخانه
            </p>
            <p className="hidden truncate text-[0.65rem] text-muted-foreground sm:block">
              سیگنال درآمد · تبدیل · کانال
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
