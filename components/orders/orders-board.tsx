"use client"

import * as React from "react"

import { formatJalaliDate, formatToman } from "@/lib/format"
import { toPersianDigits } from "@/lib/digits"
import { orders, type Order, type OrderStatus } from "@/lib/mock/orders"
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu"
import { SearchField } from "@/components/shared/search-field"
import { OrderStatusBadge } from "@/components/shared/status-badges"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const columns: OrderStatus[] = [
  "در انتظار",
  "در حال پردازش",
  "تکمیل شده",
  "لغو شده",
]

export function OrdersBoard() {
  const [query, setQuery] = React.useState("")

  const filtered = orders.filter(
    (order) =>
      !query ||
      order.id.includes(query) ||
      order.customer.includes(query)
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField
          wrapperClassName="flex-1 sm:max-w-md"
          placeholder="جستجوی شماره سفارش یا مشتری…"
          aria-label="جستجوی سفارش‌ها"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="shrink-0 text-sm tracking-normal text-muted-foreground sm:ms-auto">
          {toPersianDigits(filtered.length)} سفارش در برد
        </p>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex min-w-max gap-3 pb-3 md:grid md:min-w-0 md:grid-cols-2 xl:grid-cols-4 md:whitespace-normal">
          {columns.map((status) => {
            const items = filtered.filter((order) => order.status === status)
            return (
              <div
                key={status}
                className="flex w-[280px] shrink-0 flex-col rounded-xl border bg-muted/20 md:w-auto"
              >
                <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
                  <OrderStatusBadge status={status} />
                  <span className="text-xs tracking-normal text-muted-foreground">
                    {toPersianDigits(items.length)}
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-2.5">
                  {items.length === 0 ? (
                    <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                      سفارشی در این وضعیت نیست
                    </p>
                  ) : (
                    items.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-lg border bg-background p-3 text-sm shadow-none">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium tracking-normal">
            سفارش {order.id}
          </p>
          <p className="mt-0.5 truncate text-muted-foreground">
            {order.customer}
          </p>
        </div>
        <EntityActionsMenu label={`عملیات سفارش ${order.id}`}>
          <DropdownMenuItem>مشاهده</DropdownMenuItem>
          <DropdownMenuItem>تغییر وضعیت</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>پیگیری</DropdownMenuItem>
        </EntityActionsMenu>
      </div>
      <Separator className="my-2.5" />
      <div className="flex items-center justify-between gap-2 text-xs tracking-normal">
        <span className="font-medium whitespace-nowrap">
          {formatToman(order.amount)}
        </span>
        <span className="text-muted-foreground whitespace-nowrap">
          {formatJalaliDate(order.date)}
        </span>
      </div>
    </div>
  )
}
