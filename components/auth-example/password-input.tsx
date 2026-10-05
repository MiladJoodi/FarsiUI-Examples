"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  "aria-invalid": ariaInvalid,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type" | "onChange" | "value"> & {
  value: string
  onChange: (value: string) => void
}) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative max-w-md">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        dir="ltr"
        className={cn("pe-10 text-start", className)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={ariaInvalid}
        persianDigits={false}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute end-1 top-1/2 -translate-y-1/2"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "پنهان کردن رمز" : "نمایش رمز"}
      >
        {visible ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </Button>
    </div>
  )
}
