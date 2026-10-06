/**
 * Mock data for E-commerce example storefront.
 */

export type ProductCategory =
  | "electronics"
  | "apparel"
  | "home"
  | "beauty"

export type Product = {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  category: ProductCategory
  brand: string
  price: number
  compareAtPrice?: number
  rating: number
  reviewCount: number
  stock: number
  colors?: string[]
  specs: { label: string; value: string }[]
  accent: string
}

export const categoryLabels: Record<ProductCategory, string> = {
  electronics: "الکترونیک",
  apparel: "پوشاک",
  home: "خانه و آشپزخانه",
  beauty: "زیبایی و سلامت",
}

/** پالت محدود اتلیه — هر دسته یک ته رنگ از همان خانواده */
export const categoryAccents: Record<ProductCategory, string> = {
  electronics: "#3d5a5b",
  apparel: "#8b5340",
  home: "#6b6458",
  beauty: "#9a5a58",
}

export function productAccent(product: Pick<Product, "category" | "accent">) {
  return categoryAccents[product.category] ?? product.accent
}

/** نگاشت نام رنگ فارسی به دموی بصری */
export const colorSwatches: Record<string, string> = {
  مشکی: "#1c1c1c",
  سفید: "#f4f1ec",
  "خاکستری": "#8b8680",
  "خاکستری روشن": "#c5c0b8",
  "آبی تیره": "#2c3e50",
  "آبی روشن": "#7eb6d4",
  کرم: "#e8d9c4",
  "سبز زیتونی": "#6b7a4a",
  شتری: "#b08968",
  "سفید مات": "#ebe6df",
  زغالی: "#3a3836",
}

export function swatchForColor(name: string) {
  return colorSwatches[name] ?? "#9a8f86"
}

export const storeName = "نورا"
export const storeTagline = "اتلیه خرید · منتخب روزمره"

export const brands = [
  "آریا تک",
  "پارس‌هوم",
  "کاوان",
  "زرین",
  "نوانور",
  "سپید",
] as const

