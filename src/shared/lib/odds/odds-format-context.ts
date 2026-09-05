import { createContext, useContext } from 'react'

import type { OddsFormat } from './format-odds'

export interface OddsFormatState {
  format: OddsFormat
  select: (format: OddsFormat) => void
}

export const OddsFormatContext = createContext<OddsFormatState>({
  format: 'decimal',
  select: () => {},
})

export const useOddsFormat = () => useContext(OddsFormatContext)
