import { describe, expect, it } from 'vitest'

import { clamp, round2, sum } from './number'

describe('sum', () => {
  it('adds the values', () => {
    expect(sum([25, 20, 30])).toBe(75)
  })

  it('is 0 for an empty list', () => {
    expect(sum([])).toBe(0)
  })
})

describe('round2', () => {
  it('rounds to cents', () => {
    expect(round2(17.2)).toBe(17.2)
    expect(round2(38.399999999999999)).toBe(38.4)
    expect(round2(0.155)).toBe(0.16)
  })

  it('removes floating point drift from a sum', () => {
    expect(round2(0.1 + 0.2)).toBe(0.3)
  })
})

describe('clamp', () => {
  it('keeps a value inside the range', () => {
    expect(clamp(5, 7, 45)).toBe(7)
    expect(clamp(60, 7, 45)).toBe(45)
    expect(clamp(30, 7, 45)).toBe(30)
  })
})
