/**
 * Mock data for Team Chat example.
 */

export type ChatMember = {
  id: string
  name: string
  initials: string
  role: string
  online: boolean
}

export type ConversationKind = "channel" | "dm"

export type ChatAttachment = {
  name: string
  sizeLabel: string
  type: "file" | "image"
}

export type ChatReaction = {
  emoji: string
  count: number
}

export type ChatMessage = {
  id: string
  authorId: string
  body: string
  time: string
  replyTo?: string
  reactions?: ChatReaction[]
  attachment?: ChatAttachment
}

export type Conversation = {
  id: string
  kind: ConversationKind
  name: string
  topic?: string
  memberIds: string[]
  unread: number
  lastPreview: string
  lastTime: string
  messages: ChatMessage[]
  unreadAfterId?: string
}

export const CURRENT_USER_ID = "u1"

export const chatMembers: ChatMember[] = [
  {
    id: "u1",
    name: "نیما کاظمی",
    initials: "ن‌ک",
    role: "مدیر محصول",
    online: true,
  },
  {
    id: "u2",
    name: "سارا محمدی",
    initials: "س‌م",
    role: "طراح UI",
    online: true,
  },
  {
    id: "u3",
    name: "رضا کریمی",
    initials: "ر‌ک",
    role: "فرانت‌اند",
    online: false,
  },
  {
    id: "u4",
    name: "مینا اکبری",
    initials: "م‌ا",
    role: "بک‌اند",
    online: true,
  },
  {
    id: "u5",
    name: "بهرام یوسفی",
    initials: "ب‌ی",
    role: "QA",
    online: false,
  },
]

export function getChatMember(id: string) {
  return chatMembers.find((m) => m.id === id) ?? chatMembers[0]
}

