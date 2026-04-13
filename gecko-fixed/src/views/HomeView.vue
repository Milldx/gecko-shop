<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Hero from '../components/Hero.vue'
import { goods, toggleWishlist, isWishlisted } from '../composebles/useGoods.js'

const router = useRouter()
const route = useRoute()

// ── Цвета / размеры в карточках каталога ──
const selectedSizes = ref({})
const selectedColors = ref({})
const hoveredColors = ref({})

function getCardImage(p) {
  const hovered = hoveredColors.value[p.id]
  const selected = selectedColors.value[p.id]
  // При ховере — фото этого цвета
  if (hovered !== undefined && p.colors && p.colors[hovered]) return p.colors[hovered].image
  // При выборе — фото выбранного цвета
  if (selected !== undefined && p.colors && p.colors[selected]) return p.colors[selected].image
  // По умолчанию — первый цвет если есть, иначе p.image
  if (p.colors && p.colors.length > 0 && p.colors[0].image) return p.colors[0].image
  return p.image
}
function getCardColorName(p) {
  const hovered = hoveredColors.value[p.id]
  const selected = selectedColors.value[p.id]
  let idx = 0
  if (hovered !== undefined) idx = hovered
  else if (selected !== undefined) idx = selected
  if (p.colors && p.colors.length > idx) return p.colors[idx].name
  return ''
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

// ── Поиск — синхронизируем с URL ?q= ──
const searchQuery = ref(route.query.q || '')
watch(function() { return route.query.q }, function(val) {
  searchQuery.value = val || ''
  if (val) {
    setTimeout(function() {
      const el = document.getElementById('catalog')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }
})

// ── Синхронизируем gender-фильтр с URL ?gender= ──
watch(function() { return route.query.gender }, function(val) {
  filters.gender = val || ''
})

// ── Фильтры ──
const filtersOpen = ref(false)
const filters = reactive({
  sizes: [],
  priceMin: '',
  priceMax: '',
  inStock: false,
  gender: route.query.gender || '',   // '' | 'women' | 'men'
})

// Все доступные размеры из каталога
const allSizes = computed(function() {
  const set = new Set()
  goods.value.forEach(function(product) {
    if (product.sizes) product.sizes.forEach(function(size) { set.add(size) })
  })
  return ['XXS','XS','S','M','L','XL','XXL'].filter(function(s) { return set.has(s) })
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
  filters.gender = ''
  searchQuery.value = ''
  if (route.query.q) router.push({ name: 'home' })
}

function isInStock(p) {
  if (!p.stock) return false
  if ((p.stock && Object.keys(p.stock).length > 0)) return Object.values(p.stock).some(function(stockQty) { return stockQty > 0 })
  return p.stock > 0
}

const activeFilterCount = computed(function() {
  let filterCount = filters.sizes.length
  if (filters.priceMin) filterCount = filterCount + 1
  if (filters.priceMax) filterCount = filterCount + 1
  if (filters.inStock) filterCount = filterCount + 1
  if (filters.gender) filterCount = filterCount + 1
  return filterCount
})

// ── Сортировка ──
const sortBy = ref('new') // 'new' | 'price_asc' | 'price_desc' | 'popular'

const sortOptions = [
  { value: 'new', label: 'Сначала новые' },
  { value: 'popular', label: 'Популярные' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
]

// ── Итоговый список ──
const filteredGoods = computed(function() {
  let list = goods.value.slice()

  // Поиск
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter(function(product) { return product.name.toLowerCase().includes(q) })

  // Фильтр по полу
  if (filters.gender) {
    list = list.filter(function(product) { return product.gender === filters.gender })
  }

  // Фильтр по размеру
  if (filters.sizes.length) {
    list = list.filter(function(product) {
      return filters.sizes.some(function(size) { return product.sizes && product.sizes.includes(size) })
    })
  }

  // Фильтр по цене
  if (filters.priceMin) list = list.filter(function(product) { return product.price >= Number(filters.priceMin) })
  if (filters.priceMax) list = list.filter(function(product) { return product.price <= Number(filters.priceMax) })

  // Только в наличии
  if (filters.inStock) list = list.filter(isInStock)

  // Сортировка
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
  // 'new' — исходный порядок (id desc)
  else list.sort(function(productA, productB) { return productB.id - productA.id })

  return list
})
</script>

<template>
  <Hero />

  <!-- Манифест бренда -->
  <section class="manifesto">
    <p class="manifesto-line">Gecko — это не просто одежда.</p>
    <p class="manifesto-line manifesto-line--italic">Это кожа, в которой ты чувствуешь себя собой.</p>
  </section>


  <!-- Раздел: для неё / для него -->
  <section class="split-banner">
    <div class="split-item split-item--her" @click="router.push({ name: 'women' })">
      <div class="split-overlay"></div>
      <div class="split-text">
        <span class="split-label">Коллекция</span>
        <h2 class="split-title">Для неё</h2>
        <span class="split-link">Смотреть</span>
      </div>
    </div>
    <div class="split-item split-item--him" @click="router.push({ name: 'men' })">
      <div class="split-overlay"></div>
      <div class="split-text">
        <span class="split-label">Коллекция</span>
        <h2 class="split-title">Для него</h2>
        <span class="split-link">Смотреть</span>
      </div>
    </div>
  </section>

  <!-- Каталог -->
  <section class="catalog" id="catalog">
    <!-- Тулбар: счётчик / фильтры / сортировка -->
    <div class="catalog-toolbar">
      <div class="toolbar-left">
        <h2 class="catalog-title">Каталог</h2>
        <span class="catalog-count">{{ filteredGoods.length }} товаров</span>
        <span v-if="searchQuery" class="search-tag">
          «{{ searchQuery }}»
          <button class="search-tag-clear" @click="searchQuery = ''; router.push({ name: 'home' })">✕</button>
        </span>
      </div>
      <div class="toolbar-right">
        <!-- Фильтры -->
        <button class="btn-filter" :class="{ 'btn-filter--active': filtersOpen || activeFilterCount > 0 }" @click="filtersOpen = !filtersOpen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Фильтры
          <span v-if="activeFilterCount" class="filter-badge">{{ activeFilterCount }}</span>
        </button>
        <!-- Сортировка -->
        <div class="sort-wrap">
          <select v-model="sortBy" class="sort-select">
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <svg class="sort-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </div>

    <!-- Панель фильтров -->
    <transition name="filters-slide">
      <div v-if="filtersOpen" class="filters-panel">
        <div class="filter-group">
          <p class="filter-group-title">Пол</p>
          <div class="filter-gender">
            <button :class="['filter-gender-btn', { 'filter-gender-btn--active': filters.gender === '' }]" @click="filters.gender = ''">Все</button>
            <button :class="['filter-gender-btn', { 'filter-gender-btn--active': filters.gender === 'women' }]" @click="filters.gender = 'women'">Женский</button>
            <button :class="['filter-gender-btn', { 'filter-gender-btn--active': filters.gender === 'men' }]" @click="filters.gender = 'men'">Мужской</button>
          </div>
        </div>
        <div class="filter-group">
          <p class="filter-group-title">Размер</p>
          <div class="filter-sizes">
            <button
              v-for="size in allSizes"
              :key="size"
              :class="['filter-size', { 'filter-size--active': filters.sizes.includes(size) }]"
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

    <!-- Нет результатов -->
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
          <p v-if="p.stock && (p.stock && Object.keys(p.stock).length > 0) ? Object.values(p.stock).some(function(stockQty){ return stockQty > 0 }) : p.stock > 0" class="card-price">{{ p.price.toLocaleString('ru-RU') }} ₽</p>
          <p v-else class="card-out">Нет в наличии</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Секция преимуществ -->
  <section class="brand-values">
    <div class="brand-value">
      <div class="bv-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <rect x="1" y="3" width="15" height="13" rx="1"/>
          <path d="M16 8h4l3 3v5h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      </div>
      <h3 class="bv-title">Бесплатная доставка</h3>
      <p class="bv-text">При заказе от 10 000 ₽ по всей России</p>
    </div>
    <div class="brand-value">
      <div class="bv-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <h3 class="bv-title">Возврат 30 дней</h3>
      <p class="bv-text">Не подошло — вернём деньги без вопросов</p>
    </div>
    <div class="brand-value">
      <div class="bv-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <h3 class="bv-title">Гарантия качества</h3>
      <p class="bv-text">Только натуральные и сертифицированные ткани</p>
    </div>
    <div class="brand-value">
      <div class="bv-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <h3 class="bv-title">Быстрая обработка</h3>
      <p class="bv-text">Отправляем в течение 24 часов после заказа</p>
    </div>
  </section>

</template>

<style scoped>

/* ── Манифест ───────────────────────────────────────── */
.manifesto {
  padding: 80px 60px 70px;
  border-bottom: 1px solid var(--border);
}

.manifesto-line {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(32px, 4.5vw, 58px);
  font-weight: 400;
  line-height: 1.2;
  color: var(--black);
  letter-spacing: -0.01em;
}

.manifesto-line--italic {
  font-style: italic;
  color: var(--gray-mid);
}


/* ── Сплит-баннер ───────────────────────────────────── */
.split-banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin-top: 2px;
}

.split-item {
  position: relative;
  height: 520px;
  overflow: hidden;
  cursor: pointer;
  background: var(--gray-bg);
}

.split-item--her {
  background-image: url('/src/assets/img/dress2.jpeg');
  background-size: cover;
  background-position: center top;
}

.split-item--him {
  background-image: url('/src/assets/img/jacket.jpeg');
  background-size: cover;
  background-position: center top;
}

.split-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.0) 55%);
  transition: background .4s;
}
.split-item:hover .split-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%);
}

