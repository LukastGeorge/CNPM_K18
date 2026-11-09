<script setup>
import { reactive, ref, watch } from 'vue'
import { X, Save, BookOpen } from 'lucide-vue-next'
import { CATEGORIES } from '../data/seed.js'
import { useBookstore } from '../stores/bookstore.js'
const props = defineProps({ book: { type: Object, default: null } })
const emit = defineEmits(['close', 'saved'])
const store = useBookstore()
function blank() { return { title: '', author: '', isbn: '', category: 'Văn học', description: '', color: '#d3e1ed', ink: '#22354f', featured: false, variants: [ { id: 'paperback', name: 'Bìa mềm', price: 100000, stock: 10, discount: 0 }, { id: 'hardcover', name: 'Bìa cứng', price: 150000, stock: 5, discount: 0 } ] } }
const form = reactive(blank())
const error = ref('')
watch(() => props.book, (value) => { const next = value ? JSON.parse(JSON.stringify(value)) : blank(); for (const key of Object.keys(form)) delete form[key]; Object.assign(form, next); error.value = '' }, { immediate: true })
function save() {
  error.value = ''
  try { const id = store.saveBook(form); emit('saved', id) }
  catch (e) { error.value = e.message }
}
</script>
<template>
  <div class="modal-overlay" @click.self="emit('close')"><section class="editor-modal" role="dialog" aria-modal="true" :aria-label="book ? 'Chỉnh sửa sách' : 'Thêm sách mới'"><header class="editor-head"><div><p class="overline overline--admin">DANH MỤC / EDITOR</p><h2>{{ book ? 'Chỉnh sửa đầu sách' : 'Thêm đầu sách mới' }}</h2><p>Cấu hình thông tin và tồn kho cho từng phiên bản.</p></div><button class="icon-btn" type="button" aria-label="Đóng" @click="emit('close')"><X :size="22"/></button></header>
    <form class="editor-body" @submit.prevent="save"><div class="form-grid"><label class="form-field">Tên sách <span>*</span><input v-model.trim="form.title" required maxlength="150" placeholder="Ví dụ: Clean Code" /></label><label class="form-field">Tác giả <span>*</span><input v-model.trim="form.author" required maxlength="100" placeholder="Tên tác giả" /></label></div><div class="form-grid"><label class="form-field">Mã ISBN <span>*</span><input v-model.trim="form.isbn" required maxlength="40" placeholder="978..." /></label><label class="form-field">Thể loại <span>*</span><select v-model="form.category"><option v-for="category in CATEGORIES" :key="category">{{ category }}</option></select></label></div><label class="form-field">Giới thiệu sách<textarea v-model="form.description" rows="3" maxlength="1000" placeholder="Mô tả nội dung sách..."></textarea></label><div class="editor-colors"><label class="form-field">Màu bìa <input v-model="form.color" type="color" /></label><label class="form-field">Màu chữ bìa <input v-model="form.ink" type="color" /></label><label class="toggle-check"><input v-model="form.featured" type="checkbox"/> Sách nổi bật</label></div>
      <div class="editor-section-title"><BookOpen :size="18"/><strong>Phiên bản & tồn kho</strong><span>Mỗi phiên bản có giá và tồn kho độc lập</span></div><div v-for="variant in form.variants" :key="variant.id" class="variant-editor"><strong>{{ variant.name }}</strong><div class="form-grid form-grid--three"><label class="form-field">Giá niêm yết (₫)<input v-model.number="variant.price" type="number" required min="1" step="1000" /></label><label class="form-field">Tồn kho<input v-model.number="variant.stock" type="number" required min="0" step="1" /></label><label class="form-field">Giảm giá (%)<input v-model.number="variant.discount" type="number" required min="0" max="100" step="1" /></label></div></div>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p><footer class="editor-footer"><button type="button" class="btn btn--outline" @click="emit('close')">Hủy</button><button class="btn btn--dark" type="submit"><Save :size="17"/> {{ book ? 'Lưu thay đổi' : 'Thêm sách' }}</button></footer>
    </form></section></div>
</template>
