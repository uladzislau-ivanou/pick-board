import type { MarketType } from '@/shared/config/markets'
import type { Sport } from '@/shared/config/sports'

export interface Outcome {
  id: string
  label: string
  odds: number
}

export interface Market {
  id: string
  type: MarketType
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
  key: number
  diff: number
  label: string
  dateLabel: string
  events: SportEvent[]
}
