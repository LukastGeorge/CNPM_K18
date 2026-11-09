import { slugify } from '../utils/format.js'

export function availableStock(book) {
  return (book?.variants || []).reduce((sum, variant) => sum + Math.max(0, Number(variant.stock) || 0), 0)
}

export function variantFor(book, variantId) {
  return book?.variants?.find((v) => v.id === variantId)
}

export function salePrice(variant) {
  const price = Number(variant?.price) || 0
  const discount = Number(variant?.discount) || 0
  return Math.round(price * (1 - Math.min(100, Math.max(0, discount)) / 100))
}

export function lowestPrice(book) {
  return Math.min(...(book.variants || []).map(salePrice))
}

export function searchBooks(books, { query = '', category = 'all', sort = 'featured', stock = false } = {}) {
  const q = String(query).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
  const result = books.filter((book) => {
    const haystack = slugify([book.title, book.author, book.isbn].join(' '))
    return (!q || haystack.includes(slugify(q))) && (category === 'all' || book.category === category)
      && (!stock || availableStock(book) > 0)
  })
  return result.sort((a, b) => {
    if (sort === 'price-asc') return lowestPrice(a) - lowestPrice(b)
    if (sort === 'price-desc') return lowestPrice(b) - lowestPrice(a)
    if (sort === 'title') return a.title.localeCompare(b.title, 'vi')
    if (sort === 'stock') return availableStock(a) - availableStock(b)
    return Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt)
  })
}

export function validateBook(book) {
  if (!String(book.title || '').trim()) throw new Error('Tên sách không được để trống.')
  if (!String(book.author || '').trim()) throw new Error('Tên tác giả không được để trống.')
  if (!String(book.isbn || '').trim()) throw new Error('ISBN/mã sách không được để trống.')
  if (!String(book.category || '').trim()) throw new Error('Vui lòng chọn thể loại.')
  if (!Array.isArray(book.variants) || book.variants.length === 0) throw new Error('Sách phải có ít nhất một phiên bản.')
  for (const variant of book.variants) {
    if (!Number.isInteger(Number(variant.stock)) || Number(variant.stock) < 0) throw new Error('Tồn kho phải là số nguyên không âm.')
    if (!Number.isFinite(Number(variant.price)) || Number(variant.price) <= 0) throw new Error('Giá bán phải lớn hơn 0.')
    if (!Number.isFinite(Number(variant.discount)) || Number(variant.discount) < 0 || Number(variant.discount) > 100) throw new Error('Giảm giá phải trong khoảng 0–100%.')
  }
  return true
}
