import { OpsToolbar, BalanceBlock } from "@/components/dashboard/balance-block"
import { ActionQueue } from "@/components/dashboard/action-queue"
import {
  CashflowChart,
  ChannelDonutChart,
} from "@/components/dashboard/dashboard-charts"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4 overflow-x-clip sm:gap-5 lg:gap-6">
      <OpsToolbar />
      <BalanceBlock />

      <div className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
        <CashflowChart />
        <ChannelDonutChart />
      </div>

      <ActionQueue />

      <div className="grid min-w-0 gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)]">
        <RecentOrders />
        <RecentActivity />
      </div>
    </div>
  )
}
