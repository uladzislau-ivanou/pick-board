import { useState } from 'react'

/**
 * Independent of the row window on purpose: the handoff requires that paging
 * in more rows never closes the ones the user already opened.
 */
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
