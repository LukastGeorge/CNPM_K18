<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useBookstore } from './stores/bookstore.js'
import { CheckCircle2, AlertCircle, X } from 'lucide-vue-next'
const store = useBookstore()
const toast = computed(() => store.toast)
</script>
<template>
  <RouterView />
  <Transition name="toast">
    <div v-if="toast" :key="toast.id" class="app-toast" :class="toast.type" role="status" aria-live="polite">
      <AlertCircle v-if="toast.type === 'error'" :size="19" />
      <CheckCircle2 v-else :size="19" />
      <span>{{ toast.text }}</span>
      <button class="icon-btn" type="button" aria-label="Đóng thông báo" @click="store.dismiss()"><X :size="17" /></button>
    </div>
  </Transition>
</template>
