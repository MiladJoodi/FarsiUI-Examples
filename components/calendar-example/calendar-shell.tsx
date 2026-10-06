"use client"

import type { ReactNode } from "react"

import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { useDesignSystemPreview } from "@/components/design-system/design-system-preview"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { FarsiUICredit } from "@/components/shared/farsiui-credit"

import "@/styles/calendar.css"

export function CalendarShell({ children }: { children: ReactNode }) {
  const { designSystemId } = useDesignSystemPreview()

  return (
    <div className="calendar-page" data-ds={designSystemId}>
      <ExampleHeaderChrome
        className="calendar-header"
        innerClassName="max-w-6xl"
        start={
          <div className="min-w-0">
            <p className="truncate text-[0.95rem] font-semibold tracking-tight">
              روزنگار
            </p>
            <p className="hidden truncate text-[0.68rem] text-muted-foreground sm:block">
              ساعت ایران · تقویم شمسی · مناسبت‌ها
            </p>
          </div>
        }
        end={<ModeToggle />}
      />
      <div className="rz-page-body mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-6 sm:py-7">
        {children}
      </div>
      <FarsiUICredit />
    </div>
  )
}
