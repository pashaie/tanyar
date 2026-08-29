import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/layout/AppHeader'
import { WorkoutPreviewCard } from '../components/dashboard/WorkoutPreviewCard'
import { TodayHabits } from '../components/habits/TodayHabits'
import { DayPlanCard, getDayPlanDate } from '../components/plan/DayPlanCard'
import { computeActivityStreak, WeekProgress } from '../components/plan/WeekProgress'
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
  const workoutItems = todayItems.filter((item) => item.type !== 'rest')
  const loading = habitsLoading || planLoading
  const streak = computeActivityStreak(weekDates, todayKey, groupedPlan, completions)

  return (
    <div className="space-y-5">
      <AppHeader streak={streak} />

      <TodayHabits
        habits={todayHabits}
        completed={todayCompleted}
        total={todayTotal}
        loading={habitsLoading}
        isCompleted={isCompleted}
        onToggle={(id) => void toggleHabit(id)}
      />

      {loading ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
      ) : (
        <>
          <WeekProgress
            completed={completedCheckable}
            total={totalCheckable}
            weekDates={weekDates}
            todayKey={todayKey}
            groupedPlan={groupedPlan}
            completions={completions}
          />

          {workoutItems.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">برنامه تمرینی</h2>
              <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                {workoutItems.map((item) => (
                  <WorkoutPreviewCard key={item.id} item={item} />
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/plan')}
                className="flex w-full items-center justify-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
              >
                مشاهده همه برنامه‌ها
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 6-6 6 6 6" />
                </svg>
              </button>
            </section>
          ) : null}

          {todayDate && todayItems.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">تمرین امروز</h2>
              <DayPlanCard
                dayOfWeek={todayPersianDay}
                date={todayDate}
                items={todayItems}
                completions={completions}
                isToday
                onToggle={(itemId, date) => void toggleItem(itemId, date)}
              />
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">تمرین‌های این هفته</h2>
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
    </div>
  )
}
