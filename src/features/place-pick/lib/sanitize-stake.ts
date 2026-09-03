/** Digits and a single decimal point, so the field can never hold an unparseable amount. */
export const sanitizeStake = (value: string) => {
  const [whole = '', ...rest] = value.replace(/[^0-9.]/g, '').split('.')
  return rest.length === 0 ? whole : `${whole}.${rest.join('')}`
}
