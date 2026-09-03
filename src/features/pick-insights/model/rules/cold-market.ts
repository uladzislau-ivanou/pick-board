import { MESSAGES } from '../../config/messages'
import { ratePercent } from '../../lib/market-stats'
import type { InsightRule } from '../insight'

export const coldMarketRule: InsightRule = {
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
