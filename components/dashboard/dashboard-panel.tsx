import * as React from "react"

import { cn } from "@/lib/utils"

type DashboardPanelProps = React.ComponentProps<"div"> & {
  /** Compact padding for dense blocks like stats */
  size?: "default" | "sm"
}

/**
 * Surfaces that pick up design-system card recipes
 * (glass frost, nili hairline, khesht offset) via data-slot="card".
 */
export function DashboardPanel({
  className,
  size = "default",
  ...props
}: DashboardPanelProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
        size === "sm" ? "px-4 py-3" : null,
        className
      )}
      {...props}
    />
  )
}

export function DashboardPanelHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 border-b border-border/80 px-4 py-3",
        className
      )}
      {...props}
    />
  )
}

export function DashboardPanelTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3 className={cn("text-sm font-medium", className)} {...props} />
  )
}

export function DashboardPanelDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export function DashboardPanelBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("p-4", className)} {...props} />
}
