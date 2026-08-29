import { Card } from '../ui/Card'
import { getDateKey, getPersianDayOfWeek, PERSIAN_DAY_NAMES, PERSIAN_DAYS_ORDER } from '../../lib/plan'
import { toPersianDigits } from '../../lib/format'
import type { PlanCompletion, PlanItem, PersianDayOfWeek } from '../../types/plan'

interface WeekProgressProps {
  completed: number
  total: number
  weekDates: Date[]
  todayKey: string
  groupedPlan: Record<PersianDayOfWeek, PlanItem[]>
  completions: PlanCompletion[]
}

type DayStatus = 'complete' | 'partial' | 'rest' | 'future' | 'empty'

function getDayStatus(
  date: Date,
  todayKey: string,
  groupedPlan: Record<PersianDayOfWeek, PlanItem[]>,
  completions: PlanCompletion[],
): DayStatus {
  const dateKey = getDateKey(date)
  const day = getPersianDayOfWeek(date)
  const items = groupedPlan[day]
  const checkable = items.filter((item) => item.type !== 'rest')

  if (checkable.length === 0) {
    return items.some((item) => item.type === 'rest') ? 'rest' : 'empty'
  }

  if (dateKey > todayKey) return 'future'

  const done = checkable.filter((item) =>
    completions.some((c) => c.planItemId === item.id && c.date === dateKey),
  ).length

  if (done === checkable.length) return 'complete'
  if (done > 0) return 'partial'
  if (dateKey === todayKey) return 'partial'
  return 'empty'
}

export function WeekProgress({
  completed,
  total,
  weekDates,
  todayKey,
  groupedPlan,
  completions,
}: WeekProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">پیشرفت هفتگی</h2>
        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
          {toPersianDigits(percent)}٪ پیشرفت
        </span>
      </div>

      <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-emerald-600 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-1">
        {PERSIAN_DAYS_ORDER.map((dayOfWeek) => {
          const date = weekDates.find((d) => getPersianDayOfWeek(d) === dayOfWeek)
          if (!date) return null

          const status = getDayStatus(date, todayKey, groupedPlan, completions)
          const isToday = getDateKey(date) === todayKey

          return (
            <div key={dayOfWeek} className="flex flex-col items-center gap-1.5">
              <DayDot status={status} isToday={isToday} />
              <span
                className={[
                  'text-[10px] font-medium',
                  isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400',
                ].join(' ')}
              >
                {PERSIAN_DAY_NAMES[dayOfWeek].slice(0, 1)}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function DayDot({ status, isToday }: { status: DayStatus; isToday: boolean }) {
  if (status === 'complete') {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )
  }

  if (status === 'rest') {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
        —
      </span>
    )
  }

  if (status === 'future') {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600" />
    )
  }

  if (status === 'partial' && isToday) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" />
    )
  }

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
      —
    </span>
  )
}

export function computeActivityStreak(
  weekDates: Date[],
  todayKey: string,
  groupedPlan: Record<PersianDayOfWeek, PlanItem[]>,
  completions: PlanCompletion[],
): number {
  const todayIndex = weekDates.findIndex((date) => getDateKey(date) === todayKey)
  if (todayIndex < 0) return 0

  let streak = 0

  for (let index = todayIndex; index >= 0; index -= 1) {
    const date = weekDates[index]
    const dateKey = getDateKey(date)
    const day = getPersianDayOfWeek(date)
    const checkable = groupedPlan[day].filter((item) => item.type !== 'rest')

    if (checkable.length === 0) continue

    const hasActivity = checkable.some((item) =>
      completions.some((c) => c.planItemId === item.id && c.date === dateKey),
    )

    if (!hasActivity) break
    streak += 1
  }

  return streak
}
