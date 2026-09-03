/**
 * Every date string in the app comes from here, so the board's group header,
 * the chart axis and the day-filter chip can never describe a day differently.
 * en-US is hard-coded: i18n is out of scope, and pinning it keeps tests stable.
 */
const LOCALE = 'en-US'

export const DAY = 86_400_000

/** Local midnight of the day a timestamp falls in. */
export const startOfDay = (timestamp: number) => new Date(timestamp).setHours(0, 0, 0, 0)

export const daysBetween = (from: number, to: number) =>
  Math.round((startOfDay(to) - startOfDay(from)) / DAY)

/** "Sep 6" */
export const formatShortDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' })

/** "Sep 1, 7:12 PM" */
export const formatDateTime = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(LOCALE, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

/** "7:30 PM ET" */
export const formatKickoff = (timestamp: number) =>
  `${new Date(timestamp).toLocaleTimeString(LOCALE, { hour: 'numeric', minute: '2-digit' })} ET`

/** "Saturday" */
export const formatWeekday = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(LOCALE, { weekday: 'long' })

/** "Wed" */
export const formatWeekdayShort = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(LOCALE, { weekday: 'short' })

/** "Wed, Sep 2" */
export const formatDayWithDate = (timestamp: number) =>
  `${formatWeekdayShort(timestamp)}, ${formatShortDate(timestamp)}`

/** "Today" | "Tomorrow" | "Saturday" */
export const formatRelativeDay = (timestamp: number, now: number) => {
  const diff = daysBetween(now, timestamp)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return formatWeekday(timestamp)
}
