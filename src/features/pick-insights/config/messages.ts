import type { MarketType } from '@/shared/config/markets'
import { formatMoney } from '@/shared/lib/money'
import { plural } from '@/shared/lib/text'

export const MESSAGES = {
  notEnoughHistory: () => ({
    kicker: 'Not enough history',
    headline: 'Not enough history yet.',
    detail: 'Once three picks settle, PickBoard starts reading your recent pattern here.',
    meta: 'Needs 3+ resolved picks.',
  }),

  steadyForm: (recentWins: number, allTimeRate: number) => ({
    kicker: 'Steady form',
    headline: `${recentWins} of your last 5 picks landed.`,
    detail: `Right around your all-time ${allTimeRate}% strike rate, with no single market pulling ahead or dragging.`,
    meta: 'Heuristic: fallback when no other pattern fires.',
  }),

  winStreak: (streak: number, averageStake: number) => ({
    kicker: 'Win streak',
    headline: `${streak} straight winners — you are on a run.`,
    detail: `Your last ${streak} resolved picks all landed. Runs like this tempt bigger stakes; your average is ${formatMoney(averageStake)}.`,
    meta: 'Heuristic: ≥3 consecutive wins.',
  }),

  recentForm: (wins: number, allTimeRate: number, averageWinningOdds: number) => ({
    kicker: 'Recent form',
    headline: `You've hit ${wins} of your last 5 — nice run.`,
    detail: `Well above your all-time ${allTimeRate}% strike rate, at an average ${averageWinningOdds.toFixed(2)} odds.`,
    meta: 'Heuristic: ≥4 wins in the last 5 resolved.',
  }),

  strongestMarket: (market: MarketType, rate: number, settled: number, rateElsewhere: number) => ({
    kicker: 'Strongest market',
    headline: `${market} is carrying you at ${rate}%.`,
    detail: `${rate}% from ${settled} settled ${market} picks, against ${rateElsewhere}% across everything else.`,
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
    detail: `Every one of your last ${streak} ${market} picks settled Lost, while your other markets run at ${rateElsewhere}%. Worth a break from that market.`,
    meta: 'Heuristic: ≥3 consecutive losses in one market type.',
  }),

  coldPatch: (wins: number, marketCount: number) => ({
    kicker: 'Recent form',
    headline: `Only ${wins} of your last 5 landed.`,
    detail: `A cold patch spread across ${plural(marketCount, 'market')} rather than one. Nothing to unwind — but keep stakes flat this week.`,
    meta: 'Heuristic: ≤1 win in the last 5 resolved.',
  }),

  weakestMarket: (
    market: MarketType,
    rate: number,
    wins: number,
    settled: number,
    allTimeRate: number,
  ) => ({
    kicker: 'Weakest market',
    headline: `${market} is down at ${rate}%.`,
    detail: `Only ${wins} of ${settled} settled ${market} picks have landed, against ${allTimeRate}% overall.`,
    meta: 'Heuristic: worst market with 3+ resolved at ≤34%.',
  }),

  weekDown: (net: number, settled: number) => ({
    kicker: 'Week to date',
    headline: `Down ${formatMoney(Math.abs(net))} across ${plural(settled, 'settled pick')}.`,
    detail:
      'Strike rate can look fine while the net slips — the losses are landing on your bigger stakes.',
    meta: 'Heuristic: negative net return over 7 days, 3+ settled.',
  }),

  stakeCreep: (recentAverage: number, allTimeAverage: number) => ({
    kicker: 'Stake creep',
    headline: `Your last 3 stakes averaged ${formatMoney(recentAverage)}.`,
    detail: `That is ${Math.round((100 * recentAverage) / allTimeAverage - 100)}% above your all-time average of ${formatMoney(allTimeAverage)}. Chasing shows up in stake size before it shows up in results.`,
    meta: 'Heuristic: last-3 average stake >1.5× all-time average.',
  }),
}
