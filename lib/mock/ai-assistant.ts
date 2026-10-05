/**
 * Mock data for AI Assistant example.
 */

export type AssistantModel = {
  id: string
  name: string
  hint: string
}

export type SourceRef = {
  id: string
  title: string
  kind: "doc" | "web" | "file"
  detail: string
}

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language: string; code: string }
  | { type: "sources"; sourceIds: string[] }

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  createdAt: string
  blocks: ContentBlock[]
}

export type Conversation = {
  id: string
  title: string
  preview: string
  updatedAt: string
  group: "today" | "week" | "older"
  modelId: string
  sourceIds: string[]
  messages: ChatMessage[]
}

export const assistantName = "نورا"
export const assistantHint = "دستیار کاری برای نوشتن، تحلیل و کدنویسی"

export const models: AssistantModel[] = [
  {
    id: "nora-25",
    name: "نورا ۲٫۵",
    hint: "تعادل کیفیت و سرعت",
  },
  {
    id: "nora-fast",
    name: "نورا سریع",
    hint: "پاسخ کوتاه‌تر برای کارهای روزمره",
  },
  {
    id: "nora-precise",
    name: "نورا دقیق",
    hint: "تحلیل عمیق‌تر و استناد بیشتر",
  },
]

export const sources: SourceRef[] = [
  {
    id: "s1",
    title: "راهنمای دسترسی‌پذیری فرم RTL",
    kind: "doc",
    detail: "internal · docs/a11y-forms.md",
  },
  {
    id: "s2",
    title: "الگوی Field و Label در FarsiUI",
    kind: "file",
    detail: "components/ui/field.tsx",
  },
  {
    id: "s3",
    title: "WCAG ۲٫۲ — Labels or Instructions",
    kind: "web",
    detail: "w3.org/WAI/WCAG22",
  },
  {
    id: "s4",
    title: "چک‌لیست بازبینی PR فرانت",
    kind: "doc",
    detail: "internal · eng/pr-checklist.md",
  },
  {
    id: "s5",
    title: "نمونه کاتالوگ فروشگاه نورا",
    kind: "file",
    detail: "lib/mock/ecommerce.ts",
  },
  {
    id: "s6",
    title: "لحن برند نورا — نسخه کوتاه",
    kind: "doc",
    detail: "brand/voice-fa.md",
  },
]

export function getSource(id: string) {
  return sources.find((s) => s.id === id)
}

export const suggestedPrompts = [
  {
    id: "sp1",
    title: "بازبینی دسترس‌پذیری",
    prompt:
      "یک فرم ثبت‌نام فارسی با فیلد موبایل و کد تأیید را از نظر دسترس‌پذیری و RTL بررسی کن و اولویت اصلاح‌ها را بگو.",
  },
  {
    id: "sp2",
    title: "بازنویسی پیام خطا",
    prompt:
      "این پیام خطا را کوتاه، مؤدبانه و قابل‌اقدام بازنویسی کن: «خطای سرور رخ داد، دوباره تلاش کنید.»",
  },
  {
    id: "sp3",
    title: "نمونه کد اعتبارسنجی",
    prompt:
      "یک تابع TypeScript کوتاه برای نرمال‌سازی شماره موبایل ایران بنویس که ارقام فارسی را هم بپذیرد.",
  },
  {
    id: "sp4",
    title: "خلاصه جلسه",
    prompt:
      "از این یادداشت جلسه یک خلاصه اجرایی سه جمله‌ای و فهرست کارها بساز: «دموی مشتری پنج‌شنبه؛ فیلتر کانال هنوز نمایشی است؛ اسلایدها تا ساعت ۱۵.»",
  },
]

