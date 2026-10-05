"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { persistUserThemePreference } from "@/lib/theme-preference"
import { cn } from "@/lib/utils"

/**
 * Binary light/dark toggle. First visit uses ThemeProvider defaultTheme="system".
 * After the user toggles once, preference is stored as light or dark.
 */
export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  const toggle = () => {
    const next = isDark ? "light" : "dark"
    persistUserThemePreference(next)
    setTheme(next)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={isDark ? "روشن کردن ظاهر" : "تاریک کردن ظاهر"}
      aria-pressed={isDark}
      title={isDark ? "حالت روشن" : "حالت تاریک"}
      className="relative size-9 shrink-0"
      disabled={!mounted}
    >
      <span className="relative grid size-4 place-items-center">
        <SunIcon
          className={cn(
            "size-4 transition-all",
            isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          )}
        />
        <MoonIcon
          className={cn(
            "absolute size-4 transition-all",
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
          )}
        />
      </span>
    </Button>
  )
}
