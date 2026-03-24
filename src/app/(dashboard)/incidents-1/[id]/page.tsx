"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { fetchTasks } from "../../../../store/task-slice"
import type { tasksReducer } from "../../../../store/task-slice"

// ✅ Infer state type from reducer (no RootState needed)
type TasksState = ReturnType<typeof tasksReducer>

export default function TaskDetailPage() {
  const params = useParams()
  const id = params.id as string

  const dispatch = useDispatch()

  // ✅ safely access your slice
  const { tasks, loading } = useSelector(
    (state: { tasks: TasksState }) => state.tasks
  )

  const task = tasks.find((t) => t.id === id)

  // ✅ Auto fetch if empty (your requested fix)
  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(fetchTasks({ startIndex: 0 }) as any)
    }
  }, [tasks.length, dispatch])

  // ✅ Loading state
  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  // ✅ Not found
  if (!task) {
    return <div className="p-6">Task not found.</div>
  }

  // ✅ Success
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{task.title}</h1>

      <div className="space-y-2 text-sm">
        <p><strong>ID:</strong> {task.id}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Category:</strong> {task.category}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
      </div>
    </div>
  )
}