<script setup>
import { ref, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { Bot, MessageCircle, Send, X, Sparkles } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
import { mockBookAdvice } from '../services/assistant.js'
const store = useBookstore()
const open = ref(false)
const input = ref('')
const scrollTarget = ref(null)
const messages = ref([{ role: 'assistant', text: 'Xin chào! Mình là trợ lý mô phỏng của BookFlow. Bạn muốn tìm sách theo thể loại hay ngân sách?', suggestions: [] }])
async function send(text = input.value) {
  const clean = String(text).trim()
  if (!clean) return
  messages.value.push({ role: 'user', text: clean })
  messages.value.push({ role: 'assistant', ...mockBookAdvice(clean, store.books) })
  input.value = ''
  await nextTick()
  scrollTarget.value?.scrollTo({ top: scrollTarget.value.scrollHeight, behavior: 'smooth' })
}
</script>
<template>
  <div class="chat-wrapper">
    <Transition name="chat-pop"><section v-if="open" class="chat-panel" aria-label="Trợ lý tìm sách">
      <header class="chat-header"><div class="chat-header__avatar"><Bot :size="22" /></div><div><strong>BookFlow Assistant</strong><span><i class="status-dot"></i> Mô phỏng thông minh · Offline</span></div><button class="icon-btn" type="button" aria-label="Đóng chat" @click="open = false"><X :size="19" /></button></header>
      <div ref="scrollTarget" class="chat-messages" aria-live="polite"><div v-for="(message, i) in messages" :key="i" class="chat-message" :class="message.role"><p>{{ message.text }}</p><div v-if="message.suggestions?.length" class="chat-suggestions"><RouterLink v-for="book in message.suggestions" :key="book.id" :to="`/sach/${book.id}`" @click="open = false"><span>{{ book.title }}</span><strong>{{ book.price }}</strong></RouterLink></div></div></div>
      <div class="chat-quick"><button type="button" @click="send('Gợi ý sách lập trình')">Sách lập trình</button><button type="button" @click="send('Sách văn học dưới 150k')">Văn học dưới 150k</button></div>
      <form class="chat-form" @submit.prevent="send()"><input v-model="input" maxlength="300" placeholder="Hỏi về sách..." aria-label="Câu hỏi của bạn" /><button type="submit" :disabled="!input.trim()" aria-label="Gửi"><Send :size="17" /></button></form>
      <p class="chat-disclaimer">Không dùng API AI thật · Tư vấn theo quy tắc dữ liệu.</p>
    </section></Transition>
    <button class="chat-fab" type="button" :aria-label="open ? 'Đóng trợ lý' : 'Mở trợ lý'" @click="open = !open"><X v-if="open" :size="23" /><MessageCircle v-else :size="23" /><span v-if="!open" class="chat-fab__star"><Sparkles :size="12" /></span></button>
  </div>
</template>
