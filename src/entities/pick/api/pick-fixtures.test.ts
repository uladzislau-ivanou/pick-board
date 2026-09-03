import { describe, expect, it } from 'vitest'

import { DAY } from '@/shared/lib/date'

import { getSeedPicks } from './pick-fixtures'

const NOW = new Date(2026, 8, 3, 12).getTime()

describe('getSeedPicks', () => {
  const picks = getSeedPicks(NOW)

  it('seeds ten resolved picks so the dashboard has data before anything is placed', () => {
    expect(picks).toHaveLength(10)
    expect(picks.every((pick) => pick.status !== 'Pending')).toBe(true)
  })

  it('returns them newest first, matching how a placed pick is prepended', () => {
    // Same-day rows keep their table order, so this pins the tie-break too.
    expect(picks.map((pick) => pick.id)).toEqual([
      'h9',
      'h10',
      'h7',
      'h8',
      'h5',
      'h6',
      'h4',
      'h3',
      'h1',
      'h2',
    ])
  })

  it('settles each pick four hours after it was placed', () => {
    expect(picks.every((pick) => pick.settledAt === pick.placedAt + 4 * 60 * 60 * 1000)).toBe(true)
  })

  it('places everything inside the last week, relative to the injected now', () => {
    expect(Math.max(...picks.map((pick) => pick.placedAt))).toBe(NOW - DAY)
    expect(Math.min(...picks.map((pick) => pick.placedAt))).toBe(NOW - 6 * DAY)
  })

  it('is shaped so a good and a bad pattern fire at once', () => {
    const lastFive = picks.slice(0, 5)
    expect(lastFive.filter((pick) => pick.status === 'Won')).toHaveLength(4)

    const overUnder = picks.filter((pick) => pick.market === 'Over/Under')
    expect(overUnder.slice(0, 4).every((pick) => pick.status === 'Lost')).toBe(true)
  })

  it('adds up to the figures the design quotes', () => {
    expect(picks.filter((pick) => pick.status === 'Won')).toHaveLength(6)
    expect(picks.reduce((total, pick) => total + pick.stake, 0)).toBe(250)
  })
})
