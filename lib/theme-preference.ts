/**
 * User-chosen theme (ModeToggle), separate from temporary dark
 * applied when selecting فیروزه / نیلی.
 */

export const THEME_USER_PREF_KEY = "theme-user-preference"

const VALID = new Set(["light", "dark", "system"])

export function readUserThemePreference(): "light" | "dark" | "system" | null {
  if (typeof window === "undefined") return null
  try {
    const value = window.localStorage.getItem(THEME_USER_PREF_KEY)
    if (value && VALID.has(value)) {
      return value as "light" | "dark" | "system"
    }
  } catch {
    // Ignore quota / private mode.
  }
  return null
}

export function persistUserThemePreference(theme: string) {
  if (typeof window === "undefined") return
  if (!VALID.has(theme)) return
  try {
    window.localStorage.setItem(THEME_USER_PREF_KEY, theme)
  } catch {
    // Ignore quota / private mode.
  }
}
