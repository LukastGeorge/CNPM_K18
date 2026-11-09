import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { availableStock, salePrice, validateBook, variantFor } from '../domain/book.js'
import { canTransitionOrder, createOrderSnapshot, cartSubtotal, cartTotal, shippingFee } from '../domain/order.js'
import { initialDatabase, isValidDatabase, readDatabase, writeDatabase } from '../services/storage.js'

export const useBookstore = defineStore('bookstore', () => {
  const db = ref(readDatabase())
  const toast = ref(null)
  const lastSavedAt = ref(db.value.lastSavedAt)
  let toastCounter = 0
  const books = computed(() => db.value.books)
  const orders = computed(() => db.value.orders)
  const cart = computed(() => db.value.cart)
  const settings = computed(() => db.value.settings)
  const categories = computed(() => [...new Set(db.value.books.map((b) => b.category))])
  const cartCount = computed(() => cart.value.reduce((n, row) => n + row.quantity, 0))
  const cartLines = computed(() => cart.value.map((item) => {
    const book = books.value.find((b) => b.id === item.bookId)
    const variant = variantFor(book, item.variantId)
    if (!book || !variant) return null
    return { ...item, book, variant, unitPrice: salePrice(variant), lineTotal: salePrice(variant) * item.quantity }
  }).filter(Boolean))
  const subtotal = computed(() => cartSubtotal(cartLines.value))
  const shipping = computed(() => shippingFee(subtotal.value))
  const total = computed(() => cartTotal(cartLines.value))
  const lowStockBooks = computed(() => books.value.filter((b) => availableStock(b) <= Number(settings.value.lowStockThreshold || 5)))
  const revenue = computed(() => orders.value.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.total, 0))
  const activeOrders = computed(() => orders.value.filter((o) => !['completed', 'canceled'].includes(o.status)))

  watch(db, (value) => {
    if (!writeDatabase(value)) toast.value = { type: 'error', text: 'Không lưu được dữ liệu: bộ nhớ trình duyệt đã đầy hoặc bị chặn.' }
    else lastSavedAt.value = new Date().toISOString()
  }, { deep: true })
  function notify(text, type = 'success') { toastCounter++; toast.value = { id: toastCounter, text, type } }
  function dismiss() { toast.value = null }
  function getBook(id) { return books.value.find((b) => b.id === id) }
  function addToCart(bookId, variantId, quantity = 1) {
    const book = getBook(bookId)
    const variant = variantFor(book, variantId)
    if (!variant) throw new Error('Không tìm thấy phiên bản sách.')
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Số lượng phải là số nguyên dương.')
    const row = db.value.cart.find((i) => i.bookId === bookId && i.variantId === variantId)
    if ((row?.quantity || 0) + quantity > variant.stock) throw new Error('Số lượng yêu cầu vượt tồn kho hiện tại.')
    if (row) row.quantity += quantity
    else db.value.cart.push({ bookId, variantId, quantity })
    notify('Đã thêm sách vào giỏ hàng.')
  }
  function updateCart(bookId, variantId, quantity) {
    const row = db.value.cart.find((i) => i.bookId === bookId && i.variantId === variantId)
    if (!row) return
    if (!Number.isInteger(quantity)) throw new Error('Số lượng phải là số nguyên.')
    if (quantity <= 0) return removeFromCart(bookId, variantId)
    const stock = variantFor(getBook(bookId), variantId)?.stock ?? 0
    if (quantity > stock) throw new Error('Số lượng yêu cầu vượt tồn kho hiện tại.')
    row.quantity = quantity
  }
  function removeFromCart(bookId, variantId) {
    db.value.cart = db.value.cart.filter((i) => i.bookId !== bookId || i.variantId !== variantId)
    notify('Đã xóa khỏi giỏ hàng.')
  }
  function checkout(customer) {
    const snapshot = createOrderSnapshot(db.value.cart, customer, db.value.books)
    // Kiểm tra toàn bộ trước khi trừ kho: atomic trong một tab (không cam kết atomic đa thiết bị).
    for (const item of snapshot.items) {
      const variant = variantFor(getBook(item.bookId), item.variantId)
      variant.stock -= item.quantity
    }
    db.value.orders.unshift(snapshot)
    db.value.cart = []
    notify(`Tạo đơn ${snapshot.id} thành công.`)
    return snapshot
  }
  function changeOrderStatus(orderId, nextStatus) {
    const order = db.value.orders.find((o) => o.id === orderId)
    if (!order) throw new Error('Không tìm thấy đơn hàng.')
    if (!canTransitionOrder(order.status, nextStatus)) throw new Error('Không thể chuyển sang trạng thái này.')
    if (nextStatus === 'canceled') {
      for (const item of order.items) {
        const variant = variantFor(getBook(item.bookId), item.variantId)
        if (variant) variant.stock += item.quantity
      }
    }
    order.status = nextStatus
    order.updatedAt = new Date().toISOString()
    notify('Đã cập nhật trạng thái đơn hàng.')
  }
  function saveBook(payload) {
    validateBook(payload)
    const duplicate = books.value.find((book) => book.isbn === payload.isbn && book.id !== payload.id)
    if (duplicate) throw new Error('ISBN đã tồn tại trong danh mục.')
    const clean = JSON.parse(JSON.stringify(payload))
    clean.variants = clean.variants.map((v) => ({ ...v, price: Number(v.price), stock: Number(v.stock), discount: Number(v.discount || 0) }))
    const existing = clean.id ? books.value.findIndex((b) => b.id === clean.id) : -1
    if (existing >= 0) {
      db.value.books[existing] = clean
      notify('Đã cập nhật thông tin sách.')
    } else {
      const maxId = Math.max(0, ...books.value.map((b) => Number(b.id.replace(/^B/, '')) || 0))
      clean.id = `B${String(maxId + 1).padStart(3, '0')}`
      clean.createdAt = new Date().toISOString()
      db.value.books.unshift(clean)
      notify('Đã thêm đầu sách mới.')
    }
    return clean.id
  }
  function deleteBook(bookId) {
    if (orders.value.some((o) => o.items.some((item) => item.bookId === bookId) && o.status !== 'canceled')) throw new Error('Sách đã thuộc đơn hàng. Không thể xóa để giữ lịch sử.')
    db.value.books = books.value.filter((b) => b.id !== bookId)
    db.value.cart = cart.value.filter((item) => item.bookId !== bookId)
    notify('Đã xóa đầu sách.')
  }
  function adjustStock(bookId, variantId, amount, reason = '') {
    const variant = variantFor(getBook(bookId), variantId)
    if (!variant) throw new Error('Không tìm thấy phiên bản.')
    if (!Number.isInteger(amount) || amount === 0) throw new Error('Thay đổi tồn kho phải là số nguyên khác 0.')
    if (variant.stock + amount < 0) throw new Error('Tồn kho không được âm.')
    variant.stock += amount
    notify(`${amount > 0 ? 'Đã nhập' : 'Đã xuất'} ${Math.abs(amount)} cuốn${reason ? ` · ${reason}` : ''}.`)
  }
  function setSettings(next) {
    const threshold = Number(next.lowStockThreshold)
    if (!Number.isInteger(threshold) || threshold < 0 || threshold > 10000) throw new Error('Ngưỡng cảnh báo kho phải là số nguyên 0–10000.')
    db.value.settings = { shopName: String(next.shopName || 'BookFlow').trim().slice(0, 70), lowStockThreshold: threshold }
    notify('Đã lưu cài đặt.')
  }
  function replaceDatabase(data) {
    if (!isValidDatabase(data)) throw new Error('File JSON sai định dạng hoặc không tương thích phiên bản dữ liệu.')
    db.value = structuredClone(data)
    notify('Phục hồi dữ liệu thành công.')
  }
  function resetDatabase() { db.value = initialDatabase(); notify('Đã khôi phục dữ liệu mẫu.') }

  return { db, lastSavedAt, books, orders, cart, settings, categories, cartCount, cartLines, subtotal, shipping, total, lowStockBooks, revenue, activeOrders, toast, notify, dismiss, getBook, addToCart, updateCart, removeFromCart, checkout, changeOrderStatus, saveBook, deleteBook, adjustStock, setSettings, replaceDatabase, resetDatabase }
})
