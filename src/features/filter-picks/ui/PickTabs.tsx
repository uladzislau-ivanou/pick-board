import { plural } from '@/shared/lib/text'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'

import type { PickTab } from '../model/pick-query'

const Count = ({ children }: { children: number }) => (
  <span className="ml-1.5 opacity-55">{children}</span>
)

export const PickTabs = ({
  tab,
  pendingCount,
  settledCount,
  onChange,
}: {
  tab: PickTab
  pendingCount: number
  settledCount: number
  onChange: (tab: PickTab) => void
}) => (
  <SegmentedControl
    label="Pick status"
    value={tab}
    onChange={onChange}
    options={[
      {
        value: 'pending',
        label: (
          <>
            Pending
            <Count>{pendingCount}</Count>
          </>
        ),
        ariaLabel: `${plural(pendingCount, 'pending pick')} in this period`,
      },
      {
        value: 'settled',
        label: (
          <>
            Settled
            <Count>{settledCount}</Count>
          </>
        ),
        ariaLabel: `${plural(settledCount, 'settled pick')} in this period`,
      },
    ]}
  />
)
