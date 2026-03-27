"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Incident } from "@/schemas/incident-schema"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { deleteIncidentApi } from "@/store/incident-slice"
import { toast } from "sonner"

interface DeleteDialogProps {
  incident: Incident
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteDialog({ incident, open, onOpenChange }: DeleteDialogProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.incidents)

  const handleConfirmDelete = async () => {
    const resultAction = await dispatch(deleteIncidentApi(incident.id))

    if (deleteIncidentApi.fulfilled.match(resultAction)) {
      toast.success("Incident deleted successfully")
      onOpenChange(false)
    }

    if (deleteIncidentApi.rejected.match(resultAction)) {
      toast.error(resultAction.error.message || "Failed to delete incident")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Delete Incident</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mt-2">
          Are you sure you want to delete the incident &quot;{incident.code}&quot;? This action cannot be undone.
        </p>

        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete} disabled={loading}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}