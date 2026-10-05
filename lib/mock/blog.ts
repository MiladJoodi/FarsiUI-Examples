/**
 * Mock data for Blog example — editorial notes on Persian product design.
 */

export type BlogAuthor = {
  id: string
  name: string
  role: string
  initials: string
  bio: string
}

export type BlogCategory = {
  id: string
  slug: string
  name: string
  description: string
}

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; language: string; code: string }

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  categoryId: string
  authorId: string
  publishedAt: string
  readingMinutes: number
  featured?: boolean
  blocks: ContentBlock[]
}

export const blogName = "حاشیه"
export const blogTagline = "یادداشت‌هایی درباره طراحی محصول و تجربه فارسی"

export const authors: BlogAuthor[] = [
  {
    id: "a1",
    name: "سارا محمدی",
    role: "طراح محصول",
    initials: "س‌م",
    bio: "روی طراحی رابط‌های RTL و خوانایی محتوای فارسی کار می‌کند.",
  },
  {
    id: "a2",
    name: "رضا کریمی",
    role: "مهندس فرانت‌اند",
    initials: "ر‌ک",
    bio: "به دسترس‌پذیری، تایپوگرافی وب و الگوهای تعاملی علاقه دارد.",
  },
  {
    id: "a3",
    name: "مینا اکبری",
    role: "مدیر محصول",
    initials: "م‌ا",
    bio: "بین نیاز مشتری و تصمیم‌های طراحی پل می‌زند.",
  },
]

export const categories: BlogCategory[] = [
  {
    id: "cat-design",
    slug: "product-design",
    name: "طراحی محصول",
    description: "تصمیم‌های رابط، سلسله‌مراتب و تجربهٔ کاربری فارسی.",
  },
  {
    id: "cat-a11y",
    slug: "accessibility",
    name: "دسترس‌پذیری",
    description: "فوکوس، برچسب‌ها و خوانایی برای همه کاربران.",
  },
  {
    id: "cat-eng",
    slug: "engineering",
    name: "مهندسی",
    description: "الگوهای پیاده‌سازی، RTL و جزئیات فنی فرانت.",
  },
  {
    id: "cat-team",
    slug: "team",
    name: "فرهنگ تیم",
    description: "همکاری، بازبینی و نوشتن در تیم‌های محصول.",
  },
]

