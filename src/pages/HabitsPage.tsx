import { useState } from 'react'
import { HabitDaySelector } from '../components/habits/HabitDaySelector'
import { Button } from '../components/ui/Button'
import { deleteHabit, resetToDefaultHabits, saveHabit } from '../db/habits'
import { useHabits } from '../hooks/useHabits'
import { formatHabitDays } from '../lib/habit'
import type { Habit } from '../types/habit'
import type { PersianDayOfWeek } from '../types/plan'

function createEmptyHabit(sortOrder: number): Habit {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: '',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    sortOrder,
    createdAt: now,
  }
}

export function HabitsPage() {
  const { habits, loading, refresh } = useHabits()
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState<Habit | null>(null)

  const handleSave = async (habit: Habit) => {
    if (!habit.title.trim()) return
    setSaving(true)
    try {
      await saveHabit({ ...habit, title: habit.title.trim() })
      setDraft(null)
      await refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setSaving(true)
    try {
      await deleteHabit(id)
      await refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setSaving(true)
    try {
      await resetToDefaultHabits()
      setDraft(null)
      await refresh()
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">عادات</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          عادت بسازید و روزهای هفته را انتخاب کنید
        </p>
      </header>

      <div className="space-y-4">
        {habits.map((habit) => (
          <HabitEditor
            key={habit.id}
            habit={habit}
            disabled={saving}
            onSave={(updated) => void handleSave(updated)}
            onDelete={() => void handleDelete(habit.id)}
          />
        ))}

        {draft ? (
          <HabitEditor
            habit={draft}
            disabled={saving}
            isNew
            onSave={(updated) => void handleSave(updated)}
            onCancel={() => setDraft(null)}
          />
        ) : null}
      </div>

      <Button
        variant="secondary"
        fullWidth
        disabled={saving || draft !== null}
        onClick={() => setDraft(createEmptyHabit(habits.length))}
      >
        + افزودن عادت
      </Button>

      <Button variant="ghost" fullWidth disabled={saving} onClick={() => void handleReset()}>
        بازنشانی به عادات پیش‌فرض
      </Button>
    </div>
  )
}

interface HabitEditorProps {
  habit: Habit
  disabled?: boolean
  isNew?: boolean
  onSave: (habit: Habit) => void
  onDelete?: () => void
  onCancel?: () => void
}

function HabitEditor({ habit, disabled, isNew, onSave, onDelete, onCancel }: HabitEditorProps) {
  const [title, setTitle] = useState(habit.title)
  const [days, setDays] = useState<PersianDayOfWeek[]>(habit.daysOfWeek)

  const handleSave = () => {
    if (!title.trim() || days.length === 0) return
    onSave({ ...habit, title: title.trim(), daysOfWeek: days })
  }

  return (
    <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <input
        type="text"
        value={title}
        disabled={disabled}
        placeholder="نام عادت (مثلاً مسواک صبح)"
        onChange={(event) => setTitle(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950"
      />

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">روزهای هفته</p>
        <HabitDaySelector selected={days} disabled={disabled} onChange={setDays} />
        {!isNew && days.length > 0 ? (
          <p className="text-xs text-gray-400">{formatHabitDays(days)}</p>
        ) : null}
      </div>

      <div className="flex gap-2">
        <Button
          fullWidth
          disabled={disabled || !title.trim() || days.length === 0}
          onClick={handleSave}
        >
          {isNew ? 'افزودن' : 'ذخیره'}
        </Button>
        {isNew && onCancel ? (
          <Button variant="secondary" disabled={disabled} onClick={onCancel}>
            انصراف
          </Button>
        ) : null}
        {!isNew && onDelete ? (
          <Button variant="danger" disabled={disabled} onClick={onDelete}>
            حذف
          </Button>
        ) : null}
      </div>
    </section>
  )
}
