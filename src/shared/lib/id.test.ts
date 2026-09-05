import { describe, expect, it } from 'vitest'

import { createId } from './id'

describe('createId', () => {
  it('keeps the prefix so ids are readable in devtools', () => {
    expect(createId('pick')).toMatch(/^pick-/)
  })

  it('does not repeat itself', () => {
    const ids = new Set(Array.from({ length: 500 }, () => createId('pick')))
    expect(ids.size).toBe(500)
  })
})
