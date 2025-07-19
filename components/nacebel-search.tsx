"use client"

import { useState, useEffect, useMemo } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { translations } from "@/lib/translations"
import type { NacebelCode, Language, Theme } from "@/types"

import { LanguageSwitcher } from "./language-switcher"
import { ThemeToggle } from "./theme-toggle"
import { AdvertisementBanner } from "./advertisement-banner"
import { SearchInput } from "./search-input"
import { PaginationControls } from "./pagination-controls"
import { NacebelCodeList } from "./nacebel-code-list"
import { PageFooter } from "./page-footer"

// Helper function to remove punctuation for search optimization
function removePunctuationClient(text: string): string {
  if (!text) return ""
  return text.replace(/[^\p{L}\p{N}\s]/gu, "").toLowerCase()
}

interface NacebelSearchClientProps {
  initialCodes: NacebelCode[]
}

export default function NacebelSearchClient({ initialCodes }: NacebelSearchClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [nacebelCodes] = useState<NacebelCode[]>(initialCodes)
  const [filteredCodes, setFilteredCodes] = useState<NacebelCode[]>(initialCodes)
  const [language, setLanguage] = useState<Language>("en")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isClientProcessing, setIsClientProcessing] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const { toast } = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(100)
  const [theme, setTheme] = useState<Theme>("system")

  // Load initial language from cookie
  useEffect(() => {
    const storedLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("lang="))
      ?.split("=")[1]
    if (storedLang && ["en", "de", "fr", "nl"].includes(storedLang)) {
      setLanguage(storedLang as Language)
    }
  }, [])

  // Load initial theme from cookie or system preference
  useEffect(() => {
    let initialTheme: Theme = "system"
    const storedTheme = document.cookie
      .split("; ")
      .find((row) => row.startsWith("theme="))
      ?.split("=")[1] as Theme | undefined

    if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
      initialTheme = storedTheme
    }
    setTheme(initialTheme)
  }, [])

  // Apply theme and listen for system changes
  useEffect(() => {
    const applyCurrentTheme = (currentTheme: Theme) => {
      document.cookie = `theme=${currentTheme};path=/;max-age=31536000;samesite=lax`
      if (currentTheme === "light") {
        document.documentElement.classList.remove("dark")
      } else if (currentTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    }
    applyCurrentTheme(theme)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") applyCurrentTheme("system")
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  // Filter codes based on search term
  useEffect(() => {
    setIsClientProcessing(true)
    setClientError(null)
    try {
      const searchableSearchTerm = removePunctuationClient(searchTerm)
      if (searchableSearchTerm === "") {
        setFilteredCodes(nacebelCodes)
      } else {
        const results = nacebelCodes.filter(
          (code) =>
            removePunctuationClient(code.code).includes(searchableSearchTerm) ||
            removePunctuationClient(code.titles[language]).includes(searchableSearchTerm),
        )
        setFilteredCodes(results)
      }
      setCurrentPage(1)
    } catch (e) {
      console.error("Error filtering codes:", e)
      setClientError(translations[language].error)
    } finally {
      setIsClientProcessing(false)
    }
  }, [searchTerm, nacebelCodes, language])

  const totalPages = Math.ceil(filteredCodes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCodes = useMemo(() => filteredCodes.slice(startIndex, endIndex), [filteredCodes, startIndex, endIndex])

  const copyToClipboard = (code: string, description: string) => {
    navigator.clipboard.writeText(`${code} - ${description}`).then(() => {
      setCopiedCode(code)
      toast({ description: t.copied, duration: 2000 })
      setTimeout(() => setCopiedCode(null), 2000)
    })
  }

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    document.cookie = `lang=${newLanguage};path=/;max-age=31536000;samesite=lax`
  }

  const getExternalLink = (code: string) => {
    const cleanCode = code.replace(/\./g, "")
    return `https://kbopub.economie.fgov.be/kbopub/naceToelichting.html?lang=${language}&nace.code=${cleanCode}&nace.version=2025`
  }

  const exportToCSV = () => {
    const headers = ["Level", "Code", `Description (${language.toUpperCase()})`]
    const csvContent = [
      headers.join(","),
      ...filteredCodes.map((code) =>
        [code.level, code.code, `"${(code.titles[language] || "").replace(/"/g, '""')}"`].join(","),
      ),
    ].join("\n")

    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `nacebel_codes_${language}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({ description: `Exported ${filteredCodes.length} codes to CSV`, duration: 3000 })
  }

  const t = translations[language]

  if (initialCodes.length === 0 && !isClientProcessing) {
    return (
      <div className="text-center text-red-500 dark:text-red-400">{clientError || "Could not load NACEBEL codes."}</div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <a href="/about">About</a>
          </Button>
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <a href="/api/docs">API</a>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} setTheme={setTheme} translations={t} />
          <LanguageSwitcher language={language} changeLanguage={changeLanguage} />
        </div>
      </header>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
      </div>

      <AdvertisementBanner />
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t.searchPlaceholder} />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <Button variant="outline" size="sm" onClick={exportToCSV} className="flex items-center gap-1 bg-transparent">
          <Download className="h-4 w-4" />
          <span>{t.exportCsv}</span>
        </Button>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          translations={t}
        />
      </div>

      {isClientProcessing && searchTerm ? (
        <div className="text-center py-10">{t.loading}</div>
      ) : paginatedCodes.length > 0 ? (
        <NacebelCodeList
          codes={paginatedCodes}
          language={language}
          copiedCode={copiedCode}
          onCopy={copyToClipboard}
          getExternalLink={getExternalLink}
        />
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">{t.noCodes}</div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t.showing} {filteredCodes.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredCodes.length)} {t.of}{" "}
          {filteredCodes.length} {t.codes}
          {totalPages > 1 && ` (${t.page} ${currentPage} ${t.of} ${totalPages})`}
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          translations={t}
        />
      </div>

      <PageFooter />
    </div>
  )
}
