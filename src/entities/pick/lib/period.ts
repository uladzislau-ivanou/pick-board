import { DAY, startOfDay } from '@/shared/lib/date'
import { clamp } from '@/shared/lib/number'
import { plural } from '@/shared/lib/text'

import type { Pick } from '../model/types'

export type PickPeriod = '7d' | '30d' | 'all'

const FIXED_DAYS: Record<'7d' | '30d', number> = { '7d': 7, '30d': 30 }

const ALL_MIN_DAYS = 7
const ALL_MAX_DAYS = 45

const allTimeSpan = (picks: readonly Pick[], todayStart: number) => {
  if (picks.length === 0) return ALL_MIN_DAYS
  const earliest = Math.min(...picks.map((pick) => startOfDay(pick.placedAt)))
  return clamp((todayStart - earliest) / DAY + 1, ALL_MIN_DAYS, ALL_MAX_DAYS)
}

export interface PeriodRange {
  spanDays: number
  startDay: number
  endDay: number
}

export const periodRange = (
  period: PickPeriod,
  picks: readonly Pick[],
  now: number,
): PeriodRange => {
  const endDay = startOfDay(now)
  const spanDays = period === 'all' ? allTimeSpan(picks, endDay) : FIXED_DAYS[period]
  return { spanDays, startDay: endDay - (spanDays - 1) * DAY, endDay }
}

export const isInPeriod = (pick: Pick, range: PeriodRange) => {
  const day = startOfDay(pick.placedAt)
  return day >= range.startDay && day <= range.endDay
}

export const periodLabel = (period: PickPeriod, spanDays: number) =>
  period === 'all' ? `All time · ${plural(spanDays, 'day')}` : `Last ${plural(spanDays, 'day')}`