export const conversations: Conversation[] = [
  {
    id: "c1",
    title: "دسترس‌پذیری فرم RTL",
    preview: "اول برچسب و پیام خطا را به هم وصل کنید…",
    updatedAt: "۱۰:۲۴",
    group: "today",
    modelId: "nora-precise",
    sourceIds: ["s1", "s2", "s3"],
    messages: [
      {
        id: "m1",
        role: "user",
        createdAt: "۱۰:۱۸",
        blocks: [
          {
            type: "text",
            text: "فرم ثبت‌نام فارسی داریم؛ روی موبایل focus به پیام خطا نمی‌رود و ترتیب tab هم گیج‌کننده است. از کجا شروع کنم؟",
          },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        createdAt: "۱۰:۱۹",
        blocks: [
          {
            type: "text",
            text: "از اتصال معنایی برچسب و فیلد شروع کنید؛ بعد ترتیب فوکوس و اعلام خطا. برای RTL معمولاً مشکل از CSS نیست، از HTML ناقص است.",
          },
          {
            type: "list",
            items: [
              "هر Input باید با Label مرتبط باشد (`htmlFor` / `id`).",
              "پیام خطا را با `aria-describedby` به همان فیلد وصل کنید.",
              "بعد از Submit ناموفق، فوکوس را به اولین فیلد نامعتبر ببرید.",
              "ترتیب tab را با DOM واقعی بسنجید، نه فقط ظاهر بصری.",
            ],
          },
          {
            type: "sources",
            sourceIds: ["s1", "s3"],
          },
        ],
      },
      {
        id: "m3",
        role: "user",
        createdAt: "۱۰:۲۲",
        blocks: [
          {
            type: "text",
            text: "برای Field خودتان در FarsiUI چه الگویی پیشنهاد می‌کنی؟",
          },
        ],
      },
      {
        id: "m4",
        role: "assistant",
        createdAt: "۱۰:۲۴",
        blocks: [
          {
            type: "text",
            text: "از `Field` + `FieldLabel` + `FieldError` استفاده کنید تا ارتباط برچسب و وضعیت خطا یکدست بماند:",
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
            type: "text",
            text: "اگر چند خطا دارید، فقط اولین مورد را فوکوس کنید تا کاربر مسیر واضحی داشته باشد.",
          },
          {
            type: "sources",
            sourceIds: ["s2"],
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    title: "نرمال‌سازی موبایل",
    preview: "ارقام فارسی را قبل از اعتبارسنجی نرمال کنید…",
    updatedAt: "۰۹:۰۵",
    group: "today",
    modelId: "nora-25",
    sourceIds: ["s4"],
    messages: [
      {
        id: "m5",
        role: "user",
        createdAt: "۰۹:۰۲",
        blocks: [
          {
            type: "text",
            text: "تابعی می‌خواهم که «۰۹۱۲۱۲۳۴۵۶۷» و «09121234567» را یکسان کند.",
          },
        ],
      },
      {
        id: "m6",
        role: "assistant",
        createdAt: "۰۹:۰۵",
        blocks: [
          {
            type: "text",
            text: "ابتدا ارقام را به لاتین برگردانید، فاصله و خط تیره را حذف کنید، بعد طول و پیش‌شماره را چک کنید:",
          },
          {
            type: "code",
            language: "ts",
            code: `function normalizeIranMobile(input: string) {
  const digits = input
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/\\D/g, "")
  if (digits.startsWith("98") && digits.length === 12) {
    return \`0\${digits.slice(2)}\`
  }
  return digits
}`,
          },
          {
            type: "list",
            items: [
              "خروجی را همیشه با صفر ابتدایی نگه دارید.",
              "اعتبارسنجی نهایی را روی مقدار نرمال‌شده انجام دهید.",
              "در UI می‌توانید نمایش فارسی و مقدار منطقی لاتین را جدا کنید.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c3",
    title: "لحن پیام سبد خرید",
    preview: "کوتاه، مستقیم، بدون عذرخواهی اضافه…",
    updatedAt: "دیروز",
    group: "week",
    modelId: "nora-fast",
    sourceIds: ["s5", "s6"],
    messages: [
      {
        id: "m7",
        role: "user",
        createdAt: "۱۶:۴۰",
        blocks: [
          {
            type: "text",
            text: "برای سبد خالی فروشگاه، یک متن کوتاه و حرفه‌ای پیشنهاد بده؛ نه رسمی خشک، نه خودمانی اغراق‌آمیز.",
          },
        ],
      },
      {
        id: "m8",
        role: "assistant",
        createdAt: "۱۶:۴۲",
        blocks: [
          {
            type: "text",
            text: "پیشنهاد اصلی:",
          },
          {
            type: "list",
            items: [
              "عنوان: سبد خرید خالی است",
              "توضیح: هنوز کالایی انتخاب نکرده‌اید. از فروشگاه شروع کنید.",
              "CTA: مشاهده محصولات",
            ],
          },
          {
            type: "text",
            text: "اگر می‌خواهید کمی گرم‌تر باشد: «سبدتان خالی است. وقتی آماده‌اید، از کاتالوگ انتخاب کنید.» لحن برند را کوتاه و مستقیم نگه دارید.",
          },
          {
            type: "sources",
            sourceIds: ["s6", "s5"],
          },
        ],
      },
    ],
  },
  {
    id: "c4",
    title: "چک‌لیست ریویو PR",
    preview: "RTL، focus، و حالت خالی را جداگانه ببینید…",
    updatedAt: "دوشنبه",
    group: "older",
    modelId: "nora-25",
    sourceIds: ["s4"],
    messages: [
      {
        id: "m9",
        role: "user",
        createdAt: "۱۱:۱۰",
        blocks: [
          {
            type: "text",
            text: "برای PRهای UI فارسی، یک چک‌لیست فشرده می‌خواهم که در ریویو جا بماند.",
          },
        ],
      },
      {
        id: "m10",
        role: "assistant",
        createdAt: "۱۱:۱۲",
        blocks: [
          {
            type: "list",
            items: [
              "آیا اعداد و تاریخ در UI فارسی‌اند؟",
              "آیا در عرض ۳۹۰px overflow افقی نیست؟",
              "آیا حالت خالی و بارگذاری تعریف شده؟",
              "آیا دکمه‌های فقط‌آیکن `aria-label` دارند؟",
              "آیا محتوای LTR مثل کد و URL جهت درست دارند؟",
            ],
          },
          {
            type: "text",
            text: "اگر فقط سه مورد را اجباری کنید، overflow موبایل، برچسب دسترس‌پذیری، و اعداد فارسی بیشترین بازگشت را دارند.",
          },
          {
            type: "sources",
            sourceIds: ["s4"],
          },
        ],
      },
    ],
  },
]

export function createEmptyConversation(modelId: string): Conversation {
  return {
    id: `local-${Date.now()}`,
    title: "گفتگوی جدید",
    preview: "هنوز پیامی ارسال نشده است.",
    updatedAt: "الان",
    group: "today",
    modelId,
    sourceIds: [],
    messages: [],
  }
}

/** Lightweight local reply generator for demo sends. */
export function buildLocalAssistantReply(userText: string): ContentBlock[] {
  const trimmed = userText.trim()
  if (/کد|typescript|تابع|function/i.test(trimmed)) {
    return [
      {
        type: "text",
        text: "یک نسخهٔ کوتاه و قابل‌استفاده:",
      },
      {
        type: "code",
        language: "ts",
        code: `export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}`,
      },
      {
        type: "text",
        text: "اگر ورودی‌تان دامنهٔ دیگری دارد، محدوده را صریح در امضای تابع نگه دارید تا خوانایی بهتر شود.",
      },
    ]
  }
  if (/خطا|پیام|متن|بازنویس/i.test(trimmed)) {
    return [
      {
        type: "text",
        text: "پیشنهاد کوتاه:",
      },
      {
        type: "list",
        items: [
          "ذخیره انجام نشد. اتصال را بررسی کنید و دوباره امتحان کنید.",
          "اگر تکرار شد، چند دقیقه بعد تلاش کنید یا با پشتیبانی تماس بگیرید.",
        ],
      },
      {
        type: "text",
        text: "از فعل مجهول و عذرخواهی تکراری پرهیز کنید؛ یک اقدام مشخص کافی است.",
      },
    ]
  }
  return [
    {
      type: "text",
      text: "خلاصهٔ پیشنهاد: مسئله را به یک هدف، یک محدودیت، و یک قدم بعدی بشکنید. اگر جزئیات بیشتری از UI یا کد بدهید، پاسخ را دقیق‌تر می‌کنم.",
    },
    {
      type: "list",
      items: [
        "هدف را در یک جمله بنویسید.",
        "محدودیت فنی یا زمانی را مشخص کنید.",
        "یک خروجی قابل‌اندازه‌گیری تعریف کنید.",
      ],
    },
  ]
}

export const groupLabels = {
  today: "امروز",
  week: "این هفته",
  older: "قدیمی‌تر",
} as const
