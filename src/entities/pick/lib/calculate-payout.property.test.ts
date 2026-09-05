import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import { calculatePayout, calculateProfit } from './calculate-payout'

const stake = fc.integer({ min: 1, max: 1_000_000 }).map((cents) => cents / 100)
const odds = fc.integer({ min: 101, max: 100_000 }).map((hundredths) => hundredths / 100)

describe('calculatePayout properties', () => {
  it('never returns more than two decimal places', () => {
    fc.assert(
      fc.property(stake, odds, (amount, price) => {
        const payout = calculatePayout(amount, price)
        expect(Number.isInteger(Math.round(payout * 100))).toBe(true)
        expect(payout).toBe(Math.round(payout * 100) / 100)
      }),
    )
  })

  it('never returns less than the stake when the odds beat evens', () => {
    fc.assert(
      fc.property(stake, odds, (amount, price) => {
        expect(calculatePayout(amount, price)).toBeGreaterThanOrEqual(amount)
      }),
    )
  })

  it('returns a real profit once the stake clears a cent of rounding', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 1_000_000 }).map((cents) => cents / 100),
        odds,
        (amount, price) => {
          expect(calculatePayout(amount, price)).toBeGreaterThan(amount)
        },
      ),
    )
  })

  it('never decreases when the stake grows', () => {
    fc.assert(
      fc.property(stake, stake, odds, (a, b, price) => {
        const [smaller, larger] = a <= b ? [a, b] : [b, a]
        expect(calculatePayout(larger, price)).toBeGreaterThanOrEqual(
          calculatePayout(smaller, price),
        )
      }),
    )
  })

  it('is the profit plus the stake, to the cent', () => {
    fc.assert(
      fc.property(stake, odds, (amount, price) => {
        const payout = calculatePayout(amount, price)
        expect(Math.abs(payout - (calculateProfit(amount, price) + amount))).toBeLessThan(0.01)
      }),
    )
  })

  it('is 0 for any stake or odds that cannot return a profit', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000, max: 0, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (badStake, badOdds) => {
          expect(calculatePayout(badStake, 2)).toBe(0)
          expect(calculatePayout(10, badOdds)).toBe(0)
        },
      ),
    )
  })
})
