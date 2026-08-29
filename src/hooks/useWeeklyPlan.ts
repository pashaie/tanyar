import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getAllPlanItems,
  getCompletionsForDates,
  ensurePersianDefaultPlan,
  togglePlanCompletion,
} from '../db/plan'
import {
  countCheckableItems,
  countCompletedCheckableItems,
  getDateKey,
  getPersianDayOfWeek,
  getWeekDates,
  groupPlanByDay,
  isItemCompleted,
} from '../lib/plan'
import type { PlanCompletion, PlanItem } from '../types/plan'

export function useWeeklyPlan() {
  const [planItems, setPlanItems] = useState<PlanItem[]>([])
  const [completions, setCompletions] = useState<PlanCompletion[]>([])
  const [loading, setLoading] = useState(true)

  const weekDates = useMemo(() => getWeekDates(), [])
  const weekDateKeys = useMemo(() => weekDates.map(getDateKey), [weekDates])
  const todayKey = getDateKey()
  const todayPersianDay = getPersianDayOfWeek()

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const items = await ensurePersianDefaultPlan()
      const weekCompletions = await getCompletionsForDates(weekDateKeys)
      setPlanItems(items)
      setCompletions(weekCompletions)
    } finally {
      setLoading(false)
    }
  }, [weekDateKeys])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const groupedPlan = useMemo(() => groupPlanByDay(planItems), [planItems])

  const totalCheckable = countCheckableItems(planItems)
  const completedCheckable = countCompletedCheckableItems(planItems, weekDates, completions)

  const toggleItem = useCallback(
    async (planItemId: string, date: Date) => {
      await togglePlanCompletion(planItemId, date)
      const weekCompletions = await getCompletionsForDates(weekDateKeys)
      setCompletions(weekCompletions)
    },
    [weekDateKeys],
  )

  const isCompleted = useCallback(
    (planItemId: string, dateKey: string) => isItemCompleted(planItemId, dateKey, completions),
    [completions],
  )

  return {
    planItems,
    groupedPlan,
    completions,
    weekDates,
    todayKey,
    todayPersianDay,
    totalCheckable,
    completedCheckable,
    loading,
    refresh,
    toggleItem,
    isCompleted,
    reloadPlanItems: async () => {
      const items = await getAllPlanItems()
      setPlanItems(items)
    },
  }
}
