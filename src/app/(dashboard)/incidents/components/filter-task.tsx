import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

import { Search, User, Filter, Wrench, CheckCircle2, Eraser, SlidersHorizontal, X, CalendarIcon } from "lucide-react"

import { SingleLiveSearch } from "./single-live-search"
import { MultiLiveSearch } from "./multi-live-search"
import { MultiSelect } from "./multi-select"

import { priorities, statuses, categories } from "../data/data"

import {
  useSearchUsersQuery,
  useSearchEquipmentQuery,
  useSearchAreasQuery,
  useSearchWorkItemsQuery,
} from "@/store/api-slice"

interface User {
  empId: string
  name: string
}

interface Equipment {
  code: string
  name: string
}

interface Area {
  code: string
  name: string
}

interface WorkItem {
  code: string
  title: string
  description?: string
}

export function FilterTask() {
  const [images, setImages] = useState<File[]>([])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files])
  }

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          {/* Name */}
          <div className="grid gap-3">
            <Label>Name</Label>
            <Input defaultValue="Pedro Duarte" />
          </div>

          {/* Username */}
          <div className="grid gap-3">
            <Label>Username</Label>
            <Input defaultValue="@peduarte" />
          </div>

          {/* Image Upload */}
          <div className="grid gap-3">
            <Label>Upload Images</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="cursor-pointer"
            />

            {/* Preview */}
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

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
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

          <div className="grid gap-3">
            <Label>Equipment</Label>
            <SingleLiveSearch<Equipment>
              placeholder="Search equipment..."
              queryHook={useSearchEquipmentQuery}
              buildQuery={(search) => search}
              getValue={(eq) => eq.code}
              getLabel={(eq) => `${eq.code} - ${eq.name}`}
              onSelect={(value) => console.log("Selected Equipment:", value)}
              renderItem={(eq) => (
                <div className="flex flex-col">
                  <span className="font-medium">{eq.name}</span>
                  <span className="text-xs text-muted-foreground">{eq.code}</span>
                </div>
              )}
            />
          </div>

          {/* ========================= */}
          {/* Users (All) */}
          {/* ========================= */}
          <div className="grid gap-3">
            <Label>Users (All)</Label>
            <SingleLiveSearch<any>
              placeholder="Search all users..."
              queryHook={useSearchUsersQuery}
              buildQuery={(search) => ({ search })} // no department → all users
              getValue={(u) => u.empId}
              getLabel={(u) => `${u.empId} - ${u.name}`}
              onSelect={(value, u) => console.log("Selected User:", value, u)}
              renderItem={(u) => (
                <div className="flex flex-col">
                  <span>{u.name}</span>
                  <span className="text-xs text-muted-foreground">{u.empId}</span>
                </div>
              )}
            />
          </div>

          {/* ========================= */}
          {/* Users (Maintenance) */}
          {/* ========================= */}
          <div className="grid gap-3">
            <Label>Users (Maintenance)</Label>
            <SingleLiveSearch<any>
              placeholder="Search maintenance users..."
              queryHook={useSearchUsersQuery}
              buildQuery={(search) => ({ search, department: "maintenance" })} // department filter
              getValue={(u) => u.empId}
              getLabel={(u) => `${u.empId} - ${u.name}`}
              onSelect={(value, u) => console.log("Selected Maintenance User:", value, u)}
              renderItem={(u) => (
                <div className="flex flex-col">
                  <span>{u.name}</span>
                  <span className="text-xs text-muted-foreground">{u.empId}</span>
                </div>
              )}
            />
          </div>

          <div className="grid gap-3">
            <Label>Areas</Label>
            <SingleLiveSearch<Area>
              placeholder="Search areas..."
              queryHook={useSearchAreasQuery}
              buildQuery={(search) => search}
              getValue={(a) => a.code}
              getLabel={(a) => `${a.code} - ${a.name}`}
              onSelect={(value) => console.log("Selected Area:", value)}
              renderItem={(a) => (
                <div className="flex flex-col">
                  <span>{a.name}</span>
                  <span className="text-xs">{a.code}</span>
                </div>
              )}
            />
          </div>

          <div className="grid gap-3">
            <Label>Work Items (Complaint)</Label>
            <SingleLiveSearch<WorkItem>
              placeholder="Search complaint work items..."
              queryHook={useSearchWorkItemsQuery}
              buildQuery={(search) => ({ search, type: "complaint" })}
              getValue={(item) => item.code}
              getLabel={(item) => `${item.code} - ${item.title}`}
              onSelect={(value) => console.log("Selected Complaint:", value)}
              renderItem={(item) => (
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.code}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid gap-3">
            <Label>Work Items (Report)</Label>
            <SingleLiveSearch<WorkItem>
              placeholder="Search report work items..."
              queryHook={useSearchWorkItemsQuery}
              buildQuery={(search) => ({ search, type: "report" })}
              getValue={(item) => item.code}
              getLabel={(item) => `${item.code} - ${item.title}`}
              onSelect={(value) => console.log("Selected Report:", value)}
              renderItem={(item) => (
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.code}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid gap-3">
            <Label>Work Items (Task)</Label>
            <SingleLiveSearch<WorkItem>
              placeholder="Search task work items..."
              queryHook={useSearchWorkItemsQuery}
              buildQuery={(search) => ({ search, type: "task" })}
              getValue={(item) => item.code}
              getLabel={(item) => `${item.code} - ${item.title}`}
              onSelect={(value) => console.log("Selected Task:", value)}
              renderItem={(item) => (
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.code}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid gap-3">
            <MultiLiveSearch<any>
              label="Equipments"
              placeholder="Search equipment..."
              rangeEnabled={true}
              queryHook={useSearchEquipmentQuery}
              buildQuery={(search) => search}
              getValue={(eq) => eq.code}
              getLabel={(eq) => `${eq.code} - ${eq.name}`}
            />
          </div>

          <div className="grid gap-3">
            <MultiSelect
              label="Category"
              placeholder="Select category..."
              options={categories}
              getValue={(item) => item.value}
              getLabel={(item) => item.label}
            />
          </div>

        </div>


        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
