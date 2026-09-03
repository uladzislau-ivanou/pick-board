import { MESSAGES } from '../../config/messages'
import { ratePercent } from '../../lib/market-stats'
import type { InsightRule } from '../insight'

const STRONG_ENOUGH = 60

export const strongestMarketRule: InsightRule = {
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
