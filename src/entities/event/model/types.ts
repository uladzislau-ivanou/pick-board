import type { MarketType } from '@/shared/config/markets'
import type { Sport } from '@/shared/config/sports'

export interface Outcome {
  id: string
  label: string
  /** Decimal odds, always > 1. */
  odds: number
}

export interface Market {
  id: string
  /** The enum the insight rules and the market filter group by. */
  type: MarketType
  /** Display name: "Total points", "Run line", "Match result". */
  name: string
  outcomes: Outcome[]
}

export interface SportEvent {
  id: string
  sport: Sport
  league: string
  home: string
  away: string
  kickoffAt: number
  markets: Market[]
}

export interface DayGroup {
  /** Local start of day — the grouping key. */
  key: number
  /** Days from today; 0 is today. */
  diff: number
  /** "Today" | "Tomorrow" | "Saturday" */
  label: string
  /** "Sep 6" */
  dateLabel: string
  events: SportEvent[]
}
