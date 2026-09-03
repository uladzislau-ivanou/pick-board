/** Gross return, stake included. Zero for anything that is not a real wager. */
export const calculatePayout = (stake: number, odds: number) => {
  if (!Number.isFinite(stake) || !Number.isFinite(odds)) return 0
  if (stake <= 0 || odds <= 1) return 0
  return Math.round(stake * odds * 100) / 100
}

export const calculateProfit = (stake: number, odds: number) => {
  const payout = calculatePayout(stake, odds)
  return payout === 0 ? 0 : Math.round((payout - stake) * 100) / 100
}
