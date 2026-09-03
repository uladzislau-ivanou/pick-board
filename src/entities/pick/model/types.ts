import type { MarketType } from '@/shared/config/markets'

export type PickStatus = 'Pending' | 'Won' | 'Lost'

export interface Pick {
  id: string
  /** Display text such as "Nuggets @ Celtics". There is no `eventId`, which is
   *  why grouping several picks under one event is out of scope. */
  event: string
  market: MarketType
  selection: string
  /** Decimal odds, always > 1. */
  odds: number
  stake: number
  status: PickStatus
  placedAt: number
  settledAt?: number
}

/** What the Place Pick modal supplies; the provider fills in the rest. */
export type NewPick = Omit<Pick, 'id' | 'status' | 'placedAt'>
