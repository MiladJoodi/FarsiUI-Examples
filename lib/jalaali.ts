/**
 * Jalali ↔ Gregorian conversion (pure, no deps).
 * Based on the well-known algorithms used by jalaali-js.
 */

export type JalaaliDate = { jy: number; jm: number; jd: number }
export type GregorianDate = { gy: number; gm: number; gd: number }

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const

export const GREGORIAN_MONTHS_FA = [
  "ژانویه",
  "فوریه",
  "مارس",
  "آوریل",
  "مه",
  "ژوئن",
  "ژوئیه",
  "اوت",
  "سپتامبر",
  "اکتبر",
  "نوامبر",
  "دسامبر",
] as const

function div(a: number, b: number) {
  return Math.trunc(a / b)
}

function mod(a: number, b: number) {
  return a - Math.trunc(a / b) * b
}

export function isLeapJalaali(jy: number) {
  return jalaaliCalendar(jy).leap === 1
}

export function jalaaliMonthLength(jy: number, jm: number) {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  return isLeapJalaali(jy) ? 30 : 29
}

function jalaaliCalendar(jy: number) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ]
  const bl = breaks.length
  const gy = jy + 621
  let leapJ = -14
  let jp = breaks[0]!
  let jump = 0

  if (jy < jp || jy >= breaks[bl - 1]!) {
    throw new Error(`Invalid Jalaali year ${jy}`)
  }

  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i]!
    jump = jm - jp
    if (jy < jm) break
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
    jp = jm
  }

  let n = jy - jp
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150
  const march = 20 + leapJ - leapG

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33
  let leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) leap = 4

  return { leap, gy, march }
}

export function toJalaali(gy: number, gm: number, gd: number): JalaaliDate {
  return d2j(g2d(gy, gm, gd))
}

export function toGregorian(jy: number, jm: number, jd: number): GregorianDate {
  return d2g(j2d(jy, jm, jd))
}

export function jalaaliToDate(jy: number, jm: number, jd: number): Date {
  const { gy, gm, gd } = toGregorian(jy, jm, jd)
  return new Date(gy, gm - 1, gd)
}

export function dateToJalaali(date: Date): JalaaliDate {
  return toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

function g2d(gy: number, gm: number, gd: number) {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d
}

function d2g(jdn: number): GregorianDate {
  let j = 4 * jdn + 139361631
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  const i = div(mod(j, 1461), 4) * 5 + 308
  const gd = div(mod(i, 153), 5) + 1
  const gm = mod(div(i, 153), 12) + 1
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return { gy, gm, gd }
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalaaliCalendar(jy)
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1
}

function d2j(jdn: number): JalaaliDate {
  const gy = d2g(jdn).gy
  let jy = gy - 621
  const r = jalaaliCalendar(jy)
  const jdn1f = g2d(gy, 3, r.march)
  let k = jdn - jdn1f
  let jm: number
  let jd: number

  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31)
      jd = mod(k, 31) + 1
      return { jy, jm, jd }
    }
    k -= 186
  } else {
    jy -= 1
    k += 179
    if (r.leap === 1) k += 1
  }
  jm = 7 + div(k, 30)
  jd = mod(k, 30) + 1
  return { jy, jm, jd }
}

/** Saturday-first month grid for a Jalali month (42 cells). */
export function jalaaliMonthGrid(jy: number, jm: number): Date[] {
  const first = jalaaliToDate(jy, jm, 1)
  const day = first.getDay() // 0 Sun … 6 Sat
  const diff = (day + 1) % 7
  const start = new Date(first)
  start.setDate(first.getDate() - diff)
  start.setHours(0, 0, 0, 0)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export function addJalaaliMonths(jy: number, jm: number, delta: number) {
  const total = jy * 12 + (jm - 1) + delta
  const nextJy = Math.floor(total / 12)
  const nextJm = (total % 12) + 1
  return { jy: nextJy, jm: nextJm }
}
