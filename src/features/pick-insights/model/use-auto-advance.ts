import { useEffect, useState } from 'react'

const ADVANCE_MS = 5000

/** Guarded: `matchMedia` is absent in jsdom and during server rendering. */
const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Rotates the pattern card, with the three brakes that auto-moving content
 * needs. It pauses while the card is hovered or focused, so it never moves out
 * from under someone reading it; it stops for good once the user drives the
 * carousel themselves; and it never starts at all for a reader who has asked
 * for reduced motion. WCAG 2.2.2 requires a way to pause anything that moves on
 * its own for longer than five seconds.
 */
export const useAutoAdvance = (count: number, advance: () => void) => {
  const [paused, setPaused] = useState(false)
  const [stopped, setStopped] = useState(false)

  useEffect(() => {
    if (stopped || paused || count < 2 || prefersReducedMotion()) return

    const timer = window.setInterval(advance, ADVANCE_MS)
    return () => window.clearInterval(timer)
  }, [advance, count, paused, stopped])

  return {
    /** The user has taken the wheel; do not move on our own again. */
    stop: () => setStopped(true),
    pauseHandlers: {
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      // React maps these to focusin/focusout, so a focused child pauses too.
      onFocus: () => setPaused(true),
      onBlur: () => setPaused(false),
    },
  }
}
