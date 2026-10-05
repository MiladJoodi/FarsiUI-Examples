"use client"

import type { ReactNode } from "react"

import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { useDesignSystemPreview } from "@/components/design-system/design-system-preview"
import { ModeToggle } from "@/components/layout/mode-toggle"

import "@/styles/analytics.css"

export function AnalyticsShell({ children }: { children: ReactNode }) {
  const { designSystemId } = useDesignSystemPreview()

  return (
    <div className="analytics-page" data-ds={designSystemId}>
      <ExampleHeaderChrome
        className="analytics-header"
        innerClassName="max-w-7xl"
        start={
          <div className="ax-brand min-w-0">
            <p className="ax-brand-name truncate">رصدخانه</p>
            <p className="ax-brand-sub hidden truncate sm:block">
              سیگنال درآمد · تبدیل · کانال
            </p>
          </div>
        }
        end={<ModeToggle />}
      />
      <div className="ax-stage mx-auto w-full max-w-6xl flex-1 px-4 py-4 sm:px-6 sm:py-5">
        {children}
      </div>
      <footer className="ax-farsiui-credit-wrap">
        <a
          href="https://farsiui.ir"
          target="_blank"
          rel="noopener noreferrer"
          className="ax-farsiui-credit"
          title="ساخته‌شده با FarsiUI"
        >
          <span className="ax-farsiui-credit-prefix">ساخته‌شده با</span>
          <strong>FarsiUI</strong>
        </a>
      </footer>
    </div>
  )
}
