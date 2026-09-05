import { ROWS_PER_PAGE } from '@/shared/config/app'
import { Button } from '@/shared/ui/Button'

export const LoadMoreRows = ({
  shown,
  total,
  onShowMore,
}: {
  shown: number
  total: number
  onShowMore: () => void
}) => (
  <div className="flex flex-wrap items-center gap-3 px-5 py-4.5">
    <Button variant="secondary" onClick={onShowMore}>
      Load {Math.min(ROWS_PER_PAGE, total - shown)} more
    </Button>
    <p className="text-[12px] text-ink/65">
      {shown} of {total} shown
    </p>
  </div>
)
