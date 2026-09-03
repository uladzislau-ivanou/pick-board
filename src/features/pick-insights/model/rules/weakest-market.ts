import { isWon } from '@/entities/pick'

import { MESSAGES } from '../../config/messages'
import { ratePercent } from '../../lib/market-stats'
import type { InsightRule } from '../insight'

const WEAK_ENOUGH = 34

export const weakestMarketRule: InsightRule = {
  id: 'weakest-market',
  run: ({ byMarket, sizedMarkets, coldMarkets, allTimeRate }) => {
    const worst = [...sizedMarkets].sort(
      (a, b) => ratePercent(byMarket.get(a) ?? []) - ratePercent(byMarket.get(b) ?? []),
    )[0]
    if (!worst) return []

    const rate = ratePercent(byMarket.get(worst) ?? [])
    if (rate > WEAK_ENOUGH) return []

    // A market already reported as cold must not be reported twice.
    if (coldMarkets.some((cold) => cold.market === worst)) return []

    const picks = byMarket.get(worst) ?? []

    return [
      {
        tone: 'bad',
        scope: worst,
        ...MESSAGES.weakestMarket(
          worst,
          rate,
          picks.filter(isWon).length,
          picks.length,
          allTimeRate,
        ),
      },
    ]
  },
}
