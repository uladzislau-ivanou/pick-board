import { useReducer } from 'react'

import { initialPickQuery, pickQueryReducer } from './pick-query'

/**
 * The chart and the ledger are both controlled by this one query, which is why
 * a day selected on the chart and the rows below it can never disagree.
 */
export const usePickQuery = () => useReducer(pickQueryReducer, initialPickQuery)
