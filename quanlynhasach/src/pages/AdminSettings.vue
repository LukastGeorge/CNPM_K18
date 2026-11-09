<script setup>
import { computed, reactive, ref } from 'vue'
import { Download, Upload, RotateCcw, DatabaseBackup, ShieldCheck, Info, Save, HardDriveDownload } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
import { exportDatabase } from '../services/storage.js'
const store = useBookstore()
const form = reactive({ shopName: store.settings.shopName, lowStockThreshold: store.settings.lowStockThreshold })
const fileInput = ref(null)
const error = ref('')
const saved = computed(() => store.lastSavedAt)
function saveSettings() { try { store.setSettings(form) } catch (e) { store.notify(e.message, 'error') } }
function downloadBackup() {
  const data = exportDatabase(store.db)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `bookflow-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url)
  store.notify('Đã tải file sao lưu JSON.')
}
async function onImport(event) {
  error.value = ''
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { error.value = 'File sao lưu tối đa 5 MB.'; event.target.value = ''; return }
  if (!confirm('Phục hồi sẽ ghi đè dữ liệu hiện tại. Bạn đã sao lưu chưa?')) { event.target.value = ''; return }
  try {
    const data = JSON.parse(await file.text())
    store.replaceDatabase(data)
    Object.assign(form, store.settings)
  } catch (e) { error.value = e.message || 'Không đọc được file.' }
  event.target.value = ''
}
function reset() {
  if (!confirm('Xóa dữ liệu đang sử dụng và khôi phục dữ liệu sách mẫu? Hành động này không thể hoàn tác nếu chưa sao lưu.')) return
  store.resetDatabase(); Object.assign(form, store.settings)
}
</script>
<template>
  <div class="admin-page"><div class="admin-page-header"><div><p class="overline overline--admin">SYSTEM / PREFERENCES</p><h1>Cài đặt <span>& dữ liệu</span></h1><p>Tùy chỉnh cấu hình, sao lưu và phục hồi dữ liệu trên trình duyệt.</p></div></div>
    <div class="settings-grid"><section class="panel settings-panel"><div class="settings-panel__heading"><span class="settings-icon"><Save :size="22"/></span><div><h2>Thiết lập cửa hàng</h2><p>Thông tin quản trị và ngưỡng cảnh báo.</p></div></div><form @submit.prevent="saveSettings"><label class="form-field">Tên nhà sách<input v-model="form.shopName" required maxlength="70" /></label><label class="form-field">Ngưỡng cảnh báo tồn kho (cuốn)<input v-model.number="form.lowStockThreshold" required type="number" min="0" max="10000" step="1" /></label><p class="settings-tip"><Info :size="17"/> Đầu sách có tổng tồn kho nhỏ hơn hoặc bằng ngưỡng này sẽ xuất hiện trong cảnh báo.</p><button class="btn btn--dark" type="submit"><Save :size="17"/> Lưu cài đặt</button></form></section>
      <section class="panel settings-panel"><div class="settings-panel__heading"><span class="settings-icon settings-icon--blue"><DatabaseBackup :size="23"/></span><div><h2>Sao lưu & phục hồi</h2><p>Lưu trữ dữ liệu chủ động dưới dạng JSON.</p></div></div><div class="backup-stack"><div class="backup-card"><HardDriveDownload :size="22"/><span><strong>Sao lưu dữ liệu</strong><small>Xuất sách, đơn hàng, giỏ hàng, cài đặt.</small></span><button class="btn btn--small btn--outline" @click="downloadBackup"><Download :size="16"/> Xuất JSON</button></div><div class="backup-card"><Upload :size="22"/><span><strong>Phục hồi dữ liệu</strong><small>Chọn tệp sao lưu JSON tương thích.</small></span><button class="btn btn--small btn--outline" @click="fileInput?.click()"><Upload :size="16"/> Nhập JSON</button><input ref="fileInput" type="file" accept=".json,application/json" hidden @change="onImport"/></div><p v-if="error" class="form-error">{{ error }}</p></div></section>
      <section class="panel settings-panel"><div class="settings-panel__heading"><span class="settings-icon settings-icon--green"><ShieldCheck :size="23"/></span><div><h2>Trạng thái hệ thống</h2><p>Kiểm tra dữ liệu demo và quyền riêng tư.</p></div></div><div class="system-details"><div><span>Lưu trữ</span><strong>localStorage · Trình duyệt hiện tại</strong></div><div><span>Phiên bản schema</span><strong>v{{ store.db.schemaVersion }}</strong></div><div><span>Đầu sách / Đơn hàng</span><strong>{{ store.books.length }} / {{ store.orders.length }}</strong></div><div><span>Ghi dữ liệu gần nhất</span><strong>{{ saved ? new Date(saved).toLocaleString('vi-VN') : 'Chưa ghi' }}</strong></div><div><span>Dịch vụ backend</span><strong>Không sử dụng</strong></div><div><span>Chatbot</span><strong>Mock offline · Không gửi API</strong></div></div></section>
      <section class="panel settings-panel settings-panel--danger"><div class="settings-panel__heading"><span class="settings-icon settings-icon--red"><RotateCcw :size="23"/></span><div><h2>Khôi phục bản demo</h2><p>Đặt lại sách và xóa giỏ hàng, đơn hàng hiện có.</p></div></div><p class="danger-copy">Thao tác này xóa toàn bộ dữ liệu cục bộ chưa được sao lưu. Hãy tải bản JSON trước khi đặt lại.</p><button class="btn btn--danger-soft" @click="reset"><RotateCcw :size="17"/> Khôi phục dữ liệu mẫu</button></section></div>
  </div>
</template>
