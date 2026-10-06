"use client"

import type { ReactNode } from "react"

import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { useDesignSystemPreview } from "@/components/design-system/design-system-preview"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { workspaceHint, workspaceMark, workspaceName } from "@/lib/mock/team-chat"

import "@/styles/team-chat.css"

export function TeamChatShell({ children }: { children: ReactNode }) {
  const { designSystemId } = useDesignSystemPreview()

  return (
    <div className="hs-page" data-ds={designSystemId} dir="rtl">
      <ExampleHeaderChrome
        className="hs-header"
        innerClassName="max-w-none px-3 sm:px-4"
        start={
          <div className="hs-brand min-w-0">
            <span className="hs-brand-mark" aria-hidden>
              {workspaceMark}
            </span>
            <div className="min-w-0">
              <p className="hs-brand-name truncate">{workspaceName}</p>
              <p className="hs-brand-sub hidden truncate sm:block">
                {workspaceHint}
              </p>
            </div>
          </div>
        }
        end={
          <div className="hs-header-end">
            <a
              href="https://farsiui.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="hs-credit"
              title="ساخته‌شده با FarsiUI"
            >
              <span className="hs-credit-prefix">ساخته‌شده با</span>
              <strong>FarsiUI</strong>
            </a>
            <ModeToggle />
          </div>
        }
      />
      <div className="hs-stage">{children}</div>
    </div>
  )
}
