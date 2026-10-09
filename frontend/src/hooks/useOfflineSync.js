import { openDB } from 'idb'
import { submitAnswer } from '../api'

const DB_NAME = 'tutor-offline'
const STORE = 'pending-answers'

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { autoIncrement: true })
      }
    },
  })
}

export async function queueAnswer(payload) {
  const db = await getDB()
  await db.add(STORE, payload)
  if (navigator.onLine) await flushQueue()
}

export async function flushQueue() {
  const db = await getDB()
  const keys = await db.getAllKeys(STORE)
  const items = await db.getAll(STORE)
  for (let i = 0; i < items.length; i++) {
    try {
      await submitAnswer(items[i])
      await db.delete(STORE, keys[i])
    } catch {
      break // stop on first failure; retry next time online
    }
  }
}

// Auto-flush when connectivity is restored
if (typeof window !== 'undefined') {
  window.addEventListener('online', flushQueue)
}
