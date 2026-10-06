/**
 * هم‌صدا — mock data for Persian team rooms product.
 */

export type ChatMember = {
  id: string
  name: string
  initials: string
  role: string
  online: boolean
  /** Public path under /avatars */
  avatar?: string
}

export type ConversationKind = "room" | "direct"

export type ChatAttachment = {
  name: string
  sizeLabel: string
  type: "file" | "image"
}

export type ChatReaction = {
  emoji: string
  count: number
  reacted?: boolean
}

export type ChatMessage = {
  id: string
  authorId: string
  body: string
  time: string
  replyTo?: string
  reactions?: ChatReaction[]
  attachment?: ChatAttachment
  pinned?: boolean
}

export type Conversation = {
  id: string
  kind: ConversationKind
  name: string
  short?: string
  topic?: string
  memberIds: string[]
  unread: number
  lastPreview: string
  lastTime: string
  messages: ChatMessage[]
  unreadAfterId?: string
  typingIds?: string[]
}

export const CURRENT_USER_ID = "u1"

export const workspaceName = "هم‌صدا"
export const workspaceHint = "اتاق گفتگوی تیم همیار"
export const workspaceMark = "ه"

export const chatMembers: ChatMember[] = [
  {
    id: "u1",
    name: "نیما کاظمی",
    initials: "ن‌ک",
    role: "مدیر محصول",
    online: true,
    avatar: "/avatars/01.jpg",
  },
  {
    id: "u2",
    name: "سارا محمدی",
    initials: "س‌م",
    role: "طراح محصول",
    online: true,
    avatar: "/avatars/02.jpg",
  },
  {
    id: "u3",
    name: "رضا کریمی",
    initials: "ر‌ک",
    role: "فرانت‌اند",
    online: true,
    avatar: "/avatars/03.jpg",
  },
  {
    id: "u4",
    name: "مینا اکبری",
    initials: "م‌ا",
    role: "بک‌اند",
    online: false,
    avatar: "/avatars/04.jpg",
  },
  {
    id: "u5",
    name: "بهرام یوسفی",
    initials: "ب‌ی",
    role: "اطمینان کیفیت",
    online: true,
    avatar: "/avatars/05.jpg",
  },
  {
    id: "u6",
    name: "الهام رضوی",
    initials: "ا‌ر",
    role: "بازاریابی",
    online: false,
    avatar: "/avatars/02.jpg",
  },
]

export function getChatMember(id: string) {
  return chatMembers.find((m) => m.id === id) ?? chatMembers[0]
}

export type ChatFolderId = "all" | "rooms" | "direct" | "unread"

export type ChatFolder = {
  id: ChatFolderId
  label: string
  short: string
}

export const chatFolders: ChatFolder[] = [
  { id: "all", label: "همه گفتگوها", short: "همه" },
  { id: "rooms", label: "اتاق‌ها", short: "اتاق‌ها" },
  { id: "direct", label: "مستقیم", short: "مستقیم" },
  { id: "unread", label: "خوانده‌نشده", short: "نخوانده" },
]

export function filterConversationsByFolder(
  items: Conversation[],
  folder: ChatFolderId
) {
  switch (folder) {
    case "rooms":
      return items.filter((c) => c.kind === "room")
    case "direct":
      return items.filter((c) => c.kind === "direct")
    case "unread":
      return items.filter((c) => c.unread > 0)
    default:
      return items
  }
}

export function folderUnreadCount(
  items: Conversation[],
  folder: ChatFolderId
) {
  return filterConversationsByFolder(items, folder).reduce(
    (sum, c) => sum + c.unread,
    0
  )
}

