<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search, SlidersHorizontal, X, BookOpen } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
import { searchBooks } from '../domain/book.js'
import BookCard from '../components/BookCard.vue'
const store = useBookstore()
const route = useRoute()
const query = ref(String(route.query.q || ''))
const category = ref(String(route.query.category || 'all'))
const sort = ref('featured')
const stock = ref(false)
watch(() => route.query, (value) => { query.value = String(value.q || ''); category.value = String(value.category || 'all') })
const filtered = computed(() => searchBooks(store.books, { query: query.value, category: category.value, sort: sort.value, stock: stock.value }))
function clear() { query.value = ''; category.value = 'all'; sort.value = 'featured'; stock.value = false }
</script>
<template>
  <div class="container page-catalog"><div class="page-heading"><p class="overline">BOOKFLOW / COLLECTION</p><h1>Góc sách <em>dành cho bạn</em></h1><p>Khám phá những đầu sách hay theo sở thích và nhu cầu của riêng bạn.</p></div>
    <div class="catalog-toolbar"><div class="search-field"><Search :size="19"/><input v-model="query" placeholder="Tìm theo tên sách, tác giả, ISBN..." aria-label="Tìm sách" maxlength="100"/><button v-if="query" class="icon-btn" type="button" aria-label="Xóa tìm kiếm" @click="query = ''"><X :size="16"/></button></div><div class="select-field"><SlidersHorizontal :size="17"/><select v-model="sort" aria-label="Sắp xếp sách"><option value="featured">Nổi bật nhất</option><option value="price-asc">Giá: Thấp đến cao</option><option value="price-desc">Giá: Cao đến thấp</option><option value="title">Tên A – Z</option><option value="stock">Sắp hết hàng</option></select></div></div>
    <div class="filter-pills"><button v-for="item in ['all', ...store.categories]" :key="item" :class="{ active: item === category }" @click="category = item">{{ item === 'all' ? 'Tất cả' : item }}</button></div>
    <div class="catalog-status"><span>Hiển thị <strong>{{ filtered.length }}</strong> / {{ store.books.length }} đầu sách</span><label class="toggle-check"><input v-model="stock" type="checkbox"/> Chỉ hiện sách còn hàng</label></div>
    <div v-if="filtered.length" class="product-grid product-grid--catalog"><BookCard v-for="book in filtered" :key="book.id" :book="book"/></div>
    <div v-else class="empty-state"><BookOpen :size="42" :stroke-width="1.3"/><h3>Chưa tìm thấy cuốn sách phù hợp</h3><p>Thử từ khóa hoặc danh mục khác nhé.</p><button class="btn btn--dark" @click="clear">Xóa bộ lọc</button></div>
  </div>
</template>
