import { describe, expect, it } from 'vitest'

import { calculatePayout, getSeedPicks, type Pick } from '@/entities/pick'
import { DAY, startOfDay } from '@/shared/lib/date'

import { initialPickQuery, type PickQuery } from '../model/pick-query'
import { applyPickQuery } from './apply-pick-query'

const NOW = new Date(2026, 8, 3, 12).getTime()
const seed = getSeedPicks(NOW)

const open = (id: string, daysAgo: number, stake: number, odds: number): Pick => ({
  id,
  event: 'Nuggets vs Celtics',
  market: 'Moneyline',
  selection: id,
  odds,
  stake,
  status: 'Pending',
  placedAt: NOW - daysAgo * DAY,
})

const view = (picks: readonly Pick[], query: Partial<PickQuery> = {}) =>
  applyPickQuery(picks, { ...initialPickQuery, ...query }, NOW)

const ids = (picks: readonly Pick[]) => picks.map((pick) => pick.id)

describe('applyPickQuery tab default', () => {
  it('opens on Settled when nothing is pending', () => {
    const result = view(seed)

    expect(result.tab).toBe('settled')
    expect(result.pendingCount).toBe(0)
    expect(result.settledCount).toBe(10)
  })

  it('opens on Pending as soon as a pick is open', () => {
    expect(view([...seed, open('p1', 0, 10, 2)]).tab).toBe('pending')
  })

  it('honours an explicit tab over the default', () => {
    const result = view([...seed, open('p1', 0, 10, 2)], { tab: 'settled' })

    expect(result.tab).toBe('settled')
    expect(result.pendingCount).toBe(1)
  })
})

describe('applyPickQuery filtering', () => {
  it('counts and lists only picks inside the period', () => {
    const old = open('p-old', 40, 10, 2)

    expect(view([...seed, old]).settledCount).toBe(10)
    expect(view([...seed, old], { period: '30d' }).pendingCount).toBe(0)
    expect(ids(view([...seed, old], { period: 'all', tab: 'pending' }).rows)).toEqual(['p-old'])
  })

  it('narrows to one market', () => {
    const result = view(seed, { market: 'Spread' })

    expect(result.totalRows).toBe(2)
    expect(result.settledCount).toBe(10)
  })

  it('narrows to one local day', () => {
    const yesterday = startOfDay(NOW - DAY)

    expect(ids(view(seed, { dayFilter: yesterday }).rows)).toEqual(['h9', 'h10'])
  })

  it('combines the day and market filters', () => {
    const result = view(seed, { dayFilter: startOfDay(NOW - DAY), market: 'Moneyline' })

    expect(ids(result.rows)).toEqual(['h10'])
  })
})

describe('applyPickQuery sorting', () => {
  it('defaults to newest first', () => {
    expect(ids(view(seed).rows)).toEqual(['h9', 'h10', 'h7', 'h8', 'h5', 'h6'])
  })

  it('sorts by stake, breaking ties on recency', () => {
    const rows = view(seed, { sort: 'stake', visibleRows: 10 }).rows

    expect(rows.map((pick) => pick.stake)).toEqual([40, 30, 30, 25, 25, 25, 20, 20, 20, 15])
    expect(ids(rows).slice(1, 3)).toEqual(['h9', 'h3'])
  })

  it('sorts by potential payout', () => {
    const rows = view(seed, { sort: 'payout', visibleRows: 10 }).rows
    const payouts = rows.map((pick) => calculatePayout(pick.stake, pick.odds))

    expect(payouts).toEqual([...payouts].sort((a, b) => b - a))
    expect(rows[0].id).toBe('h5')
  })
})

describe('applyPickQuery paging', () => {
  it('pages the whole sorted set rather than sorting a page', () => {
    const result = view(seed, { sort: 'stake' })

    expect(result.rows).toHaveLength(6)
    expect(result.totalRows).toBe(10)
    expect(result.rows[0].stake).toBe(40)
  })

  it('stops at the end of the set', () => {
    expect(view(seed, { visibleRows: 50 }).rows).toHaveLength(10)
  })
})
