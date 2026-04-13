<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { goods, toggleWishlist, isWishlisted } from '../composebles/useGoods.js'

function sizesInclude(sizeArray, sizeValue) {
  for (let si = 0; si < sizeArray.length; si = si + 1) {
    if (sizeArray[si] === sizeValue) return true
  }
  return false
}



const router = useRouter()

const GENDER = 'men'

// ── Цвета / размеры в карточках ──
const selectedSizes = ref({})
const selectedColors = ref({})
const hoveredColors = ref({})

function getCardImage(p) {
  const hovered = hoveredColors.value[p.id]
  const selected = selectedColors.value[p.id]
  if (hovered !== undefined && p.colors && p.colors[hovered]) return p.colors[hovered].image
  if (selected !== undefined && p.colors && p.colors[selected]) return p.colors[selected].image
  if (p.colors && p.colors.length > 0 && p.colors[0].image) return p.colors[0].image
  return p.image
}

function onColorHover(e, id, i) { e.stopPropagation(); hoveredColors.value[id] = i }
function onColorLeave(e, id) { hoveredColors.value[id] = undefined }
function onColorClick(e, id, i) { e.stopPropagation(); selectedColors.value[id] = i }

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

// ── Фильтры ──
const filtersOpen = ref(false)
const filters = reactive({
  sizes: [],
  priceMin: '',
  priceMax: '',
  inStock: false,
})

const allSizes = computed(function() {
  const found = []
  const order = ['XXS','XS','S','M','L','XL','XXL']
  for (let s = 0; s < order.length; s++) {
    for (let goodsIndex = 0; goodsIndex < goods.value.length; goodsIndex++) {
      const p = goods.value[goodsIndex]
      if (p.gender !== GENDER) continue
      if (p.sizes && sizesInclude(p.sizes, order[s])) {
        found.push(order[s])
        break
      }
    }
  }
  return found
})

function toggleFilterSize(size) {
  let sizePos = -1
  for (let si = 0; si < filters.sizes.length; si = si + 1) {
    if (filters.sizes[si] === size) { sizePos = si; break }
  }
  if (sizePos === -1) filters.sizes.push(size)
  else filters.sizes.splice(sizePos, 1)
}

