export interface TeamCrest {
  abbr: string
  color: string
  color2: string
  short?: string
}

export const TEAM_CRESTS: Record<string, TeamCrest> = {
  'Boston Celtics': { abbr: 'BOS', color: '#007a33', color2: '#bb9753' },
  'Denver Nuggets': { abbr: 'DEN', color: '#0e2240', color2: '#fec524' },
  'Kansas City Chiefs': { abbr: 'KC', color: '#e31837', color2: '#ffb81c' },
  'Buffalo Bills': { abbr: 'BUF', color: '#00338d', color2: '#c60c30' },
  Arsenal: { abbr: 'ARS', color: '#ef0107', color2: '#063672' },
  Liverpool: { abbr: 'LIV', color: '#c8102e', color2: '#00b2a9' },
  'LA Dodgers': { abbr: 'LAD', color: '#005a9c', color2: '#ef3e42' },
  'Chicago Cubs': { abbr: 'CHC', color: '#0e3386', color2: '#cc3433' },
  'Colorado Avalanche': { abbr: 'COL', color: '#6f263d', color2: '#236192' },
  'Edmonton Oilers': { abbr: 'EDM', color: '#c8500f', color2: '#041e42' },
  'Manchester City': { abbr: 'MCI', color: '#1a5b8f', color2: '#f3c1a4' },
  Chelsea: { abbr: 'CHE', color: '#034694', color2: '#dba111' },
  'Dallas Cowboys': { abbr: 'DAL', color: '#041e42', color2: '#869397' },
  'Philadelphia Eagles': { abbr: 'PHI', color: '#004c54', color2: '#a5acaf' },
  'Milwaukee Bucks': { abbr: 'MIL', color: '#00471b', color2: '#eee1c6' },
  'Golden State Warriors': { abbr: 'GSW', color: '#1d428a', color2: '#ffc72c' },
  'Toronto Maple Leafs': { abbr: 'TOR', color: '#00205b', color2: '#ffffff' },
  'Vegas Golden Knights': { abbr: 'VGK', color: '#8a6d2a', color2: '#333f42' },
  'Houston Astros': { abbr: 'HOU', color: '#002d62', color2: '#eb6e1f' },
  'New York Yankees': { abbr: 'NYY', color: '#132448', color2: '#c4ced3' },
  'New York Knicks': { abbr: 'NYK', color: '#1f4f9c', color2: '#f58426' },
  'Miami Heat': { abbr: 'MIA', color: '#98002e', color2: '#f9a01b' },
  'Green Bay Packers': { abbr: 'GB', color: '#203731', color2: '#ffb612' },
  'Detroit Lions': { abbr: 'DET', color: '#0f5c8c', color2: '#b0b7bc' },
  'Newcastle United': { short: 'Newcastle', abbr: 'NEW', color: '#2a2a2a', color2: '#f1be48' },
  'Tottenham Hotspur': { short: 'Tottenham', abbr: 'TOT', color: '#132257', color2: '#ffffff' },
  'New Jersey Devils': { abbr: 'NJD', color: '#ce1126', color2: '#000000' },
  'New York Rangers': { abbr: 'NYR', color: '#0038a8', color2: '#ce1126' },
  'Los Angeles Lakers': { abbr: 'LAL', color: '#552583', color2: '#fdb927' },
  'Phoenix Suns': { abbr: 'PHX', color: '#1d1160', color2: '#e56020' },
  'Seattle Seahawks': { abbr: 'SEA', color: '#002244', color2: '#69be28' },
  'San Francisco 49ers': { abbr: 'SF', color: '#aa0000', color2: '#b3995d' },
  Everton: { abbr: 'EVE', color: '#003399', color2: '#ffffff' },
  'Manchester United': { abbr: 'MUN', color: '#c01a1a', color2: '#ffe500' },
  'Washington Capitals': { abbr: 'WSH', color: '#041e42', color2: '#c8102e' },
  'Carolina Hurricanes': { abbr: 'CAR', color: '#b31212', color2: '#000000' },
  'New York Mets': { abbr: 'NYM', color: '#002d72', color2: '#ff5910' },
  'Atlanta Braves': { abbr: 'ATL', color: '#ce1141', color2: '#13274f' },
  'Dallas Mavericks': { abbr: 'DAL', color: '#00538c', color2: '#b8c4ca' },
  'Oklahoma City Thunder': { abbr: 'OKC', color: '#00659c', color2: '#ef3b24' },
}
