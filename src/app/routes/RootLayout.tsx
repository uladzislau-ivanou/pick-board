import { Outlet } from 'react-router'

import { AppHeader } from '@/widgets/app-header'

export const RootLayout = () => (
  <>
    <AppHeader />
    <main className="mx-auto w-full max-w-[1180px] px-5 pt-7 pb-16">
      <Outlet />
    </main>
  </>
)
