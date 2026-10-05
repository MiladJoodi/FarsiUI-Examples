"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileTextIcon,
  MoreHorizontalIcon,
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
} from "lucide-react"

import { formatJalaliFull } from "@/lib/calendar-date"
import { formatToman } from "@/lib/format"
import { DASHBOARD_BASE } from "@/lib/navigation"
import { dashboardStats } from "@/lib/mock/stats"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  OpsActionDialog,
  type OpsAction,
} from "@/components/dashboard/ops-action-dialog"

function useOpsDialog() {
  const [action, setAction] = React.useState<OpsAction | null>(null)
  const [open, setOpen] = React.useState(false)

  const openAction = (next: OpsAction) => {
    setAction(next)
    setOpen(true)
  }

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setAction(null)
  }

  return { action, open, openAction, onOpenChange }
}

export function OpsToolbar() {
  const todayLabel = formatJalaliFull(new Date())
  const dialog = useOpsDialog()

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0 space-y-0.5">
          <p className="taraz-muted">روز عملیات</p>
          <h1 className="taraz-title">{todayLabel}</h1>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 sm:hidden">
          <Button
            variant="outline"
            className="taraz-btn-lg gap-2"
            onClick={() => dialog.openAction("invoice")}
          >
            <FileTextIcon className="size-4" />
            صدور فاکتور
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="taraz-icon-btn"
                  aria-label="عملیات بیشتر"
                />
              }
            >
              <MoreHorizontalIcon className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48 text-base">
              <DropdownMenuItem
                className="py-2.5"
                onClick={() => dialog.openAction("deposit")}
              >
                واریز داخلی
              </DropdownMenuItem>
              <DropdownMenuItem
                className="py-2.5"
                onClick={() => dialog.openAction("withdraw")}
              >
                برداشت
              </DropdownMenuItem>
              <DropdownMenuItem
                className="py-2.5"
                render={<Link href={`${DASHBOARD_BASE}/orders`} />}
              >
                مشاهده تراکنش‌ها
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Button
            variant="outline"
            className="taraz-btn-md gap-2"
            onClick={() => dialog.openAction("deposit")}
          >
            <ArrowDownToLineIcon className="size-4" />
            واریز داخلی
          </Button>
          <Button
            variant="outline"
            className="taraz-btn-md gap-2"
            onClick={() => dialog.openAction("withdraw")}
          >
            <ArrowUpFromLineIcon className="size-4" />
            برداشت
          </Button>
          <Button
            variant="outline"
            className="taraz-btn-md gap-2"
            onClick={() => dialog.openAction("invoice")}
          >
            <FileTextIcon className="size-4" />
            صدور فاکتور
          </Button>
        </div>
      </div>

      <OpsActionDialog
        action={dialog.action}
        open={dialog.open}
        onOpenChange={dialog.onOpenChange}
      />
    </>
  )
}

const metricItems = [
  {
    label: "در انتظار تسویه",
    value: dashboardStats.pendingSettlement,
    tone: "neutral" as const,
  },
  {
    label: "مسدود شده",
    value: dashboardStats.blockedBalance,
    tone: "neutral" as const,
  },
  {
    label: "ورود امروز",
    value: dashboardStats.todayInflow,
    tone: "in" as const,
  },
  {
    label: "خروج امروز",
    value: dashboardStats.todayOutflow,
    tone: "out" as const,
  },
]

export function BalanceBlock() {
  const dialog = useOpsDialog()

  return (
    <>
      <section className="taraz-balance-strip taraz-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="taraz-caption">موجودی قابل برداشت</p>
            <p className="taraz-balance taraz-amount mt-0.5">
              {formatToman(dashboardStats.availableBalance)}
            </p>
          </div>
          <Button
            className="taraz-btn-md taraz-btn-primary w-full shrink-0 sm:w-auto"
            onClick={() => dialog.openAction("settle")}
          >
            درخواست تسویه
          </Button>
        </div>

        <div className="taraz-balance-metrics">
          {metricItems.map((item) => (
            <div key={item.label} className="taraz-balance-metric">
              <p className="taraz-caption">{item.label}</p>
              <p
                className={
                  item.tone === "in"
                    ? "taraz-amount mt-0.5 font-bold text-emerald-700 dark:text-emerald-400"
                    : item.tone === "out"
                      ? "taraz-amount mt-0.5 font-bold text-red-700 dark:text-red-400"
                      : "taraz-amount mt-0.5 font-bold"
                }
              >
                {formatToman(item.value)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <OpsActionDialog
        action={dialog.action}
        open={dialog.open}
        onOpenChange={dialog.onOpenChange}
      />
    </>
  )
}
