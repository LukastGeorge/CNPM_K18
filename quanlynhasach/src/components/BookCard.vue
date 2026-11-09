<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ShoppingBag, ArrowUpRight } from 'lucide-vue-next'
import { availableStock, lowestPrice } from '../domain/book.js'
import { currency } from '../utils/format.js'
import { useBookstore } from '../stores/bookstore.js'
import BookCover from './BookCover.vue'
const props = defineProps({ book: { type: Object, required: true } })
const store = useBookstore()
const router = useRouter()
const inStock = computed(() => availableStock(props.book) > 0)
const minPrice = computed(() => lowestPrice(props.book))
const maxDiscount = computed(() => Math.max(...props.book.variants.map((v) => Number(v.discount || 0))))
function quickAdd() {
  try {
    const variant = props.book.variants.find((v) => v.stock > 0)
    if (variant) store.addToCart(props.book.id, variant.id)
    else router.push({ name: 'book-detail', params: { id: props.book.id } })
  } catch (error) { store.notify(error.message, 'error') }
}
</script>
<template>
  <article class="product-card">
    <RouterLink :to="{ name: 'book-detail', params: { id: book.id } }" class="product-card__image">
      <BookCover :book="book" />
      <span v-if="maxDiscount" class="product-card__badge">-{{ maxDiscount }}%</span>
    </RouterLink>
    <div class="product-card__body">
      <div class="micro-row"><span class="micro-label">{{ book.category }}</span><span v-if="!inStock" class="stock-text bad">Hết hàng</span><span v-else class="stock-text good">Còn hàng</span></div>
      <RouterLink :to="{ name: 'book-detail', params: { id: book.id } }" class="product-card__title">{{ book.title }}</RouterLink>
      <p class="product-card__author">{{ book.author }}</p>
      <div class="product-card__bottom"><strong class="price">{{ currency(minPrice) }}</strong>
        <button class="round-cart" type="button" :disabled="!inStock" :aria-label="`Thêm ${book.title} vào giỏ`" @click="quickAdd"><ShoppingBag :size="18" /></button>
      </div>
    </div>
    <RouterLink class="product-card__visit" :to="{ name: 'book-detail', params: { id: book.id } }" aria-label="Xem chi tiết"><ArrowUpRight :size="17" /></RouterLink>
  </article>
</template>
