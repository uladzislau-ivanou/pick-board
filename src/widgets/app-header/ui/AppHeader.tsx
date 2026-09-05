import { usePicks } from '@/entities/pick'
import { ROUTES } from '@/shared/config/routes'
import { OddsFormatToggle } from '@/shared/ui/OddsFormatToggle'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'

import { BrandMark } from './BrandMark'
import { NavTab } from './NavTab'

export const AppHeader = () => {
  const { picks } = usePicks()

  return (
    <header className="sticky top-0 z-20 border-b-2 border-divider bg-ground">
      <div className="mx-auto flex min-h-15 max-w-[1180px] flex-wrap items-stretch gap-x-header-gap px-4">
        <BrandMark />
        <div className="flex grow flex-wrap items-stretch justify-between gap-y-1">
          <nav className="flex items-stretch">
            <NavTab to={ROUTES.events} label="Events" />
            <NavTab to={ROUTES.myPicks} label="My Picks" count={picks.length} />
          </nav>
          <span className="flex items-center gap-1.5 pl-2">
            <OddsFormatToggle />
            <ThemeToggle />
          </span>
        </div>
      </div>
    </header>
  )
}
