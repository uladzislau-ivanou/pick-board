import { resolvedPicks, type Pick } from '@/entities/pick'

import { MESSAGES } from '../config/messages'
import { buildContext } from '../lib/build-context'
import type { Insight } from './insight'
import { ALL_RULES } from './rules'

const MIN_RESOLVED = 3

export const getPickInsights = (picks: readonly Pick[], now: number = Date.now()): Insight[] => {
  const resolved = resolvedPicks(picks)
  if (resolved.length < MIN_RESOLVED) {
    return [{ tone: 'neutral', ...MESSAGES.notEnoughHistory() }]
  }

  const context = buildContext(resolved, now)
  const insights = ALL_RULES.flatMap((rule) => rule.run(context))

  if (insights.length > 0) return insights

  return [{ tone: 'neutral', ...MESSAGES.steadyForm(context.recentWins, context.allTimeRate) }]
}

export const getPickInsight = (picks: readonly Pick[], now?: number) =>
  getPickInsights(picks, now)[0]
