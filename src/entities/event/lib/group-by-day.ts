import { daysBetween, formatRelativeDay, formatShortDate, startOfDay } from '@/shared/lib/date'

import type { DayGroup, SportEvent } from '../model/types'

/** Groups by local start of day, days ascending, kickoffs ascending inside each day. */
export const groupByDay = (events: readonly SportEvent[], now: number): DayGroup[] => {
  const byDay = new Map<number, SportEvent[]>()

  for (const event of events) {
    const key = startOfDay(event.kickoffAt)
    const existing = byDay.get(key)
    if (existing) existing.push(event)
    else byDay.set(key, [event])
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a - b)
    .map(([key, dayEvents]) => ({
      key,
      diff: daysBetween(now, key),
      label: formatRelativeDay(key, now),
      dateLabel: formatShortDate(key),
      events: dayEvents.toSorted((a, b) => a.kickoffAt - b.kickoffAt),
    }))
}
