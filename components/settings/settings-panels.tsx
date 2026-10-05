"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { defaultSettings } from "@/lib/mock/settings"
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
import { toast } from "sonner"

const fieldControlClass = "taraz-control max-w-sm"
const tabBodyClass = "border-y border-[color:var(--tz-line)] py-5"
const labelClass = "text-base"
const descClass = "text-sm"

function notifySaved(title = "تغییرات ذخیره شد") {
  toast.success(title, {
    description: "با موفقیت تأیید و ذخیره شد.",
  })
}

export function SettingsPanels() {
  const { theme, setTheme } = useTheme()
  const [emailNotif, setEmailNotif] = React.useState(true)
  const [settlementNotif, setSettlementNotif] = React.useState(true)
  const [mismatchNotif, setMismatchNotif] = React.useState(true)
  const [twoFactor, setTwoFactor] = React.useState(
    defaultSettings.security.twoFactor
  )
  const [withdrawConfirm, setWithdrawConfirm] = React.useState(true)
  const [persianDigits, setPersianDigits] = React.useState(true)
  const [jalaliCal, setJalaliCal] = React.useState(true)

  return (
    <div className="max-w-2xl space-y-5">
      <div className="taraz-panel taraz-settings p-4 sm:p-6">
        <Tabs defaultValue="account" className="gap-5">
          <TabsList
            variant="line"
            className="taraz-settings-tabs h-auto w-fit max-w-full flex-wrap justify-start gap-1 [&_[data-slot=tabs-trigger]]:flex-none [&_[data-slot=tabs-trigger]]:px-3 [&_[data-slot=tabs-trigger]]:text-base"
          >
            <TabsTrigger value="account">حساب</TabsTrigger>
            <TabsTrigger value="profile">پروفایل</TabsTrigger>
            <TabsTrigger value="notifications">اعلان‌ها</TabsTrigger>
            <TabsTrigger value="security">امنیت</TabsTrigger>
            <TabsTrigger value="display">نمایش</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className={tabBodyClass}>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="account-email" className={labelClass}>
                  ایمیل ورود
                </FieldLabel>
                <Input
                  id="account-email"
                  type="email"
                  defaultValue={defaultSettings.account.email}
                  dir="ltr"
                  className={`${fieldControlClass} text-start`}
                />
                <FieldDescription className={descClass}>
                  برای ورود به تراز از این ایمیل استفاده می‌شود.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="account-phone" className={labelClass}>
                  شماره موبایل
                </FieldLabel>
                <Input
                  id="account-phone"
                  defaultValue={defaultSettings.account.phone}
                  className={fieldControlClass}
                />
                <FieldDescription className={descClass}>
                  برای تأیید برداشت‌های بالای سقف روزانه.
                </FieldDescription>
              </Field>
              <FieldSeparator />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="taraz-btn-lg taraz-btn-primary"
                  onClick={() => notifySaved()}
                >
                  ذخیره تغییرات
                </Button>
                <Button type="button" variant="outline" className="taraz-btn-md">
                  تغییر رمز عبور
                </Button>
              </div>
            </FieldGroup>
          </TabsContent>

          <TabsContent value="profile" className={tabBodyClass}>
            <FieldGroup className="gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="first-name" className={labelClass}>
                    نام
                  </FieldLabel>
                  <Input
                    id="first-name"
                    defaultValue={defaultSettings.profile.firstName}
                    className="taraz-control"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name" className={labelClass}>
                    نام خانوادگی
                  </FieldLabel>
                  <Input
                    id="last-name"
                    defaultValue={defaultSettings.profile.lastName}
                    className="taraz-control"
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="role-title" className={labelClass}>
                  سمت
                </FieldLabel>
                <Input
                  id="role-title"
                  defaultValue={defaultSettings.profile.role}
                  className={fieldControlClass}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="bio" className={labelClass}>
                  درباره
                </FieldLabel>
                <Textarea
                  id="bio"
                  defaultValue={defaultSettings.profile.bio}
                  className="taraz-control min-h-28 max-w-md !h-auto py-2.5 text-base"
                />
              </Field>
              <Button
                type="button"
                className="taraz-btn-lg taraz-btn-primary w-fit"
                onClick={() => notifySaved("پروفایل به‌روز شد")}
              >
                به‌روزرسانی پروفایل
              </Button>
            </FieldGroup>
          </TabsContent>

          <TabsContent value="notifications" className={tabBodyClass}>
            <FieldGroup className="gap-5">
              <Field
                orientation="horizontal"
                className="taraz-settings-row items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <FieldLabel className={labelClass}>خلاصه ایمیلی</FieldLabel>
                  <FieldDescription className={descClass}>
                    گزارش روزانه ورود و خروج وجوه.
                  </FieldDescription>
                </div>
                <Switch
                  checked={emailNotif}
                  onCheckedChange={setEmailNotif}
                  aria-label="خلاصه ایمیلی"
                  className="taraz-switch"
                />
              </Field>
              <Field
                orientation="horizontal"
                className="taraz-settings-row items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <FieldLabel className={labelClass}>اعلان تسویه</FieldLabel>
                  <FieldDescription className={descClass}>
                    وقتی وضعیت تسویه بانکی عوض شود خبر بده.
                  </FieldDescription>
                </div>
                <Switch
                  checked={settlementNotif}
                  onCheckedChange={setSettlementNotif}
                  aria-label="اعلان تسویه"
                  className="taraz-switch"
                />
              </Field>
              <Field
                orientation="horizontal"
                className="taraz-settings-row items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <FieldLabel className={labelClass}>مغایرت بانکی</FieldLabel>
                  <FieldDescription className={descClass}>
                    اختلاف مبلغ رسید و تراکنش ثبت‌شده را فوری اعلام کن.
                  </FieldDescription>
                </div>
                <Switch
                  checked={mismatchNotif}
                  onCheckedChange={setMismatchNotif}
                  aria-label="مغایرت بانکی"
                  className="taraz-switch"
                />
              </Field>
            </FieldGroup>
          </TabsContent>

          <TabsContent value="security" className={tabBodyClass}>
            <FieldGroup className="gap-5">
              <Field
                orientation="horizontal"
                className="taraz-settings-row items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <FieldLabel className={labelClass}>تأیید دو مرحله‌ای</FieldLabel>
                  <FieldDescription className={descClass}>
                    ورود با کد پیامکی علاوه بر رمز.
                  </FieldDescription>
                </div>
                <Switch
                  checked={twoFactor}
                  onCheckedChange={setTwoFactor}
                  aria-label="تأیید دو مرحله‌ای"
                  className="taraz-switch"
                />
              </Field>
              <Field
                orientation="horizontal"
                className="taraz-settings-row items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <FieldLabel className={labelClass}>
                    تأیید دوم برای برداشت
                  </FieldLabel>
                  <FieldDescription className={descClass}>
                    برداشت‌های بالای سقف نیاز به تأیید مدیر دوم دارند.
                  </FieldDescription>
                </div>
                <Switch
                  checked={withdrawConfirm}
                  onCheckedChange={setWithdrawConfirm}
                  aria-label="تأیید دوم برداشت"
                  className="taraz-switch"
                />
              </Field>
              <Field>
                <FieldLabel className={labelClass}>سقف برداشت روزانه</FieldLabel>
                <Input
                  defaultValue="۵۰٬۰۰۰٬۰۰۰"
                  className={fieldControlClass}
                  dir="ltr"
                />
                <FieldDescription className={descClass}>
                  مبلغ به تومان
                </FieldDescription>
              </Field>
              <Button
                type="button"
                className="taraz-btn-lg taraz-btn-primary w-fit"
                onClick={() => notifySaved("تنظیمات امنیت ذخیره شد")}
              >
                ذخیره امنیت
              </Button>
            </FieldGroup>
          </TabsContent>

          <TabsContent value="display" className={tabBodyClass}>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel className={labelClass}>تم ظاهری</FieldLabel>
                <Select
                  value={theme ?? "system"}
                  onValueChange={(value) => setTheme(value ?? "system")}
                  items={{
                    light: "روشن",
                    dark: "تاریک",
                    system: "سیستم",
                  }}
                >
                  <SelectTrigger className="taraz-control taraz-control-pill w-full max-w-sm">
                    <SelectValue placeholder="انتخاب تم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">روشن</SelectItem>
                    <SelectItem value="dark">تاریک</SelectItem>
                    <SelectItem value="system">سیستم</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field
                orientation="horizontal"
                className="taraz-settings-row items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <FieldLabel className={labelClass}>ارقام فارسی</FieldLabel>
                  <FieldDescription className={descClass}>
                    مبالغ و تاریخ‌ها با ارقام فارسی نمایش داده شوند.
                  </FieldDescription>
                </div>
                <Switch
                  checked={persianDigits}
                  onCheckedChange={setPersianDigits}
                  aria-label="ارقام فارسی"
                  className="taraz-switch"
                />
              </Field>
              <Field
                orientation="horizontal"
                className="taraz-settings-row items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <FieldLabel className={labelClass}>تقویم جلالی</FieldLabel>
                  <FieldDescription className={descClass}>
                    تاریخ‌های پنل بر اساس تقویم جلالی باشند.
                  </FieldDescription>
                </div>
                <Switch
                  checked={jalaliCal}
                  onCheckedChange={setJalaliCal}
                  aria-label="تقویم جلالی"
                  className="taraz-switch"
                />
              </Field>
              <Field>
                <FieldLabel className={labelClass}>منطقه زمانی</FieldLabel>
                <Select
                  defaultValue="tehran"
                  items={{
                    tehran: "تهران (ایران)",
                    utc: "زمان جهانی",
                  }}
                >
                  <SelectTrigger className="taraz-control taraz-control-pill w-full max-w-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tehran">تهران (ایران)</SelectItem>
                    <SelectItem value="utc">زمان جهانی</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Button
                type="button"
                className="taraz-btn-lg taraz-btn-primary w-fit"
                onClick={() => notifySaved("تنظیمات نمایش ذخیره شد")}
              >
                ذخیره نمایش
              </Button>
            </FieldGroup>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
