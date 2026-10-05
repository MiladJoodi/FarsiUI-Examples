export type UserRole = "مدیر" | "پشتیبانی" | "فروشنده" | "مشتری"
export type UserStatus = "فعال" | "معلق" | "غیرفعال"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joinedAt: string
  city: string
  orders: number
  initials: string
}

export const users: User[] = [
  {
    id: "u1",
    name: "مینا اکبری",
    email: "mina.akbari@example.com",
    role: "مدیر",
    status: "فعال",
    joinedAt: "1404/02/18",
    city: "تهران",
    orders: 0,
    initials: "م‌ا",
  },
  {
    id: "u2",
    name: "کامران موسوی",
    email: "kamran.mousavi@example.com",
    role: "فروشنده",
    status: "فعال",
    joinedAt: "1404/05/03",
    city: "اصفهان",
    orders: 48,
    initials: "ک‌م",
  },
  {
    id: "u3",
    name: "زهرا قاسمی",
    email: "zahra.ghasemi@example.com",
    role: "پشتیبانی",
    status: "فعال",
    joinedAt: "1404/08/21",
    city: "شیراز",
    orders: 0,
    initials: "ز‌ق",
  },
  {
    id: "u4",
    name: "پویا شریفی",
    email: "pouya.sharifi@example.com",
    role: "مشتری",
    status: "معلق",
    joinedAt: "1405/01/14",
    city: "مشهد",
    orders: 6,
    initials: "پ‌ش",
  },
  {
    id: "u5",
    name: "الهام رضوی",
    email: "elham.razavi@example.com",
    role: "فروشنده",
    status: "فعال",
    joinedAt: "1405/03/02",
    city: "تبریز",
    orders: 31,
    initials: "ا‌ر",
  },
  {
    id: "u6",
    name: "سعید باقری",
    email: "saeed.bagheri@example.com",
    role: "مشتری",
    status: "غیرفعال",
    joinedAt: "1403/11/27",
    city: "کرج",
    orders: 2,
    initials: "س‌ب",
  },
  {
    id: "u7",
    name: "نرگس کاظمی",
    email: "narges.kazemi@example.com",
    role: "پشتیبانی",
    status: "فعال",
    joinedAt: "1405/06/19",
    city: "تهران",
    orders: 0,
    initials: "ن‌ک",
  },
  {
    id: "u8",
    name: "بهرام یوسفی",
    email: "bahram.yousefi@example.com",
    role: "مشتری",
    status: "فعال",
    joinedAt: "1405/07/01",
    city: "اهواز",
    orders: 11,
    initials: "ب‌ی",
  },
  {
    id: "u9",
    name: "سحر نعمتی",
    email: "sahar.nemati@example.com",
    role: "فروشنده",
    status: "فعال",
    joinedAt: "1405/04/11",
    city: "رشت",
    orders: 22,
    initials: "س‌ن",
  },
  {
    id: "u10",
    name: "آرمان جلالی",
    email: "arman.jalali@example.com",
    role: "مشتری",
    status: "فعال",
    joinedAt: "1405/07/08",
    city: "قم",
    orders: 4,
    initials: "آ‌ج",
  },
]
