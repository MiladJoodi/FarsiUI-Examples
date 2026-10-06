"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  PlayIcon,
  SunIcon,
  SunriseIcon,
  SunsetIcon,
} from "lucide-react"

import {
  dateToJalaali,
  formatDigitalTime,
  formatGregorianFull,
  formatGregorianLongEn,
  formatGregorianNumeric,
  formatGregorianRangeForJalaliMonth,
  formatHijriFull,
  formatHijriLongAr,
  formatHijriNumeric,
  formatHijriRangeForJalaliMonth,
  formatJalaliFull,
  formatJalaliLongLine,
  formatJalaliNumeric,
  getZodiacSign,
  JALALI_MONTHS,
  jalaaliToDate,
  sameDay,
  startOfDay,
  WEEKDAY_HEADERS,
} from "@/lib/calendar-date"
import { toPersianDigits } from "@/lib/digits"
import {
  addJalaaliMonths,
  jalaaliMonthGrid,
  jalaaliMonthLength,
} from "@/lib/jalaali"
import {
  getDailyBlurb,
  getDailyQuote,
  getOccasionsForDay,
  getOccasionsForMonth,
  isHoliday,
  prayerCities,
} from "@/lib/mock/calendar"

function AnalogClock() {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = window.setInterval(tick, 50)
    return () => window.clearInterval(id)
  }, [])

  const h = now.getHours() % 12
  const m = now.getMinutes()
  const s = now.getSeconds()
  const ms = now.getMilliseconds()
  const hourDeg = h * 30 + m * 0.5
  const minuteDeg = m * 6 + s * 0.1
  const secondDeg = s * 6 + ms * 0.006
  const numerals = ["۱۲", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۱۰", "۱۱"]
  const cx = 100
  const cy = 100
  const numR = 72

  return (
    <div className="rz-clock-stage">
      <svg
        className="rz-analog-svg"
        viewBox="0 0 200 200"
        role="img"
        aria-label={`ساعت ${formatDigitalTime(now)}`}
      >
        <defs>
          <linearGradient id="rz-bezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop className="rz-bezel-stop-0" offset="0%" />
            <stop className="rz-bezel-stop-1" offset="45%" />
            <stop className="rz-bezel-stop-2" offset="100%" />
          </linearGradient>
          <radialGradient id="rz-dial" cx="35%" cy="30%" r="70%">
            <stop className="rz-dial-stop-0" offset="0%" />
            <stop className="rz-dial-stop-1" offset="100%" />
          </radialGradient>
        </defs>
        <circle className="rz-analog-bezel" cx="100" cy="100" r="96" />
        <circle className="rz-analog-dial" cx="100" cy="100" r="88" />
        {Array.from({ length: 60 }, (_, i) => {
          const a = ((i * 6 - 90) * Math.PI) / 180
          const outer = 88
          const inner = i % 5 === 0 ? 76 : 82
          return (
            <line
              key={i}
              className="rz-analog-tick"
              data-major={i % 5 === 0 ? "true" : "false"}
              x1={cx + Math.cos(a) * inner}
              y1={cy + Math.sin(a) * inner}
              x2={cx + Math.cos(a) * outer}
              y2={cy + Math.sin(a) * outer}
            />
          )
        })}
        {numerals.map((label, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180
          return (
            <text
              key={label}
              className="rz-analog-num"
              x={cx + Math.cos(a) * numR}
              y={cy + Math.sin(a) * numR}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {label}
            </text>
          )
        })}
        <g transform={`rotate(${hourDeg} 100 100)`}>
          <line className="rz-hand-hour" x1="100" y1="100" x2="100" y2="58" />
        </g>
        <g transform={`rotate(${minuteDeg} 100 100)`}>
          <line className="rz-hand-minute" x1="100" y1="100" x2="100" y2="42" />
        </g>
        <g transform={`rotate(${secondDeg} 100 100)`}>
          <line className="rz-hand-second" x1="100" y1="118" x2="100" y2="34" />
        </g>
        <circle className="rz-analog-hub" cx="100" cy="100" r="5" />
      </svg>
      <p className="rz-digital rz-num">{formatDigitalTime(now)}</p>
    </div>
  )
}

function toArabicIndicDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]!)
}

function hijriDay(date: Date) {
  try {
    const raw = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
    }).format(date)
    return toArabicIndicDigits(raw)
  } catch {
    const raw = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
    }).format(date)
    return toArabicIndicDigits(raw)
  }
}

