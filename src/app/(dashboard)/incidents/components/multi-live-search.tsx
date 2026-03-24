"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Check, Code } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

type MultiLiveSearchProps<T> = {
  label?: string
  placeholder?: string
  rangePlaceholder?: string
  rangeEnabled?: boolean
  queryHook: (args: any, options?: { skip?: boolean }) => { data?: T[]; isLoading: boolean }
  buildQuery: (search: string) => any
  getValue: (item: T) => string
  getLabel?: (item: T) => string
  renderItem?: (item: T) => React.ReactNode
  onChange?: (values: string[]) => void
}

const expandRange = (input: string): string[] => {
  const simple = input.match(/^([A-Z]+-)(\d+)-(\d+)$/)
  if (simple) {
    const [, prefix, startStr, endStr] = simple
    const start = parseInt(startStr)
    const end = parseInt(endStr)
    if (start > end) throw new Error("Invalid range")
    const pad = startStr.length
    return Array.from({ length: end - start + 1 }, (_, i) =>
      `${prefix}${String(start + i).padStart(pad, "0")}`
    )
  }

  const complex = input.match(/^([A-Z]+-\d+\/)(\d+)-(\d+)$/)
  if (complex) {
    const [, prefix, startStr, endStr] = complex
    const start = parseInt(startStr)
    const end = parseInt(endStr)
    if (start > end) throw new Error("Invalid range")
    const pad = startStr.length
    return Array.from({ length: end - start + 1 }, (_, i) =>
      `${prefix}${String(start + i).padStart(pad, "0")}`
    )
  }

  throw new Error("Invalid format")
}

export function MultiLiveSearch<T>({
  label,
  placeholder = "Search...",
  rangePlaceholder = "ITEM-001-005",
  rangeEnabled = false,
  queryHook,
  buildQuery,
  getValue,
  getLabel,
  renderItem,
  onChange,
}: MultiLiveSearchProps<T>) {
  const [query, setQuery] = useState("")
  const [range, setRange] = useState("")
  const [showRange, setShowRange] = useState(false)
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<string[]>([])
  const [error, setError] = useState("")

  const ref = useRef<HTMLDivElement>(null)
  const [debounced = ""] = useDebounce(query, 500)

  const { data = [], isLoading } = queryHook(buildQuery(debounced), {
    skip: !debounced,
  })

  // Close dropdown when clicking outside
  const inputRef = useRef<HTMLDivElement>(null);

  // Replace your useEffect with this:
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: T) => {
    const value = getValue(item)
    if (!values.includes(value)) {
      const updated = [...values, value]
      setValues(updated)
      onChange?.(updated)
    }
    setQuery("")
    setOpen(false)
  }

  const handleRemove = (val: string) => {
    const updated = values.filter((v) => v !== val)
    setValues(updated)
    onChange?.(updated)
  }

  const handleRangeApply = () => {
    try {
      const parsed = expandRange(range)
      const validCodes = parsed.filter((code) =>
        data.some((item) => getValue(item) === code)
      )

      if (validCodes.length === 0) {
        setError("No codes in range match available data")
        return
      }

      const updated = Array.from(new Set([...values, ...validCodes]))
      setValues(updated)
      onChange?.(updated)
      setError("")
      setRange("")
    } catch {
      setError("Invalid range format")
    }
  }

  return (
    <div className={`grid ${rangeEnabled ? "gap-2" : "gap-3"}`} ref={ref}>
      {label && (
        <div className="flex justify-between items-center">
          <Label>{label}</Label>
          {rangeEnabled && (
            <Button
              type="button"
              variant={showRange ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${showRange
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"}`
              }
              onClick={() => setShowRange((prev) => !prev)}
            >
              <Code className="h-4 w-4 text-inherit" />
            </Button>
          )}
        </div>
      )}

      {/* Input with chips */}
      <div ref={inputRef} className="flex flex-wrap items-center gap-1.5 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base h-9 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] outline-none">
        {values.map((val) => (
          <Badge key={val} variant="outline" className="gap-1">
            {val}
            <button onClick={() => handleRemove(val)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-0 bg-transparent outline-none text-base placeholder:text-sm placeholder:text-muted-foreground"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="w-full max-h-60 rounded-md border bg-popover shadow-md">
          <ScrollArea className="h-full">
            {isLoading ? (
              <div className="p-2 text-sm text-center">Loading...</div>
            ) : data.length === 0 ? (
              <div className="p-2 text-sm text-center">No results</div>
            ) : (
              data.map((item, i) => {
                const value = getValue(item)
                return (
                  <div
                    key={i}
                    className="flex items-center p-2 hover:bg-accent cursor-pointer text-sm"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="flex-1">
                      {renderItem ? (
                        renderItem(item)
                      ) : (
                        <div className="flex flex-col">
                          <p className="font-medium">
                            {getLabel ? getLabel(item) : value}
                          </p>
                          <p className="text-xs text-muted-foreground">{value}</p>
                        </div>
                      )}
                    </div>
                    {values.includes(value) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                )
              })
            )}
          </ScrollArea>
        </div>
      )}

      {/* Range input */}
      {rangeEnabled && showRange && (
        <>
          <div className="flex gap-2">
            <Input
              placeholder={rangePlaceholder}
              value={range}
              onChange={(e) => setRange(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={handleRangeApply} className="cursor-pointer">
              <Check className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Format: <code>ITEM-001-005</code> or <code>ITEM-1001/1-5</code>
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </>
      )}
    </div>
  )
}