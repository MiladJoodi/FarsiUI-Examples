import { cn } from "@/lib/utils"

type FarsiUICreditProps = {
  className?: string
  linkClassName?: string
  /** Compact inline variant (no footer wrapper padding) */
  compact?: boolean
}

/** Showcase credit — «ساخته‌شده با FarsiUI» */
export function FarsiUICredit({
  className,
  linkClassName,
  compact = false,
}: FarsiUICreditProps) {
  const link = (
    <a
      href="https://farsiui.ir"
      target="_blank"
      rel="noopener noreferrer"
      className={cn("fui-credit", compact && "is-compact", linkClassName)}
      title="ساخته‌شده با FarsiUI"
    >
      <span className="fui-credit-prefix">ساخته‌شده با</span>
      <strong>FarsiUI</strong>
    </a>
  )

  if (compact) {
    return link
  }

  return <footer className={cn("fui-credit-wrap", className)}>{link}</footer>
}
