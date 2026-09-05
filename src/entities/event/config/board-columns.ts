import type { CSSProperties } from 'react'

import { MARKET_TYPES, type MarketType } from '@/shared/config/markets'

export const BOARD_COLUMNS: readonly MarketType[] = MARKET_TYPES

export const boardGridStyle: CSSProperties = {
  gridTemplateColumns: `minmax(0,1fr) repeat(${BOARD_COLUMNS.length}, var(--odds-col))`,
}
