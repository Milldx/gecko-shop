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
function onColorLeave(id) { hoveredColors.value[id] = undefined }

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
  const query = { from: 'collection' }
  if (size) query.size = size
  router.push({ name: 'product-description', params: { id }, query: query })
}

function isInStock(p) {
  if (!p.stock) return false
  const keys = Object.keys(p.stock)
  for (let ki = 0; ki < keys.length; ki++) {
    if (p.stock[keys[ki]] > 0) return true
  }
  return false
}

const sortBy = ref('newest')
const filterGender = ref('')
const filterInStock = ref(false)

const collectionGoods = computed(function() {
  let list = []
  for (let gi = 0; gi < goods.value.length; gi++) {
    if (goods.value[gi].isCollection) list.push(goods.value[gi])
  }
  if (filterGender.value) list = list.filter(function(p) { return p.gender === filterGender.value })
  if (filterInStock.value) list = list.filter(isInStock)
  if (sortBy.value === 'newest') list.sort(function(a, b) { return b.id - a.id })
  if (sortBy.value === 'price_asc') list.sort(function(a, b) { return a.price - b.price })
  if (sortBy.value === 'price_desc') list.sort(function(a, b) { return b.price - a.price })
  if (sortBy.value === 'name') list.sort(function(a, b) { return a.name.localeCompare(b.name, 'ru') })
  return list
})
</script>

<template>
  <div>
    <!-- Hero -->
    <div class="col-hero">
      <div class="col-hero-overlay"></div>
      <div class="col-hero-text">
        <span class="col-hero-label">Весна — Лето 2025</span>
        <h1 class="col-hero-title">Коллекция</h1>
        <p class="col-hero-sub">Актуальные образы нового сезона</p>
      </div>
    </div>

    <!-- Каталог -->
    <section class="catalog">
      <div class="catalog-toolbar">
        <div class="toolbar-left">
          <h2 class="catalog-title">Весенняя коллекция</h2>
          <span class="catalog-count">{{ collectionGoods.length }} товаров</span>
        </div>
        <div class="toolbar-right">
          <div class="filter-chips">
            <button :class="['chip', { 'chip--on': filterGender === '' }]" @click="filterGender = ''">Все</button>
            <button :class="['chip', { 'chip--on': filterGender === 'women' }]" @click="filterGender = 'women'">Женщинам</button>
            <button :class="['chip', { 'chip--on': filterGender === 'men' }]" @click="filterGender = 'men'">Мужчинам</button>
            <button :class="['chip', { 'chip--on': filterInStock }]" @click="filterInStock = !filterInStock">В наличии</button>
          </div>
          <select v-model="sortBy" class="sort-select">
            <option value="newest">Сначала новые</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="price_desc">Сначала дороже</option>
            <option value="name">По названию</option>
          </select>
        </div>
      </div>

      <div v-if="!collectionGoods.length" class="no-results">
        <p>Коллекция скоро пополнится</p>
      </div>

      <div v-else class="grid">
        <div v-for="p in collectionGoods" :key="p.id" class="card" @click="goToProduct(p.id)">
          <div class="card-media">
            <img :src="getCardImage(p)" :alt="p.name" class="card-img" />

            <!-- Цветовые превью -->
            <div v-if="p.colors && p.colors.length > 1" class="color-dots">
              <span
                v-for="(c, i) in p.colors"
                :key="i"
                :class="['color-dot', { 'color-dot--active': hoveredColors[p.id] === i }]"
                @mouseenter="onColorHover($event, p.id, i)"
                @mouseleave="onColorLeave(p.id)"
              ></span>
            </div>

            <button
              :class="['wishlist-btn', { wishlisted: isWishlisted(p.id) }]"
              @click="onToggleWishlist($event, p.id)"
              title="В избранное"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            <div v-if="p.sizes && p.sizes.length" class="sizes-panel" @click.stop>
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
            <p v-if="isInStock(p)" class="card-price">{{ p.price.toLocaleString('ru-RU') }} ₽</p>
            <p v-else class="card-out">Нет в наличии</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero */
.col-hero {
  position: relative;
  height: 480px;
  background-image: url('/src/assets/img/hero-banner.jpeg');
  background-size: cover;
  background-position: center 25%;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.col-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 60%);
}
.col-hero-text {
  position: relative;
  z-index: 2;
  padding: 48px 64px;
  color: #fff;
}
.col-hero-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 10px;
}
.col-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 72px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 12px;
}
.col-hero-sub {
  font-size: 13px;
  opacity: 0.8;
  letter-spacing: 0.06em;
}

/* Каталог */
.catalog { padding: 0 40px 80px; }
.catalog-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 32px 0 0; flex-wrap: wrap; gap: 12px; }
.toolbar-left { display: flex; align-items: baseline; gap: 14px; }
.toolbar-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 6px 14px; border: 1px solid var(--border); background: transparent; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-mid); cursor: pointer; transition: all .15s; }
.chip--on { background: var(--black); color: var(--white); border-color: var(--black); }
.chip:hover:not(.chip--on) { border-color: var(--black); color: var(--black); }
.sort-select { border: 1px solid var(--border); padding: 7px 12px; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; color: var(--black); background: var(--white); cursor: pointer; }
.sort-select:focus { outline: none; border-color: var(--black); }
.catalog-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400; letter-spacing: 0.02em; }
.catalog-count { font-size: 12px; color: var(--gray-mid); }
.no-results { padding: 60px 0; text-align: center; color: var(--gray-mid); font-size: 14px; }

/* Сетка */
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 32px; }
.card { cursor: pointer; }
.card-media { position: relative; aspect-ratio: 3 / 4; background: var(--gray-bg); overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s cubic-bezier(.25,.46,.45,.94); }
.card:hover .card-img { transform: scale(1.06); }

.color-dots { position: absolute; bottom: 52px; left: 14px; display: flex; gap: 5px; z-index: 3; opacity: 0; transition: opacity .2s; }
.card:hover .color-dots { opacity: 1; }
.color-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.5); cursor: pointer; }
.color-dot--active { background: #fff; }

.wishlist-btn { position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center; color: var(--black); opacity: 0; transition: opacity .2s; z-index: 2; cursor: pointer; }
.card:hover .wishlist-btn { opacity: 1; }
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
.card-name { font-size: 12px; font-weight: 500; color: var(--black); letter-spacing: 0.03em; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-price { font-size: 12px; color: var(--gray-dark); }
.card-out { font-size: 11px; color: #e53935; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
</style>
