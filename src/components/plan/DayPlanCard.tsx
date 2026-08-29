import { getDateKey, getPersianDayOfWeek, PERSIAN_DAY_NAMES } from '../../lib/plan'
import type { PlanCompletion, PlanItem, PersianDayOfWeek } from '../../types/plan'
import { PlanItemCheckbox } from './PlanItemCheckbox'

interface DayPlanCardProps {
  dayOfWeek: PersianDayOfWeek
  date: Date
  items: PlanItem[]
  completions: PlanCompletion[]
  isToday?: boolean
  isFuture?: boolean
  onToggle: (itemId: string, date: Date) => void
}

export function DayPlanCard({
  dayOfWeek,
  date,
  items,
  completions,
  isToday = false,
  isFuture = false,
  onToggle,
}: DayPlanCardProps) {
  const dateKey = getDateKey(date)

  if (items.length === 0) {
    return null
  }

  return (
    <section
      className={[
        'rounded-2xl border p-4',
        isToday
          ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20'
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
      ].join(' ')}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {PERSIAN_DAY_NAMES[dayOfWeek]}
            {isToday ? (
              <span className="mr-2 text-sm font-normal text-emerald-600 dark:text-emerald-400">
                (امروز)
              </span>
            ) : null}
          </h3>
        </div>
        {isFuture ? (
          <span className="text-xs text-gray-400">آینده</span>
        ) : null}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <PlanItemCheckbox
            key={item.id}
            item={item}
            dateKey={dateKey}
            completions={completions}
            disabled={isFuture}
            onToggle={(itemId) => onToggle(itemId, date)}
          />
        ))}
      </div>
    </section>
  )
}

export function getDayPlanDate(
  weekDates: Date[],
  dayOfWeek: PersianDayOfWeek,
): Date | undefined {
  return weekDates.find((date) => getPersianDayOfWeek(date) === dayOfWeek)
}
