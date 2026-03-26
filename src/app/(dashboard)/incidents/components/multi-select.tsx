"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type MultiSelectProps<T> = {
  placeholder?: string
  options: T[]
  getValue: (item: T) => string
  getLabel: (item: T) => string
}

export function MultiSelect<T>({
  placeholder = "Select...",
  options,
  getValue,
  getLabel,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const ref = useRef<HTMLDivElement>(null)
  
  const handleRemove = (val: string) => {
    const updated = selectedValues.filter((v) => v !== val)
    setSelectedValues(updated)
  }
  
  const handleSelect = (item: T) => {
    const value = getValue(item)
    if (!selectedValues.includes(value)) {
      const updated = [...selectedValues, value]
      setSelectedValues(updated)
    }
    setOpen(false)
  }
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex flex-wrap items-center gap-1.5 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-all focus-within:ring-2 focus-within:ring-ring cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedValues.length > 0
          ? selectedValues.map((val) => {
              const item = options.find((o) => getValue(o) === val)
              return (
                <Badge key={val} variant="outline" className="gap-1">
                  {item ? getLabel(item) : val}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(val)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })
          : <span className="text-muted-foreground">{placeholder}</span>}
      </div>
      
      {open && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          <ScrollArea className="h-full">
            {options.map((item, i) => {
              const value = getValue(item)
              const labelText = getLabel(item)
              const isSelected = selectedValues.includes(value)

              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2 cursor-pointer text-sm hover:bg-accent ${
                    isSelected ? "bg-accent/50" : ""
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <span>{labelText}</span>
                  {isSelected && <X className="h-4 w-4 text-primary" />}
                </div>
              )
            })}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}