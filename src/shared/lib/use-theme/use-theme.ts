import { useState } from 'react'

import { applyTheme, readTheme, THEME_STORAGE_KEY, type Theme } from './theme'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(readTheme)

  const select = (next: Theme) => {
    applyTheme(next)
    setTheme(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {}
  }

  return { theme, select, toggle: () => select(theme === 'dark' ? 'light' : 'dark') }
}
