import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { WORKOUT_TYPE_LABELS, WORKOUT_TYPES } from '../lib/constants'
import { PERSIAN_DAY_NAMES, PERSIAN_DAYS_ORDER } from '../lib/plan'
import { deletePlanItem, resetToDefaultPlan, savePlanItem } from '../db/plan'
import { useWeeklyPlan } from '../hooks/useWeeklyPlan'
import type { PersianDayOfWeek, PlanItem, PlanItemType } from '../types/plan'

function createEmptyItem(dayOfWeek: PersianDayOfWeek, sortOrder: number): PlanItem {
  return {
    id: crypto.randomUUID(),
    dayOfWeek,
    type: 'cycling',
    durationMinutes: 30,
    durationMaxMinutes: null,
    sortOrder,
  }
}

export function PlanPage() {
  const { groupedPlan, loading, reloadPlanItems } = useWeeklyPlan()
  const [saving, setSaving] = useState(false)

  const handleAddItem = async (dayOfWeek: PersianDayOfWeek) => {
    setSaving(true)
    try {
      const items = groupedPlan[dayOfWeek]
      const item = createEmptyItem(dayOfWeek, items.length)
      await savePlanItem(item)
      await reloadPlanItems()
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    setSaving(true)
    try {
      await deletePlanItem(id)
      await reloadPlanItems()
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateItem = async (item: PlanItem, updates: Partial<PlanItem>) => {
    setSaving(true)
    try {
      await savePlanItem({ ...item, ...updates })
      await reloadPlanItems()
    } finally {
      setSaving(false)
    }
  }

  const handleResetPlan = async () => {
    setSaving(true)
    try {
      await resetToDefaultPlan()
      await reloadPlanItems()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">برنامه هفتگی</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          برنامه تکراری هر هفته را تنظیم کنید
        </p>
      </header>

      <div className="space-y-4">
        {PERSIAN_DAYS_ORDER.map((dayOfWeek) => {
          const items = groupedPlan[dayOfWeek]

          return (
            <section
              key={dayOfWeek}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  {PERSIAN_DAY_NAMES[dayOfWeek]}
                </h2>
                <Button
                  variant="ghost"
                  className="min-h-10 px-3 py-2 text-sm"
                  disabled={saving}
                  onClick={() => void handleAddItem(dayOfWeek)}
                >
                  + افزودن
                </Button>
              </div>

              {items.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">برنامه‌ای تعریف نشده</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <PlanItemEditor
                      key={item.id}
                      item={item}
                      disabled={saving}
                      onUpdate={(updates) => void handleUpdateItem(item, updates)}
                      onDelete={() => void handleDeleteItem(item.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      <Button variant="secondary" fullWidth disabled={saving} onClick={() => void handleResetPlan()}>
        بازنشانی به برنامه پیش‌فرض
      </Button>
    </div>
  )
}

interface PlanItemEditorProps {
  item: PlanItem
  disabled?: boolean
  onUpdate: (updates: Partial<PlanItem>) => void
  onDelete: () => void
}

function PlanItemEditor({ item, disabled, onUpdate, onDelete }: PlanItemEditorProps) {
  const types: PlanItemType[] = ['rest', ...WORKOUT_TYPES]

  return (
    <div className="space-y-2 rounded-xl border border-gray-100 p-3 dark:border-gray-800">
      <div className="flex gap-2">
        <select
          value={item.type}
          disabled={disabled}
          onChange={(event) => {
            const type = event.target.value as PlanItemType
            onUpdate({
              type,
              durationMinutes: type === 'rest' ? null : item.durationMinutes ?? 30,
              durationMaxMinutes: type === 'rest' ? null : item.durationMaxMinutes,
            })
          }}
          className="min-h-11 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-950"
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type === 'rest' ? 'استراحت' : WORKOUT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        <Button variant="danger" className="min-h-11 px-3" disabled={disabled} onClick={onDelete}>
          حذف
        </Button>
      </div>

      {item.type !== 'rest' ? (
        <div className="flex gap-2">
          <label className="flex flex-1 flex-col gap-1 text-xs text-gray-500">
            دقیقه
            <input
              type="number"
              min={1}
              disabled={disabled}
              value={item.durationMinutes ?? ''}
              onChange={(event) =>
                onUpdate({
                  durationMinutes: event.target.value ? Number(event.target.value) : null,
                })
              }
              className="min-h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-xs text-gray-500">
            حداکثر (اختیاری)
            <input
              type="number"
              min={1}
              disabled={disabled}
              value={item.durationMaxMinutes ?? ''}
              onChange={(event) =>
                onUpdate({
                  durationMaxMinutes: event.target.value ? Number(event.target.value) : null,
                })
              }
              placeholder="—"
              className="min-h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
          </label>
        </div>
      ) : null}
    </div>
  )
}
