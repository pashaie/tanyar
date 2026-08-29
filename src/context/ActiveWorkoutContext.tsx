import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearActiveWorkout,
  getActiveWorkout,
  saveActiveWorkout,
  saveSession,
} from '../db/workouts'
import { getFinalDuration } from '../hooks/useWorkoutTimer'
import type { ActiveWorkoutState, WorkoutSession, WorkoutStatus, WorkoutType } from '../types/workout'

interface ActiveWorkoutContextValue {
  activeWorkout: ActiveWorkoutState | null
  status: WorkoutStatus
  loading: boolean
  startWorkout: (type: WorkoutType) => Promise<void>
  pauseWorkout: () => Promise<void>
  resumeWorkout: () => Promise<void>
  updateNotes: (notes: string) => Promise<void>
  finishWorkout: () => Promise<WorkoutSession | null>
  refreshActiveWorkout: () => Promise<void>
}

const ActiveWorkoutContext = createContext<ActiveWorkoutContextValue | null>(null)

function getStatus(state: ActiveWorkoutState | null): WorkoutStatus {
  if (!state) return 'idle'
  return state.isPaused ? 'paused' : 'running'
}

export function ActiveWorkoutProvider({ children }: { children: ReactNode }) {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshActiveWorkout = useCallback(async () => {
    const stored = await getActiveWorkout()
    setActiveWorkout(stored)
  }, [])

  useEffect(() => {
    void (async () => {
      try {
        await refreshActiveWorkout()
      } finally {
        setLoading(false)
      }
    })()
  }, [refreshActiveWorkout])

  const persist = useCallback(async (state: ActiveWorkoutState | null) => {
    if (state) {
      await saveActiveWorkout(state)
    } else {
      await clearActiveWorkout()
    }
    setActiveWorkout(state)
  }, [])

  const startWorkout = useCallback(
    async (type: WorkoutType) => {
      const now = new Date().toISOString()
      const state: ActiveWorkoutState = {
        sessionId: crypto.randomUUID(),
        type,
        workoutStartedAt: now,
        startedAt: now,
        accumulatedSeconds: 0,
        isPaused: false,
        pausedAt: null,
        notes: '',
      }
      await persist(state)
    },
    [persist],
  )

  const pauseWorkout = useCallback(async () => {
    if (!activeWorkout || activeWorkout.isPaused) return

    const elapsed = getFinalDuration(activeWorkout)
    const nextState: ActiveWorkoutState = {
      ...activeWorkout,
      accumulatedSeconds: elapsed,
      isPaused: true,
      pausedAt: new Date().toISOString(),
    }
    await persist(nextState)
  }, [activeWorkout, persist])

  const resumeWorkout = useCallback(async () => {
    if (!activeWorkout || !activeWorkout.isPaused) return

    const nextState: ActiveWorkoutState = {
      ...activeWorkout,
      startedAt: new Date().toISOString(),
      isPaused: false,
      pausedAt: null,
    }
    await persist(nextState)
  }, [activeWorkout, persist])

  const updateNotes = useCallback(
    async (notes: string) => {
      if (!activeWorkout) return

      const nextState: ActiveWorkoutState = {
        ...activeWorkout,
        notes,
      }
      await persist(nextState)
    },
    [activeWorkout, persist],
  )

  const finishWorkout = useCallback(async () => {
    if (!activeWorkout) return null

    const endedAt = new Date().toISOString()
    const duration = getFinalDuration(activeWorkout)
    const session: WorkoutSession = {
      id: activeWorkout.sessionId,
      type: activeWorkout.type,
      startedAt: activeWorkout.workoutStartedAt,
      endedAt,
      duration,
      notes: activeWorkout.notes.trim(),
      createdAt: endedAt,
    }

    await saveSession(session)
    await persist(null)
    return session
  }, [activeWorkout, persist])

  const value = useMemo<ActiveWorkoutContextValue>(
    () => ({
      activeWorkout,
      status: getStatus(activeWorkout),
      loading,
      startWorkout,
      pauseWorkout,
      resumeWorkout,
      updateNotes,
      finishWorkout,
      refreshActiveWorkout,
    }),
    [
      activeWorkout,
      loading,
      startWorkout,
      pauseWorkout,
      resumeWorkout,
      updateNotes,
      finishWorkout,
      refreshActiveWorkout,
    ],
  )

  return (
    <ActiveWorkoutContext.Provider value={value}>{children}</ActiveWorkoutContext.Provider>
  )
}

export function useActiveWorkout() {
  const context = useContext(ActiveWorkoutContext)
  if (!context) {
    throw new Error('useActiveWorkout must be used within ActiveWorkoutProvider')
  }
  return context
}
