import { useEffect, useState } from 'react'

const ADVANCE_MS = 5000

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const useAutoAdvance = (count: number, advance: () => void) => {
  const [paused, setPaused] = useState(false)
  const [stopped, setStopped] = useState(false)

  useEffect(() => {
    if (stopped || paused || count < 2 || prefersReducedMotion()) return

    const timer = window.setInterval(advance, ADVANCE_MS)
    return () => window.clearInterval(timer)
  }, [advance, count, paused, stopped])

  return {
    stop: () => setStopped(true),
    pauseHandlers: {
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onFocus: () => setPaused(true),
      onBlur: () => setPaused(false),
    },
  }
}
