import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmFinishDialog } from '../components/workout/ConfirmFinishDialog'
import { WorkoutTimer } from '../components/workout/WorkoutTimer'
import { WorkoutTypeSelector } from '../components/workout/WorkoutTypeSelector'
import { Button } from '../components/ui/Button'
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
    return <p className="text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">تمرین فعال</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          نوع تمرین را انتخاب کنید و شروع کنید
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">نوع تمرین</h2>
        <WorkoutTypeSelector
          value={selectedType}
          onChange={handleTypeChange}
          disabled={status !== 'idle'}
        />
      </section>

      <WorkoutTimer seconds={elapsedSeconds} />

      <section className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          یادداشت
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(event) => handleNotesChange(event.target.value)}
          placeholder="یادداشت اختیاری..."
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none ring-emerald-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </section>

      <div className="space-y-3">
        {status === 'idle' ? (
          <Button fullWidth onClick={() => void handleStart()}>
            شروع
          </Button>
        ) : null}

        {status === 'running' ? (
          <>
            <Button variant="secondary" fullWidth onClick={() => void pauseWorkout()}>
              توقف
            </Button>
            <Button variant="primary" fullWidth onClick={() => setShowConfirm(true)}>
              پایان
            </Button>
          </>
        ) : null}

        {status === 'paused' ? (
          <>
            <Button fullWidth onClick={() => void resumeWorkout()}>
              ادامه
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setShowConfirm(true)}>
              پایان
            </Button>
          </>
        ) : null}
      </div>

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
