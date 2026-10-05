import Link from "next/link"
import { CircleAlertIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/stats-cards"
import {
  CategoryShareChart,
  ChannelSalesChart,
  WeeklyOrdersChart,
} from "@/components/dashboard/dashboard-charts"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          خلاصه امروز
        </h2>
        <p className="text-sm text-muted-foreground">
          وضعیت فروش، سفارش‌ها و فعالیت‌های سامانه همیار
        </p>
      </div>

      <Alert className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
          <div className="min-w-0 space-y-1">
            <AlertTitle>۳ سفارش در انتظار بررسی انبار</AlertTitle>
            <AlertDescription>
              قبل از پایان امروز وضعیت سفارش‌های در انتظار را مشخص کنید تا تأخیر در
              ارسال پیش نیاید.
            </AlertDescription>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 self-start sm:self-center"
          render={<Link href="/orders" />}
        >
          مشاهده سفارش‌ها
        </Button>
      </Alert>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <WeeklyOrdersChart />
        <CategoryShareChart />
        <ChannelSalesChart />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <RecentOrders />
        <RecentActivity />
      </div>
    </div>
  )
}
