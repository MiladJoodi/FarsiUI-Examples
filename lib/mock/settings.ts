/**
 * Mock defaults for Settings example — local UI state only.
 */

export const settingsAppName = "همیار"
export const settingsAppTagline = "مرکز تنظیمات فضای کاری"

export type SettingsSectionId =
  | "profile"
  | "account"
  | "appearance"
  | "notifications"
  | "privacy"
  | "security"
  | "preferences"

export type SettingsSectionMeta = {
  id: SettingsSectionId
  title: string
  description: string
}

export const settingsSections: SettingsSectionMeta[] = [
  {
    id: "profile",
    title: "پروفایل",
    description: "نام نمایشی، سمت و معرفی کوتاه شما در تیم.",
  },
  {
    id: "account",
    title: "حساب کاربری",
    description: "ایمیل ورود، شماره تماس و شناسه حساب.",
  },
  {
    id: "appearance",
    title: "ظاهر",
    description: "تراکم رابط و نحوهٔ نمایش فهرست‌ها در این دمو.",
  },
  {
    id: "notifications",
    title: "اعلان‌ها",
    description: "کانال‌ها و موضوع‌هایی که می‌خواهید از آن‌ها خبردار شوید.",
  },
  {
    id: "privacy",
    title: "حریم خصوصی",
    description: "چه کسانی شما را می‌بینند و چه چیزی از فعالیت‌تان آشکار است.",
  },
  {
    id: "security",
    title: "امنیت",
    description: "رمز عبور، تأیید دو مرحله‌ای و نشست‌های فعال.",
  },
  {
    id: "preferences",
    title: "ترجیحات",
    description: "زبان، منطقه زمانی، تقویم و نمایش اعداد.",
  },
]

export type SettingsState = {
  profile: {
    firstName: string
    lastName: string
    displayName: string
    role: string
    bio: string
  }
  account: {
    email: string
    phone: string
    username: string
  }
  appearance: {
    density: "comfortable" | "compact"
    listStyle: "comfortable" | "dense"
    showAvatars: boolean
  }
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    productUpdates: boolean
    securityAlerts: boolean
    weeklyDigest: boolean
    mentions: boolean
  }
  privacy: {
    profileVisibility: "team" | "workspace" | "private"
    showOnlineStatus: boolean
    allowMentions: boolean
    shareActivity: boolean
    searchable: boolean
    showEmail: boolean
  }
  security: {
    twoFactor: boolean
    loginAlerts: boolean
  }
  preferences: {
    language: "fa"
    timezone: "tehran" | "utc"
    calendar: "jalali" | "gregorian"
    persianDigits: boolean
    weekStartsOn: "saturday" | "sunday"
  }
}

export const defaultSettings: SettingsState = {
  profile: {
    firstName: "نیما",
    lastName: "کاظمی",
    displayName: "نیما کاظمی",
    role: "مدیر مالی",
    bio: "مسئول عملیات مالی و تسویه‌های روزانه در تراز.",
  },
  account: {
    email: "nima@taraz.ir",
    phone: "۰۹۱۲۱۲۳۴۵۶۷",
    username: "nima.k",
  },
  appearance: {
    density: "comfortable",
    listStyle: "comfortable",
    showAvatars: true,
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    productUpdates: true,
    securityAlerts: true,
    weeklyDigest: true,
    mentions: true,
  },
  privacy: {
    profileVisibility: "workspace",
    showOnlineStatus: true,
    allowMentions: true,
    shareActivity: false,
    searchable: true,
    showEmail: false,
  },
  security: {
    twoFactor: false,
    loginAlerts: true,
  },
  preferences: {
    language: "fa",
    timezone: "tehran",
    calendar: "jalali",
    persianDigits: true,
    weekStartsOn: "saturday",
  },
}

export type SessionItem = {
  id: string
  device: string
  location: string
  lastActive: string
  current?: boolean
}

export const mockSessions: SessionItem[] = [
  {
    id: "s1",
    device: "Chrome · ویندوز",
    location: "تهران",
    lastActive: "هم‌اکنون",
    current: true,
  },
  {
    id: "s2",
    device: "Safari · آیفون",
    location: "تهران",
    lastActive: "دیروز · ۱۴:۲۰",
  },
  {
    id: "s3",
    device: "Firefox · مک",
    location: "اصفهان",
    lastActive: "۳ روز پیش",
  },
]

export function isSettingsSectionId(value: string): value is SettingsSectionId {
  return settingsSections.some((s) => s.id === value)
}

export function cloneSettings(state: SettingsState): SettingsState {
  return structuredClone(state)
}
