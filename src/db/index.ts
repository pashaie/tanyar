import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Habit, HabitCompletion } from '../types/habit'
import type { PlanCompletion, PlanItem } from '../types/plan'
import type { ActiveWorkoutState, WorkoutSession } from '../types/workout'

interface TanYarDB extends DBSchema {
  sessions: {
    key: string
    value: WorkoutSession
    indexes: {
      startedAt: string
      createdAt: string
    }
  }
  meta: {
    key: string
    value: ActiveWorkoutState | number
  }
  planItems: {
    key: string
    value: PlanItem
    indexes: {
      dayOfWeek: PersianDayOfWeek
    }
  }
  planCompletions: {
    key: string
    value: PlanCompletion
    indexes: {
      date: string
      planItemId: string
    }
  }
  habits: {
    key: string
    value: Habit
  }
  habitCompletions: {
    key: string
    value: HabitCompletion
    indexes: {
      date: string
      habitId: string
    }
  }
}

type PersianDayOfWeek = PlanItem['dayOfWeek']

const DB_NAME = 'tanyar'
const DB_VERSION = 3

let dbPromise: Promise<IDBPDatabase<TanYarDB>> | null = null

export function getDB(): Promise<IDBPDatabase<TanYarDB>> {
  if (!dbPromise) {
    dbPromise = openDB<TanYarDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains('sessions')) {
            const store = db.createObjectStore('sessions', { keyPath: 'id' })
            store.createIndex('startedAt', 'startedAt')
            store.createIndex('createdAt', 'createdAt')
          }
          if (!db.objectStoreNames.contains('meta')) {
            db.createObjectStore('meta')
          }
        }

        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('planItems')) {
            const store = db.createObjectStore('planItems', { keyPath: 'id' })
            store.createIndex('dayOfWeek', 'dayOfWeek')
          }
          if (!db.objectStoreNames.contains('planCompletions')) {
            const store = db.createObjectStore('planCompletions', { keyPath: 'id' })
            store.createIndex('date', 'date')
            store.createIndex('planItemId', 'planItemId')
          }
        }

        if (oldVersion < 3) {
          if (!db.objectStoreNames.contains('habits')) {
            db.createObjectStore('habits', { keyPath: 'id' })
          }
          if (!db.objectStoreNames.contains('habitCompletions')) {
            const store = db.createObjectStore('habitCompletions', { keyPath: 'id' })
            store.createIndex('date', 'date')
            store.createIndex('habitId', 'habitId')
          }
        }
      },
    })
  }

  return dbPromise
}
