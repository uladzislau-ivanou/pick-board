import { averageStake } from '@/entities/pick'

import { MESSAGES } from '../../config/messages'
import type { InsightRule } from '../insight'

const CREEP_FACTOR = 1.5

export const stakeCreepRule: InsightRule = {
  id: 'stake-creep',
  run: ({ resolved, averageStake: allTimeAverage }) => {
    const recentAverage = averageStake(resolved.slice(0, 3))
    if (allTimeAverage <= 0 || recentAverage <= allTimeAverage * CREEP_FACTOR) return []

    return [{ tone: 'bad', ...MESSAGES.stakeCreep(recentAverage, allTimeAverage) }]
  },
}
