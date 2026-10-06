/**
 * Mock data for روزنگار (time.ir-style calendar portal).
 */

export type MonthOccasion = {
  day: number
  title: string
  holiday?: boolean
}

export type PrayerSlot = {
  id: string
  label: string
  time: string
}

export type PrayerCity = {
  id: string
  name: string
  times: PrayerSlot[]
}

/** مناسبت‌های دموی هر ماه شمسی (فشرده مثل time.ir). */
const OCCASIONS_BY_MONTH: Record<number, MonthOccasion[]> = {
  1: [
    { day: 1, title: "آغاز نوروز / جشن نوروز", holiday: true },
    { day: 2, title: "عید نوروز", holiday: true },
    { day: 3, title: "عید نوروز", holiday: true },
    { day: 4, title: "عید نوروز", holiday: true },
    { day: 12, title: "روز جمهوری اسلامی ایران", holiday: true },
    { day: 13, title: "روز طبیعت (سیزده‌بدر)", holiday: true },
    { day: 18, title: "روز سلامتی" },
    { day: 19, title: "شهادت آیت‌الله مدرس" },
    { day: 20, title: "روز ملی فن‌آوری هسته‌ای" },
    { day: 25, title: "روز بزرگداشت عطار نیشابوری" },
    { day: 29, title: "روز ارتش جمهوری اسلامی ایران" },
  ],
  2: [
    { day: 3, title: "روز بزرگداشت شیخ بهایی" },
    { day: 10, title: "روز ملی خلیج فارس" },
    { day: 15, title: "روز صنعت و معدن" },
    { day: 25, title: "روز بزرگداشت فردوسی" },
    { day: 28, title: "روز بزرگداشت حکیم عمر خیام" },
    { day: 29, title: "روز جهانی موزه و میراث فرهنگی" },
  ],
  3: [
    { day: 1, title: "روز بهره‌وری و بهینه‌سازی مصرف" },
    { day: 14, title: "رحلت امام خمینی", holiday: true },
    { day: 15, title: "قیام ۱۵ خرداد", holiday: true },
    { day: 25, title: "روز گل و گیاه" },
    { day: 27, title: "روز جهاد کشاورزی" },
  ],
  4: [
    { day: 1, title: "روز اصناف" },
    { day: 7, title: "روز قوه قضائیه" },
    { day: 8, title: "روز قلم" },
    { day: 14, title: "روز شهرداری و دهیاری" },
    { day: 16, title: "روز مالیات" },
    { day: 25, title: "روز بهزیستی و تأمین اجتماعی" },
  ],
  5: [
    { day: 5, title: "روز کرامت و روزه اولیا" },
    { day: 9, title: "روز اهدای خون" },
    { day: 14, title: "روز حقوق بشر اسلامی و کرامت انسانی" },
    { day: 17, title: "روز خبرنگار" },
    { day: 26, title: "سالروز ورود آزادگان به میهن" },
    { day: 30, title: "روز بزرگداشت ابوعلی سینا / روز پزشک" },
  ],
  6: [
    { day: 1, title: "روز پزشک" },
    { day: 2, title: "آغاز هفته دولت" },
    { day: 5, title: "روز داروساز" },
    { day: 8, title: "روز مبارزه با تروریسم" },
    { day: 17, title: "قیام ۱۷ شهریور" },
    { day: 21, title: "روز سینما" },
    { day: 27, title: "روز بزرگداشت شعر و ادب فارسی / روز شعر و ادب پارسی" },
    { day: 31, title: "آغاز هفته دفاع مقدس" },
  ],
  7: [
    { day: 1, title: "آغاز سال تحصیلی / روز همدردی با کودکان و نوجوانان فلسطینی" },
    { day: 5, title: "شکست حصر آبادان" },
    { day: 7, title: "روز آتش‌نشانی و ایمنی" },
    { day: 8, title: "روز بزرگداشت مولوی" },
    { day: 10, title: "روز نخبگان" },
    { day: 13, title: "روز نیروی انتظامی" },
    { day: 14, title: "روز دامپزشکی / روز جهانی جهانگردی" },
    { day: 15, title: "روز روستا و عشایر" },
    { day: 16, title: "مهرگان / جشن مهرگان" },
    { day: 20, title: "روز بزرگداشت حافظ" },
    { day: 22, title: "روز ملی پارالمپیک" },
    { day: 23, title: "روز جهانی کودک" },
    { day: 24, title: "روز پیوند اولیا و مربیان" },
    { day: 26, title: "روز تربیت‌بدنی و ورزش" },
    { day: 27, title: "روز ملی کوهنوردی" },
    { day: 29, title: "روز صادرات" },
  ],
  8: [
    { day: 1, title: "روز آمار و برنامه‌ریزی" },
    { day: 4, title: "اعتراض و تحصن روحانیون قم" },
    { day: 8, title: "شهادت محمدحسین فهمیده / روز نوجوان و بسیج دانش‌آموزی" },
    { day: 10, title: "روز فرهنگ عمومی" },
    { day: 13, title: "تسخیر لانه جاسوسی / روز دانش‌آموز", holiday: true },
    { day: 14, title: "روز فرهنگ عمومی" },
    { day: 18, title: "روز ملی کیفیت" },
    { day: 24, title: "روز کتاب و کتاب‌خوانی / روز کتابدار" },
    { day: 26, title: "روز نوعدوستی" },
  ],
  9: [
    { day: 5, title: "روز بسیج مستضعفان" },
    { day: 7, title: "روز نیروی دریایی" },
    { day: 9, title: "روز بزرگداشت شیخ مفید" },
    { day: 12, title: "روز جهانی معلولان" },
    { day: 16, title: "روز دانشجو" },
    { day: 18, title: "معرفی حسابداری به عنوان یک حرفه" },
    { day: 25, title: "روز پژوهش" },
    { day: 30, title: "شب یلدا / شب چله" },
  ],
  10: [
    { day: 5, title: "روز ایمنی در برابر زلزله و کاهش اثرات بلایای طبیعی" },
    { day: 7, title: "سالروز تشکیل نهضت سوادآموزی" },
    { day: 12, title: "آغاز بازگشت آزادگان به میهن اسلامی" },
    { day: 13, title: "روز جهانی مقاومت" },
    { day: 19, title: "قیام خونین مردم قم" },
    { day: 20, title: "روز ملی فناوری اطلاعات" },
    { day: 26, title: "روز ولادت حضرت علی (ع) / روز پدر" },
    { day: 29, title: "روز غزه" },
  ],
  11: [
    { day: 1, title: "روز بزرگداشت ابوالفضل بیهقی" },
    { day: 12, title: "بازگشت امام خمینی به ایران", holiday: true },
    { day: 14, title: "روز فناوری فضایی" },
    { day: 19, title: "روز نیروی هوایی" },
    { day: 22, title: "پیروزی انقلاب اسلامی ایران", holiday: true },
    { day: 25, title: "روز بزرگداشت خواجه عبدالله انصاری" },
    { day: 29, title: "روز اقتصاد مقاومتی و کارآفرینی" },
  ],
  12: [
    { day: 5, title: "روز بزرگداشت خواجه نصیرالدین طوسی / روز مهندس" },
    { day: 7, title: "روز منابع طبیعی و استقلال جنگل‌ها" },
    { day: 14, title: "روز احسان و نیکوکاری" },
    { day: 15, title: "روز درختکاری" },
    { day: 18, title: "روز بزرگداشت سید جمال‌الدین اسدآبادی" },
    { day: 20, title: "روز راهیان نور" },
    { day: 25, title: "روز بزرگداشت پروین اعتصامی" },
    { day: 29, title: "روز ملی شدن صنعت نفت ایران", holiday: true },
  ],
}

