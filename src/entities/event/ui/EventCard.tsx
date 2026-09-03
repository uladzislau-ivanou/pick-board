import type { Market, Outcome, SportEvent } from '../model/types'
import { LeagueStrip } from './LeagueStrip'
import { MarketColumn } from './MarketColumn'
import { MatchupRow } from './MatchupRow'

export const EventCard = ({
  event,
  onSelectOutcome,
}: {
  event: SportEvent
  onSelectOutcome: (event: SportEvent, market: Market, outcome: Outcome) => void
}) => (
  <article className="overflow-hidden rounded-lg border border-divider bg-neutral-100">
    <header>
      <LeagueStrip event={event} />
      <MatchupRow away={event.away} home={event.home} />
    </header>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
      {event.markets.map((market) => (
        <MarketColumn
          key={market.id}
          market={market}
          onSelectOutcome={(selectedMarket, outcome) =>
            onSelectOutcome(event, selectedMarket, outcome)
          }
        />
      ))}
    </div>
  </article>
)
