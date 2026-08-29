import { WORKOUT_TYPE_LABELS, WORKOUT_TYPES } from '../../lib/constants'
import type { WorkoutType } from '../../types/workout'

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
    <div className="flex flex-wrap gap-2">
      {WORKOUT_TYPES.map((type) => {
        const selected = value === type
        return (
          <button
            key={type}
            type="button"
            disabled={disabled}
            onClick={() => onChange(type)}
            className={[
              'min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
              selected
                ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-800',
            ].join(' ')}
          >
            {WORKOUT_TYPE_LABELS[type]}
          </button>
        )
      })}
    </div>
  )
}
