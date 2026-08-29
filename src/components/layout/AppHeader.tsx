import { Link } from 'react-router-dom'
import { formatTodayDate, toPersianDigits } from '../../lib/format'
import { AppLogo, BellIcon, CalendarIcon, FlameIcon, LogoAvatar } from '../../lib/icons'

interface AppHeaderProps {
  streak?: number
  showDate?: boolean
  greeting?: string
  subtitle?: string
}

export function AppHeader({
  streak = 0,
  showDate = true,
  greeting,
  subtitle,
}: AppHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="اعلان‌ها"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-gray-500 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800"
        >
          <BellIcon />
        </button>

        <Link to="/" className="flex-shrink-0">
          <AppLogo />
        </Link>

        <LogoAvatar />
      </div>

      {greeting ? (
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{greeting}</p>
            {subtitle ? (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            ) : null}
          </div>
          <LogoAvatar />
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          {streak > 0 ? (
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
              <span className="text-emerald-500">
                <FlameIcon />
              </span>
              <div>
                <p className="text-lg font-bold leading-none text-gray-900 dark:text-gray-100">
                  {toPersianDigits(streak)}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">روز متوالی</p>
              </div>
            </div>
          ) : (
            <div className="w-20" />
          )}

          {showDate ? (
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">امروز</h1>
              <p className="mt-1 flex items-center justify-end gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <CalendarIcon />
                {formatTodayDate()}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </header>
  )
}
