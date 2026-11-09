import { createRouter, createWebHistory } from 'vue-router'
import ShopLayout from './layouts/ShopLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import ShopHome from './pages/ShopHome.vue'
import ShopCatalog from './pages/ShopCatalog.vue'
import BookDetail from './pages/BookDetail.vue'
import CartPage from './pages/CartPage.vue'
import AdminDashboard from './pages/AdminDashboard.vue'
import AdminBooks from './pages/AdminBooks.vue'
import AdminOrders from './pages/AdminOrders.vue'
import AdminInventory from './pages/AdminInventory.vue'
import AdminSettings from './pages/AdminSettings.vue'
import NotFound from './pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: ShopLayout, children: [
      { path: '', name: 'home', component: ShopHome, meta: { title: 'Trang chủ' } },
      { path: 'sach', name: 'catalog', component: ShopCatalog, meta: { title: 'Danh mục sách' } },
      { path: 'sach/:id', name: 'book-detail', component: BookDetail, props: true, meta: { title: 'Chi tiết sách' } },
      { path: 'gio-hang', name: 'cart', component: CartPage, meta: { title: 'Giỏ hàng' } },
    ] },
    { path: '/quan-tri', component: AdminLayout, children: [
      { path: '', name: 'dashboard', component: AdminDashboard, meta: { title: 'Tổng quan' } },
      { path: 'sach', name: 'admin-books', component: AdminBooks, meta: { title: 'Quản lý sách' } },
      { path: 'kho', name: 'inventory', component: AdminInventory, meta: { title: 'Quản lý kho' } },
      { path: 'don-hang', name: 'orders', component: AdminOrders, meta: { title: 'Quản lý đơn hàng' } },
      { path: 'cai-dat', name: 'settings', component: AdminSettings, meta: { title: 'Cài đặt & dữ liệu' } },
    ] },
    { path: '/:pathMatch(.*)*', component: NotFound, meta: { title: 'Không tìm thấy trang' } },
  ],
})
router.afterEach((to) => { document.title = `${to.meta.title || 'Trang chủ'} | BookFlow` })
export default router
