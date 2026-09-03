import { DAY } from '@/shared/lib/date'

import type { Pick } from '../model/types'

const SETTLE_DELAY = 4 * 60 * 60 * 1000

type SeedRow = Omit<Pick, 'placedAt' | 'settledAt'> & { daysAgo: number }

const ROWS: readonly SeedRow[] = [
  {
    id: 'h1',
    daysAgo: 6,
    event: 'Heat vs Knicks',
    market: 'Moneyline',
    selection: 'Knicks',
    odds: 1.8,
    stake: 25,
    status: 'Won',
  },
  {
    id: 'h2',
    daysAgo: 6,
    event: 'Heat vs Knicks',
    market: 'Over/Under',
    selection: 'Under 211.5',
    odds: 1.92,
    stake: 20,
    status: 'Lost',
  },
  {
    id: 'h3',
    daysAgo: 5,
    event: 'Eagles vs Cowboys',
    market: 'Spread',
    selection: 'Eagles -1.5',
    odds: 1.95,
    stake: 30,
    status: 'Won',
  },
  {
    id: 'h4',
    daysAgo: 4,
    event: 'Padres vs Giants',
    market: 'Over/Under',
    selection: 'Under 7.5',
    odds: 1.88,
    stake: 15,
    status: 'Lost',
  },
  {
    id: 'h5',
    daysAgo: 3,
    event: 'Bucks vs Sixers',
    market: 'Moneyline',
    selection: 'Bucks',
    odds: 1.7,
    stake: 40,
    status: 'Won',
  },
  {
    id: 'h6',
    daysAgo: 3,
    event: 'City vs Spurs',
    market: 'Over/Under',
    selection: 'Under 3.5',
    odds: 2.02,
    stake: 20,
    status: 'Lost',
  },
  {
    id: 'h7',
    daysAgo: 2,
    event: 'Jets vs Dolphins',
    market: 'Spread',
    selection: 'Dolphins -4.5',
    odds: 1.86,
    stake: 25,
    status: 'Won',
  },
  {
    id: 'h8',
    daysAgo: 2,
    event: 'Rangers vs Devils',
    market: 'Moneyline',
    selection: 'Rangers',
    odds: 1.75,
    stake: 20,
    status: 'Won',
  },
  {
    id: 'h9',
    daysAgo: 1,
    event: 'Astros vs Rangers',
    market: 'Over/Under',
    selection: 'Under 9.5',
    odds: 1.9,
    stake: 30,
    status: 'Lost',
  },
  {
    id: 'h10',
    daysAgo: 1,
    event: 'Lakers vs Suns',
    market: 'Moneyline',
    selection: 'Lakers',
    odds: 2.05,
    stake: 25,
    status: 'Won',
  },
]

const toPick = ({ daysAgo, ...row }: SeedRow, now: number): Pick => {
  const placedAt = now - daysAgo * DAY
  return { ...row, placedAt, settledAt: placedAt + SETTLE_DELAY }
}

export const getSeedPicks = (now: number): Pick[] =>
  ROWS.map((row) => toPick(row, now)).sort((a, b) => b.placedAt - a.placedAt)
