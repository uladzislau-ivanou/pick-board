const MINUS = '−'

export const formatMoney = (amount: number) => {
  const digits = Math.abs(amount).toFixed(2).replace(/\.00$/, '')
  return `${amount < 0 ? MINUS : ''}$${digits}`
}

export const formatSigned = (amount: number) => `${amount > 0 ? '+' : ''}${formatMoney(amount)}`
