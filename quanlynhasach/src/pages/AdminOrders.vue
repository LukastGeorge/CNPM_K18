<script setup>
import { computed, ref } from 'vue'
import { ReceiptText, Search, Eye, X, Phone, MapPin, CalendarDays, Package, CheckCircle2, Ban, Clock } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
import { ORDER_STATUSES, canTransitionOrder } from '../domain/order.js'
import { currency, dateTime } from '../utils/format.js'
const store = useBookstore()
const query = ref('')
const status = ref('all')
const selected = ref(null)
const filtered = computed(() => store.orders.filter((order) => {
  const q = query.value.toLowerCase().trim()
  const match = `${order.id} ${order.customer.fullName} ${order.customer.phone}`.toLowerCase().includes(q)
  return match && (status.value === 'all' || status.value === order.status)
}))
function update(order, next) {
  try { store.changeOrderStatus(order.id, next); selected.value = store.orders.find((o) => o.id === order.id) }
  catch (e) { store.notify(e.message, 'error') }
}
</script>
<template>
  <div class="admin-page"><div class="admin-page-header"><div><p class="overline overline--admin">SALES / ORDERS</p><h1>Quản lý <span>đơn hàng</span></h1><p>Theo dõi trạng thái và xử lý các đơn đặt sách mô phỏng.</p></div><span class="topbar-chip"><ReceiptText :size="17"/> {{ store.orders.length }} đơn hàng</span></div>
    <div class="catalog-cards"><div><span>Tổng đơn hàng</span><strong>{{ store.orders.length }}</strong><small>Toàn bộ trạng thái</small></div><div><span>Chờ xử lý</span><strong>{{ store.activeOrders.length }}</strong><small>Mới & đang xử lý</small></div><div><span>Hoàn thành</span><strong>{{ store.orders.filter((o) => o.status === 'completed').length }}</strong><small>Đã hoàn tất</small></div></div>
    <section class="panel admin-panel"><div class="table-filters"><div class="search-field search-field--admin"><Search :size="18"/><input v-model="query" placeholder="Tìm mã đơn, tên, số điện thoại" aria-label="Tìm đơn hàng" maxlength="100"/></div><select v-model="status" class="admin-select" aria-label="Lọc trạng thái"><option value="all">Tất cả trạng thái</option><option v-for="(label, code) in ORDER_STATUSES" :key="code" :value="code">{{ label }}</option></select><span class="table-count">{{ filtered.length }} đơn</span></div>
      <div v-if="filtered.length" class="table-scroller"><table class="data-table"><thead><tr><th>Mã đơn hàng</th><th>Khách hàng</th><th>Ngày tạo</th><th>Giá trị</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody><tr v-for="order in filtered" :key="order.id"><td class="strong-cell">{{ order.id }}</td><td><strong class="table-name">{{ order.customer.fullName }}</strong><small class="cell-sub">{{ order.customer.phone }}</small></td><td>{{ dateTime(order.createdAt) }}</td><td class="strong-cell">{{ currency(order.total) }}</td><td><span class="status-badge" :class="`status-badge--${order.status}`">{{ ORDER_STATUSES[order.status] }}</span></td><td><button class="btn btn--small btn--outline" @click="selected = order"><Eye :size="16"/> Chi tiết</button></td></tr></tbody></table></div><div v-else class="table-empty"><ReceiptText :size="34"/><strong>Chưa có đơn hàng phù hợp</strong><span>Đặt thử một đơn từ trang bán sách để dữ liệu xuất hiện ở đây.</span></div>
    </section>
    <div v-if="selected" class="modal-overlay" @click.self="selected = null"><section class="order-modal" role="dialog" aria-modal="true" aria-label="Chi tiết đơn hàng"><div class="order-modal__head"><div><p class="overline overline--admin">ORDER DETAIL</p><h2>{{ selected.id }}</h2><span class="status-badge" :class="`status-badge--${selected.status}`">{{ ORDER_STATUSES[selected.status] }}</span></div><button class="icon-btn" aria-label="Đóng" @click="selected = null"><X :size="22"/></button></div><div class="order-modal__body"><h3>Thông tin khách hàng</h3><div class="info-line"><span><Phone :size="16"/> Liên hệ</span><strong>{{ selected.customer.fullName }} · {{ selected.customer.phone }}</strong></div><div class="info-line"><span><MapPin :size="16"/> Giao đến</span><strong>{{ selected.customer.address }}</strong></div><div class="info-line"><span><CalendarDays :size="16"/> Ngày đặt</span><strong>{{ dateTime(selected.createdAt) }}</strong></div><div v-if="selected.customer.note" class="info-line"><span>Ghi chú</span><strong>{{ selected.customer.note }}</strong></div><h3>Sách trong đơn</h3><div v-for="item in selected.items" :key="`${item.bookId}-${item.variantId}`" class="order-line"><span class="order-line__book"><Package :size="17"/>{{ item.title }} <small>({{ item.format }} × {{ item.quantity }})</small></span><strong>{{ currency(item.unitPrice * item.quantity) }}</strong></div><div class="summary-row"><span>Tạm tính</span><strong>{{ currency(selected.subtotal) }}</strong></div><div class="summary-row"><span>Vận chuyển</span><strong>{{ currency(selected.shipping) }}</strong></div><div class="summary-total"><span>Tổng cộng</span><strong>{{ currency(selected.total) }}</strong></div></div><div class="order-modal__footer"><button v-if="canTransitionOrder(selected.status, 'canceled')" class="btn btn--danger-soft" @click="update(selected, 'canceled')"><Ban :size="17"/> Hủy đơn & hoàn kho</button><button v-if="canTransitionOrder(selected.status, 'processing')" class="btn btn--dark" @click="update(selected, 'processing')"><Clock :size="17"/> Nhận xử lý</button><button v-if="canTransitionOrder(selected.status, 'completed')" class="btn btn--dark" @click="update(selected, 'completed')"><CheckCircle2 :size="17"/> Hoàn thành đơn</button><button v-if="!canTransitionOrder(selected.status, 'processing') && !canTransitionOrder(selected.status, 'completed') && !canTransitionOrder(selected.status, 'canceled')" class="btn btn--outline" @click="selected = null">Đóng</button></div></section></div>
  </div>
</template>
