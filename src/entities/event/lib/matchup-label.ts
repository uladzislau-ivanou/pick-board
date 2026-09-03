import { team } from './team'

export const matchupLabel = (away: string, home: string) =>
  `${team(away).short} @ ${team(home).short}`
