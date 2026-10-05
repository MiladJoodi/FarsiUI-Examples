"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  FileIcon,
  InfoIcon,
  PaperclipIcon,
  SendIcon,
  UsersIcon,
} from "lucide-react"

import { formatCount } from "@/lib/format"
import {
  conversations as initialConversations,
  CURRENT_USER_ID,
  getChatMember,
  workspaceHint,
  workspaceName,
  type ChatMessage,
  type Conversation,
} from "@/lib/mock/team-chat"
import { SearchField } from "@/components/shared/search-field"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import {
  Bubble,
  BubbleContent,
  BubbleReactions,
} from "@/components/ui/bubble"
import { Textarea } from "@/components/ui/textarea"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type MobilePane = "list" | "chat"

export function TeamChatView() {
  const [items, setItems] = React.useState(initialConversations)
  const [activeId, setActiveId] = React.useState(initialConversations[0].id)
  const [query, setQuery] = React.useState("")
  const [draft, setDraft] = React.useState("")
  const [mobilePane, setMobilePane] = React.useState<MobilePane>("list")
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  const active = items.find((c) => c.id === activeId) ?? items[0]

  const filtered = items.filter((c) => {
    const q = query.trim()
    if (!q) return true
    return (
      c.name.includes(q) ||
      c.lastPreview.includes(q) ||
      (c.topic?.includes(q) ?? false)
    )
  })

  const channels = filtered.filter((c) => c.kind === "channel")
  const dms = filtered.filter((c) => c.kind === "dm")

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [active.id, active.messages.length])

  function openConversation(id: string) {
    setActiveId(id)
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    )
    setMobilePane("chat")
  }

  function sendMessage() {
    const body = draft.trim()
    if (!body) return
    const message: ChatMessage = {
      id: `local-${Date.now()}`,
      authorId: CURRENT_USER_ID,
      body,
      time: new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    }
    setItems((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [...c.messages, message],
              lastPreview: body,
              lastTime: message.time,
              unread: 0,
            }
          : c
      )
    )
    setDraft("")
  }

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-background">
      <section
        className={cn(
          "flex w-full min-w-0 flex-col border-e bg-muted/10 md:w-80 md:max-w-[36vw] lg:w-[22rem]",
          mobilePane === "list" ? "flex" : "hidden md:flex"
        )}
        aria-label="فهرست گفتگوها"
      >
        <div className="shrink-0 space-y-2 border-b px-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{workspaceName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {workspaceHint}
            </p>
          </div>
          <SearchField
            wrapperClassName="min-w-0 w-full"
            placeholder="جستجو…"
            aria-label="جستجوی گفتگو"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <nav className="p-1" aria-label="گفتگوها">
            <ConversationSection
              title="گروه‌ها"
              items={channels}
              activeId={active.id}
              onSelect={openConversation}
            />
            <ConversationSection
              title="پیام خصوصی"
              items={dms}
              activeId={active.id}
              onSelect={openConversation}
            />
          </nav>
        </ScrollArea>
      </section>

      <section
        className={cn(
          "min-w-0 flex-1 flex-col bg-[linear-gradient(180deg,var(--background)_0%,color-mix(in_oklch,var(--muted)_35%,var(--background))_100%)]",
          mobilePane === "chat" ? "flex" : "hidden md:flex"
        )}
        aria-label="گفتگوی فعال"
      >
        <ChatHeader
          conversation={active}
          onBack={() => setMobilePane("list")}
          onDetails={() => setDetailsOpen(true)}
        />
        <ScrollArea className="min-h-0 flex-1">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-1 px-3 py-3 sm:px-4">
            {active.topic ? (
              <p className="mb-2 rounded-lg bg-background/80 px-3 py-2 text-center text-xs text-muted-foreground ring-1 ring-border/60">
                {active.topic}
              </p>
            ) : null}
            {active.messages.map((message, index) => {
              const showDivider =
                Boolean(active.unreadAfterId) &&
                index > 0 &&
                active.messages[index - 1]?.id === active.unreadAfterId

              return (
                <React.Fragment key={message.id}>
                  {showDivider ? <UnreadDivider /> : null}
                  <ChatMessageRow
                    message={message}
                    conversation={active}
                  />
                </React.Fragment>
              )
            })}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
        <Composer value={draft} onChange={setDraft} onSend={sendMessage} />
      </section>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="left" className="w-[min(22rem,100%)] p-0">
          <DetailsPanel conversation={active} inSheet />
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ConversationAvatar({
  conversation,
  size = "list",
}: {
  conversation: Conversation
  size?: "list" | "header"
}) {
  const avatarSize = size === "list" ? "size-12" : "size-10"
  const textSize = size === "list" ? "text-base" : "text-sm"

  if (conversation.kind === "dm") {
    const peerId =
      conversation.memberIds.find((id) => id !== CURRENT_USER_ID) ??
      conversation.memberIds[0]
    const peer = getChatMember(peerId)
    return (
      <span className="relative shrink-0">
        <Avatar className={avatarSize}>
          <AvatarFallback className={textSize}>{peer.initials}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute inset-e-0 bottom-0 size-2.5 rounded-full ring-2 ring-background",
            peer.online ? "bg-emerald-500" : "bg-muted-foreground/40"
          )}
          aria-hidden
        />
      </span>
    )
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary",
        avatarSize,
        textSize
      )}
    >
      {conversation.name.slice(0, 1)}
    </span>
  )
}

