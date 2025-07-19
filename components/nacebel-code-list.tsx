"use client"

import { NacebelCodeItem } from "./nacebel-code-item"
import type { NacebelCode, Language } from "@/types"

interface NacebelCodeListProps {
  codes: NacebelCode[]
  language: Language
  copiedCode: string | null
  onCopy: (code: string, description: string) => void
  getExternalLink: (code: string) => string
}

export function NacebelCodeList({ codes, language, copiedCode, onCopy, getExternalLink }: NacebelCodeListProps) {
  return (
    <div className="space-y-2">
      {codes.map((code) => (
        <NacebelCodeItem
          key={code.code}
          code={code}
          language={language}
          copiedCode={copiedCode}
          onCopy={onCopy}
          getExternalLink={getExternalLink}
        />
      ))}
    </div>
  )
}
