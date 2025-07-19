"use client"

import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Theme } from "@/types"

interface ThemeToggleProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  translations: any
}

export function ThemeToggle({ theme, setTheme, translations }: ThemeToggleProps) {
  const t = translations
  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg shadow-sm">
      {(["light", "dark", "system"] as const).map((mode) => (
        <Button
          key={mode}
          variant="ghost"
          size="icon"
          onClick={() => setTheme(mode)}
          className={`p-2 rounded-md h-9 w-9 ${
            theme === mode
              ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
          aria-label={`Set theme to ${mode === "light" ? t.themeLight : mode === "dark" ? t.themeDark : t.themeSystem}`}
        >
          {mode === "light" && <Sun className="h-4 w-4" />}
          {mode === "dark" && <Moon className="h-4 w-4" />}
          {mode === "system" && <Monitor className="h-4 w-4" />}
        </Button>
      ))}
    </div>
  )
}