.split-item:hover .split-item--her,
.split-item--her:hover,
.split-item--him:hover {
  background-size: 105%;
}

.split-text {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 36px 40px;
  color: #fff;
  z-index: 2;
}

.split-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 8px;
}

.split-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 48px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 20px;
}

.split-link {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255,255,255,0.5);
  padding-bottom: 3px;
  transition: border-color .2s;
}
.split-item:hover .split-link { border-color: #fff; }


/* ── Каталог ────────────────────────────────────────── */
.catalog {
  padding: 48px 40px 0;
}

/* Тег активного поиска в тулбаре */
.search-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: var(--black); background: var(--gray-bg); padding: 4px 10px; border: 1px solid var(--border); letter-spacing: 0.04em; }
.search-tag-clear { background: none; border: none; cursor: pointer; font-size: 12px; color: var(--gray-mid); padding: 0; line-height: 1; }
.search-tag-clear:hover { color: var(--black); }

/* Тулбар */
.catalog-toolbar { display: flex; align-items: baseline; justify-content: space-between; padding: 24px 40px 0; flex-wrap: wrap; gap: 12px; }
.toolbar-left { display: flex; align-items: baseline; gap: 14px; }
.toolbar-right { display: flex; align-items: center; gap: 12px; }

.btn-filter { display: flex; align-items: center; gap: 7px; padding: 8px 16px; border: 1px solid var(--border); background: var(--white); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all .2s; position: relative; }
.btn-filter:hover, .btn-filter--active { border-color: var(--black); background: var(--black); color: var(--white); }
.filter-badge { background: #fff; color: var(--black); border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; }
.btn-filter--active .filter-badge { background: var(--white); color: var(--black); }

.sort-wrap { position: relative; display: flex; align-items: center; }
.sort-select { appearance: none; border: 1px solid var(--border); background: var(--white); padding: 8px 32px 8px 14px; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; color: var(--black); cursor: pointer; text-transform: uppercase; }
.sort-select:focus { outline: none; border-color: var(--black); }
.sort-arrow { position: absolute; right: 10px; pointer-events: none; color: var(--gray-mid); }

/* Панель фильтров */
.filters-panel { margin: 20px 40px 0; padding: 24px 32px; border: 1px solid var(--border); display: flex; gap: 48px; flex-wrap: wrap; align-items: flex-start; background: #fafafa; }
.filters-slide-enter-active, .filters-slide-leave-active { transition: opacity .2s, transform .2s; }
.filters-slide-enter-from, .filters-slide-leave-to { opacity: 0; transform: translateY(-8px); }
.filter-group { display: flex; flex-direction: column; gap: 10px; }
.filter-group-title { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); }
.filter-gender { display: flex; gap: 0; border: 1px solid var(--border); width: fit-content; }
.filter-gender-btn { padding: 8px 18px; background: transparent; border: none; border-right: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-mid); cursor: pointer; transition: all .2s; }
.filter-gender-btn:last-child { border-right: none; }
.filter-gender-btn--active { background: var(--black); color: var(--white); }
.filter-gender-btn:hover:not(.filter-gender-btn--active) { color: var(--black); }
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

