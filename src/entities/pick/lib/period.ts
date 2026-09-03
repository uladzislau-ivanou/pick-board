import { clamp } from '@/shared/lib/number'
import { DAY, startOfDay } from '@/shared/lib/date'

import type { Pick } from '../model/types'

export type PickPeriod = '7d' | '30d' | 'all'

const FIXED_DAYS: Record<'7d' | '30d', number> = { '7d': 7, '30d': 30 }

/** "All" still needs a chart width: at least a week, at most a readable month and a half. */
const ALL_MIN_DAYS = 7
const ALL_MAX_DAYS = 45

const allTimeSpan = (picks: readonly Pick[], todayStart: number) => {
  if (picks.length === 0) return ALL_MIN_DAYS
  const earliest = Math.min(...picks.map((pick) => startOfDay(pick.placedAt)))
  return clamp((todayStart - earliest) / DAY + 1, ALL_MIN_DAYS, ALL_MAX_DAYS)
}

export interface PeriodRange {
  /** Number of days the window covers, inclusive of today. */
  spanDays: number
  /** Local midnight of the first day in the window. */
  startDay: number
  /** Local midnight of today. */
  endDay: number
}

/** The day window a period covers, always ending today. */
export const periodRange = (
  period: PickPeriod,
  picks: readonly Pick[],
  now: number,
): PeriodRange => {
  const endDay = startOfDay(now)
  const spanDays = period === 'all' ? allTimeSpan(picks, endDay) : FIXED_DAYS[period]
  return { spanDays, startDay: endDay - (spanDays - 1) * DAY, endDay }
}

export const isInPeriod = (pick: Pick, range: PeriodRange) =>
  startOfDay(pick.placedAt) >= range.startDay
