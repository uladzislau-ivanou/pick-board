import type { MarketType } from '@/shared/config/markets'

export type PickStatus = 'Pending' | 'Won' | 'Lost'

export interface Pick {
  id: string
  event: string
  market: MarketType
  selection: string
  odds: number
  stake: number
  status: PickStatus
  placedAt: number
  settledAt?: number
}

export type NewPick = Omit<Pick, 'id' | 'status' | 'placedAt'>
