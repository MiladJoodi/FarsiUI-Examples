"use client"

import { CheckIcon, CircleIcon } from "lucide-react"

import { getPasswordStrength } from "@/lib/mock/auth"
import { cn } from "@/lib/utils"

export function PasswordRequirements({ password }: { password: string }) {
  const strength = getPasswordStrength(password)
  const items = [
    { ok: strength.lengthOk, label: "حداقل ۸ نویسه" },
    { ok: strength.letterOk, label: "حداقل یک حرف" },
    { ok: strength.digitOk, label: "حداقل یک رقم" },
  ]

  return (
    <ul className="auth-reqs space-y-1.5" aria-label="شرایط رمز عبور">
      {items.map((item) => (
        <li
          key={item.label}
          data-ok={item.ok ? "true" : "false"}
          className={cn(
            "flex items-center gap-2 text-xs",
            item.ok ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {item.ok ? (
            <CheckIcon
              className="size-3.5 shrink-0 text-primary"
              aria-hidden
            />
          ) : (
            <CircleIcon className="size-3.5 shrink-0 opacity-40" aria-hidden />
          )}
          {item.label}
        </li>
      ))}
    </ul>
  )
}
