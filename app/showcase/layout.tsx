import type { ReactNode } from "react"

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#090909]">
      {children}
    </div>
  )
}
