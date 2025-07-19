import NacebelSearchClient from "@/components/nacebel-search"
import type { Metadata } from "next"
import { getPaginatedNacebelCodes } from "@/lib/nacebelData" // Import from the new lib file

// Helper function to remove punctuation for search optimization (used server-side)
function removePunctuation(text: string): string {
  if (!text) return ""
  return text.replace(/[^\w\s]/g, "").toLowerCase()
}

interface NacebelCode {
  level: number
  code: string
  titles: {
    en: string
    de: string
    fr: string
    nl: string
  }
  searchableCode: string
  searchableTitles: {
    en: string
    de: string
    fr: string
    nl: string
  }
}

// Helper function to parse CSV line with quoted fields (used server-side)
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

// Parse CSV data (used server-side)
function parseCSV(csvText: string): NacebelCode[] {
  const lines = csvText.split("\n")
  if (lines.length === 0) return []
  const headers = lines[0].split(",")

  const levelIndex = headers.findIndex((h) => h.trim() === "LEVEL")
  const codeIndex = headers.findIndex((h) => h.trim() === "CODE")
  const nlIndex = headers.findIndex((h) => h.trim() === "NATIONAL_TITLE_BE_NL")
  const frIndex = headers.findIndex((h) => h.trim() === "NATIONAL_TITLE_BE_FR")
  const deIndex = headers.findIndex((h) => h.trim() === "NATIONAL_TITLE_BE_DE")
  const enIndex = headers.findIndex((h) => h.trim() === "NATIONAL_TITLE_BE_EN")

  const codes: NacebelCode[] = []
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const values = parseCSVLine(lines[i])
    if (values.length >= Math.max(levelIndex, codeIndex, nlIndex, frIndex, deIndex, enIndex) + 1) {
      const level = Number.parseInt(values[levelIndex], 10) || 0
      if (level === 1) continue // Skip Level 1 codes

      const originalCode = values[codeIndex] || ""
      const titleNL = values[nlIndex] || ""
      const titleFR = values[frIndex] || ""
      const titleDE = values[deIndex] || ""
      const titleEN = values[enIndex] || ""

      codes.push({
        level,
        code: originalCode,
        titles: {
          nl: titleNL,
          fr: titleFR,
          de: titleDE,
          en: titleEN,
        },
        searchableCode: removePunctuation(originalCode),
        searchableTitles: {
          nl: removePunctuation(titleNL),
          fr: removePunctuation(titleFR),
          de: removePunctuation(titleDE),
          en: removePunctuation(titleEN),
        },
      })
    }
  }
  return codes
}

export const metadata: Metadata = {
  title: "NACE-BEL 2025 Codes",
  description:
    "Search through the complete NACEBEL classification system. Find economic activity codes quickly and efficiently.",
  openGraph: {
    title: "NACE-BEL 2025 Codes",
    description:
      "Search through the complete NACEBEL classification system. Find economic activity codes quickly and efficiently.",
    type: "website",
  },
}

export default async function Home() {
  // Fetch initial codes on the server
  // We'll fetch all codes here, as the client component handles its own filtering/pagination
  // based on the full dataset. The API endpoints handle their own pagination/filtering.
  const { data: initialCodes } = await getPaginatedNacebelCodes(1, 100000) // Fetch a large enough set to cover all codes for client-side use

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto py-12 px-4">
        <NacebelSearchClient initialCodes={initialCodes} />
      </main>
    </div>
  )
}
