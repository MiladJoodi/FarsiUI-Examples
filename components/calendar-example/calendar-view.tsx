"use client"

import * as React from "react"
import {
  AlignLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  addDays,
  addMonths,
  formatJalaliDay,
  formatJalaliFull,
  formatJalaliMonthYear,
  formatJalaliWeekday,
  formatJalaliWeekdayShort,
  monthGrid,
  sameDay,
  startOfDay,
  toDateKey,
  weekDays,
  WEEKDAY_HEADERS,
} from "@/lib/calendar-date"
import { toPersianDigits } from "@/lib/digits"
import { formatCount } from "@/lib/format"
import {
  buildEventsAround,
  calendarCategories,
  type CalendarEvent,
  type EventCategory,
} from "@/lib/mock/calendar"
import { teamMembers } from "@/lib/mock/tasks"
import { SearchField } from "@/components/shared/search-field"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type CalView = "month" | "week" | "day" | "agenda"
type CalDensity = "compact" | "cozy" | "roomy"
type CalPalette = "vivid" | "ink" | "sunset"

type CalPrefs = {
  density: CalDensity
  palette: CalPalette
  weekend: boolean
  showTime: boolean
}

const DEFAULT_PREFS: CalPrefs = {
  density: "cozy",
  palette: "vivid",
  weekend: true,
  showTime: true,
}

const PREFS_KEY = "farsiui-cal-prefs"

function loadPrefs(): CalPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS
  try {
    const raw = window.localStorage.getItem(PREFS_KEY)
    if (!raw) return DEFAULT_PREFS
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_PREFS
  }
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8)

function isWeekendDate(day: Date) {
  const d = day.getDay()
  return d === 4 || d === 5 // پنج‌شنبه و جمعه
}

function showCalToast(title: string, description: string) {
  toast.custom(
    () => (
      <div className="cal-toast" role="status">
        <span className="cal-toast-mark" aria-hidden />
        <div>
          <p className="cal-toast-title">{title}</p>
          <p className="cal-toast-desc">{description}</p>
        </div>
      </div>
    ),
    { duration: 4000 }
  )
}

function getAttendeeProfile(name: string) {
  const member = teamMembers.find((m) => m.name === name)
  if (member) {
    return {
      name: member.name,
      initials: member.initials,
      role: member.role,
    }
  }
  return {
    name,
    initials: name.length > 3 ? name.slice(0, 2) : name,
    role: "گروه / مهمان",
  }
}

function StatusBadge({ status }: { status: CalendarEvent["status"] }) {
  const variant =
    status === "تأییدشده"
      ? "default"
      : status === "موقت"
        ? "secondary"
        : "outline"
  return <Badge variant={variant}>{status}</Badge>
}

function timeStartsInHour(persianTime: string, hour: number) {
  const latin = persianTime
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .slice(0, 2)
  return Number(latin) === hour
}

