import { formatPlanItemLabel, isItemCompleted } from '../../lib/plan'
import type { PlanCompletion, PlanItem } from '../../types/plan'

interface PlanItemCheckboxProps {
  item: PlanItem
  dateKey: string
  completions: PlanCompletion[]
  disabled?: boolean
  onToggle: (itemId: string) => void
}

export function PlanItemCheckbox({
  item,
  dateKey,
  completions,
  disabled = false,
  onToggle,
}: PlanItemCheckboxProps) {
  if (item.type === 'rest') {
    return (
      <div className="flex min-h-12 items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
        <span className="text-lg text-gray-400">—</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{formatPlanItemLabel(item)}</span>
      </div>
    )
  }

  const checked = isItemCompleted(item.id, dateKey, completions)

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(item.id)}
      className={[
        'flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-right transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        checked
          ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
          : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
          checked
            ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
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
            ? 'text-emerald-800 line-through dark:text-emerald-300'
            : 'text-gray-800 dark:text-gray-100',
        ].join(' ')}
      >
        {formatPlanItemLabel(item)}
      </span>
    </button>
  )
}
