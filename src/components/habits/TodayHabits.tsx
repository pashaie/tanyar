import { useNavigate } from 'react-router-dom'
import { HabitCheckbox } from './HabitCheckbox'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { toPersianDigits } from '../../lib/format'

interface TodayHabitsProps {
  habits: { id: string; title: string }[]
  completed: number
  total: number
  loading: boolean
  isCompleted: (habitId: string) => boolean
  onToggle: (habitId: string) => void
}

export function TodayHabits({
  habits,
  completed,
  total,
  loading,
  isCompleted,
  onToggle,
}: TodayHabitsProps) {
  const navigate = useNavigate()

  return (
    <section className="space-y-3">
      <Card>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">عادات روزانه</h2>
          {total > 0 ? (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {toPersianDigits(completed)} از {toPersianDigits(total)}
            </span>
          ) : null}
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
        ) : habits.length === 0 ? (
          <EmptyState
            title="عادتی برای امروز نیست"
            description="در صفحه عادات، روزهای هفته را تنظیم کنید."
          />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {habits.map((habit) => (
              <HabitCheckbox
                key={habit.id}
                title={habit.title}
                checked={isCompleted(habit.id)}
                onToggle={() => onToggle(habit.id)}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/habits')}
          className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
        >
          مدیریت عادات
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
      </Card>
    </section>
  )
}
