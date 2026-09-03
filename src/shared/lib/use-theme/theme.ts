export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'pickboard.theme.v1'

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
}

export const readTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
