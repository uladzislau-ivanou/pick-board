import type { Sport } from '@/shared/config/sports'

import type { SportEvent } from '../model/types'

/** Only sports present in the feed, so the filter never shows an empty chip. */
export const countBySport = (events: readonly SportEvent[]) => {
  const counts = new Map<Sport, number>()
  for (const event of events) counts.set(event.sport, (counts.get(event.sport) ?? 0) + 1)
  return counts
}
