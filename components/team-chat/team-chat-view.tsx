"use client"

import * as React from "react"
import {
  AtSignIcon,
  CheckCheckIcon,
  ChevronRightIcon,
  CopyIcon,
  FileIcon,
  ForwardIcon,
  HashIcon,
  ImageIcon,
  InfoIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  PaperclipIcon,
  PinIcon,
  PinOffIcon,
  ReplyIcon,
  SendIcon,
  SmilePlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { formatCount } from "@/lib/format"
import { toPersianDigits } from "@/lib/digits"
import {
  chatFolders,
  conversations as initialConversations,
  CURRENT_USER_ID,
  filterConversationsByFolder,
  folderUnreadCount,
  getChatMember,
  type ChatAttachment,
  type ChatFolderId,
  type ChatMessage,
  type Conversation,
} from "@/lib/mock/team-chat"
import { SearchField } from "@/components/shared/search-field"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/use-mobile"

type MobilePane = "list" | "chat"

function formatNowTime() {
  const d = new Date()
  return toPersianDigits(
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  )
}

function formatFileSizeLabel(bytes: number) {
  if (bytes < 1024) return `${toPersianDigits(String(bytes))} بایت`
  if (bytes < 1024 * 1024) {
    const kb = Math.max(1, Math.round(bytes / 1024))
    return `${toPersianDigits(String(kb))} کیلوبایت`
  }
  const mb = bytes / (1024 * 1024)
  const label =
    mb >= 10 ? String(Math.round(mb)) : mb.toFixed(1).replace(/\.0$/, "")
  return `${toPersianDigits(label)} مگابایت`
}

function attachmentFromFile(file: File): ChatAttachment {
  const isImage = file.type.startsWith("image/")
  return {
    name: file.name,
    sizeLabel: formatFileSizeLabel(file.size),
    type: isImage ? "image" : "file",
  }
}

function linkify(text: string): React.ReactNode[] {
  const parts = text.split(/(https?:\/\/\S+|@[^\s،.؟!]+)/g)
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="hs-link"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      )
    }
    if (part.startsWith("@")) {
      return (
        <span key={i} className="hs-mention">
          {part}
        </span>
      )
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

const FOLDER_ICONS: Record<
  ChatFolderId,
  React.ComponentType<{ className?: string }>
> = {
  all: MessageSquareIcon,
  rooms: HashIcon,
  direct: MessageCircleIcon,
  unread: AtSignIcon,
}

const AUTHOR_COLORS = [
  "#c44dff",
  "#e17076",
  "#7bc862",
  "#e5a639",
  "#6ec9cb",
  "#65aadd",
  "#ee7aae",
  "#a695e7",
]

const QUICK_REACTIONS = ["👍", "❤️", "🔥", "😂", "😮", "👏"] as const

function authorColor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i) * 17) % AUTHOR_COLORS.length
  return AUTHOR_COLORS[hash]
}

function AvatarPhoto({
  src,
  initials,
  alt = "",
}: {
  src?: string
  initials: string
  alt?: string
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- local mock avatars
      <img className="hs-ava-photo" src={src} alt={alt} draggable={false} />
    )
  }
  return <>{initials}</>
}

function clusterPos(
  messages: ChatMessage[],
  idx: number
): "alone" | "first" | "middle" | "last" {
  const cur = messages[idx]
  const prev = idx > 0 ? messages[idx - 1] : undefined
  const next = idx < messages.length - 1 ? messages[idx + 1] : undefined
  const samePrev = prev?.authorId === cur.authorId
  const sameNext = next?.authorId === cur.authorId
  if (!samePrev && !sameNext) return "alone"
  if (!samePrev && sameNext) return "first"
  if (samePrev && sameNext) return "middle"
  return "last"
}

