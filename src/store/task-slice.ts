"use client"

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { z } from "zod"
import { taskSchema, type Task } from "../app/(dashboard)/incidents/data/schema"
import tasksData from "@/data/tasks.json"
import { toast } from "sonner"

const PAGE_SIZE = 10
const MAX_TASKS = 200

let simulatedDB: Task[] = [...tasksData]

export const fetchTasks = createAsyncThunk<
  { data: Task[]; hasMore: boolean; nextIndex: number },
  { startIndex?: number }
>("tasks/fetchTasks", async ({ startIndex = 0 }) => {
  await new Promise((res) => setTimeout(res, 300))

  const sliced = simulatedDB.slice(startIndex, startIndex + PAGE_SIZE)

  return {
    data: z.array(taskSchema).parse(sliced),
    hasMore: startIndex + PAGE_SIZE < simulatedDB.length,
    nextIndex: startIndex + PAGE_SIZE,
  }
})

export const createTask = createAsyncThunk<Task, Task>(
  "tasks/createTask",
  async (newTask) => {
    await new Promise((res) => setTimeout(res, 200))
    simulatedDB.unshift(newTask)
    if (simulatedDB.length > MAX_TASKS) {
      simulatedDB = simulatedDB.slice(0, MAX_TASKS)
    }
    return newTask
  }
)

export const updateTaskApi = createAsyncThunk<Task, Task>(
  "tasks/updateTask",
  async (updatedTask) => {
    await new Promise((res) => setTimeout(res, 200))
    const index = simulatedDB.findIndex((t) => t.id === updatedTask.id)
    if (index !== -1) simulatedDB[index] = updatedTask
    return updatedTask
  }
)

export const deleteTaskApi = createAsyncThunk<string, string>(
  "tasks/deleteTask",
  async (taskId) => {
    await new Promise((res) => setTimeout(res, 200))
    simulatedDB = simulatedDB.filter((t) => t.id !== taskId)
    return taskId
  }
)

interface TasksState {
  tasks: Task[]
  loading: boolean
  error: string | null
  hasMore: boolean
  nextIndex: number
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  hasMore: true,
  nextIndex: 0,
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    resetTasks: (state) => {
      state.tasks = []
      state.nextIndex = 0
      state.hasMore = true
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        if (state.loading) return
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false

        const { data, hasMore, nextIndex } = action.payload

        if (state.nextIndex === 0) {
          state.tasks = data
        } else {
          const existingIds = new Set(state.tasks.map((t) => t.id))
          const filtered = data.filter((t) => !existingIds.has(t.id))
          state.tasks = [...state.tasks, ...filtered].slice(0, MAX_TASKS)
        }

        state.hasMore = hasMore
        state.nextIndex = nextIndex
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch tasks"
        toast.error(state.error)
      })

    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = [action.payload, ...state.tasks].slice(0, MAX_TASKS)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create task"
        toast.error(state.error)
      })

    builder
      .addCase(updateTaskApi.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
      })
      .addCase(updateTaskApi.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update task"
        toast.error(state.error)
      })

    builder
      .addCase(deleteTaskApi.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload)
      })
      .addCase(deleteTaskApi.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete task"
        toast.error(state.error)
      })
  },
})

export const tasksReducer = tasksSlice.reducer
export const { resetTasks } = tasksSlice.actions