export function CalendarExampleView() {
  const [today, setToday] = React.useState<Date | null>(null)
  const [cursor, setCursor] = React.useState<Date | null>(null)
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null)
  const [view, setView] = React.useState<CalView>("month")
  const [query, setQuery] = React.useState("")
  const [prefs, setPrefs] = React.useState<CalPrefs>(DEFAULT_PREFS)
  const [activeCategories, setActiveCategories] = React.useState<
    Record<EventCategory, boolean>
  >({
    جلسه: true,
    ددلاین: true,
    یادآوری: true,
    شخصی: true,
  })
  const [selectedEvent, setSelectedEvent] =
    React.useState<CalendarEvent | null>(null)

  React.useEffect(() => {
    const now = startOfDay(new Date())
    setToday(now)
    setCursor(now)
    setSelectedDay(now)
    setPrefs(loadPrefs())
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  }, [prefs])

  function updatePrefs(patch: Partial<CalPrefs>) {
    setPrefs((prev) => ({ ...prev, ...patch }))
  }

  function createAt(day: Date, hour?: number) {
    const label = hour
      ? `${formatJalaliFull(day)} · ${toPersianDigits(String(hour).padStart(2, "0"))}:۰۰`
      : formatJalaliFull(day)
    showCalToast("اسلات خالی", `برای ${label} می‌توانید رویداد بسازید (نمایشی).`)
  }

  const allEvents = React.useMemo(
    () => (today ? buildEventsAround(today) : []),
    [today]
  )

  const events = React.useMemo(() => {
    const q = query.trim()
    return allEvents.filter((event) => {
      if (!activeCategories[event.category]) return false
      if (!q) return true
      return (
        event.title.includes(q) ||
        event.location.includes(q) ||
        event.attendees.some((a) => a.includes(q))
      )
    })
  }, [allEvents, activeCategories, query])

  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const event of events) {
      const list = map.get(event.dateKey) ?? []
      list.push(event)
      map.set(event.dateKey, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime, "fa"))
    }
    return map
  }, [events])

  if (!today || !cursor || !selectedDay) {
    return (
      <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
        در حال آماده‌سازی تقویم…
      </div>
    )
  }

  function goToday() {
    setCursor(today)
    setSelectedDay(today)
  }

  function goPrev() {
    if (view === "month") setCursor((d) => addMonths(d!, -1))
    else if (view === "week") setCursor((d) => addDays(d!, -7))
    else setCursor((d) => addDays(d!, -1))
  }

  function goNext() {
    if (view === "month") setCursor((d) => addMonths(d!, 1))
    else if (view === "week") setCursor((d) => addDays(d!, 7))
    else setCursor((d) => addDays(d!, 1))
  }

  const titleLabel =
    view === "month"
      ? formatJalaliMonthYear(cursor)
      : view === "week"
        ? `هفتهٔ ${formatJalaliFull(weekDays(cursor)[0])} تا ${formatJalaliDay(weekDays(cursor)[6])}`
        : formatJalaliFull(view === "day" ? selectedDay : cursor)

  const selectedKey = toDateKey(selectedDay)
  const selectedDayEvents = eventsByDay.get(selectedKey) ?? []
  const upcoming = events
    .filter((e) => e.dateKey >= toDateKey(today) && e.status !== "لغوشده")
    .slice(0, 5)
  const todayEvents = eventsByDay.get(toDateKey(today)) ?? []

  function toggleCategory(id: EventCategory) {
    setActiveCategories((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div
      className="cal-studio"
      data-density={prefs.density}
      data-palette={prefs.palette}
      data-weekend={prefs.weekend ? "on" : "off"}
      data-show-time={prefs.showTime ? "on" : "off"}
    >
      <header className="cal-hero">
        <div>
          <p className="cal-kicker">تقویم شمسی</p>
          <h1 className="cal-title">برنامهٔ تیم در یک نگاه</h1>
          <p className="cal-lead">
            چهار نما، فیلتر زنده، و تنظیمات نمایش — دابل‌کلیک روی روز برای نمای
            روزانه؛ کلیک روی اسلات خالی برای ساخت رویداد.
          </p>
        </div>
        <Button
          className="cal-btn cal-btn-primary"
          onClick={() =>
            showCalToast(
              "رویداد جدید",
              "فرم ایجاد در این نمونه فقط نمایشی است."
            )
          }
        >
          <PlusIcon data-icon="inline-start" />
          رویداد جدید
        </Button>
      </header>

      <div className="cal-strip">
        <div className="cal-nav">
          <Button
            variant="outline"
            size="sm"
            className="cal-btn cal-btn-ghost"
            onClick={goToday}
          >
            امروز
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="cal-btn cal-btn-ghost"
            aria-label="بازه قبلی"
            onClick={goPrev}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="cal-btn cal-btn-ghost"
            aria-label="بازه بعدی"
            onClick={goNext}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <p className="cal-month-label cal-num">{titleLabel}</p>
        </div>

        <div className="cal-views" role="tablist" aria-label="نمای تقویم">
          {(
            [
              ["month", "ماه"],
              ["week", "هفته"],
              ["day", "روز"],
              ["agenda", "فهرست"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              className="cal-view-btn"
              aria-pressed={view === id}
              aria-selected={view === id}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <SearchField
          wrapperClassName="cal-search"
          placeholder="جستجوی رویداد، مکان یا شرکت‌کننده…"
          aria-label="جستجوی رویدادها"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="cal-layout">
        <div className="min-w-0">
          {view === "month" ? (
            <MonthView
              cursor={cursor}
              today={today}
              selectedDay={selectedDay}
              eventsByDay={eventsByDay}
              weekendOn={prefs.weekend}
              onSelectDay={(day) => {
                setSelectedDay(day)
                setCursor(day)
              }}
              onOpenDay={(day) => {
                setSelectedDay(day)
                setCursor(day)
                setView("day")
              }}
              onOpenEvent={setSelectedEvent}
              onCreateDay={(day) => createAt(day)}
            />
          ) : null}
          {view === "week" ? (
            <WeekView
              cursor={cursor}
              today={today}
              selectedDay={selectedDay}
              eventsByDay={eventsByDay}
              weekendOn={prefs.weekend}
              onSelectDay={setSelectedDay}
              onOpenEvent={setSelectedEvent}
              onCreateSlot={(day, hour) => createAt(day, hour)}
            />
          ) : null}
          {view === "day" ? (
            <DayView
              day={selectedDay}
              events={selectedDayEvents}
              onOpenEvent={setSelectedEvent}
              onCreateSlot={(hour) => createAt(selectedDay, hour)}
            />
          ) : null}
          {view === "agenda" ? (
            <AgendaView
              events={upcoming.length ? upcoming : events.slice(0, 8)}
              onOpenEvent={setSelectedEvent}
            />
          ) : null}
        </div>

        <aside className="cal-side">
          <div className="cal-side-card">
            <Calendar
              mode="single"
              selected={selectedDay}
              onSelect={(day) => {
                if (!day) return
                const next = startOfDay(day)
                setSelectedDay(next)
                setCursor(next)
              }}
              month={cursor}
              onMonthChange={(month) => setCursor(startOfDay(month))}
              className="w-full [--cell-size:--spacing(8)]"
            />
          </div>

          <div className="cal-side-card">
            <p className="cal-side-title">سفارشی‌سازی</p>
            <p className="cal-side-sub">تراکم، پالت و نمایش</p>
            <div className="cal-prefs">
              <p className="cal-pref-label">تراکم</p>
              <div className="cal-pref-row">
                {(
                  [
                    ["compact", "فشرده"],
                    ["cozy", "متعادل"],
                    ["roomy", "باز"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className="cal-pref-chip"
                    data-active={prefs.density === id ? "true" : "false"}
                    onClick={() => updatePrefs({ density: id })}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="cal-pref-label">پالت رنگ</p>
              <div className="cal-pref-row">
                {(
                  [
                    ["vivid", "زنده"],
                    ["ink", "مرکّب"],
                    ["sunset", "غروب"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className="cal-pref-chip"
                    data-active={prefs.palette === id ? "true" : "false"}
                    onClick={() => updatePrefs({ palette: id })}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="cal-pref-toggle">
                <input
                  type="checkbox"
                  checked={prefs.weekend}
                  onChange={(e) => updatePrefs({ weekend: e.target.checked })}
                />
                برجسته کردن آخر هفته
              </label>
              <label className="cal-pref-toggle">
                <input
                  type="checkbox"
                  checked={prefs.showTime}
                  onChange={(e) => updatePrefs({ showTime: e.target.checked })}
                />
                نمایش ساعت روی کارت‌ها
              </label>
            </div>
          </div>

          <div className="cal-side-card">
            <p className="cal-side-title">دسته‌بندی‌ها</p>
            <p className="cal-side-sub">برای فیلتر روی هر مورد بزنید</p>
            <div className="cal-cats">
              {calendarCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="cal-cat"
                  aria-pressed={activeCategories[cat.id]}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <span className="cal-dot" data-cat={cat.id} aria-hidden />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="cal-side-card">
            <p className="cal-side-title">امروز</p>
            <p className="cal-side-sub cal-num">{formatJalaliFull(today)}</p>
            {todayEvents.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                رویدادی برای امروز نیست.
              </p>
            ) : (
              <div className="cal-today-list">
                {todayEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className="cal-today-item"
                    data-cat={event.category}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <strong>{event.title}</strong>
                    <span className="cal-num">
                      {event.startTime}–{event.endTime}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="cal-mobile-cats">
        {calendarCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className="cal-cat"
            style={{ width: "auto" }}
            aria-pressed={activeCategories[cat.id]}
            onClick={() => toggleCategory(cat.id)}
          >
            <span className="cal-dot" data-cat={cat.id} aria-hidden />
            {cat.label}
          </button>
        ))}
      </div>

      <EventDialog
        event={selectedEvent}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null)
        }}
      />
    </div>
  )
}

function MonthView({
  cursor,
  today,
  selectedDay,
  eventsByDay,
  weekendOn,
  onSelectDay,
  onOpenDay,
  onOpenEvent,
  onCreateDay,
}: {
  cursor: Date
  today: Date
  selectedDay: Date
  eventsByDay: Map<string, CalendarEvent[]>
  weekendOn: boolean
  onSelectDay: (day: Date) => void
  onOpenDay: (day: Date) => void
  onOpenEvent: (event: CalendarEvent) => void
  onCreateDay: (day: Date) => void
}) {
  const days = monthGrid(cursor)
  const month = cursor.getMonth()

  return (
    <div className="cal-panel">
      <div className="cal-weekdays">
        {WEEKDAY_HEADERS.map((label) => (
          <div key={label} className="cal-weekday">
            {label}
          </div>
        ))}
      </div>
      <div className="cal-month-grid">
        {days.map((day) => {
          const key = toDateKey(day)
          const dayEvents = eventsByDay.get(key) ?? []
          const outside = day.getMonth() !== month
          const isToday = sameDay(day, today)
          const isSelected = sameDay(day, selectedDay)
          const weekend = weekendOn && isWeekendDate(day)
          return (
            <div
              key={key}
              className="cal-cell"
              data-outside={outside ? "true" : "false"}
              data-selected={isSelected ? "true" : "false"}
              data-weekend={weekend ? "true" : "false"}
              onDoubleClick={() => onOpenDay(day)}
            >
              <div className="cal-cell-top">
                <button
                  type="button"
                  onClick={() => onSelectDay(day)}
                  aria-label={formatJalaliFull(day)}
                  aria-current={isToday ? "date" : undefined}
                  className="cal-day-btn cal-num"
                  data-today={isToday ? "true" : "false"}
                >
                  {toPersianDigits(formatJalaliDay(day))}
                </button>
                {!outside && dayEvents.length === 0 ? (
                  <button
                    type="button"
                    className="cal-cell-add"
                    aria-label={`افزودن رویداد در ${formatJalaliFull(day)}`}
                    onClick={() => onCreateDay(day)}
                  >
                    +
                  </button>
                ) : null}
              </div>
              <div className="cal-events">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className="cal-chip"
                    data-cat={event.category}
                    onClick={() => onOpenEvent(event)}
                  >
                    <span className="cal-chip-time cal-num">
                      {event.startTime}{" "}
                    </span>
                    {event.title}
                  </button>
                ))}
                {dayEvents.length > 3 ? (
                  <button
                    type="button"
                    className="cal-more cal-num"
                    onClick={() => onOpenDay(day)}
                  >
                    +{toPersianDigits(dayEvents.length - 3)} مورد
                  </button>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({
  cursor,
  today,
  selectedDay,
  eventsByDay,
  weekendOn,
  onSelectDay,
  onOpenEvent,
  onCreateSlot,
}: {
  cursor: Date
  today: Date
  selectedDay: Date
  eventsByDay: Map<string, CalendarEvent[]>
  weekendOn: boolean
  onSelectDay: (day: Date) => void
  onOpenEvent: (event: CalendarEvent) => void
  onCreateSlot: (day: Date, hour: number) => void
}) {
  const days = weekDays(cursor)

  return (
    <div className="cal-panel">
      <div className="cal-week-head">
        <div />
        {days.map((day) => {
          const isToday = sameDay(day, today)
          const isSelected = sameDay(day, selectedDay)
          const weekend = weekendOn && isWeekendDate(day)
          return (
            <button
              key={toDateKey(day)}
              type="button"
              className="cal-week-day"
              data-selected={isSelected ? "true" : "false"}
              data-weekend={weekend ? "true" : "false"}
              onClick={() => onSelectDay(day)}
            >
              <p className="cal-week-day-name">
                {formatJalaliWeekdayShort(day)}
              </p>
              <p
                className="cal-week-day-num cal-num"
                data-today={isToday ? "true" : "false"}
              >
                {toPersianDigits(formatJalaliDay(day))}
              </p>
            </button>
          )
        })}
      </div>

      <div className="cal-week-body">
        {HOURS.map((hour) => (
          <div key={hour} className="cal-week-row">
            <div className="cal-hour cal-num">
              {toPersianDigits(String(hour).padStart(2, "0"))}
            </div>
            {days.map((day) => {
              const key = toDateKey(day)
              const slotEvents = (eventsByDay.get(key) ?? []).filter((e) =>
                timeStartsInHour(e.startTime, hour)
              )
              const weekend = weekendOn && isWeekendDate(day)
              return (
                <button
                  key={`${key}-${hour}`}
                  type="button"
                  className="cal-slot"
                  data-weekend={weekend ? "true" : "false"}
                  aria-label={`اسلات ${toPersianDigits(String(hour))} در ${formatJalaliFull(day)}`}
                  onClick={() => {
                    if (slotEvents[0]) onOpenEvent(slotEvents[0])
                    else onCreateSlot(day, hour)
                  }}
                >
                  {slotEvents.map((event) => (
                    <span
                      key={event.id}
                      className="cal-chip"
                      data-cat={event.category}
                    >
                      {event.title}
                    </span>
                  ))}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function DayView({
  day,
  events,
  onOpenEvent,
  onCreateSlot,
}: {
  day: Date
  events: CalendarEvent[]
  onOpenEvent: (event: CalendarEvent) => void
  onCreateSlot: (hour: number) => void
}) {
  return (
    <div className="cal-panel cal-day-timeline">
      <div className="cal-list-head">
        <h2>
          {formatJalaliWeekday(day).trim()}، {formatJalaliFull(day)}
        </h2>
        <p className="cal-num">
          {toPersianDigits(events.length)} رویداد · روی ساعت خالی بزنید
        </p>
      </div>
      <div className="cal-day-grid">
        {HOURS.map((hour) => {
          const slotEvents = events.filter((e) =>
            timeStartsInHour(e.startTime, hour)
          )
          return (
            <div key={hour} className="cal-day-row">
              <div className="cal-hour cal-num">
                {toPersianDigits(String(hour).padStart(2, "0"))}
              </div>
              <button
                type="button"
                className="cal-day-slot"
                onClick={() => {
                  if (slotEvents[0]) onOpenEvent(slotEvents[0])
                  else onCreateSlot(hour)
                }}
              >
                {slotEvents.length === 0 ? (
                  <span className="cal-slot-hint">افزودن</span>
                ) : (
                  slotEvents.map((event) => (
                    <span
                      key={event.id}
                      className="cal-day-block"
                      data-cat={event.category}
                    >
                      <strong>{event.title}</strong>
                      <em className="cal-num">
                        {event.startTime}–{event.endTime} · {event.location}
                      </em>
                    </span>
                  ))
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AgendaView({
  events,
  onOpenEvent,
}: {
  events: CalendarEvent[]
  onOpenEvent: (event: CalendarEvent) => void
}) {
  return (
    <div className="cal-panel cal-list">
      <div className="cal-list-head">
        <h2>رویدادهای نزدیک</h2>
        <p>بر اساس فیلتر و بازهٔ فعال</p>
      </div>
      {events.length === 0 ? (
        <p className="cal-empty">موردی برای نمایش نیست.</p>
      ) : (
        <div className="cal-rows">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              className="cal-row"
              onClick={() => onOpenEvent(event)}
            >
              <span className="cal-row-time cal-num">
                {formatJalaliFull(new Date(event.dateKey + "T12:00:00"))}
              </span>
              <span>
                <span className="cal-row-title">{event.title}</span>
                <span className="cal-row-meta cal-num">
                  {event.startTime}–{event.endTime} · {event.location}
                </span>
              </span>
              <span className="cal-tag" data-cat={event.category}>
                {event.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function EventDialog({
  event,
  onOpenChange,
}: {
  event: CalendarEvent | null
  onOpenChange: (open: boolean) => void
}) {
  const attendees = event?.attendees.map(getAttendeeProfile) ?? []
  const hasLocation = Boolean(event?.location && event.location !== "—")
  const eventDate = event
    ? formatJalaliFull(new Date(event.dateKey + "T12:00:00"))
    : ""

  return (
    <Dialog open={Boolean(event)} onOpenChange={onOpenChange}>
      <DialogContent className="cal-event-dialog gap-0 p-0 sm:max-w-md" dir="rtl">
        {event ? (
          <>
            <DialogHeader className="cal-event-head space-y-0 text-start">
              <div className="cal-event-meta">
                <span className="cal-tag" data-cat={event.category}>
                  {event.category}
                </span>
                <StatusBadge status={event.status} />
              </div>
              <DialogTitle className="cal-event-title">
                {event.title}
              </DialogTitle>
              <DialogDescription className="cal-event-when">
                <span className="cal-num">{eventDate}</span>
                <span className="cal-event-dot" aria-hidden>
                  ·
                </span>
                <span className="cal-num">
                  {event.startTime} – {event.endTime}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="cal-event-body">
              {hasLocation ? (
                <div className="cal-event-row">
                  <MapPinIcon className="cal-event-ico" aria-hidden />
                  <div>
                    <p className="cal-event-label">مکان</p>
                    <p className="cal-event-value">{event.location}</p>
                  </div>
                </div>
              ) : null}

              {event.description ? (
                <div className="cal-event-row">
                  <AlignLeftIcon className="cal-event-ico" aria-hidden />
                  <div>
                    <p className="cal-event-label">توضیحات</p>
                    <p className="cal-event-value cal-event-desc">
                      {event.description}
                    </p>
                  </div>
                </div>
              ) : null}

              {attendees.length > 0 ? (
                <div className="cal-event-row">
                  <UsersIcon className="cal-event-ico" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="cal-event-label">
                      شرکت‌کنندگان
                      <span className="cal-num">
                        {" "}
                        · {formatCount(attendees.length)}
                      </span>
                    </p>
                    <ul className="cal-event-people">
                      {attendees.map((person) => (
                        <li key={person.name}>
                          <Avatar size="sm">
                            <AvatarFallback className="text-[0.6rem]">
                              {person.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p>{person.name}</p>
                            <span>{person.role}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>

            <DialogFooter className="cal-event-foot">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  showCalToast("حذف", "فقط نمایشی است.")
                  onOpenChange(false)
                }}
              >
                حذف
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    showCalToast("ویرایش", "در این نمونه فعال نیست.")
                  }
                >
                  ویرایش
                </Button>
                <Button size="sm" onClick={() => onOpenChange(false)}>
                  بستن
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
