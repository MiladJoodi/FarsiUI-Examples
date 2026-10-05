"use client"

import * as React from "react"
import {
  FileIcon,
  HashIcon,
  InfoIcon,
  MenuIcon,
  PaperclipIcon,
  SearchIcon,
  SendIcon,
  UsersIcon,
} from "lucide-react"

import { toPersianDigits } from "@/lib/digits"
import {
  conversations as initialConversations,
  CURRENT_USER_ID,
  getChatMember,
  workspaceHint,
  workspaceName,
  type ChatMessage,
  type Conversation,
} from "@/lib/mock/team-chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
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
  const [navOpen, setNavOpen] = React.useState(false)
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
    setNavOpen(false)
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
    <div className="flex h-full min-h-0 overflow-hidden">
      <aside className="hidden w-52 shrink-0 flex-col border-e bg-muted/20 lg:flex xl:w-56">
        <WorkspaceHeader />
        <ScrollArea className="min-h-0 flex-1">
          <nav className="space-y-4 p-3" aria-label="ناوبری فضای کاری">
            <ConversationSection
              title="کانال‌ها"
              items={channels}
              activeId={active.id}
              onSelect={openConversation}
            />
            <ConversationSection
              title="پیام مستقیم"
              items={dms}
              activeId={active.id}
              onSelect={openConversation}
            />
          </nav>
        </ScrollArea>
      </aside>

      <section
        className={cn(
          "w-full min-w-0 flex-col border-e md:flex md:w-72 lg:w-80",
          mobilePane === "list" ? "flex" : "hidden md:flex"
        )}
        aria-label="فهرست گفتگوها"
      >
        <div className="flex items-center gap-2 border-b p-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="منوی فضای کاری"
            onClick={() => setNavOpen(true)}
          >
            <MenuIcon className="size-4" />
          </Button>
          <InputGroup className="h-9 min-w-0 flex-1">
            <InputGroupAddon align="inline-start">
              <SearchIcon className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="جستجوی گفتگو…"
              aria-label="جستجوی گفتگو"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-4 p-2">
            <ConversationSection
              title="کانال‌ها"
              items={channels}
              activeId={active.id}
              onSelect={openConversation}
              detailed
            />
            <ConversationSection
              title="پیام مستقیم"
              items={dms}
              activeId={active.id}
              onSelect={openConversation}
              detailed
            />
          </div>
        </ScrollArea>
      </section>

      <section
        className={cn(
          "min-w-0 flex-1 flex-col",
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
          <div className="mx-auto flex max-w-3xl flex-col gap-4 px-3 py-4 sm:px-5">
            {active.topic ? (
              <p className="rounded-lg border border-dashed px-3 py-2 text-center text-xs text-muted-foreground">
                موضوع کانال: {active.topic}
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
        <Composer
          value={draft}
          onChange={setDraft}
          onSend={sendMessage}
          placeholder={
            active.kind === "channel"
              ? `پیام به #${active.name}`
              : `پیام به ${active.name}`
          }
        />
      </section>

      <aside className="hidden w-64 shrink-0 flex-col border-s xl:flex">
        <DetailsPanel conversation={active} />
      </aside>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side="right" className="w-[min(20rem,100%)] p-0">
          <SheetHeader className="border-b p-4 text-start">
            <SheetTitle>{workspaceName}</SheetTitle>
            <SheetDescription>{workspaceHint}</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-5rem)]">
            <nav className="space-y-4 p-3">
              <ConversationSection
                title="کانال‌ها"
                items={items.filter((c) => c.kind === "channel")}
                activeId={active.id}
                onSelect={openConversation}
              />
              <ConversationSection
                title="پیام مستقیم"
                items={items.filter((c) => c.kind === "dm")}
                activeId={active.id}
                onSelect={openConversation}
              />
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="left" className="w-[min(22rem,100%)] p-0">
          <DetailsPanel conversation={active} inSheet />
        </SheetContent>
      </Sheet>
    </div>
  )
}

