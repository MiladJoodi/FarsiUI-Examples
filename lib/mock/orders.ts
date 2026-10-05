export type OrderStatus =
  | "در انتظار"
  | "در حال پردازش"
  | "تکمیل شده"
  | "لغو شده"

export type Order = {
  id: string
  customer: string
  amount: number
  status: OrderStatus
  date: string
}

export const orders: Order[] = [
  {
    id: "۱۰۴۸۲",
    customer: "سارا محمدی",
    amount: 2_450_000,
    status: "تکمیل شده",
    date: "1405/07/12",
  },
  {
    id: "۱۰۴۸۱",
    customer: "رضا کریمی",
    amount: 890_000,
    status: "در حال پردازش",
    date: "1405/07/12",
  },
  {
    id: "۱۰۴۸۰",
    customer: "مریم احمدی",
    amount: 4_120_000,
    status: "در انتظار",
    date: "1405/07/11",
  },
  {
    id: "۱۰۴۷۹",
    customer: "حسین نوری",
    amount: 1_350_000,
    status: "تکمیل شده",
    date: "1405/07/11",
  },
  {
    id: "۱۰۴۷۸",
    customer: "نگار صالحی",
    amount: 670_000,
    status: "لغو شده",
    date: "1405/07/10",
  },
  {
    id: "۱۰۴۷۷",
    customer: "امیر حسینی",
    amount: 3_280_000,
    status: "در حال پردازش",
    date: "1405/07/10",
  },
  {
    id: "۱۰۴۷۶",
    customer: "فاطمه جعفری",
    amount: 1_980_000,
    status: "تکمیل شده",
    date: "1405/07/09",
  },
  {
    id: "۱۰۴۷۵",
    customer: "علی رضایی",
    amount: 540_000,
    status: "در انتظار",
    date: "1405/07/09",
  },
]

export const recentOrders = orders.slice(0, 5)
