<script setup>
import { computed } from 'vue'
import { goods } from '../composebles/useGoods.js'

const pendingCount = computed(function() {
  let pendingReviews = 0
  for (let goodsIndex = 0; goodsIndex < goods.value.length; goodsIndex++) {
    const reviews = goods.value[goodsIndex].reviews
    if (!reviews) continue
    for (let reviewIndex = 0; reviewIndex < reviews.length; reviewIndex++) {
      if (!reviews[reviewIndex].approved) pendingReviews = pendingReviews + 1
    }
  }
  return pendingReviews
})
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-label">Управление</div>
      <nav>
        <RouterLink :to="{ name: 'admin-products' }" class="s-link">Все товары</RouterLink>
        <RouterLink :to="{ name: 'admin-add' }" class="s-link">+ Добавить товар</RouterLink>
        <RouterLink :to="{ name: 'admin-reviews' }" class="s-link">
          Отзывы
          <span v-if="pendingCount > 0" class="pending-dot">{{ pendingCount }}</span>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-users' }" class="s-link">Пользователи</RouterLink>
        <RouterLink :to="{ name: 'home' }" class="s-link s-back">← В магазин</RouterLink>
      </nav>
    </aside>
    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>
<style scoped>
.admin-layout { display: grid; grid-template-columns: 200px 1fr; min-height: calc(100vh - 89px); }
.sidebar { border-right: 1px solid var(--border); padding: 36px 28px; }
.sidebar-label {
  font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--gray-mid); margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border);
}
.s-link { display: block; padding: 9px 0; font-size: 12px; color: var(--gray-dark); transition: color .2s; letter-spacing: 0.04em; }
.s-link:hover { color: var(--black); }
.s-link.router-link-active { color: var(--black); font-weight: 700; }
.s-back { margin-top: 16px; color: var(--gray-light); }
.pending-dot { display: inline-flex; align-items: center; justify-content: center; background: #e89b00; color: #fff; font-size: 9px; font-weight: 700; min-width: 18px; height: 18px; border-radius: 50%; padding: 0 3px; margin-left: 6px; }
.admin-main { padding: 40px 28px; }
</style>
