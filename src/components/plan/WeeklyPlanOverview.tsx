import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import {
  formatPlanItemLabel,
  getDateKey,
  getPersianDayOfWeek,
  isItemCompleted,
  PERSIAN_DAY_NAMES,
  PERSIAN_DAYS_ORDER,
} from '../../lib/plan'
import { formatShortDate, toPersianDigits } from '../../lib/format'
import { WorkoutTypeIcon, workoutGradient, workoutTitle } from '../../lib/icons'
import type { PlanCompletion, PlanItem, PersianDayOfWeek } from '../../types/plan'

interface WeeklyPlanOverviewProps {
  groupedPlan: Record<PersianDayOfWeek, PlanItem[]>
  completions: PlanCompletion[]
  weekDates: Date[]
  todayKey: string
  completedCheckable: number
  totalCheckable: number
  onToggle: (itemId: string, date: Date) => void
}

export function WeeklyPlanOverview({
  groupedPlan,
  completions,
  weekDates,
  todayKey,
  completedCheckable,
  totalCheckable,
  onToggle,
}: WeeklyPlanOverviewProps) {
  const percent = totalCheckable > 0 ? Math.round((completedCheckable / totalCheckable) * 100) : 0
  const totalMinutes = PERSIAN_DAYS_ORDER.flatMap((day) => groupedPlan[day])
    .filter((item) => item.type !== 'rest')
    .reduce((sum, item) => sum + (item.durationMinutes ?? 30), 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="5" width="16" height="15" rx="2" />
              <path d="M8 3v4M16 3v4M4 10h16" />
            </svg>
          </span>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100">برنامه تمرینی هفتگی</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">برنامه تکراری هر هفته</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatBubble label="پیشرفت هفتگی" value={`${toPersianDigits(percent)}٪`} highlight />
          <StatBubble
            label="تمرین‌ها"
            value={`${toPersianDigits(completedCheckable)} از ${toPersianDigits(totalCheckable)}`}
          />
          <StatBubble
            label="ساعت تمرین"
            value={toPersianDigits(hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}` : `${minutes}د`)
            }
          />
          <StatBubble label="روزهای فعال" value={toPersianDigits(PERSIAN_DAYS_ORDER.filter((day) => groupedPlan[day].some((item) => item.type !== 'rest')).length)} />
        </div>
      </Card>

      <div className="space-y-4">
        {PERSIAN_DAYS_ORDER.map((dayOfWeek) => {
          const date = weekDates.find((d) => getPersianDayOfWeek(d) === dayOfWeek)
          if (!date) return null

          return (
            <WeeklyDayCard
              key={dayOfWeek}
              dayOfWeek={dayOfWeek}
              date={date}
              items={groupedPlan[dayOfWeek]}
              completions={completions}
              todayKey={todayKey}
              onToggle={onToggle}
            />
          )
        })}
      </div>
    </div>
  )
}

function StatBubble({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={[
        'rounded-2xl px-3 py-3 text-center',
        highlight ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-gray-50 dark:bg-gray-800/60',
      ].join(' ')}
    >
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}

function WeeklyDayCard({
  dayOfWeek,
  date,
  items,
  completions,
  todayKey,
  onToggle,
}: {
  dayOfWeek: PersianDayOfWeek
  date: Date
  items: PlanItem[]
  completions: PlanCompletion[]
  todayKey: string
  onToggle: (itemId: string, date: Date) => void
}) {
  const dateKey = getDateKey(date)
  const isToday = dateKey === todayKey
  const isFuture = dateKey > todayKey
  const checkable = items.filter((item) => item.type !== 'rest')
  const completedCount = checkable.filter((item) =>
    isItemCompleted(item.id, dateKey, completions),
  ).length
  const progress = checkable.length > 0 ? (completedCount / checkable.length) * 100 : 0
  const primaryItem = checkable[0] ?? items[0]

  if (items.length === 0) return null

  if (primaryItem?.type === 'rest' && checkable.length === 0) {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40">
          <WorkoutTypeIcon type="rest" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{PERSIAN_DAY_NAMES[dayOfWeek]}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatShortDate(date)}</p>
        <p className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">روز استراحت</p>
        <p className="mt-1 text-xs text-gray-400">استراحت بخشی از برنامه است</p>
      </Card>
    )
  }

  const allDone = checkable.length > 0 && completedCount === checkable.length
  const someDone = completedCount > 0

  return (
    <Card padding="none" className="overflow-hidden">
      <div className={`bg-gradient-to-br ${workoutGradient(primaryItem.type)} px-5 py-4 text-white`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{PERSIAN_DAY_NAMES[dayOfWeek]}</h3>
            <p className="mt-1 text-xs text-white/80">{formatShortDate(date)}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <WorkoutTypeIcon type={primaryItem.type} />
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold">{workoutTitle(primaryItem.type)}</p>
      </div>

      <div className="space-y-2 p-4">
        {items.map((item) => {
          if (item.type === 'rest') return null
          const checked = isItemCompleted(item.id, dateKey, completions)

          return (
            <button
              key={item.id}
              type="button"
              disabled={isFuture}
              onClick={() => onToggle(item.id, date)}
              className="flex w-full items-center gap-3 rounded-xl px-1 py-2 text-right disabled:opacity-50"
            >
              <span
                className={[
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                  checked
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900',
                ].join(' ')}
              >
                {checked ? (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : null}
              </span>
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">
                {formatPlanItemLabel(item)}
              </span>
            </button>
          )
        })}

        <div className="pt-2">
          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          {allDone ? (
            <Button fullWidth className="min-h-10 bg-emerald-500 text-sm" disabled>
              تکمیل شد
            </Button>
          ) : someDone || isToday ? (
            <Button variant="outline" fullWidth className="min-h-10 text-sm" disabled={isFuture}>
              ادامه دهید
            </Button>
          ) : (
            <Button variant="outline" fullWidth className="min-h-10 text-sm" disabled={isFuture}>
              شروع تمرین
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
