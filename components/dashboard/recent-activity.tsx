import { activities } from "@/lib/mock/activities"

export function RecentActivity() {
  return (
    <section className="taraz-panel min-w-0 overflow-hidden p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="taraz-subtitle">فعالیت اخیر</h2>
        <p className="taraz-muted mt-1">رویدادهای سامانه</p>
      </div>
      <ol className="space-y-5">
        {activities.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span
              aria-hidden
              className="mt-1.5 size-2.5 shrink-0 rounded-full bg-[var(--tz-yellow)] ring-2 ring-[color:var(--tz-panel)]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="taraz-body-text min-w-0 font-semibold leading-snug">
                  {item.title}
                </p>
                <p className="taraz-caption taraz-num shrink-0 pt-0.5">
                  {item.time}
                </p>
              </div>
              <p className="taraz-muted mt-1 leading-relaxed">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
