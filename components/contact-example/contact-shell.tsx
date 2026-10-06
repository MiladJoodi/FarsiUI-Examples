"use client"

import type { ReactNode } from "react"

import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { FarsiUICredit } from "@/components/shared/farsiui-credit"

import "@/styles/contact.css"

export function ContactShell({ children }: { children: ReactNode }) {
  return (
    <div className="contact-page">
      <ExampleHeaderChrome
        className="contact-header"
        innerClassName="max-w-xl"
        start={
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              تماس با ما
            </p>
            <p className="hidden truncate text-[0.65rem] text-muted-foreground sm:block">
              پیام و درخواست
            </p>
          </div>
        }
        end={<ModeToggle />}
      />
      <div className="mx-auto w-full max-w-xl flex-1 px-4 sm:px-6">{children}</div>
      <FarsiUICredit />
    </div>
  )
}
