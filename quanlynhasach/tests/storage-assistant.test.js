import { describe, it, expect } from 'vitest'
import { initialDatabase, isValidDatabase, exportDatabase } from '../src/services/storage.js'
import { mockBookAdvice } from '../src/services/assistant.js'

describe('Độ tin cậy dữ liệu và trợ lý mô phỏng', () => {
  it('tạo dữ liệu mẫu hợp lệ và có thể xuất JSON', () => {
    const db = initialDatabase()
    expect(isValidDatabase(db)).toBe(true)
    expect(JSON.parse(exportDatabase(db)).books.length).toBeGreaterThan(0)
  })
  it('từ chối schema sai và tồn kho âm', () => {
    const db = initialDatabase(); db.schemaVersion = 999
    expect(isValidDatabase(db)).toBe(false)
    db.schemaVersion = 1; db.books[0].variants[0].stock = -1
    expect(isValidDatabase(db)).toBe(false)
  })
  it('chatbot lọc sách bằng quy tắc mà không cần API', () => {
    const db = initialDatabase()
    const advice = mockBookAdvice('Sách lập trình', db.books)
    expect(advice.suggestions.length).toBeGreaterThan(0)
    expect(advice.suggestions.every((v) => db.books.find((book) => book.id === v.id).category === 'Công nghệ')).toBe(true)
  })
  it('không phát sinh đề xuất khi ngưỡng ngân sách quá thấp', () => {
    const db = initialDatabase()
    const advice = mockBookAdvice('sach cong nghe duoi 1k', db.books)
    expect(advice.suggestions).toHaveLength(0)
  })
})
