import { HabitIcon } from '../../lib/icons'

interface HabitCheckboxProps {
  title: string
  checked: boolean
  disabled?: boolean
  onToggle: () => void
}

export function HabitCheckbox({ title, checked, disabled = false, onToggle }: HabitCheckboxProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={[
        'flex min-h-12 w-full items-center gap-3 rounded-2xl px-1 py-2 text-right transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        checked ? 'opacity-80' : '',
      ].join(' ')}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <HabitIcon title={title} />
      </span>
      <span
        className={[
          'flex-1 text-sm font-medium',
          checked
            ? 'text-gray-500 line-through dark:text-gray-400'
            : 'text-gray-800 dark:text-gray-100',
        ].join(' ')}
      >
        {title}
      </span>
      <span
        className={[
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
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
    </button>
  )
}
