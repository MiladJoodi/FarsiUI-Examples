"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  FileIcon,
  GlobeIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PanelLeftIcon,
  PaperclipIcon,
  RefreshCwIcon,
  SendIcon,
  SparklesIcon,
  SquarePenIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  assistantHint,
  assistantName,
  buildLocalAssistantReply,
  conversations as initialConversations,
  createEmptyConversation,
  getSource,
  groupLabels,
  models,
  sources,
  suggestedPrompts,
  type ChatMessage,
  type ContentBlock,
  type Conversation,
  type SourceRef,
} from "@/lib/mock/ai-assistant"
import { DesignSystemPicker } from "@/components/design-system/design-system-picker"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { SearchField } from "@/components/shared/search-field"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { HighlightedCode } from "@/components/ai-assistant/highlight-code"

const numericClass =
  "tracking-normal [font-variant-numeric:normal] [font-feature-settings:normal]"

export function AiAssistantView() {
  const [items, setItems] = React.useState(initialConversations)
  const [activeId, setActiveId] = React.useState(initialConversations[0].id)
  const [query, setQuery] = React.useState("")
  const [draft, setDraft] = React.useState("")
  const [modelId, setModelId] = React.useState(models[0].id)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [sourcesOpen, setSourcesOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [thinking, setThinking] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  const active = items.find((c) => c.id === activeId) ?? items[0]

  const filtered = items.filter((c) => {
    const q = query.trim()
    if (!q) return true
    return c.title.includes(q) || c.preview.includes(q)
  })

  const grouped = (
    ["today", "week", "older"] as Conversation["group"][]
  ).map((group) => ({
    group,
    label: groupLabels[group],
    items: filtered.filter((c) => c.group === group),
  }))

  const conversationSources = (active?.sourceIds ?? [])
    .map(getSource)
    .filter(Boolean) as SourceRef[]

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [active?.id, active?.messages.length, thinking])

  function selectConversation(id: string) {
    setActiveId(id)
    const conv = items.find((c) => c.id === id)
    if (conv) setModelId(conv.modelId)
    setSidebarOpen(false)
  }

  function startNewChat() {
    const conv = createEmptyConversation(modelId)
    setItems((prev) => [conv, ...prev])
    setActiveId(conv.id)
    setDraft("")
    setSidebarOpen(false)
  }

  function applyPrompt(prompt: string) {
    setDraft(prompt)
  }

  function appendAssistantReply(conversationId: string, userText: string) {
    setThinking(true)
    window.setTimeout(() => {
      const blocks = buildLocalAssistantReply(userText)
      const textPreview = blocks.find((b) => b.type === "text")
      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        createdAt: new Intl.DateTimeFormat("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
        blocks,
      }
      setItems((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                preview:
                  textPreview && textPreview.type === "text"
                    ? textPreview.text.slice(0, 48) +
                      (textPreview.text.length > 48 ? "…" : "")
                    : c.preview,
                messages: [...c.messages, assistantMessage],
              }
            : c
        )
      )
      setThinking(false)
    }, 700)
  }

  function sendMessage(text?: string) {
    const body = (text ?? draft).trim()
    if (!body || thinking || !active) return

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      createdAt: new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
      blocks: [{ type: "text", text: body }],
    }

    setItems((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              title:
                c.messages.length === 0
                  ? body.slice(0, 36) + (body.length > 36 ? "…" : "")
                  : c.title,
              preview: body,
              updatedAt: userMessage.createdAt,
              modelId,
              messages: [...c.messages, userMessage],
            }
          : c
      )
    )
    setDraft("")
    appendAssistantReply(active.id, body)
  }

  function retryLast() {
    if (!active || thinking) return
    const lastUser = [...active.messages]
      .reverse()
      .find((m) => m.role === "user")
    if (!lastUser) return
    const textBlock = lastUser.blocks.find((b) => b.type === "text")
    if (!textBlock || textBlock.type !== "text") return

    setItems((prev) =>
      prev.map((c) => {
        if (c.id !== active.id) return c
        const messages = [...c.messages]
        if (messages.at(-1)?.role === "assistant") messages.pop()
        return { ...c, messages }
      })
    )
    appendAssistantReply(active.id, textBlock.text)
  }

  const isEmpty = (active?.messages.length ?? 0) === 0 && !thinking

  const sidebar = (
    <ChatSidebar
      grouped={grouped}
      activeId={active.id}
      query={query}
      onQueryChange={setQuery}
      onSelect={selectConversation}
      onNewChat={startNewChat}
      onClose={() => setSidebarOpen(false)}
      showClose={sidebarOpen}
    />
  )

  return (
    <TooltipProvider>
      <div className="flex h-full min-h-0 overflow-hidden">
        <aside className="hidden w-[17.5rem] shrink-0 flex-col border-e bg-muted/30 md:flex">
          {sidebar}
        </aside>

        <section
          className="relative flex min-w-0 flex-1 flex-col bg-background"
          aria-label="گفتگو با دستیار"
        >
          <header className="flex h-12 shrink-0 items-center gap-1 border-b px-2 sm:px-3">
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 md:hidden"
              aria-label="منوی گفتگوها"
              onClick={() => setSidebarOpen(true)}
            >
              <PanelLeftIcon className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="hidden shrink-0 md:inline-flex"
              aria-label="گفتگوی جدید"
              onClick={startNewChat}
            >
              <SquarePenIcon className="size-4" />
            </Button>

            <div className="flex min-w-0 flex-1 justify-center px-1">
              <Select
                value={modelId}
                onValueChange={(v) => {
                  if (!v) return
                  setModelId(v)
                  setItems((prev) =>
                    prev.map((c) =>
                      c.id === active.id ? { ...c, modelId: v } : c
                    )
                  )
                }}
                items={Object.fromEntries(models.map((m) => [m.id, m.name]))}
              >
                <SelectTrigger
                  size="sm"
                  className="h-8 max-w-[14rem] border-0 bg-transparent shadow-none"
                  aria-label="انتخاب مدل"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 md:hidden"
              aria-label="گفتگوی جدید"
              onClick={startNewChat}
            >
              <SquarePenIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              aria-label="گزینه‌های بیشتر"
              onClick={() => setSettingsOpen(true)}
            >
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </header>

          <ScrollArea className="min-h-0 flex-1">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-3 py-4 sm:px-4 sm:py-6">
              {isEmpty ? (
                <EmptyState onPick={applyPrompt} />
              ) : (
                <>
                  {active.messages.map((message, index) => (
                    <MessageRow
                      key={message.id}
                      message={message}
                      onRetry={
                        message.role === "assistant" &&
                        index === active.messages.length - 1
                          ? retryLast
                          : undefined
                      }
                    />
                  ))}
                  {thinking ? <ThinkingRow /> : null}
                </>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <Composer
            value={draft}
            onChange={setDraft}
            onSend={() => sendMessage()}
            disabled={thinking}
          />
        </section>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="right" className="w-[min(18rem,100%)] p-0 md:hidden">
            {sidebar}
          </SheetContent>
        </Sheet>

        <Sheet open={sourcesOpen} onOpenChange={setSourcesOpen}>
          <SheetContent side="left" className="w-[min(22rem,100%)] p-0">
            <SourcesPanel sources={conversationSources} inSheet />
          </SheetContent>
        </Sheet>

        <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
          <SheetContent side="left" className="w-[min(22rem,100%)]">
            <SheetHeader className="text-start">
              <SheetTitle>تنظیمات دستیار</SheetTitle>
              <SheetDescription>
                این تنظیمات فقط در همین نمونه اعمال می‌شوند.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4 pb-6">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setSettingsOpen(false)
                  setSourcesOpen(true)
                }}
              >
                <FileIcon className="size-4" data-icon="inline-start" />
                منابع گفتگو
              </Button>
              <Separator />
              <p className="text-sm leading-relaxed text-muted-foreground">
                پاسخ‌ها به‌صورت محلی و نمایشی تولید می‌شوند؛ اتصال به مدل واقعی
                وجود ندارد.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  )
}

