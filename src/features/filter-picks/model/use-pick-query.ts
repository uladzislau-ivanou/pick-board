import { useReducer } from 'react'

import { initialPickQuery, pickQueryReducer } from './pick-query'

export const usePickQuery = () => useReducer(pickQueryReducer, initialPickQuery)
