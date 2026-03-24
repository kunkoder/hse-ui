"use client"

import { useEffect, useState } from "react"
import { useThemeManager } from "@/hooks/use-theme-manager"
import { useSidebarConfig } from "@/hooks/use-sidebar-config"
import { tweakcnThemes } from "@/config/theme-data"
import type { ImportedTheme } from "@/types/theme-customizer"

interface HardcodedThemeConfig {
  mode?: "default" | "tweakcn" | "imported" | "custom"
  themeName?: string
  tweakcnPreset?: string
  importedTheme?: ImportedTheme | null
  radius?: string
  brandColors?: Record<string, string>
  sidebar?: {
    variant?: "inset" | "floating" | "sidebar"
    collapsible?: "offcanvas" | "icon" | "none"
    side?: "left" | "right"
  }
}

export function useHardcodedTheme(config: HardcodedThemeConfig) {
  const {
    theme: currentTheme,
    applyTheme,
    applyTweakcnTheme,
    applyImportedTheme,
    applyRadius,
    setBrandColorsValues,
    resetTheme,
  } = useThemeManager()

  const { updateConfig: updateSidebarConfig, config: currentSidebarConfig } = useSidebarConfig()

  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined)

  // Detect dark/light mode dynamically
  useEffect(() => {
    if (!currentTheme) return

    const getDark = () =>
      currentTheme === "dark" ||
      (currentTheme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    setIsDarkMode(getDark())

    if (currentTheme === "system" && typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const listener = () => setIsDarkMode(mq.matches)
      mq.addEventListener("change", listener)
      return () => mq.removeEventListener("change", listener)
    }
  }, [currentTheme])

  // Apply theme when isDarkMode is determined
  useEffect(() => {
    if (isDarkMode === undefined) return

    resetTheme()

    switch (config.mode) {
      case "imported":
        if (config.importedTheme) applyImportedTheme(config.importedTheme, isDarkMode)
        break
      case "tweakcn":
        if (config.tweakcnPreset) {
          const preset = tweakcnThemes.find(t => t.value === config.tweakcnPreset)?.preset
          if (preset) applyTweakcnTheme(preset, isDarkMode)
        }
        break
      case "custom":
        if (config.brandColors) setBrandColorsValues(config.brandColors)
        break
      case "default":
      default:
        if (config.themeName) applyTheme(config.themeName, isDarkMode)
        break
    }

    if (config.radius) applyRadius(config.radius)

    if (config.sidebar) {
      const needsUpdate =
        config.sidebar.variant !== currentSidebarConfig.variant ||
        config.sidebar.collapsible !== currentSidebarConfig.collapsible ||
        config.sidebar.side !== currentSidebarConfig.side

      if (needsUpdate) {
        updateSidebarConfig({
          variant: config.sidebar.variant ?? "inset",
          collapsible: config.sidebar.collapsible ?? "offcanvas",
          side: config.sidebar.side ?? "left",
        })
      }
    }
  }, [
    isDarkMode,
    config.mode,
    config.themeName,
    config.tweakcnPreset,
    config.importedTheme,
    config.brandColors,
    config.radius,
    config.sidebar?.variant,
    config.sidebar?.collapsible,
    config.sidebar?.side,
  ])
}