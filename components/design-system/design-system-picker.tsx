"use client"

import * as React from "react"
import { ChevronDownIcon, SlidersHorizontalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  useDesignSystemPreview,
  type DesignSystemId,
} from "@/components/design-system/design-system-preview"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"

function StyleThumb({
  id,
  selected,
}: {
  id: DesignSystemId
  selected: boolean
}) {
  const shells: Record<
    DesignSystemId,
    { wrap: string; a: string; b: string; c: string }
  > = {
    default: {
      wrap: "rounded-md bg-background",
      a: "h-1.5 w-5 rounded-sm bg-primary",
      b: "h-1 w-8 rounded-sm bg-foreground/20",
      c: "h-1 w-6 rounded-sm bg-foreground/12",
    },
    comfort: {
      wrap: "rounded-xl bg-background",
      a: "h-1.5 w-6 rounded-full bg-primary",
      b: "h-1 w-9 rounded-full bg-foreground/18",
      c: "h-1 w-7 rounded-full bg-foreground/10",
    },
    glass: {
      wrap: "rounded-lg bg-cyan-500/15 ring-1 ring-cyan-400/40",
      a: "h-1.5 w-5 rounded-md bg-cyan-500/80",
      b: "h-1 w-8 rounded-md bg-foreground/25",
      c: "h-1 w-6 rounded-md bg-foreground/15",
    },
    rose: {
      wrap: "rounded-2xl bg-rose-500/12",
      a: "h-1.5 w-5 rounded-full bg-rose-400",
      b: "h-1 w-8 rounded-full bg-rose-300/50",
      c: "h-1 w-6 rounded-full bg-rose-200/40",
    },
    nili: {
      wrap: "rounded-md bg-slate-800",
      a: "h-1.5 w-5 rounded-sm bg-sky-400",
      b: "h-1 w-8 rounded-sm bg-slate-400/50",
      c: "h-1 w-6 rounded-sm bg-slate-500/40",
    },
    khesht: {
      wrap: "rounded-sm bg-amber-900/20",
      a: "h-1.5 w-5 rounded-[2px] bg-amber-700",
      b: "h-1 w-8 rounded-[2px] bg-amber-800/40",
      c: "h-1 w-6 rounded-[2px] bg-amber-700/30",
    },
  }

  const look = shells[id]

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex h-10 w-full shrink-0 flex-col justify-center gap-1 border px-2",
        look.wrap,
        selected ? "border-primary/40" : "border-border/60"
      )}
    >
      <span className={cn("shrink-0", look.a)} />
      <span className={cn("shrink-0", look.b)} />
      <span className={cn("shrink-0", look.c)} />
      {selected ? (
        <span
          className="absolute -top-0.5 -end-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-500 shadow-sm"
          title="انتخاب‌شده"
        />
      ) : null}
    </div>
  )
}

function DesignSystemGrid({ onSelect }: { onSelect?: () => void }) {
  const { designSystemId, setDesignSystemId, presets } =
    useDesignSystemPreview()

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {presets.map((preset) => {
        const selected = designSystemId === preset.id
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              setDesignSystemId(preset.id)
              onSelect?.()
            }}
            className={cn(
              "relative flex cursor-pointer flex-col gap-1.5 rounded-xl border p-2 text-start transition-colors",
              selected
                ? "border-primary/50 bg-accent/40 ring-1 ring-primary/25"
                : "border-border/70 hover:bg-muted/50"
            )}
            aria-pressed={selected}
          >
            <StyleThumb id={preset.id} selected={selected} />
            <p className="truncate text-xs font-medium">{preset.label}</p>
          </button>
        )
      })}
    </div>
  )
}

function DesignTriggerButton({
  open,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { open?: boolean }) {
  const { designSystemId, presets } = useDesignSystemPreview()
  const active =
    presets.find((preset) => preset.id === designSystemId) ?? presets[0]

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={`دیزاین‌سیستم: ${active.label}`}
      title={`دیزاین‌سیستم: ${active.label}`}
      aria-haspopup="dialog"
      aria-expanded={open}
      className={cn(
        "h-9 gap-2 rounded-full border-primary/35 bg-primary/8 px-3.5 font-medium text-foreground shadow-sm",
        "hover:border-primary/50 hover:bg-primary/12",
        "focus-visible:ring-2 focus-visible:ring-ring/40",
        className
      )}
      {...props}
    >
      <SlidersHorizontalIcon className="size-4 shrink-0 text-primary" />
      <span className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="hidden text-muted-foreground sm:inline">
          دیزاین‌سیستم
        </span>
        <span className="hidden text-muted-foreground/40 sm:inline" aria-hidden>
          ·
        </span>
        <span className="truncate font-semibold tracking-tight">
          {active.label}
        </span>
      </span>
      <ChevronDownIcon className="size-3.5 shrink-0 opacity-55" />
    </Button>
  )
}

function DesktopPicker() {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<DesignTriggerButton open={open} />} />
      <PopoverContent
        align="center"
        side="bottom"
        sideOffset={8}
        className="w-[min(28rem,calc(100vw-1.5rem))] gap-3 p-3.5"
      >
        <PopoverHeader>
          <PopoverTitle>دیزاین‌سیستم</PopoverTitle>
        </PopoverHeader>
        <DesignSystemGrid onSelect={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}

function MobilePicker() {
  const [open, setOpen] = React.useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={<DesignTriggerButton open={open} />} />
      <DrawerContent className="max-h-[min(88vh,36rem)] rounded-t-2xl">
        <DrawerHeader className="pb-2 text-start">
          <DrawerTitle>دیزاین‌سیستم</DrawerTitle>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
          <DesignSystemGrid onSelect={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

/** Prominent design-system control — place centered in example headers. */
export function DesignSystemPicker({ className }: { className?: string }) {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={cn("flex min-w-0 items-center justify-center", className)}>
      {!mounted ? (
        <DesignTriggerButton open={false} />
      ) : isMobile ? (
        <MobilePicker />
      ) : (
        <DesktopPicker />
      )}
    </div>
  )
}

/**
 * Centers DesignSystemPicker in a sticky header row.
 * Put start content on the right (RTL start) and end actions on the left.
 */
export function ExampleHeaderChrome({
  start,
  end,
  className,
  innerClassName,
}: {
  start: React.ReactNode
  end?: React.ReactNode
  className?: string
  innerClassName?: string
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80",
        className
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-4",
          innerClassName
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">{start}</div>
        <div className="pointer-events-none absolute inset-x-0 flex justify-center px-2">
          <div className="pointer-events-auto max-w-[min(100%,16rem)] sm:max-w-none">
            <DesignSystemPicker />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-1.5">
          {end}
        </div>
      </div>
    </header>
  )
}
