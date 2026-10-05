"use client"

import * as React from "react"
import Link from "next/link"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu"
import {
  SortableTableHead,
  sortRows,
  useTableSort,
} from "@/components/shared/sortable-table-head"
import { OrderStatusBadge } from "@/components/shared/status-badges"
import { formatJalaliDate, formatToman } from "@/lib/format"
import { DASHBOARD_BASE } from "@/lib/navigation"
import { recentTransactions, type Order } from "@/lib/mock/orders"
import { cn } from "@/lib/utils"

type SortKey = "id" | "customer" | "amount" | "method" | "status" | "date"

const getters: Record<SortKey, (row: Order) => string | number> = {
  id: (r) => r.id,
  customer: (r) => r.customer,
  amount: (r) => (r.direction === "in" ? r.amount : -r.amount),
  method: (r) => r.method,
  status: (r) => r.status,
  date: (r) => r.date,
}

export function RecentOrders() {
  const { sortKey, sortDir, toggleSort } = useTableSort<SortKey>("date", "desc")
  const rows = React.useMemo(
    () => sortRows(recentTransactions, sortKey, sortDir, getters),
    [sortKey, sortDir]
  )

  return (
    <section className="taraz-panel min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-[color:var(--tz-line)] px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="min-w-0">
          <h2 className="taraz-subtitle">آخرین تراکنش‌ها</h2>
          <p className="taraz-muted mt-0.5 hidden sm:block">
            ورود و خروج‌های ثبت‌شده
          </p>
        </div>
        <Button
          variant="outline"
          className="taraz-btn-md shrink-0 px-3"
          nativeButton={false}
          render={<Link href={`${DASHBOARD_BASE}/orders`} />}
        >
          همه
        </Button>
      </div>

      <div className="-mx-0 overflow-x-auto overscroll-x-contain">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <SortableTableHead
                label="شناسه"
                column="id"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggleSort}
                className="h-10 px-4 sm:h-11 sm:px-6"
              />
              <SortableTableHead
                label="طرف"
                column="customer"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggleSort}
                className="h-10 sm:h-11"
              />
              <SortableTableHead
                label="مبلغ"
                column="amount"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggleSort}
                className="h-10 sm:h-11"
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
                label="وضعیت"
                column="status"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggleSort}
                className="h-10 sm:h-11"
              />
              <SortableTableHead
                label="تاریخ"
                column="date"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggleSort}
                className="hidden h-11 md:table-cell"
              />
              <th className="h-10 w-10 pe-3 sm:h-11 sm:pe-6">
                <span className="sr-only">عملیات</span>
              </th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="taraz-num px-5 py-3 sm:px-6">
                  {tx.id}
                </TableCell>
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
                <TableCell className="py-3">
                  <OrderStatusBadge status={tx.status} />
                </TableCell>
                <TableCell className="taraz-num hidden py-3 text-[color:var(--tz-mute)] md:table-cell">
                  {formatJalaliDate(tx.date)}
                </TableCell>
                <TableCell className="py-3 pe-5 sm:pe-6">
                  <EntityActionsMenu label={`عملیات ${tx.id}`}>
                    <DropdownMenuItem className="py-2.5">
                      مشاهده جزئیات
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2.5">
                      کپی شناسه
                    </DropdownMenuItem>
                  </EntityActionsMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
