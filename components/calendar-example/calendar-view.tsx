"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

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
import {
  buildEventsAround,
  calendarCategories,
  type CalendarEvent,
  type EventCategory,
} from "@/lib/mock/calendar"
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type CalView = "month" | "week" | "day" | "agenda"

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 08–19

function categoryTone(category: EventCategory) {
  switch (category) {
    case "جلسه":
      return "bg-primary/15 text-primary ring-1 ring-primary/25"
    case "ددلاین":
      return "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
    case "یادآوری":
      return "bg-amber-500/15 text-amber-800 ring-1 ring-amber-500/25 dark:text-amber-300"
    default:
      return "bg-muted text-muted-foreground ring-1 ring-border"
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

export function CalendarExampleView() {
  const [today, setToday] = React.useState<Date | null>(null)
  const [cursor, setCursor] = React.useState<Date | null>(null)
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null)
  const [view, setView] = React.useState<CalView>("month")
  const [query, setQuery] = React.useState("")
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
  }, [])

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

  function toggleCategory(id: EventCategory) {
    setActiveCategories((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            تقویم تیم
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            جلسات، ددلاین‌ها و یادآوری‌های فضای کاری همیار — تاریخ‌ها شمسی نمایش
            داده می‌شوند.
          </p>
        </div>
        <Button
          className="w-full shrink-0 sm:w-auto"
          onClick={() =>
            toast.success("فرم رویداد جدید در این نمونه فقط نمایشی است")
          }
        >
          <PlusIcon data-icon="inline-start" />
          رویداد جدید
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="flex flex-wrap items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={goToday}>
            امروز
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="بازه قبلی"
            onClick={goPrev}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="بازه بعدی"
            onClick={goNext}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <p className="ms-1 min-w-0 text-sm font-medium sm:ms-2">
            {titleLabel}
          </p>
        </div>

        <Tabs
          value={view}
          onValueChange={(v) => setView((v as CalView) ?? "month")}
          className="w-full lg:w-auto"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start sm:w-auto">
            <TabsTrigger value="month">ماه</TabsTrigger>
            <TabsTrigger value="week">هفته</TabsTrigger>
            <TabsTrigger value="day">روز</TabsTrigger>
            <TabsTrigger value="agenda">فهرست</TabsTrigger>
          </TabsList>
        </Tabs>

        <InputGroup className="h-9 w-full min-w-0 lg:ms-auto lg:max-w-xs">
          <InputGroupAddon align="inline-start">
            <SearchIcon className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="جستجوی رویداد، مکان یا شرکت‌کننده…"
            aria-label="جستجوی رویدادها"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_17.5rem]">
        <div className="min-w-0 space-y-4">
          {view === "month" ? (
            <MonthView
              cursor={cursor}
              today={today}
              selectedDay={selectedDay}
              eventsByDay={eventsByDay}
              onSelectDay={(day) => {
                setSelectedDay(day)
                setCursor(day)
              }}
              onOpenEvent={setSelectedEvent}
            />
          ) : null}
          {view === "week" ? (
            <WeekView
              cursor={cursor}
              today={today}
              selectedDay={selectedDay}
              eventsByDay={eventsByDay}
              onSelectDay={setSelectedDay}
              onOpenEvent={setSelectedEvent}
            />
          ) : null}
          {view === "day" ? (
            <DayView
              day={selectedDay}
              events={selectedDayEvents}
              onOpenEvent={setSelectedEvent}
            />
          ) : null}
          {view === "agenda" ? (
            <AgendaView events={upcoming.length ? upcoming : events.slice(0, 8)} onOpenEvent={setSelectedEvent} />
          ) : null}
        </div>

        <aside className="hidden space-y-4 xl:block">
          <div
            data-slot="card"
            className="rounded-xl border bg-card p-3 text-card-foreground shadow-xs"
          >
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

          <div
            data-slot="card"
            className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs"
          >
            <p className="text-sm font-medium">دسته‌بندی‌ها</p>
            <ul className="mt-3 space-y-2">
              {calendarCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    aria-pressed={activeCategories[cat.id]}
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-start text-sm transition-colors",
                      activeCategories[cat.id]
                        ? "border-border bg-muted/40"
                        : "border-transparent opacity-50 hover:opacity-80"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-2.5 rounded-full",
                          categoryTone(cat.id).split(" ")[0]
                        )}
                        aria-hidden
                      />
                      {cat.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div
            data-slot="card"
            className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs"
          >
            <p className="text-sm font-medium">رویدادهای امروز</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatJalaliFull(today)}
            </p>
            <Separator className="my-3" />
            {(eventsByDay.get(toDateKey(today)) ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                رویدادی برای امروز ثبت نشده است.
              </p>
            ) : (
              <ul className="space-y-2">
                {(eventsByDay.get(toDateKey(today)) ?? []).map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className="w-full rounded-lg border px-2.5 py-2 text-start text-sm hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      <span className="font-medium">{event.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {event.startTime}–{event.endTime}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile categories strip */}
      <div className="flex flex-wrap gap-2 xl:hidden">
        {calendarCategories.map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            variant={activeCategories[cat.id] ? "secondary" : "outline"}
            aria-pressed={activeCategories[cat.id]}
            onClick={() => toggleCategory(cat.id)}
          >
            {cat.label}
          </Button>
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
  onSelectDay,
  onOpenEvent,
}: {
  cursor: Date
  today: Date
  selectedDay: Date
  eventsByDay: Map<string, CalendarEvent[]>
  onSelectDay: (day: Date) => void
  onOpenEvent: (event: CalendarEvent) => void
}) {
  const days = monthGrid(cursor)
  const month = cursor.getMonth()

  return (
    <div
      data-slot="card"
      className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs"
    >
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {WEEKDAY_HEADERS.map((label) => (
          <div
            key={label}
            className="px-1 py-2 text-center text-xs font-medium text-muted-foreground sm:text-sm"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-[minmax(5.5rem,1fr)] sm:auto-rows-[minmax(6.5rem,1fr)]">
        {days.map((day) => {
          const key = toDateKey(day)
          const dayEvents = eventsByDay.get(key) ?? []
          const outside = day.getMonth() !== month
          const isToday = sameDay(day, today)
          const isSelected = sameDay(day, selectedDay)
          return (
            <div
              key={key}
              className={cn(
                "flex min-h-0 flex-col border-b border-e p-1 sm:p-1.5",
                outside && "bg-muted/20 text-muted-foreground"
              )}
            >
              <button
                type="button"
                onClick={() => onSelectDay(day)}
                aria-label={formatJalaliFull(day)}
                aria-current={isToday ? "date" : undefined}
                className={cn(
                  "mb-1 flex size-7 items-center justify-center rounded-full text-xs tabular-nums sm:size-8 sm:text-sm",
                  isSelected && "bg-primary text-primary-foreground",
                  isToday && !isSelected && "ring-1 ring-primary",
                  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                )}
              >
                {toPersianDigits(formatJalaliDay(day))}
              </button>
              <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => onOpenEvent(event)}
                    className={cn(
                      "truncate rounded-md px-1 py-0.5 text-start text-[0.65rem] leading-tight sm:text-xs",
                      categoryTone(event.category)
                    )}
                  >
                    <span className="hidden sm:inline">{event.startTime} </span>
                    {event.title}
                  </button>
                ))}
                {dayEvents.length > 3 ? (
                  <span className="px-1 text-[0.65rem] text-muted-foreground">
                    +{toPersianDigits(dayEvents.length - 3)} مورد
                  </span>
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
  onSelectDay,
  onOpenEvent,
}: {
  cursor: Date
  today: Date
  selectedDay: Date
  eventsByDay: Map<string, CalendarEvent[]>
  onSelectDay: (day: Date) => void
  onOpenEvent: (event: CalendarEvent) => void
}) {
  const days = weekDays(cursor)

  return (
    <div
      data-slot="card"
      className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs"
    >
      <div className="grid grid-cols-[3rem_repeat(7,minmax(0,1fr))] border-b sm:grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]">
        <div className="border-e bg-muted/20" />
        {days.map((day) => {
          const isToday = sameDay(day, today)
          const isSelected = sameDay(day, selectedDay)
          return (
            <button
              key={toDateKey(day)}
              type="button"
              onClick={() => onSelectDay(day)}
              className={cn(
                "border-e px-1 py-2 text-center last:border-e-0",
                isSelected && "bg-primary/10",
                "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              )}
            >
              <p className="text-[0.65rem] text-muted-foreground sm:text-xs">
                {formatJalaliWeekdayShort(day)}
              </p>
              <p
                className={cn(
                  "mx-auto mt-1 flex size-7 items-center justify-center rounded-full text-sm font-medium tabular-nums",
                  isToday && "bg-primary text-primary-foreground"
                )}
              >
                {toPersianDigits(formatJalaliDay(day))}
              </p>
            </button>
          )
        })}
      </div>

      <div className="max-h-[min(32rem,70vh)] overflow-auto">
        <div className="grid min-w-[40rem] grid-cols-[3rem_repeat(7,minmax(0,1fr))] sm:min-w-0 sm:grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]">
          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              <div className="border-b border-e px-1 py-3 text-center text-[0.65rem] tabular-nums text-muted-foreground sm:text-xs">
                {toPersianDigits(String(hour).padStart(2, "0"))}
              </div>
              {days.map((day) => {
                const key = toDateKey(day)
                const slotEvents = (eventsByDay.get(key) ?? []).filter((e) =>
                  timeStartsInHour(e.startTime, hour)
                )
                return (
                  <div
                    key={`${key}-${hour}`}
                    className="min-h-14 border-b border-e p-0.5 last:border-e-0"
                  >
                    {slotEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onOpenEvent(event)}
                        className={cn(
                          "mb-0.5 w-full truncate rounded-md px-1 py-1 text-start text-[0.65rem] sm:text-xs",
                          categoryTone(event.category)
                        )}
                      >
                        {event.title}
                      </button>
                    ))}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

function timeStartsInHour(persianTime: string, hour: number) {
  const latin = persianTime
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .slice(0, 2)
  return Number(latin) === hour
}

function DayView({
  day,
  events,
  onOpenEvent,
}: {
  day: Date
  events: CalendarEvent[]
  onOpenEvent: (event: CalendarEvent) => void
}) {
  return (
    <div
      data-slot="card"
      className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs sm:p-5"
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold">
          {formatJalaliWeekday(day)}، {formatJalaliFull(day)}
        </h2>
        <p className="text-sm text-muted-foreground">
          {toPersianDigits(events.length)} رویداد در این روز
        </p>
      </div>
      {events.length === 0 ? (
        <p className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
          رویدادی برای این روز نیست.
        </p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onOpenEvent(event)}
                className="flex w-full flex-col gap-1 rounded-xl border px-3 py-3 text-start hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">{event.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {event.startTime}–{event.endTime} · {event.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{event.category}</Badge>
                  <StatusBadge status={event.status} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
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
    <div
      data-slot="card"
      className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs sm:p-5"
    >
      <h2 className="text-base font-semibold">رویدادهای نزدیک</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        رویدادهای پیش‌رو بر اساس فیلتر فعال
      </p>
      <Separator className="my-4" />
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">موردی برای نمایش نیست.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onOpenEvent(event)}
                className="grid w-full gap-1 rounded-xl border px-3 py-3 text-start hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
              >
                <span className="text-xs tabular-nums text-muted-foreground sm:text-sm">
                  {formatJalaliFull(new Date(event.dateKey + "T12:00:00"))}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium">{event.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {event.startTime}–{event.endTime} · {event.location}
                  </span>
                </span>
                <Badge variant="outline" className="w-fit">
                  {event.category}
                </Badge>
              </button>
            </li>
          ))}
        </ul>
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
  return (
    <Dialog open={Boolean(event)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        {event ? (
          <>
            <DialogHeader>
              <DialogTitle>{event.title}</DialogTitle>
              <DialogDescription>
                {formatJalaliFull(new Date(event.dateKey + "T12:00:00"))} ·{" "}
                {event.startTime} تا {event.endTime}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{event.category}</Badge>
                <StatusBadge status={event.status} />
              </div>
              <p>
                <span className="text-muted-foreground">مکان: </span>
                {event.location}
              </p>
              <p className="leading-relaxed text-muted-foreground">
                {event.description}
              </p>
              <div>
                <p className="mb-1.5 text-muted-foreground">شرکت‌کنندگان</p>
                <ul className="flex flex-wrap gap-1.5">
                  {event.attendees.map((name) => (
                    <li key={name}>
                      <Badge variant="secondary">{name}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:justify-start">
              <Button
                variant="outline"
                onClick={() => toast.message("ویرایش در این نمونه فعال نیست")}
              >
                ویرایش
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  toast.message("حذف فقط نمایشی است")
                  onOpenChange(false)
                }}
              >
                حذف
              </Button>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                بستن
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
