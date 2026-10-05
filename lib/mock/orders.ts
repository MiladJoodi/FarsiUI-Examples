export type OrderStatus =
  | "موفق"
  | "در انتظار"
  | "ناموفق"
  | "برگشتی"

/** @deprecated use Transaction — kept for badge/type aliases */
export type TransactionStatus = OrderStatus

export type Order = {
  id: string
  customer: string
  amount: number
  status: OrderStatus
  date: string
  /** inflow (+) or outflow (−) direction for ledger UI */
  direction: "in" | "out"
  method: string
  ref?: string
}

export type Transaction = Order

export const orders: Order[] = [
  {
    id: "TRX-۱۸۴۲۱",
    customer: "سارا محمدی",
    amount: 2_450_000,
    status: "موفق",
    date: "1405/07/12",
    direction: "in",
    method: "درگاه آنلاین",
    ref: "۸۴۲۱۹۰۳۱",
  },
  {
    id: "TRX-۱۸۴۲۰",
    customer: "رضا کریمی",
    amount: 890_000,
    status: "در انتظار",
    date: "1405/07/12",
    direction: "out",
    method: "برداشت شبا",
    ref: "۸۴۲۱۹۰۲۲",
  },
  {
    id: "TRX-۱۸۴۱۹",
    customer: "مریم احمدی",
    amount: 4_120_000,
    status: "موفق",
    date: "1405/07/12",
    direction: "in",
    method: "کارت‌به‌کارت",
    ref: "۸۴۲۱۸۹۷۷",
  },
  {
    id: "TRX-۱۸۴۱۸",
    customer: "حسین نوری",
    amount: 1_350_000,
    status: "برگشتی",
    date: "1405/07/11",
    direction: "in",
    method: "درگاه آنلاین",
    ref: "۸۴۲۱۸۸۱۰",
  },
  {
    id: "TRX-۱۸۴۱۷",
    customer: "نگار صالحی",
    amount: 670_000,
    status: "ناموفق",
    date: "1405/07/11",
    direction: "out",
    method: "پرداخت قبض",
    ref: "۸۴۲۱۸۷۴۴",
  },
  {
    id: "TRX-۱۸۴۱۶",
    customer: "امیر حسینی",
    amount: 3_280_000,
    status: "موفق",
    date: "1405/07/11",
    direction: "in",
    method: "چک / حواله",
    ref: "۸۴۲۱۸۶۵۵",
  },
  {
    id: "TRX-۱۸۴۱۵",
    customer: "فاطمه جعفری",
    amount: 1_980_000,
    status: "در انتظار",
    date: "1405/07/10",
    direction: "out",
    method: "تسویه فروشنده",
    ref: "۸۴۲۱۸۵۰۱",
  },
  {
    id: "TRX-۱۸۴۱۴",
    customer: "علی رضایی",
    amount: 540_000,
    status: "موفق",
    date: "1405/07/10",
    direction: "in",
    method: "کیف پول",
    ref: "۸۴۲۱۸۴۲۹",
  },
  {
    id: "TRX-۱۸۴۱۳",
    customer: "بهرام یوسفی",
    amount: 7_500_000,
    status: "موفق",
    date: "1405/07/09",
    direction: "out",
    method: "برداشت شبا",
    ref: "۸۴۲۱۸۳۰۰",
  },
  {
    id: "TRX-۱۸۴۱۲",
    customer: "الهام رضوی",
    amount: 1_120_000,
    status: "موفق",
    date: "1405/07/09",
    direction: "in",
    method: "درگاه آنلاین",
    ref: "۸۴۲۱۸۲۱۱",
  },
]

export const recentOrders = orders.slice(0, 6)
export const recentTransactions = recentOrders
