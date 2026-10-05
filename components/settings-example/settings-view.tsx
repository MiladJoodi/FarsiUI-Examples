"use client"

import {
  BellIcon,
  Building2Icon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MenuIcon,
  MonitorIcon,
  PaletteIcon,
  SearchIcon,
  Settings2Icon,
  ShieldCheckIcon,
  ShieldIcon,
  UserIcon,
  UserRoundIcon,
  UsersIcon,
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

function SettingsIcon({
  icon: Icon,
  active,
  large,
}: {
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
  large?: boolean
}) {
  return (
    <span
      className={cn(
        "settings-icon",
        large && "settings-icon-lg",
        active && "settings-icon-active"
      )}
    >
      <Icon />
    </span>
  )
}

function SettingsCard({
  title,
  description,
  icon,
  children,
  className,
  danger,
}: {
  title?: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  className?: string
  danger?: boolean
}) {
  return (
    <section
      className={cn(
        "settings-card",
        danger && "settings-card-danger",
        className
      )}
    >
      {(title || description) && (
        <div className="settings-card-head">
          {icon ? <SettingsIcon icon={icon} /> : null}
          <div className="min-w-0 space-y-0.5">
            {title ? (
              <h3 className="text-[0.8125rem] font-semibold tracking-tight">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="text-[0.7rem] leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      )}
      <div className="settings-card-body">{children}</div>
    </section>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
  icon: Icon,
}: {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="settings-row">
      <div className="flex min-w-0 items-start gap-2.5">
        {Icon ? <SettingsIcon icon={Icon} /> : null}
        <div className="min-w-0 space-y-0.5">
          <p className="text-[0.8125rem] font-medium leading-none">{title}</p>
          <p className="text-[0.7rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
        className="shrink-0 scale-90"
      />
    </div>
  )
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
  const SectionIcon = SECTION_ICONS[section]

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
    <div className="space-y-5 pb-20">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-lg space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-[1.35rem]">
            تنظیمات
          </h1>
          <p className="text-[0.8rem] leading-relaxed text-muted-foreground">
            حساب، ظاهر، حریم خصوصی و امنیت — تغییرات فقط در این نمونه است.
          </p>
        </div>
        {dirty ? (
          <span className="rounded-[var(--st-radius)] border border-[color-mix(in_oklch,var(--foreground)_14%,transparent)] px-2 py-0.5 text-[0.65rem] text-muted-foreground">
            ذخیره‌نشده
          </span>
        ) : null}
      </header>

      <div className="grid gap-5 lg:grid-cols-[12.5rem_minmax(0,1fr)] lg:gap-6">
        <nav aria-label="بخش‌های تنظیمات" className="hidden lg:block">
          <div className="settings-nav sticky top-20">
            <ul className="space-y-px">
              {settingsSections.map((item) => {
                const Icon = SECTION_ICONS[item.id]
                const active = item.id === section
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => selectSection(item.id)}
                      className="settings-nav-item"
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon />
                      <span className="truncate">{item.title}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        <div className="flex items-center gap-1.5 lg:hidden">
          <Select
            value={section}
            onValueChange={(v) => {
              if (v && isSettingsSectionId(v)) selectSection(v)
            }}
            items={Object.fromEntries(
              settingsSections.map((item) => [item.id, item.title])
            )}
          >
            <SelectTrigger
              className="settings-input min-w-0 flex-1"
              aria-label="بخش تنظیمات"
            >
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
            size="icon-sm"
            className="settings-btn settings-btn-soft shrink-0 !px-0"
            aria-label="فهرست بخش‌ها"
            onClick={() => setNavOpen(true)}
          >
            <MenuIcon className="size-3.5" />
          </Button>
        </div>

        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetContent side="right" className="w-[min(17rem,100%)]">
            <SheetHeader className="text-start">
              <SheetTitle>بخش‌ها</SheetTitle>
              <SheetDescription>یکی را انتخاب کنید.</SheetDescription>
            </SheetHeader>
            <nav className="settings-nav mx-4 mb-6" aria-label="فهرست موبایل">
              <ul className="space-y-px">
                {settingsSections.map((item) => {
                  const Icon = SECTION_ICONS[item.id]
                  const active = item.id === section
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="settings-nav-item"
                        aria-current={active ? "page" : undefined}
                        onClick={() => selectSection(item.id)}
                      >
                        <Icon />
                        <span className="truncate">{item.title}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="min-w-0 space-y-4">
          <div className="flex items-center gap-2.5">
            <SettingsIcon icon={SectionIcon} large />
            <div className="min-w-0 space-y-0.5">
              <h2 className="text-[0.95rem] font-semibold tracking-tight">
                {meta.title}
              </h2>
              <p className="text-[0.75rem] leading-relaxed text-muted-foreground">
                {meta.description}
              </p>
            </div>
          </div>

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
        </div>
      </div>

      <div
        className={cn(
          "settings-savebar transition-all duration-200",
          dirty
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
        aria-hidden={!dirty}
      >
        <div className="settings-savebar-inner">
          <p className="text-[0.75rem] text-muted-foreground">
            تغییرات ذخیره‌نشده
          </p>
          <div className="flex shrink-0 gap-1.5">
            <Button
              type="button"
              className="settings-btn settings-btn-sm settings-btn-soft"
              onClick={handleCancel}
              disabled={!dirty}
            >
              لغو
            </Button>
            <Button
              type="button"
              className="settings-btn settings-btn-sm settings-btn-primary"
              onClick={handleSave}
              disabled={!dirty}
            >
              ذخیره
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
              نمایشی نشان داده می‌شود.
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

function privacyScore(value: SettingsState["privacy"]) {
  let score = 0
  if (value.profileVisibility === "private") score += 2
  else if (value.profileVisibility === "team") score += 1
  if (!value.showOnlineStatus) score += 1
  if (!value.shareActivity) score += 1
  if (!value.searchable) score += 1
  if (!value.showEmail) score += 1
  if (!value.allowMentions) score += 1
  const max = 7
  const pct = Math.round((score / max) * 100)
  if (score >= 5) {
    return { label: "محافظه‌کار", hint: "دیده شدن کم برای همکاران.", pct }
  }
  if (score >= 3) {
    return { label: "متعادل", hint: "تعادل همکاری و کنترل.", pct }
  }
  return { label: "باز", hint: "پروفایل بیشتر دیده می‌شود.", pct }
}

function PrivacySection({
  value,
  onChange,
}: {
  value: SettingsState["privacy"]
  onChange: (patch: Partial<SettingsState["privacy"]>) => void
}) {
  const level = privacyScore(value)
  const visibilityOptions = [
    {
      id: "workspace" as const,
      title: "کل فضای کاری",
      description: "همه اعضای سازمان پروفایل شما را می‌بینند.",
      icon: Building2Icon,
    },
    {
      id: "team" as const,
      title: "فقط تیم من",
      description: "محدود به تیم‌هایی که عضو آن‌ها هستید.",
      icon: UsersIcon,
    },
    {
      id: "private" as const,
      title: "خصوصی",
      description: "فقط نام نمایشی در منشن‌ها دیده می‌شود.",
      icon: LockIcon,
    },
  ]

  return (
    <div className="space-y-3.5">
      <div className="settings-meter">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-2.5">
            <SettingsIcon icon={ShieldCheckIcon} large />
            <div className="space-y-0.5">
              <p className="text-[0.65rem] tracking-[0.12em] text-muted-foreground">
                وضعیت فعلی
              </p>
              <p className="text-[0.9rem] font-semibold tracking-tight">
                {level.label}
              </p>
              <p className="text-[0.7rem] text-muted-foreground">{level.hint}</p>
            </div>
          </div>
        </div>
        <div className="settings-meter-bar" aria-hidden>
          <div
            className="settings-meter-fill"
            style={{ width: `${level.pct}%` }}
          />
        </div>
      </div>

      <SettingsCard
        title="دیده شدن پروفایل"
        description="چه کسانی جزئیات پروفایل را می‌بینند."
        icon={EyeIcon}
      >
        <RadioGroup
          value={value.profileVisibility}
          onValueChange={(v) => {
            if (v === "team" || v === "workspace" || v === "private") {
              onChange({ profileVisibility: v })
            }
          }}
          className="grid gap-2 sm:grid-cols-3"
        >
          {visibilityOptions.map((option) => {
            const selected = value.profileVisibility === option.id
            return (
              <label
                key={option.id}
                data-selected={selected ? "true" : "false"}
                className="settings-choice"
              >
                <div className="flex items-center justify-between gap-2">
                  <SettingsIcon icon={option.icon} active={selected} />
                  <RadioGroupItem value={option.id} className="sr-only" />
                </div>
                <span>
                  <span className="block text-[0.8125rem] font-medium">
                    {option.title}
                  </span>
                  <span className="mt-1 block text-[0.68rem] leading-relaxed text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </label>
            )
          })}
        </RadioGroup>
      </SettingsCard>

      <SettingsCard
        title="تعامل و حضور"
        description="چطور در زمان واقعی دیده می‌شوید."
        icon={MonitorIcon}
      >
        <ToggleRow
          icon={MonitorIcon}
          title="وضعیت آنلاین"
          description="نشان دهید که الان در دسترس هستید."
          checked={value.showOnlineStatus}
          onCheckedChange={(c) => onChange({ showOnlineStatus: c })}
        />
        <ToggleRow
          icon={UsersIcon}
          title="اجازه منشن"
          description="دیگران بتوانند با @ شما را صدا بزنند."
          checked={value.allowMentions}
          onCheckedChange={(c) => onChange({ allowMentions: c })}
        />
        <ToggleRow
          icon={EyeIcon}
          title="اشتراک فعالیت"
          description="خلاصه فعالیت برای همکاران تیم."
          checked={value.shareActivity}
          onCheckedChange={(c) => onChange({ shareActivity: c })}
        />
      </SettingsCard>

      <SettingsCard
        title="کشف‌پذیری"
        description="آیا دیگران بتوانند شما را پیدا کنند."
        icon={SearchIcon}
      >
        <ToggleRow
          icon={SearchIcon}
          title="جستجو در فهرست اعضا"
          description="نام شما در دایرکتوری سازمان ظاهر شود."
          checked={value.searchable}
          onCheckedChange={(c) => onChange({ searchable: c })}
        />
        <ToggleRow
          icon={EyeOffIcon}
          title="نمایش ایمیل به تیم"
          description="ایمیل ورود برای اعضای تیم قابل‌مشاهده باشد."
          checked={value.showEmail}
          onCheckedChange={(c) => onChange({ showEmail: c })}
        />
      </SettingsCard>
    </div>
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
    <SettingsCard
      title="اطلاعات نمایشی"
      description="در پیام‌ها و فهرست اعضا دیده می‌شود."
      icon={UserRoundIcon}
    >
      <FieldGroup className="gap-3.5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="settings-first-name">نام</FieldLabel>
            <Input
              id="settings-first-name"
              className="settings-input"
              value={value.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              autoComplete="given-name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="settings-last-name">نام خانوادگی</FieldLabel>
            <Input
              id="settings-last-name"
              className="settings-input"
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
            className="settings-input max-w-md"
            value={value.displayName}
            onChange={(e) => onChange({ displayName: e.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="settings-role">سمت</FieldLabel>
          <Input
            id="settings-role"
            className="settings-input max-w-md"
            value={value.role}
            onChange={(e) => onChange({ role: e.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="settings-bio">معرفی کوتاه</FieldLabel>
          <Textarea
            id="settings-bio"
            rows={3}
            className="settings-input max-w-xl"
            value={value.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            persianDigits={false}
          />
        </Field>
      </FieldGroup>
    </SettingsCard>
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
    <div className="space-y-3.5">
      <SettingsCard
        title="ورود و تماس"
        description="اطلاعات حساب برای ورود و بازیابی."
        icon={UserIcon}
      >
        <FieldGroup className="gap-3.5">
          <Field>
            <FieldLabel htmlFor="settings-email">ایمیل ورود</FieldLabel>
            <Input
              id="settings-email"
              type="email"
              dir="ltr"
              className="settings-input max-w-md text-start"
              value={value.email}
              onChange={(e) => onChange({ email: e.target.value })}
              autoComplete="email"
            />
            <FieldDescription>
              برای بازیابی حساب و اعلان‌های امنیتی.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="settings-phone">شماره موبایل</FieldLabel>
            <Input
              id="settings-phone"
              inputMode="tel"
              className="settings-input max-w-md"
              value={value.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              autoComplete="tel"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="settings-username">نام کاربری</FieldLabel>
            <Input
              id="settings-username"
              dir="ltr"
              className="settings-input max-w-md text-start"
              value={value.username}
              onChange={(e) => onChange({ username: e.target.value })}
              autoComplete="username"
            />
          </Field>
        </FieldGroup>
      </SettingsCard>

      <SettingsCard danger>
        <div className="space-y-2.5">
          <div className="space-y-0.5">
            <p className="text-[0.8125rem] font-semibold text-destructive">
              منطقه خطر
            </p>
            <p className="text-[0.7rem] leading-relaxed text-muted-foreground">
              حذف حساب در محصول واقعی غیرقابل بازگشت است.
            </p>
          </div>
          <Button
            type="button"
            className="settings-btn settings-btn-sm settings-btn-danger"
            onClick={onRequestDelete}
          >
            حذف حساب کاربری
          </Button>
        </div>
      </SettingsCard>
    </div>
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
    <div className="space-y-3.5">
      <Alert className="settings-card !shadow-none">
        <AlertTitle className="text-[0.8125rem]">تم روشن و تاریک</AlertTitle>
        <AlertDescription className="text-[0.75rem]">
          تم و دیزاین‌سیستم از نوار بالای صفحه عوض می‌شود.
        </AlertDescription>
      </Alert>

      <SettingsCard title="تراکم و فهرست" icon={PaletteIcon}>
        <FieldGroup className="gap-3.5">
          <Field>
            <FieldLabel>تراکم رابط</FieldLabel>
            <RadioGroup
              value={value.density}
              onValueChange={(v) => {
                if (v === "comfortable" || v === "compact") {
                  onChange({ density: v })
                }
              }}
              className="mt-2 grid gap-2 sm:grid-cols-2"
            >
              {(
                [
                  ["comfortable", "راحت", "فاصله بیشتر؛ مناسب خواندن."],
                  ["compact", "فشرده", "برای فهرست‌های شلوغ."],
                ] as const
              ).map(([id, title, desc]) => (
                <label
                  key={id}
                  data-selected={value.density === id ? "true" : "false"}
                  className="settings-choice !flex-row !items-start"
                >
                  <RadioGroupItem value={id} className="mt-0.5" />
                  <span>
                    <span className="block text-[0.8125rem] font-medium">
                      {title}
                    </span>
                    <span className="text-[0.68rem] text-muted-foreground">
                      {desc}
                    </span>
                  </span>
                </label>
              ))}
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
              <SelectTrigger className="settings-input max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comfortable">با فاصله استاندارد</SelectItem>
                <SelectItem value="dense">ردیف‌های متراکم</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <ToggleRow
            title="نمایش آواتار"
            description="آواتار اعضا در فهرست‌ها نشان داده شود."
            checked={value.showAvatars}
            onCheckedChange={(c) => onChange({ showAvatars: c })}
          />
        </FieldGroup>
      </SettingsCard>
    </div>
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
    <div className="space-y-3.5">
      <SettingsCard
        title="کانال‌ها"
        description="از کدام مسیرها خبردار شوید."
        icon={BellIcon}
      >
        <ToggleRow
          title="ایمیل"
          description="خلاصه و هشدارها به صندوق ورودی."
          checked={value.email}
          onCheckedChange={(c) => onChange({ email: c })}
        />
        <ToggleRow
          title="اعلان مرورگر"
          description="پیام فوری وقتی پنجره باز است."
          checked={value.push}
          onCheckedChange={(c) => onChange({ push: c })}
        />
        <ToggleRow
          title="پیامک"
          description="فقط برای هشدارهای امنیتی مهم."
          checked={value.sms}
          onCheckedChange={(c) => onChange({ sms: c })}
        />
      </SettingsCard>

      <SettingsCard title="موضوع‌ها" icon={BellIcon}>
        <div className="space-y-0">
          {(
            [
              [
                "productUpdates",
                "به‌روزرسانی محصول",
                "ویژگی‌های جدید و تغییرات مهم",
              ],
              ["securityAlerts", "هشدار امنیتی", "ورود مشکوک و تغییر رمز"],
              ["weeklyDigest", "خلاصه هفتگی", "یک‌شنبه صبح، خلاصه فعالیت‌ها"],
              ["mentions", "منشن و پاسخ", "وقتی کسی شما را صدا می‌زند"],
            ] as const
          ).map(([key, title, desc]) => (
            <label key={key} className="settings-row cursor-pointer">
              <span className="min-w-0">
                <span className="block text-[0.8125rem] font-medium">
                  {title}
                </span>
                <span className="text-[0.7rem] text-muted-foreground">
                  {desc}
                </span>
              </span>
              <Checkbox
                className="shrink-0"
                checked={value[key]}
                onCheckedChange={(checked) =>
                  onChange({ [key]: checked === true })
                }
              />
            </label>
          ))}
        </div>
      </SettingsCard>
    </div>
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
    <div className="space-y-3.5">
      <SettingsCard title="لایه‌های محافظت" icon={ShieldIcon}>
        <ToggleRow
          icon={LockIcon}
          title="تأیید دو مرحله‌ای"
          description="پس از ورود، کد یک‌بارمصرف درخواست شود."
          checked={value.twoFactor}
          onCheckedChange={(c) => onChange({ twoFactor: c })}
        />
        <ToggleRow
          icon={BellIcon}
          title="هشدار ورود جدید"
          description="ورود از دستگاه یا مکان تازه را ایمیل کنید."
          checked={value.loginAlerts}
          onCheckedChange={(c) => onChange({ loginAlerts: c })}
        />
      </SettingsCard>

      <SettingsCard
        title="تغییر رمز عبور"
        description="رمز جدید حداقل ۸ نویسه."
        icon={LockIcon}
      >
        <form onSubmit={onPasswordSubmit} className="space-y-3">
          <Field>
            <FieldLabel htmlFor="settings-pass-current">رمز فعلی</FieldLabel>
            <Input
              id="settings-pass-current"
              type="password"
              dir="ltr"
              className="settings-input max-w-md text-start"
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
              className="settings-input max-w-md text-start"
              autoComplete="new-password"
              value={password.next}
              onChange={(e) =>
                onPasswordChange({ ...password, next: e.target.value })
              }
            />
          </Field>
          <Field data-invalid={passwordError ? true : undefined}>
            <FieldLabel htmlFor="settings-pass-confirm">
              تکرار رمز جدید
            </FieldLabel>
            <Input
              id="settings-pass-confirm"
              type="password"
              dir="ltr"
              className="settings-input max-w-md text-start"
              autoComplete="new-password"
              aria-invalid={passwordError ? true : undefined}
              value={password.confirm}
              onChange={(e) =>
                onPasswordChange({ ...password, confirm: e.target.value })
              }
            />
            {passwordError ? (
              <p role="alert" className="text-[0.75rem] text-destructive">
                {passwordError}
              </p>
            ) : null}
          </Field>
          <Button
            type="submit"
            className="settings-btn settings-btn-sm settings-btn-soft"
          >
            به‌روزرسانی رمز
          </Button>
        </form>
      </SettingsCard>

      <SettingsCard title="نشست‌های فعال" icon={MonitorIcon}>
        <ul className="space-y-1.5">
          {sessions.map((session) => (
            <li key={session.id} className="settings-session">
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-[0.8125rem] font-medium">
                  {session.device}
                </p>
                <p className="text-[0.68rem] text-muted-foreground">
                  {session.location} · {session.lastActive}
                </p>
              </div>
              {session.current ? (
                <Badge
                  variant="secondary"
                  className="h-5 shrink-0 rounded-[var(--st-radius)] px-1.5 text-[0.65rem] font-normal"
                >
                  فعلی
                </Badge>
              ) : null}
            </li>
          ))}
        </ul>

        {sessions.some((s) => !s.current) ? (
          <Button
            type="button"
            className="settings-btn settings-btn-sm settings-btn-soft mt-3"
            onClick={onRevokeOthers}
          >
            خروج از بقیه نشست‌ها
          </Button>
        ) : (
          <p className="mt-2.5 text-[0.7rem] text-muted-foreground">
            فقط همین نشست فعال است.
          </p>
        )}
      </SettingsCard>
    </div>
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
    <SettingsCard
      title="زبان، زمان و نمایش"
      description="ترجیحات محلی این نمونه."
      icon={Settings2Icon}
    >
      <FieldGroup className="gap-3.5">
        <Field>
          <FieldLabel>زبان رابط</FieldLabel>
          <Select
            value={value.language}
            onValueChange={(v) => {
              if (v === "fa") onChange({ language: v })
            }}
            items={{ fa: "فارسی" }}
          >
            <SelectTrigger className="settings-input max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fa">فارسی</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>فقط فارسی در این نمونه.</FieldDescription>
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
            <SelectTrigger className="settings-input max-w-xs">
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
            className="mt-2 flex flex-wrap gap-4"
          >
            <label className="flex cursor-pointer items-center gap-2">
              <RadioGroupItem value="jalali" />
              <span className="text-[0.8125rem]">شمسی (جلالی)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <RadioGroupItem value="gregorian" />
              <span className="text-[0.8125rem]">میلادی</span>
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
            <SelectTrigger className="settings-input max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saturday">شنبه</SelectItem>
              <SelectItem value="sunday">یکشنبه</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <ToggleRow
          title="ارقام فارسی"
          description="اعداد در رابط با ارقام فارسی."
          checked={value.persianDigits}
          onCheckedChange={(c) => onChange({ persianDigits: c })}
        />
      </FieldGroup>
    </SettingsCard>
  )
}
