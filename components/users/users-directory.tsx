"use client"

import * as React from "react"
import {
  MailIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"

import { formatJalaliDate, formatCount } from "@/lib/format"
import { toPersianDigits } from "@/lib/digits"
import { users, type User, type UserRole } from "@/lib/mock/users"
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu"
import { UserStatusBadge } from "@/components/shared/status-badges"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SearchField } from "@/components/shared/search-field"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TabKey = "all" | "team" | "customers"

function matchesTab(user: User, tab: TabKey) {
  if (tab === "team") return user.role !== "مشتری"
  if (tab === "customers") return user.role === "مشتری"
  return true
}

export function UsersDirectory() {
  const [query, setQuery] = React.useState("")
  const [tab, setTab] = React.useState<TabKey>("all")

  const filtered = users.filter((user) => {
    const q =
      !query ||
      user.name.includes(query) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.city.includes(query)
    return q && matchesTab(user, tab)
  })

  const teamCount = users.filter((u) => u.role !== "مشتری").length
  const customerCount = users.filter((u) => u.role === "مشتری").length

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryTile label="کل کاربران" value={formatCount(users.length)} />
        <SummaryTile label="اعضای تیم" value={formatCount(teamCount)} />
        <SummaryTile label="مشتریان" value={formatCount(customerCount)} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button className="w-full shrink-0 sm:w-auto">
          <UserPlusIcon data-icon="inline-start" />
          دعوت کاربر
        </Button>
        <SearchField
          wrapperClassName="flex-1 sm:max-w-md"
          placeholder="جستجو بر اساس نام، ایمیل یا شهر…"
          aria-label="جستجوی کاربران"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab((value as TabKey) ?? "all")}
      >
        <TabsList>
          <TabsTrigger value="all">همه</TabsTrigger>
          <TabsTrigger value="team">تیم داخلی</TabsTrigger>
          <TabsTrigger value="customers">مشتریان</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <Empty className="border border-dashed py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UsersIcon />
                </EmptyMedia>
                <EmptyTitle>کاربری پیدا نشد</EmptyTitle>
                <EmptyDescription>
                  عبارت جستجو یا تب انتخاب‌شده را تغییر دهید.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border px-4 py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  )
}

function UserCard({ user }: { user: User }) {
  return (
    <Card size="sm" className="bg-card">
      <CardHeader className="border-b pb-3">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{user.name}</CardTitle>
            <CardDescription
              className="mt-1 flex min-w-0 items-center gap-1"
              dir="ltr"
            >
              <MailIcon className="size-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
            </CardDescription>
          </div>
          <EntityActionsMenu label={`عملیات کاربر ${user.name}`}>
            <DropdownMenuItem>ارسال پیام</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">تعلیق حساب</DropdownMenuItem>
          </EntityActionsMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-3">
        <div className="flex flex-wrap gap-1.5">
          <RoleBadge role={user.role} />
          <UserStatusBadge status={user.status} />
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon className="size-3.5" />
          {user.city}
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">عضویت</p>
            <p className="font-medium tabular-nums">
              {formatJalaliDate(user.joinedAt)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">سفارش‌ها</p>
            <p className="font-medium tabular-nums">
              {toPersianDigits(user.orders)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          جزئیات
        </Button>
      </CardFooter>
    </Card>
  )
}

function RoleBadge({ role }: { role: UserRole }) {
  return <Badge variant="outline">{role}</Badge>
}
