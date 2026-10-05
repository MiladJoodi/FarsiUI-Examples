export type UserRole =
  | "مشتری"
  | "تأمین‌کننده"
  | "پیمانکار"
  | "کارمند"

export type UserStatus = "فعال" | "معلق" | "غیرفعال"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joinedAt: string
  city: string
  /** Remaining balance with this counterparty (تومان) */
  balance: number
  /** @deprecated use balance */
  orders: number
  initials: string
  lastActivity: string
  phone: string
  /** Public path under /avatar */
  avatar: string
}

const AVATARS = [
  "/avatar/01.jpg",
  "/avatar/02.jpg",
  "/avatar/03.jpg",
  "/avatar/04.jpg",
  "/avatar/05.jpg",
] as const

export const users: User[] = [
  {
    id: "u1",
    name: "فروشگاه آریا",
    email: "finance@arya-shop.ir",
    role: "مشتری",
    status: "فعال",
    joinedAt: "1404/02/18",
    city: "تهران",
    balance: 8_200_000,
    orders: 8_200_000,
    initials: "ف‌آ",
    lastActivity: "امروز · ۱۰:۱۴",
    phone: "۰۲۱۸۸۷۷۶۶۵۵",
    avatar: AVATARS[0],
  },
  {
    id: "u2",
    name: "تأمین کالای پارس",
    email: "ap@pars-supply.ir",
    role: "تأمین‌کننده",
    status: "فعال",
    joinedAt: "1404/05/03",
    city: "اصفهان",
    balance: -12_400_000,
    orders: -12_400_000,
    initials: "ت‌پ",
    lastActivity: "دیروز · ۱۶:۴۰",
    phone: "۰۳۱۳۱۲۳۴۵۶۷",
    avatar: AVATARS[1],
  },
  {
    id: "u3",
    name: "زهرا قاسمی",
    email: "zahra.ghasemi@example.com",
    role: "کارمند",
    status: "فعال",
    joinedAt: "1404/08/21",
    city: "شیراز",
    balance: 0,
    orders: 0,
    initials: "ز‌ق",
    lastActivity: "امروز · ۰۹:۰۲",
    phone: "۰۹۱۷۱۲۳۴۵۶۷",
    avatar: AVATARS[2],
  },
  {
    id: "u4",
    name: "پویا شریفی",
    email: "pouya.sharifi@example.com",
    role: "مشتری",
    status: "معلق",
    joinedAt: "1405/01/14",
    city: "مشهد",
    balance: 1_150_000,
    orders: 1_150_000,
    initials: "پ‌ش",
    lastActivity: "۳ روز پیش",
    phone: "۰۹۱۵۹۸۷۶۵۴۳",
    avatar: AVATARS[3],
  },
  {
    id: "u5",
    name: "خدمات فنی رضوی",
    email: "ops@razavi-tech.ir",
    role: "پیمانکار",
    status: "فعال",
    joinedAt: "1405/03/02",
    city: "تبریز",
    balance: -4_800_000,
    orders: -4_800_000,
    initials: "خ‌ر",
    lastActivity: "امروز · ۱۱:۳۰",
    phone: "۰۴۱۳۳۳۱۲۱۲۱",
    avatar: AVATARS[4],
  },
  {
    id: "u6",
    name: "سعید باقری",
    email: "saeed.bagheri@example.com",
    role: "مشتری",
    status: "غیرفعال",
    joinedAt: "1403/11/27",
    city: "کرج",
    balance: 0,
    orders: 0,
    initials: "س‌ب",
    lastActivity: "۲ ماه پیش",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    avatar: AVATARS[0],
  },
  {
    id: "u7",
    name: "نرگس کاظمی",
    email: "narges.kazemi@example.com",
    role: "کارمند",
    status: "فعال",
    joinedAt: "1405/06/19",
    city: "تهران",
    balance: 0,
    orders: 0,
    initials: "ن‌ک",
    lastActivity: "امروز · ۰۸:۴۵",
    phone: "۰۹۱۲۱۱۱۲۲۳۳",
    avatar: AVATARS[1],
  },
  {
    id: "u8",
    name: "بهرام یوسفی",
    email: "bahram.yousefi@example.com",
    role: "مشتری",
    status: "فعال",
    joinedAt: "1405/07/01",
    city: "اهواز",
    balance: 3_600_000,
    orders: 3_600_000,
    initials: "ب‌ی",
    lastActivity: "دیروز · ۱۲:۱۰",
    phone: "۰۹۱۶۷۷۸۸۹۹۰",
    avatar: AVATARS[2],
  },
  {
    id: "u9",
    name: "چاپخانه ساحل",
    email: "billing@sahel-print.ir",
    role: "تأمین‌کننده",
    status: "فعال",
    joinedAt: "1405/04/11",
    city: "رشت",
    balance: -2_250_000,
    orders: -2_250_000,
    initials: "چ‌س",
    lastActivity: "۵ روز پیش",
    phone: "۰۱۳۳۳۲۲۱۱۰۰",
    avatar: AVATARS[3],
  },
  {
    id: "u10",
    name: "آرمان جلالی",
    email: "arman.jalali@example.com",
    role: "مشتری",
    status: "فعال",
    joinedAt: "1405/07/08",
    city: "قم",
    balance: 780_000,
    orders: 780_000,
    initials: "آ‌ج",
    lastActivity: "امروز · ۱۳:۲۰",
    phone: "۰۹۱۲۵۵۵۶۶۷۷",
    avatar: AVATARS[4],
  },
]
