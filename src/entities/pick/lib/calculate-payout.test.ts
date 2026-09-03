import { describe, expect, it } from 'vitest'

import { calculatePayout, calculateProfit } from './calculate-payout'

describe('calculatePayout', () => {
  it('multiplies stake by decimal odds', () => {
    expect(calculatePayout(10, 2.5)).toBe(25)
  })

  it('rounds to two decimals', () => {
    expect(calculatePayout(10, 1.72)).toBe(17.2)
    expect(calculatePayout(0.05, 3)).toBe(0.15)
    expect(calculatePayout(20, 1.92)).toBe(38.4)
  })

  it('is 0 for a stake that is not positive', () => {
    expect(calculatePayout(0, 2)).toBe(0)
    expect(calculatePayout(-5, 2)).toBe(0)
  })

  it('is 0 for odds that cannot return a profit', () => {
    expect(calculatePayout(10, 1)).toBe(0)
    expect(calculatePayout(10, 0.5)).toBe(0)
  })

  it('is 0 for values that are not finite numbers', () => {
    expect(calculatePayout(Number.NaN, 2)).toBe(0)
    expect(calculatePayout(10, Number.NaN)).toBe(0)
    expect(calculatePayout(Number.POSITIVE_INFINITY, 2)).toBe(0)
  })
})

describe('calculateProfit', () => {
  it('is the payout less the stake', () => {
    expect(calculateProfit(10, 2.4)).toBe(14)
    expect(calculateProfit(20, 1.92)).toBe(18.4)
  })

  it('is 0 whenever the payout is 0', () => {
    expect(calculateProfit(0, 2)).toBe(0)
    expect(calculateProfit(10, 1)).toBe(0)
  })
})
