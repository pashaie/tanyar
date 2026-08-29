import { useNavigate } from 'react-router-dom'
import { TodayHabits } from '../components/habits/TodayHabits'
import { DayPlanCard, getDayPlanDate } from '../components/plan/DayPlanCard'
import { WeekProgress } from '../components/plan/WeekProgress'
import { Button } from '../components/ui/Button'
import { useHabits } from '../hooks/useHabits'
import { useWeeklyPlan } from '../hooks/useWeeklyPlan'
import { getDateKey, PERSIAN_DAYS_ORDER } from '../lib/plan'

export function DashboardPage() {
  const navigate = useNavigate()
  const {
    todayHabits,
    todayTotal,
    todayCompleted,
    loading: habitsLoading,
    toggleHabit,
    isCompleted,
  } = useHabits()
  const {
    groupedPlan,
    completions,
    weekDates,
    todayKey,
    todayPersianDay,
    totalCheckable,
    completedCheckable,
    loading: planLoading,
    toggleItem,
  } = useWeeklyPlan()

  const todayDate = weekDates.find((date) => getDateKey(date) === todayKey)
  const todayItems = groupedPlan[todayPersianDay]
  const loading = habitsLoading || planLoading

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">تَن‌یار</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">امروز</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          عادات و تمرین‌های امروز را تیک بزنید
        </p>
      </header>

      <TodayHabits
        habits={todayHabits}
        completed={todayCompleted}
        total={todayTotal}
        loading={habitsLoading}
        isCompleted={isCompleted}
        onToggle={(id) => void toggleHabit(id)}
      />

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">تمرین امروز</h2>
            <WeekProgress completed={completedCheckable} total={totalCheckable} />

            {todayDate && todayItems.length > 0 ? (
              <DayPlanCard
                dayOfWeek={todayPersianDay}
                date={todayDate}
                items={todayItems}
                completions={completions}
                isToday
                onToggle={(itemId, date) => void toggleItem(itemId, date)}
              />
            ) : null}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">تمرین‌های این هفته</h2>
            <div className="space-y-3">
              {PERSIAN_DAYS_ORDER.map((dayOfWeek) => {
                const date = getDayPlanDate(weekDates, dayOfWeek)
                const items = groupedPlan[dayOfWeek]
                if (!date || items.length === 0) return null

                const dateKey = getDateKey(date)
                const isToday = dateKey === todayKey
                const isFuture = dateKey > todayKey

                if (isToday) return null

                return (
                  <DayPlanCard
                    key={dayOfWeek}
                    dayOfWeek={dayOfWeek}
                    date={date}
                    items={items}
                    completions={completions}
                    isFuture={isFuture}
                    onToggle={(itemId, date) => void toggleItem(itemId, date)}
                  />
                )
              })}
            </div>
          </section>
        </>
      )}

      <Button fullWidth onClick={() => navigate('/workout')}>
        شروع تایمر
      </Button>
    </div>
  )
}
