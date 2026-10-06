import { arrayMove } from "@dnd-kit/sortable"

import type { Task, TaskStatus } from "@/lib/mock/tasks"
import { taskStatuses } from "@/lib/mock/tasks"

export function columnId(status: TaskStatus) {
  return `col:${status}`
}

export function parseColumnId(id: string | number): TaskStatus | null {
  const value = String(id)
  if (!value.startsWith("col:")) return null
  const status = value.slice(4) as TaskStatus
  return taskStatuses.includes(status) ? status : null
}

export function findTaskContainer(
  taskId: string,
  items: Task[]
): TaskStatus | null {
  return items.find((task) => task.id === taskId)?.status ?? null
}

export function tasksInStatus(items: Task[], status: TaskStatus) {
  return items.filter((task) => task.status === status)
}

/** Rebuild full list preserving relative order of untouched statuses. */
export function moveTaskInBoard(
  items: Task[],
  activeId: string,
  overId: string | number,
  overContainer: TaskStatus
): Task[] {
  const activeTask = items.find((task) => task.id === activeId)
  if (!activeTask) return items

  const overTaskId =
    parseColumnId(overId) === null && String(overId) !== activeId
      ? String(overId)
      : null

  const withoutActive = items.filter((task) => task.id !== activeId)
  const nextTask: Task = {
    ...activeTask,
    status: overContainer,
    progress:
      overContainer === "تکمیل‌شده"
        ? 100
        : overContainer === "جدید"
          ? Math.min(activeTask.progress, 15)
          : activeTask.progress,
  }

  const columnTasks = tasksInStatus(withoutActive, overContainer)
  let insertIndex = columnTasks.length

  if (overTaskId) {
    const idx = columnTasks.findIndex((t) => t.id === overTaskId)
    if (idx >= 0) insertIndex = idx
  }

  const nextColumn = [
    ...columnTasks.slice(0, insertIndex),
    nextTask,
    ...columnTasks.slice(insertIndex),
  ]

  const result: Task[] = []
  for (const status of taskStatuses) {
    if (status === overContainer) result.push(...nextColumn)
    else result.push(...tasksInStatus(withoutActive, status))
  }
  return result
}

export function reorderWithinColumn(
  items: Task[],
  status: TaskStatus,
  activeId: string,
  overId: string
): Task[] {
  const column = tasksInStatus(items, status)
  const oldIndex = column.findIndex((t) => t.id === activeId)
  const newIndex = column.findIndex((t) => t.id === overId)
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return items

  const reordered = arrayMove(column, oldIndex, newIndex)
  const result: Task[] = []
  for (const s of taskStatuses) {
    if (s === status) result.push(...reordered)
    else result.push(...tasksInStatus(items, s))
  }
  return result
}
