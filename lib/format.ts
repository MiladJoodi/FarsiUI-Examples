import { formatPersianNumber, toPersianDigits } from "@/lib/digits"

/** قیمت به تومان با ارقام فارسی و جداکننده هزارگان */
export function formatToman(value: number): string {
  return `${formatPersianNumber(value)} تومان`
}

/** نمایش تاریخ جلالی نمونه‌ای مثل ۱۴۰۵/۰۷/۱۲ */
export function formatJalaliDate(value: string): string {
  return toPersianDigits(value)
}

export function formatCount(value: number): string {
  return formatPersianNumber(value)
}
