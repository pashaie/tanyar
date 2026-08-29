import { WorkoutTypeIcon } from '../../lib/icons'
import type { WorkoutType } from '../../types/workout'

const TIMER_WORKOUT_TYPES = ['running', 'walking', 'cycling'] as const

const TYPE_LABELS: Record<(typeof TIMER_WORKOUT_TYPES)[number], string> = {
  running: 'دو',
  walking: 'پیاده‌روی',
  cycling: 'دوچرخه',
}

interface WorkoutTypeSelectorProps {
  value: WorkoutType
  onChange: (type: WorkoutType) => void
  disabled?: boolean
}

export function WorkoutTypeSelector({
  value,
  onChange,
  disabled = false,
}: WorkoutTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">نوع تمرین</h2>
      <div className="grid grid-cols-3 gap-2">
        {TIMER_WORKOUT_TYPES.map((type) => {
          const selected = value === type

          return (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => onChange(type)}
              className={[
                'flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60',
                selected
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-white text-emerald-600 ring-1 ring-emerald-200 hover:bg-emerald-50 dark:bg-gray-900 dark:text-emerald-400 dark:ring-emerald-900',
              ].join(' ')}
            >
              <WorkoutTypeIcon type={type} />
              {TYPE_LABELS[type]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
