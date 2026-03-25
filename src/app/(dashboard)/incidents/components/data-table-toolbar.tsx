"use client"

import type { Table } from "@tanstack/react-table"
import { useState, useMemo } from "react"
import { RefreshCcw } from "lucide-react"
import { useDispatch } from "react-redux"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTableViewOptions } from "./data-table-view-options"
import { FilterTask } from "./filter-task"

import {
  categories,
  statuses,
  severities,
} from "@/types/incident"
import { updateIncidentApi } from "@/store/incident-slice"
import type { Task } from "../data/schema"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const dispatch = useDispatch()

  const isFiltered = table.getState().columnFilters.length > 0

  const selectedRows = table.getSelectedRowModel().rows

  const selectedIncidents = useMemo(
    () => selectedRows.map((row) => row.original as Task),
    [selectedRows]
  )

  const [bulkValues, setBulkValues] = useState<{
    status?: string
    category?: string
    severity?: string
  }>({})

  const handleBulkChange = (
    field: "status" | "category" | "severity",
    value: string
  ) => {
    setBulkValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitBulk = () => {
    if (!selectedIncidents.length) return

    const hasChanges =
      bulkValues.status || bulkValues.category || bulkValues.severity

    if (!hasChanges) return

    for (const incident of selectedIncidents) {
      dispatch(
        updateIncidentApi({
          ...incident,
          ...(bulkValues.status && { status: bulkValues.status }),
          ...(bulkValues.category && { category: bulkValues.category }),
          ...(bulkValues.severity && { severity: bulkValues.severity }),
        }) as any
      )
    }

    setBulkValues({})
    table.resetRowSelection()
  }

  const handleFilterChange = (key: string, value: string) => {
    const column = table.getColumn(key)
    column?.setFilterValue(value === "all" ? undefined : value)
  }

  const statusFilter = table.getColumn("status")?.getFilterValue() as string | undefined
  const categoryFilter = table.getColumn("category")?.getFilterValue() as string | undefined
  const severityFilter = table.getColumn("severity")?.getFilterValue() as string | undefined

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Select
          value={statusFilter || "all"}
          onValueChange={(v) => handleFilterChange("status", v)}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                <div className="flex items-center">
                  {s.icon && (
                    <s.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  {s.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter || "all"}
          onValueChange={(v) => handleFilterChange("category", v)}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={severityFilter || "all"}
          onValueChange={(v) => handleFilterChange("severity", v)}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            {severities.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search + Actions */}
      <div className="space-y-2 md:flex md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search Incident"
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="w-[200px] lg:w-[300px]"
          />
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            disabled={!isFiltered}
            className="px-3 mr-2 lg:mr-0"
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden lg:block">Reset</span>
          </Button>
        </div>

        <div className="flex flex-col gap-2 mt-2 md:flex-row md:mt-0 md:gap-2">
          <DataTableViewOptions table={table} />
          <FilterTask />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIncidents.length > 0 && (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 p-3 border rounded-md bg-muted/50">
          <span className="text-sm font-medium">
            {selectedIncidents.length} selected
          </span>

          <Select
            value={bulkValues.status}
            onValueChange={(v) => handleBulkChange("status", v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={bulkValues.category}
            onValueChange={(v) => handleBulkChange("category", v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Update Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={bulkValues.severity}
            onValueChange={(v) => handleBulkChange("severity", v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Update Severity" />
            </SelectTrigger>
            <SelectContent>
              {severities.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleSubmitBulk}
            disabled={
              !bulkValues.status &&
              !bulkValues.category &&
              !bulkValues.severity
            }
            className="w-full md:w-auto cursor-pointer"
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  )
}
