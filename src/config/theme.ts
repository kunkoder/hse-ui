// theme.ts
import { tweakcnPresets } from "@/utils/tweakcn-theme-presets"
import type { ThemePreset } from "@/types/theme-customizer"

export const productionTheme: ThemePreset = tweakcnPresets["claude"]

type SidebarConfig = {
  variant: "sidebar" | "floating" | "inset"
  collapsible: "offcanvas" | "icon" | "none"
  side: "left" | "right"
}

export const productionSidebar: SidebarConfig = {
  variant: "floating",
  collapsible: "offcanvas",
  side: "left",
}

export function applyProductionTheme(isDark: boolean) {
  if (typeof window === "undefined") return
  const root = document.documentElement

  const theme = isDark
    ? productionTheme.styles.dark
    : productionTheme.styles.light

  // Apply all preset variables
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })

  // Apply critical fallback vars for components using these
  root.style.setProperty("--background", theme.background)
  root.style.setProperty("--foreground", theme.foreground)
  root.style.setProperty("--primary", theme.primary)
  root.style.setProperty("--primary-foreground", theme["primary-foreground"])

  // Force Tailwind dark mode to respond
  if (isDark) {
    root.classList.add("dark")
    root.setAttribute("data-theme", "dark")
  } else {
    root.classList.remove("dark")
    root.setAttribute("data-theme", "light")
  }

  // Optional: force a reflow so components pick up variable changes
  root.offsetHeight
}