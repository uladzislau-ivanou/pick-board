export interface TeamCrest {
  abbr: string
  color: string
}

/**
 * Monogram badges in each club's primary colour — no third-party marks. These
 * hex values are data, not design tokens, which is why they live here and not
 * in the token sheet.
 */
export const TEAM_CRESTS: Record<string, TeamCrest> = {
  'Boston Celtics': { abbr: 'BOS', color: '#007a33' },
  'Denver Nuggets': { abbr: 'DEN', color: '#0e2240' },
  'Kansas City Chiefs': { abbr: 'KC', color: '#e31837' },
  'Buffalo Bills': { abbr: 'BUF', color: '#00338d' },
  Arsenal: { abbr: 'ARS', color: '#ef0107' },
  Liverpool: { abbr: 'LIV', color: '#c8102e' },
  'LA Dodgers': { abbr: 'LAD', color: '#005a9c' },
  'Chicago Cubs': { abbr: 'CHC', color: '#0e3386' },
  'Colorado Avalanche': { abbr: 'COL', color: '#6f263d' },
  'Edmonton Oilers': { abbr: 'EDM', color: '#c8500f' },
  'Manchester City': { abbr: 'MCI', color: '#1a5b8f' },
  Chelsea: { abbr: 'CHE', color: '#034694' },
  'Dallas Cowboys': { abbr: 'DAL', color: '#041e42' },
  'Philadelphia Eagles': { abbr: 'PHI', color: '#004c54' },
  'Milwaukee Bucks': { abbr: 'MIL', color: '#00471b' },
  'Golden State Warriors': { abbr: 'GSW', color: '#1d428a' },
  'Toronto Maple Leafs': { abbr: 'TOR', color: '#00205b' },
  'Vegas Golden Knights': { abbr: 'VGK', color: '#8a6d2a' },
  'Houston Astros': { abbr: 'HOU', color: '#002d62' },
  'New York Yankees': { abbr: 'NYY', color: '#132448' },
  'New York Knicks': { abbr: 'NYK', color: '#1f4f9c' },
  'Miami Heat': { abbr: 'MIA', color: '#98002e' },
  'Green Bay Packers': { abbr: 'GB', color: '#203731' },
  'Detroit Lions': { abbr: 'DET', color: '#0f5c8c' },
  'Newcastle United': { abbr: 'NEW', color: '#2a2a2a' },
  'Tottenham Hotspur': { abbr: 'TOT', color: '#132257' },
  'New Jersey Devils': { abbr: 'NJD', color: '#ce1126' },
  'New York Rangers': { abbr: 'NYR', color: '#0038a8' },
  'Los Angeles Lakers': { abbr: 'LAL', color: '#552583' },
  'Phoenix Suns': { abbr: 'PHX', color: '#1d1160' },
  'Seattle Seahawks': { abbr: 'SEA', color: '#002244' },
  'San Francisco 49ers': { abbr: 'SF', color: '#aa0000' },
  Everton: { abbr: 'EVE', color: '#003399' },
  'Manchester United': { abbr: 'MUN', color: '#c01a1a' },
  'Washington Capitals': { abbr: 'WSH', color: '#041e42' },
  'Carolina Hurricanes': { abbr: 'CAR', color: '#b31212' },
  'New York Mets': { abbr: 'NYM', color: '#002d72' },
  'Atlanta Braves': { abbr: 'ATL', color: '#ce1141' },
  'Dallas Mavericks': { abbr: 'DAL', color: '#00538c' },
  'Oklahoma City Thunder': { abbr: 'OKC', color: '#00659c' },
}
