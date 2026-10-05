"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { authBrandName, authBrandTagline } from "@/lib/mock/auth"
import {
  DesignSystemPicker,
  ExampleHeaderChrome,
} from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"

import "@/styles/auth.css"

const AUTH_BASE = "/examples/authentication"

export function AuthShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isMainAuth = pathname === AUTH_BASE

  if (!isMainAuth) {
    return (
      <div className="auth-page" data-auth-mode="simple">
        <ExampleHeaderChrome
          className="auth-header"
          innerClassName="max-w-none px-4 sm:px-6"
          start={
            <Link
              href={AUTH_BASE}
              className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <p className="truncate text-sm font-semibold tracking-tight">
                {authBrandName}
              </p>
              <p className="hidden truncate text-[0.65rem] text-muted-foreground sm:block">
                {authBrandTagline}
              </p>
            </Link>
          }
          end={<ModeToggle />}
        />
        <div className="relative flex min-h-dvh w-full flex-col">{children}</div>
      </div>
    )
  }

  return (
    <div className="auth-page" data-auth-mode="hero">
      <header className="auth-hero-bar">
        <Link href={AUTH_BASE} className="auth-hero-brand min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">
            {authBrandName}
          </p>
          <p className="hidden truncate text-[0.65rem] opacity-70 sm:block">
            {authBrandTagline}
          </p>
        </Link>

        <div className="auth-ds-slot">
          <DesignSystemPicker className="auth-ds-picker" />
        </div>

        <div className="auth-hero-actions">
          <ModeToggle />
        </div>
      </header>

      <div className="relative z-[1] flex min-h-dvh w-full flex-col">
        {children}
      </div>
    </div>
  )
}
