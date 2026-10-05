import { activities } from "@/lib/mock/activities"
import { formatPersianText, toPersianDigits } from "@/lib/digits"
import {
  DashboardPanel,
  DashboardPanelBody,
  DashboardPanelDescription,
  DashboardPanelHeader,
  DashboardPanelTitle,
} from "@/components/dashboard/dashboard-panel"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"

export function RecentActivity() {
  return (
    <DashboardPanel>
      <DashboardPanelHeader>
        <div>
          <DashboardPanelTitle>فعالیت‌های اخیر</DashboardPanelTitle>
          <DashboardPanelDescription>
            رویدادهای مهم پنل در ساعات گذشته
          </DashboardPanelDescription>
        </div>
      </DashboardPanelHeader>
      <DashboardPanelBody className="p-3">
        <ItemGroup className="gap-0">
          {activities.map((activity) => (
            <Item
              key={activity.id}
              size="sm"
              variant="default"
              className="rounded-none border-0 border-b last:border-b-0"
            >
              <ItemContent>
                <ItemTitle>{activity.title}</ItemTitle>
                <ItemDescription>
                  {formatPersianText(activity.detail)}
                </ItemDescription>
                <p className="text-xs text-muted-foreground">
                  {toPersianDigits(activity.time)}
                </p>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </DashboardPanelBody>
    </DashboardPanel>
  )
}
