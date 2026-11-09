import { availableStock, lowestPrice } from '../domain/book.js'
import { currency } from '../utils/format.js'

// MOCK deterministic: không dùng API, không thu thập dữ liệu hay gửi tin nhắn ra máy chủ.
export function mockBookAdvice(prompt, books) {
  const normalized = String(prompt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
  if (!normalized.trim()) return { text: 'Bạn đang quan tâm thể loại gì? Hãy thử “sách lập trình”, “dưới 150k” hoặc “sách văn học”.', suggestions: [] }
  const targets = [
    { pattern: /lap trinh|code|cong nghe|phan mem|devops|python|java/, category: 'Công nghệ' },
    { pattern: /van hoc|tieu thuyet|truyen|lang man/, category: 'Văn học' },
    { pattern: /ky nang|phat trien ban than|thoi quen|giao tiep/, category: 'Kỹ năng' },
    { pattern: /kinh doanh|tai chinh|kinh te|dau tu/, category: 'Kinh tế' },
    { pattern: /tre em|thieu nhi|be /, category: 'Thiếu nhi' },
    { pattern: /khoa hoc|vu tru|vat ly/, category: 'Khoa học' },
    { pattern: /lich su/, category: 'Lịch sử' },
  ]
  const target = targets.find(({ pattern }) => pattern.test(normalized))?.category
  const budget = normalized.match(/(?:duoi|toi da|<)\s*(\d+(?:[.,]\d+)?)\s*(k|nghin|trieu|m)?/)
  const max = budget ? Number(budget[1].replace(',', '.')) * (budget[2] === 'trieu' || budget[2] === 'm' ? 1_000_000 : (budget[2] === 'k' || budget[2] === 'nghin' || Number(budget[1]) < 1000) ? 1000 : 1) : Infinity
  const picks = books.filter((b) => availableStock(b) > 0 && (!target || b.category === target) && lowestPrice(b) <= max)
    .sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3)
  if (!picks.length) return { text: 'Hiện chưa tìm thấy sách còn hàng phù hợp. Bạn thử bỏ giới hạn ngân sách hoặc chọn thể loại khác nhé.', suggestions: [] }
  return { text: `Mình gợi ý ${picks.length} đầu sách${target ? ` thuộc thể loại ${target}` : ''} đang còn hàng. Đây là phản hồi tự động theo quy tắc (mock AI), không phải AI trực tuyến.`, suggestions: picks.map((b) => ({ id: b.id, title: b.title, price: currency(lowestPrice(b)) })) }
}
