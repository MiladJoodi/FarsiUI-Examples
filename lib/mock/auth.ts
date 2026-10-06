/**
 * Mock helpers for Authentication example — UI-only, no real auth.
 */

import { normalizeDigits } from "@/lib/digits"

export const authBrandName = "همیار"
export const authBrandTagline = "فضای کاری تیم‌های محصول فارسی"

/** Demo credentials that succeed on login (UI-only) */
export const demoCredentials: {
  email: string
  mobile: string
  password: string
  otp: string
} = {
  email: "info@farsiui.ir",
  mobile: "09121234567",
  password: "farsiui",
  otp: "123456",
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidMobile(value: string) {
  const digits = normalizeDigits(value).replace(/\D/g, "")
  return /^09\d{9}$/.test(digits) || /^9\d{9}$/.test(digits)
}

export function isEmailOrMobile(value: string) {
  const v = value.trim()
  if (!v) return false
  if (v.includes("@")) return isValidEmail(v)
  return isValidMobile(v)
}

export type PasswordStrength = {
  lengthOk: boolean
  letterOk: boolean
  digitOk: boolean
  score: number
}

export function getPasswordStrength(password: string): PasswordStrength {
  const normalized = normalizeDigits(password)
  const lengthOk = normalized.length >= 8
  const letterOk = /[A-Za-z\u0600-\u06FF]/.test(normalized)
  const digitOk = /\d/.test(normalized)
  const score = [lengthOk, letterOk, digitOk].filter(Boolean).length
  return { lengthOk, letterOk, digitOk, score }
}

export function normalizeOtp(value: string) {
  return value.replace(/\D/g, "").slice(0, 6)
}

export async function fakeDelay(ms = 900) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
