"use client"

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { z } from "zod"
import { taskSchema, type Task } from "../app/(dashboard)/incidents/data/schema"
import tasksData from "@/data/tasks.json"
import { toast } from "sonner"

const PAGE_SIZE = 10
const MAX_TASKS = 200

// Simulated database tetap menyimpan semua data, tidak dibatasi MAX_TASKS
let simulatedDB: Task[] = [...tasksData]

// Fetch tasks dengan paging (Load More)
export const fetchTasks = createAsyncThunk<
  { data: Task[]; hasMore: boolean; nextIndex: number },
  { startIndex?: number }
>(
  "tasks/fetchTasks",
  async ({ startIndex = 0 }) => {
    // Simulasi delay API
    await new Promise((res) => setTimeout(res, 300))

    // Ambil slice dari DB sesuai paging
    const sliced = simulatedDB.slice(startIndex, startIndex + PAGE_SIZE)

    return {
      data: z.array(taskSchema).parse(sliced), // Validasi data sesuai schema
      hasMore: startIndex + PAGE_SIZE < simulatedDB.length, // cek apakah masih ada sisa data
      nextIndex: startIndex + PAGE_SIZE, // simpan index berikutnya untuk Load More
    }
  }
)

// Create task baru, tambahkan ke simulatedDB tanpa membatasi MAX_TASKS
export const createTask = createAsyncThunk<Task, Task>(
  "tasks/createTask",
  async (newTask) => {
    await new Promise((res) => setTimeout(res, 200))
    simulatedDB.unshift(newTask) // simpan task baru di depan DB
    return newTask // kembalikan task baru
  }
)

// Update task di simulatedDB
export const updateTaskApi = createAsyncThunk<Task, Task>(
  "tasks/updateTask",
  async (updatedTask) => {
    await new Promise((res) => setTimeout(res, 200))
    const index = simulatedDB.findIndex((t) => t.id === updatedTask.id)
    if (index !== -1) simulatedDB[index] = updatedTask // update DB
    return updatedTask
  }
)

// Delete task dari simulatedDB
export const deleteTaskApi = createAsyncThunk<string, string>(
  "tasks/deleteTask",
  async (taskId) => {
    await new Promise((res) => setTimeout(res, 200))
    simulatedDB = simulatedDB.filter((t) => t.id !== taskId) // hapus task dari DB
    return taskId
  }
)

// State UI (slice)
interface TasksState {
  tasks: Task[] // task yang sedang ditampilkan
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
      state.tasks = [] // reset UI
      state.nextIndex = 0
      state.hasMore = true
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        if (state.loading) return
        state.loading = true // set loading
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        const { data, hasMore, nextIndex } = action.payload

        if (state.nextIndex === 0) {
          state.tasks = data // replace state pertama kali
        } else {
          const existingIds = new Set(state.tasks.map((t) => t.id)) // cek duplikat
          const filtered = data.filter((t) => !existingIds.has(t.id)) // filter duplikat
          state.tasks = [...state.tasks, ...filtered].slice(0, MAX_TASKS) // merge + batasi UI
        }

        state.hasMore = hasMore // update hasMore
        state.nextIndex = nextIndex // update nextIndex
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch tasks" // simpan error
        toast.error(state.error)
      })

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        // tambahkan task baru di depan, batasi UI saja
        state.tasks = [action.payload, ...state.tasks].slice(0, MAX_TASKS)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create task"
        toast.error(state.error)
      })

    // Update task
    builder
      .addCase(updateTaskApi.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) state.tasks[index] = action.payload // update UI
      })
      .addCase(updateTaskApi.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update task"
        toast.error(state.error)
      })

    // Delete task
    builder
      .addCase(deleteTaskApi.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload) // hapus dari UI
      })
      .addCase(deleteTaskApi.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete task"
        toast.error(state.error)
      })
  },
})

export const tasksReducer = tasksSlice.reducer
export const { resetTasks } = tasksSlice.actions