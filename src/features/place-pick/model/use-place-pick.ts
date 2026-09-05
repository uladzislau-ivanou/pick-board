import { useState } from 'react'

import { DEFAULT_STAKE } from '@/shared/config/app'

import { sanitizeStake } from '../lib/stake'
import type { PickDraft } from './types'

export const usePlacePick = () => {
  const [draft, setDraft] = useState<PickDraft | null>(null)
  const [stake, setStake] = useState(DEFAULT_STAKE)

  return {
    draft,
    stake,
    open: (next: PickDraft) => {
      setDraft(next)
      setStake(DEFAULT_STAKE)
    },
    close: () => setDraft(null),
    changeStake: (value: string) => setStake(sanitizeStake(value)),
  }
}
