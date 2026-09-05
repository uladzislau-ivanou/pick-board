import { describe, expect, it } from 'vitest'

import { DAY, startOfDay } from '@/shared/lib/date'

import { getSeedPicks } from '../api/pick-fixtures'
import type { Pick, PickStatus } from '../model/types'
import { dailyBuckets, periodTotals } from './daily-buckets'
import { periodRange } from './period'

const NOW = new Date(2026, 8, 3, 12).getTime()
const TODAY = startOfDay(NOW)

let sequence = 0
const pick = (status: PickStatus, { daysAgo = 0, stake = 10, odds = 2 } = {}): Pick => ({
  id: `p${(sequence += 1)}`,
  event: 'Nuggets @ Celtics',
  market: 'Moneyline',
  selection: 'Celtics',
  odds,
  stake,
  status,
  placedAt: NOW - daysAgo * DAY,
})

const week = periodRange('7d', [], NOW)

describe('dailyBuckets', () => {
  it('ignores picks placed outside the window on either side', () => {
    const buckets = dailyBuckets([pick('Won', { daysAgo: 7 }), pick('Won', { daysAgo: -1 })], week)

    expect(buckets).toHaveLength(7)
    expect(buckets.every((bucket) => bucket.staked === 0)).toBe(true)
  })

  it('returns one bucket per day in the range, oldest first', () => {
    const buckets = dailyBuckets([], week)

    expect(buckets).toHaveLength(7)
    expect(buckets[0].day).toBe(TODAY - 6 * DAY)
    expect(buckets.at(-1)?.day).toBe(TODAY)
  })

  it('keeps days with no picks, so the axis never skips a day', () => {
    const buckets = dailyBuckets([pick('Won', { daysAgo: 2 })], week)
    const empty = buckets.filter((bucket) => bucket.count === 0)

    expect(empty).toHaveLength(6)
    expect(empty[0]).toMatchObject({ staked: 0, returned: 0, net: 0 })
  })

  it('splits the day stake by status', () => {
    const buckets = dailyBuckets(
      [
        pick('Won', { daysAgo: 1, stake: 25 }),
        pick('Lost', { daysAgo: 1, stake: 20 }),
        pick('Pending', { daysAgo: 1, stake: 10 }),
      ],
      week,
    )
    const day = buckets.find((bucket) => bucket.day === TODAY - DAY)

    expect(day).toMatchObject({ wonStake: 25, lostStake: 20, pendingStake: 10, staked: 55 })
  })

  it('returns only what the winners paid out', () => {
    const buckets = dailyBuckets(
      [pick('Won', { stake: 25, odds: 1.8 }), pick('Lost', { stake: 20 })],
      week,
    )

    expect(buckets.at(-1)?.returned).toBe(45)
  })

  it('excludes pending stake from net, since it is not lost yet', () => {
    const buckets = dailyBuckets(
      [pick('Won', { stake: 10, odds: 2 }), pick('Pending', { stake: 500 })],
      week,
    )

    expect(buckets.at(-1)).toMatchObject({ net: 10, staked: 510, pendingStake: 500 })
  })

  it('reports a losing day as a negative net', () => {
    const buckets = dailyBuckets([pick('Lost', { stake: 15 })], week)

    expect(buckets.at(-1)?.net).toBe(-15)
  })

  it('buckets by local day, not by elapsed hours', () => {
    const lateYesterday = { ...pick('Won'), placedAt: TODAY - DAY + 23 * 3600_000 }
    const earlyToday = { ...pick('Won'), placedAt: TODAY + 30 * 60_000 }

    const buckets = dailyBuckets([lateYesterday, earlyToday], week)

    expect(buckets.at(-2)?.count).toBe(1)
    expect(buckets.at(-1)?.count).toBe(1)
  })

  it('drops picks outside the range', () => {
    const buckets = dailyBuckets([pick('Won', { daysAgo: 30 })], week)

    expect(buckets.every((bucket) => bucket.count === 0)).toBe(true)
  })

  it('covers a wider window for the longer periods', () => {
    const picks = [pick('Won', { daysAgo: 20 })]

    expect(dailyBuckets(picks, periodRange('30d', picks, NOW))).toHaveLength(30)
    expect(dailyBuckets(picks, periodRange('all', picks, NOW))).toHaveLength(21)
  })
})

describe('periodTotals', () => {
  it('adds the buckets up', () => {
    const buckets = dailyBuckets(
      [
        pick('Won', { daysAgo: 1, stake: 25, odds: 1.8 }),
        pick('Lost', { daysAgo: 2, stake: 20 }),
        pick('Pending', { daysAgo: 3, stake: 10 }),
      ],
      week,
    )

    expect(periodTotals(buckets)).toEqual({ staked: 55, returned: 45, net: 0 })
  })

  it('is all zeroes for an empty period', () => {
    expect(periodTotals(dailyBuckets([], week))).toEqual({ staked: 0, returned: 0, net: 0 })
  })

  it('matches the figures the design quotes for the seeded week', () => {
    const seeded = getSeedPicks(NOW)
    const totals = periodTotals(dailyBuckets(seeded, periodRange('7d', seeded, NOW)))

    expect(totals).toEqual({ staked: 250, returned: 304.25, net: 54.25 })
  })
})
