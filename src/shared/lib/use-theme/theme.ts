export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'pickboard.theme'

const THEME_COLORS: Record<Theme, string> = { light: '#f3f2f2', dark: '#1a1917' }

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}

export const readTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
