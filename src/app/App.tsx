import { RouterProvider } from 'react-router'

import { PicksProvider } from '@/entities/pick'
import { ToastProvider } from '@/shared/ui/Toast'

import { router } from './routes/router'

export const App = () => (
  <PicksProvider>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </PicksProvider>
)
