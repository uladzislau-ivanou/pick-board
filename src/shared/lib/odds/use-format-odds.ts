import { useCallback } from 'react'

import { formatOdds } from './format-odds'
import { useOddsFormat } from './odds-format-context'

export const useFormatOdds = () => {
  const { format } = useOddsFormat()
  return useCallback((odds: number) => formatOdds(odds, format), [format])
}
