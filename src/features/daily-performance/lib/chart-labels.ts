import type { DayBucket, PickPeriod } from '@/entities/pick'
import { formatDayWithDate } from '@/shared/lib/date'
import { formatMoney, formatSigned } from '@/shared/lib/money'
import { plural } from '@/shared/lib/text'

export const periodTitle = (period: PickPeriod, spanDays: number) =>
  period === 'all' ? `All time · ${plural(spanDays, 'day')}` : `Last ${plural(spanDays, 'day')}`

/** The figures a column carries as text, for hover and for screen readers alike. */
export const dayFigures = (bucket: DayBucket) =>
  bucket.count === 0
    ? `${formatDayWithDate(bucket.day)}: no picks`
    : `${formatDayWithDate(bucket.day)}: staked ${formatMoney(bucket.staked)} · returned ${formatMoney(bucket.returned)} · net ${formatSigned(bucket.net)} (${plural(bucket.count, 'pick')})`

export const dayActionHint = (selected: boolean) =>
  selected ? ' — filtering the list below' : ' — click to filter the list'

const hasSettled = (bucket: DayBucket) => bucket.wonStake > 0 || bucket.lostStake > 0

/** Blank for an empty day, "open" while nothing has settled. */
export const netLabel = (bucket: DayBucket) => {
  if (bucket.count === 0) return ''
  if (!hasSettled(bucket)) return 'open'
  return formatSigned(bucket.net)
}

export const netColor = (bucket: DayBucket) => {
  if (!hasSettled(bucket)) return 'text-ink/45'
  if (bucket.net > 0) return 'text-pb-win'
  if (bucket.net < 0) return 'text-pb-loss'
  return 'text-ink'
}

/** Past ten days the per-column figures stop fitting, so they move to the hover label. */
export const isDense = (spanDays: number) => spanDays > 10

export const labelEvery = (spanDays: number) => Math.ceil(spanDays / 7)
