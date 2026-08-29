import { formatDuration, toPersianDigits } from '../../lib/format'

interface WorkoutTimerProps {
  seconds: number
  running?: boolean
}

export function WorkoutTimer({ seconds, running = false }: WorkoutTimerProps) {
  const progress = running ? ((seconds % 3600) / 3600) * 100 : 0
  const radius = 88
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <div className="rounded-3xl bg-white px-4 py-8 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 18V6M8 18V10M12 18V4M16 18v-6M20 18V8" />
          </svg>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
            <circle cx="12" cy="11" r="2" />
          </svg>
          آماده
        </span>
      </div>

      <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
        <svg className="-rotate-90 transform" width="224" height="224" viewBox="0 0 224 224">
          <circle cx="112" cy="112" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
          <circle
            cx="112"
            cy="112"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-emerald-500 transition-all duration-300"
            strokeDasharray={circumference}
            strokeDashoffset={running ? dashOffset : circumference * 0.75}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2 1.5" />
            </svg>
          </span>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">زمان تمرین</p>
          <p className="mt-1 font-mono text-4xl font-bold tracking-wider text-gray-900 dark:text-gray-100">
            {formatDuration(seconds)}
          </p>
          <p className="mt-1 text-[10px] text-gray-400">
            {toPersianDigits('ساعت : دقیقه : ثانیه')}
          </p>
        </div>
      </div>
    </div>
  )
}
