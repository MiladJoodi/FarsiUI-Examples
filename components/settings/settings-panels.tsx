"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function SettingsPanels() {
  const { theme, setTheme } = useTheme()
  const [emailNotif, setEmailNotif] = React.useState(true)
  const [orderNotif, setOrderNotif] = React.useState(true)
  const [stockNotif, setStockNotif] = React.useState(false)
  const [compact, setCompact] = React.useState(false)

  return (
    <div className="space-y-4">
      <Tabs defaultValue="account" className="gap-4">
        <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="account">حساب کاربری</TabsTrigger>
          <TabsTrigger value="profile">اطلاعات شخصی</TabsTrigger>
          <TabsTrigger value="notifications">اعلان‌ها</TabsTrigger>
          <TabsTrigger value="appearance">ظاهر</TabsTrigger>
          <TabsTrigger value="system">سیستم</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="rounded-xl border p-4 sm:p-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="account-email">ایمیل ورود</FieldLabel>
              <Input
                id="account-email"
                type="email"
                defaultValue="nima.kazemi@hamyar.ir"
                dir="ltr"
                className="max-w-md text-start"
              />
              <FieldDescription>
                برای ورود به پنل از این ایمیل استفاده می‌شود.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="account-phone">شماره موبایل</FieldLabel>
              <Input
                id="account-phone"
                defaultValue="۰۹۱۲۱۲۳۴۵۶۷"
                className="max-w-md"
              />
            </Field>
            <FieldSeparator />
            <div className="flex flex-wrap gap-2">
              <Button type="button">ذخیره تغییرات</Button>
              <Button type="button" variant="outline">
                تغییر رمز عبور
              </Button>
            </div>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="profile" className="rounded-xl border p-4 sm:p-6">
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="first-name">نام</FieldLabel>
                <Input id="first-name" defaultValue="نیما" />
              </Field>
              <Field>
                <FieldLabel htmlFor="last-name">نام خانوادگی</FieldLabel>
                <Input id="last-name" defaultValue="کاظمی" />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="role-title">سمت سازمانی</FieldLabel>
              <Input id="role-title" defaultValue="مدیر فروش" className="max-w-md" />
            </Field>
            <Field>
              <FieldLabel htmlFor="bio">درباره</FieldLabel>
              <Textarea
                id="bio"
                defaultValue="مسئول پیگیری فروش و هماهنگی تیم پشتیبانی در همیار."
                className="max-w-xl"
              />
            </Field>
            <Button type="button" className="w-fit">
              به‌روزرسانی پروفایل
            </Button>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="notifications" className="rounded-xl border p-4 sm:p-6">
          <FieldGroup>
            <Field orientation="horizontal" className="items-center justify-between gap-4">
              <div className="space-y-1">
                <FieldLabel>اعلان ایمیلی</FieldLabel>
                <FieldDescription>
                  خلاصه روزانه فعالیت‌ها به ایمیل ارسال شود.
                </FieldDescription>
              </div>
              <Switch
                checked={emailNotif}
                onCheckedChange={setEmailNotif}
                aria-label="اعلان ایمیلی"
              />
            </Field>
            <Field orientation="horizontal" className="items-center justify-between gap-4">
              <div className="space-y-1">
                <FieldLabel>سفارش‌های جدید</FieldLabel>
                <FieldDescription>
                  هنگام ثبت سفارش تازه، اعلان فوری دریافت کنید.
                </FieldDescription>
              </div>
              <Switch
                checked={orderNotif}
                onCheckedChange={setOrderNotif}
                aria-label="اعلان سفارش"
              />
            </Field>
            <Field orientation="horizontal" className="items-center justify-between gap-4">
              <div className="space-y-1">
                <FieldLabel>هشدار موجودی</FieldLabel>
                <FieldDescription>
                  وقتی موجودی محصول کمتر از حد شود اطلاع دهید.
                </FieldDescription>
              </div>
              <Switch
                checked={stockNotif}
                onCheckedChange={setStockNotif}
                aria-label="هشدار موجودی"
              />
            </Field>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="appearance" className="rounded-xl border p-4 sm:p-6">
          <FieldGroup>
            <Field>
              <FieldLabel>تم ظاهری</FieldLabel>
              <Select
                value={theme ?? "system"}
                onValueChange={(value) => setTheme(value ?? "system")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="انتخاب تم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">روشن</SelectItem>
                  <SelectItem value="dark">تاریک</SelectItem>
                  <SelectItem value="system">سیستم</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                تم تاریک و روشن با توکن‌های FarsiUI هماهنگ است.
              </FieldDescription>
            </Field>
            <Field orientation="horizontal" className="items-center justify-between gap-4">
              <div className="space-y-1">
                <FieldLabel>چیدمان فشرده</FieldLabel>
                <FieldDescription>
                  فاصله‌ها و ارتفاع ردیف‌های جدول کمتر شود.
                </FieldDescription>
              </div>
              <Switch
                checked={compact}
                onCheckedChange={setCompact}
                aria-label="چیدمان فشرده"
              />
            </Field>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="system" className="rounded-xl border p-4 sm:p-6">
          <FieldGroup>
            <Field>
              <FieldLabel>منطقه زمانی</FieldLabel>
              <Select defaultValue="tehran">
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tehran">تهران (ایران)</SelectItem>
                  <SelectItem value="utc">زمان جهانی</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>زبان رابط</FieldLabel>
              <Select defaultValue="fa">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fa">فارسی</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                این نمونه فقط رابط فارسی را پشتیبانی می‌کند.
              </FieldDescription>
            </Field>
            <FieldSeparator />
            <Button type="button" variant="outline" className="w-fit">
              ذخیره تنظیمات سیستم
            </Button>
          </FieldGroup>
        </TabsContent>
      </Tabs>
    </div>
  )
}
