import { describe, expect, it } from 'vitest'

import { DAY, startOfDay } from '@/shared/lib/date'

import type { Pick } from '../model/types'
import { isInPeriod, periodLabel, periodRange } from './period'

const NOW = new Date(2026, 8, 3, 12).getTime()
const TODAY = startOfDay(NOW)

const placedDaysAgo = (daysAgo: number): Pick => ({
  id: `p${daysAgo}`,
  event: 'Nuggets @ Celtics',
  market: 'Moneyline',
  selection: 'Celtics',
  odds: 2,
  stake: 10,
  status: 'Won',
  placedAt: NOW - daysAgo * DAY,
})

describe('periodRange', () => {
  it('covers seven days ending today', () => {
    expect(periodRange('7d', [], NOW)).toEqual({
      spanDays: 7,
      startDay: TODAY - 6 * DAY,
      endDay: TODAY,
    })
  })

  it('covers thirty days ending today', () => {
    expect(periodRange('30d', [], NOW).spanDays).toBe(30)
  })

  it('stretches "all" back to the earliest pick', () => {
    const picks = [placedDaysAgo(11), placedDaysAgo(2)]
    expect(periodRange('all', picks, NOW).spanDays).toBe(12)
  })

  it('keeps "all" at a week minimum, so the chart is never a single bar', () => {
    expect(periodRange('all', [placedDaysAgo(1)], NOW).spanDays).toBe(7)
    expect(periodRange('all', [], NOW).spanDays).toBe(7)
  })

  it('caps "all" so the chart stays readable', () => {
    expect(periodRange('all', [placedDaysAgo(400)], NOW).spanDays).toBe(45)
  })
})

describe('isInPeriod', () => {
  const range = periodRange('7d', [], NOW)

  it('includes a pick placed on the first day of the window', () => {
    expect(isInPeriod(placedDaysAgo(6), range)).toBe(true)
  })

  it('excludes a pick placed the day before the window', () => {
    expect(isInPeriod(placedDaysAgo(7), range)).toBe(false)
  })

  it('excludes a pick placed after the window ends', () => {
    expect(isInPeriod(placedDaysAgo(-1), range)).toBe(false)
  })

  it('compares whole days, not exact times', () => {
    const lateOnTheFirstDay = { ...placedDaysAgo(6), placedAt: TODAY - 6 * DAY + 23 * 3600_000 }
    expect(isInPeriod(lateOnTheFirstDay, range)).toBe(true)
  })
})

describe('periodLabel', () => {
  it('names the fixed windows', () => {
    expect(periodLabel('7d', 7)).toBe('Last 7 days')
    expect(periodLabel('30d', 30)).toBe('Last 30 days')
  })

  it('reports the span "all" resolved to, rather than claiming more', () => {
    expect(periodLabel('all', 7)).toBe('All time · 7 days')
    expect(periodLabel('all', 1)).toBe('All time · 1 day')
  })
})
