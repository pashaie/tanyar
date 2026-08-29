import { formatDuration } from '../../lib/format'

interface WorkoutTimerProps {
  seconds: number
}

export function WorkoutTimer({ seconds }: WorkoutTimerProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <p className="font-mono text-5xl font-semibold tracking-wider text-gray-900 dark:text-gray-100 sm:text-6xl">
        {formatDuration(seconds)}
      </p>
    </div>
  )
}
