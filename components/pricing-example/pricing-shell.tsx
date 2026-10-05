"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import {
  pricingBrandName,
  pricingBrandTagline,
} from "@/lib/mock/pricing"
import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"

import "@/styles/pricing.css"

const PRICING_BASE = "/examples/pricing"

export function PricingShell({ children }: { children: ReactNode }) {
  return (
    <div className="pricing-page">
      <ExampleHeaderChrome
        className="pricing-header"
        innerClassName="max-w-6xl"
        start={
          <Link
            href={PRICING_BASE}
            className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <p className="truncate text-sm font-semibold tracking-tight">
              {pricingBrandName}
            </p>
            <p className="hidden truncate text-[0.65rem] text-muted-foreground sm:block">
              {pricingBrandTagline}
            </p>
          </Link>
        }
        end={
          <>
            <nav
              aria-label="بخش‌های صفحه"
              className="me-1 hidden items-center gap-0.5 md:flex"
            >
              <NavAnchor href="#plans">پلن‌ها</NavAnchor>
              <NavAnchor href="#compare">مقایسه</NavAnchor>
              <NavAnchor href="#faq">پرسش‌ها</NavAnchor>
            </nav>
            <ModeToggle />
          </>
        }
      />

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-6 sm:py-9">
        {children}
      </div>
    </div>
  )
}

function NavAnchor({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-[color-mix(in_oklch,var(--foreground)_5%,transparent)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </a>
  )
}
