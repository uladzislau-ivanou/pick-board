import { describe, expect, it } from 'vitest'

import { SPORTS } from '@/shared/config/sports'
import { startOfDay } from '@/shared/lib/date'

import { countBySport } from '../lib/count-by-sport'
import { groupByDay } from '../lib/group-by-day'
import { getEvents } from './event-fixtures'

const NOW = new Date(2026, 8, 3, 12).getTime()

describe('getEvents', () => {
  const events = getEvents(NOW)

  it('seeds twenty events across the next seven days', () => {
    expect(events).toHaveLength(20)
    expect(groupByDay(events, NOW)).toHaveLength(7)
  })

  it('starts today and never looks stale', () => {
    const days = groupByDay(events, NOW)
    expect(days[0].diff).toBe(0)
    expect(days.at(-1)?.diff).toBe(6)
  })

  it('matches the sport counts the filter chips quote', () => {
    expect(Object.fromEntries(countBySport(events))).toEqual({
      basketball: 5,
      football: 4,
      soccer: 4,
      baseball: 3,
      hockey: 4,
    })
  })

  it('gives every event two or three markets', () => {
    for (const event of events) {
      expect(event.markets.length).toBeGreaterThanOrEqual(2)
      expect(event.markets.length).toBeLessThanOrEqual(3)
    }
  })

  it('gives every outcome a unique id and odds above evens', () => {
    const outcomes = events.flatMap((event) => event.markets.flatMap((market) => market.outcomes))

    expect(outcomes).toHaveLength(90)
    expect(new Set(outcomes.map((outcome) => outcome.id)).size).toBe(90)
    expect(outcomes.every((outcome) => outcome.odds > 1)).toBe(true)
  })

  it('uses only known sports', () => {
    expect(events.every((event) => SPORTS.includes(event.sport))).toBe(true)
  })

  it('keeps kickoff times when the clock moves within a day', () => {
    const later = getEvents(NOW + 6 * 3600_000)
    expect(startOfDay(later[0].kickoffAt)).toBe(startOfDay(events[0].kickoffAt))
    expect(later[0].kickoffAt).toBe(events[0].kickoffAt)
  })
})
