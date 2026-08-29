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
        'flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-right transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        checked
          ? 'border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40'
          : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
          checked
            ? 'border-sky-600 bg-sky-600 text-white dark:border-sky-500 dark:bg-sky-500'
            : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900',
        ].join(' ')}
      >
        {checked ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : null}
      </span>
      <span
        className={[
          'flex-1 text-sm font-medium',
          checked
            ? 'text-sky-800 line-through dark:text-sky-300'
            : 'text-gray-800 dark:text-gray-100',
        ].join(' ')}
      >
        {title}
      </span>
    </button>
  )
}
