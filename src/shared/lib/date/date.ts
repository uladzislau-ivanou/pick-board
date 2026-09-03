const LOCALE = 'en-US'

export const DAY = 86_400_000

export const startOfDay = (timestamp: number) => new Date(timestamp).setHours(0, 0, 0, 0)

export const daysBetween = (from: number, to: number) =>
  Math.round((startOfDay(to) - startOfDay(from)) / DAY)

export const formatShortDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' })

export const formatDateTime = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(LOCALE, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

export const formatKickoff = (timestamp: number) =>
  `${new Date(timestamp).toLocaleTimeString(LOCALE, { hour: 'numeric', minute: '2-digit' })} ET`

export const formatWeekday = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(LOCALE, { weekday: 'long' })

export const formatWeekdayShort = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(LOCALE, { weekday: 'short' })

export const formatDayWithDate = (timestamp: number) =>
  `${formatWeekdayShort(timestamp)}, ${formatShortDate(timestamp)}`

export const formatRelativeDay = (timestamp: number, now: number) => {
  const diff = daysBetween(now, timestamp)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return formatWeekday(timestamp)
}
