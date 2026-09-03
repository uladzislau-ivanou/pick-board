import { PickRow, type Pick } from '@/entities/pick'

export const LedgerRows = ({
  rows,
  isExpanded,
  onToggle,
}: {
  rows: readonly Pick[]
  isExpanded: (id: string) => boolean
  onToggle: (id: string) => void
}) => (
  <>
    {rows.map((pick) => (
      <PickRow
        key={pick.id}
        pick={pick}
        expanded={isExpanded(pick.id)}
        onToggle={() => onToggle(pick.id)}
      />
    ))}
  </>
)
