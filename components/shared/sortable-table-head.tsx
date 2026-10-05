"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type SortDirection = "asc" | "desc"

type SortState<K extends string> = {
  key: K | null
  dir: SortDirection
}

export function useTableSort<K extends string>(
  initialKey: K | null = null,
  initialDir: SortDirection = "asc"
) {
  const [sort, setSort] = React.useState<SortState<K>>({
    key: initialKey,
    dir: initialDir,
  })

  const toggleSort = React.useCallback((key: K) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" }
      }
      return { key, dir: "asc" }
    })
  }, [])

  return {
    sortKey: sort.key,
    sortDir: sort.dir,
    toggleSort,
  }
}

export function sortRows<T, K extends string>(
  rows: readonly T[],
  sortKey: K | null,
  sortDir: SortDirection,
  getters: Record<K, (row: T) => string | number>
): T[] {
  if (!sortKey) return [...rows]
  const get = getters[sortKey]
  const mul = sortDir === "asc" ? 1 : -1
  return [...rows].sort((a, b) => {
    const av = get(a)
    const bv = get(b)
    if (typeof av === "number" && typeof bv === "number") {
      return (av - bv) * mul
    }
    return (
      String(av).localeCompare(String(bv), "fa", {
        numeric: true,
        sensitivity: "base",
      }) * mul
    )
  })
}

type SortableTableHeadProps<K extends string> = Omit<
  React.ComponentProps<typeof TableHead>,
  "children" | "onClick"
> & {
  label: string
  column: K
  sortKey: K | null
  sortDir: SortDirection
  onSort: (column: K) => void
}

export function SortableTableHead<K extends string>({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
  className,
  ...props
}: SortableTableHeadProps<K>) {
  const active = sortKey === column

  return (
    <TableHead className={cn(className)} {...props}>
      <button
        type="button"
        className={cn(
          "taraz-sort-btn inline-flex max-w-full items-center gap-1.5 rounded-md text-start font-medium transition-colors",
          "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--tz-yellow)]",
          active ? "text-foreground" : "text-muted-foreground"
        )}
        onClick={() => onSort(column)}
        aria-label={
          active
            ? sortDir === "asc"
              ? `مرتب‌سازی ${label} — صعودی، کلیک برای نزولی`
              : `مرتب‌سازی ${label} — نزولی، کلیک برای صعودی`
            : `مرتب‌سازی بر اساس ${label}`
        }
        aria-sort={
          active ? (sortDir === "asc" ? "ascending" : "descending") : "none"
        }
      >
        <span className="truncate">{label}</span>
        <span
          aria-hidden
          className="inline-flex flex-col items-center leading-none"
        >
          <ChevronUpIcon
            className={cn(
              "size-3 -mb-0.5",
              active && sortDir === "asc"
                ? "text-[color:var(--tz-yellow-deep)] opacity-100"
                : "opacity-30"
            )}
          />
          <ChevronDownIcon
            className={cn(
              "size-3 -mt-0.5",
              active && sortDir === "desc"
                ? "text-[color:var(--tz-yellow-deep)] opacity-100"
                : "opacity-30"
            )}
          />
        </span>
      </button>
    </TableHead>
  )
}
