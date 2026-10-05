import { SettingsPanels } from "@/components/settings/settings-panels"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">تنظیمات پنل</h1>
        <p className="text-sm text-muted-foreground">
          مدیریت حساب، اعلان‌ها و ظاهر سامانه همیار
        </p>
      </div>
      <SettingsPanels />
    </div>
  )
}
