import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { EXAMPLES, type ExampleMeta } from "@/lib/examples"
import { toPersianDigits } from "@/lib/digits"
import { ExampleHeaderChrome } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function ExampleCard({ example }: { example: ExampleMeta }) {
  const ready = example.status === "ready"

  return (
    <article className="flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
      <div className="space-y-1.5">
        <h2 className="text-base font-semibold tracking-tight">{example.title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {example.description}
        </p>
      </div>
      {ready ? (
        <Link
          href={example.href}
          className={cn(
            buttonVariants({ size: "sm", variant: "ghost" }),
            "mt-auto w-full justify-start px-0 text-primary hover:bg-transparent hover:text-primary/80"
          )}
        >
          مشاهده نمونه
          <ArrowLeftIcon data-icon="inline-end" />
        </Link>
      ) : (
        <Button className="mt-auto w-full" size="sm" variant="outline" disabled>
          به‌زودی
        </Button>
      )}
    </article>
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