/* Нет результатов */
.no-results { padding: 60px 40px; text-align: center; color: var(--gray-mid); display: flex; flex-direction: column; align-items: center; gap: 16px; }
.no-results p { font-size: 14px; letter-spacing: 0.04em; }
.btn-reset-all { padding: 10px 24px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }

.catalog-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 28px;
}

.catalog-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.catalog-count {
  font-size: 12px;
  color: var(--gray-mid);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  margin-top: 32px;
}

.card { cursor: pointer; }

.card-media {
  position: relative;
  aspect-ratio: 3 / 4;
  background: var(--gray-bg);
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .5s cubic-bezier(.25,.46,.45,.94);
}
.card:hover .card-img { transform: scale(1.06); }

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--black);
  opacity: 0;
  transition: opacity .2s, background .2s;
  z-index: 2;
  cursor: pointer;
}
.card:hover .wishlist-btn { opacity: 1; }
.wishlist-btn:hover { background: #fff; }
.wishlist-btn.wishlisted { opacity: 1; }
.wishlist-btn.wishlisted svg { fill: #e53935; stroke: #e53935; }

.sizes-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.97);
  padding: 10px 14px 12px;
  transform: translateY(100%);
  transition: transform .25s cubic-bezier(.25,.46,.45,.94);
  z-index: 2;
}
.card:hover .sizes-panel { transform: translateY(0); }

