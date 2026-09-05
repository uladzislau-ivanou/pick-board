import { RouterProvider } from 'react-router'

import { PicksProvider } from '@/entities/pick'
import { OddsFormatProvider } from '@/shared/lib/odds'
import { ToastProvider } from '@/shared/ui/Toast'

import { router } from './routes/router'

export const App = () => (
  <PicksProvider>
    <OddsFormatProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </OddsFormatProvider>
  </PicksProvider>
)
