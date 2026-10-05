"use client"

import type { ReactNode } from "react"

import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"

import "@/styles/contact.css"

export function ContactShell({ children }: { children: ReactNode }) {
  return (
    <div className="contact-page">
      <ExampleHeaderChrome
        className="contact-header"
        innerClassName="max-w-2xl"
        start={
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              تماس با ما
            </p>
            <p className="hidden truncate text-[0.65rem] text-muted-foreground sm:block">
              پیام بگذارید — پاسخ در این نمونه نمایشی است
            </p>
          </div>
        }
        end={<ModeToggle />}
      />
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">{children}</div>
    </div>
  )
}
