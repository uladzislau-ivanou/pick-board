import { useState } from 'react'
import { RouterProvider } from 'react-router'

import { PicksProvider } from '@/entities/pick'
import { OddsFormatProvider } from '@/shared/lib/odds'
import { ToastProvider } from '@/shared/ui/Toast'

import { createAppRouter } from './routes/router'

export const App = () => {
  const [router] = useState(createAppRouter)

  return (
    <PicksProvider>
      <OddsFormatProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </OddsFormatProvider>
    </PicksProvider>
  )
}
