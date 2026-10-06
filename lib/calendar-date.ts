/**
 * Calendar example helpers — Jalali labels via Intl + jalaali utils.
 */

import { toPersianDigits } from "@/lib/digits"
import {
  dateToJalaali,
  GREGORIAN_MONTHS_FA,
  JALALI_MONTHS,
  jalaaliMonthLength,
  jalaaliToDate,
  type JalaaliDate,
} from "@/lib/jalaali"

const FA = "fa-IR-u-ca-persian"
const FA_HIJRI = "fa-IR-u-ca-islamic-umalqura"

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
  const day = d.getDay()
  const diff = (day + 1) % 7
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

export function formatJalaliNumeric(date: Date) {
  const j = dateToJalaali(date)
  return toPersianDigits(
    `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")}`
  )
}

/** e.g. سه‌شنبه - ۱۴ مهر ۱۴۰۵ */
export function formatJalaliLongLine(date: Date) {
  const j = dateToJalaali(date)
  return `${formatJalaliWeekday(date)} - ${toPersianDigits(j.jd)} ${JALALI_MONTHS[j.jm - 1]} ${toPersianDigits(j.jy)}`
}

export function formatGregorianFull(date: Date) {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
  return toPersianDigits(formatted)
}

export function formatGregorianNumeric(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function formatGregorianLongEn(date: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    date
  )
  const rest = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date)
  return `${weekday} - ${rest}`
}

function hijriParts(date: Date) {
  try {
    const parts = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).formatToParts(date)
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value ?? ""
    return {
      weekday: get("weekday"),
      day: get("day"),
      month: get("month"),
      year: get("year"),
    }
  } catch {
    const parts = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).formatToParts(date)
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value ?? ""
    return {
      weekday: get("weekday"),
      day: get("day"),
      month: get("month"),
      year: get("year"),
    }
  }
}

export function formatHijriNumeric(date: Date) {
  const strip = (v: string) => v.replace(/[^\d]/g, "")
  try {
    const monthNum = strip(
      new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        month: "2-digit",
      }).format(date)
    ).padStart(2, "0")
    const dayNum = strip(
      new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        day: "2-digit",
      }).format(date)
    ).padStart(2, "0")
    const yearNum = strip(
      new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        year: "numeric",
      }).format(date)
    )
    return toPersianDigits(`${yearNum}/${monthNum}/${dayNum}`)
  } catch {
    const monthNum = strip(
      new Intl.DateTimeFormat("en-u-ca-islamic", { month: "2-digit" }).format(
        date
      )
    ).padStart(2, "0")
    const dayNum = strip(
      new Intl.DateTimeFormat("en-u-ca-islamic", { day: "2-digit" }).format(date)
    ).padStart(2, "0")
    const yearNum = strip(
      new Intl.DateTimeFormat("en-u-ca-islamic", { year: "numeric" }).format(
        date
      )
    )
    return toPersianDigits(`${yearNum}/${monthNum}/${dayNum}`)
  }
}

export function formatHijriLongAr(date: Date) {
  const { weekday, day, month, year } = hijriParts(date)
  return `${weekday} - ${day} ${month} ${year}`
}

export type ZodiacSign = {
  id: string
  name: string
  symbol: string
}

/** Tropical zodiac (برج فلکی) by Gregorian date. */
export function getZodiacSign(date: Date): ZodiacSign {
  const m = date.getMonth() + 1
  const d = date.getDate()
  const md = m * 100 + d
  if (md >= 321 && md <= 419) return { id: "aries", name: "حمل", symbol: "♈" }
  if (md >= 420 && md <= 520) return { id: "taurus", name: "ثور", symbol: "♉" }
  if (md >= 521 && md <= 620) return { id: "gemini", name: "جوزا", symbol: "♊" }
  if (md >= 621 && md <= 722) return { id: "cancer", name: "سرطان", symbol: "♋" }
  if (md >= 723 && md <= 822) return { id: "leo", name: "اسد", symbol: "♌" }
  if (md >= 823 && md <= 922) return { id: "virgo", name: "سنبله", symbol: "♍" }
  if (md >= 923 && md <= 1022)
    return { id: "libra", name: "میزان", symbol: "♎" }
  if (md >= 1023 && md <= 1121)
    return { id: "scorpio", name: "عقرب", symbol: "♏" }
  if (md >= 1122 && md <= 1221)
    return { id: "sagittarius", name: "قوس", symbol: "♐" }
  if (md >= 1222 || md <= 119)
    return { id: "capricorn", name: "جدی", symbol: "♑" }
  if (md >= 120 && md <= 218)
    return { id: "aquarius", name: "دلو", symbol: "♒" }
  return { id: "pisces", name: "حوت", symbol: "♓" }
}

export function formatHijriFull(date: Date) {
  try {
    return new Intl.DateTimeFormat(FA_HIJRI, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  } catch {
    return new Intl.DateTimeFormat("fa-IR-u-ca-islamic", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }
}

export function formatDigitalTime(date: Date) {
  return toPersianDigits(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date)
  )
}

export function formatGregorianRangeForJalaliMonth(jy: number, jm: number) {
  const start = jalaaliToDate(jy, jm, 1)
  const last = jalaaliToDate(jy, jm, jalaaliMonthLength(jy, jm))
  const fmt = new Intl.DateTimeFormat("en-US", { month: "long" })
  const sM = fmt.format(start)
  const eM = fmt.format(last)
  const sY = start.getFullYear()
  const eY = last.getFullYear()
  if (sY === eY && sM === eM) {
    return `${sM} ${sY}`
  }
  if (sY === eY) {
    return `${sM} / ${eM} ${sY}`
  }
  return `${sM} ${sY} / ${eM} ${eY}`
}

export function formatHijriRangeForJalaliMonth(jy: number, jm: number) {
  const start = jalaaliToDate(jy, jm, 1)
  const last = jalaaliToDate(jy, jm, jalaaliMonthLength(jy, jm))
  try {
    const fmt = new Intl.DateTimeFormat("fa-IR-u-ca-islamic-umalqura", {
      month: "long",
      year: "numeric",
    })
    const a = fmt.format(start)
    const b = fmt.format(last)
    return a === b ? a : `${a} – ${b}`
  } catch {
    return ""
  }
}

export function jalaliLabel(j: JalaaliDate) {
  return `${toPersianDigits(j.jd)} ${JALALI_MONTHS[j.jm - 1]} ${toPersianDigits(j.jy)}`
}

export const WEEKDAY_HEADERS = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const

export { JALALI_MONTHS, GREGORIAN_MONTHS_FA, dateToJalaali, jalaaliToDate }
