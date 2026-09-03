import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getSeedPicks } from '@/entities/pick'

import { PickPatternCard } from './PickPatternCard'

const NOW = new Date(2026, 8, 3, 12).getTime()
const seeded = getSeedPicks(NOW)

// fireEvent throughout: user-event awaits internally and deadlocks on fake timers.
const tick = (ms: number) => act(() => void vi.advanceTimersByTime(ms))
const counter = () => screen.getByText(/^Pattern \d+ \/ \d+$/).textContent

describe('PickPatternCard auto-advance', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('moves to the next pattern every five seconds', () => {
    render(<PickPatternCard picks={seeded} now={NOW} />)
    expect(counter()).toBe('Pattern 1 / 4')

    tick(5000)
    expect(counter()).toBe('Pattern 2 / 4')

    tick(5000)
    expect(counter()).toBe('Pattern 3 / 4')
  })

  it('holds still at four seconds, so the interval is not a shorter one', () => {
    render(<PickPatternCard picks={seeded} now={NOW} />)

    tick(4000)
    expect(counter()).toBe('Pattern 1 / 4')
  })

  it('pauses while the card is hovered, and resumes on leave', () => {
    render(<PickPatternCard picks={seeded} now={NOW} />)
    const card = screen.getByRole('region', { name: 'Pattern' })

    fireEvent.mouseEnter(card)
    tick(15000)
    expect(counter()).toBe('Pattern 1 / 4')

    fireEvent.mouseLeave(card)
    tick(5000)
    expect(counter()).toBe('Pattern 2 / 4')
  })

  it('pauses while a control inside it has focus', () => {
    render(<PickPatternCard picks={seeded} now={NOW} />)

    fireEvent.focus(screen.getByRole('button', { name: 'Next pattern' }))
    tick(15000)
    expect(counter()).toBe('Pattern 1 / 4')
  })

  /** Once someone drives it by hand, moving on its own would fight them. */
  it('stops for good after the user picks a pattern', () => {
    render(<PickPatternCard picks={seeded} now={NOW} />)

    fireEvent.click(screen.getByRole('button', { name: 'Next pattern' }))
    expect(counter()).toBe('Pattern 2 / 4')

    tick(30000)
    expect(counter()).toBe('Pattern 2 / 4')
  })

  it('never starts for a reader who asked for reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList)

    render(<PickPatternCard picks={seeded} now={NOW} />)
    tick(30000)
    expect(counter()).toBe('Pattern 1 / 4')
  })
})