export const conversations: Conversation[] = [
  {
    id: "c-general",
    kind: "channel",
    name: "عمومی",
    topic: "هماهنگی روزانه تیم همیار",
    memberIds: ["u1", "u2", "u3", "u4", "u5"],
    unread: 2,
    lastPreview: "اسلایدهای دمو را تا ساعت ۱۵ می‌فرستم.",
    lastTime: "۱۰:۴۲",
    unreadAfterId: "m-g4",
    messages: [
      {
        id: "m-g1",
        authorId: "u2",
        body: "صبح بخیر. برای دموی مشتری، نسخهٔ پیش‌نمایش آماده است؟",
        time: "۰۹:۱۵",
      },
      {
        id: "m-g2",
        authorId: "u1",
        body: "بله، روی staging چک کنید. فقط فیلتر کانال هنوز نمایشی است.",
        time: "۰۹:۱۸",
        reactions: [{ emoji: "👍", count: 2 }],
      },
      {
        id: "m-g3",
        authorId: "u3",
        body: "من هم جریان را روی موبایل تست کردم؛ لیست گفتگو درست اسکرول می‌شود.",
        time: "۰۹:۴۰",
      },
      {
        id: "m-g4",
        authorId: "u4",
        body: "API کاربران تا ظهر merge می‌شود.",
        time: "۱۰:۰۵",
      },
      {
        id: "m-g5",
        authorId: "u5",
        body: "اسلایدهای دمو را تا ساعت ۱۵ می‌فرستم.",
        time: "۱۰:۴۲",
        replyTo: "m-g2",
        attachment: {
          name: "demo-slides.pdf",
          sizeLabel: "۱٫۸ مگابایت",
          type: "file",
        },
      },
    ],
  },
  {
    id: "c-design",
    kind: "channel",
    name: "طراحی",
    topic: "فریم‌ها، توکن‌ها و بازبینی UI",
    memberIds: ["u1", "u2", "u3"],
    unread: 0,
    lastPreview: "Spacing فرم تنظیمات را یک پله کم کردم.",
    lastTime: "دیروز",
    messages: [
      {
        id: "m-d1",
        authorId: "u2",
        body: "فریم سایدبار موبایل را در Figma آپدیت کردم.",
        time: "۱۶:۲۰",
        attachment: {
          name: "sidebar-mobile-v3.fig",
          sizeLabel: "۲٫۴ مگابایت",
          type: "file",
        },
      },
      {
        id: "m-d2",
        authorId: "u1",
        body: "عالی. فاصلهٔ آیکن و عنوان را هم در حالت جمع‌شده چک کنید.",
        time: "۱۶:۳۵",
      },
      {
        id: "m-d3",
        authorId: "u2",
        body: "Spacing فرم تنظیمات را یک پله کم کردم.",
        time: "۱۸:۱۰",
        reactions: [{ emoji: "✅", count: 1 }],
      },
    ],
  },
  {
    id: "c-eng",
    kind: "channel",
    name: "مهندسی",
    topic: "فرانت، بک‌اند و انتشار",
    memberIds: ["u1", "u3", "u4", "u5"],
    unread: 5,
    lastPreview: "Build روی main سبز شد.",
    lastTime: "۰۸:۵۵",
    unreadAfterId: "m-e2",
    messages: [
      {
        id: "m-e1",
        authorId: "u4",
        body: "PR مربوط به rate-limit آمادهٔ ریویو است.",
        time: "۰۸:۲۰",
      },
      {
        id: "m-e2",
        authorId: "u3",
        body: "کتابخانهٔ chart را به نسخهٔ جدید ارتقا دادم؛ tooltipها RTL هستند.",
        time: "۰۸:۳۵",
      },
      {
        id: "m-e3",
        authorId: "u5",
        body: "Smoke تست چت روی ۳۹۰px پاس شد.",
        time: "۰۸:۴۸",
      },
      {
        id: "m-e4",
        authorId: "u1",
        body: "ممنون. امروز فقط polish می‌کنیم، feature جدید نه.",
        time: "۰۸:۵۰",
      },
      {
        id: "m-e5",
        authorId: "u3",
        body: "Build روی main سبز شد.",
        time: "۰۸:۵۵",
        reactions: [
          { emoji: "🎉", count: 3 },
          { emoji: "🚀", count: 1 },
        ],
      },
    ],
  },
  {
    id: "dm-sara",
    kind: "dm",
    name: "سارا محمدی",
    memberIds: ["u1", "u2"],
    unread: 1,
    lastPreview: "فایل پیش‌نمایش را فرستادم.",
    lastTime: "۱۱:۰۸",
    unreadAfterId: "m-s2",
    messages: [
      {
        id: "m-s1",
        authorId: "u2",
        body: "برای هدر داشبورد، عنوان را کوتاه‌تر کردم.",
        time: "۱۰:۵۰",
      },
      {
        id: "m-s2",
        authorId: "u1",
        body: "خوب است. روی خشت هم چک کردی؟",
        time: "۱۰:۵۸",
      },
      {
        id: "m-s3",
        authorId: "u2",
        body: "فایل پیش‌نمایش را فرستادم.",
        time: "۱۱:۰۸",
        attachment: {
          name: "header-preview.png",
          sizeLabel: "۳۸۰ کیلوبایت",
          type: "image",
        },
      },
    ],
  },
  {
    id: "dm-reza",
    kind: "dm",
    name: "رضا کریمی",
    memberIds: ["u1", "u3"],
    unread: 0,
    lastPreview: "باشه، تا بعدازظهر می‌بندمش.",
    lastTime: "دیروز",
    messages: [
      {
        id: "m-r1",
        authorId: "u1",
        body: "منوی عملیات پیام را با بقیهٔ اکشن‌ها یکی کن.",
        time: "۱۵:۱۰",
      },
      {
        id: "m-r2",
        authorId: "u3",
        body: "باشه، تا بعدازظهر می‌بندمش.",
        time: "۱۵:۲۲",
      },
    ],
  },
  {
    id: "dm-mina",
    kind: "dm",
    name: "مینا اکبری",
    memberIds: ["u1", "u4"],
    unread: 0,
    lastPreview: "لاگ خطا را در کانال مهندسی گذاشتم.",
    lastTime: "دوشنبه",
    messages: [
      {
        id: "m-n1",
        authorId: "u4",
        body: "تایم‌اوت کوئری گزارش گاهی بالای ۱ثانیه می‌رود.",
        time: "۱۲:۰۰",
      },
      {
        id: "m-n2",
        authorId: "u1",
        body: "ایندکس ماه را هم اضافه کنید لطفاً. جزئیات در https://status.hamyar.dev",
        time: "۱۲:۱۲",
      },
      {
        id: "m-n3",
        authorId: "u4",
        body: "لاگ خطا را در کانال مهندسی گذاشتم.",
        time: "۱۲:۴۰",
        replyTo: "m-n1",
      },
    ],
  },
]

export const workspaceName = "همیار"
export const workspaceHint = "فضای کاری محصول"
