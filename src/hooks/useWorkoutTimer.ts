import { useCallback, useEffect, useState } from 'react'
import type { ActiveWorkoutState } from '../types/workout'

function computeElapsedSeconds(state: ActiveWorkoutState, now = Date.now()): number {
  if (state.isPaused) {
    return state.accumulatedSeconds
  }

  const segmentSeconds = (now - new Date(state.startedAt).getTime()) / 1000
  return state.accumulatedSeconds + Math.max(0, segmentSeconds)
}

export function useWorkoutTimer(state: ActiveWorkoutState | null) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const recalculate = useCallback(() => {
    if (!state) {
      setElapsedSeconds(0)
      return
    }

    setElapsedSeconds(Math.floor(computeElapsedSeconds(state)))
  }, [state])

  useEffect(() => {
    recalculate()
  }, [recalculate])

  useEffect(() => {
    if (!state || state.isPaused) {
      return
    }

    const intervalId = window.setInterval(recalculate, 1000)
    return () => window.clearInterval(intervalId)
  }, [state, recalculate])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        recalculate()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [recalculate])

  return elapsedSeconds
}

export function getFinalDuration(state: ActiveWorkoutState): number {
  return Math.floor(computeElapsedSeconds(state))
}
