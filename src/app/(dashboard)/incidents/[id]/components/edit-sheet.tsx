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
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Edit, X, FileText, Image as ImageIcon, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { z } from "zod"
import { updateIncidentApi, } from "@/store/incident-slice"

import { categories, severities, statuses } from "@/types/incident"
import type { Incident } from "@/schemas/incident-schema"

// Import your search components
// import { SingleLiveSearch, MultiLiveSearch } from "@/components/search"
// import { useSearchAreasQuery, useSearchUsersQuery } from "@/store/api"

const incidentFormSchema = z.object({
  id: z.string(),
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
    if (open && incident) {
      setFormData({
        id: incident.id,
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
  }, [open, incident])

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="cursor-pointer flex items-center gap-1">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto w-full sm:w-[700px] md:w-[900px] lg:w-[1000px]">
        <SheetHeader>
          <SheetTitle>Edit Incident</SheetTitle>
          <SheetDescription>
            Update incident details. Fields marked with * are required.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 px-4 py-4">
          {/* Core Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <Label>Severity *</Label>
              <Select
                value={formData.severity}
                onValueChange={(v) => setFormData((p) => ({ ...p, severity: v }))}
              >
                <SelectTrigger className={errors.severity ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {severities.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.severity && <p className="text-xs text-red-500">{errors.severity}</p>}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className={errors.description ? "border-red-500" : ""}
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Area & Reported By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Area Search */}
            <div className="space-y-2">
              <Label>Area</Label>
              {/* Replace with your actual SingleLiveSearch component */}
              {/* <SingleLiveSearch
                placeholder="Search area..."
                queryHook={useSearchAreasQuery}
                buildQuery={(search) => search}
                getValue={(item) => item.code}
                getLabel={(item) => item.name}
                initialValue={incident.area}
                onSelect={(area) =>
                  setFormData((p) => ({ ...p, areaCode: area?.code }))
                }
              /> */}
              <Input
                placeholder="Area search (integrate SingleLiveSearch)"
                value={formData.areaCode || ""}
                readOnly
                className="bg-muted/50"
              />
              {formData.areaCode && (
                <Badge variant="secondary" className="mt-1">
                  {formData.areaCode}
                </Badge>
              )}
            </div>

            {/* Reported By */}
            <div className="space-y-2">
              <Label>Reported By</Label>
              <Input
                placeholder="Reporter (read-only)"
                value={incident.reportedBy?.name || ""}
                readOnly
                className="bg-muted/50"
              />
              {incident.reportedBy && (
                <Badge variant="secondary" className="mt-1">
                  {incident.reportedBy.empId}
                </Badge>
              )}
            </div>
          </div>

          {/* Involved People */}
          <div className="space-y-2">
            <Label>Involved People</Label>
            {/* Replace with your actual MultiLiveSearch component */}
            {/* <MultiLiveSearch
              placeholder="Search people..."
              queryHook={useSearchUsersQuery}
              buildQuery={(search) => ({ search })}
              getValue={(item) => item.empId}
              getLabel={(item) => item.name}
              initialValues={incident.involvedPeople}
              onChange={(people) =>
                setFormData((p) => ({
                  ...p,
                  involvedPeopleEmpIds: people.map((p) => p.empId),
                }))
              }
            /> */}
            <div className="flex flex-wrap gap-2">
              {formData.involvedPeopleEmpIds?.map((empId) => (
                <Badge key={empId} variant="outline" className="gap-1">
                  {empId}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        involvedPeopleEmpIds: p.involvedPeopleEmpIds?.filter(
                          (id) => id !== empId
                        ),
                      }))
                    }
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="People search (integrate MultiLiveSearch)"
              readOnly
              className="bg-muted/50 mt-2"
            />
          </div>

          {/* Witnesses */}
          <div className="space-y-2">
            <Label>Witnesses</Label>
            {/* Replace with your actual MultiLiveSearch component */}
            <div className="flex flex-wrap gap-2">
              {formData.witnessesEmpIds?.map((empId) => (
                <Badge key={empId} variant="outline" className="gap-1 bg-yellow-50">
                  {empId}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        witnessesEmpIds: p.witnessesEmpIds?.filter(
                          (id) => id !== empId
                        ),
                      }))
                    }
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Witness search (integrate MultiLiveSearch)"
              readOnly
              className="bg-muted/50 mt-2"
            />
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Label>Immediate Action</Label>
            <Textarea
              value={formData.immediateAction}
              onChange={(e) =>
                setFormData((p) => ({ ...p, immediateAction: e.target.value }))
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Corrective Action</Label>
            <Textarea
              value={formData.correctiveAction}
              onChange={(e) =>
                setFormData((p) => ({ ...p, correctiveAction: e.target.value }))
              }
              rows={3}
            />
          </div>

          {/* Medical Attention */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="medical"
              checked={formData.medicalAttentionRequired}
              onCheckedChange={(v) =>
                setFormData((p) => ({
                  ...p,
                  medicalAttentionRequired: !!v,
                }))
              }
            />
            <Label htmlFor="medical">Medical Attention Required</Label>
          </div>

          <Separator />

          {/* Existing Images (Read-only display) */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <Label>Existing Images</Label>
              <div className="grid grid-cols-4 gap-3">
                {existingImages.map((file) => (
                  <div key={file.id} className="relative group border rounded-md overflow-hidden">
                    {/* Use Next.js Image if available, otherwise img tag */}
                    <img
                      src={file.filePath}
                      alt={file.fileName}
                      className="w-full h-20 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-white text-xs truncate px-2">{file.fileName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Upload */}
          <div className="space-y-2">
            <Label>Add New Images</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            {newImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-2">
                {newImages.map((file, index) => {
                  const previewUrl = URL.createObjectURL(file)
                  return (
                    <div
                      key={index}
                      className="relative group border rounded-md overflow-hidden"
                    >
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="w-full h-20 object-cover"
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
          </div>

          {/* Existing Attachments (Read-only display) */}
          {existingAttachments.length > 0 && (
            <div className="space-y-2">
              <Label>Existing Attachments</Label>
              <div className="flex flex-col gap-2">
                {existingAttachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between border rounded-md px-3 py-2 bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-red-100 p-2">
                        <FileText className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={file.filePath} download={file.fileName}>
                        <FileText className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Document Upload */}
          <div className="space-y-2">
            <Label>Add New Documents</Label>
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleDocumentUpload}
              className="cursor-pointer"
            />
            {newDocuments.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {newDocuments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-md px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <SheetFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}