"use client"

import type { ReactNode } from "react"

import {
  settingsAppName,
  settingsAppTagline,
} from "@/lib/mock/settings"
import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { FarsiUICredit } from "@/components/shared/farsiui-credit"

import "@/styles/settings.css"

export function SettingsShell({ children }: { children: ReactNode }) {
  return (
    <div className="settings-page flex min-h-dvh flex-col bg-background text-foreground">
      <ExampleHeaderChrome
        innerClassName="max-w-5xl"
        className="border-[color-mix(in_oklch,var(--foreground)_12%,transparent)]"
        start={
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              {settingsAppName}
            </p>
            <p className="hidden truncate text-[0.65rem] text-muted-foreground sm:block">
              {settingsAppTagline}
            </p>
          </div>
        }
        end={<ModeToggle />}
      />

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-7">
        {children}
      </div>
      <FarsiUICredit />
    </div>
  )
}
