import type { SportEvent } from '@/entities/event'
import type { Sport } from '@/shared/config/sports'

export type SportFilterValue = Sport | 'all'

export const filterBySport = (events: readonly SportEvent[], sport: SportFilterValue) =>
  sport === 'all' ? [...events] : events.filter((event) => event.sport === sport)
