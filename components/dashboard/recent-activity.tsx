import { activities } from "@/lib/mock/activities"
import { formatPersianText, toPersianDigits } from "@/lib/digits"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"

export function RecentActivity() {
  return (
    <div className="rounded-xl border">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-medium">فعالیت‌های اخیر</h2>
        <p className="text-xs text-muted-foreground">
          رویدادهای مهم پنل در ساعات گذشته
        </p>
      </div>
      <div className="p-3">
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
      </div>
    </div>
  )
}
