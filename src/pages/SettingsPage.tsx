import { useState, type ChangeEvent } from 'react'
import { Button } from '../components/ui/Button'
import { useActiveWorkout } from '../context/ActiveWorkoutContext'
import { useTheme } from '../context/ThemeContext'
import {
  downloadBackupFile,
  exportBackup,
  importBackup,
  readBackupFile,
} from '../db/backup'
import { clearAllData } from '../db/workouts'
import { ensureDefaultHabits } from '../db/habits'
import { ensurePersianDefaultPlan } from '../db/plan'
import { useHabits } from '../hooks/useHabits'
import { useWeeklyPlan } from '../hooks/useWeeklyPlan'
import { useWorkouts } from '../hooks/useWorkouts'

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { refresh } = useWorkouts()
  const { refresh: refreshPlan } = useWeeklyPlan()
  const { refresh: refreshHabits } = useHabits()
  const { refreshActiveWorkout } = useActiveWorkout()

  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const [pendingBackupFile, setPendingBackupFile] = useState<File | null>(null)
  const [clearing, setClearing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  )

  const refreshAll = async () => {
    await Promise.all([refresh(), refreshPlan(), refreshHabits(), refreshActiveWorkout()])
  }

  const handleExport = async () => {
    setExporting(true)
    setMessage(null)
    try {
      const backup = await exportBackup()
      downloadBackupFile(backup)
      setMessage({ type: 'success', text: 'پشتیبان با موفقیت ذخیره شد.' })
    } catch {
      setMessage({ type: 'error', text: 'خطا در خروجی گرفتن از داده‌ها.' })
    } finally {
      setExporting(false)
    }
  }

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setMessage(null)
    try {
      await readBackupFile(file)
      setPendingBackupFile(file)
      setShowRestoreConfirm(true)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'فایل پشتیبان نامعتبر است.',
      })
    }
  }

  const handleRestore = async () => {
    if (!pendingBackupFile) return

    setImporting(true)
    setMessage(null)
    try {
      const backup = await readBackupFile(pendingBackupFile)
      await importBackup(backup)
      window.location.reload()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'خطا در بازیابی داده‌ها.',
      })
    } finally {
      setImporting(false)
    }
  }

  const handleClearData = async () => {
    setClearing(true)
    try {
      await clearAllData()
      await refreshAll()
      await Promise.all([ensurePersianDefaultPlan(), ensureDefaultHabits()])
      setShowClearConfirm(false)
      setMessage({ type: 'success', text: 'همه داده‌ها پاک شد.' })
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">تنظیمات</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">تنظیمات برنامه</p>
      </header>

      {message ? (
        <p
          className={[
            'rounded-xl px-4 py-3 text-sm',
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300',
          ].join(' ')}
        >
          {message.text}
        </p>
      ) : null}

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">زبان</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">فارسی</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">حالت نمایش</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {theme === 'light' ? 'روشن' : 'تاریک'}
            </p>
          </div>
          <Button variant="secondary" onClick={toggleTheme}>
            {theme === 'light' ? 'تاریک' : 'روشن'}
          </Button>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">پشتیبان‌گیری</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            تمرین‌ها، عادات، برنامه هفتگی و تیک‌ها را ذخیره یا بازیابی کنید.
          </p>
        </div>

        <Button fullWidth disabled={exporting} onClick={() => void handleExport()}>
          {exporting ? 'در حال آماده‌سازی...' : 'خروجی JSON (Backup)'}
        </Button>

        <label className="block">
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => void handleFileSelect(event)}
          />
          <span className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-gray-100 px-5 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
            {importing ? 'در حال بازیابی...' : 'بازیابی از فایل (Restore)'}
          </span>
        </label>
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
        <p className="font-medium text-red-800 dark:text-red-300">پاک کردن داده‌ها</p>
        <p className="mt-1 text-sm text-red-700 dark:text-red-400">
          همه تمرین‌ها، عادات، برنامه هفتگی و تیک‌ها حذف می‌شوند.
        </p>
        <Button
          variant="danger"
          fullWidth
          className="mt-4"
          onClick={() => setShowClearConfirm(true)}
        >
          پاک کردن همه داده‌ها
        </Button>
      </section>

      {showRestoreConfirm ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              بازیابی داده‌ها
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              داده‌های فعلی با فایل پشتیبان جایگزین می‌شوند. ادامه می‌دهید؟
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setShowRestoreConfirm(false)
                  setPendingBackupFile(null)
                }}
              >
                انصراف
              </Button>
              <Button
                variant="primary"
                fullWidth
                disabled={importing}
                onClick={() => void handleRestore()}
              >
                {importing ? 'در حال بازیابی...' : 'بازیابی'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {showClearConfirm ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              تأیید حذف
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowClearConfirm(false)}>
                انصراف
              </Button>
              <Button
                variant="danger"
                fullWidth
                disabled={clearing}
                onClick={() => void handleClearData()}
              >
                {clearing ? 'در حال حذف...' : 'حذف'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
