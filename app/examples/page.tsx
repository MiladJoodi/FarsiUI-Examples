import Link from "next/link"

import { EXAMPLES, type ExampleMeta } from "@/lib/examples"
import { toPersianDigits } from "@/lib/digits"
import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { cn } from "@/lib/utils"

function ExampleCard({ example }: { example: ExampleMeta }) {
  const ready = example.status === "ready"

  const content = (
    <>
      <h2 className="text-base font-semibold tracking-tight">{example.title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {example.description}
      </p>
      {!ready ? (
        <p className="mt-auto text-xs text-muted-foreground">به‌زودی</p>
      ) : null}
    </>
  )

  const className = cn(
    "flex flex-col gap-1.5 rounded-xl border bg-card p-5 text-card-foreground shadow-xs",
    ready &&
      "transition-colors hover:border-primary/35 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
  )

  if (ready) {
    return (
      <Link href={example.href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <article className={cn(className, "opacity-70")}>{content}</article>
  )
}

export default function ExamplesHubPage() {
  const readyCount = EXAMPLES.filter((e) => e.status === "ready").length

  return (
    <div className="min-h-full">
      <ExampleHeaderChrome
        innerClassName="max-w-6xl sm:px-6"
        start={
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              نمونه‌های FarsiUI
            </p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {toPersianDigits(readyCount)} نمونه · RTL و فارسی
            </p>
          </div>
        }
        end={<ModeToggle />}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            نمونه‌های FarsiUI
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            مجموعه‌ای از نمونه‌های مستقل و نزدیک به محصول واقعی برای نمایش قدرت
            FarsiUI در رابط‌های فارسی و راست‌چین.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {EXAMPLES.map((example) => (
            <ExampleCard key={example.id} example={example} />
          ))}
        </div>
      </main>
    </div>
  )
}
