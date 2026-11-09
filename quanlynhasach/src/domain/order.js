import { salePrice, variantFor } from './book.js'

export const SHIPPING_FEE = 25000
export const FREE_SHIPPING_FROM = 350000

export function lineTotal(item) { return item.unitPrice * item.quantity }
export function cartSubtotal(items) { return items.reduce((sum, item) => sum + lineTotal(item), 0) }
export function shippingFee(subtotal) { return subtotal >= FREE_SHIPPING_FROM || subtotal === 0 ? 0 : SHIPPING_FEE }
export function cartTotal(items) { const subtotal = cartSubtotal(items); return subtotal + shippingFee(subtotal) }
export function validateCustomer(customer) {
  if (String(customer.fullName || '').trim().length < 2) throw new Error('Họ tên phải có ít nhất 2 ký tự.')
  if (!/^(\+84|0)[0-9]{9}$/.test(String(customer.phone || '').replace(/[\s.-]/g, ''))) throw new Error('Số điện thoại Việt Nam không hợp lệ.')
  if (String(customer.address || '').trim().length < 10) throw new Error('Địa chỉ nhận hàng cần ít nhất 10 ký tự.')
  return true
}
export function createOrderSnapshot(cart, customer, books, now = new Date().toISOString()) {
  validateCustomer(customer)
  if (!cart.length) throw new Error('Giỏ hàng đang trống.')
  const items = cart.map(({ bookId, variantId, quantity }) => {
    const book = books.find((candidate) => candidate.id === bookId)
    const variant = variantFor(book, variantId)
    if (!book || !variant) throw new Error('Một sản phẩm không còn tồn tại. Vui lòng kiểm tra giỏ hàng.')
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > variant.stock) throw new Error(`${book.title}: số lượng vượt tồn kho.`)
    return { bookId, variantId, title: book.title, author: book.author, format: variant.name, quantity, unitPrice: salePrice(variant), color: book.color, ink: book.ink }
  })
  const subtotal = cartSubtotal(items)
  return {
    id: `DH-${Date.parse(now).toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    customer: { fullName: customer.fullName.trim(), phone: customer.phone.trim(), address: customer.address.trim(), note: String(customer.note || '').trim() },
    items, subtotal, shipping: shippingFee(subtotal), total: subtotal + shippingFee(subtotal),
    status: 'new', createdAt: now, updatedAt: now,
  }
}
export const ORDER_STATUSES = { new: 'Mới tạo', processing: 'Đang xử lý', completed: 'Hoàn thành', canceled: 'Đã hủy' }
export function canTransitionOrder(current, next) {
  return (current === 'new' && ['processing', 'canceled'].includes(next)) || (current === 'processing' && ['completed', 'canceled'].includes(next))
}
