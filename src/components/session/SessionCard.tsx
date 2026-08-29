import { WORKOUT_TYPE_LABELS } from '../../lib/constants'
import { formatDate, formatDurationShort, formatTime } from '../../lib/format'
import type { WorkoutSession } from '../../types/workout'

interface SessionCardProps {
  session: WorkoutSession
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {WORKOUT_TYPE_LABELS[session.type]}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formatDate(session.startedAt)} · {formatTime(session.startedAt)}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {formatDurationShort(session.duration)}
        </span>
      </div>
      {session.notes ? (
        <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{session.notes}</p>
      ) : null}
    </article>
  )
}
