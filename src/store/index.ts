"use client"

import { configureStore } from "@reduxjs/toolkit"
import { tasksReducer } from "@/store/task-slice"
import { incidentsReducer } from "@/store/incident-slice"
import { api } from "@/store/api-slice"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    incidents: incidentsReducer,
    [api.reducerPath]: api.reducer, // 👈 add this
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // 👈 add this
})

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch