/** In `shared` because both entities need it: `SportEvent.sport` and the pick draft. */
export type Sport = 'basketball' | 'football' | 'soccer' | 'baseball' | 'hockey'

export const SPORTS: readonly Sport[] = ['basketball', 'football', 'soccer', 'baseball', 'hockey']

export const SPORT_LABELS: Record<Sport, string> = {
  basketball: 'Basketball',
  football: 'Football',
  soccer: 'Soccer',
  baseball: 'Baseball',
  hockey: 'Hockey',
}
