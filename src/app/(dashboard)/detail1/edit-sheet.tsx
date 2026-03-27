import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { createIncident } from "@/store/incident-slice"
import { incidentSchema, type Incident } from "@/schemas/incident-schema"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { toast } from "sonner"

import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Search, User, Filter, Wrench, CheckCircle2, Eraser, SlidersHorizontal, X, CalendarIcon, Edit } from "lucide-react"

import { SingleLiveSearch } from "../../../components/custom/single-live-search"
import { MultiLiveSearch } from "../../../components/custom/multi-live-search"
import { MultiSelect } from "../../../components/custom/multi-select"

import { categories, severities, statuses } from "@/types/incident"

import { addDays, format } from "date-fns"

import {
  useSearchUsersQuery,
  useSearchEquipmentQuery,
  useSearchAreasQuery,
  useSearchWorkItemsQuery,
} from "@/store/api-slice"

import { DateRange } from "react-day-picker"

export function EditSheet() {

  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((s: RootState) => s.incidents)

  const [open, setOpen] = useState(false)

  const [form, setForm] = useState<FormData>({
    category: "",
    severity: "",
    status: "",
    description: "",
    reportedAt: new Date(),
    immediateAction: "",
    correctiveAction: "",
    medicalAttentionRequired: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    try {
      const validated = incidentSchema.parse(form)

      const newIncident: Incident = {
        ...validated,
        id: `INC-${Math.floor(Math.random() * 9999)}`,
        code: `INC-${Math.floor(Math.random() * 9999)}`,

        reportedAt: new Date().toISOString(),

        area: undefined,
        reportedBy: undefined,
        involvedPeople: undefined,
        witnesses: undefined,

        createdAt: new Date().toISOString(),
        updatedAt: undefined,
        updatedBy: undefined,

        images: [],
        attachments: [],
        comments: [],
      }

      const result = await dispatch(createIncident(newIncident))

      if (createIncident.fulfilled.match(result)) {
        toast.success("Incident reported")

        setForm({
          category: "",
          severity: "",
          status: "",
          description: "",
          reportedAt: new Date(),
          immediateAction: "",
          correctiveAction: "",
          medicalAttentionRequired: false,
        })

        setErrors({})
        setOpen(false)
      }

      if (createIncident.rejected.match(result)) {
        toast.error("Failed to create incident")
      }
    } catch (err: any) {
      if (err?.issues) {
        const e: Record<string, string> = {}
        err.issues.forEach((i: any) => {
          if (i.path[0]) e[i.path[0]] = i.message
        })
        setErrors(e)
      }
    }
  }

  const [images, setImages] = useState<File[]>([])
  const [documents, setDocuments] = useState<File[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files])
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setDocuments((prev) => [...prev, ...files])
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const [keyword, setKeyword] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Edit className="h-4 w-4" />
          <span>Edit</span>
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
          <div className="grid gap-2">
            <Label>Keyword</Label>
            <Input
              placeholder="Enter keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* Date Range Picker */}
          <Field className="w-full grid gap-2">
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
          <div className="grid gap-2">
            <Label>Category</Label>
            <MultiSelect
              placeholder="Select category..."
              options={categories}
              getValue={(item) => item.value}
              getLabel={(item) => item.label}
            />
          </div>

          <div className="grid gap-2">
            <Label>Severity</Label>
            <MultiSelect
              placeholder="Select severity..."
              options={severities}
              getValue={(item) => item.value}
              getLabel={(item) => item.label}
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <MultiSelect
              placeholder="Select status..."
              options={statuses}
              getValue={(item) => item.value}
              getLabel={(item) => item.label}
            />
          </div>

          <div className="grid gap-2">
                      <Label>Description *</Label>
                      <Textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, description: e.target.value }))
                        }
                      />
                    </div>

          {/* SingleLiveSearch for Area */}
          <div className="grid gap-2">
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

          {/* MultiLiveSearch for Witnesses */}
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

            <div className="grid gap-2">
            <Label>Immediate Action</Label>
            <Textarea
              value={form.immediateAction}
              onChange={(e) =>
                setForm((p) => ({ ...p, immediateAction: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Corrective Action</Label>
            <Textarea
              value={form.correctiveAction}
              onChange={(e) =>
                setForm((p) => ({ ...p, correctiveAction: e.target.value }))
              }
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

          <div className="grid gap-4">
            {/* IMAGE UPLOAD */}
            <div className="grid gap-2">
              <Label>Incident Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {images.map((file, index) => {
                    const previewUrl = URL.createObjectURL(file)

                    return (
                      <div
                        key={index}
                        className="relative group border rounded-md overflow-hidden"
                      >
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="w-full h-24 object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* DOCUMENT UPLOAD */}
            <div className="grid gap-2">
              <Label>Supporting Documents</Label>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={handleDocumentUpload}
                className="cursor-pointer"
              />

              {documents.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {documents.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-md px-3 py-2"
                    >
                      <span className="text-sm truncate">{file.name}</span>

                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
