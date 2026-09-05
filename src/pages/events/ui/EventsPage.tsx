import { useState } from 'react'
import { useNavigate } from 'react-router'

import { getEvents, groupByDay, matchupLabel, openEvents } from '@/entities/event'
import { usePicks } from '@/entities/pick'
import { PlacePickModal, usePlacePick } from '@/features/place-pick'
import { ROUTES } from '@/shared/config/routes'
import { useFormatOdds } from '@/shared/lib/odds'
import { plural } from '@/shared/lib/text'
import { PageHeader } from '@/shared/ui/PageHeader'
import { useToast } from '@/shared/ui/Toast'
import { EventBoard } from '@/widgets/event-board'

import { BoardSummary } from './BoardSummary'

export const EventsPage = () => {
  const [now] = useState(() => Date.now())
  const [events] = useState(() => openEvents(getEvents(now), now))
  const { picks, addPick } = usePicks()
  const { show } = useToast()
  const navigate = useNavigate()
  const placePick = usePlacePick()
  const formatOdds = useFormatOdds()

  const dayCount = groupByDay(events, now).length
  const { draft } = placePick

  const confirm = (stake: number) => {
    if (!draft) return

    addPick({
      event: draft.event,
      market: draft.marketType,
      selection: draft.selection,
      odds: draft.odds,
      stake,
    })
    placePick.close()
    show({
      message: `Pick placed — ${draft.selection} at ${formatOdds(draft.odds)}`,
      actionLabel: 'View',
      onAction: () => navigate(ROUTES.myPicks),
    })
  }

  return (
    <>
      <PageHeader
        kicker={`Live board · ${plural(events.length, 'event')} · next ${plural(dayCount, 'day')}`}
        title="Events"
        aside={<BoardSummary events={events} picks={picks} now={now} />}
      />
      <EventBoard
        events={events}
        now={now}
        onSelectOutcome={(event, market, outcome) =>
          placePick.open({
            sport: event.sport,
            event: matchupLabel(event.away, event.home),
            market: market.name,
            marketType: market.type,
            selection: outcome.label,
            odds: outcome.odds,
          })
        }
      />
      {draft ? (
        <PlacePickModal
          draft={draft}
          stake={placePick.stake}
          onStakeChange={placePick.changeStake}
          onClose={placePick.close}
          onConfirm={confirm}
        />
      ) : null}
    </>
  )
}
