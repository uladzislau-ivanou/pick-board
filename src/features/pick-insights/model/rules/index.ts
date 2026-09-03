import type { InsightRule } from '../insight'
import { coldMarketRule } from './cold-market'
import { coldPatchRule } from './cold-patch'
import { recentFormRule } from './recent-form'
import { stakeCreepRule } from './stake-creep'
import { strongestMarketRule } from './strongest-market'
import { weakestMarketRule } from './weakest-market'
import { weekDownRule } from './week-down'
import { weekUpRule } from './week-up'
import { winStreakRule } from './win-streak'

export const GOOD_RULES: readonly InsightRule[] = [
  winStreakRule,
  recentFormRule,
  strongestMarketRule,
  weekUpRule,
]

export const BAD_RULES: readonly InsightRule[] = [
  coldMarketRule,
  coldPatchRule,
  weakestMarketRule,
  weekDownRule,
  stakeCreepRule,
]

export const ALL_RULES: readonly InsightRule[] = [...GOOD_RULES, ...BAD_RULES]
