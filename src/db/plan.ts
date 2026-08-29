import { PLAN_DATA_VERSION, PLAN_VERSION_KEY } from '../lib/constants'
import { createDefaultPlanItems, getDateKey } from '../lib/plan'
import type { PlanCompletion, PlanItem } from '../types/plan'
import { getDB } from './index'

export async function getAllPlanItems(): Promise<PlanItem[]> {
  const db = await getDB()
  const items = await db.getAll('planItems')
  return items.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.sortOrder - b.sortOrder)
}

async function writeDefaultPlan(): Promise<PlanItem[]> {
  const defaults = createDefaultPlanItems()
  const db = await getDB()
  const tx = db.transaction('planItems', 'readwrite')
  await tx.store.clear()
  await Promise.all(defaults.map((item) => tx.store.put(item)))
  await tx.done
  await db.put('meta', PLAN_DATA_VERSION, PLAN_VERSION_KEY)
  return defaults
}

/** Clears all plan items + completions and seeds the Persian-week default. */
export async function resetToDefaultPlan(): Promise<PlanItem[]> {
  await clearPlanData()
  return writeDefaultPlan()
}

/**
 * Ensures plan matches Persian week (Sat–Fri).
 * Wipes stale data when PLAN_DATA_VERSION changes.
 */
export async function ensurePersianDefaultPlan(): Promise<PlanItem[]> {
  const db = await getDB()
  const storedVersion = (await db.get('meta', PLAN_VERSION_KEY)) as number | undefined

  if (storedVersion === PLAN_DATA_VERSION) {
    const existing = await getAllPlanItems()
    if (existing.length > 0) {
      return existing
    }
  }

  await clearPlanData()
  return writeDefaultPlan()
}

/** @deprecated Use ensurePersianDefaultPlan */
export async function seedDefaultPlanIfEmpty(): Promise<PlanItem[]> {
  return ensurePersianDefaultPlan()
}

export async function savePlanItem(item: PlanItem): Promise<void> {
  const db = await getDB()
  await db.put('planItems', item)
}

export async function deletePlanItem(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('planItems', id)
}

export async function replaceAllPlanItems(items: PlanItem[]): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('planItems', 'readwrite')
  await tx.store.clear()
  await Promise.all(items.map((item) => tx.store.put(item)))
  await tx.done
}

export async function getCompletionsForDates(dateKeys: string[]): Promise<PlanCompletion[]> {
  if (dateKeys.length === 0) return []

  const db = await getDB()
  const keys = new Set(dateKeys)
  const all = await db.getAllFromIndex('planCompletions', 'date')
  return all.filter((completion) => keys.has(completion.date))
}

export async function togglePlanCompletion(
  planItemId: string,
  date: Date,
): Promise<boolean> {
  const db = await getDB()
  const dateKey = getDateKey(date)
  const id = `${dateKey}:${planItemId}`
  const existing = await db.get('planCompletions', id)

  if (existing) {
    await db.delete('planCompletions', id)
    return false
  }

  const completion: PlanCompletion = {
    id,
    planItemId,
    date: dateKey,
    completedAt: new Date().toISOString(),
  }
  await db.put('planCompletions', completion)
  return true
}

export async function clearPlanData(): Promise<void> {
  const db = await getDB()
  await db.clear('planItems')
  await db.clear('planCompletions')
}
