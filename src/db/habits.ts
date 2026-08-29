import { HABIT_DATA_VERSION, HABIT_VERSION_KEY } from '../lib/constants'
import { createDefaultHabits, getDateKey } from '../lib/habit'
import type { Habit, HabitCompletion } from '../types/habit'
import { getDB } from './index'

export async function getAllHabits(): Promise<Habit[]> {
  const db = await getDB()
  const habits = await db.getAll('habits')
  return habits.sort((a, b) => a.sortOrder - b.sortOrder)
}

async function writeDefaultHabits(): Promise<Habit[]> {
  const defaults = createDefaultHabits()
  const db = await getDB()
  const tx = db.transaction('habits', 'readwrite')
  await tx.store.clear()
  await Promise.all(defaults.map((habit) => tx.store.put(habit)))
  await tx.done
  await db.put('meta', HABIT_DATA_VERSION, HABIT_VERSION_KEY)
  return defaults
}

export async function ensureDefaultHabits(): Promise<Habit[]> {
  const db = await getDB()
  const storedVersion = (await db.get('meta', HABIT_VERSION_KEY)) as number | undefined

  if (storedVersion === HABIT_DATA_VERSION) {
    const existing = await getAllHabits()
    if (existing.length > 0) return existing
  }

  await clearHabitData()
  return writeDefaultHabits()
}

export async function resetToDefaultHabits(): Promise<Habit[]> {
  await clearHabitData()
  return writeDefaultHabits()
}

export async function saveHabit(habit: Habit): Promise<void> {
  const db = await getDB()
  await db.put('habits', habit)
}

export async function deleteHabit(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('habits', id)
}

export async function getHabitCompletionsForDate(dateKey: string): Promise<HabitCompletion[]> {
  const db = await getDB()
  return db.getAllFromIndex('habitCompletions', 'date', IDBKeyRange.only(dateKey))
}

export async function toggleHabitCompletion(habitId: string, date: Date): Promise<boolean> {
  const db = await getDB()
  const dateKey = getDateKey(date)
  const id = `${dateKey}:${habitId}`
  const existing = await db.get('habitCompletions', id)

  if (existing) {
    await db.delete('habitCompletions', id)
    return false
  }

  const completion: HabitCompletion = {
    id,
    habitId,
    date: dateKey,
    completedAt: new Date().toISOString(),
  }
  await db.put('habitCompletions', completion)
  return true
}

export async function clearHabitData(): Promise<void> {
  const db = await getDB()
  await db.clear('habits')
  await db.clear('habitCompletions')
}
