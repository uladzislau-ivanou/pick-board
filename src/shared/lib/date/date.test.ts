import { describe, expect, it } from 'vitest'

import {
  DAY,
  daysBetween,
  formatDayWithDate,
  formatKickoff,
  formatRelativeDay,
  formatShortDate,
  formatWeekday,
  startOfDay,
} from './date'

/** Fixed local timestamps so these assertions never depend on the clock. */
const at = (year: number, month: number, day: number, hour = 12, minute = 0) =>
  new Date(year, month - 1, day, hour, minute).getTime()

describe('startOfDay', () => {
  it('rolls back to local midnight', () => {
    expect(startOfDay(at(2026, 9, 3, 23, 59))).toBe(at(2026, 9, 3, 0, 0))
    expect(startOfDay(at(2026, 9, 3, 0, 1))).toBe(at(2026, 9, 3, 0, 0))
  })
})

describe('daysBetween', () => {
  it('counts whole local days, ignoring the time of day', () => {
    expect(daysBetween(at(2026, 9, 3, 22), at(2026, 9, 4, 1))).toBe(1)
    expect(daysBetween(at(2026, 9, 3), at(2026, 9, 3))).toBe(0)
    expect(daysBetween(at(2026, 9, 6), at(2026, 9, 3))).toBe(-3)
  })

  it('is unaffected by a daylight-saving shift', () => {
    // US DST ends 2026-11-01, so this week contains a 25-hour day.
    expect(daysBetween(at(2026, 10, 30), at(2026, 11, 3))).toBe(4)
  })
})

describe('formatRelativeDay', () => {
  const now = at(2026, 9, 3, 10)

  it('names today and tomorrow', () => {
    expect(formatRelativeDay(at(2026, 9, 3, 19), now)).toBe('Today')
    expect(formatRelativeDay(at(2026, 9, 4, 7), now)).toBe('Tomorrow')
  })

  it('falls back to the weekday further out', () => {
    expect(formatRelativeDay(at(2026, 9, 6), now)).toBe('Sunday')
  })
})

describe('display formats', () => {
  it('formats a short date, weekday and day-with-date', () => {
    const timestamp = at(2026, 9, 2, 15, 30)
    expect(formatShortDate(timestamp)).toBe('Sep 2')
    expect(formatWeekday(timestamp)).toBe('Wednesday')
    expect(formatDayWithDate(timestamp)).toBe('Wed, Sep 2')
  })

  it('formats a kickoff time with the league timezone suffix', () => {
    expect(formatKickoff(at(2026, 9, 3, 19, 30))).toBe('7:30 PM ET')
    expect(formatKickoff(at(2026, 9, 3, 13, 0))).toBe('1:00 PM ET')
  })
})

describe('DAY', () => {
  it('is one day in milliseconds', () => {
    expect(DAY).toBe(24 * 60 * 60 * 1000)
  })
})
