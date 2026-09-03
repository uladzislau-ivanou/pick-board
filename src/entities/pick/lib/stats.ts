import type { MarketType } from '@/shared/config/markets'
import { round2, sum } from '@/shared/lib/number'

import type { Pick } from '../model/types'
import { calculatePayout } from './calculate-payout'

export const isPending = (pick: Pick) => pick.status === 'Pending'

export const isResolved = (pick: Pick) => pick.status !== 'Pending'

export const isWon = (pick: Pick) => pick.status === 'Won'

/** What a settled pick actually returned: the payout if it won, nothing if it lost. */
export const pickReturn = (pick: Pick) => (isWon(pick) ? calculatePayout(pick.stake, pick.odds) : 0)

export const pendingPicks = (picks: readonly Pick[]) => picks.filter(isPending)

/** Resolved picks, newest first — the order every insight rule reads. */
export const resolvedPicks = (picks: readonly Pick[]) =>
  picks.filter(isResolved).sort((a, b) => b.placedAt - a.placedAt)

export const totalStaked = (picks: readonly Pick[]) => round2(sum(picks.map((pick) => pick.stake)))

export const pendingPayout = (picks: readonly Pick[]) =>
  round2(sum(pendingPicks(picks).map((pick) => calculatePayout(pick.stake, pick.odds))))

export const averageStake = (picks: readonly Pick[]) =>
  picks.length === 0 ? 0 : round2(totalStaked(picks) / picks.length)

/** `null` rather than 0 when nothing has resolved: "no data" must not read as "0%". */
export const winRate = (picks: readonly Pick[]) => {
  const resolved = picks.filter(isResolved)
  if (resolved.length === 0) return null
  return resolved.filter(isWon).length / resolved.length
}

/** Returned minus staked across resolved picks only; pending stake is not at a loss yet. */
export const netReturn = (picks: readonly Pick[]) => {
  const resolved = picks.filter(isResolved)
  return round2(sum(resolved.map(pickReturn)) - totalStaked(resolved))
}

/** The run of identical results at the newest end, or `null` with nothing resolved. */
export const currentStreak = (picks: readonly Pick[]) => {
  const resolved = resolvedPicks(picks)
  const newest = resolved[0]
  if (!newest) return null

  let length = 1
  while (length < resolved.length && resolved[length].status === newest.status) length += 1
  return { status: newest.status, length }
}

/** Only markets actually present, so callers never handle empty groups. */
export const groupByMarket = (picks: readonly Pick[]) => {
  const groups = new Map<MarketType, Pick[]>()
  for (const pick of picks) {
    const existing = groups.get(pick.market)
    if (existing) existing.push(pick)
    else groups.set(pick.market, [pick])
  }
  return groups
}
