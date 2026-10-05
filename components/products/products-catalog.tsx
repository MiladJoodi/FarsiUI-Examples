"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { formatToman } from "@/lib/format"
import { toPersianDigits } from "@/lib/digits"
import { products, type Product } from "@/lib/mock/products"
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu"
import { SearchField } from "@/components/shared/search-field"
import { ProductStatusBadge } from "@/components/shared/status-badges"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/** IR + groups of 4 for readable IBAN/Sheba */
function formatShebaDisplay(sheba: string) {
  const compact = sheba.replace(/\s/g, "").toUpperCase()
  if (!compact.startsWith("IR") || compact.length < 6) return sheba
  const rest = compact.slice(2)
  const groups = rest.match(/.{1,4}/g) ?? [rest]
  return `IR ${groups.join(" ")}`
}

function formatShebaCopy(sheba: string) {
  return sheba.replace(/\s/g, "").toUpperCase()
}

export function ProductsCatalog() {
  const [query, setQuery] = React.useState("")
  const [selectedId, setSelectedId] = React.useState(products[0]?.id ?? "")

  const filtered = products.filter((account) => {
    return (
      !query ||
      account.name.includes(query) ||
      account.category.includes(query) ||
      account.sheba.includes(query)
    )
  })

  const selected =
    filtered.find((a) => a.id === selectedId) ?? filtered[0] ?? null

  React.useEffect(() => {
    if (selected && selected.id !== selectedId) {
      setSelectedId(selected.id)
    }
  }, [selected, selectedId])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="taraz-muted">
          {toPersianDigits(filtered.length)} حساب
        </p>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <SearchField
            wrapperClassName="sm:w-60"
            placeholder="نام بانک یا شبا…"
            aria-label="جستجوی حساب"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="taraz-control"
          />
          <Button className="taraz-btn-lg taraz-btn-primary">
            افزودن حساب
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="taraz-panel py-12 text-center text-[color:var(--tz-mute)]">
          حسابی پیدا نشد
        </p>
      ) : (
        <div className="taraz-panel grid gap-0 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <ul className="divide-y divide-[color:var(--tz-line)] lg:border-e lg:border-[color:var(--tz-line)]">
            {filtered.map((account) => (
              <li key={account.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(account.id)}
                  className={cn(
                    "flex w-full flex-col gap-1.5 px-4 py-4 text-start transition-colors sm:px-5",
                    selected?.id === account.id
                      ? "taraz-row-active"
                      : "hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="taraz-body-text truncate font-semibold">
                        {account.name}
                      </p>
                      <p className="taraz-muted mt-0.5">
                        {account.category} · {account.accountType}
                      </p>
                    </div>
                    <ProductStatusBadge status={account.status} />
                  </div>
                  <p className="taraz-amount font-bold">
                    {formatToman(account.balance)}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {selected ? <AccountDetail account={selected} /> : null}
        </div>
      )}
    </div>
  )
}

function CopyableField({
  label,
  display,
  copyValue,
  hint,
  emptyLabel,
}: {
  label: string
  display: string
  copyValue?: string
  hint?: string
  emptyLabel?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const canCopy = Boolean(copyValue && copyValue !== "—")

  const onCopy = async () => {
    if (!canCopy || !copyValue) return
    try {
      await navigator.clipboard.writeText(copyValue)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="taraz-copy-field">
      <div className="flex items-center justify-between gap-2">
        <p className="taraz-caption font-medium">{label}</p>
        {hint ? <p className="taraz-caption">{hint}</p> : null}
      </div>

      {!canCopy ? (
        <p className="taraz-muted mt-2 text-sm">
          {emptyLabel ?? "برای این حساب ثبت نشده"}
        </p>
      ) : (
        <div className="mt-2 flex items-stretch gap-2">
          <div
            className="taraz-copy-value min-w-0 flex-1"
            dir="ltr"
            title={copyValue}
          >
            {display}
          </div>
          <Button
            type="button"
            variant="outline"
            className="taraz-btn-md shrink-0 gap-1.5 px-3"
            onClick={onCopy}
            aria-label={copied ? "کپی شد" : `کپی ${label}`}
          >
            {copied ? (
              <>
                <CheckIcon className="size-4 text-emerald-600" />
                <span className="hidden sm:inline">کپی شد</span>
              </>
            ) : (
              <>
                <CopyIcon className="size-4" />
                <span className="hidden sm:inline">کپی</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

function AccountDetail({ account }: { account: Product }) {
  const hasSheba = account.sheba && account.sheba !== "—"
  const hasCard = account.cardMasked && account.cardMasked !== "—"

  return (
    <div className="min-w-0 space-y-5 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="taraz-title">{account.name}</h2>
          <p className="taraz-muted mt-1">
            {account.category} · {account.accountType}
          </p>
        </div>
        <EntityActionsMenu label={`عملیات ${account.name}`}>
          <DropdownMenuItem className="py-2.5">ویرایش</DropdownMenuItem>
          <DropdownMenuItem className="py-2.5">
            تنظیم به‌عنوان پیش‌فرض تسویه
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className="py-2.5">
            مسدود کردن
          </DropdownMenuItem>
        </EntityActionsMenu>
      </div>

      <div className="border-y border-[color:var(--tz-line)] py-5">
        <p className="taraz-muted">موجودی</p>
        <p className="taraz-balance taraz-amount">
          {formatToman(account.balance)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="font-normal">
            {account.accountType}
          </Badge>
          <ProductStatusBadge status={account.status} />
        </div>
      </div>

      <div className="space-y-3">
        <CopyableField
          label="شماره شبا"
          hint={hasSheba ? "۲۴ رقم · IR" : undefined}
          display={hasSheba ? formatShebaDisplay(account.sheba) : "—"}
          copyValue={hasSheba ? formatShebaCopy(account.sheba) : undefined}
          emptyLabel={
            account.accountType === "کیف پول"
              ? "کیف پول داخلی شبا ندارد"
              : "شبا برای این حساب ثبت نشده"
          }
        />
        <CopyableField
          label="شماره کارت"
          display={hasCard ? toPersianDigits(account.cardMasked) : "—"}
          copyValue={hasCard ? account.cardMasked : undefined}
          emptyLabel="کارت برای این حساب ثبت نشده"
        />
      </div>

      <Separator />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="taraz-btn-md">
          واریز به این حساب
        </Button>
        <Button className="taraz-btn-lg taraz-btn-primary">برداشت</Button>
      </div>
    </div>
  )
}
