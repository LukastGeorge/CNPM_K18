import { beforeEach, describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useBookstore } from '../src/stores/bookstore.js'

describe('Tích hợp Pinia - vòng đời bán sách', () => {
  beforeEach(() => {
    const memory = new Map()
    globalThis.localStorage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) }
    setActivePinia(createPinia())
  })
  it('thêm giỏ, đặt hàng trừ kho, hủy hoàn kho đúng một lần', () => {
    const store = useBookstore()
    const book = store.books[0]
    const initial = book.variants[0].stock
    store.addToCart(book.id, 'paperback', 2)
    expect(store.cartCount).toBe(2)
    expect(book.variants[0].stock).toBe(initial)
    const order = store.checkout({ fullName: 'Nguyễn Văn An', phone: '0901234567', address: '123 Nguyễn Trãi, TP.HCM' })
    expect(store.cartCount).toBe(0)
    expect(book.variants[0].stock).toBe(initial - 2)
    store.changeOrderStatus(order.id, 'canceled')
    expect(book.variants[0].stock).toBe(initial)
    expect(() => store.changeOrderStatus(order.id, 'canceled')).toThrow()
    expect(book.variants[0].stock).toBe(initial)
  })
  it('ngăn thêm vượt tồn kho và điều chỉnh xuống âm', () => {
    const store = useBookstore()
    const book = store.books[0]
    expect(() => store.addToCart(book.id, 'paperback', 999999)).toThrow()
    expect(() => store.adjustStock(book.id, 'paperback', -999999)).toThrow()
  })
  it('lưu mới sách và xóa sách chưa bán', () => {
    const store = useBookstore()
    const payload = { title: 'Sách thử nghiệm', author: 'Nhóm nghiên cứu', isbn: 'T-123456', category: 'Công nghệ', description: '', color: '#ffffff', ink: '#111111', featured: false, variants: [{ id: 'paperback', name: 'Bìa mềm', price: 100000, stock: 2, discount: 0 }] }
    const id = store.saveBook(payload)
    expect(store.getBook(id).title).toBe('Sách thử nghiệm')
    store.deleteBook(id)
    expect(store.getBook(id)).toBeUndefined()
  })
})
