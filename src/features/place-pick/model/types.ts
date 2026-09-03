import type { MarketType } from '@/shared/config/markets'
import type { Sport } from '@/shared/config/sports'

/** Not a `Pick`: it carries the sport and the market's display name too. */
export interface PickDraft {
  sport: Sport
  /** "Nuggets @ Celtics" */
  event: string
  /** Display name, e.g. "Total points". */
  market: string
  marketType: MarketType
  selection: string
  odds: number
}
