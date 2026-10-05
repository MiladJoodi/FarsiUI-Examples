export type ProductStatus = "فعال" | "در انتظار تأیید" | "مسدود"

export type Product = {
  id: string
  name: string
  /** Bank or wallet provider */
  category: string
  /** Available balance */
  price: number
  balance: number
  stock: number
  maxStock: number
  status: ProductStatus
  sold: number
  tone: string
  sheba: string
  cardMasked: string
  accountType: "جاری" | "پس‌انداز" | "کیف پول"
}

export const products: Product[] = [
  {
    id: "p1",
    name: "ملت — جاری شرکت",
    category: "بانک ملت",
    price: 94_200_000,
    balance: 94_200_000,
    stock: 94,
    maxStock: 100,
    status: "فعال",
    sold: 186,
    tone: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    sheba: "IR120170000000123456789001",
    cardMasked: "۶۱۰۴-****-****-۳۳۱۲",
    accountType: "جاری",
  },
  {
    id: "p2",
    name: "سامان — تسویه درگاه",
    category: "بانک سامان",
    price: 42_850_000,
    balance: 42_850_000,
    stock: 43,
    maxStock: 100,
    status: "فعال",
    sold: 94,
    tone: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
    sheba: "IR560560000000987654321002",
    cardMasked: "۶۲۱۹-****-****-۴۴۰۱",
    accountType: "جاری",
  },
  {
    id: "p3",
    name: "کیف پول داخلی",
    category: "تراز",
    price: 18_120_000,
    balance: 18_120_000,
    stock: 18,
    maxStock: 100,
    status: "فعال",
    sold: 240,
    tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    sheba: "—",
    cardMasked: "—",
    accountType: "کیف پول",
  },
  {
    id: "p4",
    name: "ملی — ذخیره اضطراری",
    category: "بانک ملی",
    price: 25_000_000,
    balance: 25_000_000,
    stock: 25,
    maxStock: 100,
    status: "فعال",
    sold: 51,
    tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    sheba: "IR170170000000555666777003",
    cardMasked: "۶۰۳۷-****-****-۸۸۱۰",
    accountType: "پس‌انداز",
  },
  {
    id: "p5",
    name: "پاسارگاد — در انتظار",
    category: "بانک پاسارگاد",
    price: 0,
    balance: 0,
    stock: 0,
    maxStock: 100,
    status: "در انتظار تأیید",
    sold: 0,
    tone: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    sheba: "IR500570000000111222333004",
    cardMasked: "۵۰۲۲-****-****-۱۱۹۰",
    accountType: "جاری",
  },
  {
    id: "p6",
    name: "تجارت — مسدود موقت",
    category: "بانک تجارت",
    price: 3_200_000,
    balance: 3_200_000,
    stock: 3,
    maxStock: 100,
    status: "مسدود",
    sold: 12,
    tone: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
    sheba: "IR180180000000444555666005",
    cardMasked: "۶۲۷۳-****-****-۲۰۲۰",
    accountType: "جاری",
  },
]

export const productCategories = [
  "همه",
  "بانک ملت",
  "بانک سامان",
  "بانک ملی",
  "بانک پاسارگاد",
  "بانک تجارت",
  "تراز",
] as const
