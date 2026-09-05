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
      <div className="mx-auto flex min-h-15 max-w-[1180px] flex-wrap items-center gap-x-header-gap px-5 max-sm:pt-2.5">
        <BrandMark />
        <nav className="flex items-stretch max-sm:order-last max-sm:w-full">
          <NavTab to={ROUTES.events} label="Events" />
          <NavTab to={ROUTES.myPicks} label="My Picks" count={picks.length} />
        </nav>
        <span className="ml-auto flex items-center gap-1.5">
          <OddsFormatToggle />
          <ThemeToggle />
        </span>
      </div>
    </header>
  )
}
