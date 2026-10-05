import Link from "next/link"

import { formatJalaliDate, formatToman } from "@/lib/format"
import { recentOrders } from "@/lib/mock/orders"
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu"
import { OrderStatusBadge } from "@/components/shared/status-badges"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function RecentOrders() {
  return (
    <div className="rounded-xl border">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-medium">آخرین سفارش‌ها</h2>
          <p className="text-xs text-muted-foreground">
            پنج سفارش اخیر ثبت‌شده در سامانه
          </p>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/orders" />}>
          مشاهده همه
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>شماره</TableHead>
            <TableHead>مشتری</TableHead>
            <TableHead>مبلغ</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead className="hidden sm:table-cell">تاریخ</TableHead>
            <TableHead className="w-12 text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell className="whitespace-nowrap">
                {formatToman(order.amount)}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="hidden whitespace-nowrap sm:table-cell">
                {formatJalaliDate(order.date)}
              </TableCell>
              <TableCell className="w-12 text-center">
                <EntityActionsMenu label={`عملیات سفارش ${order.id}`}>
                  <DropdownMenuItem>مشاهده</DropdownMenuItem>
                  <DropdownMenuItem>پیگیری</DropdownMenuItem>
                </EntityActionsMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
