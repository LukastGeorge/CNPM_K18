<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { BookOpenText, LayoutDashboard, LibraryBig, Boxes, ReceiptText, Settings, Store, Menu, X, Database, PanelLeftClose } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
const store = useBookstore()
const route = useRoute()
const mobileOpen = ref(false)
const links = [
  { to: '/quan-tri', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
  { to: '/quan-tri/sach', label: 'Danh mục sách', icon: LibraryBig },
  { to: '/quan-tri/kho', label: 'Kho & tồn hàng', icon: Boxes },
  { to: '/quan-tri/don-hang', label: 'Đơn hàng', icon: ReceiptText },
  { to: '/quan-tri/cai-dat', label: 'Cài đặt & sao lưu', icon: Settings },
]
function isActive(item) { return item.exact ? route.path === item.to : route.path.startsWith(item.to) }
</script>
<template>
  <div class="admin-shell">
    <aside class="sidebar" :class="{ 'sidebar--open': mobileOpen }"><div class="sidebar__head"><RouterLink to="/quan-tri" class="brand brand--admin" @click="mobileOpen = false"><span class="brand-mark"><BookOpenText :size="21" /></span><span>book<span class="brand-light">flow</span><small>MANAGEMENT SYSTEM</small></span></RouterLink><button class="icon-btn mobile-menu" aria-label="Đóng menu" @click="mobileOpen = false"><X :size="22" /></button></div>
      <div class="sidebar__body"><p class="nav-caption">WORKSPACE</p><nav class="side-nav" aria-label="Điều hướng quản trị"><RouterLink v-for="item in links" :key="item.to" :to="item.to" :class="{ active: isActive(item) }" @click="mobileOpen = false"><component :is="item.icon" :size="19"/><span>{{ item.label }}</span><span v-if="item.to === '/quan-tri/don-hang' && store.activeOrders.length" class="nav-count">{{ store.activeOrders.length }}</span></RouterLink></nav><p class="nav-caption nav-caption--second">CỬA HÀNG</p><nav class="side-nav"><RouterLink to="/" @click="mobileOpen = false"><Store :size="19"/><span>Xem trang bán sách</span></RouterLink></nav></div>
      <div class="sidebar__foot"><div class="sidebar__demo"><Database :size="19"/><span><strong>Demo Local-first</strong><small>Lưu trên trình duyệt này</small></span></div><div class="sidebar__copyright">BookFlow © 2026 · Version 1.0</div></div>
    </aside>
    <div v-if="mobileOpen" class="sidebar-backdrop" @click="mobileOpen = false"></div>
    <div class="admin-main"><header class="admin-topbar"><div class="admin-topbar__left"><button class="icon-btn admin-toggle" aria-label="Mở menu quản trị" @click="mobileOpen = true"><Menu :size="23" /></button><PanelLeftClose class="admin-topbar__icon" :size="18" /><span class="breadcrumb-label">Workspace <span>/</span> {{ route.meta.title }}</span></div><div class="admin-topbar__right"><span class="topbar-chip"><span class="status-dot"></span> Local demo</span><RouterLink to="/" class="topbar-shop"><Store :size="17"/> Xem cửa hàng</RouterLink><span class="admin-avatar">BF</span></div></header><div class="admin-content"><RouterView /></div></div>
  </div>
</template>
