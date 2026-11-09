// Kiểm tra nghiệp vụ JavaScript thuần - chạy được khi chưa npm install.
// Không thay thế Vitest cho Pinia/UI hay production build.
import assert from 'node:assert/strict'
import { freshBooks } from '../src/data/seed.js'
import { availableStock, searchBooks, salePrice, validateBook } from '../src/domain/book.js'
import { createOrderSnapshot, canTransitionOrder, cartTotal } from '../src/domain/order.js'
import { initialDatabase, isValidDatabase } from '../src/services/storage.js'
import { mockBookAdvice } from '../src/services/assistant.js'

let assertions = 0
const check = (predicate, message) => { assert.ok(predicate, message); assertions++ }
const books = freshBooks()
check(books.length === 18, 'Bộ dữ liệu mẫu có 18 đầu sách')
check(new Set(books.map((book) => book.id)).size === 18, 'Mã đầu sách không trùng')
check(searchBooks(books, { query: 'dac nhan tam' }).length === 1, 'Tìm kiếm không dấu')
check(availableStock(books[0]) === 37, 'Tồn kho của 2 phiên bản (28+9)')
check(salePrice(books[0].variants[0]) === 113520, 'Giá 129.000 giảm 12%')
validateBook(books[0]); assertions++
const db = initialDatabase()
check(isValidDatabase(db), 'Backup schema ban đầu hợp lệ')
const customer = { fullName: 'Nguyễn Văn An', phone: '0901234567', address: '123 Nguyễn Trãi, TP.HCM' }
const order = createOrderSnapshot([{ bookId: books[0].id, variantId: 'paperback', quantity: 2 }], customer, books)
check(order.subtotal === 227040 && order.total === 252040, 'Tổng đơn bao gồm vận chuyển')
check(cartTotal([{ unitPrice: 200000, quantity: 2 }]) === 400000, 'Miễn ship từ 350k')
check(canTransitionOrder('new', 'canceled'), 'Cho phép hủy đơn mới')
check(!canTransitionOrder('canceled', 'canceled'), 'Không hoàn kho 2 lần')
check(mockBookAdvice('Sách công nghệ dưới 500k', books).suggestions.length > 0, 'Chatbot gợi ý phù hợp')
console.log(`PASS: ${assertions} kiểm tra nghiệp vụ domain (không cần npm install)`)
