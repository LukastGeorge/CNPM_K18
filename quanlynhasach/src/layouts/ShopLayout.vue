<script setup>
import { computed, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { BookOpenText, ShoppingBag, Menu, X, ArrowUpRight, ShieldCheck, Truck, Headphones } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
import ChatAssistant from '../components/ChatAssistant.vue'
const store = useBookstore()
const cartCount = computed(() => store.cartCount)
const mobileOpen = ref(false)
</script>
<template>
  <div class="shop-site">
    <div class="announcement"><span>Miễn phí vận chuyển từ 350.000đ</span><span class="announcement__extra">· Khám phá thế giới qua từng trang sách</span></div>
    <header class="shop-header"><div class="container shop-header__inner">
      <RouterLink to="/" class="brand"><span class="brand-mark"><BookOpenText :size="22" /></span><span>book<span class="brand-light">flow</span><small>READ. DISCOVER. GROW.</small></span></RouterLink>
      <nav class="shop-nav" :class="{ 'shop-nav--open': mobileOpen }" aria-label="Điều hướng chính">
        <RouterLink to="/" @click="mobileOpen = false">Trang chủ</RouterLink><RouterLink to="/sach" @click="mobileOpen = false">Tủ sách</RouterLink><RouterLink to="/quan-tri" @click="mobileOpen = false">Quản lý cửa hàng <ArrowUpRight :size="14" /></RouterLink>
      </nav>
      <div class="shop-header__actions"><RouterLink class="header-cart" to="/gio-hang" aria-label="Xem giỏ hàng"><ShoppingBag :size="22" /><span v-if="cartCount" class="cart-dot">{{ cartCount }}</span><span class="header-cart__label">Giỏ hàng</span></RouterLink><button class="mobile-menu icon-btn" type="button" aria-label="Mở menu" @click="mobileOpen = !mobileOpen"><X v-if="mobileOpen" :size="24" /><Menu v-else :size="24" /></button></div>
    </div></header>
    <main><RouterView /></main>
    <section class="perks"><div class="container perks__grid"><div><Truck :size="24"/><span><strong>Giao hàng tiện lợi</strong><small>Đơn hàng được lưu và theo dõi</small></span></div><div><ShieldCheck :size="24"/><span><strong>Trải nghiệm minh bạch</strong><small>Dữ liệu demo lưu tại trình duyệt</small></span></div><div><Headphones :size="24"/><span><strong>Tư vấn chọn sách</strong><small>Trợ lý gợi ý tự động 24/7</small></span></div></div></section>
    <footer class="shop-footer"><div class="container footer-content"><div><div class="brand brand--footer"><span class="brand-mark"><BookOpenText :size="21"/></span><span>book<span class="brand-light">flow</span></span></div><p>Không gian đọc sách, học hỏi và khám phá.<br>Đồ án SPA — không có máy chủ hay thanh toán thật.</p></div><div><strong>Khám phá</strong><RouterLink to="/sach">Danh mục sách</RouterLink><RouterLink to="/gio-hang">Giỏ hàng</RouterLink></div><div><strong>Dành cho quản trị</strong><RouterLink to="/quan-tri">Bảng điều khiển</RouterLink><RouterLink to="/quan-tri/kho">Quản lý kho</RouterLink></div></div><div class="container footer-bottom">© 2026 BookFlow. Dự án môn học · Dữ liệu minh họa.</div></footer>
    <ChatAssistant />
  </div>
</template>
