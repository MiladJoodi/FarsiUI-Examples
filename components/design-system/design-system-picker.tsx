"use client"

import * as React from "react"
import { CheckIcon, SlidersHorizontalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  useDesignSystemPreview,
  type DesignSystemId,
} from "@/components/design-system/design-system-preview"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
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
        "flex h-10 w-full shrink-0 flex-col justify-center gap-1 border px-2",
        look.wrap,
        selected ? "border-primary/40" : "border-border/60"
      )}
    >
      <span className={cn("shrink-0", look.a)} />
      <span className={cn("shrink-0", look.b)} />
      <span className={cn("shrink-0", look.c)} />
    </div>
  )
}

function DesignSystemGrid({ onSelect }: { onSelect?: () => void }) {
  const { designSystemId, setDesignSystemId, presets } =
    useDesignSystemPreview()

  return (
    <div className="grid grid-cols-2 gap-2">
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
                ? "border-primary/50 bg-accent/40"
                : "border-border/70 hover:bg-muted/50"
            )}
          >
            {selected ? (
              <CheckIcon className="absolute top-2 end-2 size-3.5 text-primary" />
            ) : null}
            <StyleThumb id={preset.id} selected={selected} />
            <div className="min-w-0 pe-4">
              <p className="truncate text-xs font-medium">{preset.label}</p>
              <p className="truncate text-[0.6875rem] text-muted-foreground">
                {preset.hint}
              </p>
            </div>
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
    presets.find((preset) => preset.id === designSystemId) ?? presets[1]

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={`دیزاین‌سیستم: ${active.label}`}
      title={`دیزاین‌سیستم: ${active.label}`}
      aria-haspopup="dialog"
      aria-expanded={open}
      className={cn(
        "shrink-0 border-border/80 bg-background/80 text-muted-foreground shadow-none hover:text-foreground",
        className
      )}
      {...props}
    >
      <SlidersHorizontalIcon className="size-4" />
    </Button>
  )
}

function DesktopPicker() {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<DesignTriggerButton open={open} />}
      />
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-[min(22.5rem,calc(100vw-1.5rem))] gap-3 p-3.5"
      >
        <PopoverHeader>
          <PopoverTitle>دیزاین‌سیستم</PopoverTitle>
          <PopoverDescription>
            ظاهر پنل را بین استایل‌های FarsiUI عوض کنید
          </PopoverDescription>
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
      <DrawerContent className="max-h-[min(88vh,32rem)] rounded-t-2xl">
        <DrawerHeader className="pb-2 text-start">
          <DrawerTitle>دیزاین‌سیستم</DrawerTitle>
          <DrawerDescription>
            ظاهر پنل را بین استایل‌های FarsiUI عوض کنید
          </DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
          <DesignSystemGrid onSelect={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function DesignSystemPicker({ className }: { className?: string }) {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={cn("flex min-w-0 items-center", className)}>
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
