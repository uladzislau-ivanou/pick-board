import { MESSAGES } from '../../config/messages'
import type { InsightRule } from '../insight'

export const coldPatchRule: InsightRule = {
  id: 'cold-patch',
  run: ({ recentWins, byMarket }) => {
    if (recentWins > 1) return []

    return [{ tone: 'bad', ...MESSAGES.coldPatch(recentWins, byMarket.size) }]
  },
}
