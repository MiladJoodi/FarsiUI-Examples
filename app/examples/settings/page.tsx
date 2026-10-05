import {
  isSettingsSectionId,
  type SettingsSectionId,
} from "@/lib/mock/settings"
import { SettingsView } from "@/components/settings-example/settings-view"

export default async function SettingsExamplePage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>
}) {
  const params = await searchParams
  const section: SettingsSectionId =
    params.section && isSettingsSectionId(params.section)
      ? params.section
      : "profile"

  return <SettingsView initialSection={section} />
}
