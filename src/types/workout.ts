export type WorkoutType = 'cycling' | 'walking' | 'running' | 'strength' | 'other'

export interface WorkoutSession {
  id: string
  type: WorkoutType
  startedAt: string
  endedAt: string | null
  duration: number
  notes: string
  createdAt: string
}

export interface ActiveWorkoutState {
  sessionId: string
  type: WorkoutType
  workoutStartedAt: string
  startedAt: string
  accumulatedSeconds: number
  isPaused: boolean
  pausedAt: string | null
  notes: string
}

export type WorkoutStatus = 'idle' | 'running' | 'paused'
