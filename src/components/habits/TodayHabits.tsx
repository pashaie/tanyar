import { useNavigate } from 'react-router-dom'
import { HabitCheckbox } from './HabitCheckbox'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { toPersianDigits } from '../../lib/format'
import type { Habit } from '../../types/habit'

interface TodayHabitsProps {
  habits: Habit[]
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
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">عادات امروز</h2>
        {total > 0 ? (
          <span className="text-sm text-sky-600 dark:text-sky-400">
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
        <div className="space-y-2">
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

      <Button variant="ghost" fullWidth onClick={() => navigate('/habits')}>
        مدیریت عادات
      </Button>
    </section>
  )
}
