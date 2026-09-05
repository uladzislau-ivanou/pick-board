import { HOUR, MINUTE } from '@/shared/lib/date'

import type { SportEvent } from '../model/types'

const SOON_MS = HOUR

const LIVE_MS = 3 * HOUR

export type KickoffState =
  { kind: 'ended' } | { kind: 'live' } | { kind: 'soon'; minutes: number } | { kind: 'scheduled' }

export const kickoffState = (kickoffAt: number, now: number): KickoffState => {
  const delta = kickoffAt - now
  if (delta <= -LIVE_MS) return { kind: 'ended' }
  if (delta <= 0) return { kind: 'live' }
  if (delta <= SOON_MS) return { kind: 'soon', minutes: Math.max(1, Math.round(delta / MINUTE)) }
  return { kind: 'scheduled' }
}

export const openEvents = (events: readonly SportEvent[], now: number) =>
  events.filter((event) => kickoffState(event.kickoffAt, now).kind !== 'ended')

export const liveEvents = (events: readonly SportEvent[], now: number) =>
  events.filter((event) => kickoffState(event.kickoffAt, now).kind === 'live')

export const nextKickoff = (events: readonly SportEvent[], now: number) =>
  events
    .filter((event) => event.kickoffAt > now)
    .reduce<SportEvent | undefined>(
      (earliest, event) =>
        earliest === undefined || event.kickoffAt < earliest.kickoffAt ? event : earliest,
      undefined,
    )
