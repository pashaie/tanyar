import type { WorkoutType } from './workout'

export type PlanItemType = WorkoutType | 'rest'

/** 0 = Saturday (شنبه) … 6 = Friday (جمعه) — Persian week */
export type PersianDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface PlanItem {
  id: string
  dayOfWeek: PersianDayOfWeek
  type: PlanItemType
  durationMinutes: number | null
  durationMaxMinutes: number | null
  sortOrder: number
}

export interface PlanCompletion {
  id: string
  planItemId: string
  date: string
  completedAt: string
}
