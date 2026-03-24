"use client"

import { createApi } from "@reduxjs/toolkit/query/react"

// Mock Data Imports
import users from "@/data/users.json"
import maintenanceUsers from "@/data/maintenance-users.json"
import equipments from "@/data/equipments.json"
import areas from "@/data/areas.json"
import ComplaintWorkItems from "@/data/complaint-work-items.json"
import ReportWorkItems from "@/data/report-work-items.json"
import TaskWorkItems from "@/data/task-work-items.json"

// Types
type WorkItemType = "complaint" | "report" | "task"
type UserDepartment = "maintenance" // extendable

// Helpers
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))
const includes = (value: string, search: string) =>
  value.toLowerCase().includes(search.toLowerCase())
const dedupeBy = (arr: any[], key: string) => {
  const map = new Map()
  arr.forEach((item) => map.set(item[key], item))
  return Array.from(map.values())
}

// API
export const api = createApi({
  reducerPath: "api",
  baseQuery: async () => ({ data: null }),
  keepUnusedDataFor: 60 * 30, // cache for 30 minutes
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,

  endpoints: (builder) => ({
    // USERS (all or by department)
    searchUsers: builder.query<
      any[],
      { search: string; department?: UserDepartment }
    >({
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        queryArgs.department ? `${endpointName}-${queryArgs.department}` : endpointName,

      merge: (_, newItems) => newItems,

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.department !== previousArg?.department
      },

      async queryFn({ search, department }) {
        await delay(300)
        let source: any[] = users
        if (department === "maintenance") source = maintenanceUsers
        const filtered = source.filter((u: any) => includes(u.name, search))
        return {
          data: filtered.map((u: any) => ({
            empId: u.empId,
            name: u.name,
          })), // return minimal fields only
        }
      },
    }),

    // EQUIPMENT
    searchEquipment: builder.query<any[], string>({
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (_, newItems) => newItems,
      forceRefetch: () => false,
      async queryFn(search) {
        await delay(300)
        const filtered = equipments.filter(
          (eq: any) => includes(eq.name, search) || includes(eq.code, search)
        )
        return { data: filtered.map((eq: any) => ({ code: eq.code, name: eq.name })) }
      },
    }),

    // AREAS
    searchAreas: builder.query<any[], string>({
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (_, newItems) => newItems,
      forceRefetch: () => false,
      async queryFn(search) {
        await delay(300)
        const filtered = areas.filter(
          (a: any) => includes(a.name, search) || includes(a.code, search)
        )
        return { data: filtered.map((a: any) => ({ code: a.code, name: a.name })) }
      },
    }),

    // WORK ITEMS
    searchWorkItems: builder.query<any[], { type: WorkItemType; search: string }>({
      serializeQueryArgs: ({ endpointName, queryArgs }) => `${endpointName}-${queryArgs.type}`,
      merge: (_, newItems) => newItems,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.type !== previousArg?.type
      },
      async queryFn({ type, search }) {
        await delay(300)
        let source: any[] = []
        if (type === "complaint") source = ComplaintWorkItems
        if (type === "report") source = ReportWorkItems
        if (type === "task") source = TaskWorkItems
        const filtered = source.filter(
          (item: any) =>
            includes(item.title, search) || includes(item.code, search) || (item.description && includes(item.description, search))
        )
        return {
          data: filtered.map((item: any) => ({
            code: item.code,
            title: item.title,
            description: item.description,
          })), // minimal fields
        }
      },
    }),
  }),
})

// Hooks
export const {
  useSearchUsersQuery,
  useSearchEquipmentQuery,
  useSearchAreasQuery,
  useSearchWorkItemsQuery,
} = api