import { describe, expect, it } from 'vitest'

import { DAY } from '@/shared/lib/date'

import type { Pick, PickStatus } from '../model/types'
import {
  averageStake,
  currentStreak,
  groupByMarket,
  netReturn,
  pendingPayout,
  pendingPicks,
  pickReturn,
  resolvedPicks,
  totalStaked,
  winRate,
} from './stats'

const NOW = new Date(2026, 8, 3, 12).getTime()

let sequence = 0
const pick = (status: PickStatus, overrides: Partial<Pick> = {}): Pick => ({
  id: `p${(sequence += 1)}`,
  event: 'Nuggets @ Celtics',
  market: 'Moneyline',
  selection: 'Celtics',
  odds: 2,
  stake: 10,
  status,
  placedAt: NOW,
  ...overrides,
})

describe('pickReturn', () => {
  it('is the payout for a win and nothing for a loss', () => {
    expect(pickReturn(pick('Won', { stake: 25, odds: 1.8 }))).toBe(45)
    expect(pickReturn(pick('Lost', { stake: 25, odds: 1.8 }))).toBe(0)
  })

  it('is nothing for a pick that has not settled', () => {
    expect(pickReturn(pick('Pending', { stake: 25, odds: 1.8 }))).toBe(0)
  })
})

describe('splitting by status', () => {
  const picks = [pick('Pending'), pick('Won'), pick('Lost')]

  it('separates pending from resolved', () => {
    expect(pendingPicks(picks)).toHaveLength(1)
    expect(resolvedPicks(picks)).toHaveLength(2)
  })

  it('orders resolved picks newest first', () => {
    const older = pick('Won', { id: 'older', placedAt: NOW - 3 * DAY })
    const newer = pick('Lost', { id: 'newer', placedAt: NOW - DAY })

    expect(resolvedPicks([older, newer]).map((entry) => entry.id)).toEqual(['newer', 'older'])
  })
})

describe('totals', () => {
  it('stakes count every pick, pending included', () => {
    expect(totalStaked([pick('Won', { stake: 25 }), pick('Pending', { stake: 30 })])).toBe(55)
  })

  it('pending payout counts only what is still open', () => {
    const picks = [pick('Pending', { stake: 10, odds: 1.72 }), pick('Won', { stake: 25, odds: 2 })]
    expect(pendingPayout(picks)).toBe(17.2)
  })

  it('average stake is 0 with no picks', () => {
    expect(averageStake([])).toBe(0)
    expect(averageStake([pick('Won', { stake: 25 }), pick('Won', { stake: 20 })])).toBe(22.5)
  })
})

describe('winRate', () => {
  it('counts resolved picks only', () => {
    const picks = [pick('Won'), pick('Won'), pick('Lost'), pick('Pending')]
    expect(winRate(picks)).toBeCloseTo(2 / 3)
  })

  it('is null when nothing has resolved, so it is not confused with 0%', () => {
    expect(winRate([])).toBeNull()
    expect(winRate([pick('Pending')])).toBeNull()
  })

  it('is 0 when every resolved pick lost', () => {
    expect(winRate([pick('Lost')])).toBe(0)
  })
})

describe('netReturn', () => {
  it('is returned less staked across resolved picks', () => {
    // Won 25 at 1.80 returns 45; lost 20 returns nothing. Staked 45.
    expect(netReturn([pick('Won', { stake: 25, odds: 1.8 }), pick('Lost', { stake: 20 })])).toBe(0)
  })

  it('ignores pending stake, which is not lost yet', () => {
    expect(netReturn([pick('Won', { stake: 10, odds: 2 }), pick('Pending', { stake: 500 })])).toBe(
      10,
    )
  })

  it('is 0 with nothing resolved', () => {
    expect(netReturn([pick('Pending')])).toBe(0)
  })
})

describe('currentStreak', () => {
  const at = (daysAgo: number) => NOW - daysAgo * DAY

  it('measures the run at the newest end', () => {
    const picks = [
      pick('Won', { placedAt: at(1) }),
      pick('Won', { placedAt: at(2) }),
      pick('Won', { placedAt: at(3) }),
      pick('Lost', { placedAt: at(4) }),
    ]
    expect(currentStreak(picks)).toEqual({ status: 'Won', length: 3 })
  })

  it('reads the same list in either input order', () => {
    const picks = [pick('Lost', { placedAt: at(4) }), pick('Won', { placedAt: at(1) })]
    expect(currentStreak(picks)).toEqual({ status: 'Won', length: 1 })
  })

  it('skips pending picks entirely', () => {
    const picks = [pick('Pending', { placedAt: at(0) }), pick('Lost', { placedAt: at(1) })]
    expect(currentStreak(picks)).toEqual({ status: 'Lost', length: 1 })
  })

  it('is null with nothing resolved', () => {
    expect(currentStreak([pick('Pending')])).toBeNull()
  })
})

describe('groupByMarket', () => {
  it('groups by market type and omits markets with no picks', () => {
    const groups = groupByMarket([
      pick('Won', { market: 'Moneyline' }),
      pick('Lost', { market: 'Over/Under' }),
      pick('Won', { market: 'Moneyline' }),
    ])

    expect([...groups.keys()]).toEqual(['Moneyline', 'Over/Under'])
    expect(groups.get('Moneyline')).toHaveLength(2)
    expect(groups.has('Spread')).toBe(false)
  })
})
