import { MESSAGES } from '../../config/messages'
import type { InsightRule } from '../insight'

export const weekDownRule: InsightRule = {
  id: 'week-down',
  run: ({ weekPicks, weekNet }) => {
    if (weekPicks.length < 3 || weekNet >= 0) return []

    return [{ tone: 'bad', ...MESSAGES.weekDown(weekNet, weekPicks.length) }]
  },
}
