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
import type { Task } from "../data/schema"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { deleteTaskApi } from "@/store/task-slice"
import { toast } from "sonner"

interface DeleteTaskModalProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteTaskModal({ task, open, onOpenChange }: DeleteTaskModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.tasks)

  const handleConfirmDelete = async () => {
    const resultAction = await dispatch(deleteTaskApi(task.id))

    if (deleteTaskApi.fulfilled.match(resultAction)) {
      toast.success("Task deleted successfully")
      onOpenChange(false)
    }

    if (deleteTaskApi.rejected.match(resultAction)) {
      toast.error(resultAction.error.message || "Failed to delete task")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mt-2">
          Are you sure you want to delete the task &quot;{task.title}&quot;? This action cannot be undone.
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