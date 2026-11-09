<script setup>
import { computed } from 'vue'
import { BookOpen } from 'lucide-vue-next'
const props = defineProps({ book: { type: Object, required: true }, size: { type: String, default: 'regular' } })
const style = computed(() => ({ '--cover-color': props.book.color || '#d5e0da', '--ink-color': props.book.ink || '#334155' }))
</script>
<template>
  <div class="book-cover" :class="`book-cover--${size}`" :style="style" role="img" :aria-label="`Bìa sách ${book.title}`">
    <div class="book-cover__ornament"><span>BOOKFLOW</span><BookOpen :size="22" :stroke-width="1.4" /></div>
    <div class="book-cover__text"><span class="book-cover__category">{{ book.category }}</span><strong>{{ book.title }}</strong><small>{{ book.author }}</small></div>
    <div class="book-cover__foot"><i></i><span>COLLECTION / EDITION</span></div>
  </div>
</template>
