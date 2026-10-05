import { toPersianDigits } from "@/lib/digits"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { actionItems } from "@/lib/mock/stats"
import { cn } from "@/lib/utils"

const urgencyClass: Record<(typeof actionItems)[number]["urgency"], string> = {
  فوری: "border-destructive/40 text-destructive",
  امروز: "border-[color:var(--tz-line)] text-foreground",
  "این هفته": "border-transparent bg-muted text-muted-foreground",
}

export function ActionQueue() {
  return (
    <section className="taraz-panel min-w-0 p-4 sm:p-6">
      <div className="mb-3 sm:mb-4">
        <h2 className="taraz-subtitle">نیازمند اقدام</h2>
        <p className="taraz-muted mt-1">
          {toPersianDigits(actionItems.length)} مورد در صف رسیدگی
        </p>
      </div>
      <ul className="divide-y divide-[color:var(--tz-line)]">
        {actionItems.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2.5 py-3.5 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4"
          >
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="taraz-body-text font-semibold">{item.title}</p>
                <Badge
                  variant="outline"
                  className={cn("text-xs", urgencyClass[item.urgency])}
                >
                  {item.urgency}
                </Badge>
              </div>
              <p className="taraz-muted leading-relaxed">{item.detail}</p>
            </div>
            <Button
              variant="outline"
              className="taraz-btn-md w-full shrink-0 sm:w-auto sm:self-center"
            >
              رسیدگی
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
