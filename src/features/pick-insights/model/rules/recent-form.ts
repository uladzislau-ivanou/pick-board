import { isWon } from '@/entities/pick'

import { MESSAGES } from '../../config/messages'
import type { InsightRule } from '../insight'

export const recentFormRule: InsightRule = {
  id: 'recent-form',
  run: ({ lastFive, recentWins, allTimeRate }) => {
    if (recentWins < 4) return []

    const winners = lastFive.filter(isWon)
    const averageOdds = winners.reduce((total, pick) => total + pick.odds, 0) / winners.length

    return [{ tone: 'good', ...MESSAGES.recentForm(recentWins, allTimeRate, averageOdds) }]
  },
}