export function getOccasionsForMonth(jm: number): MonthOccasion[] {
  return OCCASIONS_BY_MONTH[jm] ?? []
}

export function getOccasionsForDay(jm: number, jd: number): MonthOccasion[] {
  return getOccasionsForMonth(jm).filter((o) => o.day === jd)
}

export function isHoliday(jm: number, jd: number) {
  return getOccasionsForMonth(jm).some((o) => o.day === jd && o.holiday)
}

export const DAILY_BLURBS = [
  "امروز فرصتی تازه برای نظم و آرامش است؛ ساعت و تقویم را با برنامهٔ خود هم‌راستا کنید.",
  "زمان، سرمایهٔ مشترک همهٔ ماست — یک قرار مهم را در روزنگار علامت بزنید.",
  "هر روز شمسی، میلادی و قمری هم‌زمان می‌گذرد؛ انتخاب با شماست که کدام را مبنا بگیرید.",
  "جمعه‌ها در تقویم ایرانی رنگ دیگری دارند؛ استراحت هم بخشی از بهره‌وری است.",
]

export function getDailyBlurb(date: Date) {
  const idx = date.getDate() % DAILY_BLURBS.length
  return DAILY_BLURBS[idx]!
}

export const DAILY_QUOTES = [
  "وقت طلاست؛ اما فقط وقتی که برای چیز درست خرج شود.",
  "هر روز فرصتی تازه است — حتی اگر شبیه دیروز به نظر برسد.",
  "آرامش از نظم می‌آید؛ نظم از دانستنِ زمان.",
  "امروز را اگر خوب زندگی کنی، فردا خودش می‌آید.",
]

