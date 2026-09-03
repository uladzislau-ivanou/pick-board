import { describe, expect, it } from 'vitest'

import { DAY, startOfDay } from '@/shared/lib/date'

import type { SportEvent } from '../model/types'
import { groupByDay } from './group-by-day'

const NOW = new Date(2026, 8, 3, 12).getTime()

const eventAt = (id: string, kickoffAt: number): SportEvent => ({
  id,
  sport: 'basketball',
  league: 'NBA',
  home: 'Boston Celtics',
  away: 'Denver Nuggets',
  kickoffAt,
  markets: [],
})

/** Local time on a day offset from NOW, so no assertion depends on the timezone. */
const at = (dayOffset: number, hour: number, minute = 0) =>
  new Date(2026, 8, 3 + dayOffset, hour, minute).getTime()

describe('groupByDay', () => {
  it('is empty for no events', () => {
    expect(groupByDay([], NOW)).toEqual([])
  })

  it('puts same-day events in one group labelled Today', () => {
    const groups = groupByDay([eventAt('a', at(0, 19)), eventAt('b', at(0, 21))], NOW)

    expect(groups).toHaveLength(1)
    expect(groups[0].label).toBe('Today')
    expect(groups[0].diff).toBe(0)
    expect(groups[0].events).toHaveLength(2)
  })

  it('labels the next day Tomorrow', () => {
    const groups = groupByDay([eventAt('a', at(1, 12))], NOW)

    expect(groups[0].label).toBe('Tomorrow')
    expect(groups[0].diff).toBe(1)
  })

  it('labels later days by weekday', () => {
    const groups = groupByDay([eventAt('a', at(3, 10))], NOW)

    expect(groups[0].label).toBe('Sunday')
    expect(groups[0].diff).toBe(3)
    expect(groups[0].dateLabel).toBe('Sep 6')
  })

  it('splits events either side of local midnight into separate days', () => {
    const lateTonight = at(0, 23, 30)
    const earlyTomorrow = at(1, 0, 30)

    const groups = groupByDay([eventAt('late', lateTonight), eventAt('early', earlyTomorrow)], NOW)

    expect(groups.map((group) => group.label)).toEqual(['Today', 'Tomorrow'])
    expect(groups[0].key).toBe(startOfDay(lateTonight))
    expect(groups[1].key).toBe(groups[0].key + DAY)
  })

  it('orders days ascending and kickoffs ascending inside a day', () => {
    const groups = groupByDay(
      [
        eventAt('tomorrow', at(1, 12)),
        eventAt('tonight-late', at(0, 21)),
        eventAt('tonight-early', at(0, 15)),
      ],
      NOW,
    )

    expect(groups.map((group) => group.key)).toEqual([...groups.map((g) => g.key)].sort())
    expect(groups[0].events.map((event) => event.id)).toEqual(['tonight-early', 'tonight-late'])
  })
})
