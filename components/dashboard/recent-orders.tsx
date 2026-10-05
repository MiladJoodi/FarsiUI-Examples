import Link from "next/link"

import { formatJalaliDate, formatToman } from "@/lib/format"
import { DASHBOARD_BASE } from "@/lib/navigation"
import { recentOrders } from "@/lib/mock/orders"
import {
  DashboardPanel,
  DashboardPanelDescription,
  DashboardPanelHeader,
  DashboardPanelTitle,
} from "@/components/dashboard/dashboard-panel"
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
    <DashboardPanel>
      <DashboardPanelHeader>
        <div>
          <DashboardPanelTitle>آخرین سفارش‌ها</DashboardPanelTitle>
          <DashboardPanelDescription>
            پنج سفارش اخیر ثبت‌شده در سامانه
          </DashboardPanelDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={`${DASHBOARD_BASE}/orders`} />}
        >
          مشاهده همه
        </Button>
      </DashboardPanelHeader>
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
              <TableCell className="font-medium" dir="ltr">
                {order.id}
              </TableCell>
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
    </DashboardPanel>
  )
}