export function getDailyQuote(date: Date) {
  const idx = (date.getMonth() + date.getDate()) % DAILY_QUOTES.length
  return DAILY_QUOTES[idx]!
}

const TEHRAN_TIMES: PrayerSlot[] = [
  { id: "fajr", label: "اذان صبح", time: "۰۵:۱۲" },
  { id: "sunrise", label: "طلوع آفتاب", time: "۰۶:۳۸" },
  { id: "dhuhr", label: "اذان ظهر", time: "۱۲:۵۱" },
  { id: "sunset", label: "غروب آفتاب", time: "۱۸:۰۴" },
  { id: "maghrib", label: "اذان مغرب", time: "۱۸:۲۳" },
  { id: "midnight", label: "نیمه‌شب شرعی", time: "۲۳:۳۳" },
]

const ISFAHAN_TIMES: PrayerSlot[] = [
  { id: "fajr", label: "اذان صبح", time: "۰۵:۱۸" },
  { id: "sunrise", label: "طلوع آفتاب", time: "۰۶:۴۳" },
  { id: "dhuhr", label: "اذان ظهر", time: "۱۲:۵۴" },
  { id: "sunset", label: "غروب آفتاب", time: "۱۸:۰۶" },
  { id: "maghrib", label: "اذان مغرب", time: "۱۸:۲۵" },
  { id: "midnight", label: "نیمه‌شب شرعی", time: "۲۳:۳۶" },
]

const MASHHAD_TIMES: PrayerSlot[] = [
  { id: "fajr", label: "اذان صبح", time: "۰۴:۵۸" },
  { id: "sunrise", label: "طلوع آفتاب", time: "۰۶:۲۵" },
  { id: "dhuhr", label: "اذان ظهر", time: "۱۲:۳۹" },
  { id: "sunset", label: "غروب آفتاب", time: "۱۷:۵۳" },
  { id: "maghrib", label: "اذان مغرب", time: "۱۸:۱۲" },
  { id: "midnight", label: "نیمه‌شب شرعی", time: "۲۳:۲۱" },
]

export const prayerCities: PrayerCity[] = [
  { id: "tehran", name: "تهران", times: TEHRAN_TIMES },
  { id: "isfahan", name: "اصفهان", times: ISFAHAN_TIMES },
  { id: "mashhad", name: "مشهد", times: MASHHAD_TIMES },
]
