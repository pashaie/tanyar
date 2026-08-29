import { getDateKey, getPersianDayOfWeek, PERSIAN_DAY_NAMES, PERSIAN_DAYS_ORDER } from './plan'
import type { Habit, HabitCompletion } from '../types/habit'
import type { PersianDayOfWeek } from '../types/plan'

export { PERSIAN_DAY_NAMES, PERSIAN_DAYS_ORDER }

export function createDefaultHabits(): Habit[] {
  const now = new Date().toISOString()
  const everyDay: PersianDayOfWeek[] = [0, 1, 2, 3, 4, 5, 6]

  return [
    {
      id: crypto.randomUUID(),
      title: 'مسواک صبح',
      daysOfWeek: everyDay,
      sortOrder: 0,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: 'مسواک شب',
      daysOfWeek: everyDay,
      sortOrder: 1,
      createdAt: now,
    },
  ]
}

export function isHabitDueOnDay(habit: Habit, day: PersianDayOfWeek): boolean {
  return habit.daysOfWeek.includes(day)
}

export function getHabitsForDay(habits: Habit[], day: PersianDayOfWeek): Habit[] {
  return habits
    .filter((habit) => isHabitDueOnDay(habit, day))
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getTodayHabits(habits: Habit[], date: Date = new Date()): Habit[] {
  return getHabitsForDay(habits, getPersianDayOfWeek(date))
}

export function isHabitCompleted(
  habitId: string,
  dateKey: string,
  completions: HabitCompletion[],
): boolean {
  return completions.some((c) => c.habitId === habitId && c.date === dateKey)
}

export function formatHabitDays(days: PersianDayOfWeek[]): string {
  if (days.length === 7) return 'هر روز'
  if (days.length === 0) return 'بدون روز'

  const sorted = PERSIAN_DAYS_ORDER.filter((d) => days.includes(d))
  return sorted.map((d) => PERSIAN_DAY_NAMES[d]).join('، ')
}

export function countDueHabits(habits: Habit[], day: PersianDayOfWeek): number {
  return getHabitsForDay(habits, day).length
}

export function countCompletedHabits(
  habits: Habit[],
  dateKey: string,
  completions: HabitCompletion[],
): number {
  const day = getPersianDayOfWeek(new Date(dateKey + 'T12:00:00'))
  return getHabitsForDay(habits, day).filter((h) =>
    isHabitCompleted(h.id, dateKey, completions),
  ).length
}

export { getDateKey }
