import { currentStreak } from '@/entities/pick'

import { MESSAGES } from '../../config/messages'
import type { InsightRule } from '../insight'

export const winStreakRule: InsightRule = {
  id: 'win-streak',
  run: ({ resolved, averageStake }) => {
    const streak = currentStreak(resolved)
    if (streak?.status !== 'Won' || streak.length < 3) return []

    return [{ tone: 'good', ...MESSAGES.winStreak(streak.length, averageStake) }]
  },
}
