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
    <p className="mt-2 text-[12px] text-ink/50">
      Later days load on demand — nothing off-screen is rendered.
    </p>
  </div>
)
