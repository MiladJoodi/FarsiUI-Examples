"use client"

import * as React from "react"

import { formatJalaliDate, formatToman } from "@/lib/format"
import { toPersianDigits } from "@/lib/digits"
import { users, type User, type UserRole } from "@/lib/mock/users"
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu"
import { SearchField } from "@/components/shared/search-field"
import { UserStatusBadge } from "@/components/shared/status-badges"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import {
  SortableTableHead,
  sortRows,
  useTableSort,
} from "@/components/shared/sortable-table-head"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const PAGE_SIZE = 5

const avatarPalettes = [
  "bg-amber-100 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200",
  "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-200",
  "bg-sky-100 text-sky-900 dark:bg-sky-400/20 dark:text-sky-200",
  "bg-violet-100 text-violet-900 dark:bg-violet-400/20 dark:text-violet-200",
  "bg-rose-100 text-rose-900 dark:bg-rose-400/20 dark:text-rose-200",
  "bg-teal-100 text-teal-900 dark:bg-teal-400/20 dark:text-teal-200",
  "bg-orange-100 text-orange-900 dark:bg-orange-400/20 dark:text-orange-200",
  "bg-indigo-100 text-indigo-900 dark:bg-indigo-400/20 dark:text-indigo-200",
] as const

function avatarTone(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % avatarPalettes.length
  }
  return avatarPalettes[hash]!
}

function CounterpartyAvatar({
  user,
  className,
  fallbackClassName,
}: {
  user: Pick<User, "id" | "initials" | "name" | "avatar">
  className?: string
  fallbackClassName?: string
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback
        className={cn(
          "font-semibold",
          avatarTone(user.id || user.name),
          fallbackClassName
        )}
      >
        {user.initials}
      </AvatarFallback>
    </Avatar>
  )
}

const roleTabs: Array<"همه" | UserRole> = [
  "همه",
  "مشتری",
  "تأمین‌کننده",
  "پیمانکار",
  "کارمند",
]

type SortKey = "name" | "role" | "balance" | "status" | "lastActivity"

const getters: Record<SortKey, (row: User) => string | number> = {
  name: (r) => r.name,
  role: (r) => r.role,
  balance: (r) => r.balance,
  status: (r) => r.status,
  lastActivity: (r) => r.lastActivity,
}

