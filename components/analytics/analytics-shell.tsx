"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { useTheme } from "next-themes"

import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { useDesignSystemPreview } from "@/components/design-system/design-system-preview"
import { ModeToggle } from "@/components/layout/mode-toggle"

import "@/styles/analytics.css"

/**
 * Analytics: skin «پیشفرض» opens in light once on entry.
 * Dark/light toggle stays free after that — پیشفرض is only a skin name.
 * Leaving the page while on پیشفرض restores dashboard’s dark entry for that skin.
 */
export function AnalyticsShell({ children }: { children: ReactNode }) {
  const { designSystemId } = useDesignSystemPreview()
  const { setTheme } = useTheme()
  const designSystemIdRef = useRef(designSystemId)
  const didApplyLightStart = useRef(false)
  designSystemIdRef.current = designSystemId

  useEffect(() => {
    if (designSystemId !== "default") {
      didApplyLightStart.current = false
      return
    }
    if (didApplyLightStart.current) return
    didApplyLightStart.current = true
    setTheme("light")
  }, [designSystemId, setTheme])

  useEffect(() => {
    return () => {
      if (designSystemIdRef.current === "default") {
        setTheme("dark")
      }
    }
  }, [setTheme])

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
    </div>
  )
}
