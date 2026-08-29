import type { PersianDayOfWeek } from './plan'

export interface Habit {
  id: string
  title: string
  daysOfWeek: PersianDayOfWeek[]
  sortOrder: number
  createdAt: string
}

export interface HabitCompletion {
  id: string
  habitId: string
  date: string
  completedAt: string
}
