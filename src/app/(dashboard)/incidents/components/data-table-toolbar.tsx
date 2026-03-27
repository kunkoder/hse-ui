"use client"

import type { Table } from "@tanstack/react-table"
import { useState, useMemo } from "react"
import { RefreshCcw, Download, FileText, FileSpreadsheet } from "lucide-react"
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

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { SearchSheet } from "./search-sheet"

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

  const globalFilter = table.getState().globalFilter as string
  const handleExport = (type: "pdf" | "excel") => {
    console.log("Export:", type)
  }

  return (
    <div className="space-y-4">

      {/* Search + Actions */}
      <div className="space-y-2 md:flex md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Quick Filter"
            value={globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="w-[200px] lg:w-[300px]"
          />
          {table.getColumn("severity") && (
            <DataTableFacetedFilter
              column={table.getColumn("severity")}
              title="Severity"
              options={severities}
            />
          )}
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          {table.getColumn("category") && (
            <DataTableFacetedFilter
              column={table.getColumn("category")}
              title="Category"
              options={categories}
            />
          )}
          <Button
            variant="outline"
            onClick={() => {

              table.setGlobalFilter("");

              table.getColumn("severity")?.setFilterValue(undefined);
              table.getColumn("status")?.setFilterValue(undefined);
              table.getColumn("category")?.setFilterValue(undefined);
            }}
            disabled={
              !globalFilter &&
              !table.getColumn("severity")?.getFilterValue() &&
              !table.getColumn("status")?.getFilterValue() &&
              !table.getColumn("category")?.getFilterValue()
            }
            className="px-3 mr-2 lg:mr-0"
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden lg:block">Reset</span>
          </Button>
        </div>


        <div className="flex flex-col gap-2 mt-2 md:flex-row md:mt-0 md:gap-2">
          <DataTableViewOptions table={table} />
          <SearchSheet />
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => handleExport("pdf")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                PDF
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleExport("excel")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
