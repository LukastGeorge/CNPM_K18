<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { LibraryBig, Boxes, ReceiptText, Wallet, ArrowUpRight, ArrowRight, AlertTriangle, TrendingUp, Clock3, Sparkles, BookOpen } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
import { availableStock } from '../domain/book.js'
import { ORDER_STATUSES } from '../domain/order.js'
import { currency, shortDate } from '../utils/format.js'
const store = useBookstore()
const units = computed(() => store.books.reduce((s, book) => s + availableStock(book), 0))
const completed = computed(() => store.orders.filter((o) => o.status === 'completed').length)
const stats = computed(() => [
  { title: 'Tổng đầu sách', value: String(store.books.length), note: 'Các tựa sách đang quản lý', icon: LibraryBig, tone: 'blue' },
  { title: 'Tồn kho', value: String(units.value), note: `${store.lowStockBooks.length} đầu sách sắp hết`, icon: Boxes, tone: 'orange' },
  { title: 'Đơn hàng', value: String(store.orders.length), note: `${store.activeOrders.length} đơn cần xử lý`, icon: ReceiptText, tone: 'purple' },
  { title: 'Doanh thu hoàn thành', value: currency(store.revenue), note: `${completed.value} đơn hoàn thành`, icon: Wallet, tone: 'green' },
])
const latestOrders = computed(() => store.orders.slice(0, 5))
const byCategory = computed(() => {
  const counts = store.categories.map((name) => ({ name, count: store.books.filter((book) => book.category === name).length }))
  const highest = Math.max(1, ...counts.map((c) => c.count))
  return counts.map((c) => ({ ...c, width: `${c.count / highest * 100}%` }))
})
const shortage = computed(() => [...store.lowStockBooks].sort((a,b) => availableStock(a) - availableStock(b)).slice(0, 5))
</script>
<template>
  <div class="admin-page"><div class="admin-page-header"><div><p class="overline overline--admin">DASHBOARD / OVERVIEW</p><h1>Tổng quan <span>nhà sách</span></h1><p>Theo dõi hoạt động, sản phẩm và đơn hàng từ một nơi.</p></div><RouterLink to="/quan-tri/sach" class="btn btn--dark"><LibraryBig :size="18"/> Quản lý sách <ArrowUpRight :size="16"/></RouterLink></div>
    <div class="welcome-banner"><div><div class="welcome-banner__tag"><Sparkles :size="15"/> WORKSPACE</div><h2>Chào mừng trở lại! <span>👋</span></h2><p>Mọi dữ liệu của BookFlow đang được quản lý ngay trên trình duyệt này.</p><RouterLink to="/sach">Xem cửa hàng <ArrowRight :size="16"/></RouterLink></div><div class="welcome-banner__decoration"><BookOpen :size="105" :stroke-width="0.7"/></div></div>
    <div class="stats-grid"><div v-for="stat in stats" :key="stat.title" class="stat-card"><div class="stat-card__head"><span>{{ stat.title }}</span><span class="stat-card__icon" :class="`stat-card__icon--${stat.tone}`"><component :is="stat.icon" :size="20"/></span></div><div class="stat-card__value">{{ stat.value }}</div><div class="stat-card__foot"><TrendingUp :size="14"/> {{ stat.note }}</div></div></div>
    <div class="admin-grid admin-grid--split"><section class="panel admin-panel"><div class="panel-heading"><div><h2>Phân bổ đầu sách</h2><p>Theo thể loại đang kinh doanh</p></div><RouterLink to="/quan-tri/sach" class="panel-action">Chi tiết <ArrowUpRight :size="17"/></RouterLink></div><div class="category-bars"><div v-for="(item, index) in byCategory" :key="item.name" class="bar-row"><span class="bar-row__label">{{ item.name }}</span><div class="bar-track"><span :style="{ width: item.width, background: ['#6c8bd8','#86b5a0','#e2ab6a','#a996d6','#dc9397','#7aaac0','#b39b76'][index] }"></span></div><strong>{{ item.count }}</strong></div></div></section>
      <section class="panel admin-panel"><div class="panel-heading"><div><h2>Cảnh báo tồn kho</h2><p>Ngưỡng cảnh báo ≤ {{ store.settings.lowStockThreshold }} cuốn</p></div><RouterLink to="/quan-tri/kho" class="panel-action">Quản lý kho <ArrowUpRight :size="17"/></RouterLink></div><div v-if="shortage.length" class="alert-list"><div v-for="book in shortage" :key="book.id" class="alert-row"><span class="alert-icon"><AlertTriangle :size="18"/></span><div><strong>{{ book.title }}</strong><small>{{ book.category }} · {{ book.id }}</small></div><span class="alert-count" :class="{ zero: !availableStock(book) }">{{ availableStock(book) }} cuốn</span></div></div><div v-else class="empty-mini">Tất cả đầu sách đang trên ngưỡng cảnh báo.</div></section></div>
    <section class="panel admin-panel"><div class="panel-heading"><div><h2>Đơn hàng gần đây</h2><p>Cập nhật theo hoạt động mua sách mô phỏng</p></div><RouterLink to="/quan-tri/don-hang" class="panel-action">Xem tất cả <ArrowRight :size="17"/></RouterLink></div><div v-if="!latestOrders.length" class="table-empty"><Clock3 :size="29"/><strong>Chưa có đơn hàng</strong><span>Hãy đặt thử một đơn ở giao diện cửa hàng để kiểm tra luồng.</span><RouterLink class="text-link" to="/sach">Khám phá sách <ArrowRight :size="15"/></RouterLink></div><div v-else class="table-scroller"><table class="data-table"><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead><tbody><tr v-for="order in latestOrders" :key="order.id"><td class="strong-cell">{{ order.id }}</td><td>{{ order.customer.fullName }}</td><td>{{ shortDate(order.createdAt) }}</td><td class="strong-cell">{{ currency(order.total) }}</td><td><span class="status-badge" :class="`status-badge--${order.status}`">{{ ORDER_STATUSES[order.status] }}</span></td></tr></tbody></table></div></section>
  </div>
</template>
