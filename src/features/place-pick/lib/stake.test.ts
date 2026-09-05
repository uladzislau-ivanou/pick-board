import { describe, expect, it } from 'vitest'

import { sanitizeStake, validateStake } from './stake'

describe('sanitizeStake', () => {
  it('keeps digits and a decimal point', () => {
    expect(sanitizeStake('12.50')).toBe('12.50')
  })

  it('drops anything else the user types or pastes', () => {
    expect(sanitizeStake('$25')).toBe('25')
    expect(sanitizeStake('1e5')).toBe('15')
    expect(sanitizeStake('-10')).toBe('10')
    expect(sanitizeStake('abc')).toBe('')
  })

  it('collapses extra decimal points instead of leaving an unparseable value', () => {
    expect(sanitizeStake('1.2.3')).toBe('1.23')
    expect(sanitizeStake('..5')).toBe('.5')
  })

  it('allows a partially typed amount', () => {
    expect(sanitizeStake('10.')).toBe('10.')
    expect(sanitizeStake('')).toBe('')
  })
})

describe('validateStake', () => {
  it('accepts a positive amount', () => {
    expect(validateStake('10')).toEqual({ amount: 10, error: null })
    expect(validateStake('0.05')).toEqual({ amount: 0.05, error: null })
  })

  it('asks for a stake when the field is empty', () => {
    expect(validateStake('')).toEqual({ amount: 0, error: 'Enter a stake to continue.' })
    expect(validateStake('   ')).toEqual({ amount: 0, error: 'Enter a stake to continue.' })
  })

  it('rejects zero and anything unparseable', () => {
    expect(validateStake('0').error).toBe('Stake must be greater than 0.')
    expect(validateStake('0.00').error).toBe('Stake must be greater than 0.')
    expect(validateStake('.').error).toBe('Stake must be greater than 0.')
  })

  it('reports 0 as the amount whenever there is an error', () => {
    expect(validateStake('0').amount).toBe(0)
    expect(validateStake('').amount).toBe(0)
  })
})
