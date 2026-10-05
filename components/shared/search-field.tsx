"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Input, type InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SearchFieldProps = Omit<InputProps, "type"> & {
  wrapperClassName?: string
}

/**
 * Single-border search field — icon sits inside the input, not beside it.
 */
export function SearchField({
  className,
  wrapperClassName,
  ...props
}: SearchFieldProps) {
  return (
    <div className={cn("relative w-full min-w-0", wrapperClassName)}>
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground opacity-70"
      />
      <Input
        type="search"
        className={cn(
          "h-9 ps-9 pe-3 shadow-none [&::-webkit-search-cancel-button]:appearance-none",
          className
        )}
        {...props}
      />
    </div>
  )
}
