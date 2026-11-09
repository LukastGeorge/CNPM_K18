import { describe, it, expect } from 'vitest'
import { freshBooks } from '../src/data/seed.js'
import { availableStock, lowestPrice, salePrice, searchBooks, validateBook } from '../src/domain/book.js'

describe('Danh mục và tồn kho', () => {
  const books = freshBooks()
  it('không trùng mã sách / ISBN trong dữ liệu mẫu', () => {
    expect(new Set(books.map((b) => b.id)).size).toBe(books.length)
    expect(new Set(books.map((b) => b.isbn)).size).toBe(books.length)
  })
  it('mỗi phiên bản có tồn kho độc lập', () => {
    expect(availableStock(books[0])).toBe(books[0].variants[0].stock + books[0].variants[1].stock)
  })
  it('tính giá bán sau khuyến mãi không sai số âm', () => {
    expect(salePrice({ price: 200000, discount: 10 })).toBe(180000)
    expect(salePrice({ price: 200000, discount: 200 })).toBe(0)
    expect(lowestPrice(books[0])).toBeLessThanOrEqual(books[0].variants[0].price)
  })
  it('tìm kiếm không phân biệt dấu tiếng Việt', () => {
    expect(searchBooks(books, { query: 'dac nhan tam' })).toHaveLength(1)
    expect(searchBooks(books, { category: 'Công nghệ' }).every((b) => b.category === 'Công nghệ')).toBe(true)
    expect(searchBooks(books, { stock: true }).every((b) => availableStock(b) > 0)).toBe(true)
  })
  it('từ chối sách có giá hoặc tồn kho không hợp lệ', () => {
    const invalid = structuredClone(books[0]); invalid.variants[0].stock = -1
    expect(() => validateBook(invalid)).toThrow(/Tồn kho/)
    invalid.variants[0].stock = 1; invalid.variants[0].price = 0
    expect(() => validateBook(invalid)).toThrow(/Giá bán/)
  })
})
