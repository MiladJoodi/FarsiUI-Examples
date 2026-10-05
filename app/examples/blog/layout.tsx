import { Suspense, type ReactNode } from "react"

import { BlogShell } from "@/components/blog/blog-shell"

export default function BlogExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
          در حال بارگذاری…
        </div>
      }
    >
      <BlogShell>{children}</BlogShell>
    </Suspense>
  )
}
