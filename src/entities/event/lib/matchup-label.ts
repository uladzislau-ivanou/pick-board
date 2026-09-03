import { team } from './team'

/** "Nuggets @ Celtics" — the string a placed pick stores as its event. */
export const matchupLabel = (away: string, home: string) =>
  `${team(away).short} @ ${team(home).short}`
