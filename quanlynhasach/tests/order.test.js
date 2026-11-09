import { describe, it, expect } from 'vitest'
import { freshBooks } from '../src/data/seed.js'
import { cartSubtotal, cartTotal, shippingFee, createOrderSnapshot, validateCustomer, canTransitionOrder } from '../src/domain/order.js'

describe('Giỏ hàng và đơn hàng', () => {
  it('tính tổng từng dòng và miễn phí vận chuyển từ 350 nghìn', () => {
    expect(cartSubtotal([{ unitPrice: 100000, quantity: 2 }])).toBe(200000)
    expect(cartTotal([{ unitPrice: 100000, quantity: 2 }])).toBe(225000)
    expect(shippingFee(350000)).toBe(0)
    expect(shippingFee(0)).toBe(0)
  })
  it('thẩm định thông tin nhận hàng', () => {
    expect(() => validateCustomer({ fullName: 'An', phone: '0987654321', address: '123 Nguyễn Trãi, Quận 1' })).not.toThrow()
    expect(() => validateCustomer({ fullName: 'A', phone: '123', address: 'x' })).toThrow()
  })
  it('tạo snapshot đơn gồm số lượng và giá tại thời điểm bán', () => {
    const books = freshBooks()
    const order = createOrderSnapshot([{ bookId: books[0].id, variantId: 'paperback', quantity: 2 }], { fullName: 'Nguyễn Văn An', phone: '0901234567', address: '123 Nguyễn Trãi, TP.HCM' }, books, '2026-11-09T10:00:00.000Z')
    expect(order.items).toHaveLength(1)
    expect(order.items[0].quantity).toBe(2)
    expect(order.items[0].unitPrice).toBe(113520)
    expect(order.status).toBe('new')
    expect(order.total).toBe(order.subtotal + order.shipping)
  })
  it('không cho đặt hàng vượt tồn kho', () => {
    const books = freshBooks()
    const cart = [{ bookId: books[0].id, variantId: 'paperback', quantity: 100000 }]
    expect(() => createOrderSnapshot(cart, { fullName: 'Nguyễn An', phone: '0901234567', address: '123 Nguyễn Trãi, TP.HCM' }, books)).toThrow(/vượt tồn kho/)
  })
  it('không cho chuyển ngược trạng thái hoặc hủy đơn lần hai', () => {
    expect(canTransitionOrder('new', 'processing')).toBe(true)
    expect(canTransitionOrder('processing', 'completed')).toBe(true)
    expect(canTransitionOrder('completed', 'new')).toBe(false)
    expect(canTransitionOrder('canceled', 'canceled')).toBe(false)
  })
})
