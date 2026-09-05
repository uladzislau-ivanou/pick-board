import { plural } from '@/shared/lib/text'
import { Button } from '@/shared/ui/Button'

export const ShowMoreDays = ({
  hiddenDays,
  onShowMore,
}: {
  hiddenDays: number
  onShowMore: () => void
}) => (
  <div className="border-t-2 border-divider pt-4">
    <Button variant="secondary" onClick={onShowMore}>
      Show {plural(hiddenDays, 'more day')}
    </Button>
  </div>
)
