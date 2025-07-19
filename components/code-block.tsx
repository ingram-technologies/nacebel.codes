import type { ReactNode } from "react"

interface CodeBlockProps {
  children: ReactNode
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 overflow-x-auto text-sm">
      <code>{children}</code>
    </pre>
  )
}
