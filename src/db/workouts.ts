import { ACTIVE_WORKOUT_KEY } from '../lib/constants'
import { getStartOfDay, getStartOfMonth, getStartOfWeek } from '../lib/format'
import type { ActiveWorkoutState, WorkoutSession } from '../types/workout'
import { clearPlanData } from './plan'
import { clearHabitData } from './habits'
import { getDB } from './index'

export async function saveSession(session: WorkoutSession): Promise<void> {
  const db = await getDB()
  await db.put('sessions', session)
}

export async function getAllSessions(): Promise<WorkoutSession[]> {
  const db = await getDB()
  const sessions = await db.getAllFromIndex('sessions', 'startedAt')
  return sessions.reverse()
}

export async function getRecentSessions(limit: number): Promise<WorkoutSession[]> {
  const sessions = await getAllSessions()
  return sessions.slice(0, limit)
}

export async function getSessionsSince(since: Date): Promise<WorkoutSession[]> {
  const sessions = await getAllSessions()
  const sinceTime = since.getTime()
  return sessions.filter((session) => new Date(session.startedAt).getTime() >= sinceTime)
}

export async function getTodaySessions(): Promise<WorkoutSession[]> {
  return getSessionsSince(getStartOfDay())
}

export async function getWeekSessions(): Promise<WorkoutSession[]> {
  return getSessionsSince(getStartOfWeek())
}

export async function getMonthSessions(): Promise<WorkoutSession[]> {
  return getSessionsSince(getStartOfMonth())
}

export function sumDuration(sessions: WorkoutSession[]): number {
  return sessions.reduce((total, session) => total + session.duration, 0)
}

export async function getActiveWorkout(): Promise<ActiveWorkoutState | null> {
  const db = await getDB()
  const active = await db.get('meta', ACTIVE_WORKOUT_KEY)
  if (!active || typeof active !== 'object') {
    return null
  }
  return active
}

export async function saveActiveWorkout(state: ActiveWorkoutState): Promise<void> {
  const db = await getDB()
  await db.put('meta', state, ACTIVE_WORKOUT_KEY)
}

export async function clearActiveWorkout(): Promise<void> {
  const db = await getDB()
  await db.delete('meta', ACTIVE_WORKOUT_KEY)
}

export async function clearAllData(): Promise<void> {
  const db = await getDB()
  await db.clear('sessions')
  await db.clear('meta')
  await clearPlanData()
  await clearHabitData()
}

export async function getDashboardStats(): Promise<{
  todayDuration: number
  todayCount: number
  totalDuration: number
  totalCount: number
}> {
  const [todaySessions, allSessions] = await Promise.all([
    getTodaySessions(),
    getAllSessions(),
  ])

  return {
    todayDuration: sumDuration(todaySessions),
    todayCount: todaySessions.length,
    totalDuration: sumDuration(allSessions),
    totalCount: allSessions.length,
  }
}

export async function getHistoryStats(): Promise<{
  weekDuration: number
  monthDuration: number
}> {
  const [weekSessions, monthSessions] = await Promise.all([
    getWeekSessions(),
    getMonthSessions(),
  ])

  return {
    weekDuration: sumDuration(weekSessions),
    monthDuration: sumDuration(monthSessions),
  }
}
