import type { MarketType } from '@/shared/config/markets'
import type { Sport } from '@/shared/config/sports'
import { DAY } from '@/shared/lib/date'

import type { SportEvent } from '../model/types'

type OutcomeSeed = readonly [string, number]

interface MarketSeed {
  type: MarketType
  name: string
  outcomes: readonly OutcomeSeed[]
}

interface EventSeed {
  sport: Sport
  league: string
  home: string
  away: string
  at: readonly [number, number, number]
  markets: readonly MarketSeed[]
}

// prettier-ignore
const SEEDS: readonly EventSeed[] = [
  { sport: 'basketball', league: 'NBA', home: 'Boston Celtics', away: 'Denver Nuggets', at: [0, 19, 30], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Celtics', 1.72], ['Nuggets', 2.2]] },
    { type: 'Spread', name: 'Spread', outcomes: [['Celtics -3.5', 1.91], ['Nuggets +3.5', 1.95]] },
    { type: 'Over/Under', name: 'Total points', outcomes: [['Over 224.5', 1.88], ['Under 224.5', 1.94]] },
  ] },
  { sport: 'football', league: 'NFL', home: 'Kansas City Chiefs', away: 'Buffalo Bills', at: [0, 20, 15], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Chiefs', 1.65], ['Bills', 2.35]] },
    { type: 'Spread', name: 'Spread', outcomes: [['Chiefs -2.5', 1.87], ['Bills +2.5', 1.98]] },
    { type: 'Over/Under', name: 'Total points', outcomes: [['Over 47.5', 1.9], ['Under 47.5', 1.92]] },
  ] },
  { sport: 'soccer', league: 'EPL', home: 'Arsenal', away: 'Liverpool', at: [0, 15, 0], markets: [
    { type: 'Moneyline', name: 'Match result', outcomes: [['Arsenal', 2.4], ['Draw', 3.45], ['Liverpool', 2.6]] },
    { type: 'Over/Under', name: 'Total goals', outcomes: [['Over 2.5', 1.8], ['Under 2.5', 2.05]] },
  ] },
  { sport: 'baseball', league: 'MLB', home: 'LA Dodgers', away: 'Chicago Cubs', at: [0, 18, 40], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Dodgers', 1.55], ['Cubs', 2.55]] },
    { type: 'Spread', name: 'Run line', outcomes: [['Dodgers -1.5', 2.05], ['Cubs +1.5', 1.8]] },
    { type: 'Over/Under', name: 'Total runs', outcomes: [['Over 8.5', 1.96], ['Under 8.5', 1.86]] },
  ] },
  { sport: 'hockey', league: 'NHL', home: 'Colorado Avalanche', away: 'Edmonton Oilers', at: [0, 21, 0], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Avalanche', 1.78], ['Oilers', 2.1]] },
    { type: 'Over/Under', name: 'Total goals', outcomes: [['Over 6.5', 1.92], ['Under 6.5', 1.9]] },
  ] },
  { sport: 'soccer', league: 'EPL', home: 'Manchester City', away: 'Chelsea', at: [1, 12, 30], markets: [
    { type: 'Moneyline', name: 'Match result', outcomes: [['City', 1.62], ['Draw', 4.1], ['Chelsea', 4.6]] },
    { type: 'Over/Under', name: 'Total goals', outcomes: [['Over 2.5', 1.68], ['Under 2.5', 2.25]] },
  ] },
  { sport: 'football', league: 'NFL', home: 'Dallas Cowboys', away: 'Philadelphia Eagles', at: [1, 16, 25], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Cowboys', 2.15], ['Eagles', 1.74]] },
    { type: 'Spread', name: 'Spread', outcomes: [['Cowboys +3.5', 1.89], ['Eagles -3.5', 1.93]] },
  ] },
  { sport: 'basketball', league: 'NBA', home: 'Milwaukee Bucks', away: 'Golden State Warriors', at: [1, 19, 0], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Bucks', 1.8], ['Warriors', 2.08]] },
    { type: 'Over/Under', name: 'Total points', outcomes: [['Over 231.5', 1.91], ['Under 231.5', 1.91]] },
  ] },
  { sport: 'hockey', league: 'NHL', home: 'Toronto Maple Leafs', away: 'Vegas Golden Knights', at: [1, 19, 0], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Leafs', 1.95], ['Knights', 1.9]] },
    { type: 'Over/Under', name: 'Total goals', outcomes: [['Over 6.5', 1.86], ['Under 6.5', 1.96]] },
  ] },
  { sport: 'baseball', league: 'MLB', home: 'Houston Astros', away: 'New York Yankees', at: [1, 20, 10], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Astros', 1.88], ['Yankees', 1.98]] },
    { type: 'Over/Under', name: 'Total runs', outcomes: [['Over 7.5', 1.92], ['Under 7.5', 1.9]] },
  ] },
  { sport: 'basketball', league: 'NBA', home: 'New York Knicks', away: 'Miami Heat', at: [2, 19, 30], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Knicks', 1.68], ['Heat', 2.28]] },
    { type: 'Spread', name: 'Spread', outcomes: [['Knicks -4.5', 1.9], ['Heat +4.5', 1.92]] },
  ] },
  { sport: 'football', league: 'NFL', home: 'Green Bay Packers', away: 'Detroit Lions', at: [2, 13, 0], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Packers', 1.96], ['Lions', 1.9]] },
    { type: 'Over/Under', name: 'Total points', outcomes: [['Over 44.5', 1.87], ['Under 44.5', 1.95]] },
  ] },
  { sport: 'soccer', league: 'EPL', home: 'Newcastle United', away: 'Tottenham Hotspur', at: [3, 10, 0], markets: [
    { type: 'Moneyline', name: 'Match result', outcomes: [['Newcastle', 2.05], ['Draw', 3.6], ['Tottenham', 3.3]] },
    { type: 'Over/Under', name: 'Total goals', outcomes: [['Over 2.5', 1.74], ['Under 2.5', 2.12]] },
  ] },
  { sport: 'hockey', league: 'NHL', home: 'New Jersey Devils', away: 'New York Rangers', at: [3, 19, 0], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Devils', 1.85], ['Rangers', 2.0]] },
    { type: 'Over/Under', name: 'Total goals', outcomes: [['Over 6.5', 1.9], ['Under 6.5', 1.92]] },
  ] },
  { sport: 'basketball', league: 'NBA', home: 'Los Angeles Lakers', away: 'Phoenix Suns', at: [4, 22, 0], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Lakers', 1.74], ['Suns', 2.12]] },
    { type: 'Spread', name: 'Spread', outcomes: [['Lakers -3.5', 1.92], ['Suns +3.5', 1.9]] },
  ] },
  { sport: 'football', league: 'NFL', home: 'Seattle Seahawks', away: 'San Francisco 49ers', at: [4, 20, 20], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Seahawks', 2.2], ['49ers', 1.7]] },
    { type: 'Over/Under', name: 'Total points', outcomes: [['Over 42.5', 1.88], ['Under 42.5', 1.94]] },
  ] },
  { sport: 'soccer', league: 'EPL', home: 'Everton', away: 'Manchester United', at: [5, 11, 0], markets: [
    { type: 'Moneyline', name: 'Match result', outcomes: [['Everton', 3.1], ['Draw', 3.4], ['United', 2.25]] },
    { type: 'Over/Under', name: 'Total goals', outcomes: [['Over 2.5', 1.95], ['Under 2.5', 1.88]] },
  ] },
  { sport: 'hockey', league: 'NHL', home: 'Washington Capitals', away: 'Carolina Hurricanes', at: [5, 19, 30], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Capitals', 2.05], ['Hurricanes', 1.82]] },
    { type: 'Over/Under', name: 'Total goals', outcomes: [['Over 6.5', 1.94], ['Under 6.5', 1.88]] },
  ] },
  { sport: 'baseball', league: 'MLB', home: 'New York Mets', away: 'Atlanta Braves', at: [6, 13, 10], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Mets', 2.0], ['Braves', 1.86]] },
    { type: 'Over/Under', name: 'Total runs', outcomes: [['Over 8.5', 1.9], ['Under 8.5', 1.92]] },
  ] },
  { sport: 'basketball', league: 'NBA', home: 'Dallas Mavericks', away: 'Oklahoma City Thunder', at: [6, 20, 0], markets: [
    { type: 'Moneyline', name: 'Moneyline', outcomes: [['Mavericks', 2.45], ['Thunder', 1.58]] },
    { type: 'Over/Under', name: 'Total points', outcomes: [['Over 228.5', 1.9], ['Under 228.5', 1.92]] },
  ] },
]

const kickoffAt = (now: number, [dayOffset, hour, minute]: EventSeed['at']) => {
  const date = new Date(now)
  date.setHours(hour, minute, 0, 0)
  return date.getTime() + dayOffset * DAY
}

export const getEvents = (now: number): SportEvent[] =>
  SEEDS.map((seed, eventIndex) => {
    const id = `e${eventIndex + 1}`
    return {
      id,
      sport: seed.sport,
      league: seed.league,
      home: seed.home,
      away: seed.away,
      kickoffAt: kickoffAt(now, seed.at),
      markets: seed.markets.map((market, marketIndex) => {
        const marketId = `${id}-m${marketIndex + 1}`
        return {
          id: marketId,
          type: market.type,
          name: market.name,
          outcomes: market.outcomes.map(([label, odds], outcomeIndex) => ({
            id: `${marketId}-o${outcomeIndex + 1}`,
            label,
            odds,
          })),
        }
      }),
    }
  })
