"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { z } from "zod"
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

import {
  incidentTypes,
  incidentStatuses,
  incidentSeverities,
} from "@/types/incident"
import { incidentSchema, type Incident } from "@/schemas/incident-schema"

type IncidentFormData = z.input<typeof incidentSchema>

interface AddIncidentModalProps {
  onAddIncident?: (incident: Incident) => void
  trigger?: React.ReactNode
}

export function AddIncidentModal({
  onAddIncident,
  trigger,
}: AddIncidentModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.incidents)

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<IncidentFormData>({
    id: "",
    code: "",
    type: "",
    severity: "",
    status: "",
    reportDate: new Date(),
    description: "",
    area: undefined,
    reportedBy: undefined,
    involvedPerson: undefined,
    witnesses: undefined,
    immediateAction: "",
    correctiveAction: "",
    medicalAttentionRequired: false,
    createdAt: new Date(),
    updatedAt: undefined,
    updatedBy: undefined,
    images: [],
    attachments: [],
    comments: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const generateIncidentCode = () => {
    const number = Math.floor(Math.random() * 9999) + 1000
    return `INC-${number}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const validatedData = incidentSchema.parse({
        ...formData,
        id: generateIncidentCode(),
        code: generateIncidentCode(),
        createdAt: new Date(),
      })

      const resultAction = await dispatch(createIncident(validatedData))

      if (createIncident.fulfilled.match(resultAction)) {
        toast.success("Incident created successfully")

        setFormData({
          id: "",
          code: "",
          type: "",
          severity: "",
          status: "",
          reportDate: new Date(),
          description: "",
          area: undefined,
          reportedBy: undefined,
          involvedPerson: undefined,
          witnesses: undefined,
          immediateAction: "",
          correctiveAction: "",
          medicalAttentionRequired: false,
          createdAt: new Date(),
          updatedAt: undefined,
          updatedBy: undefined,
          images: [],
          attachments: [],
          comments: [],
        })

        setErrors({})
        setOpen(false)
      }

      if (createIncident.rejected.match(resultAction)) {
        toast.error(resultAction.error.message || "Failed to create incident")
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      id: "",
      code: "",
      type: "",
      severity: "",
      status: "",
      reportDate: new Date(),
      description: "",
      area: undefined,
      reportedBy: undefined,
      involvedPerson: undefined,
      witnesses: undefined,
      immediateAction: "",
      correctiveAction: "",
      medicalAttentionRequired: false,
      createdAt: new Date(),
      updatedAt: undefined,
      updatedBy: undefined,
      images: [],
      attachments: [],
      comments: [],
    })
    setErrors({})
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Add Incident
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Incident</DialogTitle>
          <DialogDescription>
            Fill in the details below to report an incident.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, severity: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {incidentSeverities.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {incidentStatuses.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Create Incident
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}