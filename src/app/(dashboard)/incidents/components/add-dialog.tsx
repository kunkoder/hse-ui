"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { createIncident } from "@/store/incident-slice"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { categories, severities, statuses } from "@/types/incident"
import { incidentSchema, type Incident } from "@/schemas/incident-schema"

import { MultiLiveSearch } from "../../../../components/custom/multi-live-search"
import { SingleLiveSearch } from "../../../../components/custom/single-live-search"

import { useSearchUsersQuery, useSearchAreasQuery } from "@/store/api-slice"

type FormData = {
  category: string
  severity: string
  status: string
  description: string
  reportedAt: Date
  immediateAction?: string
  correctiveAction?: string
  medicalAttentionRequired: boolean
}

export function AddDialog() {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="cursor-pointer">
          <Plus className="w-4 h-4" />
          Add Incident
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Incident</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new incident report.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* REPORT TIME + AREA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="grid gap-2">
              <Label>Report Time *</Label>
              <Input
                type="datetime-local"
                value={form.reportedAt.toISOString().slice(0, 16)}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    reportedAt: new Date(e.target.value),
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Areas</Label>
              <SingleLiveSearch<any>
                placeholder="Search area..."
                queryHook={useSearchAreasQuery}
                buildQuery={(search) => search}
                getValue={(a) => a.code}
                getLabel={(a) => a.name}
                onSelect={(value) => console.log("Selected Area:", value)}
              />
            </div>

          </div>

          {/* CATEGORY + SEVERITY + STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* CATEGORY */}
            <div className="grid gap-2">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, category: v }))
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

            {/* SEVERITY */}
            <div className="grid gap-2">
              <Label>Severity *</Label>
              <Select
                value={form.severity}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, severity: v }))
                }
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severities.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* STATUS */}
            <div className="grid gap-2">
              <Label>Status *</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, status: v }))
                }
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="grid gap-2">
            <Label>Description *</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>

          <MultiLiveSearch<any>
            showLabel={true}
            label="Involved People"
            placeholder="Search person..."
            rangeEnabled={false}
            queryHook={useSearchUsersQuery}
            buildQuery={(search) => ({ search })}
            getValue={(u) => u.empId}
            getLabel={(u) => u.name}
          />

          <MultiLiveSearch<any>
            showLabel={true}
            label="Witnesses"
            placeholder="Search person..."
            rangeEnabled={false}
            queryHook={useSearchUsersQuery}
            buildQuery={(search) => ({ search })}
            getValue={(u) => u.empId}
            getLabel={(u) => u.name}
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}