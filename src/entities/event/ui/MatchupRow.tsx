import { TeamCell } from './TeamCell'

export const MatchupRow = ({ away, home }: { away: string; home: string }) => (
  <div className="grid grid-cols-2 border-b-2 border-divider">
    <TeamCell name={away} side="away" />
    <TeamCell name={home} side="home" className="border-l border-divider" />
  </div>
)
