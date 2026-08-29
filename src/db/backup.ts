import {
  ACTIVE_WORKOUT_KEY,
  HABIT_VERSION_KEY,
  PLAN_VERSION_KEY,
  THEME_STORAGE_KEY,
} from '../lib/constants'
import {
  BACKUP_FORMAT_VERSION,
  type TanYarBackup,
  type TanYarBackupData,
} from '../types/backup'
import type { ActiveWorkoutState } from '../types/workout'
import { getDB } from './index'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

export function validateBackup(raw: unknown): TanYarBackup {
  if (!isObject(raw)) {
    throw new Error('فایل پشتیبان نامعتبر است.')
  }

  if (raw.app !== 'tanyar') {
    throw new Error('این فایل مربوط به تَن‌یار نیست.')
  }

  if (raw.version !== BACKUP_FORMAT_VERSION) {
    throw new Error('نسخه فایل پشتیبان پشتیبانی نمی‌شود.')
  }

  if (!isObject(raw.data)) {
    throw new Error('ساختار داده نامعتبر است.')
  }

  const { data } = raw
  const requiredArrays = [
    'sessions',
    'planItems',
    'planCompletions',
    'habits',
    'habitCompletions',
  ] as const

  for (const key of requiredArrays) {
    if (!isArray(data[key])) {
      throw new Error(`فیلد ${key} در پشتیبان یافت نشد.`)
    }
  }

  return raw as unknown as TanYarBackup
}

export async function exportBackup(): Promise<TanYarBackup> {
  const db = await getDB()

  const [
    sessions,
    planItems,
    planCompletions,
    habits,
    habitCompletions,
    activeWorkoutRaw,
    planDataVersion,
    habitDataVersion,
  ] = await Promise.all([
    db.getAll('sessions'),
    db.getAll('planItems'),
    db.getAll('planCompletions'),
    db.getAll('habits'),
    db.getAll('habitCompletions'),
    db.get('meta', ACTIVE_WORKOUT_KEY),
    db.get('meta', PLAN_VERSION_KEY),
    db.get('meta', HABIT_VERSION_KEY),
  ])

  const activeWorkout =
    activeWorkoutRaw && typeof activeWorkoutRaw === 'object'
      ? (activeWorkoutRaw as ActiveWorkoutState)
      : null

  const themeRaw = localStorage.getItem(THEME_STORAGE_KEY)
  const theme = themeRaw === 'light' || themeRaw === 'dark' ? themeRaw : null

  const data: TanYarBackupData = {
    sessions,
    planItems,
    planCompletions,
    habits,
    habitCompletions,
    activeWorkout,
    planDataVersion: typeof planDataVersion === 'number' ? planDataVersion : null,
    habitDataVersion: typeof habitDataVersion === 'number' ? habitDataVersion : null,
    theme,
  }

  return {
    version: BACKUP_FORMAT_VERSION,
    app: 'tanyar',
    exportedAt: new Date().toISOString(),
    data,
  }
}

export async function importBackup(backup: TanYarBackup): Promise<void> {
  const db = await getDB()
  const { data } = backup

  const tx = db.transaction(
    ['sessions', 'planItems', 'planCompletions', 'habits', 'habitCompletions', 'meta'],
    'readwrite',
  )

  await Promise.all([
    tx.objectStore('sessions').clear(),
    tx.objectStore('planItems').clear(),
    tx.objectStore('planCompletions').clear(),
    tx.objectStore('habits').clear(),
    tx.objectStore('habitCompletions').clear(),
  ])

  await Promise.all([
    ...data.sessions.map((item) => tx.objectStore('sessions').put(item)),
    ...data.planItems.map((item) => tx.objectStore('planItems').put(item)),
    ...data.planCompletions.map((item) => tx.objectStore('planCompletions').put(item)),
    ...data.habits.map((item) => tx.objectStore('habits').put(item)),
    ...data.habitCompletions.map((item) => tx.objectStore('habitCompletions').put(item)),
  ])

  const metaStore = tx.objectStore('meta')
  await metaStore.delete(ACTIVE_WORKOUT_KEY)
  await metaStore.delete(PLAN_VERSION_KEY)
  await metaStore.delete(HABIT_VERSION_KEY)

  if (data.activeWorkout) {
    await metaStore.put(data.activeWorkout, ACTIVE_WORKOUT_KEY)
  }
  if (data.planDataVersion !== null) {
    await metaStore.put(data.planDataVersion, PLAN_VERSION_KEY)
  }
  if (data.habitDataVersion !== null) {
    await metaStore.put(data.habitDataVersion, HABIT_VERSION_KEY)
  }

  await tx.done

  if (data.theme) {
    localStorage.setItem(THEME_STORAGE_KEY, data.theme)
    document.documentElement.classList.toggle('dark', data.theme === 'dark')
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', data.theme === 'dark' ? '#111827' : '#059669')
  }
}

export function downloadBackupFile(backup: TanYarBackup): void {
  const date = backup.exportedAt.slice(0, 10)
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `tanyar-backup-${date}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export async function readBackupFile(file: File): Promise<TanYarBackup> {
  const text = await file.text()
  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('فایل JSON نامعتبر است.')
  }

  return validateBackup(parsed)
}
