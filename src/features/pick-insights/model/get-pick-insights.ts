import { resolvedPicks, type Pick } from '@/entities/pick'

import { MESSAGES } from '../config/messages'
import { buildContext } from '../lib/build-context'
import type { Insight } from './insight'
import { ALL_RULES } from './rules'

const MIN_RESOLVED = 3

/**
 * Every pattern that fires, positives before warnings. Pending picks are
 * excluded; `now` is injected so the week-to-date rules are deterministic.
 *
 * One message is a fortune cookie; a ranked set is a read.
 */
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

/** The brief's single-headline API: the strongest pattern. */
export const getPickInsight = (picks: readonly Pick[], now?: number) =>
  getPickInsights(picks, now)[0]