function ConversationSection({
  title,
  items,
  activeId,
  onSelect,
}: {
  title: string
  items: Conversation[]
  activeId: string
  onSelect: (id: string) => void
}) {
  if (items.length === 0) return null
  return (
    <div className="py-1">
      <p className="sticky top-0 z-[1] bg-muted/10 px-3 py-1.5 text-xs font-medium text-muted-foreground">
        {title}
      </p>
      <ul>
        {items.map((item) => {
          const selected = item.id === activeId

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-2 py-2.5 text-start transition-colors",
                  selected ? "bg-primary/10" : "hover:bg-muted/50"
                )}
              >
                <ConversationAvatar conversation={item} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium">{item.name}</span>
                    <span className="shrink-0 text-[0.65rem] tracking-normal text-muted-foreground">
                      {item.lastTime}
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <span className="line-clamp-1 min-w-0 flex-1 text-xs text-muted-foreground">
                      {item.lastPreview}
                    </span>
                    {item.unread > 0 ? (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[0.65rem] font-medium tracking-normal text-primary-foreground">
                        {formatCount(item.unread)}
                      </span>
                    ) : null}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ChatHeader({
  conversation,
  onBack,
  onDetails,
}: {
  conversation: Conversation
  onBack: () => void
  onDetails: () => void
}) {
  const subtitle =
    conversation.kind === "dm"
      ? (() => {
          const peerId =
            conversation.memberIds.find((id) => id !== CURRENT_USER_ID) ??
            conversation.memberIds[0]
          return getChatMember(peerId).online ? "آنلاین" : "اخیراً"
        })()
      : `${formatCount(conversation.memberIds.length)} عضو`

  return (
    <div className="flex h-[3.25rem] shrink-0 items-center gap-2 border-b bg-background/90 px-2 sm:px-3">
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 md:hidden"
        onClick={onBack}
        aria-label="بازگشت به فهرست"
      >
        <ChevronLeftIcon className="size-5 rtl:-scale-x-100" />
      </Button>
      <button
        type="button"
        onClick={onDetails}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg py-1 text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <ConversationAvatar conversation={conversation} size="header" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{conversation.name}</p>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0"
        aria-label="جزئیات گفتگو"
        onClick={onDetails}
      >
        <InfoIcon className="size-4" />
      </Button>
    </div>
  )
}

function UnreadDivider() {
  return (
    <div className="flex items-center gap-3 py-1" role="separator">
      <Separator className="flex-1 bg-destructive/40" />
      <span className="text-[0.65rem] font-medium text-destructive">
        پیام‌های جدید
      </span>
      <Separator className="flex-1 bg-destructive/40" />
    </div>
  )
}

function ChatMessageRow({
  message,
  conversation,
}: {
  message: ChatMessage
  conversation: Conversation
}) {
  const author = getChatMember(message.authorId)
  const mine = message.authorId === CURRENT_USER_ID
  const reply = message.replyTo
    ? conversation.messages.find((m) => m.id === message.replyTo)
    : undefined

  return (
    <Message align={mine ? "end" : "start"} className="py-0.5">
      {!mine ? (
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback className="text-[0.65rem]">
              {author.initials}
            </AvatarFallback>
          </Avatar>
        </MessageAvatar>
      ) : null}
      <MessageContent>
        {!mine ? (
          <MessageHeader>
            <span className="truncate text-foreground">{author.name}</span>
          </MessageHeader>
        ) : null}
        <Bubble
          variant={mine ? "default" : "muted"}
          align={mine ? "end" : "start"}
          className="relative max-w-[min(85%,28rem)]"
        >
          {reply ? (
            <div className="mx-3 mt-2 rounded-md border-s-2 border-primary/50 bg-background/40 px-2 py-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {getChatMember(reply.authorId).name}
              </span>
              <span className="mt-0.5 line-clamp-1 block">{reply.body}</span>
            </div>
          ) : null}
          <BubbleContent>{message.body}</BubbleContent>
          {message.attachment ? (
            <div className="px-2 pb-2">
              <Attachment state="done" size="sm">
                <AttachmentMedia>
                  <FileIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{message.attachment.name}</AttachmentTitle>
                  <AttachmentDescription>
                    {message.attachment.sizeLabel}
                  </AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            </div>
          ) : null}
          {message.reactions?.length ? (
            <BubbleReactions
              side="bottom"
              align={mine ? "start" : "end"}
              className="gap-1"
            >
              {message.reactions.map((r) => (
                <span
                  key={r.emoji}
                  className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs"
                >
                  <span aria-hidden>{r.emoji}</span>
                  <span className="tracking-normal text-muted-foreground">
                    {formatCount(r.count)}
                  </span>
                </span>
              ))}
            </BubbleReactions>
          ) : null}
        </Bubble>
        <MessageFooter>{message.time}</MessageFooter>
      </MessageContent>
    </Message>
  )
}

function Composer({
  value,
  onChange,
  onSend,
}: {
  value: string
  onChange: (value: string) => void
  onSend: () => void
}) {
  return (
    <div className="shrink-0 border-t bg-background/95 px-2 py-2 sm:px-3 sm:py-2.5">
      <div className="mx-auto flex max-w-2xl items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="mb-0.5 shrink-0 rounded-full"
          aria-label="پیوست فایل"
          onClick={() =>
            toast.message("انتخاب فایل در این نمونه فقط نمایشی است")
          }
        >
          <PaperclipIcon className="size-5" />
        </Button>
        <div className="flex min-w-0 flex-1 items-end rounded-2xl border border-input bg-muted/30 px-3 py-2 shadow-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
          <Textarea
            rows={1}
            placeholder="پیام بنویسید…"
            aria-label="متن پیام"
            persianDigits={false}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
            className="max-h-32 min-h-[1.5rem] flex-1 resize-none border-0 bg-transparent p-0 text-sm leading-normal shadow-none focus-visible:ring-0"
          />
        </div>
        <Button
          type="button"
          size="icon-sm"
          className="mb-0.5 size-9 shrink-0 rounded-full"
          aria-label="ارسال پیام"
          onClick={onSend}
          disabled={!value.trim()}
        >
          <SendIcon className="size-4 rtl:-scale-x-100" />
        </Button>
      </div>
    </div>
  )
}

function DetailsPanel({
  conversation,
  inSheet,
}: {
  conversation: Conversation
  inSheet?: boolean
}) {
  const members = conversation.memberIds.map(getChatMember)
  const files = conversation.messages
    .filter((m) => m.attachment)
    .map((m) => m.attachment!)

  return (
    <div className="flex h-full min-h-0 flex-col">
      {inSheet ? (
        <SheetHeader className="border-b p-4 text-start">
          <SheetTitle>جزئیات گفتگو</SheetTitle>
          <SheetDescription>{conversation.name}</SheetDescription>
        </SheetHeader>
      ) : (
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">جزئیات</p>
          <p className="text-xs text-muted-foreground">
            {conversation.kind === "channel" ? "کانال" : "پیام مستقیم"}
          </p>
        </div>
      )}
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-5 p-4">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <UsersIcon className="size-3.5" />
              اعضا
            </p>
            <ul className="space-y-2">
              {members.map((member) => (
                <li key={member.id} className="flex items-center gap-2">
                  <span className="relative">
                    <Avatar size="sm">
                      <AvatarFallback className="text-[0.65rem]">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute -inset-s-0.5 -bottom-0.5 size-2 rounded-full ring-2 ring-background",
                        member.online
                          ? "bg-emerald-500"
                          : "bg-muted-foreground/40"
                      )}
                      aria-label={member.online ? "آنلاین" : "آفلاین"}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {member.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {member.role}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              فایل‌های اخیر
            </p>
            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">فایلی نیست.</p>
            ) : (
              <ul className="space-y-2">
                {files.map((file) => (
                  <li key={file.name}>
                    <Attachment state="done" size="sm" className="w-full">
                      <AttachmentMedia>
                        <FileIcon />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>{file.name}</AttachmentTitle>
                        <AttachmentDescription>
                          {file.sizeLabel}
                        </AttachmentDescription>
                      </AttachmentContent>
                    </Attachment>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {conversation.kind === "channel" && conversation.topic ? (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  موضوع کانال
                </p>
                <p className="text-sm leading-relaxed">{conversation.topic}</p>
              </div>
            </>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  )
}
