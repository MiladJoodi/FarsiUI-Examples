"use client"

import {
  BellIcon,
  LockIcon,
  MenuIcon,
  PaletteIcon,
  Settings2Icon,
  ShieldIcon,
  UserIcon,
  UserRoundIcon,
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import {
  cloneSettings,
  defaultSettings,
  isSettingsSectionId,
  mockSessions,
  settingsSections,
  type SettingsSectionId,
  type SettingsState,
  type SessionItem,
} from "@/lib/mock/settings"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const SECTION_ICONS: Record<
  SettingsSectionId,
  React.ComponentType<{ className?: string }>
> = {
  profile: UserRoundIcon,
  account: UserIcon,
  appearance: PaletteIcon,
  notifications: BellIcon,
  privacy: ShieldIcon,
  security: LockIcon,
  preferences: Settings2Icon,
}

function settingsEqual(a: SettingsState, b: SettingsState) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function SettingsView({
  initialSection = "profile",
}: {
  initialSection?: SettingsSectionId
}) {
  const [section, setSection] = React.useState<SettingsSectionId>(initialSection)
  const [saved, setSaved] = React.useState(() => cloneSettings(defaultSettings))
  const [draft, setDraft] = React.useState(() => cloneSettings(defaultSettings))
  const [sessions, setSessions] = React.useState<SessionItem[]>(mockSessions)
  const [navOpen, setNavOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [revokeOpen, setRevokeOpen] = React.useState(false)
  const [password, setPassword] = React.useState({
    current: "",
    next: "",
    confirm: "",
  })
  const [passwordError, setPasswordError] = React.useState<string | null>(null)

  const dirty = !settingsEqual(draft, saved)
  const meta = settingsSections.find((s) => s.id === section)!

  function update<K extends keyof SettingsState>(
    key: K,
    patch: Partial<SettingsState[K]>
  ) {
    setDraft((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }))
  }

  function selectSection(id: SettingsSectionId) {
    setSection(id)
    setNavOpen(false)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("section", id)
      window.history.replaceState({}, "", url.toString())
    }
  }

  function handleSave() {
    setSaved(cloneSettings(draft))
    toast.success("تغییرات ذخیره شد", {
      description: "این ذخیره فقط در همین نمونه نگه داشته می‌شود.",
    })
  }

  function handleCancel() {
    setDraft(cloneSettings(saved))
    setPassword({ current: "", next: "", confirm: "" })
    setPasswordError(null)
    toast.message("تغییرات لغو شد")
  }

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (!password.current || !password.next) {
      setPasswordError("رمز فعلی و رمز جدید را وارد کنید.")
      return
    }
    if (password.next.length < 8) {
      setPasswordError("رمز جدید باید حداقل ۸ نویسه باشد.")
      return
    }
    if (password.next !== password.confirm) {
      setPasswordError("تکرار رمز با رمز جدید یکسان نیست.")
      return
    }
    setPasswordError(null)
    setPassword({ current: "", next: "", confirm: "" })
    toast.success("رمز عبور به‌روزرسانی شد", {
      description: "در این نمونه تغییری در سرور رخ نمی‌دهد.",
    })
  }

  function revokeOtherSessions() {
    setSessions((prev) => prev.filter((s) => s.current))
    setRevokeOpen(false)
    toast.success("نشست‌های دیگر خارج شدند")
  }

  function confirmDeleteAccount() {
    setDeleteOpen(false)
    toast.message("حذف حساب در این نمونه غیرفعال است")
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          تنظیمات
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          حساب، ظاهر، اعلان‌ها و امنیت فضای کاری را از اینجا مدیریت کنید. همه
          تغییرات محلی و نمایشی هستند.
        </p>
      </header>

      {dirty && (
        <Alert className="border-primary/25 bg-primary/5">
          <AlertTitle>تغییرات ذخیره‌نشده</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>قبل از ترک این صفحه، ذخیره یا لغو را انتخاب کنید.</span>
            <span className="flex shrink-0 flex-wrap gap-2">
              <Button size="sm" type="button" onClick={handleSave}>
                ذخیره
              </Button>
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                لغو
              </Button>
            </span>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-10">
        {/* Desktop nav */}
        <nav
          aria-label="بخش‌های تنظیمات"
          className="hidden lg:block"
        >
          <ul className="sticky top-20 space-y-0.5">
            {settingsSections.map((item) => {
              const Icon = SECTION_ICONS[item.id]
              const active = item.id === section
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectSection(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="size-4 shrink-0 opacity-70" />
                    {item.title}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Mobile / tablet nav */}
        <div className="flex flex-wrap items-center gap-2 lg:hidden">
          <Select
            value={section}
            onValueChange={(v) => {
              if (v && isSettingsSectionId(v)) selectSection(v)
            }}
            items={Object.fromEntries(
              settingsSections.map((item) => [item.id, item.title])
            )}
          >
            <SelectTrigger className="min-w-[12rem] flex-1" aria-label="بخش تنظیمات">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {settingsSections.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="فهرست بخش‌ها"
            onClick={() => setNavOpen(true)}
          >
            <MenuIcon className="size-4" />
          </Button>
        </div>

        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetContent side="right" className="w-[min(20rem,100%)]">
            <SheetHeader className="text-start">
              <SheetTitle>بخش‌های تنظیمات</SheetTitle>
              <SheetDescription>
                بخش مورد نظر را انتخاب کنید.
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4 pb-6" aria-label="فهرست موبایل">
              {settingsSections.map((item) => {
                const Icon = SECTION_ICONS[item.id]
                const active = item.id === section
                return (
                  <Button
                    key={item.id}
                    type="button"
                    variant="ghost"
                    className={cn("justify-start gap-2", active && "bg-muted")}
                    onClick={() => selectSection(item.id)}
                  >
                    <Icon className="size-4 opacity-70" />
                    {item.title}
                  </Button>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="min-w-0 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">{meta.title}</h2>
            <p className="text-sm text-muted-foreground">{meta.description}</p>
          </div>

          <Separator />

          {section === "profile" && (
            <ProfileSection
              value={draft.profile}
              onChange={(patch) => update("profile", patch)}
            />
          )}
          {section === "account" && (
            <AccountSection
              value={draft.account}
              onChange={(patch) => update("account", patch)}
              onRequestDelete={() => setDeleteOpen(true)}
            />
          )}
          {section === "appearance" && (
            <AppearanceSection
              value={draft.appearance}
              onChange={(patch) => update("appearance", patch)}
            />
          )}
          {section === "notifications" && (
            <NotificationsSection
              value={draft.notifications}
              onChange={(patch) => update("notifications", patch)}
            />
          )}
          {section === "privacy" && (
            <PrivacySection
              value={draft.privacy}
              onChange={(patch) => update("privacy", patch)}
            />
          )}
          {section === "security" && (
            <SecuritySection
              value={draft.security}
              onChange={(patch) => update("security", patch)}
              sessions={sessions}
              password={password}
              passwordError={passwordError}
              onPasswordChange={setPassword}
              onPasswordSubmit={handlePasswordChange}
              onRevokeOthers={() => setRevokeOpen(true)}
            />
          )}
          {section === "preferences" && (
            <PreferencesSection
              value={draft.preferences}
              onChange={(patch) => update("preferences", patch)}
            />
          )}

          <div className="flex flex-wrap gap-2 border-t pt-5">
            <Button type="button" onClick={handleSave} disabled={!dirty}>
              ذخیره تغییرات
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={!dirty}
            >
              لغو
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف حساب کاربری؟</AlertDialogTitle>
            <AlertDialogDescription>
              این عمل در محصول واقعی غیرقابل بازگشت است. در این نمونه فقط پیام
              نمایشی نشان داده می‌شود و داده‌ای پاک نمی‌شود.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteAccount}
            >
              حذف حساب
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={revokeOpen} onOpenChange={setRevokeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>خروج از نشست‌های دیگر؟</AlertDialogTitle>
            <AlertDialogDescription>
              همه دستگاه‌ها به‌جز همین نشست فعلی از حساب خارج می‌شوند.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction onClick={revokeOtherSessions}>
              خروج از بقیه
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function SettingRow({
  title,
  description,
  control,
}: {
  title: string
  description: string
  control: React.ReactNode
}) {
  return (
    <Field
      orientation="horizontal"
      className="items-start justify-between gap-4 py-1 sm:items-center"
    >
      <div className="min-w-0 space-y-0.5">
        <FieldLabel className="text-sm font-medium">{title}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
      </div>
      <div className="shrink-0">{control}</div>
    </Field>
  )
}

function ProfileSection({
  value,
  onChange,
}: {
  value: SettingsState["profile"]
  onChange: (patch: Partial<SettingsState["profile"]>) => void
}) {
  return (
    <FieldGroup>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="settings-first-name">نام</FieldLabel>
          <Input
            id="settings-first-name"
            value={value.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            autoComplete="given-name"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="settings-last-name">نام خانوادگی</FieldLabel>
          <Input
            id="settings-last-name"
            value={value.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            autoComplete="family-name"
          />
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="settings-display-name">نام نمایشی</FieldLabel>
        <Input
          id="settings-display-name"
          value={value.displayName}
          onChange={(e) => onChange({ displayName: e.target.value })}
          className="max-w-md"
        />
        <FieldDescription>
          این نام در پیام‌ها و فهرست اعضا دیده می‌شود.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="settings-role">سمت</FieldLabel>
        <Input
          id="settings-role"
          value={value.role}
          onChange={(e) => onChange({ role: e.target.value })}
          className="max-w-md"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="settings-bio">معرفی کوتاه</FieldLabel>
        <Textarea
          id="settings-bio"
          rows={4}
          value={value.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          className="max-w-xl"
          persianDigits={false}
        />
      </Field>
    </FieldGroup>
  )
}

function AccountSection({
  value,
  onChange,
  onRequestDelete,
}: {
  value: SettingsState["account"]
  onChange: (patch: Partial<SettingsState["account"]>) => void
  onRequestDelete: () => void
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="settings-email">ایمیل ورود</FieldLabel>
        <Input
          id="settings-email"
          type="email"
          dir="ltr"
          className="max-w-md text-start"
          value={value.email}
          onChange={(e) => onChange({ email: e.target.value })}
          autoComplete="email"
        />
        <FieldDescription>
          برای بازیابی حساب و اعلان‌های امنیتی استفاده می‌شود.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="settings-phone">شماره موبایل</FieldLabel>
        <Input
          id="settings-phone"
          inputMode="tel"
          value={value.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="max-w-md"
          autoComplete="tel"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="settings-username">نام کاربری</FieldLabel>
        <Input
          id="settings-username"
          dir="ltr"
          className="max-w-md text-start"
          value={value.username}
          onChange={(e) => onChange({ username: e.target.value })}
          autoComplete="username"
        />
      </Field>
      <FieldSeparator />
      <div className="space-y-2">
        <p className="text-sm font-medium text-destructive">منطقه خطر</p>
        <p className="text-sm text-muted-foreground">
          حذف حساب همه داده‌های نمایشی مرتبط را در محصول واقعی پاک می‌کند.
        </p>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRequestDelete}
        >
          حذف حساب کاربری
        </Button>
      </div>
    </FieldGroup>
  )
}

function AppearanceSection({
  value,
  onChange,
}: {
  value: SettingsState["appearance"]
  onChange: (patch: Partial<SettingsState["appearance"]>) => void
}) {
  return (
    <FieldGroup>
      <Alert>
        <AlertTitle>تم روشن و تاریک</AlertTitle>
        <AlertDescription>
          تغییر تم کلی از دکمهٔ ظاهر در نوار بالا انجام می‌شود. دیزاین‌سیستم هم
          از همان‌جا قابل تعویض است.
        </AlertDescription>
      </Alert>

      <Field>
        <FieldLabel>تراکم رابط</FieldLabel>
        <RadioGroup
          value={value.density}
          onValueChange={(v) => {
            if (v === "comfortable" || v === "compact") {
              onChange({ density: v })
            }
          }}
          className="mt-2 gap-2"
        >
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 has-data-checked:border-primary">
            <RadioGroupItem value="comfortable" className="mt-0.5" />
            <span>
              <span className="block text-sm font-medium">راحت</span>
              <span className="text-xs text-muted-foreground">
                فاصله بیشتر؛ مناسب صفحات خواندنی.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 has-data-checked:border-primary">
            <RadioGroupItem value="compact" className="mt-0.5" />
            <span>
              <span className="block text-sm font-medium">فشرده</span>
              <span className="text-xs text-muted-foreground">
                برای فهرست‌های شلوغ و مانیتورهای کوچک‌تر.
              </span>
            </span>
          </label>
        </RadioGroup>
      </Field>

      <Field>
        <FieldLabel>سبک فهرست</FieldLabel>
        <Select
          value={value.listStyle}
          onValueChange={(v) => {
            if (v === "comfortable" || v === "dense") {
              onChange({ listStyle: v })
            }
          }}
          items={{
            comfortable: "با فاصله استاندارد",
            dense: "ردیف‌های متراکم",
          }}
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="comfortable">با فاصله استاندارد</SelectItem>
            <SelectItem value="dense">ردیف‌های متراکم</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <SettingRow
        title="نمایش آواتار"
        description="آواتار اعضا در فهرست‌ها و پیام‌ها نشان داده شود."
        control={
          <Switch
            checked={value.showAvatars}
            onCheckedChange={(checked) => onChange({ showAvatars: checked })}
            aria-label="نمایش آواتار"
          />
        }
      />
    </FieldGroup>
  )
}

function NotificationsSection({
  value,
  onChange,
}: {
  value: SettingsState["notifications"]
  onChange: (patch: Partial<SettingsState["notifications"]>) => void
}) {
  return (
    <FieldGroup>
      <p className="text-sm font-medium">کانال‌ها</p>
      <SettingRow
        title="ایمیل"
        description="خلاصه و هشدارها به صندوق ورودی شما."
        control={
          <Switch
            checked={value.email}
            onCheckedChange={(c) => onChange({ email: c })}
            aria-label="اعلان ایمیلی"
          />
        }
      />
      <SettingRow
        title="اعلان مرورگر"
        description="پیام فوری وقتی پنجره باز است."
        control={
          <Switch
            checked={value.push}
            onCheckedChange={(c) => onChange({ push: c })}
            aria-label="اعلان مرورگر"
          />
        }
      />
      <SettingRow
        title="پیامک"
        description="فقط برای هشدارهای امنیتی مهم."
        control={
          <Switch
            checked={value.sms}
            onCheckedChange={(c) => onChange({ sms: c })}
            aria-label="اعلان پیامکی"
          />
        }
      />

      <FieldSeparator />
      <p className="text-sm font-medium">موضوع‌ها</p>
      <div className="space-y-3">
        {(
          [
            ["productUpdates", "به‌روزرسانی محصول", "ویژگی‌های جدید و تغییرات مهم"],
            ["securityAlerts", "هشدار امنیتی", "ورود مشکوک و تغییر رمز"],
            ["weeklyDigest", "خلاصه هفتگی", "یک‌شنبه صبح، خلاصه فعالیت‌ها"],
            ["mentions", "منشن و پاسخ", "وقتی کسی شما را صدا می‌زند"],
          ] as const
        ).map(([key, title, desc]) => (
          <label key={key} className="flex cursor-pointer items-start gap-3">
            <Checkbox
              className="mt-0.5"
              checked={value[key]}
              onCheckedChange={(checked) =>
                onChange({ [key]: checked === true })
              }
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium">{title}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </span>
          </label>
        ))}
      </div>
    </FieldGroup>
  )
}

function PrivacySection({
  value,
  onChange,
}: {
  value: SettingsState["privacy"]
  onChange: (patch: Partial<SettingsState["privacy"]>) => void
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>دیده شدن پروفایل</FieldLabel>
        <RadioGroup
          value={value.profileVisibility}
          onValueChange={(v) => {
            if (v === "team" || v === "workspace" || v === "private") {
              onChange({ profileVisibility: v })
            }
          }}
          className="mt-2 gap-2"
        >
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 has-data-checked:border-primary">
            <RadioGroupItem value="workspace" className="mt-0.5" />
            <span>
              <span className="block text-sm font-medium">کل فضای کاری</span>
              <span className="text-xs text-muted-foreground">
                همه اعضای سازمان پروفایل شما را می‌بینند.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 has-data-checked:border-primary">
            <RadioGroupItem value="team" className="mt-0.5" />
            <span>
              <span className="block text-sm font-medium">فقط تیم من</span>
              <span className="text-xs text-muted-foreground">
                محدود به اعضای تیم‌هایی که در آن عضو هستید.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 has-data-checked:border-primary">
            <RadioGroupItem value="private" className="mt-0.5" />
            <span>
              <span className="block text-sm font-medium">خصوصی</span>
              <span className="text-xs text-muted-foreground">
                فقط نام نمایشی در منشن‌ها دیده می‌شود.
              </span>
            </span>
          </label>
        </RadioGroup>
      </Field>

      <SettingRow
        title="وضعیت آنلاین"
        description="نشان دهید که الان در دسترس هستید."
        control={
          <Switch
            checked={value.showOnlineStatus}
            onCheckedChange={(c) => onChange({ showOnlineStatus: c })}
            aria-label="وضعیت آنلاین"
          />
        }
      />
      <SettingRow
        title="اجازه منشن"
        description="دیگران بتوانند با @ شما را صدا بزنند."
        control={
          <Switch
            checked={value.allowMentions}
            onCheckedChange={(c) => onChange({ allowMentions: c })}
            aria-label="اجازه منشن"
          />
        }
      />
      <SettingRow
        title="اشتراک فعالیت"
        description="خلاصه فعالیت شما برای همکاران تیم نمایش داده شود."
        control={
          <Switch
            checked={value.shareActivity}
            onCheckedChange={(c) => onChange({ shareActivity: c })}
            aria-label="اشتراک فعالیت"
          />
        }
      />
    </FieldGroup>
  )
}

function SecuritySection({
  value,
  onChange,
  sessions,
  password,
  passwordError,
  onPasswordChange,
  onPasswordSubmit,
  onRevokeOthers,
}: {
  value: SettingsState["security"]
  onChange: (patch: Partial<SettingsState["security"]>) => void
  sessions: SessionItem[]
  password: { current: string; next: string; confirm: string }
  passwordError: string | null
  onPasswordChange: (value: {
    current: string
    next: string
    confirm: string
  }) => void
  onPasswordSubmit: (e: React.FormEvent) => void
  onRevokeOthers: () => void
}) {
  return (
    <FieldGroup>
      <SettingRow
        title="تأیید دو مرحله‌ای"
        description="پس از ورود، کد یک‌بارمصرف درخواست شود."
        control={
          <Switch
            checked={value.twoFactor}
            onCheckedChange={(c) => onChange({ twoFactor: c })}
            aria-label="تأیید دو مرحله‌ای"
          />
        }
      />
      <SettingRow
        title="هشدار ورود جدید"
        description="ورود از دستگاه یا مکان تازه را ایمیل کنید."
        control={
          <Switch
            checked={value.loginAlerts}
            onCheckedChange={(c) => onChange({ loginAlerts: c })}
            aria-label="هشدار ورود جدید"
          />
        }
      />

      <FieldSeparator>تغییر رمز عبور</FieldSeparator>

      <form onSubmit={onPasswordSubmit} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="settings-pass-current">رمز فعلی</FieldLabel>
          <Input
            id="settings-pass-current"
            type="password"
            dir="ltr"
            className="max-w-md text-start"
            autoComplete="current-password"
            value={password.current}
            onChange={(e) =>
              onPasswordChange({ ...password, current: e.target.value })
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="settings-pass-next">رمز جدید</FieldLabel>
          <Input
            id="settings-pass-next"
            type="password"
            dir="ltr"
            className="max-w-md text-start"
            autoComplete="new-password"
            value={password.next}
            onChange={(e) =>
              onPasswordChange({ ...password, next: e.target.value })
            }
          />
        </Field>
        <Field data-invalid={passwordError ? true : undefined}>
          <FieldLabel htmlFor="settings-pass-confirm">تکرار رمز جدید</FieldLabel>
          <Input
            id="settings-pass-confirm"
            type="password"
            dir="ltr"
            className="max-w-md text-start"
            autoComplete="new-password"
            aria-invalid={passwordError ? true : undefined}
            value={password.confirm}
            onChange={(e) =>
              onPasswordChange({ ...password, confirm: e.target.value })
            }
          />
          {passwordError ? (
            <p role="alert" className="text-sm text-destructive">
              {passwordError}
            </p>
          ) : null}
        </Field>
        <Button type="submit" variant="outline" size="sm">
          به‌روزرسانی رمز
        </Button>
      </form>

      <FieldSeparator>نشست‌های فعال</FieldSeparator>

      <ul className="space-y-3">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex flex-wrap items-start justify-between gap-2 border-b pb-3 last:border-0 last:pb-0"
          >
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium">{session.device}</p>
              <p className="text-xs text-muted-foreground">
                {session.location} · {session.lastActive}
              </p>
            </div>
            {session.current ? (
              <Badge variant="secondary">نشست فعلی</Badge>
            ) : null}
          </li>
        ))}
      </ul>

      {sessions.some((s) => !s.current) ? (
        <Button type="button" variant="outline" size="sm" onClick={onRevokeOthers}>
          خروج از بقیه نشست‌ها
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          فقط همین نشست فعال است.
        </p>
      )}
    </FieldGroup>
  )
}

function PreferencesSection({
  value,
  onChange,
}: {
  value: SettingsState["preferences"]
  onChange: (patch: Partial<SettingsState["preferences"]>) => void
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>زبان رابط</FieldLabel>
        <Select
          value={value.language}
          onValueChange={(v) => {
            if (v === "fa") onChange({ language: v })
          }}
          items={{ fa: "فارسی" }}
        >
          <SelectTrigger className="max-w-xs">
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

      <Field>
        <FieldLabel>منطقه زمانی</FieldLabel>
        <Select
          value={value.timezone}
          onValueChange={(v) => {
            if (v === "tehran" || v === "utc") onChange({ timezone: v })
          }}
          items={{
            tehran: "تهران (ایران)",
            utc: "زمان جهانی (UTC)",
          }}
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tehran">تهران (ایران)</SelectItem>
            <SelectItem value="utc">زمان جهانی (UTC)</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel>تقویم</FieldLabel>
        <RadioGroup
          value={value.calendar}
          onValueChange={(v) => {
            if (v === "jalali" || v === "gregorian") onChange({ calendar: v })
          }}
          className="mt-2 gap-2"
        >
          <label className="flex cursor-pointer items-center gap-3">
            <RadioGroupItem value="jalali" />
            <span className="text-sm">شمسی (جلالی)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <RadioGroupItem value="gregorian" />
            <span className="text-sm">میلادی</span>
          </label>
        </RadioGroup>
      </Field>

      <Field>
        <FieldLabel>شروع هفته</FieldLabel>
        <Select
          value={value.weekStartsOn}
          onValueChange={(v) => {
            if (v === "saturday" || v === "sunday") {
              onChange({ weekStartsOn: v })
            }
          }}
          items={{
            saturday: "شنبه",
            sunday: "یکشنبه",
          }}
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="saturday">شنبه</SelectItem>
            <SelectItem value="sunday">یکشنبه</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <SettingRow
        title="ارقام فارسی"
        description="اعداد در رابط با ارقام فارسی نمایش داده شوند."
        control={
          <Switch
            checked={value.persianDigits}
            onCheckedChange={(c) => onChange({ persianDigits: c })}
            aria-label="ارقام فارسی"
          />
        }
      />
    </FieldGroup>
  )
}
