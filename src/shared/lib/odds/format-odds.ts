/**
 * Decimal odds, always two places — `1.90`, never `1.9`. The app quotes no
 * other format (see the README's assumptions), so this is the only place the
 * choice is made.
 */
export const formatOdds = (odds: number) => odds.toFixed(2)
