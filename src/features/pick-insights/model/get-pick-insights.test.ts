import { describe, expect, it } from 'vitest'

import { getSeedPicks, type Pick, type PickStatus } from '@/entities/pick'
import type { MarketType } from '@/shared/config/markets'
import { DAY } from '@/shared/lib/date'

import { getPickInsight, getPickInsights } from './get-pick-insights'

const NOW = new Date(2026, 8, 3, 12).getTime()

let sequence = 0

const pick = (
  status: PickStatus,
  {
    daysAgo = 1,
    market = 'Moneyline',
    stake = 10,
    odds = 2,
  }: Partial<{ daysAgo: number; market: MarketType; stake: number; odds: number }> = {},
): Pick => ({
  id: `p${(sequence += 1)}`,
  event: 'Nuggets @ Celtics',
  market,
  selection: 'Celtics',
  odds,
  stake,
  status,
  placedAt: NOW - daysAgo * DAY,
})

const kickers = (picks: Pick[]) => getPickInsights(picks, NOW).map((insight) => insight.kicker)
const tones = (picks: Pick[]) => getPickInsights(picks, NOW).map((insight) => insight.tone)

const neutralHistory = (): Pick[] => [
  pick('Won', { daysAgo: 10 }),
  pick('Lost', { daysAgo: 11 }),
  pick('Won', { daysAgo: 12 }),
  pick('Lost', { daysAgo: 13 }),
  pick('Won', { daysAgo: 14 }),
  pick('Lost', { daysAgo: 15 }),
]

describe('getPickInsights with too little history', () => {
  it('returns one neutral entry for no picks', () => {
    const insights = getPickInsights([], NOW)

    expect(insights).toHaveLength(1)
    expect(insights[0]).toMatchObject({ tone: 'neutral', headline: 'Not enough history yet.' })
  })

  it('returns one neutral entry for two resolved picks', () => {
    expect(tones([pick('Won'), pick('Lost')])).toEqual(['neutral'])
  })

  it('returns one neutral entry when everything is still pending', () => {
    const pending = [pick('Pending'), pick('Pending'), pick('Pending'), pick('Pending')]
    expect(tones(pending)).toEqual(['neutral'])
  })
})

describe('getPickInsights fallback', () => {
  it('reports steady form, alone, when nothing else fires', () => {
    const insights = getPickInsights(neutralHistory(), NOW)

    expect(insights).toHaveLength(1)
    expect(insights[0]).toMatchObject({ tone: 'neutral', kicker: 'Steady form' })
  })
})

describe('getPickInsights market rules', () => {
  it('flags three consecutive losses in one market, scoped to it', () => {
    const picks = [
      pick('Lost', { daysAgo: 1, market: 'Over/Under' }),
      pick('Lost', { daysAgo: 2, market: 'Over/Under' }),
      pick('Lost', { daysAgo: 3, market: 'Over/Under' }),
      pick('Won', { daysAgo: 4 }),
      pick('Won', { daysAgo: 5 }),
    ]

    const cold = getPickInsights(picks, NOW).find((insight) => insight.kicker === 'Cold market')
    expect(cold).toMatchObject({ tone: 'bad', scope: 'Over/Under' })
  })

  it('does not repeat a cold market as the weakest market', () => {
    const picks = [
      pick('Lost', { daysAgo: 1, market: 'Over/Under' }),
      pick('Lost', { daysAgo: 2, market: 'Over/Under' }),
      pick('Lost', { daysAgo: 3, market: 'Over/Under' }),
      pick('Won', { daysAgo: 4 }),
      pick('Won', { daysAgo: 5 }),
      pick('Won', { daysAgo: 6 }),
    ]

    expect(kickers(picks)).toContain('Cold market')
    expect(kickers(picks)).not.toContain('Weakest market')
  })

  it('reports a weak market that is not on a losing run', () => {
    const picks = [
      pick('Lost', { daysAgo: 1, market: 'Spread' }),
      pick('Won', { daysAgo: 2, market: 'Spread' }),
      pick('Lost', { daysAgo: 3, market: 'Spread' }),
      pick('Lost', { daysAgo: 4, market: 'Spread' }),
      pick('Won', { daysAgo: 5 }),
      pick('Won', { daysAgo: 6 }),
      pick('Won', { daysAgo: 7 }),
    ]

    const weakest = getPickInsights(picks, NOW).find(
      (insight) => insight.kicker === 'Weakest market',
    )
    expect(weakest).toMatchObject({ tone: 'bad', scope: 'Spread' })
  })

  it('compares the strongest market against everything else, not against itself', () => {
    const picks = [
      pick('Won', { daysAgo: 1, market: 'Moneyline' }),
      pick('Won', { daysAgo: 2, market: 'Moneyline' }),
      pick('Won', { daysAgo: 3, market: 'Moneyline' }),
      pick('Lost', { daysAgo: 4, market: 'Spread' }),
      pick('Lost', { daysAgo: 5, market: 'Spread' }),
    ]

    const strongest = getPickInsights(picks, NOW).find(
      (insight) => insight.kicker === 'Strongest market',
    )
    expect(strongest?.detail).toContain('against 0% across everything else')
  })
})

