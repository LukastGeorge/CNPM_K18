<script setup>
import { RouterLink } from 'vue-router'
import { BookOpenText, ArrowLeft } from 'lucide-vue-next'
</script>
<template><div class="notfound"><BookOpenText :size="52"/><p>404 · LOST PAGE</p><h1>Trang sách này<br>chưa được viết.</h1><span>Đường dẫn bạn truy cập không tồn tại.</span><RouterLink to="/" class="btn btn--dark"><ArrowLeft :size="17"/> Trở về trang chủ</RouterLink></div></template>
