"use client"

import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  translations: any
}

export function PaginationControls({ currentPage, totalPages, setCurrentPage, translations }: PaginationControlsProps) {
  if (totalPages <= 1) return null
  return (
    <div className="flex justify-center items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        {translations.previous}
      </Button>
      <div className="flex space-x-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum
          if (totalPages <= 5) pageNum = i + 1
          else if (currentPage <= 3) pageNum = i + 1
          else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
          else pageNum = currentPage - 2 + i
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className="w-10"
            >
              {pageNum}
            </Button>
          )
        })}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        {translations.next}
      </Button>
    </div>
  )
}
