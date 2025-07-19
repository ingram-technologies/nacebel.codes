"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Language } from "@/types"

interface LanguageSwitcherProps {
  language: Language
  changeLanguage: (lang: Language) => void
}

const languages: Record<Language, { name: string }> = {
  en: { name: "English" },
  de: { name: "Deutsch" },
  fr: { name: "Français" },
  nl: { name: "Nederlands" },
}

export function LanguageSwitcher({ language, changeLanguage }: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <span>{languages[language].name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {Object.entries(languages).map(([code, lang]) => (
          <DropdownMenuItem key={code} onClick={() => changeLanguage(code as Language)}>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