function resetFilters() {
  filters.sizes = []
  filters.priceMin = ''
  filters.priceMax = ''
  filters.inStock = false
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

const activeFilterCount = computed(function() {
  let filterCount = filters.sizes.length
  if (filters.priceMin) filterCount = filterCount + 1
  if (filters.priceMax) filterCount = filterCount + 1
  if (filters.inStock) filterCount = filterCount + 1
  return filterCount
})

// ── Сортировка ──
const sortBy = ref('new')

const sortOptions = [
  { value: 'new', label: 'Сначала новые' },
  { value: 'popular', label: 'Популярные' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
]

// ── Итоговый список ──
const filteredGoods = computed(function() {
  let list = []
  for (let goodsIndex = 0; goodsIndex < goods.value.length; goodsIndex++) {
    if (goods.value[goodsIndex].gender === GENDER) list.push(goods.value[goodsIndex])
  }

  if (filters.sizes.length) {
    list = list.filter(function(product) {
      return filters.sizes.some(function(size) { return product.sizes && sizesInclude(product.sizes, size) })
    })
  }
  if (filters.priceMin) list = list.filter(function(product) { return product.price >= Number(filters.priceMin) })
  if (filters.priceMax) list = list.filter(function(product) { return product.price <= Number(filters.priceMax) })
  if (filters.inStock) list = list.filter(isInStock)

  if (sortBy.value === 'price_asc') list.sort(function(productA, productB) { return productA.price - productB.price })
  else if (sortBy.value === 'price_desc') list.sort(function(productA, productB) { return productB.price - productA.price })
  else if (sortBy.value === 'popular') {
    list.sort(function(productA, productB) {
      let countA = 0
      let countB = 0
      if (productA.reviews) countA = productA.reviews.length
      if (productB.reviews) countB = productB.reviews.length
      return countB - countA
    })
  }
  else list.sort(function(productA, productB) { return productB.id - productA.id })

  return list
})
</script>

<template>
  <!-- Баннер раздела -->
  <div class="gender-hero">
    <div class="gender-hero-overlay"></div>
    <div class="gender-hero-text">
      <span class="gender-hero-label">Коллекция</span>
      <h1 class="gender-hero-title">Мужчинам</h1>
      <p class="gender-hero-sub">Стиль без лишних слов</p>
    </div>
  </div>

  <!-- Каталог -->
  <section class="catalog">
    <div class="catalog-toolbar">
      <div class="toolbar-left">
        <h2 class="catalog-title">Мужская одежда</h2>
        <span class="catalog-count">{{ filteredGoods.length }} товаров</span>
      </div>
      <div class="toolbar-right">
        <button
          class="btn-filter"
          :class="{ 'btn-filter--active': filtersOpen || activeFilterCount > 0 }"
          @click="filtersOpen = !filtersOpen"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Фильтры
          <span v-if="activeFilterCount" class="filter-badge">{{ activeFilterCount }}</span>
        </button>
        <div class="sort-wrap">
          <select v-model="sortBy" class="sort-select">
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <svg class="sort-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Панель фильтров -->
    <transition name="filters-slide">
      <div v-if="filtersOpen" class="filters-panel">
        <div class="filter-group">
          <p class="filter-group-title">Размер</p>
          <div class="filter-sizes">
            <button
              v-for="size in allSizes"
              :key="size"
              :class="['filter-size', { 'filter-size--active': sizesInclude(filters.sizes, size) }]"
              @click="toggleFilterSize(size)"
            >{{ size }}</button>
          </div>
        </div>
        <div class="filter-group">
          <p class="filter-group-title">Цена, ₽</p>
          <div class="filter-price">
            <input v-model="filters.priceMin" type="number" placeholder="от" class="price-input" />
            <span class="price-dash">—</span>
            <input v-model="filters.priceMax" type="number" placeholder="до" class="price-input" />
          </div>
        </div>
        <div class="filter-group">
          <label class="filter-check">
            <input type="checkbox" v-model="filters.inStock" />
            <span>Только в наличии</span>
          </label>
        </div>
        <button v-if="activeFilterCount" class="btn-reset-filters" @click="resetFilters">Сбросить фильтры</button>
      </div>
    </transition>

    <div v-if="!filteredGoods.length" class="no-results">
      <p>Ничего не найдено</p>
      <button class="btn-reset-all" @click="resetFilters">Сбросить все фильтры</button>
    </div>

    <div v-else class="grid">
      <div v-for="p in filteredGoods" :key="p.id" class="card" @click="goToProduct(p.id)">
        <div class="card-media">
          <img :src="getCardImage(p)" :alt="p.name" class="card-img" />
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
          <p v-if="isInStock(p)" class="card-price">{{ p.price.toLocaleString('ru-RU') }} ₽</p>
          <p v-else class="card-out">Нет в наличии</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gender-hero {
  position: relative;
  height: 320px;
  background-image: url('/src/assets/img/jacket.jpeg');
  background-size: cover;
  background-position: center 25%;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.gender-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 60%);
}

.gender-hero-text {
  position: relative;
  z-index: 2;
  padding: 40px 60px;
  color: #fff;
}

.gender-hero-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 8px;
}

.gender-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.gender-hero-sub {
  font-size: 13px;
  opacity: 0.8;
  letter-spacing: 0.04em;
}

.catalog { padding: 0 40px 80px; }

.catalog-toolbar { display: flex; align-items: baseline; justify-content: space-between; padding: 32px 0 0; flex-wrap: wrap; gap: 12px; }
.toolbar-left { display: flex; align-items: baseline; gap: 14px; }
.toolbar-right { display: flex; align-items: center; gap: 12px; }

.catalog-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400; letter-spacing: 0.02em; }
.catalog-count { font-size: 12px; color: var(--gray-mid); }