function PrayerIcon({ id }: { id: string }) {
  const cls = "rz-prayer-ico"
  switch (id) {
    case "fajr":
      return <MoonIcon className={cls} aria-hidden />
    case "sunrise":
      return <SunriseIcon className={cls} aria-hidden />
    case "dhuhr":
      return <SunIcon className={cls} aria-hidden />
    case "sunset":
      return <SunsetIcon className={cls} aria-hidden />
    case "maghrib":
      return <SunsetIcon className={cls} aria-hidden />
    default:
      return <MoonIcon className={cls} aria-hidden />
  }
}

export function CalendarExampleView() {
  const [now, setNow] = React.useState<Date | null>(null)
  const [cursorJy, setCursorJy] = React.useState(1403)
  const [cursorJm, setCursorJm] = React.useState(7)
  const [selected, setSelected] = React.useState<Date | null>(null)
  const [cityId, setCityId] = React.useState(prayerCities[0]!.id)

  const [convDay, setConvDay] = React.useState(1)
  const [convMonth, setConvMonth] = React.useState(7)
  const [convYear, setConvYear] = React.useState(1403)
  const [converted, setConverted] = React.useState<Date | null>(null)

  React.useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  const bootRef = React.useRef(false)
  React.useEffect(() => {
    if (!now || bootRef.current) return
    bootRef.current = true
    const j = dateToJalaali(now)
    setCursorJy(j.jy)
    setCursorJm(j.jm)
    setSelected(startOfDay(now))
    setConvDay(j.jd)
    setConvMonth(j.jm)
    setConvYear(j.jy)
    setConverted(startOfDay(now))
  }, [now])

  React.useEffect(() => {
    const day = Math.min(convDay, jalaaliMonthLength(convYear, convMonth))
    setConverted(jalaaliToDate(convYear, convMonth, day))
  }, [convDay, convMonth, convYear])

  if (!now || !selected) {
    return (
      <div className="rz-loading">در حال آماده‌سازی روزنگار…</div>
    )
  }

  const today = startOfDay(now)
  const todayJ = dateToJalaali(today)
  const selectedJ = dateToJalaali(selected)
  const grid = jalaaliMonthGrid(cursorJy, cursorJm)
  const occasions = getOccasionsForMonth(cursorJm)
  const city = prayerCities.find((c) => c.id === cityId) ?? prayerCities[0]!
  const todayOccasions = getOccasionsForDay(todayJ.jm, todayJ.jd)
  const selectedDayOccasions =
    selectedJ.jm === cursorJm && selectedJ.jy === cursorJy
      ? getOccasionsForDay(selectedJ.jm, selectedJ.jd)
      : []
  const convMaxDay = jalaaliMonthLength(convYear, convMonth)
  const zodiac = getZodiacSign(today)
  const occasionDays = new Set(occasions.map((o) => o.day))

  function shiftMonth(delta: number) {
    const next = addJalaaliMonths(cursorJy, cursorJm, delta)
    setCursorJy(next.jy)
    setCursorJm(next.jm)
  }

  function selectOccasionDay(day: number) {
    const next = jalaaliToDate(cursorJy, cursorJm, day)
    setSelected(startOfDay(next))
  }

  return (
    <div className="rz-portal">
      <section className="rz-card rz-hero-card" aria-labelledby="rz-clock-title">
        <div className="rz-hero-body">
          <div className="rz-clock-face-wrap">
            <AnalogClock />
          </div>

          <div className="rz-hero-main">
            <header className="rz-hero-head">
              <h2 id="rz-clock-title" className="rz-hero-title">
                ساعت و تقویم ایران
              </h2>
              <p className="rz-hero-sub rz-num">{formatJalaliLongLine(today)}</p>
            </header>

            <div className="rz-date-panels">
              <div className="rz-date-panel">
                <p className="rz-date-label">تاریخ خورشیدی</p>
                <p className="rz-date-code rz-num">{formatJalaliNumeric(today)}</p>
                <p className="rz-date-line rz-num">{formatJalaliLongLine(today)}</p>
              </div>
              <div className="rz-date-panel">
                <p className="rz-date-label">تاریخ میلادی</p>
                <p className="rz-date-code" dir="ltr">
                  {formatGregorianNumeric(today)}
                </p>
                <p className="rz-date-line" dir="ltr">
                  {formatGregorianLongEn(today)}
                </p>
              </div>
              <div className="rz-date-panel">
                <p className="rz-date-label">تاریخ قمری</p>
                <p className="rz-date-code rz-num">{formatHijriNumeric(today)}</p>
                <p className="rz-date-line" lang="ar" dir="rtl">
                  {formatHijriLongAr(today)}
                </p>
              </div>
              <div className="rz-date-panel">
                <p className="rz-date-label">برج فلکی</p>
                <div className="rz-zodiac">
                  <span className="rz-zodiac-symbol" aria-hidden>
                    {zodiac.symbol}
                  </span>
                  <p className="rz-zodiac-name">{zodiac.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rz-hero-foot">
          <p className="rz-blurb">{getDailyBlurb(today)}</p>
          <blockquote className="rz-quote">«{getDailyQuote(today)}»</blockquote>
        </div>
      </section>

      <section className="rz-month-section" aria-label="تقویم ماهانه">
        <div className="rz-month-layout">
          <div className="rz-cal-widget">
            <div className="rz-cal-banner">
              <button
                type="button"
                className="rz-cal-nav"
                aria-label="ماه قبل"
                onClick={() => shiftMonth(-1)}
              >
                <ChevronRightIcon className="size-4" />
              </button>
              <div className="rz-cal-banner-mid">
                <p className="rz-cal-month rz-num">
                  {JALALI_MONTHS[cursorJm - 1]} {toPersianDigits(cursorJy)}
                </p>
                <p className="rz-cal-range" dir="ltr">
                  {formatGregorianRangeForJalaliMonth(cursorJy, cursorJm)}
                </p>
                <p className="rz-cal-hijri-range rz-num">
                  {formatHijriRangeForJalaliMonth(cursorJy, cursorJm)}
                </p>
              </div>
              <button
                type="button"
                className="rz-cal-nav"
                aria-label="ماه بعد"
                onClick={() => shiftMonth(1)}
              >
                <ChevronLeftIcon className="size-4" />
              </button>
            </div>

            <div className="rz-cal-sheet">
              <div className="rz-weekdays">
                {WEEKDAY_HEADERS.map((label) => (
                  <div key={label} className="rz-weekday">
                    {label}
                  </div>
                ))}
              </div>

              <div className="rz-grid">
                {grid.map((day) => {
                  const j = dateToJalaali(day)
                  const outside = j.jm !== cursorJm || j.jy !== cursorJy
                  const friday = day.getDay() === 5
                  const holiday = !outside && isHoliday(j.jm, j.jd)
                  const isToday = sameDay(day, today)
                  const isSelected = sameDay(day, selected)
                  const hasEvent = !outside && occasionDays.has(j.jd)
                  return (
                    <button
                      key={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                      type="button"
                      className="rz-day"
                      data-outside={outside ? "true" : "false"}
                      data-friday={friday ? "true" : "false"}
                      data-holiday={holiday ? "true" : "false"}
                      data-today={isToday ? "true" : "false"}
                      data-selected={isSelected ? "true" : "false"}
                      data-event={hasEvent ? "true" : "false"}
                      aria-label={formatJalaliFull(day)}
                      aria-current={isToday ? "date" : undefined}
                      onClick={() => setSelected(startOfDay(day))}
                    >
                      <span className="rz-day-main rz-num">
                        {toPersianDigits(j.jd)}
                      </span>
                      <span className="rz-day-g" title="میلادی" dir="ltr">
                        {day.getDate()}
                      </span>
                      <span className="rz-day-h" title="قمری">
                        {hijriDay(day)}
                      </span>
                      {hasEvent ? (
                        <span className="rz-day-dot" aria-hidden />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              className="rz-full-btn"
              onClick={() => {
                setCursorJy(todayJ.jy)
                setCursorJm(todayJ.jm)
                setSelected(today)
              }}
            >
              برو به امروز
            </button>
          </div>

          <aside className="rz-occasions" aria-label="مناسبت‌های ماه">
            <div className="rz-occasions-head">
              <p className="rz-occasions-title">
                مناسبت‌های {JALALI_MONTHS[cursorJm - 1]}
              </p>
              <p className="rz-occasions-count rz-num">
                {toPersianDigits(occasions.length)} مورد
              </p>
            </div>
            {selectedDayOccasions.length > 0 ? (
              <div className="rz-selected-hint rz-num">
                {toPersianDigits(selectedJ.jd)} {JALALI_MONTHS[selectedJ.jm - 1]}
                : {selectedDayOccasions.map((o) => o.title).join(" · ")}
              </div>
            ) : null}
            <div className="rz-occasions-scroll">
              {occasions.length === 0 ? (
                <p className="rz-today-empty">مناسبتی برای این ماه ثبت نشده.</p>
              ) : (
                occasions.map((item) => (
                  <button
                    key={`${item.day}-${item.title}`}
                    type="button"
                    className="rz-occasion"
                    data-holiday={item.holiday ? "true" : "false"}
                    data-active={
                      selectedJ.jy === cursorJy &&
                      selectedJ.jm === cursorJm &&
                      selectedJ.jd === item.day
                        ? "true"
                        : "false"
                    }
                    onClick={() => selectOccasionDay(item.day)}
                  >
                    <span className="rz-occasion-day rz-num">
                      {toPersianDigits(item.day)}
                    </span>
                    <span className="rz-occasion-title">{item.title}</span>
                  </button>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="rz-card" aria-labelledby="rz-prayer-title">
        <div className="rz-prayer-head">
          <h2 id="rz-prayer-title" className="rz-card-title">
            اوقات شرعی به افق {city.name}
          </h2>
          <select
            className="rz-city-select"
            aria-label="شهر"
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
          >
            {prayerCities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="rz-prayer-grid">
          {city.times.map((slot) => (
            <div key={slot.id} className="rz-prayer-item" data-slot={slot.id}>
              <span className="rz-prayer-ico-wrap">
                <PrayerIcon id={slot.id} />
              </span>
              <p className="rz-prayer-label">{slot.label}</p>
              <p className="rz-prayer-time rz-num">{slot.time}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rz-card" aria-labelledby="rz-convert-title">
        <h2 id="rz-convert-title" className="rz-card-title">
          تبدیل تاریخ شمسی، میلادی و قمری
        </h2>
        <div className="rz-convert-row">
          <div className="rz-field">
            <label htmlFor="rz-conv-day">روز</label>
            <select
              id="rz-conv-day"
              value={convDay}
              onChange={(e) => setConvDay(Number(e.target.value))}
            >
              {Array.from({ length: convMaxDay }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {toPersianDigits(d)}
                </option>
              ))}
            </select>
          </div>
          <div className="rz-field">
            <label htmlFor="rz-conv-month">ماه</label>
            <select
              id="rz-conv-month"
              value={convMonth}
              onChange={(e) => {
                const m = Number(e.target.value)
                setConvMonth(m)
                setConvDay((d) => Math.min(d, jalaaliMonthLength(convYear, m)))
              }}
            >
              {JALALI_MONTHS.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="rz-field">
            <label htmlFor="rz-conv-year">سال</label>
            <select
              id="rz-conv-year"
              value={convYear}
              onChange={(e) => {
                const y = Number(e.target.value)
                setConvYear(y)
                setConvDay((d) =>
                  Math.min(d, jalaaliMonthLength(y, convMonth))
                )
              }}
            >
              {Array.from({ length: 21 }, (_, i) => 1395 + i).map((y) => (
                <option key={y} value={y}>
                  {toPersianDigits(y)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {converted ? (
          <div className="rz-convert-results">
            <div className="rz-convert-result">
              <span>شمسی</span>
              <strong className="rz-num">{formatJalaliFull(converted)}</strong>
            </div>
            <div className="rz-convert-result">
              <span>میلادی</span>
              <strong className="rz-num">{formatGregorianFull(converted)}</strong>
            </div>
            <div className="rz-convert-result">
              <span>قمری</span>
              <strong className="rz-num">{formatHijriFull(converted)}</strong>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rz-card" aria-labelledby="rz-today-title">
        <h2 id="rz-today-title" className="rz-card-title">
          رویدادهای امروز
        </h2>
        <div className="rz-today-layout">
          <div className="rz-today-media" aria-hidden>
            <span className="rz-play">
              <PlayIcon fill="currentColor" />
            </span>
            <p className="rz-today-media-label">رسانهٔ روز</p>
          </div>
          <div className="rz-today-list">
            {todayOccasions.length === 0 ? (
              <p className="rz-today-empty">
                برای امروز مناسبت رسمی در فهرست نمونه ثبت نشده است. روز خوبی
                داشته باشید.
              </p>
            ) : (
              todayOccasions.map((item) => (
                <div
                  key={item.title}
                  className="rz-today-item"
                  data-holiday={item.holiday ? "true" : "false"}
                >
                  <span className="rz-occasion-day rz-num">
                    {toPersianDigits(item.day)}
                  </span>
                  <span>{item.title}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