export function UsersDirectory() {
  const [query, setQuery] = React.useState("")
  const [role, setRole] = React.useState<(typeof roleTabs)[number]>("همه")
  const [selected, setSelected] = React.useState<User | null>(null)
  const [page, setPage] = React.useState(1)
  const { sortKey, sortDir, toggleSort } = useTableSort<SortKey>("name", "asc")

  const filtered = React.useMemo(() => {
    const base = users.filter((user) => {
      const matchQuery =
        !query ||
        user.name.includes(query) ||
        user.email.includes(query) ||
        user.city.includes(query) ||
        user.phone.includes(query)
      const matchRole = role === "همه" || user.role === role
      return matchQuery && matchRole
    })
    return sortRows(base, sortKey, sortDir, getters)
  }, [query, role, sortKey, sortDir])

  React.useEffect(() => {
    setPage(1)
  }, [query, role, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filtered.length)
  const paged = filtered.slice(pageStart, pageEnd)

  const pageItems = React.useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const items: Array<number | "ellipsis"> = [1]
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    if (start > 2) items.push("ellipsis")
    for (let p = start; p <= end; p++) items.push(p)
    if (end < totalPages - 1) items.push("ellipsis")
    items.push(totalPages)
    return items
  }, [currentPage, totalPages])

  return (
    <div className="space-y-5">
      <div className="taraz-panel space-y-4 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="نوع طرف‌حساب"
          className="flex flex-wrap gap-1.5"
        >
          {roleTabs.map((tab) => (
            <Button
              key={tab}
              type="button"
              variant={role === tab ? "secondary" : "outline"}
              className={cn(
                "taraz-btn-md",
                role === tab && "taraz-btn-primary border-transparent"
              )}
              onClick={() => setRole(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        <SearchField
          wrapperClassName="sm:w-60"
          placeholder="نام، شهر یا تماس…"
          aria-label="جستجوی طرف‌حساب"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="taraz-control"
        />
      </div>

      <p className="taraz-muted">
        {filtered.length === 0
          ? "طرف‌حسابی پیدا نشد"
          : `نمایش ${toPersianDigits(pageStart + 1)} تا ${toPersianDigits(pageEnd)} از ${toPersianDigits(filtered.length)} طرف‌حساب`}
      </p>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--tz-line)]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <SortableTableHead
                label="نام"
                column="name"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggleSort}
                className="h-11"
              />
              <SortableTableHead
                label="نوع"
                column="role"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggleSort}
                className="hidden h-11 sm:table-cell"
              />
              <SortableTableHead
                label="مانده"
                column="balance"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggleSort}
                className="h-11"
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
                label="آخرین فعالیت"
                column="lastActivity"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggleSort}
                className="hidden h-11 md:table-cell"
              />
              <th className="h-11 w-10">
                <span className="sr-only">عملیات</span>
              </th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-28 text-center text-[color:var(--tz-mute)]"
                >
                  طرف‌حسابی با این فیلتر پیدا نشد
                </TableCell>
              </TableRow>
            ) : (
              paged.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => setSelected(user)}
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <CounterpartyAvatar
                      user={user}
                      className="size-11"
                      fallbackClassName="text-sm"
                    />
                    <div className="min-w-0">
                      <p className="taraz-body-text truncate font-semibold">
                        {user.name}
                      </p>
                      <p
                        className="taraz-muted truncate"
                        dir="ltr"
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden py-3 sm:table-cell">
                  <Badge variant="outline" className="text-xs font-normal">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell
                  className={cn(
                    "taraz-amount py-3 font-semibold whitespace-nowrap",
                    user.balance > 0
                      ? "text-emerald-700 dark:text-emerald-400"
                      : user.balance < 0
                        ? "text-red-700 dark:text-red-400"
                        : "text-[color:var(--tz-mute)]"
                  )}
                >
                  {user.balance === 0
                    ? "—"
                    : formatToman(Math.abs(user.balance))}
                  {user.balance < 0 ? (
                    <span className="font-normal tracking-normal"> بدهکار</span>
                  ) : null}
                </TableCell>
                <TableCell className="py-3">
                  <UserStatusBadge status={user.status} />
                </TableCell>
                <TableCell className="hidden py-3 text-[color:var(--tz-mute)] md:table-cell">
                  {user.lastActivity}
                </TableCell>
                <TableCell
                  className="py-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EntityActionsMenu label={`عملیات ${user.name}`}>
                    <DropdownMenuItem
                      className="py-2.5"
                      onClick={() => setSelected(user)}
                    >
                      مشاهده
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2.5">
                      ثبت تراکنش
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="py-2.5">ویرایش</DropdownMenuItem>
                  </EntityActionsMenu>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="taraz-caption">
            صفحه {toPersianDigits(currentPage)} از {toPersianDigits(totalPages)}
          </p>
          <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="default"
                  className="gap-1 ps-1.5"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="صفحه قبلی"
                >
                  <ChevronLeftIcon className="size-4 rtl:rotate-180" />
                  <span className="hidden sm:inline">قبلی</span>
                </Button>
              </PaginationItem>

              {pageItems.map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`e-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <Button
                      type="button"
                      variant={item === currentPage ? "outline" : "ghost"}
                      size="icon"
                      className={cn(
                        item === currentPage &&
                          "border-[color:var(--tz-yellow)] bg-[color:var(--tz-yellow)]/15"
                      )}
                      aria-current={item === currentPage ? "page" : undefined}
                      onClick={() => setPage(item)}
                    >
                      {toPersianDigits(item)}
                    </Button>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="default"
                  className="gap-1 pe-1.5"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="صفحه بعدی"
                >
                  <span className="hidden sm:inline">بعدی</span>
                  <ChevronRightIcon className="size-4 rtl:rotate-180" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
      </div>

      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <SheetContent side="left" className="w-[min(22rem,100vw)] sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader className="text-start">
                <SheetTitle className="flex items-center gap-3">
                  <CounterpartyAvatar
                    user={selected}
                    className="size-14"
                    fallbackClassName="text-base"
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="taraz-subtitle">{selected.name}</span>
                    <span className="taraz-muted font-normal">
                      {selected.role} · {selected.city}
                    </span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="taraz-body-text mt-4 space-y-4 px-1">
                <div className="grid grid-cols-2 gap-3 border-y py-4">
                  <div>
                    <p className="taraz-muted">مانده</p>
                    <p className="taraz-amount mt-1 font-bold">
                      {selected.balance === 0
                        ? "بدون مانده"
                        : formatToman(Math.abs(selected.balance))}
                    </p>
                  </div>
                  <div>
                    <p className="taraz-muted">وضعیت</p>
                    <div className="mt-1">
                      <UserStatusBadge status={selected.status} />
                    </div>
                  </div>
                </div>
                <dl className="space-y-3">
                  <div>
                    <dt className="taraz-muted">ایمیل</dt>
                    <dd className="mt-0.5" dir="ltr">
                      {selected.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="taraz-muted">تماس</dt>
                    <dd className="taraz-num mt-0.5" dir="ltr">
                      {selected.phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="taraz-muted">عضویت</dt>
                    <dd className="taraz-num mt-0.5">
                      {formatJalaliDate(selected.joinedAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="taraz-muted">آخرین فعالیت</dt>
                    <dd className="mt-0.5">{selected.lastActivity}</dd>
                  </div>
                </dl>
                <Button className="taraz-btn-lg taraz-btn-primary w-full">
                  ثبت تراکنش جدید
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
