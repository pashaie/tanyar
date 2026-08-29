import { PERSIAN_DAY_NAMES, PERSIAN_DAYS_ORDER } from '../../lib/habit'
import type { PersianDayOfWeek } from '../../types/plan'

interface HabitDaySelectorProps {
  selected: PersianDayOfWeek[]
  disabled?: boolean
  onChange: (days: PersianDayOfWeek[]) => void
}

export function HabitDaySelector({ selected, disabled = false, onChange }: HabitDaySelectorProps) {
  const toggleDay = (day: PersianDayOfWeek) => {
    if (disabled) return
    const next = selected.includes(day)
      ? selected.filter((d) => d !== day)
      : [...selected, day].sort((a, b) => a - b)
    onChange(next as PersianDayOfWeek[])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {PERSIAN_DAYS_ORDER.map((day) => {
        const active = selected.includes(day)
        return (
          <button
            key={day}
            type="button"
            disabled={disabled}
            onClick={() => toggleDay(day)}
            className={[
              'min-h-9 rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60',
              active
                ? 'bg-sky-600 text-white dark:bg-sky-500'
                : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700',
            ].join(' ')}
          >
            {PERSIAN_DAY_NAMES[day]}
          </button>
        )
      })}
    </div>
  )
}
