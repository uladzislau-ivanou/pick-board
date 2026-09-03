import type { MarketType } from '@/shared/config/markets'
import type { Sport } from '@/shared/config/sports'

export interface PickDraft {
  sport: Sport
  event: string
  market: string
  marketType: MarketType
  selection: string
  odds: number
}
