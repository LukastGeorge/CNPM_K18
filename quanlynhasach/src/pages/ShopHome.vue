<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, ArrowUpRight, Sparkles, BookOpen, Heart, Feather, Code2, Lightbulb, TrendingUp, Microscope, Landmark } from 'lucide-vue-next'
import { useBookstore } from '../stores/bookstore.js'
import BookCard from '../components/BookCard.vue'
import BookCover from '../components/BookCover.vue'
const store = useBookstore()
const featured = computed(() => store.books.filter((b) => b.featured).slice(0, 8))
const heroBook = computed(() => store.books.find((b) => b.id === 'B002') || store.books[0])
const categories = [
  { name: 'Văn học', icon: Feather, tone: 'rose', count: 'Câu chuyện truyền cảm hứng' },
  { name: 'Kỹ năng', icon: Lightbulb, tone: 'mint', count: 'Tốt hơn mỗi ngày' },
  { name: 'Công nghệ', icon: Code2, tone: 'blue', count: 'Tư duy thời đại số' },
  { name: 'Kinh tế', icon: TrendingUp, tone: 'yellow', count: 'Tri thức và tài chính' },
  { name: 'Thiếu nhi', icon: Heart, tone: 'pink', count: 'Nuôi dưỡng trí tưởng tượng' },
  { name: 'Khoa học', icon: Microscope, tone: 'lavender', count: 'Khám phá thế giới' },
  { name: 'Lịch sử', icon: Landmark, tone: 'sand', count: 'Đọc về những thời đại' },
]
</script>
<template>
  <div class="home">
    <section class="hero container"><div class="hero__content"><div class="eyebrow"><Sparkles :size="16"/> GÓC ĐỌC SÁCH CỦA RIÊNG BẠN</div><h1>Mở một cuốn sách.<br><em>Mở cả thế giới.</em></h1><p>Những ý tưởng lớn bắt đầu từ một trang sách nhỏ. Tìm cuốn sách tiếp theo dành cho bạn ngay hôm nay.</p><div class="hero__actions"><RouterLink to="/sach" class="btn btn--dark">Khám phá tủ sách <ArrowRight :size="18" /></RouterLink><RouterLink to="/quan-tri" class="text-link">Vào trang quản lý <ArrowUpRight :size="17"/></RouterLink></div><div class="hero__trust"><div class="avatar-stack"><span>TT</span><span>DH</span><span>HQ</span><span>PM</span></div><span><strong>{{ store.books.length }}+ đầu sách</strong><br>đang chờ bạn khám phá</span></div></div>
      <div class="hero__visual"><div class="hero__circle"></div><div class="hero__shelf"><BookCover v-if="heroBook" :book="heroBook" size="hero" /></div><div class="hero__note"><span class="note-icon"><BookOpen :size="20"/></span><div><strong>Mỗi ngày một trang</strong><small>Tri thức cho tương lai</small></div></div><div class="hero__caption">THE ART OF<br>READING MORE.</div></div></section>
    <section class="section-block container"><div class="section-heading"><div><p class="overline">DANH MỤC NỔI BẬT</p><h2>Khám phá theo <em>thể loại</em></h2></div><RouterLink to="/sach" class="text-link">Tất cả sách <ArrowRight :size="18"/></RouterLink></div><div class="category-grid"><RouterLink v-for="category in categories" :key="category.name" :to="{ name: 'catalog', query: { category: category.name } }" class="category-card" :class="`category-card--${category.tone}`"><span class="category-card__icon"><component :is="category.icon" :size="25" :stroke-width="1.7" /></span><strong>{{ category.name }}</strong><small>{{ category.count }}</small><span class="category-card__arrow"><ArrowUpRight :size="18" /></span></RouterLink></div></section>
    <section class="section-block section-block--soft"><div class="container"><div class="section-heading"><div><p class="overline">ĐƯỢC YÊU THÍCH</p><h2>Tuyển chọn dành <em>cho bạn</em></h2><p>Những tựa sách nổi bật từ nhiều thể loại</p></div><RouterLink to="/sach" class="text-link">Xem tất cả <ArrowRight :size="18"/></RouterLink></div><div class="product-grid"><BookCard v-for="book in featured" :key="book.id" :book="book" /></div></div></section>
    <section class="container editorial"><div><span class="editorial__eyebrow">BOOKFLOW / YOUR READING JOURNEY</span><h2>Không chỉ đọc sách.<br><em>Còn là cách chúng ta lớn lên.</em></h2><p>Thời gian dành cho một cuốn sách có thể làm thay đổi cách bạn nhìn thế giới. Hãy bắt đầu hành trình ấy bằng một lựa chọn nhỏ.</p><RouterLink to="/sach" class="btn btn--light">Tìm cuốn sách của bạn <ArrowRight :size="18"/></RouterLink></div><div class="editorial__decoration"><span>“</span><p>A reader lives a thousand lives before he dies.</p><small>— GEORGE R. R. MARTIN</small></div></section>
  </div>
</template>
