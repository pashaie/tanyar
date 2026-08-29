import type { WorkoutType } from '../types/workout'

export const WORKOUT_TYPES: WorkoutType[] = [
  'cycling',
  'walking',
  'running',
  'strength',
  'other',
]

export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
  cycling: 'دوچرخه',
  walking: 'پیاده‌روی',
  running: 'دویدن',
  strength: 'تمرین قدرتی',
  other: 'سایر',
}

export const ACTIVE_WORKOUT_KEY = 'activeWorkout'
export const THEME_STORAGE_KEY = 'tanyar-theme'
export const PLAN_VERSION_KEY = 'planDataVersion'
/** Bump to force wipe + re-seed of weekly plan */
export const PLAN_DATA_VERSION = 3

export const HABIT_VERSION_KEY = 'habitDataVersion'
/** Bump to force wipe + re-seed of habits */
export const HABIT_DATA_VERSION = 1
