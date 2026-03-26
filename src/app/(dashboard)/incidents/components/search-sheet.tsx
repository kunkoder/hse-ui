import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Search, User, Filter, Wrench, CheckCircle2, Eraser, SlidersHorizontal, X, CalendarIcon } from "lucide-react"

import { SingleLiveSearch } from "./single-live-search"
import { MultiLiveSearch } from "./multi-live-search"
import { MultiSelect } from "./multi-select"

import { categories, severities, statuses } from "@/types/incident"

import { addDays, format } from "date-fns"

import {
  useSearchUsersQuery,
  useSearchEquipmentQuery,
  useSearchAreasQuery,
  useSearchWorkItemsQuery,
} from "@/store/api-slice"

import { DateRange } from "react-day-picker"

export function SearchSheet() {

  const [keyword, setKeyword] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  const [form, setForm] = useState({
    medicalAttentionRequired: false,
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Search Reports</SheetTitle>
          <SheetDescription>
            Use the form below to search incidents with keywords, date range, categories, and more.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-4 px-4">

          {/* Keyword Search */}
          <div className="grid gap-3">
            <Label>Keyword</Label>
            <Input
              placeholder="Enter keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* Date Range Picker */}
          <Field className="w-full">
            <FieldLabel htmlFor="date-picker-range">Report Time</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker-range"
                  className="justify-start px-2.5 font-normal w-full"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from
                    ? dateRange.to
                      ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                      : format(dateRange.from, "LLL dd, y")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </Field>

          {/* MultiSelects */}
          <div className="grid gap-3">
            <Label>Category</Label>
            <MultiSelect
              placeholder="Select category..."
              options={categories}
              getValue={(item) => item.value}
              getLabel={(item) => item.label}
            />
          </div>

          <div className="grid gap-3">
            <Label>Severity</Label>
            <MultiSelect
              placeholder="Select severity..."
              options={severities}
              getValue={(item) => item.value}
              getLabel={(item) => item.label}
            />
          </div>

          <div className="grid gap-3">
            <Label>Status</Label>
            <MultiSelect
              placeholder="Select status..."
              options={statuses}
              getValue={(item) => item.value}
              getLabel={(item) => item.label}
            />
          </div>

          {/* SingleLiveSearch for Area */}
          <div className="grid gap-3">
            <Label>Area</Label>
            <SingleLiveSearch<any>
              placeholder="Search area..."
              queryHook={useSearchAreasQuery}
              buildQuery={(search) => search}
              getValue={(item) => item.code}
              getLabel={(item) => item.name}
              onSelect={(value) => console.log("Selected Area:", value)}
            />
          </div>

          {/* MultiLiveSearch for Involved People */}
          <div className="grid gap-3">
            <MultiLiveSearch<any>
              showLabel={true}
              label="Involved People"
              placeholder="Search person..."
              rangeEnabled={false}
              queryHook={useSearchUsersQuery}
              buildQuery={(search) => ({ search })}
              getValue={(item) => item.empId}
              getLabel={(item) => item.name}
            />
          </div>

          {/* MultiLiveSearch for Witnesses */}
          <div className="grid gap-3">
            <MultiLiveSearch<any>
              showLabel={true}
              label="Witnesses"
              placeholder="Search person..."
              rangeEnabled={false}
              queryHook={useSearchUsersQuery}
              buildQuery={(search) => ({ search })}
              getValue={(item) => item.empId}
              getLabel={(item) => item.name}
            />
          </div>

          {/* Medical Action Required */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.medicalAttentionRequired}
              onCheckedChange={(v) =>
                setForm((p) => ({
                  ...p,
                  medicalAttentionRequired: !!v,
                }))
              }
            />
            <Label>Medical Attention Required</Label>
          </div>

        </div>


        <SheetFooter>
          <Button type="submit">Search</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
