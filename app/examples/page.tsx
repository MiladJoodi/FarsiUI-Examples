import Link from "next/link"

import { EXAMPLES, type ExampleMeta } from "@/lib/examples"
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
  return (
    <div className="min-h-full">
      <ExampleHeaderChrome
        innerClassName="max-w-6xl sm:px-6"
        start={
          <Link
            href="/"
            className="me-1.5 flex shrink-0 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              aria-hidden="true"
              className="text-[0.98rem] leading-none font-extrabold tracking-tight text-primary"
            >
              فارسیUI
            </span>
            <span className="sr-only">FarsiUI</span>
          </Link>
        }
        end={<ModeToggle />}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            دموهای FarsiUI
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            اینجا می‌توانید دموهایی از رابط‌های فارسی و راست‌چین ساخته‌شده با{" "}
            <a
              href="https://farsiui.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-inherit no-underline hover:underline underline-offset-2"
            >
              FarsiUI
            </a>{" "}
            را ببینید.
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
