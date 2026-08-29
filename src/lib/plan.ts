import { WORKOUT_TYPE_LABELS } from './constants'
import { getStartOfDay, getStartOfWeek, toPersianDigits } from './format'
import type { PersianDayOfWeek, PlanCompletion, PlanItem } from '../types/plan'

export const PERSIAN_DAY_NAMES: Record<PersianDayOfWeek, string> = {
  0: 'شنبه',
  1: 'یکشنبه',
  2: 'دوشنبه',
  3: 'سه‌شنبه',
  4: 'چهارشنبه',
  5: 'پنج‌شنبه',
  6: 'جمعه',
}

export const PERSIAN_DAYS_ORDER: PersianDayOfWeek[] = [0, 1, 2, 3, 4, 5, 6]

export function jsDayToPersianDay(jsDay: number): PersianDayOfWeek {
  return ((jsDay + 1) % 7) as PersianDayOfWeek
}

export function getPersianDayOfWeek(date: Date = new Date()): PersianDayOfWeek {
  return jsDayToPersianDay(date.getDay())
}

export function getDateKey(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getWeekDates(referenceDate: Date = new Date()): Date[] {
  const start = getStartOfWeek(referenceDate)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return getStartOfDay(date)
  })
}

export function formatPlanItemLabel(item: PlanItem): string {
  if (item.type === 'rest') {
    return 'استراحت'
  }

  const typeLabel = WORKOUT_TYPE_LABELS[item.type]

  if (item.durationMinutes === null) {
    return typeLabel
  }

  if (item.durationMaxMinutes !== null && item.durationMaxMinutes !== item.durationMinutes) {
    return `${typeLabel} ${toPersianDigits(item.durationMinutes)}–${toPersianDigits(item.durationMaxMinutes)} دقیقه`
  }

  return `${typeLabel} ${toPersianDigits(item.durationMinutes)} دقیقه`
}

export function isItemCompleted(
  itemId: string,
  dateKey: string,
  completions: PlanCompletion[],
): boolean {
  return completions.some(
    (completion) => completion.planItemId === itemId && completion.date === dateKey,
  )
}

export function getCompletionId(itemId: string, dateKey: string): string {
  return `${dateKey}:${itemId}`
}

export function groupPlanByDay(items: PlanItem[]): Record<PersianDayOfWeek, PlanItem[]> {
  const grouped: Record<PersianDayOfWeek, PlanItem[]> = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  }

  for (const item of items) {
    grouped[item.dayOfWeek].push(item)
  }

  for (const day of PERSIAN_DAYS_ORDER) {
    grouped[day].sort((a, b) => a.sortOrder - b.sortOrder)
  }

  return grouped
}

export function createDefaultPlanItems(): PlanItem[] {
  let order = 0
  const item = (
    dayOfWeek: PersianDayOfWeek,
    type: PlanItem['type'],
    durationMinutes: number | null = null,
    durationMaxMinutes: number | null = null,
  ): PlanItem => ({
    id: crypto.randomUUID(),
    dayOfWeek,
    type,
    durationMinutes,
    durationMaxMinutes,
    sortOrder: order++,
  })

  // هفته ایرانی — شنبه تا جمعه
  return [
    // شنبه
    item(0, 'cycling', 90, 120),
    // یکشنبه
    item(1, 'cycling', 45),
    item(1, 'strength'),
    // دوشنبه
    item(2, 'cycling', 45),
    // سه‌شنبه
    item(3, 'cycling', 30),
    item(3, 'strength'),
    // چهارشنبه
    item(4, 'cycling', 60),
    // پنج‌شنبه
    item(5, 'cycling', 30),
    // جمعه
    item(6, 'rest'),
  ]
}

export function countCheckableItems(items: PlanItem[]): number {
  return items.filter((item) => item.type !== 'rest').length
}

export function countCompletedCheckableItems(
  items: PlanItem[],
  weekDates: Date[],
  completions: PlanCompletion[],
): number {
  let count = 0

  for (const date of weekDates) {
    const dateKey = getDateKey(date)
    const dayItems = items.filter(
      (item) => item.dayOfWeek === getPersianDayOfWeek(date) && item.type !== 'rest',
    )

    for (const item of dayItems) {
      if (isItemCompleted(item.id, dateKey, completions)) {
        count += 1
      }
    }
  }

  return count
}
