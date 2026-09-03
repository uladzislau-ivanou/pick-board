import { MESSAGES } from '../../config/messages'
import type { InsightRule } from '../insight'

export const weekUpRule: InsightRule = {
  id: 'week-up',
  run: ({ weekPicks, weekNet }) => {
    if (weekPicks.length < 3 || weekNet <= 0) return []

    return [{ tone: 'good', ...MESSAGES.weekUp(weekNet, weekPicks.length) }]
  },
}
