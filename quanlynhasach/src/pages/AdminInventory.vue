<script setup>
import { computed, ref } from 'vue'
import { Search, Boxes, AlertTriangle, Plus, Minus, PackagePlus, ArrowUpRight } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
import { availableStock } from '../domain/book.js'
import BookCover from '../components/BookCover.vue'
const store = useBookstore()
const query = ref('')
const stockFilter = ref('all')
const adjustment = ref(null)
const amount = ref(1)
const mode = ref('in')
const reason = ref('Nhập / điều chỉnh kho')
const error = ref('')
const filtered = computed(() => store.books.filter((b) => {
  const match = `${b.title} ${b.author} ${b.id}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(query.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
  const sum = availableStock(b)
  return match && (stockFilter === 'all' || (stockFilter === 'low' && sum <= store.settings.lowStockThreshold) || (stockFilter === 'empty' && sum === 0))
}))
const totalUnits = computed(() => store.books.reduce((n, book) => n + availableStock(book), 0))
function openAdjustment(book, variant) { adjustment.value = { book, variant }; amount.value = 1; mode.value = 'in'; reason.value = 'Nhập / điều chỉnh kho'; error.value = '' }
function submit() {
  error.value = ''
  try { store.adjustStock(adjustment.value.book.id, adjustment.value.variant.id, (mode.value === 'in' ? 1 : -1) * Number(amount.value), reason.value); adjustment.value = null }
  catch (e) { error.value = e.message }
}
</script>
<template>
  <div class="admin-page"><div class="admin-page-header"><div><p class="overline overline--admin">WAREHOUSE / STOCK CONTROL</p><h1>Quản lý <span>kho hàng</span></h1><p>Kiểm soát chính xác số lượng tồn theo từng phiên bản sách.</p></div><div class="topbar-chip"><PackagePlus :size="16"/> Tồn kho cập nhật tức thời</div></div>
    <div class="catalog-cards"><div><span>Số cuốn trong kho</span><strong>{{ totalUnits }}</strong><small>Tổng của mọi phiên bản</small></div><div><span>Sắp hết hàng</span><strong>{{ store.lowStockBooks.length }}</strong><small>Ngưỡng ≤ {{ store.settings.lowStockThreshold }}</small></div><div><span>Phiên bản hết hàng</span><strong>{{ store.books.flatMap((b) => b.variants).filter((v) => v.stock === 0).length }}</strong><small>Cần bổ sung kho</small></div></div>
    <div v-if="store.lowStockBooks.length" class="warning-banner"><AlertTriangle :size="20"/><span><strong>Cần chú ý!</strong> Có {{ store.lowStockBooks.length }} đầu sách tồn kho thấp hoặc đã hết.</span></div>
    <section class="panel admin-panel"><div class="table-filters"><div class="search-field search-field--admin"><Search :size="18"/><input v-model="query" placeholder="Tìm tên sách hoặc mã sách" aria-label="Tìm kiếm tồn kho"/></div><select v-model="stockFilter" class="admin-select" aria-label="Lọc tồn kho"><option value="all">Tất cả tồn kho</option><option value="low">Sắp hết hàng</option><option value="empty">Hết hàng</option></select></div><div class="table-scroller"><table class="data-table"><thead><tr><th>Đầu sách</th><th>Phiên bản</th><th>Tồn kho</th><th>Trạng thái</th><th>Điều chỉnh</th></tr></thead><tbody><template v-for="book in filtered" :key="book.id"><tr v-for="(variant, index) in book.variants" :key="`${book.id}-${variant.id}`"><td><div v-if="index === 0" class="book-cell"><BookCover :book="book" size="tiny"/><span><strong>{{ book.title }}</strong><small>{{ book.id }}</small></span></div><span v-else class="muted indent-cell">↳ cùng đầu sách</span></td><td>{{ variant.name }}</td><td class="strong-cell">{{ variant.stock }} cuốn</td><td><span :class="['stock-badge', variant.stock === 0 ? 'stock-badge--empty' : variant.stock <= store.settings.lowStockThreshold ? 'stock-badge--low' : 'stock-badge--ok']">{{ !variant.stock ? 'Hết hàng' : variant.stock <= store.settings.lowStockThreshold ? 'Sắp hết' : 'Đủ hàng' }}</span></td><td><button class="btn btn--small btn--outline" @click="openAdjustment(book, variant)"><Plus :size="15"/> Cập nhật kho <ArrowUpRight :size="13"/></button></td></tr></template></tbody></table></div><div v-if="!filtered.length" class="table-empty"><Boxes :size="30"/><strong>Không có dữ liệu phù hợp</strong></div></section>
    <div v-if="adjustment" class="modal-overlay" @click.self="adjustment = null"><section class="small-modal" role="dialog" aria-modal="true" aria-label="Điều chỉnh tồn kho"><div class="panel-heading"><h2>Điều chỉnh tồn kho</h2><button class="icon-btn" @click="adjustment = null">✕</button></div><p class="muted">{{ adjustment.book.title }} · {{ adjustment.variant.name }}</p><p class="inventory-current">Hiện có <strong>{{ adjustment.variant.stock }} cuốn</strong> trong kho</p><form @submit.prevent="submit"><div class="mode-buttons"><button type="button" :class="{ active: mode === 'in' }" @click="mode = 'in'"><Plus :size="17"/> Nhập kho</button><button type="button" :class="{ active: mode === 'out' }" @click="mode = 'out'"><Minus :size="17"/> Xuất kho</button></div><label class="form-field">Số lượng<input v-model.number="amount" type="number" min="1" step="1" required /></label><label class="form-field">Lý do điều chỉnh<input v-model="reason" maxlength="150" placeholder="Nhập hàng, kiểm kê, hỏng..." /></label><p v-if="error" class="form-error">{{ error }}</p><button class="btn btn--dark btn--full" type="submit">Xác nhận điều chỉnh</button></form></section></div>
  </div>
</template>
