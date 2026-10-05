"use client"

import * as React from "react"
import { toast } from "sonner"

import { formatToman } from "@/lib/format"
import { products } from "@/lib/mock/products"
import { dashboardStats } from "@/lib/mock/stats"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export type OpsAction = "deposit" | "withdraw" | "invoice" | "settle"

const actionMeta: Record<
  OpsAction,
  {
    title: string
    description: string
    confirm: string
  }
> = {
  deposit: {
    title: "واریز داخلی",
    description: "انتقال از حساب متصل به موجودی قابل‌برداشت.",
    confirm: "ثبت واریز",
  },
  withdraw: {
    title: "برداشت",
    description: "برداشت به حساب بانکی تأییدشده.",
    confirm: "ثبت برداشت",
  },
  invoice: {
    title: "صدور فاکتور",
    description: "فاکتور برای طرف‌حساب با مبلغ و شرح.",
    confirm: "صدور فاکتور",
  },
  settle: {
    title: "درخواست تسویه",
    description: `در انتظار تسویه: ${formatToman(dashboardStats.pendingSettlement)}`,
    confirm: "ارسال درخواست",
  },
}

const bankAccounts = products.filter((p) => p.sheba !== "—")

type OpsActionDialogProps = {
  action: OpsAction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OpsActionDialog({
  action,
  open,
  onOpenChange,
}: OpsActionDialogProps) {
  const meta = action ? actionMeta[action] : null
  const [amount, setAmount] = React.useState("")
  const [accountId, setAccountId] = React.useState(bankAccounts[0]?.id ?? "")
  const [note, setNote] = React.useState("")
  const [party, setParty] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setAmount("")
    setNote("")
    setParty("")
    setAccountId(bankAccounts[0]?.id ?? "")
    setSubmitting(false)
  }, [open, action])

  if (!meta || !action) return null

  const selected = bankAccounts.find((a) => a.id === accountId)

  const submit = async () => {
    if (action !== "settle" && !amount.trim()) {
      toast.error("مبلغ را وارد کنید")
      return
    }
    if (action === "invoice" && !party.trim()) {
      toast.error("نام طرف‌حساب را وارد کنید")
      return
    }
    setSubmitting(true)
    await new Promise((r) => window.setTimeout(r, 450))
    setSubmitting(false)
    onOpenChange(false)
    toast.success(`${meta.title} ثبت شد`, {
      description: "در صف عملیات امروز قرار گرفت.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="taraz-ops-dialog sm:max-w-md">
        <DialogHeader className="gap-1 pe-8">
          <DialogTitle className="taraz-ops-title">{meta.title}</DialogTitle>
          <DialogDescription className="taraz-ops-desc">
            {meta.description}
          </DialogDescription>
        </DialogHeader>

        <div className="taraz-ops-fields">
          {action !== "settle" ? (
            <div className="taraz-ops-field">
              <Label htmlFor="ops-amount">مبلغ (تومان)</Label>
              <Input
                id="ops-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="مثلاً ۱۲٬۵۰۰٬۰۰۰"
                className="taraz-control"
                dir="ltr"
                inputMode="numeric"
              />
            </div>
          ) : (
            <div className="taraz-ops-field">
              <Label>مبلغ تسویه</Label>
              <div className="taraz-control taraz-ops-readonly">
                <span className="taraz-amount font-semibold">
                  {formatToman(dashboardStats.pendingSettlement)}
                </span>
                <span className="text-muted-foreground">
                  آزاد: {formatToman(dashboardStats.availableBalance)}
                </span>
              </div>
            </div>
          )}

          {action === "invoice" ? (
            <div className="taraz-ops-field">
              <Label htmlFor="ops-party">طرف‌حساب</Label>
              <Input
                id="ops-party"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                placeholder="نام مشتری یا شرکت"
                className="taraz-control"
              />
            </div>
          ) : (
            <div className="taraz-ops-field">
              <Label>حساب</Label>
              <Select
                value={accountId}
                onValueChange={(v) => v && setAccountId(v)}
                items={Object.fromEntries(
                  bankAccounts.map((a) => [a.id, a.name])
                )}
              >
                <SelectTrigger className="taraz-control w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selected ? (
                <p className="taraz-ops-hint" dir="ltr">
                  {selected.sheba}
                </p>
              ) : null}
            </div>
          )}

          <div className="taraz-ops-field">
            <Label htmlFor="ops-note">توضیح</Label>
            <Textarea
              id="ops-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اختیاری"
              className="taraz-control taraz-ops-note"
            />
          </div>
        </div>

        <DialogFooter className="taraz-ops-foot border-0 bg-transparent sm:justify-stretch">
          <Button
            type="button"
            variant="outline"
            className="taraz-btn-md flex-1"
            onClick={() => onOpenChange(false)}
          >
            انصراف
          </Button>
          <Button
            type="button"
            className="taraz-btn-md taraz-btn-primary flex-1"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "در حال ثبت…" : meta.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
