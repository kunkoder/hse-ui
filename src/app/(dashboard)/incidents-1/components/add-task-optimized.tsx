"use client"

import { useReducer, useState } from "react"
import { Plus } from "lucide-react"
import { z } from "zod"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { createTask } from "@/store/task-slice"

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

import { priorities, statuses, categories } from "../data/data"
import { taskSchema, type Task } from "../data/schema"

//
// ===============================
// 1. FORM SCHEMA (reuse + omit id)
// ===============================
//
const taskFormSchema = taskSchema.omit({ id: true })

type TaskFormData = z.infer<typeof taskFormSchema>

//
// ===============================
// 2. INITIAL STATE
// ===============================
//
const initialForm: TaskFormData = {
  title: "",
  description: "",
  status: "todo",
  category: "feature",
  priority: "normal",
}

//
// ===============================
// 3. REDUCER
// ===============================
//
type Action =
  | { type: "SET_FIELD"; field: keyof TaskFormData; value: string }
  | { type: "RESET" }
  | { type: "SET_ERRORS"; errors: Record<string, string> }

function formReducer(state: TaskFormData, action: Action): TaskFormData {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }

    case "RESET":
      return initialForm

    default:
      return state
  }
}

//
// ===============================
// 4. COMPONENT
// ===============================
//
export function AddTaskModal() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.tasks)

  const [open, setOpen] = useState(false)
  const [formData, dispatchForm] = useReducer(formReducer, initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  //
  // ===============================
  // 5. GENERATE ID
  // ===============================
  //
  const generateTaskId = () => {
    return `TASK-${Math.floor(Math.random() * 9999)}`
  }

  //
  // ===============================
  // 6. HANDLE SUBMIT
  // ===============================
  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // STEP 1: validate form (tanpa id)
      const validated = taskFormSchema.parse(formData)

      // STEP 2: tambah id
      const newTask: Task = {
        ...validated,
        id: generateTaskId(),
      }

      // STEP 3: dispatch ke redux
      const result = await dispatch(createTask(newTask))

      // STEP 4: success
      if (createTask.fulfilled.match(result)) {
        toast.success("Task created successfully")

        dispatchForm({ type: "RESET" }) // reset form
        setErrors({})
        setOpen(false)
      }

      // STEP 5: error dari redux
      if (createTask.rejected.match(result)) {
        toast.error(result.error.message || "Failed to create task")
      }
    } catch (err) {
      // STEP 6: error dari Zod
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}

        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message
          }
        })

        setErrors(fieldErrors)
      }
    }
  }

  //
  // ===============================
  // 7. HANDLE CANCEL
  // ===============================
  //
  const handleCancel = () => {
    dispatchForm({ type: "RESET" })
    setErrors({})
    setOpen(false)
  }

  //
  // ===============================
  // 8. UI
  // ===============================
  //
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>Create new task</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* TITLE */}
          <div>
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                dispatchForm({
                  type: "SET_FIELD",
                  field: "title",
                  value: e.target.value,
                })
              }
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                dispatchForm({
                  type: "SET_FIELD",
                  field: "description",
                  value: e.target.value,
                })
              }
            />
          </div>

          {/* STATUS */}
          <Select
            value={formData.status}
            onValueChange={(value) =>
              dispatchForm({
                type: "SET_FIELD",
                field: "status",
                value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* CATEGORY */}
          <Select
            value={formData.category}
            onValueChange={(value) =>
              dispatchForm({
                type: "SET_FIELD",
                field: "category",
                value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* PRIORITY */}
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              dispatchForm({
                type: "SET_FIELD",
                field: "priority",
                value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ACTION */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}