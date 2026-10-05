export type ProductStatus = "موجود" | "کم‌موجود" | "ناموجود"

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  maxStock: number
  status: ProductStatus
  sold: number
  tone: string
}

export const products: Product[] = [
  {
    id: "p1",
    name: "هدفون بی‌سیم آوا",
    category: "صوتی",
    price: 3_890_000,
    stock: 42,
    maxStock: 60,
    status: "موجود",
    sold: 186,
    tone: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
  {
    id: "p2",
    name: "کیبورد مکانیکی نور",
    category: "لوازم جانبی",
    price: 2_450_000,
    stock: 8,
    maxStock: 40,
    status: "کم‌موجود",
    sold: 94,
    tone: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  {
    id: "p3",
    name: "ماوس ارگونومیک پارس",
    category: "لوازم جانبی",
    price: 980_000,
    stock: 65,
    maxStock: 80,
    status: "موجود",
    sold: 240,
    tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "p4",
    name: "مانیتور ۲۷ اینچ روشن",
    category: "نمایشگر",
    price: 12_700_000,
    stock: 0,
    maxStock: 20,
    status: "ناموجود",
    sold: 51,
    tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  {
    id: "p5",
    name: "وب‌کم حرفه‌ای دیدار",
    category: "تصویری",
    price: 4_200_000,
    stock: 15,
    maxStock: 30,
    status: "موجود",
    sold: 73,
    tone: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
  {
    id: "p6",
    name: "پایه لپ‌تاپ آلومینیوم",
    category: "لوازم جانبی",
    price: 1_150_000,
    stock: 5,
    maxStock: 35,
    status: "کم‌موجود",
    sold: 128,
    tone: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  },
  {
    id: "p7",
    name: "اسپیکر رومیزی صبا",
    category: "صوتی",
    price: 2_780_000,
    stock: 28,
    maxStock: 45,
    status: "موجود",
    sold: 112,
    tone: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "p8",
    name: "هاب یو‌اس‌بی چهار پورت",
    category: "لوازم جانبی",
    price: 640_000,
    stock: 90,
    maxStock: 100,
    status: "موجود",
    sold: 310,
    tone: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  },
  {
    id: "p9",
    name: "رینگ‌لایت استودیو",
    category: "تصویری",
    price: 1_890_000,
    stock: 3,
    maxStock: 25,
    status: "کم‌موجود",
    sold: 67,
    tone: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  },
]

export const productCategories = [
  "همه",
  "صوتی",
  "لوازم جانبی",
  "نمایشگر",
  "تصویری",
] as const
