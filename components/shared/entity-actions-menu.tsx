"use client"

import * as React from "react"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type EntityActionsMenuProps = {
  label: string
  children: React.ReactNode
  align?: "start" | "end" | "center"
  className?: string
  contentClassName?: string
}

export function EntityActionsMenu({
  label,
  children,
  align = "end",
  className,
  contentClassName,
}: EntityActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={label}
            className={cn(
              "shrink-0 border-border/70 bg-background text-muted-foreground shadow-none hover:bg-muted/60 hover:text-foreground",
              className
            )}
          />
        }
      >
        <MoreHorizontalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn("min-w-40", contentClassName)}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
