<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { goods, wishlist, toggleWishlist, addToCart, isInCart } from '../composebles/useGoods.js'

const router = useRouter()

const wishlistItems = computed(function() {
  return goods.value.filter(function(good) {
    return wishlist.value.includes(good.id)
  })
})

// Выбранные размеры для добавления в корзину
const selectedSizes = ref({})

function toggleSize(productId, size) {
  if (selectedSizes.value[productId] === size) {
    selectedSizes.value[productId] = ''
  } else {
    selectedSizes.value[productId] = size
  }
}

function getStock(product, size) {
  if (!product.stock) return 0
  if ((product.stock && Object.keys(product.stock).length > 0)) return product.stock[size] || 0
  return product.stock
}

function allOutOfStock(product) {
  if (!product.stock) return false
  if (!(product.stock && Object.keys(product.stock).length > 0)) return product.stock <= 0
  const keys = Object.keys(product.stock)
  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    if (product.stock[keys[keyIndex]] > 0) return false
  }
  return true
}

function onAddToCart(product) {
  const size = selectedSizes.value[product.id]
  if (!size) return
  addToCart(product.id, size)
}
</script>

<template>
  <div class="wishlist-page">
    <div class="wishlist-breadcrumb">
      <RouterLink :to="{ name: 'home' }">Главная</RouterLink>
      <span>/</span>
      <span>Избранное</span>
    </div>

    <h1 class="wishlist-title">
      Избранное
      <span v-if="wishlistItems.length" class="wishlist-count">{{ wishlistItems.length }}</span>
    </h1>

    <!-- Пусто -->
    <div v-if="!wishlistItems.length" class="wishlist-empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      <p>Здесь будут товары, которые вы отметили сердечком</p>
      <button class="btn-catalog" @click="router.push({ name: 'home' })">Перейти в каталог</button>
    </div>

    <!-- Сетка товаров -->
    <div v-else class="wishlist-grid">
      <div v-for="p in wishlistItems" :key="p.id" class="wcard">
        <!-- Фото -->
        <div class="wcard-img" @click="router.push({ name: 'product-description', params: { id: p.id } })">
          <img :src="p.image" :alt="p.name" />
          <button class="wcard-heart active" @click.stop="toggleWishlist(p.id)" title="Убрать из избранного">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <div v-if="allOutOfStock(p)" class="wcard-out-badge">Нет в наличии</div>
        </div>

        <!-- Инфо -->
        <div class="wcard-info">
          <p class="wcard-name" @click="router.push({ name: 'product-description', params: { id: p.id } })">{{ p.name }}</p>
          <p class="wcard-price">{{ p.price.toLocaleString('ru-RU') }} ₽</p>

          <!-- Размеры + В корзину -->
          <template v-if="!allOutOfStock(p) && p.sizes && p.sizes.length">
            <div class="wcard-sizes">
              <button
                v-for="size in p.sizes"
                :key="size"
                :class="['wsize', {
                  'wsize--active': selectedSizes[p.id] === size,
                  'wsize--out': getStock(p, size) === 0
                }]"
                :disabled="getStock(p, size) === 0"
                @click="toggleSize(p.id, size)"
              >{{ size }}</button>
            </div>
            <button
              :class="['wcard-cart', { 'wcard-cart--added': selectedSizes[p.id] && isInCart(p.id, selectedSizes[p.id]) }]"
              :disabled="!selectedSizes[p.id]"
              @click="onAddToCart(p)"
            >
              <span v-if="selectedSizes[p.id] && isInCart(p.id, selectedSizes[p.id])">В корзине ✓</span>
              <span v-else-if="selectedSizes[p.id]">В корзину</span>
              <span v-else>Выберите размер</span>
            </button>
          </template>
          <div v-else-if="allOutOfStock(p)" class="wcard-out-text">Нет в наличии</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wishlist-page { padding: 24px 40px 60px; max-width: 1200px; margin: 0 auto; }

.wishlist-breadcrumb { display: flex; gap: 8px; font-size: 11px; color: var(--gray-mid); letter-spacing: 0.06em; margin-bottom: 32px; }
.wishlist-breadcrumb a:hover { color: var(--black); }

.wishlist-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 400; margin-bottom: 32px; display: flex; align-items: baseline; gap: 12px; }
.wishlist-count { font-family: 'Montserrat', sans-serif; font-size: 13px; color: var(--gray-mid); font-weight: 400; }

/* Пусто */
.wishlist-empty { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 80px 40px; color: var(--gray-mid); text-align: center; }
.wishlist-empty p { font-size: 14px; letter-spacing: 0.03em; max-width: 320px; line-height: 1.7; }
.btn-catalog { padding: 13px 40px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; }
.btn-catalog:hover { background: #333; }

/* Сетка */
.wishlist-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px 16px; }

.wcard { display: flex; flex-direction: column; }

.wcard-img { position: relative; aspect-ratio: 3/4; background: var(--gray-bg); overflow: hidden; cursor: pointer; }
.wcard-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s ease; }
.wcard-img:hover img { transform: scale(1.05); }

.wcard-heart { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.12); width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .2s; }
.wcard-heart:hover { background: #fff; }
.wcard-heart.active { color: #e53935; }

.wcard-out-badge { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.6); color: #fff; font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 10px; }

.wcard-info { padding: 12px 0 0; display: flex; flex-direction: column; gap: 6px; }
.wcard-name { font-size: 12px; font-weight: 500; letter-spacing: 0.04em; cursor: pointer; line-height: 1.4; }
.wcard-name:hover { text-decoration: underline; text-underline-offset: 3px; }
.wcard-price { font-size: 13px; color: var(--gray-dark); }

.wcard-sizes { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 4px; }
.wsize { width: 36px; height: 36px; border: 1px solid var(--border); background: var(--white); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500; color: var(--black); cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center; }
.wsize:hover { border-color: var(--black); }
.wsize--active { background: var(--black); color: var(--white); border-color: var(--black); }
.wsize--out { opacity: 0.3; cursor: not-allowed; text-decoration: line-through; }

.wcard-cart { width: 100%; height: 40px; border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all .2s; margin-top: 4px; background: var(--black); color: var(--white); }
.wcard-cart:disabled { background: var(--gray-bg); color: var(--gray-mid); cursor: default; }
.wcard-cart--added { background: #2d7d2d; }
.wcard-cart--added:hover { background: #2d7d2d; }
.wcard-out-text { font-size: 11px; color: var(--gray-mid); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 4px; }
</style>
