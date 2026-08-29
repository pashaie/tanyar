import { Card } from '../ui/Card'
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
    <Card
      className={
        isToday ? 'ring-2 ring-emerald-200 dark:ring-emerald-900' : undefined
      }
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            {PERSIAN_DAY_NAMES[dayOfWeek]}
            {isToday ? (
              <span className="mr-2 text-sm font-normal text-emerald-600 dark:text-emerald-400">
                (امروز)
              </span>
            ) : null}
          </h3>
        </div>
        {isFuture ? (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400 dark:bg-gray-800">
            آینده
          </span>
        ) : null}
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
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
    </Card>
  )
}

export function getDayPlanDate(
  weekDates: Date[],
  dayOfWeek: PersianDayOfWeek,
): Date | undefined {
  return weekDates.find((date) => getPersianDayOfWeek(date) === dayOfWeek)
}