.sizes-label {
  display: block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gray-mid);
  margin-bottom: 7px;
}

.sizes-row { display: flex; gap: 5px; flex-wrap: wrap; }

.size-chip {
  height: 28px;
  min-width: 28px;
  padding: 0 6px;
  background: var(--white);
  border: 1px solid var(--border);
  color: var(--black);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: all .15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.size-chip:hover { border-color: var(--black); }
.size-chip.active { background: var(--black); color: var(--white); border-color: var(--black); }

.card-info { padding: 12px 2px 20px; }

/* Цвета в стиле LIME */
.card-colors { margin-bottom: 8px; }
.card-color-name { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 6px; min-height: 13px; }
.card-color-thumbs { display: flex; gap: 5px; flex-wrap: wrap; }
.color-thumb { width: 40px; height: 52px; padding: 0; border: 2px solid transparent; background: none; cursor: pointer; overflow: hidden; transition: border-color .15s; flex-shrink: 0; }
.color-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.color-thumb--active { border-color: var(--black); }
.color-thumb:hover { border-color: var(--gray-mid); }

.card-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--black);
  letter-spacing: 0.03em;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-price { font-size: 12px; color: var(--gray-dark); }
.card-out { font-size: 11px; color: #e53935; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }

/* ── Преимущества ───────────────────────────────────── */
.brand-values {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--border);
  margin-top: 80px;
}

.brand-value {
  padding: 48px 40px;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  transition: background .2s;
}
.brand-value:last-child { border-right: none; }
.brand-value:hover { background: var(--gray-bg); }

.bv-icon { color: var(--black); opacity: 0.6; }

.bv-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--black);
}

.bv-text { font-size: 12px; color: var(--gray-mid); line-height: 1.7; }

</style>
