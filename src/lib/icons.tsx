import type { PlanItemType } from '../types/plan'
import { LOGO_ALT, LOGO_SRC } from './branding'

const iconClass = 'h-5 w-5 shrink-0'

export function HabitIcon({ title }: { title: string }) {
  const text = title.toLowerCase()

  if (text.includes('آب')) return <CupIcon />
  if (text.includes('مدیت') || text.includes('تمرکز')) return <MeditationIcon />
  if (text.includes('فعالیت') || text.includes('ورزش') || text.includes('دو')) return <RunIcon />
  if (text.includes('غذا') || text.includes('سالم')) return <FoodIcon />
  if (text.includes('کتاب') || text.includes('مطالعه')) return <BookIcon />
  if (text.includes('مسواک')) return <SparkleIcon />
  return <CheckCircleIcon />
}

export function WorkoutTypeIcon({ type }: { type: PlanItemType }) {
  switch (type) {
    case 'running':
      return <RunIcon />
    case 'walking':
      return <WalkIcon />
    case 'cycling':
      return <BikeIcon />
    case 'strength':
      return <DumbbellIcon />
    case 'rest':
      return <MoonIcon />
    default:
      return <ActivityIcon />
  }
}

function CupIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8h12v8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8Z" />
      <path d="M18 10h1a2 2 0 0 1 0 4h-1M6 4h12" />
    </svg>
  )
}

function MeditationIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="6" r="2.5" />
      <path d="M8 20v-3a4 4 0 0 1 8 0v3M5 20h14" />
    </svg>
  )
}

function RunIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="14" cy="5" r="2" />
      <path d="m11 11 2 6 3-2 2 5M9 20l2-5 3-1" />
    </svg>
  )
}

function WalkIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="5" r="2" />
      <path d="M10 22V12l-2-2 2-4M14 22v-6l3-2-1-4" />
    </svg>
  )
}

function BikeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17 10 9h4l2 3h3M10 9l2 8" />
    </svg>
  )
}

function DumbbellIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10v4M20 10v4M7 12h10M6 8v8M18 8v8" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z" />
    </svg>
  )
}

function FoodIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v8M8 7c0 2.2 1.8 4 4 4s4-1.8 4-4M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
      <path d="M8 4v13a3 3 0 0 0 3 3" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l1.2 4.2L17 8l-3.8 1.2L12 14l-1.2-4.8L7 8l3.8-.8L12 3Z" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  )
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 14l4-4 4 6 4-8 4 6" />
    </svg>
  )
}

export function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 17H9l-1-2H6a4 4 0 0 1 4-4V9a5 5 0 0 1 10 0v2a4 4 0 0 1 4 4h-2l-1 2Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  )
}

export function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 2c1 3 3 4.5 3 7.5a3 3 0 1 1-6 0C9 6.5 11 5 12 2Zm0 20a5 5 0 0 0 5-5c0-2.5-2-4.5-2-7.5a7 7 0 0 1-6 0c0 3-2 5-2 7.5a5 5 0 0 0 5 5Z" />
    </svg>
  )
}

export function AppLogo({
  compact = false,
  size = 'md',
}: {
  compact?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  }

  return (
    <div className="flex items-center gap-2">
      <img
        src={LOGO_SRC}
        alt={LOGO_ALT}
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
      {!compact ? (
        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">TanYar</span>
      ) : null}
    </div>
  )
}

export function LogoAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const sizeClasses = {
    sm: 'h-9 w-9',
    md: 'h-10 w-10',
  }

  return (
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      className={`${sizeClasses[size]} object-contain`}
    />
  )
}

export function workoutGradient(type: PlanItemType): string {
  switch (type) {
    case 'running':
      return 'from-emerald-500 to-teal-600'
    case 'walking':
      return 'from-teal-500 to-cyan-600'
    case 'cycling':
      return 'from-green-500 to-emerald-700'
    case 'strength':
      return 'from-slate-600 to-slate-800'
    case 'rest':
      return 'from-gray-400 to-gray-500'
    default:
      return 'from-emerald-500 to-green-600'
  }
}

export function workoutTitle(type: PlanItemType): string {
  switch (type) {
    case 'running':
      return 'دویدن'
    case 'walking':
      return 'پیاده‌روی'
    case 'cycling':
      return 'دوچرخه‌سواری'
    case 'strength':
      return 'تمرین قدرتی'
    case 'rest':
      return 'استراحت'
    default:
      return 'تمرین'
  }
}

export function DifficultyBars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3].map((bar) => (
        <span
          key={bar}
          className={[
            'w-1 rounded-full',
            bar === 1 ? 'h-2' : bar === 2 ? 'h-3' : 'h-4',
            bar <= level ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700',
          ].join(' ')}
        />
      ))}
    </div>
  )
}