function ChatSidebar({
  grouped,
  activeId,
  query,
  onQueryChange,
  onSelect,
  onNewChat,
  onClose,
  showClose,
}: {
  grouped: {
    group: Conversation["group"]
    label: string
    items: Conversation[]
  }[]
  activeId: string
  query: string
  onQueryChange: (value: string) => void
  onSelect: (id: string) => void
  onNewChat: () => void
  onClose?: () => void
  showClose?: boolean
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background">
            <SparklesIcon className="size-4" aria-hidden />
          </span>
          <span className="truncate text-sm font-semibold">{assistantName}</span>
        </div>
        {showClose ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="بستن منو"
            onClick={onClose}
          >
            <PanelLeftIcon className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="space-y-2 px-2 pb-2">
        <Button
          variant="outline"
          className="h-9 w-full justify-start gap-2 rounded-lg border-border/80 bg-background/60 shadow-none"
          onClick={onNewChat}
        >
          <SquarePenIcon className="size-4" />
          گفتگوی جدید
        </Button>
        <SearchField
          placeholder="جستجو در گفتگوها…"
          aria-label="جستجوی گفتگو"
          value={query}
          onChange={(e) => onQueryChange(e.target.value ?? "")}
        />
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav className="space-y-3 px-2 pb-2" aria-label="تاریخچه گفتگوها">
          {grouped.map(({ group, label, items }) =>
            items.length === 0 ? null : (
              <div key={group}>
                <p className="mb-1 px-2.5 text-[0.65rem] font-medium text-muted-foreground">
                  {label}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const selected = item.id === activeId
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(item.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm transition-colors",
                            selected
                              ? "bg-background shadow-xs ring-1 ring-border/60"
                              : "hover:bg-background/70"
                          )}
                        >
                          <MessageSquareIcon
                            className="size-4 shrink-0 opacity-50"
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {item.title}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          )}
          {grouped.every((g) => g.items.length === 0) ? (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              گفتگویی پیدا نشد.
            </p>
          ) : null}
        </nav>
      </ScrollArea>

      <div className="mt-auto space-y-2 border-t bg-muted/20 p-2">
        <DesignSystemPicker className="w-full" />
        <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback className="text-[0.65rem]">ن‌ک</AvatarFallback>
            </Avatar>
            <span className="truncate text-xs font-medium">نیما کاظمی</span>
          </div>
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10 sm:min-h-[min(60vh,28rem)]">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          چه کمکی از دستم برمی‌آید؟
        </h1>
        <p className="text-sm text-muted-foreground">{assistantHint}</p>
      </div>
      <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
        {suggestedPrompts.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPick(item.prompt)}
            className="rounded-2xl border bg-muted/20 p-4 text-start transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="block text-sm font-medium">{item.title}</span>
            <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {item.prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageRow({
  message,
  onRetry,
}: {
  message: ChatMessage
  onRetry?: () => void
}) {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="max-w-[min(100%,85%)] rounded-[1.25rem] bg-muted/80 px-4 py-2.5 text-sm leading-relaxed">
          {message.blocks.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </div>
        <time
          dateTime={message.createdAt}
          className={cn("px-1 text-[0.65rem] text-muted-foreground", numericClass)}
        >
          {message.createdAt}
        </time>
      </div>
    )
  }

  return (
    <article className="space-y-2 text-sm leading-relaxed">
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-background">
          <SparklesIcon className="size-3.5" aria-hidden />
        </span>
        <span className="text-sm font-medium">{assistantName}</span>
      </div>
      <div className="space-y-3 pe-1 ps-9">
        {message.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
        <MessageActions onRetry={onRetry} message={message} />
      </div>
      <time
        dateTime={message.createdAt}
        className={cn("block ps-9 text-[0.65rem] text-muted-foreground", numericClass)}
      >
        {message.createdAt}
      </time>
    </article>
  )
}

function ThinkingRow() {
  return (
    <div className="flex items-center gap-2 ps-9 text-sm text-muted-foreground">
      <span className="inline-flex gap-1" aria-live="polite">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:0ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:120ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:240ms]" />
      </span>
      <span>در حال نوشتن</span>
    </div>
  )
}

function BlockView({ block }: { block: ContentBlock }) {
  if (block.type === "text") {
    return <p className="whitespace-pre-wrap text-foreground">{block.text}</p>
  }
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-1.5 pe-1 ps-5 text-foreground">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  if (block.type === "code") {
    return <CodeBlock language={block.language} code={block.code} />
  }
  if (block.type === "sources") {
    return (
      <div className="flex flex-wrap gap-2">
        {block.sourceIds.map((id) => {
          const source = getSource(id)
          if (!source) return null
          return (
            <span
              key={id}
              className="inline-flex max-w-full items-center gap-1.5 rounded-lg border bg-muted/40 px-2 py-1 text-xs"
            >
              {source.kind === "web" ? (
                <GlobeIcon className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <FileIcon className="size-3.5 shrink-0" aria-hidden />
              )}
              <span className="truncate">{source.title}</span>
            </span>
          )
        })}
      </div>
    )
  }
  return null
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("کپی انجام نشد")
    }
  }

  return (
    <div
      dir="ltr"
      className="overflow-hidden rounded-lg border border-[#3c3c3c] bg-[#1e1e1e] text-start shadow-md"
    >
      <div className="flex items-center justify-between gap-2 bg-[#2d2d2d] px-3 py-2">
        <span className="text-xs tracking-normal text-[#cccccc]">{language}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-8 text-[#cccccc] hover:bg-white/10 hover:text-white"
          onClick={copy}
          aria-label={copied ? "کپی شد" : "کپی کد"}
        >
          {copied ? (
            <CheckIcon className="size-4" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 [font-variant-numeric:normal]">
        <HighlightedCode code={code} language={language} />
      </pre>
    </div>
  )
}

function MessageActions({
  message,
  onRetry,
}: {
  message: ChatMessage
  onRetry?: () => void
}) {
  const [copied, setCopied] = React.useState(false)

  async function copyAll() {
    const text = message.blocks
      .map((b) => {
        if (b.type === "text") return b.text
        if (b.type === "list") return b.items.map((i) => `• ${i}`).join("\n")
        if (b.type === "code") return b.code
        return ""
      })
      .filter(Boolean)
      .join("\n\n")
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("کپی انجام نشد")
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 pt-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={copyAll}
        aria-label={copied ? "کپی شد" : "کپی پاسخ"}
      >
        {copied ? (
          <CheckIcon className="size-4" />
        ) : (
          <CopyIcon className="size-4" />
        )}
      </Button>
      {onRetry ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRetry}
          aria-label="تلاش دوباره"
        >
          <RefreshCwIcon className="size-4" />
        </Button>
      ) : null}
    </div>
  )
}

function Composer({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}) {
  return (
    <div className="shrink-0 border-t bg-background/95 px-3 pb-4 pt-3 backdrop-blur sm:px-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex min-h-11 items-center gap-2 rounded-[1.625rem] border border-input bg-background px-2 py-1.5 shadow-sm focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-9 shrink-0 rounded-full"
            aria-label="پیوست فایل"
            onClick={() =>
              toast.message("پیوست در این نمونه فقط نمایشی است")
            }
          >
            <PaperclipIcon className="size-5" />
          </Button>
          <Textarea
            rows={1}
            placeholder="پیام برای دستیار…"
            aria-label="متن پیام"
            persianDigits={false}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
            className="!min-h-9 max-h-36 flex-1 resize-none border-0 bg-transparent px-1 py-2 text-sm leading-6 shadow-none focus-visible:border-0 focus-visible:ring-0 md:py-1.5"
          />
          <Button
            type="button"
            size="icon-sm"
            className="size-9 shrink-0 rounded-full"
            aria-label="ارسال پیام"
            disabled={disabled || !value.trim()}
            onClick={onSend}
          >
            <SendIcon className="size-4 rtl:-scale-x-100" />
          </Button>
        </div>
        <p
          className={cn(
            "mt-2 text-center text-[0.65rem] text-muted-foreground",
            numericClass
          )}
        >
          {assistantName} ممکن است اشتباه کند. اطلاعات مهم را بررسی کنید.
        </p>
      </div>
    </div>
  )
}

function SourcesPanel({
  sources: items,
  inSheet,
}: {
  sources: SourceRef[]
  inSheet?: boolean
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {inSheet ? (
        <SheetHeader className="border-b p-4 text-start">
          <SheetTitle>منابع و زمینه</SheetTitle>
          <SheetDescription>
            اسنادی که در این گفتگو به آن‌ها ارجاع شده است.
          </SheetDescription>
        </SheetHeader>
      ) : (
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">منابع و زمینه</p>
          <p className="text-xs text-muted-foreground">
            ارجاعهای مرتبط با گفتگوی فعال
          </p>
        </div>
      )}
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 p-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              هنوز منبعی به این گفتگو وصل نشده است. با طرح سؤال‌های مستندمحور،
              ارجاع‌ها اینجا ظاهر می‌شوند.
            </p>
          ) : (
            <ul className="space-y-2">
              {items.map((source) => (
                <li
                  key={source.id}
                  className="rounded-xl border p-3 text-sm"
                >
                  <div className="flex items-start gap-2">
                    {source.kind === "web" ? (
                      <GlobeIcon
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                    ) : (
                      <FileIcon
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium leading-snug">{source.title}</p>
                      <p
                        dir="ltr"
                        className="mt-1 text-start text-xs text-muted-foreground"
                      >
                        {source.detail}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Separator />
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              کتابخانه نمونه
            </p>
            <ul className="space-y-1.5">
              {sources.slice(0, 4).map((source) => (
                <li
                  key={source.id}
                  className="truncate text-xs text-muted-foreground"
                >
                  {source.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
