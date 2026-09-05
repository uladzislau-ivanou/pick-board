import type { MarketType } from '@/shared/config/markets'
import { formatMoney } from '@/shared/lib/money'
import { plural } from '@/shared/lib/text'

export const MESSAGES = {
  notEnoughHistory: () => ({
    kicker: 'Early days',
    headline: 'Not enough history yet.',
    detail: 'Once three picks have settled, PickBoard starts reading your pattern here.',
    meta: 'Needs 3+ resolved picks.',
  }),

  steadyForm: (recentWins: number, allTimeRate: number) => ({
    kicker: 'Steady form',
    headline: `${recentWins} of your last 5 picks landed.`,
    detail: `Right around your all-time ${allTimeRate}% strike rate, with no market pulling ahead.`,
    meta: 'Heuristic: fallback when no other pattern fires.',
  }),

  winStreak: (streak: number, averageStake: number) => ({
    kicker: 'Win streak',
    headline: `${streak} straight winners — you are on a run.`,
    detail: `Runs like this tempt bigger stakes; yours currently average ${formatMoney(averageStake)} a pick.`,
    meta: 'Heuristic: ≥3 consecutive wins.',
  }),

  recentForm: (wins: number, allTimeRate: number, averageWinningOdds: number) => ({
    kicker: 'Recent form',
    headline: `Hit ${wins} of your last 5 — nice run.`,
    detail: `Well above your all-time ${allTimeRate}% strike rate, at an average of ${averageWinningOdds.toFixed(2)} odds.`,
    meta: 'Heuristic: ≥4 wins in the last 5 resolved.',
  }),

  strongestMarket: (market: MarketType, rate: number, settled: number, rateElsewhere: number) => ({
    kicker: 'Best market',
    headline: `${market} is carrying you at ${rate}%.`,
    detail: `${rate}% from your ${settled} settled ${market} picks, against ${rateElsewhere}% in other markets.`,
    meta: 'Heuristic: best market with 3+ resolved at ≥60%.',
  }),

  weekUp: (net: number, settled: number) => ({
    kicker: 'Week to date',
    headline: `Up ${formatMoney(net)} across ${plural(settled, 'settled pick')}.`,
    detail: 'Net return is positive over the last 7 days — profit, not just strike rate.',
    meta: 'Heuristic: positive net return over 7 days, 3+ settled.',
  }),

  coldMarket: (market: MarketType, streak: number, rateElsewhere: number) => ({
    kicker: 'Cold market',
    headline: `${streak} losses in a row on ${market}.`,
    detail: `The rest of your markets run at ${rateElsewhere}%, so it may be worth a break here.`,
    meta: 'Heuristic: ≥3 consecutive losses in one market type.',
  }),

  coldPatch: (wins: number, marketCount: number) => ({
    kicker: 'Recent form',
    headline: `Only ${wins} of your last 5 landed.`,
    detail: `Spread across ${plural(marketCount, 'market')} rather than one. Keep stakes flat this week.`,
    meta: 'Heuristic: ≤1 win in the last 5 resolved.',
  }),

  weakestMarket: (
    market: MarketType,
    rate: number,
    wins: number,
    settled: number,
    allTimeRate: number,
  ) => ({
    kicker: 'Worst market',
    headline: `${market} is down at ${rate}%.`,
    detail: `Only ${wins} of ${settled} ${market} picks landed, against ${allTimeRate}% overall.`,
    meta: 'Heuristic: worst market with 3+ resolved at ≤34%.',
  }),

  weekDown: (net: number, settled: number) => ({
    kicker: 'Week to date',
    headline: `Down ${formatMoney(Math.abs(net))} across ${plural(settled, 'settled pick')}.`,
    detail: 'Strike rate looks fine, but the losses are landing on your bigger stakes.',
    meta: 'Heuristic: negative net return over 7 days, 3+ settled.',
  }),

  stakeCreep: (recentAverage: number, allTimeAverage: number) => ({
    kicker: 'Stake creep',
    headline: `Your last 3 stakes averaged ${formatMoney(recentAverage)}.`,
    detail: `${Math.round((100 * recentAverage) / allTimeAverage - 100)}% above your all-time ${formatMoney(allTimeAverage)} average. Chasing shows in stake size first.`,
    meta: 'Heuristic: last-3 average stake >1.5× all-time average.',
  }),
}
