import { TEAM_CRESTS } from '../config/team-crests'

const FALLBACK_COLOR = 'var(--color-text)'

export interface Team {
  name: string
  short: string
  abbr: string
  color: string
  color2: string
}

export const team = (name: string): Team => {
  const crest = TEAM_CRESTS[name]
  return {
    name,
    short: name.split(' ').at(-1) ?? name,
    abbr: crest?.abbr ?? name.slice(0, 3).toUpperCase(),
    color: crest?.color ?? FALLBACK_COLOR,
    color2: crest?.color2 ?? crest?.color ?? FALLBACK_COLOR,
  }
}
