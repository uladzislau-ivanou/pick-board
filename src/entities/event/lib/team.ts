import { TEAM_CRESTS } from '../config/team-crests'

/** Unmapped teams fall back to ink; the token, so no hex leaks out of the sheet. */
const FALLBACK_COLOR = 'var(--color-text)'

export interface Team {
  name: string
  /** Last word of the name: "Maple Leafs" → "Leafs". */
  short: string
  abbr: string
  color: string
}

export const team = (name: string): Team => {
  const crest = TEAM_CRESTS[name]
  return {
    name,
    short: name.split(' ').at(-1) ?? name,
    abbr: crest?.abbr ?? name.slice(0, 3).toUpperCase(),
    color: crest?.color ?? FALLBACK_COLOR,
  }
}
