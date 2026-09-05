import { averageStake, currentStreak, isWon } from '@/entities/pick'

import { MESSAGES } from '../config/messages'
import { ratePercent } from '../lib/market-stats'
import type { InsightRule } from './insight'

const WIN_STREAK = 3
const RECENT_FORM_WINS = 4
const COLD_PATCH_WINS = 1
const STRONG_ENOUGH = 60
const WEAK_ENOUGH = 34
const WEEK_MINIMUM = 3
const CREEP_FACTOR = 1.5
const CREEP_WINDOW = 3

const winStreakRule: InsightRule = {
  id: 'win-streak',
  run: ({ resolved, averageStake }) => {
    const streak = currentStreak(resolved)
    if (streak?.status !== 'Won' || streak.length < WIN_STREAK) return []

    return [{ tone: 'good', ...MESSAGES.winStreak(streak.length, averageStake) }]
  },
}

const recentFormRule: InsightRule = {
  id: 'recent-form',
  run: ({ lastFive, recentWins, allTimeRate }) => {
    if (recentWins < RECENT_FORM_WINS) return []

    const winners = lastFive.filter(isWon)
    const averageOdds = winners.reduce((total, pick) => total + pick.odds, 0) / winners.length

    return [{ tone: 'good', ...MESSAGES.recentForm(recentWins, allTimeRate, averageOdds) }]
  },
}

const strongestMarketRule: InsightRule = {
  id: 'strongest-market',
  run: ({ resolved, byMarket, sizedMarkets }) => {
    const best = [...sizedMarkets].sort(
      (a, b) => ratePercent(byMarket.get(b) ?? []) - ratePercent(byMarket.get(a) ?? []),
    )[0]
    if (!best) return []

    const picks = byMarket.get(best) ?? []
    const rate = ratePercent(picks)
    if (rate < STRONG_ENOUGH) return []

    const elsewhere = ratePercent(resolved.filter((pick) => pick.market !== best))

    return [
      {
        tone: 'good',
        scope: best,
        ...MESSAGES.strongestMarket(best, rate, picks.length, elsewhere),
      },
    ]
  },
}

const weekUpRule: InsightRule = {
  id: 'week-up',
  run: ({ weekPicks, weekNet }) => {
    if (weekPicks.length < WEEK_MINIMUM || weekNet <= 0) return []

    return [{ tone: 'good', ...MESSAGES.weekUp(weekNet, weekPicks.length) }]
  },
}

const coldMarketRule: InsightRule = {
  id: 'cold-market',
  run: ({ resolved, coldMarkets }) =>
    coldMarkets.map(({ market, streak }) => ({
      tone: 'bad',
      scope: market,
      ...MESSAGES.coldMarket(
        market,
        streak,
        ratePercent(resolved.filter((pick) => pick.market !== market)),
      ),
    })),
}

const coldPatchRule: InsightRule = {
  id: 'cold-patch',
  run: ({ recentWins, byMarket }) => {
    if (recentWins > COLD_PATCH_WINS) return []

    return [{ tone: 'bad', ...MESSAGES.coldPatch(recentWins, byMarket.size) }]
  },
}

const weakestMarketRule: InsightRule = {
  id: 'weakest-market',
  run: ({ byMarket, sizedMarkets, coldMarkets, allTimeRate }) => {
    const worst = [...sizedMarkets].sort(
      (a, b) => ratePercent(byMarket.get(a) ?? []) - ratePercent(byMarket.get(b) ?? []),
    )[0]
    if (!worst) return []

    const picks = byMarket.get(worst) ?? []
    if (ratePercent(picks) > WEAK_ENOUGH) return []
    if (coldMarkets.some((cold) => cold.market === worst)) return []

    return [
      {
        tone: 'bad',
        scope: worst,
        ...MESSAGES.weakestMarket(
          worst,
          ratePercent(picks),
          picks.filter(isWon).length,
          picks.length,
          allTimeRate,
        ),
      },
    ]
  },
}

const weekDownRule: InsightRule = {
  id: 'week-down',
  run: ({ weekPicks, weekNet }) => {
    if (weekPicks.length < WEEK_MINIMUM || weekNet >= 0) return []

    return [{ tone: 'bad', ...MESSAGES.weekDown(weekNet, weekPicks.length) }]
  },
}

const stakeCreepRule: InsightRule = {
  id: 'stake-creep',
  run: ({ resolved, averageStake: allTimeAverage }) => {
    const recentAverage = averageStake(resolved.slice(0, CREEP_WINDOW))
    if (allTimeAverage <= 0 || recentAverage <= allTimeAverage * CREEP_FACTOR) return []

    return [{ tone: 'bad', ...MESSAGES.stakeCreep(recentAverage, allTimeAverage) }]
  },
}

export const GOOD_RULES: readonly InsightRule[] = [
  winStreakRule,
  recentFormRule,
  strongestMarketRule,
  weekUpRule,
]

export const BAD_RULES: readonly InsightRule[] = [
  coldMarketRule,
  coldPatchRule,
  weakestMarketRule,
  weekDownRule,
  stakeCreepRule,
]

export const ALL_RULES: readonly InsightRule[] = [...GOOD_RULES, ...BAD_RULES]
