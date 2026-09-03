import { DAY, startOfDay } from '@/shared/lib/date'
import { round2, sum } from '@/shared/lib/number'

import type { Pick, PickStatus } from '../model/types'
import type { PeriodRange } from './period'
import { isResolved, pickReturn, totalStaked } from './stats'

export interface DayBucket {
  day: number
  wonStake: number
  lostStake: number
  pendingStake: number
  staked: number
  returned: number
  net: number
  count: number
}

const stakeWithStatus = (picks: readonly Pick[], status: PickStatus) =>
  totalStaked(picks.filter((pick) => pick.status === status))

const toBucket = (day: number, picks: readonly Pick[]): DayBucket => {
  const returned = round2(sum(picks.map(pickReturn)))

  return {
    day,
    wonStake: stakeWithStatus(picks, 'Won'),
    lostStake: stakeWithStatus(picks, 'Lost'),
    pendingStake: stakeWithStatus(picks, 'Pending'),
    staked: totalStaked(picks),
    returned,
    net: round2(returned - totalStaked(picks.filter(isResolved))),
    count: picks.length,
  }
}

export const dailyBuckets = (picks: readonly Pick[], range: PeriodRange): DayBucket[] => {
  const byDay = new Map<number, Pick[]>()

  for (const pick of picks) {
    const day = startOfDay(pick.placedAt)
    if (day < range.startDay || day > range.endDay) continue

    const existing = byDay.get(day)
    if (existing) existing.push(pick)
    else byDay.set(day, [pick])
  }

  return Array.from({ length: range.spanDays }, (_, index) => {
    const day = range.startDay + index * DAY
    return toBucket(day, byDay.get(day) ?? [])
  })
}

export interface PeriodTotals {
  staked: number
  returned: number
  net: number
}

export const periodTotals = (buckets: readonly DayBucket[]): PeriodTotals => ({
  staked: round2(sum(buckets.map((bucket) => bucket.staked))),
  returned: round2(sum(buckets.map((bucket) => bucket.returned))),
  net: round2(sum(buckets.map((bucket) => bucket.net))),
})
