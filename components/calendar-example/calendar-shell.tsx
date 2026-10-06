"use client"

import type { ReactNode } from "react"

import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"

import "@/styles/calendar.css"

export function CalendarShell({ children }: { children: ReactNode }) {
  return (
    <div className="calendar-page">
      <ExampleHeaderChrome
        className="calendar-header"
        innerClassName="max-w-[92rem]"
        start={
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              روزنگار
            </p>
            <p className="hidden truncate text-[0.65rem] text-muted-foreground sm:block">
              تقویم شمسی · جلسات و قرارها
            </p>
          </div>
        }
        end={<ModeToggle />}
      />
      <div className="mx-auto w-full max-w-[92rem] flex-1 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
        {children}
      </div>
    </div>
  )
}
