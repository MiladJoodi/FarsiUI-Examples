"use client"

import * as React from "react"

import { formatJalaliDate, formatToman } from "@/lib/format"
import { toPersianDigits } from "@/lib/digits"
import { orders, type Order, type OrderStatus } from "@/lib/mock/orders"
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu"
import { SearchField } from "@/components/shared/search-field"
import {
  SortableTableHead,
  sortRows,
  useTableSort,
} from "@/components/shared/sortable-table-head"
import { OrderStatusBadge } from "@/components/shared/status-badges"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusTabs: Array<"همه" | OrderStatus> = [
  "همه",
  "موفق",
  "در انتظار",
  "ناموفق",
  "برگشتی",
]

type SortKey =
  | "id"
  | "customer"
  | "amount"
  | "method"
  | "ref"
  | "status"
  | "date"

const getters: Record<SortKey, (row: Order) => string | number> = {
  id: (r) => r.id,
  customer: (r) => r.customer,
  amount: (r) => (r.direction === "in" ? r.amount : -r.amount),
  method: (r) => r.method,
  ref: (r) => r.ref ?? "",
  status: (r) => r.status,
  date: (r) => r.date,
}

export function OrdersBoard() {
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<(typeof statusTabs)[number]>("همه")
  const [range, setRange] = React.useState("7d")
  const { sortKey, sortDir, toggleSort } = useTableSort<SortKey>("date", "desc")

  const filtered = React.useMemo(() => {
    const base = orders.filter((order) => {
      const matchQuery =
        !query ||
        order.id.includes(query) ||
        order.customer.includes(query) ||
        order.method.includes(query) ||
        (order.ref?.includes(query) ?? false)
      const matchStatus = status === "همه" || order.status === status
      return matchQuery && matchStatus
    })
    return sortRows(base, sortKey, sortDir, getters)
  }, [query, status, sortKey, sortDir])

  return (
    <div className="space-y-5">
      <div className="taraz-panel space-y-3 p-3 sm:space-y-4 sm:p-5">
        <div className="flex flex-col gap-3">
          <div
            role="tablist"
            aria-label="وضعیت تراکنش"
            className="flex gap-1.5 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {statusTabs.map((tab) => (
              <Button
                key={tab}
                type="button"
                variant={status === tab ? "secondary" : "outline"}
                className={cn(
                  "taraz-btn-md shrink-0 px-3",
                  status === tab && "taraz-btn-primary border-transparent"
                )}
                onClick={() => setStatus(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
            <SearchField
              wrapperClassName="w-full"
              placeholder="شناسه، طرف یا روش…"
              aria-label="جستجوی تراکنش‌ها"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="taraz-control"
            />
            <Select
              value={range}
              onValueChange={(v) => v && setRange(v)}
              items={{
                today: "امروز",
                "7d": "۷ روز",
                month: "این ماه",
              }}
            >
              <SelectTrigger className="taraz-control taraz-control-pill w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="today">امروز</SelectItem>
                <SelectItem value="7d">۷ روز</SelectItem>
                <SelectItem value="month">این ماه</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="taraz-muted">
          {toPersianDigits(filtered.length)} تراکنش
        </p>

        <div className="overflow-x-auto rounded-xl border border-[color:var(--tz-line)]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <SortableTableHead
                  label="شناسه"
                  column="id"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={toggleSort}
                  className="h-11"
                />
                <SortableTableHead
                  label="طرف‌حساب"
                  column="customer"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={toggleSort}
                  className="h-11"
                />
                <SortableTableHead
                  label="مبلغ"
                  column="amount"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={toggleSort}
                  className="h-11"
                />
                <SortableTableHead
                  label="روش"
                  column="method"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={toggleSort}
                  className="hidden h-11 sm:table-cell"
                />
                <SortableTableHead
                  label="پیگیری"
                  column="ref"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={toggleSort}
                  className="hidden h-11 md:table-cell"
                />
                <SortableTableHead
                  label="وضعیت"
                  column="status"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={toggleSort}
                  className="h-11"
                />
                <SortableTableHead
                  label="تاریخ"
                  column="date"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={toggleSort}
                  className="hidden h-11 lg:table-cell"
                />
                <th className="h-11 w-10">
                  <span className="sr-only">عملیات</span>
                </th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-28 text-center text-[color:var(--tz-mute)]"
                  >
                    تراکنشی با این فیلتر پیدا نشد
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="taraz-num py-3">{tx.id}</TableCell>
                    <TableCell className="max-w-36 truncate py-3">
                      {tx.customer}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "taraz-amount py-3 font-semibold whitespace-nowrap",
                        tx.direction === "in"
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-red-700 dark:text-red-400"
                      )}
                    >
                      {tx.direction === "in" ? "+" : "−"}
                      {formatToman(tx.amount)}
                    </TableCell>
                    <TableCell className="hidden py-3 text-[color:var(--tz-mute)] sm:table-cell">
                      {tx.method}
                    </TableCell>
                    <TableCell className="taraz-ref hidden py-3 text-[color:var(--tz-mute)] md:table-cell">
                      {tx.ref ? toPersianDigits(tx.ref) : "—"}
                    </TableCell>
                    <TableCell className="py-3">
                      <OrderStatusBadge status={tx.status} />
                    </TableCell>
                    <TableCell className="taraz-num hidden py-3 text-[color:var(--tz-mute)] lg:table-cell">
                      {formatJalaliDate(tx.date)}
                    </TableCell>
                    <TableCell className="py-3">
                      <EntityActionsMenu label={`عملیات ${tx.id}`}>
                        <DropdownMenuItem className="py-2.5">
                          مشاهده جزئیات
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2.5">
                          رسید / پیگیری
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="py-2.5">
                          علامت‌گذاری بررسی
                        </DropdownMenuItem>
                      </EntityActionsMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
