import { useCallback, useEffect, useState } from 'react'
import {
  ensureDefaultHabits,
  getHabitCompletionsForDate,
  toggleHabitCompletion,
} from '../db/habits'
import {
  countCompletedHabits,
  countDueHabits,
  getDateKey,
  getTodayHabits,
  isHabitCompleted,
} from '../lib/habit'
import { getPersianDayOfWeek } from '../lib/plan'
import type { Habit, HabitCompletion } from '../types/habit'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const [loading, setLoading] = useState(true)

  const todayKey = getDateKey()
  const todayPersianDay = getPersianDayOfWeek()

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [allHabits, todayCompletions] = await Promise.all([
        ensureDefaultHabits(),
        getHabitCompletionsForDate(todayKey),
      ])
      setHabits(allHabits)
      setCompletions(todayCompletions)
    } finally {
      setLoading(false)
    }
  }, [todayKey])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const todayHabits = getTodayHabits(habits)
  const todayTotal = countDueHabits(habits, todayPersianDay)
  const todayCompleted = countCompletedHabits(habits, todayKey, completions)

  const toggleHabit = useCallback(
    async (habitId: string) => {
      await toggleHabitCompletion(habitId, new Date())
      const todayCompletions = await getHabitCompletionsForDate(todayKey)
      setCompletions(todayCompletions)
    },
    [todayKey],
  )

  const isCompleted = useCallback(
    (habitId: string) => isHabitCompleted(habitId, todayKey, completions),
    [todayKey, completions],
  )

  return {
    habits,
    todayHabits,
    completions,
    todayKey,
    todayTotal,
    todayCompleted,
    loading,
    refresh,
    toggleHabit,
    isCompleted,
  }
}