export function TeamChatView() {
  const isMobile = useIsMobile()
  const [items, setItems] = React.useState(initialConversations)
  const [folder, setFolder] = React.useState<ChatFolderId>("all")
  const [activeId, setActiveId] = React.useState(initialConversations[0].id)
  const [query, setQuery] = React.useState("")
  const [draft, setDraft] = React.useState("")
  const [pendingAttach, setPendingAttach] =
    React.useState<ChatAttachment | null>(null)
  const [mobilePane, setMobilePane] = React.useState<MobilePane>("list")
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [replyToId, setReplyToId] = React.useState<string | null>(null)
  const endRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const active = items.find((c) => c.id === activeId) ?? items[0]

  const folderItems = filterConversationsByFolder(items, folder).filter((c) => {
    const q = query.trim()
    if (!q) return true
    return (
      c.name.includes(q) ||
      c.lastPreview.includes(q) ||
      (c.topic?.includes(q) ?? false)
    )
  })

  const replyTarget = replyToId
    ? active.messages.find((m) => m.id === replyToId)
    : undefined

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [activeId, active.messages.length])

  function openConversation(id: string) {
    setActiveId(id)
    setReplyToId(null)
    setPendingAttach(null)
    setMobilePane("chat")
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    )
  }

  function sendMessage() {
    const body = draft.trim()
    if (!body && !pendingAttach) return
    const msg: ChatMessage = {
      id: `m-local-${Date.now()}`,
      authorId: CURRENT_USER_ID,
      body: body || (pendingAttach ? pendingAttach.name : ""),
      time: formatNowTime(),
      replyTo: replyToId ?? undefined,
      attachment: pendingAttach ?? undefined,
    }
    const preview = pendingAttach
      ? `📎 ${pendingAttach.name}`
      : body
    setItems((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastPreview: preview,
              lastTime: msg.time,
              typingIds: undefined,
            }
          : c
      )
    )
    setDraft("")
    setPendingAttach(null)
    setReplyToId(null)
  }

  function onPickAttachment(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setPendingAttach(attachmentFromFile(file))
    toast.success("پیوست آماده شد", {
      description: file.name,
    })
  }

  function toggleReaction(messageId: string, emoji: string) {
    setItems((prev) =>
      prev.map((c) => {
        if (c.id !== active.id) return c
        return {
          ...c,
          messages: c.messages.map((m) => {
            if (m.id !== messageId) return m
            const reactions = [...(m.reactions ?? [])]
            const idx = reactions.findIndex((r) => r.emoji === emoji)
            if (idx >= 0) {
              const current = reactions[idx]
              if (current.reacted) {
                if (current.count <= 1) reactions.splice(idx, 1)
                else
                  reactions[idx] = {
                    ...current,
                    count: current.count - 1,
                    reacted: false,
                  }
              } else {
                reactions[idx] = {
                  ...current,
                  count: current.count + 1,
                  reacted: true,
                }
              }
            } else {
              reactions.push({ emoji, count: 1, reacted: true })
            }
            return { ...m, reactions }
          }),
        }
      })
    )
  }

  function togglePin(messageId: string) {
    setItems((prev) =>
      prev.map((c) => {
        if (c.id !== active.id) return c
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId ? { ...m, pinned: !m.pinned } : m
          ),
        }
      })
    )
  }

  function deleteMessage(messageId: string) {
    setItems((prev) =>
      prev.map((c) => {
        if (c.id !== active.id) return c
        const messages = c.messages.filter((m) => m.id !== messageId)
        const last = messages[messages.length - 1]
        return {
          ...c,
          messages,
          lastPreview: last
            ? last.attachment
              ? `📎 ${last.attachment.name}`
              : last.body
            : c.lastPreview,
          lastTime: last?.time ?? c.lastTime,
        }
      })
    )
    if (replyToId === messageId) setReplyToId(null)
    toast.message("پیام حذف شد")
  }

  async function copyMessage(text: string) {
    const value = text.trim()
    if (!value) {
      toast.message("متنی برای کپی نیست")
      return
    }
    try {
      await navigator.clipboard.writeText(value)
      toast.success("کپی شد")
    } catch {
      toast.message("کپی انجام نشد")
    }
  }

  function findMessage(id: string) {
    return active.messages.find((m) => m.id === id)
  }

  const attachments = active.messages
    .filter((m) => m.attachment)
    .map((m) => m.attachment!)
  const pinned = active.messages.filter((m) => m.pinned)
  const typingMembers = (active.typingIds ?? []).map((id) => getChatMember(id))

  const peer =
    active.kind === "direct"
      ? getChatMember(
          active.memberIds.find((id) => id !== CURRENT_USER_ID) ??
            active.memberIds[0]
        )
      : null

  const showList = !isMobile || mobilePane === "list"
  const showChat = !isMobile || mobilePane === "chat"

  return (
    <div className="hs-shell">
      {!isMobile ? (
        <nav className="hs-rail" aria-label="پوشه‌های گفتگو">
          {chatFolders.map((f) => {
            const Icon = FOLDER_ICONS[f.id]
            const count = folderUnreadCount(items, f.id)
            return (
              <button
                key={f.id}
                type="button"
                className="hs-rail-btn"
                aria-pressed={folder === f.id}
                title={f.label}
                onClick={() => setFolder(f.id)}
              >
                <Icon aria-hidden />
                <span>{f.short}</span>
                {count > 0 ? (
                  <span className="hs-rail-badge">{formatCount(count)}</span>
                ) : null}
              </button>
            )
          })}
        </nav>
      ) : null}

      {/* Chat list */}
      <aside
        className="hs-list"
        data-open={showList ? "true" : "false"}
        aria-label="لیست گفتگوها"
      >
        {isMobile ? (
          <div className="hs-folder-tabs" role="tablist" aria-label="پوشه‌ها">
            {chatFolders.map((f) => {
              const count = folderUnreadCount(items, f.id)
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  className="hs-folder-tab"
                  aria-pressed={folder === f.id}
                  onClick={() => setFolder(f.id)}
                >
                  {f.short}
                  {count > 0 ? (
                    <span className="hs-folder-tab-count">
                      {formatCount(count)}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        ) : null}
        <div className="hs-list-head">
          <SearchField
            placeholder="جستجو…"
            aria-label="جستجوی گفتگو"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="hs-list-scroll">
          {folderItems.length === 0 ? (
            <p className="hs-list-empty">گفتگویی پیدا نشد.</p>
          ) : (
            folderItems.map((c) => (
              <ChatRow
                key={c.id}
                conversation={c}
                current={c.id === activeId}
                onOpen={() => openConversation(c.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Chat pane */}
      {showChat ? (
        <section
          className="hs-chat"
          data-open="true"
          aria-label={`گفتگوی ${active.name}`}
        >
          <header className="hs-chat-bar">
            <button
              type="button"
              className="hs-back"
              aria-label="بازگشت به لیست"
              onClick={() => setMobilePane("list")}
            >
              <ChevronRightIcon className="size-4" />
            </button>
            <div
              className="hs-chat-avatar"
              data-kind={active.kind}
              data-photo={
                active.kind === "direct" && peer?.avatar ? "true" : undefined
              }
              aria-hidden
            >
              {active.kind === "room" ? (
                (active.short ?? active.name).slice(0, 1)
              ) : (
                <AvatarPhoto
                  src={peer?.avatar}
                  initials={peer?.initials ?? "؟"}
                />
              )}
            </div>
            <div className="hs-chat-titles">
              <h2 className="hs-chat-name">
                {active.kind === "room" ? active.name : active.name}
              </h2>
              <p className="hs-chat-sub">
                {active.kind === "room"
                  ? (active.topic ??
                    `${formatCount(active.memberIds.length)} عضو`)
                  : peer?.online
                    ? "آنلاین"
                    : peer?.role}
              </p>
            </div>
            <button
              type="button"
              className="hs-icon-btn"
              aria-label="جزئیات گفتگو"
              onClick={() => setDetailsOpen(true)}
            >
              <InfoIcon className="size-4" />
            </button>
          </header>

          <div className="hs-thread">
            <div className="hs-day">
              <span>امروز</span>
            </div>

            {active.messages.map((msg, idx) => {
              const author = getChatMember(msg.authorId)
              const mine = msg.authorId === CURRENT_USER_ID
              const prev = idx > 0 ? active.messages[idx - 1] : undefined
              const cluster = clusterPos(active.messages, idx)
              const showAuthor =
                !mine &&
                active.kind === "room" &&
                (cluster === "alone" || cluster === "first")
              const showAva =
                !mine && (cluster === "alone" || cluster === "last")
              const isUnreadStart =
                Boolean(active.unreadAfterId) &&
                prev?.id === active.unreadAfterId
              const quoted = msg.replyTo ? findMessage(msg.replyTo) : undefined
              const quotedAuthor = quoted
                ? getChatMember(quoted.authorId)
                : null
              const color = authorColor(author.id)

              return (
                <React.Fragment key={msg.id}>
                  {isUnreadStart ? (
                    <div className="hs-unread">پیام‌های جدید</div>
                  ) : null}
                  <ContextMenu>
                    <ContextMenuTrigger
                      className="hs-msg-row"
                      data-mine={mine ? "true" : "false"}
                      data-cluster={cluster}
                    >
                    <div
                      className="hs-msg-ava"
                      data-visible={showAva ? "true" : "false"}
                      data-photo={author.avatar ? "true" : undefined}
                      style={
                        showAva && !author.avatar
                          ? { background: color + "22", color }
                          : undefined
                      }
                      aria-hidden
                    >
                      <AvatarPhoto
                        src={author.avatar}
                        initials={author.initials}
                      />
                    </div>
                    <div className="hs-msg-col">
                      {showAuthor ? (
                        <p
                          className="hs-msg-author"
                          style={{ color }}
                        >
                          {author.name}
                        </p>
                      ) : null}
                      <div className="hs-bubble">
                        {msg.pinned ? (
                          <span className="hs-pin">
                            <PinIcon
                              className="me-1 inline size-3"
                              aria-hidden
                            />
                            سنجاق‌شده
                          </span>
                        ) : null}
                        {quoted && quotedAuthor ? (
                          <button
                            type="button"
                            className="hs-quote"
                            style={
                              {
                                "--hs-quote-accent": authorColor(
                                  quotedAuthor.id
                                ),
                              } as React.CSSProperties
                            }
                            onClick={() =>
                              toast.message("پرش به پیام", {
                                description: quoted.body.slice(0, 60),
                              })
                            }
                          >
                            <p
                              className="hs-quote-name"
                              style={{ color: authorColor(quotedAuthor.id) }}
                            >
                              {quotedAuthor.name}
                            </p>
                            <p className="hs-quote-text">{quoted.body}</p>
                          </button>
                        ) : null}
                        <div className="hs-bubble-body">
                          <p className="hs-bubble-text">{linkify(msg.body)}</p>
                          <span className="hs-bubble-meta" aria-hidden>
                            <span className="hs-bubble-time">{msg.time}</span>
                            {mine ? (
                              <CheckCheckIcon className="hs-bubble-checks" />
                            ) : null}
                          </span>
                        </div>
                        {msg.attachment ? (
                          <button
                            type="button"
                            className="hs-attach"
                            onClick={() =>
                              toast.success(`باز کردن ${msg.attachment!.name}`)
                            }
                          >
                            <span className="hs-attach-icon">
                              {msg.attachment.type === "image" ? (
                                <ImageIcon className="size-3.5" />
                              ) : (
                                <FileIcon className="size-3.5" />
                              )}
                            </span>
                            <span>
                              <p className="hs-attach-name">
                                {msg.attachment.name}
                              </p>
                              <p className="hs-attach-size">
                                {msg.attachment.sizeLabel}
                              </p>
                            </span>
                          </button>
                        ) : null}
                      </div>
                      {msg.reactions && msg.reactions.length > 0 ? (
                        <div className="hs-reacts">
                          {msg.reactions.map((r) => (
                            <button
                              key={r.emoji}
                              type="button"
                              className="hs-react"
                              data-on={r.reacted ? "true" : "false"}
                              onClick={() => toggleReaction(msg.id, r.emoji)}
                            >
                              <span aria-hidden>{r.emoji}</span>
                              <span>{formatCount(r.count)}</span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                      <div className="hs-msg-actions">
                        <button
                          type="button"
                          aria-label="واکنش"
                          onClick={() => toggleReaction(msg.id, "👍")}
                        >
                          <SmilePlusIcon className="size-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyToId(msg.id)}
                        >
                          پاسخ
                        </button>
                      </div>
                    </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent
                      className="hs-ctx-menu"
                      side="bottom"
                      align="start"
                      sideOffset={6}
                    >
                      <div className="hs-ctx-reacts" role="group" aria-label="واکنش سریع">
                        {QUICK_REACTIONS.map((emoji) => (
                          <ContextMenuItem
                            key={emoji}
                            className="hs-ctx-emoji"
                            onClick={() => toggleReaction(msg.id, emoji)}
                          >
                            <span aria-hidden>{emoji}</span>
                          </ContextMenuItem>
                        ))}
                      </div>
                      <ContextMenuSeparator />
                      <ContextMenuItem onClick={() => setReplyToId(msg.id)}>
                        <ReplyIcon />
                        پاسخ
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => copyMessage(msg.body)}>
                        <CopyIcon />
                        کپی متن
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          toast.message("ارسال مجدد", {
                            description: "در این دمو فقط نمایشی است",
                          })
                        }
                      >
                        <ForwardIcon />
                        ارسال مجدد
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          togglePin(msg.id)
                          toast.success(
                            msg.pinned ? "از سنجاق برداشته شد" : "سنجاق شد"
                          )
                        }}
                      >
                        {msg.pinned ? <PinOffIcon /> : <PinIcon />}
                        {msg.pinned ? "برداشتن سنجاق" : "سنجاق کردن"}
                      </ContextMenuItem>
                      {mine ? (
                        <>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            variant="destructive"
                            onClick={() => deleteMessage(msg.id)}
                          >
                            <Trash2Icon />
                            حذف
                          </ContextMenuItem>
                        </>
                      ) : null}
                    </ContextMenuContent>
                  </ContextMenu>
                </React.Fragment>
              )
            })}

            {typingMembers.length > 0 ? (
              <div className="hs-typing" aria-live="polite">
                <span className="hs-typing-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                {typingMembers.map((m) => m.name).join(" و ")} در حال نوشتن…
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <footer className="hs-composer">
            {replyTarget ? (
              <div className="hs-reply-bar">
                <p>
                  پاسخ به {getChatMember(replyTarget.authorId).name}:{" "}
                  {replyTarget.body}
                </p>
                <button
                  type="button"
                  aria-label="لغو پاسخ"
                  onClick={() => setReplyToId(null)}
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ) : null}
            {pendingAttach ? (
              <div className="hs-attach-bar">
                <span className="hs-attach-bar-icon" aria-hidden>
                  {pendingAttach.type === "image" ? (
                    <ImageIcon className="size-3.5" />
                  ) : (
                    <FileIcon className="size-3.5" />
                  )}
                </span>
                <div className="hs-attach-bar-meta">
                  <p className="hs-attach-bar-name">{pendingAttach.name}</p>
                  <p className="hs-attach-bar-size">{pendingAttach.sizeLabel}</p>
                </div>
                <button
                  type="button"
                  aria-label="حذف پیوست"
                  onClick={() => setPendingAttach(null)}
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt,.fig"
              onChange={onPickAttachment}
            />
            <div className="hs-composer-row">
              <button
                type="button"
                className="hs-icon-btn"
                aria-label="پیوست"
                onClick={() => fileInputRef.current?.click()}
              >
                <PaperclipIcon className="size-4" />
              </button>
              <Textarea
                rows={1}
                placeholder="پیام بنویسید…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                aria-label="متن پیام"
              />
              <button
                type="button"
                className="hs-send"
                disabled={!draft.trim() && !pendingAttach}
                aria-label="ارسال"
                onClick={sendMessage}
              >
                <SendIcon className="size-4" />
              </button>
            </div>
          </footer>
        </section>
      ) : null}

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="left" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>{active.name}</SheetTitle>
            <SheetDescription>
              {active.topic ?? "گفتگوی مستقیم"}
            </SheetDescription>
          </SheetHeader>
          <div className="hs-details px-4 pb-6">
            {pinned.length > 0 ? (
              <div className="hs-details-section">
                <p className="hs-details-title">سنجاق‌شده</p>
                {pinned.map((m) => (
                  <p key={m.id} className="text-sm leading-relaxed">
                    {m.body}
                  </p>
                ))}
              </div>
            ) : null}
            <div className="hs-details-section">
              <p className="hs-details-title">اعضا</p>
              {active.memberIds.map((id) => {
                const m = getChatMember(id)
                return (
                  <div key={id} className="hs-details-member">
                    <div
                      className="hs-details-avatar"
                      data-photo={m.avatar ? "true" : undefined}
                    >
                      <AvatarPhoto src={m.avatar} initials={m.initials} />
                    </div>
                    <div>
                      <p className="hs-details-member-name">{m.name}</p>
                      <p className="hs-details-member-role">{m.role}</p>
                    </div>
                    <span
                      className="hs-details-online"
                      data-on={m.online ? "true" : "false"}
                      title={m.online ? "آنلاین" : "آفلاین"}
                    />
                  </div>
                )
              })}
            </div>
            {attachments.length > 0 ? (
              <div className="hs-details-section">
                <p className="hs-details-title">فایل‌ها</p>
                {attachments.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    className="hs-details-file"
                    onClick={() => toast.success(`باز کردن ${f.name}`)}
                  >
                    {f.type === "image" ? (
                      <ImageIcon className="size-4 shrink-0" />
                    ) : (
                      <FileIcon className="size-4 shrink-0" />
                    )}
                    <span className="truncate" dir="ltr">
                      {f.name}
                    </span>
                    <span>{f.sizeLabel}</span>
                  </button>
                ))}
              </div>
            ) : null}
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                setDetailsOpen(false)
                toast.message("اعلان این گفتگو خاموش شد")
              }}
            >
              قطع اعلان
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ChatRow({
  conversation,
  current,
  onOpen,
}: {
  conversation: Conversation
  current: boolean
  onOpen: () => void
}) {
  const peer =
    conversation.kind === "direct"
      ? getChatMember(
          conversation.memberIds.find((id) => id !== CURRENT_USER_ID) ??
            conversation.memberIds[0]
        )
      : null

  return (
    <button
      type="button"
      className="hs-row"
      aria-current={current ? "true" : undefined}
      onClick={onOpen}
    >
      <span
        className="hs-row-avatar"
        data-kind={conversation.kind}
        data-photo={
          conversation.kind === "direct" && peer?.avatar ? "true" : undefined
        }
        aria-hidden
      >
        {conversation.kind === "room" ? (
          (conversation.short ?? conversation.name).slice(0, 1)
        ) : (
          <AvatarPhoto
            src={peer?.avatar}
            initials={peer?.initials ?? "؟"}
          />
        )}
        {peer?.online ? <span className="hs-row-online" /> : null}
      </span>
      <span className="hs-row-body">
        <p className="hs-row-name">{conversation.name}</p>
        <p className="hs-row-preview">{conversation.lastPreview}</p>
      </span>
      <span className="hs-row-aside">
        <span className="hs-row-time">{conversation.lastTime}</span>
        {conversation.unread > 0 ? (
          <span className="hs-row-unread">
            {formatCount(conversation.unread)}
          </span>
        ) : null}
      </span>
    </button>
  )
}
