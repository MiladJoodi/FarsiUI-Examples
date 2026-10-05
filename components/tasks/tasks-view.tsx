"use client"

import * as React from "react"
import {
  Columns3Icon,
  ListIcon,
  PlusIcon,
} from "lucide-react"

import { toPersianDigits } from "@/lib/digits"
import { formatCount, formatJalaliDate, formatPercent } from "@/lib/format"
import {
  activeProject,
  getMember,
  getTaskCounts,
  taskPriorities,
  tasks as initialTasks,
  taskStatuses,
  teamMembers,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/mock/tasks"
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu"
import { SearchField } from "@/components/shared/search-field"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const variant =
    priority === "فوری" || priority === "بالا"
      ? "destructive"
      : priority === "متوسط"
        ? "secondary"
        : "outline"
  return <Badge variant={variant}>{priority}</Badge>
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const variant =
    status === "تکمیل‌شده"
      ? "default"
      : status === "در حال انجام"
        ? "secondary"
        : "outline"
  return <Badge variant={variant}>{status}</Badge>
}

export function TasksView() {
  const [items, setItems] = React.useState<Task[]>(initialTasks)
  const [query, setQuery] = React.useState("")
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all")
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("all")
  const [selected, setSelected] = React.useState<Task | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)

  const filtered = items.filter((task) => {
    const q = query.trim()
    const matchesQuery =
      !q ||
      task.title.includes(q) ||
      task.id.includes(q) ||
      task.label.includes(q)
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter
    const matchesAssignee =
      assigneeFilter === "all" || task.assigneeId === assigneeFilter
    return matchesQuery && matchesPriority && matchesAssignee
  })

  const counts = getTaskCounts(filtered)

  function moveTask(taskId: string, status: TaskStatus) {
    setItems((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              progress:
                status === "تکمیل‌شده"
                  ? 100
                  : status === "جدید"
                    ? Math.min(task.progress, 15)
                    : task.progress,
            }
          : task
      )
    )
    toast.success(`وضعیت به «${status}» تغییر کرد`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Workspace header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {activeProject.name}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {activeProject.description} — مهلت{" "}
            {formatJalaliDate(activeProject.dueDate)}
          </p>
        </div>
        <Button
          className="w-full shrink-0 sm:w-auto"
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon data-icon="inline-start" />
          وظیفه جدید
        </Button>
      </div>

      {/* Project context + overview */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
        <section
          aria-label="خلاصه وظایف"
          className="grid h-fit grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <StatTile label="کل وظایف" value={counts.total} />
          <StatTile label="در حال انجام" value={counts.doing} />
          <StatTile label="تکمیل‌شده" value={counts.done} />
          <StatTile label="عقب‌افتاده" value={counts.overdue} tone="warn" />
        </section>

        <div
          data-slot="card"
          className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">پیشرفت پروژه</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                تیم فعال روی همین فضای کاری
              </p>
            </div>
            <span className="text-sm font-semibold tracking-normal whitespace-nowrap">
              {formatPercent(activeProject.progress)}
            </span>
          </div>
          <Progress value={activeProject.progress} className="mt-3 gap-2">
            <div className="flex w-full justify-between text-xs text-muted-foreground">
              <ProgressLabel>تکمیل کلی</ProgressLabel>
              <ProgressValue />
            </div>
          </Progress>
          <Separator className="my-3" />
          <div className="flex flex-wrap items-center gap-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-1.5 rounded-full border pe-2.5 ps-1 py-0.5"
                title={`${member.name} — ${member.role}`}
              >
                <Avatar size="sm">
                  <AvatarFallback className="text-[0.65rem]">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-xs sm:inline">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar: CTA pattern already has create above; here search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchField
          wrapperClassName="flex-1 sm:max-w-md"
          placeholder="جستجوی عنوان، برچسب یا شناسه…"
          aria-label="جستجوی وظایف"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Select
          value={priorityFilter}
          onValueChange={(v) => setPriorityFilter(v ?? "all")}
          items={{
            all: "همه اولویت‌ها",
            ...Object.fromEntries(taskPriorities.map((p) => [p, p])),
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px]" aria-label="فیلتر اولویت">
            <SelectValue placeholder="اولویت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه اولویت‌ها</SelectItem>
            {taskPriorities.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={assigneeFilter}
          onValueChange={(v) => setAssigneeFilter(v ?? "all")}
          items={{
            all: "همه اعضا",
            ...Object.fromEntries(teamMembers.map((m) => [m.id, m.name])),
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]" aria-label="فیلتر مسئول">
            <SelectValue placeholder="مسئول" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه اعضا</SelectItem>
            {teamMembers.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-sm tracking-normal text-muted-foreground sm:ms-auto">
          {formatCount(filtered.length)} وظیفه
        </p>
      </div>

      <Tabs defaultValue="board" className="gap-4">
        <TabsList>
          <TabsTrigger value="board" className="gap-1.5">
            <Columns3Icon className="size-3.5" />
            برد
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-1.5">
            <ListIcon className="size-3.5" />
            فهرست
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="flex-none">
          <TaskBoard
            tasks={filtered}
            onOpen={setSelected}
            onMove={moveTask}
          />
        </TabsContent>

        <TabsContent value="list" className="flex-none">
          <TaskList
            tasks={filtered}
            onOpen={setSelected}
            onMove={moveTask}
          />
        </TabsContent>
      </Tabs>

      <TaskDetailDialog
        task={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        onMove={moveTask}
      />

      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(task) => {
          setItems((prev) => [task, ...prev])
          toast.success("وظیفه به برد اضافه شد")
        }}
      />
    </div>
  )
}

function StatTile({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: "warn"
}) {
  return (
    <div
      data-slot="card"
      className="rounded-xl border bg-card px-3 py-3 text-card-foreground shadow-xs sm:px-4"
    >
      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
      <p
        className={`mt-0.5 text-lg font-semibold tracking-normal ${
          tone === "warn"
            ? "text-amber-700 dark:text-amber-400"
            : ""
        }`}
      >
        {formatCount(value)}
      </p>
    </div>
  )
}

function TaskBoard({
  tasks,
  onOpen,
  onMove,
}: {
  tasks: Task[]
  onOpen: (task: Task) => void
  onMove: (id: string, status: TaskStatus) => void
}) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex min-w-max gap-3 pb-3 xl:grid xl:min-w-0 xl:grid-cols-4 xl:whitespace-normal">
        {taskStatuses.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status)
          return (
            <div
              key={status}
              className="flex w-[272px] shrink-0 flex-col rounded-xl border bg-muted/20 xl:w-auto"
            >
              <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
                <StatusBadge status={status} />
                <span className="text-xs tracking-normal text-muted-foreground">
                  {formatCount(columnTasks.length)}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-2.5">
                {columnTasks.length === 0 ? (
                  <p className="rounded-lg border border-dashed px-3 py-8 text-center text-xs text-muted-foreground">
                    وظیفه‌ای در این ستون نیست
                  </p>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onOpen={() => onOpen(task)}
                      onMove={onMove}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

function TaskCard({
  task,
  onOpen,
  onMove,
}: {
  task: Task
  onOpen: () => void
  onMove: (id: string, status: TaskStatus) => void
}) {
  const member = getMember(task.assigneeId)

  return (
    <div className="rounded-lg border bg-background p-3 text-sm shadow-none">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 rounded-sm text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <p className="font-medium leading-snug whitespace-normal">{task.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{task.id}</p>
        </button>
        <TaskActions task={task} onOpen={onOpen} onMove={onMove} />
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Badge variant="outline">{task.label}</Badge>
        <PriorityBadge priority={task.priority} />
      </div>
      <Separator className="my-2.5" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Avatar size="sm">
            <AvatarFallback className="text-[0.65rem]">
              {member.initials}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-xs text-muted-foreground">
            {member.name}
          </span>
        </div>
        <span className="shrink-0 text-xs tracking-normal whitespace-nowrap text-muted-foreground">
          {formatJalaliDate(task.dueDate)}
        </span>
      </div>
      {task.progress > 0 && task.progress < 100 ? (
        <div
          className="mt-2.5 h-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={task.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`پیشرفت ${toPersianDigits(task.progress)} درصد`}
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      ) : null}
    </div>
  )
}

function TaskList({
  tasks,
  onOpen,
  onMove,
}: {
  tasks: Task[]
  onOpen: (task: Task) => void
  onMove: (id: string, status: TaskStatus) => void
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-14 text-center text-sm text-muted-foreground">
        با این فیلتر وظیفه‌ای پیدا نشد.
      </div>
    )
  }

  return (
    <div
      data-slot="card"
      className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[14rem]">عنوان</TableHead>
              <TableHead>مسئول</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>اولویت</TableHead>
              <TableHead>مهلت</TableHead>
              <TableHead className="min-w-[7rem]">پیشرفت</TableHead>
              <TableHead className="w-12 text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const member = getMember(task.assigneeId)
              return (
                <TableRow key={task.id}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => onOpen(task)}
                      className="text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      <span className="font-medium">{task.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {task.id} · {task.label}
                      </span>
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback className="text-[0.65rem]">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap tracking-normal">
                    {formatJalaliDate(task.dueDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="min-w-16 flex-1 gap-0" />
                      <span className="shrink-0 text-end text-xs tracking-normal text-muted-foreground">
                        {formatPercent(task.progress)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <TaskActions
                      task={task}
                      onOpen={() => onOpen(task)}
                      onMove={onMove}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function TaskActions({
  task,
  onOpen,
  onMove,
}: {
  task: Task
  onOpen: () => void
  onMove: (id: string, status: TaskStatus) => void
}) {
  return (
    <EntityActionsMenu label={`عملیات وظیفه ${task.id}`}>
      <DropdownMenuItem onClick={onOpen}>مشاهده جزئیات</DropdownMenuItem>
      <DropdownMenuSeparator />
      {taskStatuses
        .filter((s) => s !== task.status)
        .map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onMove(task.id, status)}
          >
            انتقال به {status}
          </DropdownMenuItem>
        ))}
    </EntityActionsMenu>
  )
}

function TaskDetailDialog({
  task,
  onOpenChange,
  onMove,
}: {
  task: Task | null
  onOpenChange: (open: boolean) => void
  onMove: (id: string, status: TaskStatus) => void
}) {
  const member = task ? getMember(task.assigneeId) : null

  return (
    <Dialog open={Boolean(task)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        {task && member ? (
          <>
            <DialogHeader>
              <DialogTitle>{task.title}</DialogTitle>
              <DialogDescription>
                {task.id} · {task.label} · مهلت{" "}
                {formatJalaliDate(task.dueDate)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <p className="leading-relaxed text-muted-foreground">
                {task.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <Progress value={task.progress} className="gap-2">
                <div className="flex w-full justify-between text-xs">
                  <ProgressLabel>پیشرفت</ProgressLabel>
                  <ProgressValue />
                </div>
              </Progress>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Select
                value={task.status}
                onValueChange={(value) => {
                  if (value) onMove(task.id, value as TaskStatus)
                }}
                items={Object.fromEntries(taskStatuses.map((s) => [s, s]))}
              >
                <SelectTrigger aria-label="تغییر وضعیت وظیفه" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                بستن
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function CreateTaskDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (task: Task) => void
}) {
  const [title, setTitle] = React.useState("")
  const [assigneeId, setAssigneeId] = React.useState(teamMembers[0].id)
  const [priority, setPriority] = React.useState<TaskPriority>("متوسط")

  function submit() {
    const trimmed = title.trim()
    if (!trimmed) {
      toast.error("عنوان وظیفه را وارد کنید")
      return
    }
    const id = `T-${100 + Math.floor(Math.random() * 80)}`
    onCreate({
      id,
      title: trimmed,
      description: "وظیفهٔ جدید ثبت‌شده در فضای کاری (نمونه بدون سرور).",
      status: "جدید",
      priority,
      assigneeId,
      dueDate: "۱۴۰۵/۰۷/۲۰",
      label: "عمومی",
      progress: 0,
      projectId: activeProject.id,
    })
    setTitle("")
    setPriority("متوسط")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>ایجاد وظیفه</DialogTitle>
          <DialogDescription>
            وظیفه در ستون «جدید» اضافه می‌شود — فقط در همین نشست مرورگر.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <InputGroup>
            <InputGroupInput
              placeholder="عنوان وظیفه"
              aria-label="عنوان وظیفه"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputGroup>
          <Select
            value={assigneeId}
            onValueChange={(v) => v && setAssigneeId(v)}
            items={Object.fromEntries(teamMembers.map((m) => [m.id, m.name]))}
          >
            <SelectTrigger aria-label="مسئول وظیفه" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priority}
            onValueChange={(v) => v && setPriority(v as TaskPriority)}
            items={Object.fromEntries(taskPriorities.map((p) => [p, p]))}
          >
            <SelectTrigger aria-label="اولویت وظیفه" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {taskPriorities.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          <Button onClick={submit}>افزودن</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
