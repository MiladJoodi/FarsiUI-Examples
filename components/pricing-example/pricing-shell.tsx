"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import {
  pricingBrandName,
  pricingBrandTagline,
} from "@/lib/mock/pricing"
import {
  ExampleHeaderChrome,
} from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"

const PRICING_BASE = "/examples/pricing"

export function PricingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <ExampleHeaderChrome
        innerClassName="max-w-5xl"
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
              className="me-1 hidden items-center gap-1 md:flex"
            >
              <NavAnchor href="#plans">پلن‌ها</NavAnchor>
              <NavAnchor href="#compare">مقایسه</NavAnchor>
              <NavAnchor href="#faq">پرسش‌ها</NavAnchor>
            </nav>
            <ModeToggle />
          </>
        }
      />

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </div>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-muted-foreground">
            همه قیمت‌ها نمایشی و به تومان است. پرداخت واقعی وجود ندارد.
          </p>
          <nav
            aria-label="پاورقی"
            className="flex flex-wrap gap-x-4 gap-y-2 text-xs"
          >
            <a
              href="#plans"
              className="text-muted-foreground hover:text-foreground"
            >
              پلن‌ها
            </a>
            <a
              href="#compare"
              className="text-muted-foreground hover:text-foreground"
            >
              مقایسه
            </a>
            <a
              href="#faq"
              className="text-muted-foreground hover:text-foreground"
            >
              پرسش‌ها
            </a>
          </nav>
        </div>
      </footer>
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
      className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </a>
  )
}
