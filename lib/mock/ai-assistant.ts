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

export const assistantName = "FarsiUI"
export const assistantHint = "دستیار ساخت رابط فارسی"

export const models: AssistantModel[] = [
  {
    id: "nora-25",
    name: "FarsiUI · استاندارد",
    hint: "تعادل کیفیت و سرعت",
  },
  {
    id: "nora-fast",
    name: "FarsiUI · سریع",
    hint: "پاسخ کوتاه‌تر برای کارهای روزمره",
  },
  {
    id: "nora-precise",
    name: "FarsiUI · دقیق",
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
            text: "فرم ثبت‌نام روی موبایل فوکوس خطا ندارد. از کجا شروع کنم؟",
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
            text: "اول برچسب و فیلد را وصل کنید؛ بعد فوکوس خطای Submit.",
          },
          {
            type: "list",
            items: [
              "`Label` را با `htmlFor` به Input وصل کنید.",
              "خطا را با `aria-describedby` به فیلد ببندید.",
              "بعد Submit، فوکوس روی اولین فیلد نامعتبر برود.",
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
            text: "در FarsiUI چه الگویی پیشنهاد می‌کنی؟",
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
            text: "از `Field` + `FieldLabel` + `FieldError` استفاده کنید:",
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
            text: "«۰۹۱۲…» و «0912…» را یکسان کن.",
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
            text: "ارقام را لاتین کنید، سپس طول و پیش‌شماره را بسنجید:",
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
            text: "متن کوتاه برای سبد خالی می‌خواهم؛ نه خشک، نه اغراق‌آمیز.",
          },
        ],
      },
      {
        id: "m8",
        role: "assistant",
        createdAt: "۱۶:۴۲",
        blocks: [
          {
            type: "list",
            items: [
              "عنوان: سبد خرید خالی است",
              "توضیح: هنوز کالایی انتخاب نکرده‌اید.",
              "CTA: مشاهده محصولات",
            ],
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
            text: "چک‌لیست فشرده برای ریویو UI فارسی.",
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
              "اعداد و تاریخ فارسی‌اند؟",
              "در ۳۹۰px overflow نیست؟",
              "حالت خالی و بارگذاری هست؟",
              "آیکن‌ها `aria-label` دارند؟",
            ],
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
