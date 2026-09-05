import type { DayBucket } from '@/entities/pick'
import { formatDayWithDate } from '@/shared/lib/date'
import { formatMoney, formatSigned } from '@/shared/lib/money'
import { plural } from '@/shared/lib/text'

export const dayFigures = (bucket: DayBucket) =>
  bucket.count === 0
    ? `${formatDayWithDate(bucket.day)}: no picks`
    : `${formatDayWithDate(bucket.day)}: staked ${formatMoney(bucket.staked)} · returned ${formatMoney(bucket.returned)} · net ${formatSigned(bucket.net)} (${plural(bucket.count, 'pick')})`

export const dayActionHint = (selected: boolean) =>
  selected ? ' — filtering the list below' : ' — click to filter the list'

export const isDense = (spanDays: number) => spanDays > 10

export const labelEvery = (spanDays: number) => Math.ceil(spanDays / 7)
