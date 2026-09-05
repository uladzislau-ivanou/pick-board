import type { DayBucket } from '@/entities/pick'
import { round2 } from '@/shared/lib/number'

export interface NetPoint extends DayBucket {
  cumulativeNet: number
}

export const withCumulativeNet = (buckets: readonly DayBucket[]): NetPoint[] => {
  let running = 0
  return buckets.map((bucket) => {
    running = round2(running + bucket.net)
    return { ...bucket, cumulativeNet: running }
  })
}

export const netDomain = (points: readonly NetPoint[]): [number, number] => {
  const values = points.map((point) => point.cumulativeNet)
  const max = Math.max(0, ...values)
  const min = Math.min(0, ...values)
  const pad = Math.max((max - min) * 0.2, 1)
  return [min - pad, max + pad]
}
