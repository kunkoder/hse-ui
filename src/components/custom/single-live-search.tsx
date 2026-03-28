"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

type LiveSearchProps<T> = {
  placeholder?: string
  icon?: (props: any) => React.JSX.Element
  queryHook: (
    args: any,
    options?: { skip?: boolean }
  ) => { data?: T[]; isLoading: boolean }
  buildQuery: (search: string) => any
  getValue: (item: T) => string
  getLabel?: (item: T) => string
  renderItem?: (item: T) => React.ReactNode
  onSelect: (value: string, item: T) => void
  initialValue?: string
}

export function SingleLiveSearch<T>({
  placeholder = "Search...",
  icon: Icon,
  queryHook,
  buildQuery,
  getValue,
  getLabel,
  renderItem,
  onSelect,
  initialValue = "",
}: LiveSearchProps<T>) {
  const [query, setQuery] = useState(initialValue)
  const [open, setOpen] = useState(false)
  const [debounced] = useDebounce(query, 500)
  const ref = useRef<HTMLDivElement>(null)

  const { data = [], isLoading } = queryHook(buildQuery(debounced), { skip: !debounced })
  const options = data

  // 🔹 When an item is selected, show "name (code)" in the input
  const handleSelect = (item: T) => {
    const value = getValue(item)
    onSelect(value, item)

    // Display label + value in input
    const displayLabel = getLabel ? `${getLabel(item)} (${value})` : value
    setQuery(displayLabel)
    setOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-2 relative" ref={ref}>
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          className="pr-8"
        />

        {query && (
          <div className="absolute right-2 top-2">
            <button onClick={() => setQuery("")} className="hover:text-destructive">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}

        {open && (
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in zoom-in-95">
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="p-2 text-sm text-muted-foreground text-center">Loading...</div>
              ) : options.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">No results</div>
              ) : (
                options.map((item, i) => (
                  <div
                    key={i}
                    className="flex cursor-default select-none items-center p-2 hover:bg-accent hover:text-accent-foreground text-sm"
                    onClick={() => handleSelect(item)}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <div className="flex-1">
                      {renderItem ? (
                        renderItem(item)
                      ) : (
                        <div className="flex flex-col">
                          <p className="font-medium">{getLabel ? getLabel(item) : getValue(item)}</p>
                          <p className="text-xs text-muted-foreground">{getValue(item)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}