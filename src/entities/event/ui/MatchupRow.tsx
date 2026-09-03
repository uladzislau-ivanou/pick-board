import { TeamCell } from './TeamCell'

export const MatchupRow = ({ away, home }: { away: string; home: string }) => (
  <div className="grid grid-cols-[1fr_auto_1fr] border-b-2 border-divider">
    <TeamCell name={away} side="away" />
    <div className="flex items-center border-x border-divider px-vs-x">
      <span className="type-heading text-[11px] tracking-[.16em] text-ink/40">VS</span>
    </div>
    <TeamCell name={home} side="home" />
  </div>
)
