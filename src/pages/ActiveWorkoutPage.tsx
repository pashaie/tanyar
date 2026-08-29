import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/layout/AppHeader'
import { ConfirmFinishDialog } from '../components/workout/ConfirmFinishDialog'
import { WorkoutControls } from '../components/workout/WorkoutControls'
import { WorkoutTimer } from '../components/workout/WorkoutTimer'
import { WorkoutTypeSelector } from '../components/workout/WorkoutTypeSelector'
import { useActiveWorkout } from '../context/ActiveWorkoutContext'
import { useWorkoutTimer } from '../hooks/useWorkoutTimer'
import type { WorkoutType } from '../types/workout'

export function ActiveWorkoutPage() {
  const navigate = useNavigate()
  const {
    activeWorkout,
    status,
    loading,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    updateNotes,
    finishWorkout,
  } = useActiveWorkout()

  const [draftType, setDraftType] = useState<WorkoutType>('running')
  const [draftNotes, setDraftNotes] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [finishing, setFinishing] = useState(false)

  const elapsedSeconds = useWorkoutTimer(activeWorkout)
  const selectedType = activeWorkout?.type ?? draftType
  const notes = activeWorkout?.notes ?? draftNotes

  const handleNotesChange = (value: string) => {
    if (activeWorkout) {
      void updateNotes(value)
      return
    }

    setDraftNotes(value)
  }

  const handleTypeChange = (type: WorkoutType) => {
    if (status !== 'idle') return
    setDraftType(type)
  }

  const handleStart = async () => {
    await startWorkout(selectedType)
  }

  const handleFinish = async () => {
    setFinishing(true)
    try {
      await finishWorkout()
      setShowConfirm(false)
      navigate('/')
    } finally {
      setFinishing(false)
    }
  }

  if (loading) {
    return <p className="text-center text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
  }

  return (
    <div className="space-y-6">
      <AppHeader greeting="سلام! 👋" subtitle="آماده‌ای برای بهتر شدن؟" showDate={false} />

      <WorkoutTimer seconds={elapsedSeconds} running={status === 'running'} />

      <WorkoutTypeSelector
        value={selectedType}
        onChange={handleTypeChange}
        disabled={status !== 'idle'}
      />

      <WorkoutControls
        status={status}
        onStart={() => void handleStart()}
        onPause={() => void pauseWorkout()}
        onResume={() => void resumeWorkout()}
        onFinish={() => setShowConfirm(true)}
      />

      <section className="space-y-2">
        <label htmlFor="notes" className="text-sm font-bold text-gray-900 dark:text-gray-100">
          یادداشت
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </span>
          <textarea
            id="notes"
            value={notes}
            onChange={(event) => handleNotesChange(event.target.value)}
            placeholder="...یادداشت خود را بنویسید"
            rows={3}
            className="w-full rounded-2xl border-0 bg-white px-4 py-3 ps-10 text-sm text-gray-900 shadow-sm ring-1 ring-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-800"
          />
        </div>
      </section>

      <ConfirmFinishDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => void handleFinish()}
      />

      {finishing ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">در حال ذخیره...</p>
      ) : null}
    </div>
  )
}
