import { toPersianDigits } from '../../lib/format'

interface WeekProgressProps {
  completed: number
  total: number
}

export function WeekProgress({ completed, total }: WeekProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">پیشرفت این هفته</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {toPersianDigits(completed)} از {toPersianDigits(total)}
          </p>
        </div>
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {toPersianDigits(percent)}٪
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