.btn-filter { display: flex; align-items: center; gap: 7px; padding: 8px 16px; border: 1px solid var(--border); background: var(--white); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all .2s; }
.btn-filter:hover, .btn-filter--active { border-color: var(--black); background: var(--black); color: var(--white); }
.filter-badge { background: #fff; color: var(--black); border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; }

.sort-wrap { position: relative; display: flex; align-items: center; }
.sort-select { appearance: none; border: 1px solid var(--border); background: var(--white); padding: 8px 32px 8px 14px; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; color: var(--black); cursor: pointer; text-transform: uppercase; }
.sort-select:focus { outline: none; border-color: var(--black); }
.sort-arrow { position: absolute; right: 10px; pointer-events: none; color: var(--gray-mid); }

.filters-panel { margin: 20px 0 0; padding: 24px 32px; border: 1px solid var(--border); display: flex; gap: 48px; flex-wrap: wrap; align-items: flex-start; background: #fafafa; }
.filters-slide-enter-active, .filters-slide-leave-active { transition: opacity .2s, transform .2s; }
.filters-slide-enter-from, .filters-slide-leave-to { opacity: 0; transform: translateY(-8px); }
.filter-group { display: flex; flex-direction: column; gap: 10px; }
.filter-group-title { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); }
.filter-sizes { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-size { width: 40px; height: 40px; border: 1px solid var(--border); background: var(--white); font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 500; cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center; }
.filter-size:hover { border-color: var(--black); }
.filter-size--active { background: var(--black); color: var(--white); border-color: var(--black); }
.filter-price { display: flex; align-items: center; gap: 8px; }
.price-input { width: 80px; border: 1px solid var(--border); padding: 8px 10px; font-family: 'Montserrat', sans-serif; font-size: 12px; color: var(--black); }
.price-input:focus { outline: none; border-color: var(--black); }
.price-dash { color: var(--gray-mid); }
.filter-check { display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer; margin-top: 20px; }
.filter-check input { accent-color: var(--black); width: 15px; height: 15px; }
.btn-reset-filters { align-self: flex-end; background: none; border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-mid); cursor: pointer; text-decoration: underline; margin-top: auto; }
.btn-reset-filters:hover { color: var(--black); }

.no-results { padding: 60px 0; text-align: center; color: var(--gray-mid); display: flex; flex-direction: column; align-items: center; gap: 16px; }
.no-results p { font-size: 14px; letter-spacing: 0.04em; }
.btn-reset-all { padding: 10px 24px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }

.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 32px; }
.card { cursor: pointer; }
.card-media { position: relative; aspect-ratio: 3 / 4; background: var(--gray-bg); overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s cubic-bezier(.25,.46,.45,.94); }
.card:hover .card-img { transform: scale(1.06); }

.wishlist-btn { position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center; color: var(--black); opacity: 0; transition: opacity .2s, background .2s; z-index: 2; cursor: pointer; }
.card:hover .wishlist-btn { opacity: 1; }
.wishlist-btn:hover { background: #fff; }
.wishlist-btn.wishlisted { opacity: 1; }
.wishlist-btn.wishlisted svg { fill: #e53935; stroke: #e53935; }

.sizes-panel { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.97); padding: 10px 14px 12px; transform: translateY(100%); transition: transform .25s cubic-bezier(.25,.46,.45,.94); z-index: 2; }
.card:hover .sizes-panel { transform: translateY(0); }
.sizes-label { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 7px; }
.sizes-row { display: flex; gap: 5px; flex-wrap: wrap; }
.size-chip { height: 28px; min-width: 28px; padding: 0 6px; background: var(--white); border: 1px solid var(--border); color: var(--black); font-size: 10px; font-weight: 600; letter-spacing: 0.04em; transition: all .15s; display: flex; align-items: center; justify-content: center; }
.size-chip:hover { border-color: var(--black); }
.size-chip.active { background: var(--black); color: var(--white); border-color: var(--black); }

.card-info { padding: 12px 2px 20px; }
.card-name { font-size: 12px; font-weight: 500; color: var(--black); letter-spacing: 0.03em; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-price { font-size: 12px; color: var(--gray-dark); }
.card-out { font-size: 11px; color: #e53935; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
</style>
