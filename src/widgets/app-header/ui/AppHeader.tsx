import { usePicks } from '@/entities/pick'
import { ROUTES } from '@/shared/config/routes'

import { BrandMark } from './BrandMark'
import { NavTab } from './NavTab'

export const AppHeader = () => {
  const { picks } = usePicks()

  return (
    <header className="sticky top-0 z-20 border-b-2 border-divider bg-ground">
      <div className="mx-auto flex min-h-15 max-w-[1180px] flex-wrap items-stretch gap-x-header-gap px-4">
        <BrandMark />
        <nav className="flex items-stretch">
          <NavTab to={ROUTES.events} label="Events" />
          <NavTab to={ROUTES.myPicks} label="My Picks" count={picks.length} />
        </nav>
      </div>
    </header>
  )
}