describe('getPickInsights recent form', () => {
  it('celebrates four of the last five', () => {
    const picks = [
      pick('Won', { daysAgo: 1 }),
      pick('Won', { daysAgo: 2 }),
      pick('Lost', { daysAgo: 3 }),
      pick('Won', { daysAgo: 4 }),
      pick('Won', { daysAgo: 5 }),
    ]

    const insights = getPickInsights(picks, NOW)
    expect(insights.some((insight) => insight.tone === 'good')).toBe(true)
    expect(kickers(picks)).toContain('Recent form')
  })

  it('warns on one of the last five', () => {
    const picks = [
      pick('Lost', { daysAgo: 1 }),
      pick('Lost', { daysAgo: 2 }),
      pick('Won', { daysAgo: 3 }),
      pick('Lost', { daysAgo: 4 }),
      pick('Lost', { daysAgo: 5 }),
    ]

    expect(getPickInsights(picks, NOW).some((insight) => insight.tone === 'bad')).toBe(true)
  })

  it('reports a run of three or more wins', () => {
    const picks = [
      pick('Won', { daysAgo: 1 }),
      pick('Won', { daysAgo: 2 }),
      pick('Won', { daysAgo: 3 }),
      pick('Lost', { daysAgo: 4 }),
    ]

    expect(kickers(picks)).toContain('Win streak')
  })
})

describe('getPickInsights ordering', () => {
  it('puts every good pattern before every warning', () => {
    const picks = [
      pick('Won', { daysAgo: 1, market: 'Moneyline' }),
      pick('Won', { daysAgo: 2, market: 'Moneyline' }),
      pick('Won', { daysAgo: 3, market: 'Moneyline' }),
      pick('Lost', { daysAgo: 4, market: 'Over/Under' }),
      pick('Lost', { daysAgo: 5, market: 'Over/Under' }),
      pick('Lost', { daysAgo: 6, market: 'Over/Under' }),
    ]

    const results = getPickInsights(picks, NOW)
    const firstBad = results.findIndex((insight) => insight.tone === 'bad')

    expect(results.some((insight) => insight.tone === 'good')).toBe(true)
    expect(firstBad).toBeGreaterThan(0)
    expect(results[0].tone).toBe('good')
    expect(results.slice(firstBad).every((insight) => insight.tone === 'bad')).toBe(true)
  })
})

describe('getPickInsights week to date', () => {
  it('reports a profitable week', () => {
    const picks = [
      pick('Won', { daysAgo: 1, odds: 3 }),
      pick('Won', { daysAgo: 2, odds: 3 }),
      pick('Lost', { daysAgo: 3 }),
    ]

    const weekly = getPickInsights(picks, NOW).find((insight) => insight.kicker === 'Week to date')
    expect(weekly?.headline).toContain('Up $')
  })

  it('reports a losing week', () => {
    const picks = [
      pick('Lost', { daysAgo: 1 }),
      pick('Lost', { daysAgo: 2 }),
      pick('Won', { daysAgo: 3, odds: 1.1 }),
    ]

    const weekly = getPickInsights(picks, NOW).find((insight) => insight.kicker === 'Week to date')
    expect(weekly?.headline).toContain('Down $')
  })

  it('ignores picks older than the week', () => {
    const picks = [
      pick('Won', { daysAgo: 20, odds: 3 }),
      pick('Won', { daysAgo: 21, odds: 3 }),
      pick('Won', { daysAgo: 22, odds: 3 }),
    ]

    expect(kickers(picks)).not.toContain('Week to date')
  })
})

describe('getPickInsights stake creep', () => {
  it('flags recent stakes well above the all-time average', () => {
    const picks = [
      pick('Won', { daysAgo: 1, stake: 100 }),
      pick('Lost', { daysAgo: 2, stake: 100 }),
      pick('Won', { daysAgo: 3, stake: 100 }),
      pick('Lost', { daysAgo: 12, stake: 10 }),
      pick('Won', { daysAgo: 13, stake: 10 }),
      pick('Lost', { daysAgo: 14, stake: 10 }),
      pick('Won', { daysAgo: 15, stake: 10 }),
      pick('Lost', { daysAgo: 16, stake: 10 }),
    ]

    expect(kickers(picks)).toContain('Stake creep')
  })

  it('stays quiet on flat stakes', () => {
    expect(kickers(neutralHistory())).not.toContain('Stake creep')
  })
})

describe('getPickInsight', () => {
  it('is the first of getPickInsights', () => {
    const picks = getSeedPicks(NOW)
    expect(getPickInsight(picks, NOW)).toEqual(getPickInsights(picks, NOW)[0])
  })
})

describe('getPickInsights on the seeded history', () => {
  const insights = getPickInsights(getSeedPicks(NOW), NOW)

  it('surfaces a good pattern first and keeps the warning one click away', () => {
    expect(insights.length).toBeGreaterThan(1)
    expect(insights[0].tone).toBe('good')
    expect(insights.some((insight) => insight.tone === 'bad')).toBe(true)
  })

  it('flags Over/Under as the cold market, as the fixture is shaped to', () => {
    expect(insights.find((insight) => insight.kicker === 'Cold market')).toMatchObject({
      scope: 'Over/Under',
    })
  })
})
