import { freshBooks, freshOrders } from '../data/seed.js'

const KEY = 'bookflow.db.v1'
export const SCHEMA_VERSION = 1

export function initialDatabase() {
  return { schemaVersion: SCHEMA_VERSION, books: freshBooks(), orders: freshOrders(), cart: [], settings: { shopName: 'BookFlow', lowStockThreshold: 5 }, lastSavedAt: new Date().toISOString() }
}

export function isValidDatabase(data) {
  if (!data || data.schemaVersion !== SCHEMA_VERSION || !Array.isArray(data.books) || !Array.isArray(data.orders) || !Array.isArray(data.cart)) return false
  if (!data.settings || typeof data.settings.shopName !== 'string' || !Number.isInteger(data.settings.lowStockThreshold) || data.settings.lowStockThreshold < 0) return false
  if (!data.books.every((b) => typeof b.id === 'string' && typeof b.title === 'string' && Array.isArray(b.variants) && b.variants.every((v) => typeof v.id === 'string' && Number.isFinite(v.price) && v.price > 0 && Number.isInteger(v.stock) && v.stock >= 0))) return false
  if (!data.orders.every((o) => typeof o.id === 'string' && Array.isArray(o.items) && typeof o.status === 'string')) return false
  if (!data.cart.every((i) => typeof i.bookId === 'string' && typeof i.variantId === 'string' && Number.isInteger(i.quantity) && i.quantity > 0)) return false
  return true
}
export function readDatabase() {
  try {
    const value = localStorage.getItem(KEY)
    if (!value) return initialDatabase()
    const data = JSON.parse(value)
    return isValidDatabase(data) ? data : initialDatabase()
  } catch { return initialDatabase() }
}
export function writeDatabase(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...data, lastSavedAt: new Date().toISOString() }))
    return true
  } catch { return false }
}
export function exportDatabase(data) {
  return JSON.stringify({ ...data, lastSavedAt: new Date().toISOString() }, null, 2)
}
