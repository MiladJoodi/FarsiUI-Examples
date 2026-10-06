"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react"

import {
  DEFAULT_DESIGN_SYSTEM_ID,
  DESIGN_SYSTEM_STORAGE_KEY,
  normalizeDesignSystemId,
  persistDesignSystemId,
  type DesignSystemCookieId,
} from "@/lib/design-system"

export const DESIGN_SYSTEM_PRESETS = [
  {
    id: "default",
    label: "پیشفرض",
    hint: "مسی و گرم",
    styleName: "base-nova",
    styleRootClass: "style-nova",
  },
  {
    id: "comfort",
    label: "آرام",
    hint: "آروم و باز",
    styleName: "base-vega",
    styleRootClass: "style-vega",
  },
  {
    id: "glass",
    label: "فیروزه",
    hint: "شیشه‌ای فیروزه‌ای",
    styleName: "base-glass",
    styleRootClass: "style-glass",
  },
  {
    id: "rose",
    label: "رز",
    hint: "گرم و نرم",
    styleName: "base-rose",
    styleRootClass: "style-rose",
  },
  {
    id: "nili",
    label: "نیلی",
    hint: "اسلیت و ایندیگو",
    styleName: "base-nili",
    styleRootClass: "style-nili",
  },
  {
    id: "khesht",
    label: "خشت",
    hint: "خاکی و پررنگ",
    styleName: "base-khesht",
    styleRootClass: "style-khesht",
  },
] as const

export type DesignSystemId = (typeof DESIGN_SYSTEM_PRESETS)[number]["id"]

const DEFAULT_DESIGN_SYSTEM: DesignSystemId = DEFAULT_DESIGN_SYSTEM_ID

type DesignSystemPreviewContextType = {
  designSystemId: DesignSystemId
  setDesignSystemId: (id: DesignSystemId) => void
  styleName: string
  styleRootClass: string
  presets: typeof DESIGN_SYSTEM_PRESETS
}

const DesignSystemPreviewContext = createContext<
  DesignSystemPreviewContextType | undefined
>(undefined)

function resolvePreset(id: string) {
  return (
    DESIGN_SYSTEM_PRESETS.find((preset) => preset.id === id) ??
    DESIGN_SYSTEM_PRESETS.find((preset) => preset.id === DEFAULT_DESIGN_SYSTEM)!
  )
}

function applyStyleRootToElement(el: HTMLElement, styleRootClass: string) {
  Array.from(el.classList)
    .filter((className) => className.startsWith("style-"))
    .forEach((className) => {
      el.classList.remove(className)
    })
  el.classList.add(styleRootClass)
}

/** Apply on html + body so dark selectors (`.dark .style-*`) and theme bridge both resolve. */
function applyStyleRootClass(styleRootClass: string) {
  applyStyleRootToElement(document.documentElement, styleRootClass)
  applyStyleRootToElement(document.body, styleRootClass)
}

export function DesignSystemPreviewProvider({
  children,
  initialDesignSystem,
}: {
  children: ReactNode
  initialDesignSystem?: DesignSystemId
}) {
  const bootId = initialDesignSystem ?? DEFAULT_DESIGN_SYSTEM
  const [designSystemId, setDesignSystemIdState] =
    useState<DesignSystemId>(bootId)
  const [hydrated, setHydrated] = useState(false)

  useLayoutEffect(() => {
    const raw = window.localStorage.getItem(DESIGN_SYSTEM_STORAGE_KEY)
    if (raw === "aether") {
      window.localStorage.setItem(DESIGN_SYSTEM_STORAGE_KEY, "glass")
    }
    const next = normalizeDesignSystemId(raw) as DesignSystemId
    const preset = resolvePreset(next)

    setDesignSystemIdState(next)
    persistDesignSystemId(next as DesignSystemCookieId)
    applyStyleRootClass(preset.styleRootClass)

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    persistDesignSystemId(designSystemId as DesignSystemCookieId)
    applyStyleRootClass(resolvePreset(designSystemId).styleRootClass)
  }, [designSystemId, hydrated])

  const setDesignSystemId = useCallback((id: DesignSystemId) => {
    if (!DESIGN_SYSTEM_PRESETS.some((preset) => preset.id === id)) return
    persistDesignSystemId(id as DesignSystemCookieId)
    applyStyleRootClass(resolvePreset(id).styleRootClass)
    setDesignSystemIdState(id)
  }, [])

  const preset = resolvePreset(designSystemId)

  return (
    <DesignSystemPreviewContext.Provider
      value={{
        designSystemId: preset.id,
        setDesignSystemId,
        styleName: preset.styleName,
        styleRootClass: preset.styleRootClass,
        presets: DESIGN_SYSTEM_PRESETS,
      }}
    >
      {children}
    </DesignSystemPreviewContext.Provider>
  )
}

export function useDesignSystemPreview() {
  const context = useContext(DesignSystemPreviewContext)
  if (context === undefined) {
    throw new Error(
      "useDesignSystemPreview must be used within a DesignSystemPreviewProvider"
    )
  }
  return context
}
