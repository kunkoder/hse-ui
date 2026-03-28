"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import type { Incident } from "@/schemas/incident-schema"

import {
  categories,
  statuses,
  severities,
} from "@/types/incident"

import { DataTableColumnHeader } from "./data-table-column-header"

const formatDateTime = (date?: Date) => {
  if (!date) return "-"

  const d = new Date(date)

  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()

  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")

  return `${day}-${month}-${year} ${hours}:${minutes}`
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    title?: string
  }
}

export const columns: ColumnDef<Incident>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        className="cursor-pointer"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "code",
    meta: {
      title: "Code",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => (
      <div className="text-xs font-bold">
        {row.getValue("code")}
      </div>
    ),
  },

  {
    accessorKey: "category",
    meta: {
      title: "Category",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Category"} />
    ),
    cell: ({ row }) => {
      const value = row.getValue("category") as string
      const config = categories.find((c) => c.value === value)
      if (!config) return null
      return (
        <div className="flex items-center gap-2">
          <config.icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs">{config.label}</span>
        </div>
      )
    },
  },

  {
    accessorKey: "severity",
    meta: {
      title: "Severity",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Severity" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("severity") as string
      const config = severities.find((s) => s.value === value)

      if (!config) return "-"

      return (
        <Badge
          variant="outline"
          className={`text-xs ${config.color}`}
        >
          {config.label}
        </Badge>
      )
    },
  },

  {
    accessorKey: "status",
    meta: {
      title: "Status",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("status") as string
      const config = statuses.find((s) => s.value === value)

      if (!config) return "-"

      return (
        <Badge
          variant="outline"
          className="text-xs"
        >
          {config.label}
        </Badge>
      )
    },
  },

  {
    accessorKey: "description",
    meta: {
      title: "Description",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-xs text-muted-foreground">
        {row.getValue("description") || "-"}
      </div>
    ),
  },

  {
    accessorKey: "reportedAt",
    meta: {
      title: "Report Time",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Report Time" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("reportedAt") as Date | undefined

      return (
        <div className="text-xs text-muted-foreground">
          {formatDateTime(date)}
        </div>
      )
    },
  },

  {
    accessorKey: "area",
    meta: {
      title: "Area",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Area" />
    ),
    cell: ({ row }) => {
      const area = row.getValue("area") as
        | { code: string; name: string }
        | undefined

      if (!area) return "-"

      return (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{area.name}</span>
          <span className="text-muted-foreground">{area.code}</span>
        </div>
      )
    },
  },

  {
    accessorKey: "reportedBy",
    meta: {
      title: "Reported By",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reported By" />
    ),
    cell: ({ row }) => {
      const user = row.getValue("reportedBy") as
        | { empId: string; name: string }
        | undefined

      if (!user) return "-"

      return (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{user.name}</span>
          <span className="text-muted-foreground">{user.empId}</span>
        </div>
      )
    },
  },

  {
    accessorKey: "involvedPeople",
    meta: {
      title: "Involved People",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Involved People" />
    ),
    cell: ({ row }) => {
      const people = row.getValue("involvedPeople") as
        | { empId: string; name: string }[]
        | undefined

      if (!people?.length) return "-"

      return (
        <div className="flex flex-wrap gap-1">
          {people.map((p, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {p.name} ({p.empId})
            </Badge>
          ))}
        </div>
      )
    },
  },

  {
    accessorKey: "witnesses",
    meta: {
      title: "Witnesses",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Witnesses" />
    ),
    cell: ({ row }) => {
      const people = row.getValue("witnesses") as
        | { empId: string; name: string }[]
        | undefined

      if (!people?.length) return "-"

      return (
        <div className="flex flex-wrap gap-1">
          {people.map((p, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {p.name} ({p.empId})
            </Badge>
          ))}
        </div>
      )
    },
  },

  {
    accessorKey: "immediateAction",
    meta: {
      title: "Immediate Action",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Immediate Action" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-xs text-muted-foreground">
        {row.getValue("immediateAction") || "-"}
      </div>
    ),
  },

  {
    accessorKey: "correctiveAction",
    meta: {
      title: "Corrective Action",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Corrective Action" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-xs text-muted-foreground">
        {row.getValue("correctiveAction") || "-"}
      </div>
    ),
  },

  {
    accessorKey: "medicalAttentionRequired",
    meta: {
      title: "Medical Requirement",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medical Requirement" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("medicalAttentionRequired") as boolean

      return (
        <Badge
          variant={value ? "destructive" : "secondary"}
          className="text-xs"
        >
          {value ? "Yes" : "No"}
        </Badge>
      )
    },
  },

  {
    accessorKey: "createdAt",
    meta: {
      title: "Creation Time",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creation Time" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return (
        <div className="text-xs text-muted-foreground">
          {formatDateTime(date)}
        </div>
      )
    },
  },

  {
    accessorKey: "updatedAt",
    meta: {
      title: "Update Time",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Update Time" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date | undefined

      return (
        <div className="text-xs text-muted-foreground">
          {formatDateTime(date)}
        </div>
      )
    },
  },

  {
    accessorKey: "updatedBy",
    meta: {
      title: "Updated by",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => {
      const user = row.getValue("updatedBy") as
        | { empId: string; name: string }
        | undefined

      if (!user) return "-"

      return (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{user.name}</span>
          <span className="text-muted-foreground">{user.empId}</span>
        </div>
      )
    },
  },
]