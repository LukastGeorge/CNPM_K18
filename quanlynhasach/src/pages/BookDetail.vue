<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, ShoppingBag, CheckCircle2, AlertCircle, Minus, Plus, Tag, Truck, ShieldCheck } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
import { availableStock, salePrice } from '../domain/book.js'
import { currency } from '../utils/format.js'
import BookCover from '../components/BookCover.vue'
const props = defineProps({ id: { type: String, required: true } })
const store = useBookstore()
const book = computed(() => store.getBook(props.id))
const selectedId = ref('paperback')
const quantity = ref(1)
const previewId = ref(null)
watch(book, (value) => { selectedId.value = value?.variants[0]?.id || ''; quantity.value = 1 }, { immediate: true })
const variant = computed(() => book.value?.variants.find((v) => v.id === selectedId.value))
const previewCover = computed(() => {
  if (!book.value) return null
  const chosen = previewId.value || selectedId.value
  if (chosen === 'hardcover') return { ...book.value, color: book.value.ink, ink: book.value.color }
  return book.value
})
const currentPrice = computed(() => salePrice(variant.value))
const inStock = computed(() => (variant.value?.stock || 0) > 0)
function add() { try { store.addToCart(book.value.id, selectedId.value, quantity.value) } catch (e) { store.notify(e.message, 'error') } }
</script>
<template>
  <div v-if="book" class="container detail-page"><div class="crumb"><RouterLink to="/">Trang chủ</RouterLink><span>/</span><RouterLink to="/sach">Tủ sách</RouterLink><span>/</span><strong>{{ book.title }}</strong></div>
    <div class="detail-grid"><div class="detail-art"><BookCover :book="previewCover" size="detail"/><span class="detail-art__stamp">SELECTED READS · BOOKFLOW</span></div>
      <div class="detail-info"><RouterLink to="/sach" class="back-link"><ArrowLeft :size="17" /> Trở lại tủ sách</RouterLink><div class="detail-category">{{ book.category }} <span>·</span> Mã {{ book.id }}</div><h1>{{ book.title }}</h1><div class="detail-author">Tác giả <strong>{{ book.author }}</strong></div><div class="detail-divider"></div><p class="detail-desc">{{ book.description }}</p><div class="price-block"><span class="price-block__main">{{ currency(currentPrice) }}</span><span v-if="variant?.discount" class="price-block__original">{{ currency(variant.price) }}</span><span v-if="variant?.discount" class="discount-pill">Tiết kiệm {{ variant.discount }}%</span></div>
        <div class="variant-label">Chọn phiên bản</div><div class="variant-options"><button v-for="option in book.variants" :key="option.id" type="button" :class="{ active: option.id === selectedId }" @mouseover="previewId = option.id" @mouseleave="previewId = null" @click="selectedId = option.id; quantity = 1"><strong>{{ option.name }}</strong><small>{{ currency(salePrice(option)) }}</small><span v-if="!option.stock" class="variant-soldout">Hết hàng</span></button></div>
        <div class="variant-stock" :class="{ 'variant-stock--out': !inStock }"><CheckCircle2 v-if="inStock" :size="17"/><AlertCircle v-else :size="17"/>{{ inStock ? `Còn ${variant.stock} cuốn trong kho` : 'Phiên bản này tạm hết hàng' }} <span>· Tổng kho {{ availableStock(book) }}</span></div>
        <div class="detail-buy"><div class="quantity-input"><button type="button" :disabled="quantity <= 1" aria-label="Giảm số lượng" @click="quantity--"><Minus :size="17"/></button><strong>{{ quantity }}</strong><button type="button" :disabled="!inStock || quantity >= variant.stock" aria-label="Tăng số lượng" @click="quantity++"><Plus :size="17"/></button></div><button class="btn btn--dark btn--wide" :disabled="!inStock" @click="add"><ShoppingBag :size="19"/> {{ inStock ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng' }}</button></div>
        <div class="detail-benefits"><span><Truck :size="18"/> Miễn phí ship từ 350.000đ</span><span><ShieldCheck :size="18"/> Demo thanh toán mô phỏng</span></div><div class="book-specs"><div><span><Tag :size="16"/> ISBN</span><strong>{{ book.isbn }}</strong></div><div><span>Thể loại</span><strong>{{ book.category }}</strong></div><div><span>Phiên bản</span><strong>{{ book.variants.length }} lựa chọn</strong></div></div>
      </div></div>
  </div>
  <div v-else class="empty-state container"><h2>Không tìm thấy đầu sách</h2><RouterLink to="/sach" class="btn btn--dark">Quay về danh mục</RouterLink></div>
</template>
