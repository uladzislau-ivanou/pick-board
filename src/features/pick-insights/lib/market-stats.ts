import type { Pick } from '@/entities/pick'
import { winRate } from '@/entities/pick'
import type { MarketType } from '@/shared/config/markets'

/** The rules quote whole percentages, so this is the rounded form of `winRate`. */
export const ratePercent = (picks: readonly Pick[]) => {
  const rate = winRate(picks)
  return rate === null ? 0 : Math.round(rate * 100)
}

/** Markets with enough history to draw a conclusion from. */
export const MIN_MARKET_PICKS = 3

export const sizedMarkets = (byMarket: Map<MarketType, Pick[]>) =>
  [...byMarket.keys()].filter((market) => (byMarket.get(market) ?? []).length >= MIN_MARKET_PICKS)

/**
 * Losing runs of three or more, newest first within each market. Shared by the
 * cold-market rule that reports them and the weakest-market rule that must not
 * repeat them — so neither rule imports the other.
 */
export const coldMarkets = (byMarket: Map<MarketType, Pick[]>) => {
  const cold: { market: MarketType; streak: number }[] = []

  for (const [market, picks] of byMarket) {
    let streak = 0
    for (const pick of picks) {
      if (pick.status !== 'Lost') break
      streak += 1
    }
    if (streak >= 3) cold.push({ market, streak })
  }

  return cold
}
