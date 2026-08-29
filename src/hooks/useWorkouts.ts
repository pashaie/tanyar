import { useCallback, useEffect, useState } from 'react'
import {
  getAllSessions,
  getDashboardStats,
  getHistoryStats,
  getRecentSessions,
} from '../db/workouts'
import type { WorkoutSession } from '../types/workout'

export function useWorkouts() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([])
  const [dashboardStats, setDashboardStats] = useState({
    todayDuration: 0,
    todayCount: 0,
    totalDuration: 0,
    totalCount: 0,
  })
  const [historyStats, setHistoryStats] = useState({
    weekDuration: 0,
    monthDuration: 0,
  })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [all, recent, dashboard, history] = await Promise.all([
        getAllSessions(),
        getRecentSessions(5),
        getDashboardStats(),
        getHistoryStats(),
      ])
      setSessions(all)
      setRecentSessions(recent)
      setDashboardStats(dashboard)
      setHistoryStats(history)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    sessions,
    recentSessions,
    dashboardStats,
    historyStats,
    loading,
    refresh,
  }
}
