import { describe, expect, it } from 'vitest'

import type { DayBucket } from '@/entities/pick'

import { netDomain, withCumulativeNet } from './cumulative-net'

const bucket = (day: number, net: number): DayBucket => ({
  day,
  wonStake: 0,
  lostStake: 0,
  pendingStake: 0,
  staked: 0,
  returned: 0,
  net,
  count: 0,
})

describe('withCumulativeNet', () => {
  it('runs the daily net forward, so the last point is the period result', () => {
    const points = withCumulativeNet([bucket(1, 10), bucket(2, -4), bucket(3, 2.5)])

    expect(points.map((point) => point.cumulativeNet)).toEqual([10, 6, 8.5])
  })

  it('keeps the running total off floating-point dust', () => {
    const points = withCumulativeNet([bucket(1, 0.1), bucket(2, 0.2)])

    expect(points[1].cumulativeNet).toBe(0.3)
  })

  it('stays flat through days with no settled picks', () => {
    const points = withCumulativeNet([bucket(1, 12), bucket(2, 0), bucket(3, 0)])

    expect(points.map((point) => point.cumulativeNet)).toEqual([12, 12, 12])
  })
})

describe('netDomain', () => {
  it('always includes the zero line, so up and down are readable', () => {
    const up = netDomain(withCumulativeNet([bucket(1, 10), bucket(2, 5)]))
    expect(up[0]).toBeLessThanOrEqual(0)

    const down = netDomain(withCumulativeNet([bucket(1, -10), bucket(2, -5)]))
    expect(down[1]).toBeGreaterThanOrEqual(0)
  })

  it('pads a flat series so the line is not drawn on the axis', () => {
    const [min, max] = netDomain(withCumulativeNet([bucket(1, 0)]))

    expect(max - min).toBeGreaterThan(0)
  })
})
