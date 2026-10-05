"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  FileIcon,
  GlobeIcon,
  HistoryIcon,
  PaperclipIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  Settings2Icon,
  SparklesIcon,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
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

export function AiAssistantView() {
  const [items, setItems] = React.useState(initialConversations)
  const [activeId, setActiveId] = React.useState(initialConversations[0].id)
  const [query, setQuery] = React.useState("")
  const [draft, setDraft] = React.useState("")
  const [modelId, setModelId] = React.useState(models[0].id)
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [sourcesOpen, setSourcesOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [thinking, setThinking] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  const active = items.find((c) => c.id === activeId) ?? items[0]
  const activeModel =
    models.find((m) => m.id === (active?.modelId || modelId)) ?? models[0]

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
    setHistoryOpen(false)
  }

  function startNewChat() {
    const conv = createEmptyConversation(modelId)
    setItems((prev) => [conv, ...prev])
    setActiveId(conv.id)
    setDraft("")
    setHistoryOpen(false)
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

  return (
    <TooltipProvider>
      <div className="flex h-full min-h-0 overflow-hidden">
        <aside className="hidden w-64 shrink-0 flex-col border-e bg-muted/15 lg:flex xl:w-72">
          <HistoryPanel
            grouped={grouped}
            activeId={active.id}
            query={query}
            onQueryChange={setQuery}
            onSelect={selectConversation}
            onNewChat={startNewChat}
          />
        </aside>

        <section className="flex min-w-0 flex-1 flex-col" aria-label="گفتگو با دستیار">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-label="تاریخچه گفتگوها"
              onClick={() => setHistoryOpen(true)}
            >
              <HistoryIcon className="size-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{active.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {activeModel.name} · {assistantHint}
              </p>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {activeModel.name}
            </Badge>
            <Button
              variant="ghost"
              size="icon-sm"
              className="xl:hidden"
              aria-label="منابع و زمینه"
              onClick={() => setSourcesOpen(true)}
            >
              <FileIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="تنظیمات دستیار"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings2Icon className="size-4" />
            </Button>
          </header>

          <ScrollArea className="min-h-0 flex-1">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-3 py-6 sm:px-5">
              {isEmpty ? (
                <EmptyState onPick={applyPrompt} onSend={sendMessage} />
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
            modelId={modelId}
            onModelChange={(id) => {
              setModelId(id)
              setItems((prev) =>
                prev.map((c) =>
                  c.id === active.id ? { ...c, modelId: id } : c
                )
              )
            }}
            disabled={thinking}
          />
        </section>

        <aside className="hidden w-72 shrink-0 flex-col border-s xl:flex">
          <SourcesPanel sources={conversationSources} />
        </aside>

        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetContent side="right" className="w-[min(20rem,100%)] p-0">
            <SheetHeader className="border-b p-4 text-start">
              <SheetTitle>گفتگوها</SheetTitle>
              <SheetDescription>{assistantName}</SheetDescription>
            </SheetHeader>
            <HistoryPanel
              grouped={grouped}
              activeId={active.id}
              query={query}
              onQueryChange={setQuery}
              onSelect={selectConversation}
              onNewChat={startNewChat}
              compact
            />
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
              <div className="space-y-2">
                <p className="text-sm font-medium">مدل پیش‌فرض</p>
                <Select
                  value={modelId}
                  onValueChange={(v) => v && setModelId(v)}
                  items={Object.fromEntries(models.map((m) => [m.id, m.name]))}
                >
                  <SelectTrigger className="w-full" aria-label="مدل پیش‌فرض">
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

function HistoryPanel({
  grouped,
  activeId,
  query,
  onQueryChange,
  onSelect,
  onNewChat,
  compact,
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
  compact?: boolean
}) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col", compact && "h-[calc(100%-5rem)]")}>
      <div className="space-y-3 border-b p-3">
        <Button className="w-full justify-start gap-2" onClick={onNewChat}>
          <PlusIcon className="size-4" />
          گفتگوی جدید
        </Button>
        <InputGroup className="h-9">
          <InputGroupAddon align="inline-start">
            <SearchIcon className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="جستجوی گفتگو…"
            aria-label="جستجوی گفتگو"
            value={query}
            onChange={(e) => onQueryChange(e.target.value ?? "")}
          />
        </InputGroup>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <nav className="space-y-4 p-3" aria-label="تاریخچه گفتگوها">
          {grouped.map(({ group, label, items }) =>
            items.length === 0 ? null : (
              <div key={group}>
                <p className="mb-1.5 px-2 text-xs font-medium text-muted-foreground">
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
                            "flex w-full flex-col gap-0.5 rounded-lg px-2.5 py-2 text-start transition-colors",
                            selected
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-muted/60"
                          )}
                        >
                          <span className="truncate text-sm font-medium">
                            {item.title}
                          </span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {item.preview}
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
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              گفتگویی پیدا نشد.
            </p>
          ) : null}
        </nav>
      </ScrollArea>
    </div>
  )
}

function EmptyState({
  onPick,
  onSend,
}: {
  onPick: (prompt: string) => void
  onSend: (prompt: string) => void
}) {
  return (
    <div className="flex flex-col items-center gap-8 py-8 sm:py-14">
      <div className="flex size-12 items-center justify-center rounded-2xl border bg-muted/40">
        <SparklesIcon className="size-5 text-foreground" aria-hidden />
      </div>
      <div className="max-w-md space-y-2 text-center">
        <h1 className="text-xl font-semibold tracking-tight">{assistantName}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {assistantHint}. یک موضوع را انتخاب کنید یا همین حالا بپرسید.
        </p>
      </div>
      <div className="grid w-full gap-2 sm:grid-cols-2">
        {suggestedPrompts.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onPick(item.prompt)
              onSend(item.prompt)
            }}
            className="rounded-xl border bg-background p-3 text-start transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="block text-sm font-medium">{item.title}</span>
            <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
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
      <div className="flex justify-end">
        <div className="max-w-[min(100%,36rem)] rounded-2xl bg-muted px-3.5 py-2.5 text-sm leading-relaxed">
          {message.blocks.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
          <p className="mt-1.5 text-[0.65rem] text-muted-foreground tabular-nums">
            {message.createdAt}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback className="text-[0.65rem]">نو</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium">{assistantName}</p>
          <p className="text-[0.65rem] text-muted-foreground tabular-nums">
            {message.createdAt}
          </p>
        </div>
      </div>
      <div className="space-y-3 ps-10 text-sm leading-relaxed">
        {message.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
        <MessageActions onRetry={onRetry} message={message} />
      </div>
    </div>
  )
}

function ThinkingRow() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Avatar size="sm">
        <AvatarFallback className="text-[0.65rem]">نو</AvatarFallback>
      </Avatar>
      <span className="animate-pulse">در حال نوشتن…</span>
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
    <div className="overflow-hidden rounded-xl border bg-muted/30">
      <div className="flex items-center justify-between gap-2 border-b px-3 py-1.5">
        <span className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
          {language}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={copy}
          aria-label="کپی کد"
        >
          {copied ? (
            <CheckIcon className="size-3.5" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
          {copied ? "کپی شد" : "کپی"}
        </Button>
      </div>
      <pre
        dir="ltr"
        className="overflow-x-auto p-3 text-start font-mono text-xs leading-relaxed text-foreground"
      >
        <code>{code}</code>
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
    <div className="flex flex-wrap items-center gap-1 pt-1">
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={copyAll}
        aria-label="کپی پاسخ"
      >
        {copied ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
        {copied ? "کپی شد" : "کپی"}
      </Button>
      {onRetry ? (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onRetry}
          aria-label="تلاش دوباره"
        >
          <RefreshCwIcon className="size-3.5" />
          تلاش دوباره
        </Button>
      ) : null}
    </div>
  )
}

function Composer({
  value,
  onChange,
  onSend,
  modelId,
  onModelChange,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  modelId: string
  onModelChange: (id: string) => void
  disabled?: boolean
}) {
  return (
    <div className="shrink-0 border-t p-3 sm:p-4">
      <div className="mx-auto w-full max-w-3xl space-y-2">
        <InputGroup className="items-end rounded-2xl border bg-background">
          <InputGroupAddon align="block-start" className="w-full justify-between gap-2 pt-2">
            <Select
              value={modelId}
              onValueChange={(v) => v && onModelChange(v)}
              items={Object.fromEntries(models.map((m) => [m.id, m.name]))}
            >
              <SelectTrigger
                size="sm"
                className="h-7 w-auto min-w-28 border-0 bg-transparent shadow-none"
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
            <InputGroupButton
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="پیوست فایل"
              onClick={() =>
                toast.message("پیوست در این نمونه فقط نمایشی است")
              }
            >
              <PaperclipIcon className="size-4" />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupTextarea
            rows={2}
            placeholder="پیام خود را بنویسید…"
            aria-label="متن پیام"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value ?? "")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
            className="min-h-16 max-h-40 resize-none border-0 py-2 shadow-none focus-visible:ring-0"
          />
          <InputGroupAddon align="block-end" className="justify-between pb-2">
            <p className="px-1 text-[0.65rem] text-muted-foreground">
              Enter ارسال · Shift+Enter خط جدید
            </p>
            <InputGroupButton
              type="button"
              size="sm"
              aria-label="ارسال پیام"
              disabled={disabled || !value.trim()}
              onClick={onSend}
            >
              ارسال
              <SendIcon data-icon="inline-end" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
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
