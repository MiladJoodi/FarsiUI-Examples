/**
 * Calendar example helpers — Jalali labels via Intl (no extra date lib).
 */

const FA = "fa-IR-u-ca-persian"

export function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number)
  return startOfDay(new Date(y, m - 1, d))
}

/** Saturday-first week (Iran). */
export function startOfWeekSat(date: Date) {
  const d = startOfDay(date)
  const day = d.getDay() // 0 Sun … 6 Sat
  const diff = (day + 1) % 7 // Sat=0
  return addDays(d, -diff)
}

export function monthGrid(date: Date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const gridStart = startOfWeekSat(first)
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
}

export function weekDays(date: Date) {
  const start = startOfWeekSat(date)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function formatJalaliDay(date: Date) {
  return new Intl.DateTimeFormat(FA, { day: "numeric" }).format(date)
}

export function formatJalaliFull(date: Date) {
  return new Intl.DateTimeFormat(FA, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatJalaliMonthYear(date: Date) {
  return new Intl.DateTimeFormat(FA, {
    year: "numeric",
    month: "long",
  }).format(date)
}

export function formatJalaliWeekday(date: Date) {
  return new Intl.DateTimeFormat(FA, { weekday: "long" }).format(date)
}

export function formatJalaliWeekdayShort(date: Date) {
  return new Intl.DateTimeFormat(FA, { weekday: "short" }).format(date)
}

export const WEEKDAY_HEADERS = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const
