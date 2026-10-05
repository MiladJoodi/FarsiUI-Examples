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
      "هدفون بی‌سیم با حذف نویز فعال، میکروفون دوتایی برای تماس شفاف و قاب شارژ سریع. مناسب رفت‌وآمد روزانه و جلسات آنلاین.",
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
    ],
    accent: "oklch(0.62 0.14 250)",
  },
  {
    id: "p2",
    slug: "smart-watch-lite",
    name: "ساعت هوشمند لایت",
    shortDescription: "مانیتور ضربان، اعلان‌ها و ضدآب",
    description:
      "ساعت هوشمند سبک با صفحه همیشه روشن، ردیابی خواب و ورزش، و سازگاری با اندروید و iOS. باتری تا ۷ روز در حالت معمولی.",
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
    ],
    accent: "oklch(0.58 0.12 220)",
  },
  {
    id: "p3",
    slug: "usb-c-hub",
    name: "هاب USB-C هفت‌پورت",
    shortDescription: "HDMI، کارت‌خوان و شارژ همزمان",
    description:
      "هاب جمع‌وجور برای لپ‌تاپ‌های USB-C با خروجی HDMI تا ۴K، دو پورت USB-A، کارت‌خوان SD و پورت شارژ ۱۰۰ وات.",
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
    ],
    accent: "oklch(0.68 0.11 180)",
  },
  {
    id: "p4",
    slug: "linen-shirt",
    name: "پیراهن لینن تابستانی",
    shortDescription: "پارچه تنفس‌پذیر، برش آزاد",
    description:
      "پیراهن لینن مخلوط با برش آزاد و یقه کلاسیک. مناسب هوای گرم؛ پس از شستشو کمی آبرفت طبیعی دارد.",
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
    ],
    accent: "oklch(0.78 0.1 145)",
  },
  {
    id: "p5",
    slug: "everyday-sneakers",
    name: "کفش روزمره مینیمال",
    shortDescription: "کفی نرم، رویه پارچه‌ای",
    description:
      "کفش روزمره با رویه پارچه‌ای قابل شستشو و کفی ارتجاعی. سبک و مناسب پیاده‌روی شهری.",
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
    ],
    accent: "oklch(0.82 0.04 95)",
  },
  {
    id: "p6",
    slug: "wool-scarf",
    name: "شال پشمی سبک",
    shortDescription: "بافت نرم، مناسب پاییز",
    description:
      "شال پشمی سبک با بافت یکدست و لبه‌های تمیز. بدون پرزدهی زیاد در استفادهٔ روزمره.",
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
    ],
    accent: "oklch(0.7 0.08 55)",
  },
  {
    id: "p7",
    slug: "ceramic-mug-set",
    name: "ست ماگ سرامیکی دوعددی",
    shortDescription: "۳۵۰ میلی‌لیتر، مناسب ماشین ظرفشویی",
    description:
      "ست دوعددی ماگ سرامیکی مات با دستهٔ ارگونومیک. مناسب چای و قهوه؛ قابل شستشو در ماشین ظرفشویی.",
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
    ],
    accent: "oklch(0.74 0.06 40)",
  },
  {
    id: "p8",
    slug: "desk-lamp",
    name: "چراغ مطالعه LED",
    shortDescription: "تنظیم شدت نور، بازوی منعطف",
    description:
      "چراغ مطالعه با سه سطح شدت نور، دمای رنگ قابل تنظیم و بازوی منعطف. پایهٔ پایدار برای میز کار.",
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
    ],
    accent: "oklch(0.8 0.12 90)",
  },
  {
    id: "p9",
    slug: "storage-bins",
    name: "باکس نظم‌دهنده سه‌تایی",
    shortDescription: "پارچه‌ای، تاشو، با دسته",
    description:
      "مجموعه سه باکس نظم‌دهنده پارچه‌ای با قاب سیمی سبک. مناسب کمد، اتاق کودک و انباری کوچک.",
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
    ],
    accent: "oklch(0.72 0.06 240)",
  },
  {
    id: "p10",
    slug: "cast-iron-pan",
    name: "تابه چدنی ۲۸ سانتی",
    shortDescription: "پوشش نچسب طبیعی، مناسب گاز و فر",
    description:
      "تابه چدنی پیش‌چرب‌شده با توزیع حرارت یکنواخت. مناسب گاز، فر و القایی؛ با نگهداری درست دوام بالایی دارد.",
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
    ],
    accent: "oklch(0.48 0.06 45)",
  },
  {
    id: "p11",
    slug: "vitamin-c-serum",
    name: "سرم ویتامین C روزانه",
    shortDescription: "روشن‌کننده، بافت سبک ۳۰ میلی‌لیتر",
    description:
      "سرم ویتامین C با بافت سبک و جذب سریع برای استفاده صبحگاهی. همراه با دستور مصرف روی جعبه.",
    category: "beauty",
    brand: "سپید",
    price: 780_000,
    rating: 4.4,
    reviewCount: 221,
    stock: 30,
    specs: [
      { label: "حجم", value: "۳۰ میلی‌لیتر" },
      { label: "نوع پوست", value: "نرمال تا خشک" },
    ],
    accent: "oklch(0.84 0.12 85)",
  },
  {
    id: "p12",
    slug: "herbal-shampoo",
    name: "شامپو گیاهی تقویت‌کننده",
    shortDescription: "بدون سولفات، ۴۰۰ میلی‌لیتر",
    description:
      "شامپو گیاهی بدون سولفات با عصاره رزماری و گزنه برای تقویت ریشه و کاهش ریزش ناشی از خشکی.",
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
    ],
    accent: "oklch(0.7 0.12 150)",
  },
  {
    id: "p13",
    slug: "body-lotion",
    name: "لوسیون بدن مرطوب‌کننده",
    shortDescription: "آبرسان ۲۴ ساعته، رایحه ملایم",
    description:
      "لوسیون بدن با بافت غیرچرب و رایحه ملایم گیاهی. مناسب استفاده روزانه پس از حمام.",
    category: "beauty",
    brand: "سپید",
    price: 345_000,
    rating: 4.6,
    reviewCount: 88,
    stock: 0,
    specs: [
      { label: "حجم", value: "۲۵۰ میلی‌لیتر" },
      { label: "مناسب", value: "همه انواع پوست" },
    ],
    accent: "oklch(0.82 0.08 25)",
  },
  {
    id: "p14",
    slug: "portable-powerbank",
    name: "پاوربانک ۲۰٬۰۰۰ میلی‌آمپر",
    shortDescription: "شارژ سریع PD، دو پورت",
    description:
      "پاوربانک با ظرفیت ۲۰٬۰۰۰ میلی‌آمپرساعت، پشتیبانی از Power Delivery و دو پورت خروجی همزمان.",
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
