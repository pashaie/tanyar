import { SessionList } from '../components/session/SessionList'
import { StatCard } from '../components/ui/StatCard'
import { useWorkouts } from '../hooks/useWorkouts'
import { formatDurationShort } from '../lib/format'

export function HistoryPage() {
  const { sessions, historyStats, loading } = useWorkouts()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">تاریخچه</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">همه تمرین‌های قبلی</p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <StatCard
          label="این هفته"
          value={loading ? '...' : formatDurationShort(historyStats.weekDuration)}
        />
        <StatCard
          label="این ماه"
          value={loading ? '...' : formatDurationShort(historyStats.monthDuration)}
        />
      </section>

      <section className="space-y-3">
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
        ) : (
          <SessionList sessions={sessions} />
        )}
      </section>
    </div>
  )
}
