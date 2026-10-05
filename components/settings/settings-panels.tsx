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

const fieldControlClass = "h-9 max-w-sm"

export function SettingsPanels() {
  const { theme, setTheme } = useTheme()
  const [emailNotif, setEmailNotif] = React.useState(true)
  const [orderNotif, setOrderNotif] = React.useState(true)
  const [stockNotif, setStockNotif] = React.useState(false)

  return (
    <div className="max-w-2xl space-y-4">
      <Tabs defaultValue="account" className="gap-4">
        <TabsList
          variant="line"
          className="h-auto w-fit max-w-full flex-wrap justify-start gap-1 [&_[data-slot=tabs-trigger]]:flex-none [&_[data-slot=tabs-trigger]]:px-2.5"
        >
          <TabsTrigger value="account">حساب کاربری</TabsTrigger>
          <TabsTrigger value="profile">اطلاعات شخصی</TabsTrigger>
          <TabsTrigger value="notifications">اعلان‌ها</TabsTrigger>
          <TabsTrigger value="appearance">ظاهر</TabsTrigger>
          <TabsTrigger value="system">سیستم</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="rounded-xl border p-4">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="account-email">ایمیل ورود</FieldLabel>
              <Input
                id="account-email"
                type="email"
                defaultValue="info@farsiui.ir"
                dir="ltr"
                className={`${fieldControlClass} text-start`}
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
                className={fieldControlClass}
              />
            </Field>
            <FieldSeparator />
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm">
                ذخیره تغییرات
              </Button>
              <Button type="button" size="sm" variant="outline">
                تغییر رمز عبور
              </Button>
            </div>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="profile" className="rounded-xl border p-4">
          <FieldGroup className="gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="first-name">نام</FieldLabel>
                <Input
                  id="first-name"
                  defaultValue="نیما"
                  className="h-9"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="last-name">نام خانوادگی</FieldLabel>
                <Input
                  id="last-name"
                  defaultValue="کاظمی"
                  className="h-9"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="role-title">سمت سازمانی</FieldLabel>
              <Input
                id="role-title"
                defaultValue="مدیر فروش"
                className={fieldControlClass}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bio">درباره</FieldLabel>
              <Textarea
                id="bio"
                defaultValue="مسئول پیگیری فروش و هماهنگی تیم پشتیبانی در همیار."
                className="min-h-20 max-w-md text-sm"
              />
            </Field>
            <Button type="button" size="sm" className="w-fit">
              به‌روزرسانی پروفایل
            </Button>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="notifications" className="rounded-xl border p-4">
          <FieldGroup className="gap-4">
            <Field
              orientation="horizontal"
              className="items-center justify-between gap-4"
            >
              <div className="space-y-0.5">
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
            <Field
              orientation="horizontal"
              className="items-center justify-between gap-4"
            >
              <div className="space-y-0.5">
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
            <Field
              orientation="horizontal"
              className="items-center justify-between gap-4"
            >
              <div className="space-y-0.5">
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

        <TabsContent value="appearance" className="rounded-xl border p-4">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>تم ظاهری</FieldLabel>
              <Select
                value={theme ?? "system"}
                onValueChange={(value) => setTheme(value ?? "system")}
                items={{
                  light: "روشن",
                  dark: "تاریک",
                  system: "سیستم",
                }}
              >
                <SelectTrigger className="h-9 w-[160px]">
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
          </FieldGroup>
        </TabsContent>

        <TabsContent value="system" className="rounded-xl border p-4">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>منطقه زمانی</FieldLabel>
              <Select
                defaultValue="tehran"
                items={{
                  tehran: "تهران (ایران)",
                  utc: "زمان جهانی",
                }}
              >
                <SelectTrigger className="h-9 w-[180px]">
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
              <Select defaultValue="fa" items={{ fa: "فارسی" }}>
                <SelectTrigger className="h-9 w-[140px]">
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
            <Button type="button" size="sm" variant="outline" className="w-fit">
              ذخیره تنظیمات سیستم
            </Button>
          </FieldGroup>
        </TabsContent>
      </Tabs>
    </div>
  )
}
