import type { MarketType } from '@/shared/config/markets'
import type { Pick } from '@/entities/pick'

export type InsightTone = 'good' | 'bad' | 'neutral'

export interface Insight {
  tone: InsightTone
  kicker: string
  headline: string
  detail: string
  scope?: MarketType
  meta?: string
}

export interface InsightContext {
  resolved: Pick[]
  byMarket: Map<MarketType, Pick[]>
  sizedMarkets: MarketType[]
  coldMarkets: { market: MarketType; streak: number }[]
  allTimeRate: number
  averageStake: number
  lastFive: Pick[]
  recentWins: number
  weekPicks: Pick[]
  weekNet: number
}

export interface InsightRule {
  id: string
  run: (context: InsightContext) => Insight[]
}
