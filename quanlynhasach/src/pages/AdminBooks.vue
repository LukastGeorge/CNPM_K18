<script setup>
import { computed, ref } from 'vue'
import { Search, Plus, Pencil, Trash2, BookOpen, Download, ArrowUpRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useBookstore } from '../stores/bookstore.js'
import { availableStock, lowestPrice, searchBooks } from '../domain/book.js'
import { currency } from '../utils/format.js'
import BookCover from '../components/BookCover.vue'
import BookEditor from '../components/BookEditor.vue'
const store = useBookstore()
const query = ref('')
const category = ref('all')
const editorOpen = ref(false)
const currentBook = ref(null)
const results = computed(() => searchBooks(store.books, { query: query.value, category: category.value, sort: 'title' }))
function openEditor(book = null) { currentBook.value = book; editorOpen.value = true }
function remove(book) {
  if (!confirm(`Bạn có chắc muốn xóa sách “${book.title}”?`)) return
  try { store.deleteBook(book.id) } catch (e) { store.notify(e.message, 'error') }
}
function exportCSV() {
  const header = ['Ma sach', 'ISBN', 'Ten sach', 'Tac gia', 'The loai', 'Gia tu', 'Ton kho']
  const rows = store.books.map((book) => [book.id, book.isbn, book.title, book.author, book.category, lowestPrice(book), availableStock(book)])
  const csv = [header, ...rows].map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a'); a.href = url; a.download = 'bookflow-danh-muc-sach.csv'; a.click(); URL.revokeObjectURL(url)
}
</script>
<template>
  <div class="admin-page"><div class="admin-page-header"><div><p class="overline overline--admin">INVENTORY / CATALOG</p><h1>Danh mục <span>sách</span></h1><p>Thêm, cập nhật và theo dõi toàn bộ đầu sách của cửa hàng.</p></div><div class="header-button-group"><button class="btn btn--outline" @click="exportCSV"><Download :size="17"/> Xuất CSV</button><button class="btn btn--dark" @click="openEditor()"><Plus :size="18"/> Thêm sách mới</button></div></div>
    <div class="catalog-cards"><div><span>Tổng đầu sách</span><strong>{{ store.books.length }}</strong><small>Đang quản lý</small></div><div><span>Đầu sách còn hàng</span><strong>{{ store.books.filter((b) => availableStock(b) > 0).length }}</strong><small>Có thể đặt mua</small></div><div><span>Sách hết hàng</span><strong>{{ store.books.filter((b) => availableStock(b) === 0).length }}</strong><small>Cần nhập bổ sung</small></div></div>
    <section class="panel admin-panel"><div class="table-filters"><div class="search-field search-field--admin"><Search :size="18"/><input v-model="query" maxlength="100" placeholder="Tìm tên, tác giả, ISBN..." aria-label="Tìm kiếm sách"/></div><select v-model="category" class="admin-select" aria-label="Lọc thể loại"><option value="all">Tất cả thể loại</option><option v-for="item in store.categories" :key="item">{{ item }}</option></select><span class="table-count">{{ results.length }} kết quả</span></div>
      <div class="table-scroller"><table class="data-table books-table"><thead><tr><th>Sách</th><th>Mã / ISBN</th><th>Thể loại</th><th>Giá từ</th><th>Tồn kho</th><th>Hành động</th></tr></thead><tbody><tr v-for="book in results" :key="book.id"><td><div class="book-cell"><BookCover :book="book" size="tiny"/><span><strong>{{ book.title }}</strong><small>{{ book.author }}</small></span></div></td><td><strong>{{ book.id }}</strong><small class="cell-sub">{{ book.isbn }}</small></td><td>{{ book.category }}</td><td class="strong-cell">{{ currency(lowestPrice(book)) }}</td><td><span :class="['stock-badge', availableStock(book) === 0 ? 'stock-badge--empty' : availableStock(book) <= store.settings.lowStockThreshold ? 'stock-badge--low' : 'stock-badge--ok']">{{ availableStock(book) }} cuốn</span></td><td><div class="table-actions"><RouterLink :to="`/sach/${book.id}`" class="icon-btn" title="Xem chi tiết"><ArrowUpRight :size="17"/></RouterLink><button class="icon-btn" title="Sửa sách" aria-label="Sửa sách" @click="openEditor(book)"><Pencil :size="17"/></button><button class="icon-btn icon-btn--danger" title="Xóa sách" aria-label="Xóa sách" @click="remove(book)"><Trash2 :size="17"/></button></div></td></tr></tbody></table></div>
      <div v-if="!results.length" class="table-empty"><BookOpen :size="30"/><strong>Không tìm thấy đầu sách</strong><span>Hãy thử thay đổi bộ lọc tìm kiếm.</span></div></section>
    <BookEditor v-if="editorOpen" :book="currentBook" @close="editorOpen = false" @saved="editorOpen = false"/>
  </div>
</template>
