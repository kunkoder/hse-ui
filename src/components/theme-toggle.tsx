"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import React from "react"
import { useThemeManager } from "@/hooks/use-theme-manager"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { applyTheme } = useThemeManager()

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"

    setTheme(newTheme)
    applyTheme("default", newTheme === "dark") // 👈 THIS FIXES IT
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}