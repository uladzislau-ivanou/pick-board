import { useCallback, useMemo, type ReactNode } from 'react'

import { useLocalStorageState } from '@/shared/lib/use-local-storage-state'

import { ODDS_FORMAT_LABELS, type OddsFormat } from './format-odds'
import { OddsFormatContext } from './odds-format-context'

const STORAGE_KEY = 'pickboard.odds-format'

const DEFAULT_FORMAT: OddsFormat = 'decimal'

const isOddsFormat = (value: unknown): value is OddsFormat =>
  typeof value === 'string' && value in ODDS_FORMAT_LABELS

export const OddsFormatProvider = ({ children }: { children: ReactNode }) => {
  const [stored, setStored] = useLocalStorageState<OddsFormat>(STORAGE_KEY, () => DEFAULT_FORMAT)
  const format = isOddsFormat(stored) ? stored : DEFAULT_FORMAT
  const select = useCallback((next: OddsFormat) => setStored(next), [setStored])
  const value = useMemo(() => ({ format, select }), [format, select])

  return <OddsFormatContext.Provider value={value}>{children}</OddsFormatContext.Provider>
}
