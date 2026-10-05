/**
 * Shared design-system ids + cookie/localStorage sync for SSR CSS and client picker.
 */

export const DESIGN_SYSTEM_STORAGE_KEY = "design-system-preview"
export const DESIGN_SYSTEM_COOKIE = "design-system-preview"

/** پیشفرض + فیروزه + نیلی — picking these forces dark (dashboard / most examples). */
export function isDarkDefaultDesignSystem(
  id: string | null | undefined
): boolean {
  return id === "default" || id === "glass" || id === "nili"
}

/**
 * Analytics only: skin id `default` (پیشفرض) starts in light, but is still
 * freely toggleable — unlike dashboard where پیشفرض forces dark.
 */
export function isAnalyticsLightStartDesignSystem(
  id: string | null | undefined,
  pathname: string | null | undefined
): boolean {
  return id === "default" && !!pathname?.startsWith("/examples/analytics")
}

/** Whether selecting this skin should force dark on the current route. */
export function forcesDarkThemeOnPath(
  id: string | null | undefined,
  pathname: string | null | undefined
): boolean {
  if (id === "glass" || id === "nili") return true
  if (id === "default") return !isAnalyticsLightStartDesignSystem(id, pathname)
  return false
}

export const DESIGN_SYSTEM_IDS = [
  "default",
  "comfort",
  "glass",
  "rose",
  "nili",
  "khesht",
] as const

export type DesignSystemCookieId = (typeof DESIGN_SYSTEM_IDS)[number]

export const DESIGN_SYSTEM_STYLE_CLASS: Record<DesignSystemCookieId, string> = {
  default: "style-nova",
  comfort: "style-vega",
  glass: "style-glass",
  rose: "style-rose",
  nili: "style-nili",
  khesht: "style-khesht",
}

export function normalizeDesignSystemId(
  value: string | null | undefined
): DesignSystemCookieId {
  if (!value) return "comfort"
  const id = value === "aether" ? "glass" : value
  return (DESIGN_SYSTEM_IDS as readonly string[]).includes(id)
    ? (id as DesignSystemCookieId)
    : "comfort"
}

/** Persist choice for SSR (cookie) + client restore (localStorage). */
export function persistDesignSystemId(id: DesignSystemCookieId) {
  if (typeof document === "undefined") return
  try {
    window.localStorage.setItem(DESIGN_SYSTEM_STORAGE_KEY, id)
    document.cookie = `${DESIGN_SYSTEM_COOKIE}=${id};path=/;max-age=31536000;samesite=lax`
  } catch {
    // Ignore quota / private mode.
  }
}

/**
 * Blocking bootstrap for first child of body — no DOMContentLoaded.
 * Prefers localStorage, then document.cookie; applies style-* immediately.
 * Default: comfort (style-vega) to match components.json base-vega.
 */
export const DESIGN_SYSTEM_BOOTSTRAP_SCRIPT = `
  try {
    var key = '${DESIGN_SYSTEM_STORAGE_KEY}';
    var cookieName = '${DESIGN_SYSTEM_COOKIE}';
    var fromCookie = (document.cookie.match(new RegExp('(?:^|; )' + cookieName + '=([^;]*)')) || [])[1];
    var ds = localStorage.getItem(key) || (fromCookie ? decodeURIComponent(fromCookie) : '') || 'comfort';
    if (ds === 'aether') { ds = 'glass'; localStorage.setItem(key, ds); }
    var map = { default: 'style-nova', comfort: 'style-vega', glass: 'style-glass', rose: 'style-rose', nili: 'style-nili', khesht: 'style-khesht' };
    if (!map[ds]) ds = 'comfort';
    document.cookie = cookieName + '=' + ds + ';path=/;max-age=31536000;samesite=lax';
    try { localStorage.setItem(key, ds); } catch (_) {}
    var styleClass = map[ds];
    function applyStyle(el) {
      if (!el) return;
      Array.prototype.slice.call(el.classList).forEach(function (c) {
        if (c.indexOf('style-') === 0) el.classList.remove(c);
      });
      el.classList.add(styleClass);
    }
    applyStyle(document.documentElement);
    applyStyle(document.body);
  } catch (_) {}
`
