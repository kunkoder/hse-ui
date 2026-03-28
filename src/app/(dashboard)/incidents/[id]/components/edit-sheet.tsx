"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator";

import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { DateRange } from "react-day-picker"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { addDays, format } from "date-fns"

import { Edit, X, FileText, Image as ImageIcon, Trash2, CalendarIcon } from "lucide-react"
import { toast } from "sonner"

import { z } from "zod"
import { updateIncidentApi, } from "@/store/incident-slice"

import { categories, severities, statuses } from "@/types/incident"
import type { Incident } from "@/schemas/incident-schema"

import {
  useSearchUsersQuery,
  useSearchAreasQuery,
} from "@/store/api-slice"

import { MultiLiveSearch } from "@/components/custom/multi-live-search"
import { SingleLiveSearch } from "@/components/custom/single-live-search"
import { MultiSelect } from "@/components/custom/multi-select"

const incidentFormSchema = z.object({
  id: z.string(),
  reportedAt: z.iso.datetime(),
  category: z.string().min(1, "Category is required"),
  severity: z.string().min(1, "Severity is required"),
  status: z.string().min(1, "Status is required"),
  description: z.string().min(1, "Description is required"),
  immediateAction: z.string().optional(),
  correctiveAction: z.string().optional(),
  medicalAttentionRequired: z.boolean(),
  // Nested relations - store as IDs for form submission
  areaCode: z.string().optional(),
  reportedByEmpId: z.string().optional(),
  involvedPeopleEmpIds: z.array(z.string()).optional(),
  witnessesEmpIds: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof incidentFormSchema>

interface EditSheetProps {
  incident: Incident
}

export function EditSheet({ incident }: EditSheetProps) {
  console.log("saya punya", incident);
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((s: RootState) => s.incidents)

  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state
  const [formData, setFormData] = useState<FormData>({
    id: "",
    reportedAt: "",
    category: "",
    severity: "",
    status: "",
    description: "",
    immediateAction: "",
    correctiveAction: "",
    medicalAttentionRequired: false,
    areaCode: "",
    reportedByEmpId: "",
    involvedPeopleEmpIds: [],
    witnessesEmpIds: [],
  })

  // File upload state (for new files only - existing files shown read-only)
  const [newImages, setNewImages] = useState<File[]>([])
  const [newDocuments, setNewDocuments] = useState<File[]>([])

  // Track existing files from incident (read-only display)
  const existingImages = incident.images?.filter((f) => f.fileType === "IMAGE") || []
  const existingAttachments = incident.attachments?.filter((f) => f.fileType === "DOCUMENT") || []

  // Refs for preview URLs cleanup
  const previewUrlsRef = useRef<string[]>([])

  // Populate form when sheet opens or incident changes
  useEffect(() => {
    if (incident) {
      setFormData({
        id: incident.id,
        reportedAt: incident.reportedAt,
        category: incident.category,
        severity: incident.severity,
        status: incident.status,
        description: incident.description,
        immediateAction: incident.immediateAction || "",
        correctiveAction: incident.correctiveAction || "",
        medicalAttentionRequired: incident.medicalAttentionRequired || false,
        areaCode: incident.area?.code,
        reportedByEmpId: incident.reportedBy?.empId,
        involvedPeopleEmpIds: incident.involvedPeople?.map((p) => p.empId) || [],
        witnessesEmpIds: incident.witnesses?.map((p) => p.empId) || [],
      })
      setErrors({})
      setNewImages([])
      setNewDocuments([])
    }
  }, [incident])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      previewUrlsRef.current = []
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const validated = incidentFormSchema.parse(formData)

      const payload = {
        id: validated.id,
        ...(validated.status && { status: validated.status }),
        ...(validated.category && { category: validated.category }),
        ...(validated.severity && { severity: validated.severity }),
      }

      const result = await dispatch(updateIncidentApi(payload))

      if (updateIncidentApi.fulfilled.match(result)) {
        toast.success("Incident updated successfully")
        setOpen(false)
      }

      if (updateIncidentApi.rejected.match(result)) {
        toast.error(result.error.message || "Failed to update incident")
      }

    } catch (err: any) {
      if (err?.issues) {
        const e: Record<string, string> = {}

        err.issues.forEach((i: any) => {
          if (i.path[0]) e[i.path[0]] = i.message
        })

        setErrors(e)
        toast.error("Please fix validation errors")
      }
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setErrors({})
    setNewImages([])
    setNewDocuments([])
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrlsRef.current = []
  }

  // Image upload handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"))
    setNewImages((prev) => [...prev, ...files])
    // Create preview URLs
    files.forEach((file) => {
      const url = URL.createObjectURL(file)
      previewUrlsRef.current.push(url)
    })
  }

  const handleRemoveNewImage = (index: number) => {
    const removed = newImages[index]
    if (removed) {
      const url = URL.createObjectURL(removed)
      const urlIndex = previewUrlsRef.current.indexOf(url)
      if (urlIndex > -1) {
        URL.revokeObjectURL(url)
        previewUrlsRef.current.splice(urlIndex, 1)
      }
    }
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Document upload handlers
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setNewDocuments((prev) => [...prev, ...files])
  }

  const handleRemoveNewDocument = (index: number) => {
    setNewDocuments((prev) => prev.filter((_, i) => i !== index))
  }

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

        <form className="grid flex-1 auto-rows-min gap-4 px-4">

          <div className="grid gap-2">
            <Label>Report Time *</Label>
            <Input
              type="datetime-local"
              value={formData.reportedAt.slice(0, 16)}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  reportedAt: e.target.value,
                }))
              }
            />
          </div>

          {/* MultiSelects */}
          <div className="grid gap-2">
            <Label>Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(v) =>
                setFormData((p) => ({ ...p, category: v }))
              }
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Severity</Label>
            <Select
              value={formData.severity}
              onValueChange={(v) =>
                setFormData((p) => ({ ...p, severity: v }))
              }
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                {severities.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v) =>
                setFormData((p) => ({ ...p, status: v }))
              }
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
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
              initialValue={incident.area ? `${incident.area.name} (${incident.area.code})` : ""}
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
            initialValues={incident.involvedPeople?.map((w) => w.empId) || []}
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
            initialValues={incident.witnesses?.map((w) => w.empId) || []}
          />

          <div className="grid gap-2">
            <Label>Immediate Action</Label>
            <Textarea
              value={formData.immediateAction}
              onChange={(e) =>
                setFormData((p) => ({ ...p, immediateAction: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Corrective Action</Label>
            <Textarea
              value={formData.correctiveAction}
              onChange={(e) =>
                setFormData((p) => ({ ...p, correctiveAction: e.target.value }))
              }
            />
          </div>

          {/* Medical Action Required */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={formData.medicalAttentionRequired}
              onCheckedChange={(v) =>
                setFormData((p) => ({
                  ...p,
                  medicalAttentionRequired: !!v,
                }))
              }
            />
            <Label>Medical Attention Required</Label>
          </div>

          <div className="grid gap-4">
            {/* Existing Images */}
            {incident.images && incident.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {incident.images.map((file, index) => (
                  <div
                    key={file.id || index}
                    className="relative group border rounded-md overflow-hidden"
                  >
                    <img
                      src={file.filePath} // existing image URL
                      alt={file.fileName || "preview"}
                      className="w-full h-24 object-cover"
                    />
                    {/* Existing images are read-only, so no remove button */}
                  </div>
                ))}
              </div>
            )}

            {/* Newly Uploaded Images */}
            {newImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {newImages.map((file, index) => {
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
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Existing Documents */}
            {incident.attachments && incident.attachments.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {incident.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between border rounded-md px-3 py-2"
                  >
                    <span className="text-sm truncate">{file.fileName}</span>
                    {/* Existing documents read-only */}
                  </div>
                ))}
              </div>
            )}

            {/* Newly Uploaded Documents */}
            {newDocuments.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {newDocuments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-md px-3 py-2"
                  >
                    <span className="text-sm truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </form>


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