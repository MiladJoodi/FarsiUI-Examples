"use client"

import type { ReactNode } from "react"

import { DesignSystemPicker } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"

import "@/styles/auth.css"

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page" data-auth-mode="hero">
      <header className="auth-hero-bar">
        <div className="auth-hero-brand" aria-hidden />

        <div className="auth-ds-slot">
          <DesignSystemPicker className="auth-ds-picker" />
        </div>

        <div className="auth-hero-actions">
          <ModeToggle />
        </div>
      </header>

      <div className="relative z-1 flex min-h-dvh w-full flex-col">
        {children}
      </div>
    </div>
  )
}
