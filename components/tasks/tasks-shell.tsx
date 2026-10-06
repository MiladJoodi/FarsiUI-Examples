"use client"

import type { ReactNode } from "react"

import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { useDesignSystemPreview } from "@/components/design-system/design-system-preview"
import { ModeToggle } from "@/components/layout/mode-toggle"

import "@/styles/tasks.css"

export function TasksShell({ children }: { children: ReactNode }) {
  const { designSystemId } = useDesignSystemPreview()

  return (
    <div className="tasks-page" data-ds={designSystemId}>
      <ExampleHeaderChrome
        className="tasks-header"
        innerClassName="max-w-[90rem]"
        start={
          <div className="tk-brand min-w-0">
            <div className="tk-brand-row">
              <span className="tk-brand-badge" aria-hidden>
                ک
              </span>
              <div className="min-w-0">
                <p className="tk-brand-name truncate">کارنما</p>
                <p className="tk-brand-sub hidden truncate sm:block">
                  میز دستورکار آتلیه
                </p>
              </div>
            </div>
          </div>
        }
        end={<ModeToggle />}
      />
      <div className="tk-stage">{children}</div>
      <footer className="tk-farsiui-credit-wrap">
        <a
          href="https://farsiui.ir"
          target="_blank"
          rel="noopener noreferrer"
          className="tk-farsiui-credit"
          title="ساخته‌شده با FarsiUI"
        >
          <span className="tk-farsiui-credit-prefix">ساخته‌شده با</span>
          <strong>FarsiUI</strong>
        </a>
      </footer>
    </div>
  )
}
