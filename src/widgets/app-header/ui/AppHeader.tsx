import { usePicks } from '@/entities/pick'
import { ROUTES } from '@/shared/config/routes'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'

import { BrandMark } from './BrandMark'
import { NavTab } from './NavTab'

export const AppHeader = () => {
  const { picks } = usePicks()

  return (
    <header className="sticky top-0 z-20 border-b-2 border-divider bg-ground">
      <div className="mx-auto flex min-h-15 max-w-[1180px] flex-wrap items-stretch gap-x-header-gap px-4">
        <BrandMark />
        {/* Nav stays flush left after the brand; the toggle is pushed to the far
            right of this same growing row. Grouping them means a narrow screen
            wraps both together, instead of stranding the toggle on a row of
            its own — which is what `ml-auto` on a bare button did. */}
        <div className="flex grow items-stretch justify-between">
          <nav className="flex items-stretch">
            <NavTab to={ROUTES.events} label="Events" />
            <NavTab to={ROUTES.myPicks} label="My Picks" count={picks.length} />
          </nav>
          <span className="flex items-center pl-2">
            <ThemeToggle />
          </span>
        </div>
      </div>
    </header>
  )
}
