import type { SportEvent } from '@/entities/event'

import type { SportFilterValue } from '../model/types'

export const filterBySport = (events: readonly SportEvent[], sport: SportFilterValue) =>
  sport === 'all' ? [...events] : events.filter((event) => event.sport === sport)
