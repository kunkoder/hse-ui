"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import type { Incident } from "@/schemas/incident-schema"

import {
  incidentTypes,
  incidentStatuses,
  incidentSeverities,
} from "@/types/incident"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

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
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("type") as string
      const config = incidentTypes.find((t) => t.value === value)
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Severity" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("severity") as string
      const config = incidentSeverities.find((s) => s.value === value)
      if (!config) return "-"
      const Icon = config.icon
      return (
        <Badge variant="outline" className="text-xs flex items-center gap-1">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          {config.label}
        </Badge>
      )
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("status") as string
      const config = incidentStatuses.find((s) => s.value === value)
      if (!config) return "-"
      const Icon = config.icon
      return (
        <Badge variant="outline" className="text-xs flex items-center gap-1">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          {config.label}
        </Badge>
      )
    },
  },

  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-sm text-muted-foreground">
        {row.getValue("description") || "-"}
      </div>
    ),
  },

  {
    accessorKey: "reportDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Report Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("reportDate") as Date
      return <div className="text-sm">{date?.toLocaleDateString() || "-"}</div>
    },
  },

  {
    accessorKey: "area",
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Involved" />
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]