"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import { authBrandName, authBrandTagline } from "@/lib/mock/auth"
import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"

const AUTH_BASE = "/examples/authentication"

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <ExampleHeaderChrome
        className="relative"
        innerClassName="max-w-5xl"
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

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        {children}
      </div>
    </div>
  )
}