function WorkspaceHeader() {
  return (
    <div className="border-b px-3 py-3">
      <p className="truncate text-sm font-semibold">{workspaceName}</p>
      <p className="truncate text-xs text-muted-foreground">{workspaceHint}</p>
    </div>
  )
}

function ConversationSection({
  title,
  items,
  activeId,
  onSelect,
  detailed,
}: {
  title: string
  items: Conversation[]
  activeId: string
  onSelect: (id: string) => void
  detailed?: boolean
}) {
  if (items.length === 0) return null
  return (
    <div>
      <p className="mb-1.5 px-2 text-xs font-medium text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const selected = item.id === activeId
          const peerId =
            item.memberIds.find((id) => id !== CURRENT_USER_ID) ??
            item.memberIds[0]
          const peer = getChatMember(peerId)

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg px-2 py-2 text-start text-sm transition-colors",
                  selected
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted/60"
                )}
              >
                <span className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  {item.kind === "channel" ? (
                    <HashIcon className="size-3.5" />
                  ) : (
                    <>
                      <Avatar size="sm">
                        <AvatarFallback className="text-[0.65rem]">
                          {peer.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute inset-e-0 bottom-0 size-2 rounded-full ring-2 ring-background",
                          peer.online
                            ? "bg-emerald-500"
                            : "bg-muted-foreground/40"
                        )}
                        aria-hidden
                      />
                    </>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">
                      {item.kind === "channel" ? `# ${item.name}` : item.name}
                    </span>
                    {detailed ? (
                      <span className="shrink-0 text-[0.65rem] text-muted-foreground">
                        {item.lastTime}
                      </span>
                    ) : null}
                  </span>
                  {detailed ? (
                    <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {item.lastPreview}
                    </span>
                  ) : null}
                </span>
                {item.unread > 0 ? (
                  <Badge className="ms-auto shrink-0 tabular-nums">
                    {toPersianDigits(item.unread)}
                  </Badge>
                ) : null}
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
  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={onBack}
        aria-label="بازگشت به فهرست"
      >
        بازگشت
      </Button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {conversation.kind === "channel"
            ? `# ${conversation.name}`
            : conversation.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {toPersianDigits(conversation.memberIds.length)} عضو
          {conversation.topic ? ` · ${conversation.topic}` : null}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="xl:hidden"
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
    <Message align={mine ? "end" : "start"} className="pb-2">
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
          className="relative mb-2"
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
                  <span className="tabular-nums text-muted-foreground">
                    {toPersianDigits(r.count)}
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
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder: string
}) {
  return (
    <div className="shrink-0 border-t p-3 sm:p-4">
      <InputGroup className="items-end rounded-xl border bg-background">
        <InputGroupAddon align="block-start" className="pt-2">
          <InputGroupButton
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="پیوست فایل"
            onClick={() =>
              toast.message("انتخاب فایل در این نمونه فقط نمایشی است")
            }
          >
            <PaperclipIcon className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupTextarea
          rows={1}
          placeholder={placeholder}
          aria-label="متن پیام"
          value={value}
          onChange={(e) => onChange(e.target.value ?? "")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
          }}
          className="min-h-10 max-h-32 resize-none border-0 py-2.5 shadow-none focus-visible:ring-0"
        />
        <InputGroupAddon align="block-end" className="pb-2">
          <InputGroupButton
            type="button"
            size="sm"
            aria-label="ارسال پیام"
            onClick={onSend}
            disabled={!value.trim()}
          >
            ارسال
            <SendIcon data-icon="inline-end" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <p className="mt-1.5 text-[0.65rem] text-muted-foreground">
        Enter برای ارسال · Shift+Enter خط جدید
      </p>
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
          <SheetDescription>
            {conversation.kind === "channel"
              ? `# ${conversation.name}`
              : conversation.name}
          </SheetDescription>
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
