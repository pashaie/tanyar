import type { Habit, HabitCompletion } from '../types/habit'
import type { PlanCompletion, PlanItem } from '../types/plan'
import type { ActiveWorkoutState, WorkoutSession } from '../types/workout'

export const BACKUP_FORMAT_VERSION = 1

export interface TanYarBackupData {
  sessions: WorkoutSession[]
  planItems: PlanItem[]
  planCompletions: PlanCompletion[]
  habits: Habit[]
  habitCompletions: HabitCompletion[]
  activeWorkout: ActiveWorkoutState | null
  planDataVersion: number | null
  habitDataVersion: number | null
  theme: 'light' | 'dark' | null
}

export interface TanYarBackup {
  version: typeof BACKUP_FORMAT_VERSION
  app: 'tanyar'
  exportedAt: string
  data: TanYarBackupData
}
