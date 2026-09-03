import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('px-3', 'py-2')).toBe('px-3 py-2')
  })

  it('drops falsy values so conditional classes read inline', () => {
    const isHidden = false
    expect(cn('px-3', isHidden && 'hidden', undefined, null, 'py-2')).toBe('px-3 py-2')
  })

  it('lets the later class win a Tailwind conflict, so className overrides work', () => {
    expect(cn('bg-ground', 'bg-pb-brand')).toBe('bg-pb-brand')
    expect(cn('p-3', 'p-4')).toBe('p-4')
  })

  it('keeps non-conflicting utilities from the same group', () => {
    expect(cn('px-3', 'py-2', 'text-ink')).toBe('px-3 py-2 text-ink')
  })
})