export const conversations: Conversation[] = [
  {
    id: "r-plaza",
    kind: "room",
    name: "صحن",
    short: "صحن",
    topic: "هماهنگی روزانه و اعلام‌های تیم",
    memberIds: ["u1", "u2", "u3", "u4", "u5", "u6"],
    unread: 3,
    lastPreview: "اسلایدهای دمو را تا ساعت ۱۵ در همین اتاق می‌گذارم.",
    lastTime: "۱۰:۴۲",
    unreadAfterId: "m-p3",
    typingIds: ["u2"],
    messages: [
      {
        id: "m-p1",
        authorId: "u2",
        body: "صبح بخیر. برای دموی مشتری فردا، نسخهٔ پیش‌نمایش روی staging آماده است؟",
        time: "۰۹:۱۵",
      },
      {
        id: "m-p1b",
        authorId: "u2",
        body: "لینک staging را هم در پین اتاق گذاشتم.",
        time: "۰۹:۱۶",
      },
      {
        id: "m-p2",
        authorId: "u1",
        body: "بله — فقط فیلتر اتاق هنوز نمایشی است. بقیه را روی موبایل هم چک کنید.",
        time: "۰۹:۱۸",
        reactions: [
          { emoji: "👍", count: 3, reacted: true },
          { emoji: "👀", count: 1 },
        ],
      },
      {
        id: "m-p2b",
        authorId: "u1",
        body: "اگر باگ دیدید سریع همین‌جا بگویید تا قبل از دمو جمعش کنیم.",
        time: "۰۹:۱۹",
      },
      {
        id: "m-p3",
        authorId: "u3",
        body: "من جریان موبایل را روی ۳۹۰px تست کردم؛ ریبون اتاق‌ها درست اسکرول می‌شود.",
        time: "۰۹:۴۰",
      },
      {
        id: "m-p3b",
        authorId: "u3",
        body: "کیبورد هم روی iOS اوکی است — فقط فاصلهٔ پایین composer یک پله کم شد.",
        time: "۰۹:۴۱",
      },
      {
        id: "m-p4",
        authorId: "u4",
        body: "API کاربران تا ظهر merge می‌شود. اگر چیزی شکست، در اتاق مهندسی بگویید.",
        time: "۱۰:۰۵",
      },
      {
        id: "m-p5",
        authorId: "u6",
        body: "متن دعوت مشتری را کوتاه کردم؛ اگر اوکی است تا ظهر می‌فرستم.",
        time: "۱۰:۲۰",
        replyTo: "m-p2",
      },
      {
        id: "m-p6",
        authorId: "u5",
        body: "اسلایدهای دمو را تا ساعت ۱۵ در همین اتاق می‌گذارم.",
        time: "۱۰:۴۲",
        attachment: {
          name: "demo-outline.pdf",
          sizeLabel: "۱٫۸ مگابایت",
          type: "file",
        },
        pinned: true,
      },
    ],
  },
  {
    id: "r-design",
    kind: "room",
    name: "طراحی",
    short: "طراحی",
    topic: "فریم، فاصله و بازبینی ظاهر",
    memberIds: ["u1", "u2", "u3"],
    unread: 0,
    lastPreview: "Spacing فرم تنظیمات را یک پله کم کردم.",
    lastTime: "دیروز",
    messages: [
      {
        id: "m-d1",
        authorId: "u2",
        body: "فریم ریبون موبایل را در Figma آپدیت کردم. فاصلهٔ نشانگر خوانده‌نشده را هم تنظیم کردم.",
        time: "۱۶:۲۰",
        attachment: {
          name: "ribbon-mobile-v4.fig",
          sizeLabel: "۲٫۴ مگابایت",
          type: "file",
        },
        pinned: true,
      },
      {
        id: "m-d2",
        authorId: "u1",
        body: "عالی. در حالت جمع‌شده، عنوان اتاق هنوز جا می‌شود؟",
        time: "۱۶:۳۵",
      },
      {
        id: "m-d3",
        authorId: "u2",
        body: "بله. Spacing فرم تنظیمات را یک پله کم کردم.",
        time: "۱۸:۱۰",
        reactions: [{ emoji: "✅", count: 2, reacted: true }],
      },
      {
        id: "m-d4",
        authorId: "u3",
        body: "فونت تیتر اتاق روی ویندوز کمی فشرده بود؛ tracking را اصلاح کردم.",
        time: "۱۸:۴۴",
      },
    ],
  },
  {
    id: "r-eng",
    kind: "room",
    name: "مهندسی",
    short: "مهندسی",
    topic: "فرانت، بک‌اند و انتشار",
    memberIds: ["u1", "u3", "u4", "u5"],
    unread: 4,
    lastPreview: "Build روی main سبز شد.",
    lastTime: "۰۸:۵۵",
    unreadAfterId: "m-e1",
    messages: [
      {
        id: "m-e1",
        authorId: "u4",
        body: "PR مربوط به rate-limit آمادهٔ ریویو است: https://git.hamyar.dev/pr/418",
        time: "۰۸:۲۰",
      },
      {
        id: "m-e2",
        authorId: "u3",
        body: "کتابخانهٔ chart را ارتقا دادم؛ tooltipها RTL هستند.",
        time: "۰۸:۳۵",
        replyTo: "m-e1",
      },
      {
        id: "m-e3",
        authorId: "u5",
        body: "Smoke تست چت روی ۳۹۰ و ۷۶۸ پاس شد.",
        time: "۰۸:۴۸",
      },
      {
        id: "m-e4",
        authorId: "u1",
        body: "ممنون. امروز فقط polish — feature جدید نه.",
        time: "۰۸:۵۰",
        reactions: [{ emoji: "👍", count: 2 }],
      },
      {
        id: "m-e5",
        authorId: "u3",
        body: "Build روی main سبز شد.",
        time: "۰۸:۵۵",
        reactions: [
          { emoji: "🎉", count: 4, reacted: true },
          { emoji: "🚀", count: 1 },
        ],
      },
    ],
  },
  {
    id: "r-market",
    kind: "room",
    name: "بازار",
    short: "بازار",
    topic: "متن‌ها، لندینگ و کمپین",
    memberIds: ["u1", "u2", "u6"],
    unread: 0,
    lastPreview: "عنوان لندینگ را به «هم‌صدا برای تیم‌های فارسی» تغییر دادم.",
    lastTime: "دوشنبه",
    messages: [
      {
        id: "m-k1",
        authorId: "u6",
        body: "عنوان لندینگ را به «هم‌صدا برای تیم‌های فارسی» تغییر دادم.",
        time: "۱۴:۱۰",
      },
      {
        id: "m-k2",
        authorId: "u1",
        body: "خوب است. در جملهٔ دوم «اتاق گفتگو» را نگه دارید، نه «کانال».",
        time: "۱۴:۲۲",
        reactions: [{ emoji: "✍️", count: 1 }],
      },
    ],
  },
  {
    id: "dm-sara",
    kind: "direct",
    name: "سارا محمدی",
    short: "سارا",
    memberIds: ["u1", "u2"],
    unread: 1,
    lastPreview: "فایل پیش‌نمایش هدر را فرستادم.",
    lastTime: "۱۱:۰۸",
    unreadAfterId: "m-s2",
    messages: [
      {
        id: "m-s1",
        authorId: "u2",
        body: "برای هدر هم‌صدا، عنوان را کوتاه‌تر کردم تا در موبایل نشکند.",
        time: "۱۰:۵۰",
      },
      {
        id: "m-s2",
        authorId: "u1",
        body: "خوب است. روی تم خشت هم دیدی؟",
        time: "۱۰:۵۸",
      },
      {
        id: "m-s3",
        authorId: "u2",
        body: "فایل پیش‌نمایش هدر را فرستادم.",
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
    kind: "direct",
    name: "رضا کریمی",
    short: "رضا",
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
    kind: "direct",
    name: "مینا اکبری",
    short: "مینا",
    memberIds: ["u1", "u4"],
    unread: 0,
    lastPreview: "لاگ خطا را در اتاق مهندسی گذاشتم.",
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
        body: "ایندکس ماه را هم اضافه کنید. جزئیات: https://status.hamyar.dev",
        time: "۱۲:۱۲",
      },
      {
        id: "m-n3",
        authorId: "u4",
        body: "لاگ خطا را در اتاق مهندسی گذاشتم.",
        time: "۱۲:۴۰",
        replyTo: "m-n1",
      },
    ],
  },
]
