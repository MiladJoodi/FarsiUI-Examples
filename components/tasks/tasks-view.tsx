"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns3Icon,
  GripVerticalIcon,
  ListIcon,
  PlusIcon,
} from "lucide-react"

import { toPersianDigits } from "@/lib/digits"
import { formatCount, formatJalaliDate } from "@/lib/format"
import {
  activeProject,
  getMember,
  getTaskCounts,
  statusStageLabel,
  taskPriorities,
  tasks as initialTasks,
  taskStatuses,
  teamMembers,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/mock/tasks"
import {
  columnId,
  findTaskContainer,
  moveTaskInBoard,
  parseColumnId,
  reorderWithinColumn,
  tasksInStatus,
} from "@/components/tasks/kanban-dnd"
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu"
import { SearchField } from "@/components/shared/search-field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type DeskView = "board" | "list"
type ListSortKey = "title" | "assignee" | "status" | "due" | "priority"

const LIST_PAGE_SIZE = 8

const priorityRank: Record<TaskPriority, number> = {
  فوری: 4,
  بالا: 3,
  متوسط: 2,
  پایین: 1,
}

const statusRank: Record<TaskStatus, number> = {
  جدید: 0,
  "در حال انجام": 1,
  "در انتظار بررسی": 2,
  "تکمیل‌شده": 3,
}

function sortTasks(
  list: Task[],
  key: ListSortKey,
  dir: "asc" | "desc"
) {
  const mul = dir === "asc" ? 1 : -1
  return [...list].sort((a, b) => {
    let cmp = 0
    switch (key) {
      case "title":
        cmp = a.title.localeCompare(b.title, "fa")
        break
      case "assignee":
        cmp = getMember(a.assigneeId).name.localeCompare(
          getMember(b.assigneeId).name,
          "fa"
        )
        break
      case "status":
        cmp = statusRank[a.status] - statusRank[b.status]
        break
      case "due":
        cmp = a.dueDate.localeCompare(b.dueDate, "fa")
        break
      case "priority":
        cmp = priorityRank[a.priority] - priorityRank[b.priority]
        break
    }
    return cmp * mul
  })
}

function buildPageItems(totalPages: number, currentPage: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1) as Array<
      number | "ellipsis"
    >
  }
  const items: Array<number | "ellipsis"> = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  if (start > 2) items.push("ellipsis")
  for (let i = start; i <= end; i++) items.push(i)
  if (end < totalPages - 1) items.push("ellipsis")
  items.push(totalPages)
  return items
}

function PriorityChip({ priority }: { priority: TaskPriority }) {
  return (
    <span className="tk-chip" data-priority={priority}>
      {priority}
    </span>
  )
}

function StatusChip({ status }: { status: TaskStatus }) {
  return (
    <span className="tk-chip" data-status={status}>
      {statusStageLabel[status]}
    </span>
  )
}

function MemberAvatar({
  member,
  size = "sm",
}: {
  member: (typeof teamMembers)[number]
  size?: "sm" | "default"
}) {
  return (
    <Avatar size={size} className="tk-avatar">
      <AvatarImage src={member.avatar} alt={member.name} />
      <AvatarFallback className="text-[0.65rem]">{member.initials}</AvatarFallback>
    </Avatar>
  )
}

function matchesFilters(
  task: Task,
  query: string,
  priorityFilter: string,
  assigneeFilter: string
) {
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
}