export const products: Product[] = [
  {
    id: "p1",
    slug: "wireless-earbuds-pro",
    name: "هدفون بی‌سیم پرو",
    shortDescription: "نویزکنسلینگ فعال، باتری ۲۸ ساعته",
    description:
      "هدفون بی‌سیم پرو با حذف نویز فعال چندلایه، میکروفون دوتایی برای تماس شفاف و قاب شارژ سریع طراحی شده است.\nبرای رفت‌وآمد روزانه، جلسات آنلاین و گوش دادن طولانی سبک و پایدار می‌ماند؛ کنترل لمسی روی بدنه امکان تعویض ترک و پاسخ تماس را بدون گوشی می‌دهد.",
    category: "electronics",
    brand: "آریا تک",
    price: 2_890_000,
    compareAtPrice: 3_450_000,
    rating: 4.6,
    reviewCount: 128,
    stock: 24,
    colors: ["مشکی", "سفید"],
    specs: [
      { label: "باتری", value: "تا ۲۸ ساعت با قاب" },
      { label: "اتصال", value: "بلوتوث ۵٫۳" },
      { label: "ضدآب", value: "IPX4" },
      { label: "درایور", value: "۱۱ میلی‌متری داینامیک" },
      { label: "شارژ سریع", value: "۱۰ دقیقه ≈ ۲ ساعت پخش" },
      { label: "گارانتی", value: "۱۸ ماه شرکتی" },
    ],
    accent: "oklch(0.62 0.14 250)",
  },
  {
    id: "p2",
    slug: "smart-watch-lite",
    name: "ساعت هوشمند لایت",
    shortDescription: "مانیتور ضربان، اعلان‌ها و ضدآب",
    description:
      "ساعت هوشمند لایت با صفحه همیشه روشن AMOLED، ردیابی خواب و ورزش، و دریافت اعلان‌های گوشی روی مچ.\nسازگار با اندروید و iOS است و در حالت معمولی تا حدود ۷ روز شارژ نگه می‌دارد؛ بند قابل تعویض برای استایل روزمره هم دارد.",
    category: "electronics",
    brand: "نوانور",
    price: 4_250_000,
    rating: 4.3,
    reviewCount: 86,
    stock: 12,
    colors: ["خاکستری", "آبی تیره"],
    specs: [
      { label: "صفحه", value: "۱٫۴۳ اینچ AMOLED" },
      { label: "باتری", value: "تا ۷ روز" },
      { label: "ضدآب", value: "۵ATM" },
      { label: "حسگرها", value: "ضربان، SpO₂، شتاب‌سنج" },
      { label: "سازگاری", value: "اندروید ۸+ / iOS ۱۴+" },
      { label: "وزن", value: "حدود ۳۸ گرم بدون بند" },
    ],
    accent: "oklch(0.58 0.12 220)",
  },
  {
    id: "p3",
    slug: "usb-c-hub",
    name: "هاب USB-C هفت‌پورت",
    shortDescription: "HDMI، کارت‌خوان و شارژ همزمان",
    description:
      "هاب هفت‌پورت جمع‌وجور برای لپ‌تاپ‌های USB-C؛ خروجی HDMI تا ۴K، دو پورت USB-A، کارت‌خوان SD و پورت شارژ Pass-through.\nبرای میز کار یا کیف لپ‌تاپ جا می‌شود و بدون نیاز به آداپتور جداگانه، مانیتور و وسایل جانبی را همزمان وصل می‌کند.",
    category: "electronics",
    brand: "آریا تک",
    price: 1_590_000,
    compareAtPrice: 1_890_000,
    rating: 4.1,
    reviewCount: 54,
    stock: 40,
    specs: [
      { label: "خروجی تصویر", value: "HDMI ۴K@۶۰Hz" },
      { label: "شارژ", value: "تا ۱۰۰ وات Pass-through" },
      { label: "USB-A", value: "۲ پورت ۳٫۰" },
      { label: "کارت‌خوان", value: "SD / microSD" },
      { label: "بدنه", value: "آلومینیوم سبک" },
    ],
    accent: "oklch(0.68 0.11 180)",
  },
  {
    id: "p4",
    slug: "linen-shirt",
    name: "پیراهن لینن تابستانی",
    shortDescription: "پارچه تنفس‌پذیر، برش آزاد",
    description:
      "پیراهن لینن مخلوط با برش آزاد و یقه کلاسیک؛ پارچه تنفس‌پذیر برای هوای گرم تابستان.\nپس از شستشو کمی آبرفت طبیعی دارد؛ اتوی بخار ملایم ظاهر مرتب‌تری می‌دهد و برای محل کار غیررسمی یا بیرون‌رفتن روزانه مناسب است.",
    category: "apparel",
    brand: "کاوان",
    price: 980_000,
    compareAtPrice: 1_250_000,
    rating: 4.5,
    reviewCount: 203,
    stock: 35,
    colors: ["کرم", "سبز زیتونی", "آبی روشن"],
    specs: [
      { label: "جنس", value: "۷۰٪ لینن، ۳۰٪ پنبه" },
      { label: "سایزها", value: "S تا XL" },
      { label: "برش", value: "آزاد / Regular" },
      { label: "شستشو", value: "۳۰ درجه، خشکشویی پیشنهاد نمی‌شود" },
      { label: "کشور دوخت", value: "ایران" },
    ],
    accent: "oklch(0.78 0.1 145)",
  },
  {
    id: "p5",
    slug: "everyday-sneakers",
    name: "کفش روزمره مینیمال",
    shortDescription: "کفی نرم، رویه پارچه‌ای",
    description:
      "کفش روزمره مینیمال با رویه پارچه‌ای مشبک و کفی ارتجاعی EVA؛ سبک و مناسب پیاده‌روی شهری.\nرویه قابل شستشوی ملایم است و قالب استاندارد برای استفاده روزانه طراحی شده تا بدون خستگی طولانی راه بروید.",
    category: "apparel",
    brand: "سپید",
    price: 2_150_000,
    rating: 4.4,
    reviewCount: 167,
    stock: 18,
    colors: ["سفید", "مشکی"],
    specs: [
      { label: "جنس رویه", value: "پارچه مشبک" },
      { label: "کفی", value: "EVA نرم" },
      { label: "کف", value: "لاستیک ضدلغزش" },
      { label: "سایزها", value: "۴۰ تا ۴۵" },
      { label: "وزن تقریبی", value: "۲۶۰ گرم (سایز ۴۲)" },
    ],
    accent: "oklch(0.82 0.04 95)",
  },
  {
    id: "p6",
    slug: "wool-scarf",
    name: "شال پشمی سبک",
    shortDescription: "بافت نرم، مناسب پاییز",
    description:
      "شال پشمی سبک با بافت یکدست و لبه‌های تمیز؛ مناسب لایه‌بندی پاییزی بدون سنگینی.\nدر استفاده روزمره پرزدهی کمی دارد و با شستشوی دستی با آب سرد شکل خود را بهتر حفظ می‌کند.",
    category: "apparel",
    brand: "کاوان",
    price: 640_000,
    rating: 4.2,
    reviewCount: 41,
    stock: 0,
    colors: ["خاکستری", "شتری"],
    specs: [
      { label: "جنس", value: "پشم مرینوس مخلوط" },
      { label: "ابعاد", value: "۱۸۰×۴۵ سانتی‌متر" },
      { label: "ضخامت", value: "سبک تا متوسط" },
      { label: "مراقبت", value: "شستشوی دستی، خشک در سایه" },
    ],
    accent: "oklch(0.7 0.08 55)",
  },
  {
    id: "p7",
    slug: "ceramic-mug-set",
    name: "ست ماگ سرامیکی دوعددی",
    shortDescription: "۳۵۰ میلی‌لیتر، مناسب ماشین ظرفشویی",
    description:
      "ست دوعددی ماگ سرامیکی مات با دستهٔ ارگونومیک؛ مناسب چای و قهوه روزانه.\nقابل شستشو در ماشین ظرفشویی و مایکروویو است و لبه‌های صیقلی، نوشیدن راحت‌تری می‌دهد.",
    category: "home",
    brand: "پارس‌هوم",
    price: 420_000,
    compareAtPrice: 520_000,
    rating: 4.7,
    reviewCount: 312,
    stock: 60,
    colors: ["سفید مات", "زغالی"],
    specs: [
      { label: "ظرفیت", value: "۳۵۰ میلی‌لیتر" },
      { label: "مقاومت", value: "ماشین ظرفشویی و مایکروویو" },
      { label: "تعداد", value: "۲ عدد" },
      { label: "جنس", value: "سرامیک مات درجه یک" },
      { label: "ارتفاع", value: "حدود ۹٫۵ سانتی‌متر" },
    ],
    accent: "oklch(0.74 0.06 40)",
  },
  {
    id: "p8",
    slug: "desk-lamp",
    name: "چراغ مطالعه LED",
    shortDescription: "تنظیم شدت نور، بازوی منعطف",
    description:
      "چراغ مطالعه LED با سه سطح شدت نور و دمای رنگ قابل تنظیم؛ بازوی منعطف برای زاویه دلخواه روی میز کار.\nپایه پایدار است و تغذیه از USB-C دارد تا بدون آداپتور حجیم کنار لپ‌تاپ استفاده شود.",
    category: "home",
    brand: "نوانور",
    price: 1_180_000,
    rating: 4.0,
    reviewCount: 73,
    stock: 22,
    colors: ["سفید", "مشکی"],
    specs: [
      { label: "توان", value: "۹ وات" },
      { label: "تغذیه", value: "USB-C" },
      { label: "سطوح نور", value: "۳ شدت + تنظیم دمای رنگ" },
      { label: "طول بازو", value: "حدود ۴۰ سانتی‌متر" },
      { label: "عمر LED", value: "تا ۳۰٬۰۰۰ ساعت" },
    ],
    accent: "oklch(0.8 0.12 90)",
  },
  {
    id: "p9",
    slug: "storage-bins",
    name: "باکس نظم‌دهنده سه‌تایی",
    shortDescription: "پارچه‌ای، تاشو، با دسته",
    description:
      "مجموعه سه باکس نظم‌دهنده پارچه‌ای با قاب سیمی سبک؛ مناسب کمد، اتاق کودک و انباری کوچک.\nتاشو هستند تا وقتی خالی‌اند فضای کمی بگیرند و دسته برای جابه‌جایی آسان دارند.",
    category: "home",
    brand: "پارس‌هوم",
    price: 390_000,
    rating: 4.3,
    reviewCount: 95,
    stock: 48,
    colors: ["خاکستری روشن"],
    specs: [
      { label: "ابعاد", value: "۳۰×۲۰×۱۵ سانتی‌متر" },
      { label: "تعداد", value: "۳ عدد" },
      { label: "جنس", value: "پارچه ضخیم + قاب سیمی" },
      { label: "ویژگی", value: "تاشو، قابل شستشوی سطحی" },
    ],
    accent: "oklch(0.72 0.06 240)",
  },
  {
    id: "p10",
    slug: "cast-iron-pan",
    name: "تابه چدنی ۲۸ سانتی",
    shortDescription: "پوشش نچسب طبیعی، مناسب گاز و فر",
    description:
      "تابه چدنی ۲۸ سانتی پیش‌چرب‌شده با توزیع حرارت یکنواخت؛ مناسب گاز، فر و اجاق القایی.\nبا نگهداری درست (روغن‌کاری پس از شستشو) پوشش نچسب طبیعی‌اش ماندگار می‌ماند و برای سرخ‌کردن و گریل عالی است.",
    category: "home",
    brand: "زرین",
    price: 2_450_000,
    compareAtPrice: 2_890_000,
    rating: 4.8,
    reviewCount: 58,
    stock: 9,
    specs: [
      { label: "قطر", value: "۲۸ سانتی‌متر" },
      { label: "سازگاری", value: "گاز، فر، القایی" },
      { label: "جنس", value: "چدن پیش‌چرب‌شده" },
      { label: "دسته", value: "چدن یکپارچه + کمک‌دسته" },
      { label: "مراقبت", value: "بدون ماشین ظرفشویی؛ خشک فوری" },
    ],
    accent: "oklch(0.48 0.06 45)",
  },
  {
    id: "p11",
    slug: "vitamin-c-serum",
    name: "سرم ویتامین C روزانه",
    shortDescription: "روشن‌کننده، بافت سبک ۳۰ میلی‌لیتر",
    description:
      "سرم ویتامین C با بافت سبک و جذب سریع برای روتین صبحگاهی؛ به روشن‌تر دیده شدن پوست کمک می‌کند.\nهمراه با دستور مصرف روی جعبه است؛ بهتر است زیر کرم ضدآفتاب و مرطوب‌کننده استفاده شود.",
    category: "beauty",
    brand: "سپید",
    price: 780_000,
    rating: 4.4,
    reviewCount: 221,
    stock: 30,
    specs: [
      { label: "حجم", value: "۳۰ میلی‌لیتر" },
      { label: "نوع پوست", value: "نرمال تا خشک" },
      { label: "زمان مصرف", value: "صبح، روی پوست تمیز" },
      { label: "نگهداری", value: "دور از نور مستقیم و گرما" },
      { label: "بافت", value: "سبک، غیرچرب" },
    ],
    accent: "oklch(0.84 0.12 85)",
  },
  {
    id: "p12",
    slug: "herbal-shampoo",
    name: "شامپو گیاهی تقویت‌کننده",
    shortDescription: "بدون سولفات، ۴۰۰ میلی‌لیتر",
    description:
      "شامپو گیاهی بدون سولفات با عصاره رزماری و گزنه برای تقویت حس ریشه و کاهش خشکی کف سر.\nکف ملایم دارد و پس از آبکشی مو را سبک می‌گذارد؛ برای مصرف مداوم خانواده مناسب است.",
    category: "beauty",
    brand: "زرین",
    price: 265_000,
    compareAtPrice: 320_000,
    rating: 4.1,
    reviewCount: 149,
    stock: 55,
    specs: [
      { label: "حجم", value: "۴۰۰ میلی‌لیتر" },
      { label: "فرمول", value: "بدون سولفات" },
      { label: "عصاره‌ها", value: "رزماری، گزنه" },
      { label: "مناسب", value: "موی معمولی تا خشک" },
    ],
    accent: "oklch(0.7 0.12 150)",
  },
  {
    id: "p13",
    slug: "body-lotion",
    name: "لوسیون بدن مرطوب‌کننده",
    shortDescription: "آبرسان ۲۴ ساعته، رایحه ملایم",
    description:
      "لوسیون بدن با بافت غیرچرب و رایحه ملایم گیاهی؛ آبرسانی روزمره پس از حمام بدون سنگینی روی پوست.\nسریع جذب می‌شود و برای استفاده صبح و شب روی دست و بدن مناسب است.",
    category: "beauty",
    brand: "سپید",
    price: 345_000,
    rating: 4.6,
    reviewCount: 88,
    stock: 0,
    specs: [
      { label: "حجم", value: "۲۵۰ میلی‌لیتر" },
      { label: "مناسب", value: "همه انواع پوست" },
      { label: "بافت", value: "غیرچرب، جذب سریع" },
      { label: "رایحه", value: "گیاهی ملایم" },
    ],
    accent: "oklch(0.82 0.08 25)",
  },
  {
    id: "p14",
    slug: "portable-powerbank",
    name: "پاوربانک ۲۰٬۰۰۰ میلی‌آمپر",
    shortDescription: "شارژ سریع PD، دو پورت",
    description:
      "پاوربانک ۲۰٬۰۰۰ میلی‌آمپرساعت با پشتیبانی از Power Delivery و دو پورت خروجی همزمان برای گوشی و تبلت.\nشارژ سریع پایدار دارد و بدنه جمع‌وجور برای کیف روزمره طراحی شده است.",
    category: "electronics",
    brand: "آریا تک",
    price: 1_750_000,
    rating: 4.5,
    reviewCount: 190,
    stock: 27,
    colors: ["مشکی"],
    specs: [
      { label: "ظرفیت", value: "۲۰٬۰۰۰ میلی‌آمپرساعت" },
      { label: "خروجی", value: "USB-C PD تا ۳۰ وات" },
      { label: "ورودی", value: "USB-C تا ۱۸ وات" },
      { label: "پورت‌ها", value: "۱× USB-C + ۱× USB-A" },
      { label: "وزن", value: "حدود ۳۴۰ گرم" },
    ],
    accent: "oklch(0.55 0.1 280)",
  },
]

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}

export function getDiscountPercent(product: Product) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return 0
  }
  return Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
  )
}

export const PRICE_MIN = 0
export const PRICE_MAX = 5_000_000

export const shippingMethods = [
  {
    id: "express",
    title: "پیک سریع",
    hint: "تحویل ۱ تا ۲ روز کاری",
    price: 85_000,
  },
  {
    id: "standard",
    title: "پست پیشتاز",
    hint: "تحویل ۳ تا ۵ روز کاری",
    price: 45_000,
  },
  {
    id: "pickup",
    title: "تحویل از فروشگاه",
    hint: "آماده از فردا در شعبه ونک",
    price: 0,
  },
] as const

export const paymentMethods = [
  {
    id: "online",
    title: "پرداخت آنلاین",
    hint: "درگاه بانکی (نمایشی)",
  },
  {
    id: "cod",
    title: "پرداخت در محل",
    hint: "فقط برای تهران",
  },
  {
    id: "wallet",
    title: "کیف پول نورا",
    hint: "موجودی نمایشی",
  },
] as const
