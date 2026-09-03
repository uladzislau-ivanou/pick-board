import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'

import { EventsPage } from '@/pages/events'
import { MyPicksPage } from '@/pages/my-picks'
import { ROUTES } from '@/shared/config/routes'

import { RootLayout } from './RootLayout'

/** Exported so tests can mount the same routes on a memory router. */
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.events, element: <EventsPage /> },
      { path: ROUTES.myPicks, element: <MyPicksPage /> },
      { path: '*', element: <Navigate to={ROUTES.events} replace /> },
    ],
  },
]

export const router = createBrowserRouter(routes, {
  // Set by Vite; '/pick-board/' for the GitHub Pages demo, '/' everywhere else.
  basename: import.meta.env.BASE_URL,
})