export function TasksView() {
  const [items, setItems] = React.useState<Task[]>(initialTasks)
  const [query, setQuery] = React.useState("")
  const [priorityFilter, setPriorityFilter] = React.useState("all")
  const [assigneeFilter, setAssigneeFilter] = React.useState("all")
  const [selected, setSelected] = React.useState<Task | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [deskView, setDeskView] = React.useState<DeskView>("board")
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [overlayWidth, setOverlayWidth] = React.useState<number | null>(null)
  const dragOriginStatus = React.useRef<TaskStatus | null>(null)

  const filtered = React.useMemo(
    () =>
      items.filter((task) =>
        matchesFilters(task, query, priorityFilter, assigneeFilter)
      ),
    [items, query, priorityFilter, assigneeFilter]
  )

  const activeTask = activeId
    ? (items.find((task) => task.id === activeId) ?? null)
    : null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function setTaskStatus(taskId: string, status: TaskStatus) {
    setItems((prev) => {
      const current = prev.find((t) => t.id === taskId)
      if (!current || current.status === status) return prev
      return moveTaskInBoard(prev, taskId, columnId(status), status)
    })
    toast.success(`جابه‌جا شد → ${statusStageLabel[status]}`)
  }

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id)
    setActiveId(id)
    dragOriginStatus.current = findTaskContainer(id, items)
    const rect = event.active.rect.current.initial
    if (rect?.width) setOverlayWidth(rect.width)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeTaskId = String(active.id)
    const overId = over.id

    setItems((prev) => {
      const activeContainer = findTaskContainer(activeTaskId, prev)
      const overContainer =
        parseColumnId(overId) ?? findTaskContainer(String(overId), prev)
      if (!activeContainer || !overContainer) return prev
      if (activeContainer === overContainer) return prev
      return moveTaskInBoard(prev, activeTaskId, overId, overContainer)
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const origin = dragOriginStatus.current
    dragOriginStatus.current = null
    setActiveId(null)
    setOverlayWidth(null)
    if (!over) return

    const activeTaskId = String(active.id)
    const overId = over.id
    const activeContainer = findTaskContainer(activeTaskId, items)
    const overContainer =
      parseColumnId(overId) ?? findTaskContainer(String(overId), items)
    if (!activeContainer || !overContainer) return

    // Cross-column: toast immediately (origin captured at drag start)
    if (origin && origin !== overContainer) {
      toast.success(`جابه‌جا شد → ${statusStageLabel[overContainer]}`)
      setItems((prev) =>
        moveTaskInBoard(prev, activeTaskId, overId, overContainer)
      )
      return
    }

    // Same-column reorder
    const overTaskId = parseColumnId(overId) ? null : String(overId)
    if (overTaskId && overTaskId !== activeTaskId) {
      toast.success("جابه‌جا شد")
      setItems((prev) =>
        reorderWithinColumn(prev, activeContainer, activeTaskId, overTaskId)
      )
    }
  }

  function handleDragCancel() {
    dragOriginStatus.current = null
    setActiveId(null)
    setOverlayWidth(null)
  }

  const counts = getTaskCounts(filtered)

  return (
    <div className="tk-desk">
      <header className="tk-topbar">
        <div className="tk-topbar-main">
          <div className="tk-topbar-kicker">
            <span className="tk-topbar-mark" aria-hidden />
            <span>پروژه فعال</span>
            <span className="tk-topbar-dot" aria-hidden />
            <span>مهلت {formatJalaliDate(activeProject.dueDate)}</span>
          </div>
          <h1 className="tk-topbar-title">{activeProject.name}</h1>
          <p className="tk-topbar-sub">{activeProject.description}</p>
          <div className="tk-stat-strip" aria-label="خلاصه وضعیت">
            <span className="tk-stat" data-tone="total">
              <strong>{formatCount(counts.total)}</strong>
              کل
            </span>
            <span className="tk-stat" data-tone="doing">
              <strong>{formatCount(counts.doing)}</strong>
              در حال انجام
            </span>
            <span className="tk-stat" data-tone="done">
              <strong>{formatCount(counts.done)}</strong>
              تکمیل
            </span>
            <span className="tk-stat" data-tone="warn">
              <strong>{formatCount(counts.overdue)}</strong>
              عقب‌افتاده
            </span>
          </div>
        </div>

        <aside className="tk-topbar-side" aria-label="پیشرفت و تیم">
          <div
            className="tk-progress-ring"
            style={
              {
                "--tk-progress": activeProject.progress,
              } as React.CSSProperties
            }
            role="img"
            aria-label={`پیشرفت پروژه ${toPersianDigits(activeProject.progress)} درصد`}
          >
            <div className="tk-progress-ring-inner">
              <strong className="tk-ring-num" dir="ltr" lang="fa">
                <span className="tk-ring-digits">
                  {toPersianDigits(activeProject.progress)}
                </span>
                <span className="tk-ring-pct" aria-hidden>
                  ٪
                </span>
              </strong>
              <span>پیشرفت</span>
            </div>
          </div>
          <div className="tk-avatar-stack" aria-label="تیم پروژه">
            {teamMembers.map((member) => (
              <MemberAvatar key={member.id} member={member} />
            ))}
          </div>
        </aside>
      </header>

      <div className="tk-tools">
        <div className="tk-view-toggle" role="group" aria-label="نمای میز">
          <button
            type="button"
            aria-label="برد"
            title="برد"
            aria-pressed={deskView === "board"}
            onClick={() => setDeskView("board")}
          >
            <Columns3Icon className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="فهرست"
            title="فهرست"
            aria-pressed={deskView === "list"}
            onClick={() => setDeskView("list")}
          >
            <ListIcon className="size-4" aria-hidden />
          </button>
        </div>

        <SearchField
          wrapperClassName="flex-1 sm:max-w-xs"
          placeholder="جستجوی وظیفه…"
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
          <SelectTrigger className="w-full sm:w-35" aria-label="فیلتر اولویت">
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
          <SelectTrigger className="w-full sm:w-37.5" aria-label="فیلتر مسئول">
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

        <p className="tk-count">{formatCount(filtered.length)} وظیفه</p>

        <button
          type="button"
          className="tk-btn-primary tk-btn-compact"
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon className="size-3.5" aria-hidden />
          وظیفه جدید
        </button>
      </div>

      {deskView === "board" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="tk-board" dir="rtl" aria-label="برد وظایف">
            {taskStatuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasksInStatus(filtered, status)}
                onOpen={setSelected}
                onMove={setTaskStatus}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <div
                className="tk-overlay-wrap"
                style={
                  overlayWidth
                    ? { width: overlayWidth }
                    : { width: "17.25rem" }
                }
              >
                <TaskCardFace task={activeTask} overlay />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <TaskLedger
          tasks={filtered}
          onOpen={setSelected}
          onMove={setTaskStatus}
        />
      )}

      <TaskDetailDialog
        task={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        onMove={setTaskStatus}
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

function KanbanColumn({
  status,
  tasks,
  onOpen,
  onMove,
}: {
  status: TaskStatus
  tasks: Task[]
  onOpen: (task: Task) => void
  onMove: (id: string, status: TaskStatus) => void
}) {
  const id = columnId(status)
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <section
      className={cn("tk-column", isOver && "is-over")}
      data-status={status}
      aria-label={`ستون ${statusStageLabel[status]}`}
    >
      <header className="tk-column-head">
        <div className="tk-column-title">
          <span className="tk-column-dot" aria-hidden />
          <strong>{statusStageLabel[status]}</strong>
        </div>
        <span>{formatCount(tasks.length)}</span>
      </header>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="tk-column-body">
          {tasks.length === 0 ? (
            <p className="tk-column-empty">کارت را اینجا رها کنید</p>
          ) : (
            tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onOpen={() => onOpen(task)}
                onMove={onMove}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  )
}

function SortableTaskCard({
  task,
  onOpen,
  onMove,
}: {
  task: Task
  onOpen: () => void
  onMove: (id: string, status: TaskStatus) => void
}) {
  const [mounted, setMounted] = React.useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("tk-card-shell", isDragging && "is-dragging")}
    >
      <TaskCardFace
        task={task}
        onOpen={onOpen}
        onMove={onMove}
        dragHandleProps={
          mounted ? { ...attributes, ...listeners } : undefined
        }
      />
    </div>
  )
}

function TaskCardFace({
  task,
  onOpen,
  onMove,
  overlay = false,
  dragHandleProps,
}: {
  task: Task
  onOpen?: () => void
  onMove?: (id: string, status: TaskStatus) => void
  overlay?: boolean
  dragHandleProps?: Record<string, unknown>
}) {
  const member = getMember(task.assigneeId)

  return (
    <article className={cn("tk-card", overlay && "is-overlay")}>
      <div className="tk-card-top">
        <button
          type="button"
          className="tk-drag-handle"
          aria-label={`جابه‌جایی کارت ${task.id}`}
          title="بکشید تا جابه‌جا شود"
          {...(dragHandleProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          <GripVerticalIcon className="size-4" aria-hidden />
        </button>
        {onOpen ? (
          <button
            type="button"
            className="tk-card-title-btn"
            onClick={onOpen}
          >
            <p className="tk-card-title">{task.title}</p>
            <p className="tk-card-id">
              {task.id}
              <span aria-hidden> · </span>
              {task.label}
            </p>
          </button>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="tk-card-title">{task.title}</p>
            <p className="tk-card-id">
              {task.id}
              <span aria-hidden> · </span>
              {task.label}
            </p>
          </div>
        )}
        {onOpen && onMove ? (
          <div className="tk-card-menu">
            <TaskActions task={task} onOpen={onOpen} onMove={onMove} />
          </div>
        ) : null}
      </div>
      <div className="tk-card-tags">
        <PriorityChip priority={task.priority} />
      </div>
      <div
        className="tk-card-progress"
        data-priority={task.priority}
        data-done={task.progress >= 100 ? "true" : undefined}
        role="progressbar"
        aria-valuenow={task.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`پیشرفت ${toPersianDigits(task.progress)} درصد`}
      >
        <div className="tk-card-progress-track">
          <span
            className="tk-card-progress-fill"
            style={{ width: `${task.progress}%` }}
          />
        </div>
        <span className="tk-card-progress-val" dir="ltr">
          {toPersianDigits(task.progress)}٪
        </span>
      </div>
      <div className="tk-card-foot">
        <div className="tk-assignee">
          <MemberAvatar member={member} />
          <span>{member.name}</span>
        </div>
        <span className="tk-card-due">{formatJalaliDate(task.dueDate)}</span>
      </div>
    </article>
  )
}

function SortHeader({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  end,
}: {
  label: string
  sortKey: ListSortKey
  activeKey: ListSortKey
  dir: "asc" | "desc"
  onSort: (key: ListSortKey) => void
  end?: boolean
}) {
  const active = activeKey === sortKey
  const Icon = !active
    ? ArrowUpDownIcon
    : dir === "asc"
      ? ArrowUpIcon
      : ArrowDownIcon

  return (
    <button
      type="button"
      className={cn("tk-sort-btn", end && "ms-auto")}
      data-active={active ? "true" : undefined}
      onClick={() => onSort(sortKey)}
      aria-label={`مرتب‌سازی بر اساس ${label}`}
    >
      <span>{label}</span>
      <Icon aria-hidden />
    </button>
  )
}

function TaskLedger({
  tasks,
  onOpen,
  onMove,
}: {
  tasks: Task[]
  onOpen: (task: Task) => void
  onMove: (id: string, status: TaskStatus) => void
}) {
  const [page, setPage] = React.useState(1)
  const [sortKey, setSortKey] = React.useState<ListSortKey>("due")
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")
  const filterKey = tasks.map((t) => t.id).join("|")

  React.useEffect(() => {
    setPage(1)
  }, [filterKey, sortKey, sortDir])

  function handleSort(key: ListSortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
      return
    }
    setSortKey(key)
    setSortDir(key === "priority" || key === "due" ? "desc" : "asc")
  }

  const sorted = React.useMemo(
    () => sortTasks(tasks, sortKey, sortDir),
    [tasks, sortKey, sortDir]
  )

  const totalPages = Math.max(1, Math.ceil(sorted.length / LIST_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * LIST_PAGE_SIZE
  const pageTasks = sorted.slice(pageStart, pageStart + LIST_PAGE_SIZE)
  const pageItems = buildPageItems(totalPages, currentPage)
  const rangeFrom = sorted.length === 0 ? 0 : pageStart + 1
  const rangeTo = Math.min(pageStart + LIST_PAGE_SIZE, sorted.length)

  if (tasks.length === 0) {
    return (
      <div className="tk-ledger">
        <p className="tk-ledger-empty">با این فیلتر وظیفه‌ای پیدا نشد.</p>
      </div>
    )
  }

  return (
    <div className="tk-ledger-wrap">
      <section className="tk-ledger" aria-label="فهرست وظایف">
        <div className="tk-ledger-head">
          <SortHeader
            label="عنوان"
            sortKey="title"
            activeKey={sortKey}
            dir={sortDir}
            onSort={handleSort}
          />
          <SortHeader
            label="مسئول"
            sortKey="assignee"
            activeKey={sortKey}
            dir={sortDir}
            onSort={handleSort}
          />
          <SortHeader
            label="وضعیت"
            sortKey="status"
            activeKey={sortKey}
            dir={sortDir}
            onSort={handleSort}
          />
          <SortHeader
            label="مهلت"
            sortKey="due"
            activeKey={sortKey}
            dir={sortDir}
            onSort={handleSort}
          />
          <SortHeader
            label="اولویت"
            sortKey="priority"
            activeKey={sortKey}
            dir={sortDir}
            onSort={handleSort}
            end
          />
        </div>
        {pageTasks.map((task) => {
          const member = getMember(task.assigneeId)
          return (
            <div key={task.id} className="tk-ledger-row">
              <button
                type="button"
                className="tk-ledger-col tk-ledger-col-title tk-ledger-title-btn"
                onClick={() => onOpen(task)}
              >
                <p className="tk-ledger-title">{task.title}</p>
                <p className="tk-ledger-sub">
                  {task.id} · {task.label}
                </p>
              </button>
              <div className="tk-ledger-col tk-ledger-col-assignee tk-assignee">
                <MemberAvatar member={member} />
                <span>{member.name}</span>
              </div>
              <div className="tk-ledger-col tk-ledger-col-status">
                <StatusChip status={task.status} />
              </div>
              <div className="tk-ledger-col tk-ledger-col-due">
                <strong>{formatJalaliDate(task.dueDate)}</strong>
              </div>
              <div className="tk-ledger-col tk-ledger-col-meta">
                <PriorityChip priority={task.priority} />
                <TaskActions
                  task={task}
                  onOpen={() => onOpen(task)}
                  onMove={onMove}
                />
              </div>
            </div>
          )
        })}
      </section>

      <div className="tk-ledger-pager">
        <p className="tk-ledger-pager-meta">
          {toPersianDigits(rangeFrom)}–{toPersianDigits(rangeTo)} از{" "}
          {toPersianDigits(sorted.length)}
          <span className="tk-ledger-pager-sep" aria-hidden>
            ·
          </span>
          صفحه {toPersianDigits(currentPage)} از {toPersianDigits(totalPages)}
        </p>
        <Pagination className="tk-ledger-pagination mx-0 w-auto justify-start sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="tk-pager-btn gap-1 ps-1.5"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="صفحه قبلی"
              >
                <ChevronLeftIcon className="size-3.5 rtl:rotate-180" />
                <span className="hidden sm:inline">قبلی</span>
              </Button>
            </PaginationItem>
            {pageItems.map((item, index) =>
              item === "ellipsis" ? (
                <PaginationItem key={`e-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <Button
                    type="button"
                    variant={item === currentPage ? "outline" : "ghost"}
                    size="icon-sm"
                    className={cn(
                      "tk-pager-btn",
                      item === currentPage && "is-active"
                    )}
                    aria-current={item === currentPage ? "page" : undefined}
                    onClick={() => setPage(item)}
                  >
                    {toPersianDigits(item)}
                  </Button>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="tk-pager-btn gap-1 pe-1.5"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="صفحه بعدی"
              >
                <span className="hidden sm:inline">بعدی</span>
                <ChevronRightIcon className="size-3.5 rtl:rotate-180" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
    <EntityActionsMenu
      label={`عملیات وظیفه ${task.id}`}
      className="tk-actions-trigger border-0 bg-transparent shadow-none hover:border-0 hover:bg-black/5 dark:hover:bg-white/10"
    >
      <DropdownMenuItem onClick={onOpen}>مشاهده جزئیات</DropdownMenuItem>
      <DropdownMenuSeparator />
      {taskStatuses
        .filter((s) => s !== task.status)
        .map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onMove(task.id, status)}
          >
            انتقال به {statusStageLabel[status]}
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
      <DialogContent className="tk-dialog sm:max-w-md" dir="rtl">
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
              <p className="leading-relaxed text-[color:var(--tk-mute,#5b6b7c)]">
                {task.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <StatusChip status={task.status} />
                <PriorityChip priority={task.priority} />
              </div>
              <div className="flex items-center gap-2">
                <MemberAvatar member={member} size="default" />
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-[color:var(--tk-mute,#5b6b7c)]">
                    {member.role}
                  </p>
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
              <div className="tk-dialog-field w-full">
                <span className="tk-dialog-label">وضعیت</span>
                <Select
                  value={task.status}
                  onValueChange={(value) => {
                    if (value) onMove(task.id, value as TaskStatus)
                  }}
                  items={Object.fromEntries(
                    taskStatuses.map((s) => [s, statusStageLabel[s]])
                  )}
                >
                  <SelectTrigger aria-label="تغییر وضعیت وظیفه" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusStageLabel[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                type="button"
                className="tk-btn-ghost w-full"
                onClick={() => onOpenChange(false)}
              >
                بستن
              </button>
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
      description: "وظیفهٔ جدید ثبت‌شده در کارنما (دمو بدون سرور).",
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
      <DialogContent className="tk-dialog sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>وظیفه جدید</DialogTitle>
          <DialogDescription>
            وظیفه در ستون «جدید» اضافه می‌شود — فقط در همین نشست مرورگر.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="tk-dialog-field">
            <span className="tk-dialog-label">عنوان</span>
            <InputGroup>
              <InputGroupInput
                placeholder="مثلاً طراحی قاب ویترین"
                aria-label="عنوان وظیفه"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="tk-dialog-field">
            <span className="tk-dialog-label">مسئول</span>
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
          </div>
          <div className="tk-dialog-field">
            <span className="tk-dialog-label">اولویت</span>
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
        </div>
        <DialogFooter className="gap-2 sm:justify-stretch">
          <button
            type="button"
            className="tk-btn-ghost flex-1"
            onClick={() => onOpenChange(false)}
          >
            انصراف
          </button>
          <button type="button" className="tk-btn-primary flex-1" onClick={submit}>
            افزودن
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
