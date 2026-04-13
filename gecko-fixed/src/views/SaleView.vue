<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { goods, toggleWishlist, isWishlisted } from '../composebles/useGoods.js'

const router = useRouter()

const selectedSizes = ref({})
const hoveredColors = ref({})

function getCardImage(p) {
  const hovered = hoveredColors.value[p.id]
  if (hovered !== undefined && p.colors && p.colors[hovered]) return p.colors[hovered].image
  if (p.colors && p.colors.length > 0 && p.colors[0].image) return p.colors[0].image
  return p.image
}

function onColorHover(e, id, i) { e.stopPropagation(); hoveredColors.value[id] = i }
function onColorLeave(e, id) { hoveredColors.value[id] = undefined }

function selectSize(e, id, size) {
  e.stopPropagation()
  if (selectedSizes.value[id] === size) {
    selectedSizes.value[id] = ''
  } else {
    selectedSizes.value[id] = size
  }
}

function onToggleWishlist(e, id) { e.stopPropagation(); toggleWishlist(id) }

function goToProduct(id) {
  const size = selectedSizes.value[id]
  const query = {}
  if (size) query.size = size
  router.push({ name: 'product-description', params: { id }, query: query })
}

function isInStock(p) {
  if (!p.stock) return false
  if ((p.stock && Object.keys(p.stock).length > 0)) {
    const keys = Object.keys(p.stock)
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
      if (p.stock[keys[keyIndex]] > 0) return true
    }
    return false
  }
  return p.stock > 0
}

function getDiscount(p) {
  if (!p.salePrice || !p.price) return 0
  return Math.round((1 - p.salePrice / p.price) * 100)
}

const saleGoods = computed(function() {
  const list = []
  for (let goodsIndex = 0; goodsIndex < goods.value.length; goodsIndex++) {
    if (goods.value[goodsIndex].isSale) list.push(goods.value[goodsIndex])
  }
  list.sort(function(productA, productB) { return getDiscount(productB) - getDiscount(productA) })
  return list
})

const maxDiscount = computed(function() {
  let max = 0
  for (let saleIndex = 0; saleIndex < saleGoods.value.length; saleIndex++) {
    const d = getDiscount(saleGoods.value[saleIndex])
    if (d > max) max = d
  }
  return max
})
</script>

<template>
  <div class="sale-hero">
    <div class="sale-hero-inner">
      <span class="sale-hero-label">Специальное предложение</span>
      <h1 class="sale-hero-title">SALE</h1>
      <p class="sale-hero-sub">Скидки до {{ maxDiscount }}% на избранные позиции</p>
    </div>
  </div>

  <section class="catalog">
    <div class="catalog-toolbar">
      <div class="toolbar-left">
        <h2 class="catalog-title">Распродажа</h2>
        <span class="catalog-count">{{ saleGoods.length }} товаров</span>
      </div>
    </div>

    <div v-if="!saleGoods.length" class="no-results">
      <p>Сейчас распродажи нет — загляните позже</p>
    </div>

    <div v-else class="grid">
      <div v-for="p in saleGoods" :key="p.id" class="card" @click="goToProduct(p.id)">
        <div class="card-media">
          <img :src="getCardImage(p)" :alt="p.name" class="card-img" />
          <span class="badge-sale">-{{ getDiscount(p) }}%</span>
          <button
            :class="['wishlist-btn', { wishlisted: isWishlisted(p.id) }]"
            @click="onToggleWishlist($event, p.id)"
            title="В избранное"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <div v-if="p.sizes && p.sizes.length" class="sizes-panel">
            <span class="sizes-label">Размер</span>
            <div class="sizes-row">
              <button
                v-for="size in p.sizes"
                :key="size"
                :class="['size-chip', { active: selectedSizes[p.id] === size }]"
                @click="selectSize($event, p.id, size)"
              >{{ size }}</button>
            </div>
          </div>
        </div>
        <div class="card-info">
          <p class="card-name">{{ p.name }}</p>
          <div v-if="isInStock(p)" class="card-prices">
            <span class="card-price-old">{{ p.price.toLocaleString('ru-RU') }} ₽</span>
            <span class="card-price-sale">{{ p.salePrice.toLocaleString('ru-RU') }} ₽</span>
          </div>
          <p v-else class="card-out">Нет в наличии</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sale-hero {
  background: var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
  text-align: center;
}
.sale-hero-inner { color: #fff; }
.sale-hero-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 12px;
}
.sale-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 96px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.12em;
  margin-bottom: 14px;
}
.sale-hero-sub {
  font-size: 13px;
  opacity: 0.6;
  letter-spacing: 0.06em;
}

.catalog { padding: 0 40px 80px; }
.catalog-toolbar { display: flex; align-items: baseline; padding: 32px 0 0; }
.toolbar-left { display: flex; align-items: baseline; gap: 14px; }
.catalog-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400; letter-spacing: 0.02em; }
.catalog-count { font-size: 12px; color: var(--gray-mid); }

.no-results { padding: 60px 0; text-align: center; color: var(--gray-mid); font-size: 14px; }

.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 32px; }
.card { cursor: pointer; }
.card-media { position: relative; aspect-ratio: 3 / 4; background: var(--gray-bg); overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s cubic-bezier(.25,.46,.45,.94); }
.card:hover .card-img { transform: scale(1.06); }

.badge-sale {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #c0392b;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 9px;
  z-index: 2;
}

.wishlist-btn { position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center; color: var(--black); opacity: 0; transition: opacity .2s, background .2s; z-index: 2; cursor: pointer; }
.card:hover .wishlist-btn { opacity: 1; }
.wishlist-btn:hover { background: #fff; }
.wishlist-btn.wishlisted { opacity: 1; }
.wishlist-btn.wishlisted svg { fill: #e53935; stroke: #e53935; }

.sizes-panel { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.97); padding: 10px 14px 12px; transform: translateY(100%); transition: transform .25s cubic-bezier(.25,.46,.45,.94); z-index: 2; }
.card:hover .sizes-panel { transform: translateY(0); }
.sizes-label { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 7px; }
.sizes-row { display: flex; gap: 5px; flex-wrap: wrap; }
.size-chip { height: 28px; min-width: 28px; padding: 0 6px; background: var(--white); border: 1px solid var(--border); color: var(--black); font-size: 10px; font-weight: 600; transition: all .15s; display: flex; align-items: center; justify-content: center; }
.size-chip:hover { border-color: var(--black); }
.size-chip.active { background: var(--black); color: var(--white); border-color: var(--black); }

.card-info { padding: 12px 2px 20px; }
.card-name { font-size: 12px; font-weight: 500; color: var(--black); letter-spacing: 0.03em; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-prices { display: flex; align-items: baseline; gap: 8px; }
.card-price-old { font-size: 11px; color: var(--gray-mid); text-decoration: line-through; }
.card-price-sale { font-size: 13px; font-weight: 600; color: #c0392b; }
.card-out { font-size: 11px; color: #e53935; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
</style>
