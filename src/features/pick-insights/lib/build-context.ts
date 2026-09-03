import { averageStake, groupByMarket, netReturn, type Pick } from '@/entities/pick'
import { DAY } from '@/shared/lib/date'

import type { InsightContext } from '../model/insight'
import { coldMarkets, ratePercent, sizedMarkets } from './market-stats'

const RECENT_WINDOW = 5
const WEEK = 7 * DAY

/** `resolved` must already be newest first. */
export const buildContext = (resolved: Pick[], now: number): InsightContext => {
  const byMarket = groupByMarket(resolved)
  const lastFive = resolved.slice(0, RECENT_WINDOW)
  const weekPicks = resolved.filter((pick) => pick.placedAt >= now - WEEK)

  return {
    resolved,
    byMarket,
    sizedMarkets: sizedMarkets(byMarket),
    coldMarkets: coldMarkets(byMarket),
    allTimeRate: ratePercent(resolved),
    averageStake: averageStake(resolved),
    lastFive,
    recentWins: lastFive.filter((pick) => pick.status === 'Won').length,
    weekPicks,
    weekNet: netReturn(weekPicks),
  }
}