export const posts: BlogPost[] = [
  {
    id: "p1",
    slug: "rtl-form-labels",
    title: "برچسب فرم در RTL؛ جایی که بیشتر اشتباه می‌کنیم",
    excerpt:
      "ارتباط برچسب، فیلد و پیام خطا در رابط فارسی اغلب از ظاهر جلوتر است. این یادداشت از HTML شروع می‌کند.",
    categoryId: "cat-a11y",
    authorId: "a2",
    publishedAt: "۱۴۰۵/۰۷/۰۸",
    readingMinutes: 7,
    featured: true,
    blocks: [
      {
        type: "p",
        text: "در بسیاری از فرم‌های فارسی، فاصله و تراز درست به‌نظر می‌رسد، اما صفحه‌خوان‌ها ترتیب اشتباهی را اعلام می‌کنند. ریشه معمولاً در **نبود ارتباط معنایی** است، نه در CSS.",
      },
      {
        type: "h2",
        text: "اول برچسب را به فیلد وصل کنید",
      },
      {
        type: "p",
        text: "هر ورودی باید `id` داشته باشد و برچسب با `htmlFor` به همان شناسه اشاره کند. اگر فقط ظاهر را با فاصله تنظیم کنید، کاربر صفحه‌خوان ارتباط را از دست می‌دهد.",
      },
      {
        type: "ul",
        items: [
          "برچسب کوتاه و مشخص بنویسید؛ از تکرار placeholder خودداری کنید.",
          "پیام خطا را با `aria-describedby` به همان فیلد وصل کنید.",
          "بعد از ارسال ناموفق، فوکوس را به اولین فیلد نامعتبر ببرید.",
        ],
      },
      {
        type: "h2",
        text: "یک الگوی ساده",
      },
      {
        type: "code",
        language: "tsx",
        code: `<Field data-invalid={Boolean(error)}>
  <FieldLabel htmlFor="mobile">شماره موبایل</FieldLabel>
  <Input id="mobile" inputMode="tel" aria-invalid={Boolean(error)} />
  {error ? <FieldError>{error}</FieldError> : null}
</Field>`,
      },
      {
        type: "quote",
        text: "اگر فقط یک چیز را درست کنید، اتصال برچسب و فیلد بیشترین بازگشت را دارد.",
      },
      {
        type: "p",
        text: "در موبایل، تست واقعی با صفحه‌خوان یا حداقل با کیبورد، سریع‌تر از حدس زدن از روی ظاهر نتیجه می‌دهد.",
      },
    ],
  },
  {
    id: "p2",
    slug: "reading-width-persian",
    title: "عرض خواندن فارسی؛ نه خیلی پهن، نه فشرده",
    excerpt:
      "خط‌های بیش‌ازحد بلند خستگی می‌آورند. برای وبلاگ و مستندات محصول، عرض خواندن باید عمدی باشد.",
    categoryId: "cat-design",
    authorId: "a1",
    publishedAt: "۱۴۰۵/۰۷/۰۵",
    readingMinutes: 5,
    blocks: [
      {
        type: "p",
        text: "در صفحات محتوا، وسوسهٔ پر کردن عرض دسکتاپ زیاد است. اما چشم فارسی برای پاراگراف‌های خیلی پهن زود خسته می‌شود؛ به‌خصوص وقتی سطرها فشرده باشند.",
      },
      {
        type: "h2",
        text: "یک محدوده عملی",
      },
      {
        type: "p",
        text: "برای متن اصلی مقاله، عرض حدود ۶۵ تا ۷۵ نویسه معمولاً خواناتر است. این عدد قانون نیست؛ با فونت و ارتفاع خط شما باید اندازه‌گیری شود.",
      },
      {
        type: "ul",
        items: [
          "روی موبایل حاشیه کافی بگذارید؛ متن نباید به لبه بچسبد.",
          "عناوین را کوتاه نگه دارید تا در عرض کم نشکنند.",
          "کد و URL را با `dir=\"ltr\"` جدا کنید تا ترتیب کاراکترها خراب نشود.",
        ],
      },
      {
        type: "p",
        text: "اگر سایدبار دارید، اجازه ندهید ستون محتوا از عرض خوانا بیشتر شود؛ فضای اضافه را به حاشیه یا تصویر بدهید، نه به طول سطر.",
      },
    ],
  },
  {
    id: "p3",
    slug: "empty-states-that-help",
    title: "حالت خالی که واقعاً کمک می‌کند",
    excerpt:
      "حالت خالی فقط یک تصویر تزئینی نیست. باید بگوید چه خبر است و قدم بعدی چیست.",
    categoryId: "cat-design",
    authorId: "a3",
    publishedAt: "۱۴۰۵/۰۶/۲۸",
    readingMinutes: 6,
    blocks: [
      {
        type: "p",
        text: "وقتی فهرست خالی است، کاربر نباید حدس بزند سیستم خراب شده یا هنوز داده‌ای نیست. سه جزء کافی است: عنوان کوتاه، توضیح یک جمله‌ای، و یک اقدام واضح.",
      },
      {
        type: "h2",
        text: "لحن را کوتاه نگه دارید",
      },
      {
        type: "ul",
        items: [
          "از عذرخواهی تکراری پرهیز کنید.",
          "فعل مشخص پیشنهاد دهید: «اولین سند را بسازید».",
          "اگر محدودیت دسترسی دارید، همان را بگویید؛ مبهم ننویسید.",
        ],
      },
      {
        type: "quote",
        text: "حالت خالی بخشی از محصول است، نه صفحهٔ موقت تا داده برسد.",
      },
      {
        type: "p",
        text: "در رابط‌های فارسی، از اعداد لاتین در متن راهنما خودداری کنید مگر برای شناسهٔ فنی. تاریخ و تعداد را با ارقام فارسی نشان دهید.",
      },
    ],
  },
  {
    id: "p4",
    slug: "persian-digits-in-inputs",
    title: "ارقام فارسی در ورودی؛ نمایش و مقدار را جدا کنید",
    excerpt:
      "کاربر ممکن است با ارقام فارسی تایپ کند، اما منطق اعتبارسنجی به لاتین نیاز دارد. مرز این دو را واضح کنید.",
    categoryId: "cat-eng",
    authorId: "a2",
    publishedAt: "۱۴۰۵/۰۶/۲۰",
    readingMinutes: 8,
    blocks: [
      {
        type: "p",
        text: "اگر ورودی موبایل فقط ارقام لاتین را بپذیرد، تجربهٔ طبیعی کاربر فارسی قطع می‌شود. از سوی دیگر، ذخیرهٔ مستقیم ارقام فارسی در API معمولاً دردسر می‌سازد.",
      },
      {
        type: "h2",
        text: "الگوی پیشنهادی",
      },
      {
        type: "p",
        text: "در لایهٔ نمایش، ارقام را فارسی نشان دهید؛ در لایهٔ منطقی، قبل از اعتبارسنجی و ارسال، به لاتین نرمال کنید.",
      },
      {
        type: "code",
        language: "ts",
        code: `function toLatinDigits(value: string) {
  return value.replace(/[۰-۹]/g, (d) =>
    String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))
  )
}`,
      },
      {
        type: "p",
        text: "برای فیلدهای غیرعددی مثل ایمیل، تبدیل ارقام را اعمال نکنید. دامنهٔ تبدیل را صریح نگه دارید.",
      },
    ],
  },
  {
    id: "p5",
    slug: "design-review-checklist",
    title: "چک‌لیست کوتاه برای ریویو طراحی فارسی",
    excerpt:
      "پنج مورد که قبل از تأیید UI ارزش دارند؛ بدون تبدیل جلسه به بازبینی بی‌پایان.",
    categoryId: "cat-team",
    authorId: "a1",
    publishedAt: "۱۴۰۵/۰۶/۱۲",
    readingMinutes: 4,
    blocks: [
      {
        type: "p",
        text: "ریویوهای طولانی اغلب به‌خاطر نبود معیار مشترک طولانی می‌شوند. یک چک‌لیست کوتاه بهتر از ده نظر پراکنده کار می‌کند.",
      },
      {
        type: "ul",
        items: [
          "آیا سلسله‌مراتب عنوان با یک نگاه روشن است؟",
          "آیا در عرض ۳۹۰px overflow افقی دیده می‌شود؟",
          "آیا دکمه‌های فقط‌آیکن برچسب دسترس‌پذیر دارند؟",
          "آیا اعداد و تاریخ در UI فارسی‌اند؟",
          "آیا حالت خالی و خطا تعریف شده است؟",
        ],
      },
      {
        type: "p",
        text: "اگر زمان کم است، سه مورد اول را اجباری کنید. بقیه را در بازبینی بعدی ببندید.",
      },
    ],
  },
  {
    id: "p6",
    slug: "focus-states-matter",
    title: "فوکوس قابل‌دیدن؛ جزئیاتی که دیر دیده می‌شود",
    excerpt:
      "حذف outline بدون جایگزین، کیبورد را از کار می‌اندازد. در رابط‌های RTL هم همین اصل برقرار است.",
    categoryId: "cat-a11y",
    authorId: "a2",
    publishedAt: "۱۴۰۵/۰۵/۳۰",
    readingMinutes: 5,
    blocks: [
      {
        type: "p",
        text: "بسیاری از پوسته‌ها `outline` را حذف می‌کنند چون «زشت» به‌نظر می‌رسد. نتیجه این است که کاربر کیبورد مسیر خود را گم می‌کند.",
      },
      {
        type: "h2",
        text: "جایگزین بسازید، حذف نکنید",
      },
      {
        type: "p",
        text: "یک حلقهٔ فوکوس با کنتراست کافی، روی دکمه‌ها، لینک‌ها و کنترل‌های فرم لازم است. در RTL جهت حلقه را با ویژگی‌های منطقی مثل `inset-inline` هماهنگ کنید.",
      },
      {
        type: "quote",
        text: "اگر فوکوس را نمی‌بینید، محصول برای بخشی از کاربران ناقص است.",
      },
    ],
  },
  {
    id: "p7",
    slug: "writing-release-notes",
    title: "نوشتن یادداشت انتشار به زبان کاربر",
    excerpt:
      "یادداشت انتشار نباید فهرست commit باشد. بگویید چه چیزی برای کاربر بهتر شده است.",
    categoryId: "cat-team",
    authorId: "a3",
    publishedAt: "۱۴۰۵/۰۵/۱۸",
    readingMinutes: 6,
    blocks: [
      {
        type: "p",
        text: "«رفکتور ماژول پرداخت» برای کاربر معنایی ندارد. به‌جایش بنویسید: «خطای تکراری پرداخت کمتر رخ می‌دهد و پیام واضح‌تری می‌بینید.»",
      },
      {
        type: "h2",
        text: "ساختار پیشنهادی",
      },
      {
        type: "ul",
        items: [
          "یک جمله دربارهٔ هدف نسخه",
          "سه تا پنج تغییر قابل‌مشاهده",
          "اگر چیزی خراب شده، صادقانه بگویید و راهکار بدهید",
        ],
      },
      {
        type: "p",
        text: "از اغراق بازاریابی پرهیز کنید. لحن مستقیم و کوتاه اعتماد بیشتری می‌سازد.",
      },
    ],
  },
  {
    id: "p8",
    slug: "component-density",
    title: "تراکم رابط؛ کجا جا برای تنفس بگذارید",
    excerpt:
      "فشرده‌سازی بیش‌ازحد در داشبورد فارسی، اسکن را سخت می‌کند. تراکم باید با نوع کار جور باشد.",
    categoryId: "cat-design",
    authorId: "a1",
    publishedAt: "۱۴۰۵/۰۵/۰۴",
    readingMinutes: 5,
    blocks: [
      {
        type: "p",
        text: "جدول‌های متراکم برای اپراتور مفیدند؛ صفحهٔ خواندن مقاله نه. قبل از کم‌کردن فاصله‌ها بپرسید کاربر در این صفحه چه کاری انجام می‌دهد.",
      },
      {
        type: "ul",
        items: [
          "برای متن طولانی، ارتفاع خط را تنگ نکنید.",
          "گروه‌های مرتبط را نزدیک هم نگه دارید؛ گروه‌های جدا را فاصله دهید.",
          "در موبایل، اهداف لمسی را قربانی تراکم نکنید.",
        ],
      },
      {
        type: "p",
        text: "اگر همه چیز مهم به‌نظر برسد، هیچ چیز مهم نیست. یک **سلسله‌مراتب واضح**، صفحه را خلوت‌تر از حذف تصادفی فاصله‌ها می‌کند.",
      },
    ],
  },
]

export function getAuthor(id: string) {
  return authors.find((a) => a.id === id) ?? authors[0]
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id) ?? categories[0]
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug)
}

export function getPostsByCategory(categoryId: string) {
  return posts.filter((p) => p.categoryId === categoryId)
}

export function getRelatedPosts(post: BlogPost, limit = 3) {
  return posts
    .filter((p) => p.id !== post.id && p.categoryId === post.categoryId)
    .concat(posts.filter((p) => p.id !== post.id && p.categoryId !== post.categoryId))
    .slice(0, limit)
}

export function getFeaturedPost() {
  return posts.find((p) => p.featured) ?? posts[0]
}

export function getRecentPosts(excludeId?: string) {
  return posts.filter((p) => p.id !== excludeId)
}

export function getRecommendedPosts(excludeId?: string, limit = 3) {
  return [...posts]
    .filter((p) => p.id !== excludeId)
    .sort((a, b) => b.readingMinutes - a.readingMinutes)
    .slice(0, limit)
}
