import { useState } from 'react'

export const useExpandedRows = () => {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set())

  return {
    isExpanded: (id: string) => expanded.has(id),

    toggle: (id: string) =>
      setExpanded((current) => {
        const next = new Set(current)
        if (!next.delete(id)) next.add(id)
        return next
      }),
  }
}
