<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingBag, ArrowLeft, Minus, Plus, Trash2, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
import { currency } from '../utils/format.js'
import BookCover from '../components/BookCover.vue'
const store = useBookstore()
const customer = reactive({ fullName: '', phone: '', address: '', note: '' })
const placedOrder = ref(null)
const errorText = ref('')
function update(item, value) { try { store.updateCart(item.bookId, item.variantId, value) } catch (e) { store.notify(e.message, 'error') } }
function submit() {
  errorText.value = ''
  try { placedOrder.value = store.checkout(customer) }
  catch (error) { errorText.value = error.message; store.notify(error.message, 'error') }
}
</script>
<template>
  <div class="container cart-page"><div class="page-heading"><p class="overline">BOOKFLOW / CHECKOUT</p><h1>Giỏ hàng <em>của bạn</em></h1><p>Kiểm tra lại những cuốn sách trước khi đặt hàng.</p></div>
    <div v-if="placedOrder" class="checkout-success"><div class="checkout-success__icon"><CheckCircle2 :size="38"/></div><h2>Đặt hàng thành công!</h2><p>Đơn <strong>{{ placedOrder.id }}</strong> đã được lưu trong trình duyệt. Đây là đơn hàng mô phỏng, chưa được gửi đến cửa hàng thực tế.</p><div class="checkout-success__sum">Tổng đơn hàng: <strong>{{ currency(placedOrder.total) }}</strong></div><div class="actions-center"><RouterLink to="/sach" class="btn btn--dark">Tiếp tục mua sách <ArrowRight :size="17"/></RouterLink><RouterLink to="/quan-tri/don-hang" class="btn btn--outline">Xem đơn trong quản trị</RouterLink></div></div>
    <div v-else-if="!store.cartLines.length" class="empty-state"><ShoppingBag :size="50" :stroke-width="1.4"/><h3>Giỏ hàng đang trống</h3><p>Hãy chọn một vài cuốn sách thú vị để bắt đầu.</p><RouterLink to="/sach" class="btn btn--dark">Khám phá sách <ArrowRight :size="17" /></RouterLink></div>
    <div v-else class="checkout-grid"><div class="cart-left"><section class="panel cart-items-panel"><div class="panel-heading"><h2>Sản phẩm đã chọn <span>({{ store.cartCount }})</span></h2><RouterLink to="/sach" class="text-link"><ArrowLeft :size="16"/> Mua thêm sách</RouterLink></div>
      <div v-for="row in store.cartLines" :key="`${row.bookId}-${row.variantId}`" class="cart-item"><BookCover :book="row.book" size="mini"/><div class="cart-item__info"><RouterLink :to="`/sach/${row.bookId}`" class="cart-item__title">{{ row.book.title }}</RouterLink><div class="muted">{{ row.book.author }}</div><span class="cart-item__format">{{ row.variant.name }}</span><div class="cart-item__controls"><div class="quantity-input quantity-input--small"><button :disabled="row.quantity <= 1" aria-label="Giảm" @click="update(row, row.quantity - 1)"><Minus :size="14"/></button><strong>{{ row.quantity }}</strong><button :disabled="row.quantity >= row.variant.stock" aria-label="Tăng" @click="update(row, row.quantity + 1)"><Plus :size="14"/></button></div><button class="cart-item__remove" @click="store.removeFromCart(row.bookId, row.variantId)"><Trash2 :size="15"/> Xóa</button></div></div><strong class="cart-item__price">{{ currency(row.lineTotal) }}</strong></div>
    </section><section class="panel checkout-form-panel"><h2>Thông tin nhận hàng</h2><p>Không cần tài khoản. Thông tin chỉ được lưu trên trình duyệt của bạn.</p><form id="checkout-form" @submit.prevent="submit"><div class="form-grid"><label class="form-field">Họ và tên <span>*</span><input v-model="customer.fullName" required minlength="2" maxlength="90" placeholder="Nguyễn Văn A" autocomplete="name"/></label><label class="form-field">Số điện thoại <span>*</span><input v-model="customer.phone" required maxlength="20" placeholder="09xx xxx xxx" autocomplete="tel"/></label></div><label class="form-field">Địa chỉ giao hàng <span>*</span><input v-model="customer.address" required minlength="10" maxlength="300" placeholder="Số nhà, đường, phường/xã, tỉnh/thành" autocomplete="street-address"/></label><label class="form-field">Ghi chú đơn hàng<textarea v-model="customer.note" rows="3" maxlength="400" placeholder="Ghi chú (nếu có)"></textarea></label><div v-if="errorText" class="form-error" role="alert">{{ errorText }}</div></form></section></div>
      <aside class="panel order-summary"><h2>Tóm tắt đơn hàng</h2><div class="summary-row"><span>Tạm tính ({{ store.cartCount }} cuốn)</span><strong>{{ currency(store.subtotal) }}</strong></div><div class="summary-row"><span>Phí vận chuyển</span><strong :class="{ 'good': store.shipping === 0 }">{{ store.shipping ? currency(store.shipping) : 'Miễn phí' }}</strong></div><div v-if="store.shipping" class="shipping-note">Thêm {{ currency(350000 - store.subtotal) }} để được miễn phí vận chuyển.</div><div class="summary-total"><span>Tổng thanh toán</span><strong>{{ currency(store.total) }}</strong></div><div class="summary-tax">Đã bao gồm giá bán sau giảm giá (nếu có).</div><button form="checkout-form" type="submit" class="btn btn--dark btn--full">Xác nhận đặt hàng <ArrowRight :size="19"/></button><div class="secure-note"><ShieldCheck :size="18"/> Không thanh toán trực tuyến · Dữ liệu demo</div></aside>
    </div>
  </div>
</template>
