import type { MarketType } from '@/shared/config/markets'
import type { Pick } from '@/entities/pick'

export type InsightTone = 'good' | 'bad' | 'neutral'

export interface Insight {
  tone: InsightTone
  /** The chip label, e.g. "Win streak". */
  kicker: string
  headline: string
  detail: string
  /** Set by the market-specific rules; scopes the evidence strip. */
  scope?: MarketType
  /** Which heuristic fired — a documentation aid. */
  meta?: string
}

/** Measurements shared by every rule, computed once per call. */
export interface InsightContext {
  /** Resolved picks, newest first. */
  resolved: Pick[]
  byMarket: Map<MarketType, Pick[]>
  /** Markets with at least three resolved picks. */
  sizedMarkets: MarketType[]
  /** Markets on a losing run of three or more. */
  coldMarkets: { market: MarketType; streak: number }[]
  /** All-time strike rate, as a whole percentage. */
  allTimeRate: number
  averageStake: number
  /** The last five resolved picks, newest first. */
  lastFive: Pick[]
  /** Wins among `lastFive`. */
  recentWins: number
  /** Resolved picks placed in the last seven days. */
  weekPicks: Pick[]
  /** Net return across `weekPicks`. */
  weekNet: number
}

export interface InsightRule {
  id: string
  /** A rule may produce more than one insight — cold markets can. */
  run: (context: InsightContext) => Insight[]
}
