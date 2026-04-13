<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { goods, isAdmin, token, toggleWishlist, isWishlisted, addToCart, isInCart } from '../composebles/useGoods.js'

const route = useRoute()
const router = useRouter()
const product = computed(function() {
  return goods.value.find(function(good) { return good.id === Number(route.params.id) })
})

// --- Карусель ---
const activeIndex = ref(0)

// --- Цвета ---
const selectedColorIndex = ref(0)

const activeColor = computed(function() {
  if (!product.value || !product.value.colors || !product.value.colors.length) return null
  return product.value.colors[selectedColorIndex.value] || product.value.colors[0]
})

const images = computed(function() {
  if (!product.value) return []
  // Если выбран цвет — его главное фото первым, потом его галерея
  if (activeColor.value) {
    const result = []
    if (activeColor.value.image) result.push(activeColor.value.image)
    if (activeColor.value.images && activeColor.value.images.length) {
      for (let imgIndex = 0; imgIndex < activeColor.value.images.length; imgIndex++) {
        if (activeColor.value.images[imgIndex] !== activeColor.value.image) {
          result.push(activeColor.value.images[imgIndex])
        }
      }
    }
    if (result.length > 0) return result
  }
  // Без цвета или если у цвета нет фото — p.image первым, потом product.images
  const result = []
  if (product.value.image) result.push(product.value.image)
  if (product.value.images && product.value.images.length) {
    for (let imgIndex = 0; imgIndex < product.value.images.length; imgIndex++) {
      if (product.value.images[imgIndex] !== product.value.image) result.push(product.value.images[imgIndex])
    }
  }
  return result
})

function selectImage(i) {
  activeIndex.value = i
}

function prevImage() {
  if (activeIndex.value > 0) {
    activeIndex.value -= 1
  } else {
    activeIndex.value = images.value.length - 1
  }
}

function nextImage() {
  if (activeIndex.value < images.value.length - 1) {
    activeIndex.value += 1
  } else {
    activeIndex.value = 0
  }
}

// --- Размеры / корзина ---
// Предзаполняем из query-параметра ?size=M если пришли из каталога
const selectedSize = ref(route.query.size || '')

function getStock(size) {
  if (!product.value || !product.value.stock) return 0
  if ((product.value.stock && Object.keys(product.value.stock).length > 0)) return product.value.stock[size] || 0
  return product.value.stock
}

function allOutOfStock() {
  if (!product.value || !product.value.stock) return false
  if (!(product.value.stock && Object.keys(product.value.stock).length > 0)) return product.value.stock <= 0
  const keys = Object.keys(product.value.stock)
  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    if (product.value.stock[keys[keyIndex]] > 0) return false
  }
  return true
}

function toggleSize(size) {
  if (selectedSize.value === size) {
    selectedSize.value = ''
  } else {
    selectedSize.value = size
  }
}

function onAddToCart() {
  if (!selectedSize.value) return
  addToCart(product.value.id, selectedSize.value)
}

// --- Размерная сетка ---
const showSizeGuide = ref(false)
const sizeTab = ref('women')
</script>

<template>
  <div v-if="product" class="product-page">
    <div class="breadcrumb">
      <RouterLink :to="{ name: 'home' }">Главная</RouterLink>
      <span class="bc-sep">/</span>
      <RouterLink :to="{ name: 'home' }">Коллекция</RouterLink>
      <span class="bc-sep">/</span>
      <span>{{ product.name }}</span>
    </div>

    <div class="product-layout">

      <!-- КАРУСЕЛЬ в стиле LIME -->
      <div class="product-gallery">
        <!-- Миниатюры слева -->
        <div class="thumbs-col">
          <button class="thumb-arrow thumb-arrow--up" @click="prevImage" v-if="images.length > 1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <div class="thumbs-list">
            <div
              v-for="(img, i) in images"
              :key="i"
              :class="['thumb', { 'thumb--active': activeIndex === i }]"
              @click="selectImage(i)"
            >
              <img :src="img" :alt="product.name + ' ' + (i+1)" />
            </div>
          </div>
          <button class="thumb-arrow thumb-arrow--down" @click="nextImage" v-if="images.length > 1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        <!-- Главное фото -->
        <div class="main-img-wrap">
          <img :src="images[activeIndex] || product.image" :alt="product.name" />
          <!-- Стрелки поверх фото -->
          <button class="img-nav img-nav--left" @click="prevImage" v-if="images.length > 1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="img-nav img-nav--right" @click="nextImage" v-if="images.length > 1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <!-- Точки -->
          <div class="img-dots" v-if="images.length > 1">
            <span v-for="(_, i) in images" :key="i" :class="['dot', { 'dot--active': activeIndex === i }]" @click="selectImage(i)"></span>
          </div>
        </div>
      </div>

      <!-- Инфо справа -->
      <div class="product-details">
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-price">{{ product.price.toLocaleString('ru-RU') }} ₽</p>

        <!-- Выбор цвета -->
        <div v-if="product.colors && product.colors.length > 1" class="color-section">
          <div class="color-header">
            <span class="color-title">Цвет:</span>
            <span class="color-active-name">{{ activeColor ? activeColor.name : '' }}</span>
          </div>
          <div class="color-thumbs">
            <button
              v-for="(color, ci) in product.colors"
              :key="ci"
              :class="['pv-color-thumb', { 'pv-color-thumb--active': selectedColorIndex === ci }]"
              @click="selectedColorIndex = ci; activeIndex = 0"
              :title="color.name"
            >
              <img :src="color.image" :alt="color.name" />
            </button>
          </div>
        </div>

        <div v-if="product.sizes && product.sizes.length" class="size-section">
          <div class="size-header">
            <span class="size-title">Размер</span>
            <button class="size-guide-btn" @click="showSizeGuide = true">Размерная сетка</button>
          </div>
          <div class="size-grid">
            <button
              v-for="size in product.sizes"
              :key="size"
              :class="['size-option', { active: selectedSize === size, 'size-out': getStock(size) === 0 }]"
              :disabled="getStock(size) === 0"
              @click="toggleSize(size)"
            >{{ size }}<span v-if="getStock(size) === 0" class="size-out-mark">✕</span></button>
          </div>
        </div>

        <div class="product-actions">
          <template v-if="!allOutOfStock()">
            <button :class="['btn-cart', { success: selectedSize && isInCart(product.id, selectedSize) }]" @click="selectedSize && isInCart(product.id, selectedSize) ? router.push({ name: 'cart' }) : onAddToCart()">
              <span v-if="selectedSize && isInCart(product.id, selectedSize)">В корзине ✓ — перейти →</span>
              <span v-else-if="selectedSize">В корзину — {{ selectedSize }}</span>
              <span v-else>Выберите размер</span>
            </button>
          </template>
          <template v-else>
            <button class="btn-cart btn-out" disabled>Нет в наличии</button>
          </template>
          <button :class="['btn-wishlist', { wishlisted: isWishlisted(product.id) }]" @click="toggleWishlist(product.id)">
            <svg width="16" height="16" viewBox="0 0 24 24" :fill="isWishlisted(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        <RouterLink v-if="isAdmin" :to="{ name: 'edit', params: { id: product.id } }" class="admin-edit-link">✏ Редактировать товар</RouterLink>

        <!-- Остатки по размерам — только для админа -->
        <div v-if="isAdmin && product.stock && (product.stock && Object.keys(product.stock).length > 0)" class="admin-stock">
          <span class="admin-stock-label">Остатки:</span>
          <span v-for="(qty, size) in product.stock" :key="size" :class="['admin-stock-item', { 'admin-stock-zero': qty === 0 }]">{{ size }}: {{ qty }}</span>
        </div>

        <div class="tabs">
          <RouterLink :to="{ name: 'product-description', params: { id: product.id } }" class="tab">Описание</RouterLink>
          <RouterLink :to="{ name: 'product-specs', params: { id: product.id } }" class="tab">Состав и уход</RouterLink>
          <RouterLink :to="{ name: 'product-reviews', params: { id: product.id } }" class="tab">Отзывы</RouterLink>
        </div>

        <div class="tab-body">
          <RouterView :product="product" />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <p>Товар не найден</p>
    <button @click="router.push({ name: 'home' })">На главную</button>
  </div>

  <!-- Размерная сетка -->
  <div v-if="showSizeGuide" class="sg-overlay" @click.self="showSizeGuide = false">
    <div class="sg-modal">
      <div class="sg-head">
        <span class="sg-title">Размерная сетка</span>
        <button class="sg-close" @click="showSizeGuide = false">✕</button>
      </div>
      <div class="sg-tabs">
        <button :class="['sg-tab', { active: sizeTab === 'women' }]" @click="sizeTab = 'women'">Женская</button>
        <button :class="['sg-tab', { active: sizeTab === 'men' }]" @click="sizeTab = 'men'">Мужская</button>
      </div>
      <div v-if="sizeTab === 'women'">
        <p class="sg-note">Рост модели 164–170 см. Все замеры в сантиметрах.</p>
        <table class="sg-table">
          <thead><tr><th>Размер</th><th>Рос.</th><th>Грудь</th><th>Талия</th><th>Бёдра</th></tr></thead>
          <tbody>
            <tr><td>XS</td><td>40</td><td>80–84</td><td>60–64</td><td>86–90</td></tr>
            <tr><td>S</td><td>42</td><td>84–88</td><td>64–68</td><td>90–94</td></tr>
            <tr><td>M</td><td>44</td><td>88–92</td><td>68–72</td><td>94–98</td></tr>
            <tr><td>L</td><td>46</td><td>92–96</td><td>72–76</td><td>98–102</td></tr>
            <tr><td>XL</td><td>48</td><td>96–100</td><td>76–80</td><td>102–106</td></tr>
            <tr><td>XXL</td><td>50</td><td>100–104</td><td>80–84</td><td>106–110</td></tr>
          </tbody>
        </table>
      </div>
      <div v-if="sizeTab === 'men'">
        <p class="sg-note">Рост модели 176–182 см. Все замеры в сантиметрах.</p>
        <table class="sg-table">
          <thead><tr><th>Размер</th><th>Рос.</th><th>Грудь</th><th>Талия</th><th>Бёдра</th></tr></thead>
          <tbody>
            <tr><td>XS</td><td>44</td><td>84–88</td><td>70–74</td><td>88–92</td></tr>
            <tr><td>S</td><td>46</td><td>88–92</td><td>74–78</td><td>92–96</td></tr>
            <tr><td>M</td><td>48</td><td>92–96</td><td>78–82</td><td>96–100</td></tr>
            <tr><td>L</td><td>50</td><td>96–100</td><td>82–86</td><td>100–104</td></tr>
            <tr><td>XL</td><td>52</td><td>100–104</td><td>86–90</td><td>104–108</td></tr>
            <tr><td>XXL</td><td>54</td><td>104–108</td><td>90–94</td><td>108–112</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-page { padding: 24px 40px 0; }

.breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; font-size: 11px; color: var(--gray-mid); letter-spacing: 0.06em; }
.breadcrumb a:hover { color: var(--black); }
.bc-sep { color: var(--gray-light); }

.product-layout { display: grid; grid-template-columns: 48% 1fr; gap: 60px; align-items: start; }

/* ===== КАРУСЕЛЬ ===== */
.product-gallery { display: flex; gap: 10px; }

/* Вертикальный столбец миниатюр */
.thumbs-col { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 72px; flex-shrink: 0; }
.thumbs-list { display: flex; flex-direction: column; gap: 6px; }
.thumb { width: 72px; height: 92px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: border-color .2s; flex-shrink: 0; }
.thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity .2s; }
.thumb:hover img { opacity: 0.8; }
.thumb--active { border-color: var(--black); }

.thumb-arrow { background: none; border: 1px solid var(--border); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color .2s; flex-shrink: 0; }
.thumb-arrow:hover { border-color: var(--black); }

/* Главное фото */
.main-img-wrap { position: relative; flex: 1; aspect-ratio: 3 / 4; background: var(--gray-bg); overflow: hidden; }
.main-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

.img-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.85); border: none; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .2s; z-index: 2; }
.img-nav:hover { background: #fff; }
.img-nav--left { left: 10px; }
.img-nav--right { right: 10px; }

.img-dots { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 2; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; transition: background .2s; }
.dot--active { background: #fff; }

/* ===== ДЕТАЛИ ===== */
.product-details { display: flex; flex-direction: column; gap: 24px; }

.product-name { font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 400; line-height: 1.2; letter-spacing: 0.01em; }
.product-price { font-size: 20px; font-weight: 400; color: var(--black); letter-spacing: 0.03em; }

/* Цвета */
.color-section { display: flex; flex-direction: column; gap: 10px; }
.color-header { display: flex; align-items: center; gap: 8px; }
.color-title { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
.color-active-name { font-size: 11px; color: var(--gray-mid); letter-spacing: 0.08em; text-transform: uppercase; }
.color-thumbs { display: flex; gap: 6px; flex-wrap: wrap; }
.pv-color-thumb { width: 56px; height: 72px; padding: 0; border: 2px solid transparent; background: none; cursor: pointer; overflow: hidden; transition: border-color .15s; }
.pv-color-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pv-color-thumb--active { border-color: var(--black); }
.pv-color-thumb:hover { border-color: var(--gray-mid); }

.size-section { display: flex; flex-direction: column; gap: 12px; }
.size-header { display: flex; justify-content: space-between; align-items: center; }
.size-title { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
.size-guide-btn { background: none; border: none; padding: 0; font-size: 12px; color: #888; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.size-guide-btn:hover { color: var(--black); }

.size-grid { display: flex; gap: 8px; flex-wrap: wrap; }
.size-option { width: 44px; height: 44px; border: 1px solid var(--border); background: var(--white); color: var(--black); font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 500; transition: all .15s; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.size-option:hover { border-color: var(--black); }
.size-option.active { background: var(--black); color: var(--white); border-color: var(--black); }
.size-option.size-out { opacity: 0.35; cursor: not-allowed; text-decoration: line-through; }
.size-out-mark { font-size: 9px; margin-left: 2px; }

.product-actions { display: flex; gap: 10px; }

.btn-cart { flex: 1; height: 52px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; transition: background .2s; cursor: pointer; }
.btn-cart:hover { background: #333; }
.btn-cart.success { background: #2d7d2d; }
.btn-out { background: var(--gray-bg) !important; color: var(--gray-mid) !important; cursor: not-allowed; }

.btn-wishlist { width: 52px; height: 52px; background: transparent; border: 1px solid var(--border); color: var(--black); display: flex; align-items: center; justify-content: center; transition: border-color .2s; cursor: pointer; }
.btn-wishlist:hover { border-color: var(--black); }
.btn-wishlist.wishlisted svg { fill: #e53935; stroke: #e53935; }

.admin-edit-link { font-size: 11px; color: var(--gray-mid); text-decoration: underline; transition: color .2s; }
.admin-edit-link:hover { color: var(--black); }
.admin-stock { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 8px 12px; background: var(--gray-bg); font-size: 11px; }
.admin-stock-label { font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-mid); margin-right: 4px; }
.admin-stock-item { color: #2d7d2d; font-weight: 600; }
.admin-stock-zero { color: #e53935; }

.tabs { display: flex; border-bottom: 1px solid var(--border); }
.tab { padding: 12px 24px 12px 0; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gray-mid); border-bottom: 1px solid transparent; margin-bottom: -1px; transition: all .2s; }
.tab:hover { color: var(--black); }
.tab.router-link-exact-active { color: var(--black); border-bottom-color: var(--black); }
.tab-body { min-height: 60px; }

.not-found { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 100px 40px; color: var(--gray-mid); }
.not-found button { padding: 12px 32px; background: var(--black); color: var(--white); border: none; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }

/* Размерная сетка */
.sg-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.sg-modal { background: #fff; width: 560px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 36px; }
.sg-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.sg-title { font-size: 16px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
.sg-close { background: none; border: none; font-size: 18px; cursor: pointer; color: #999; padding: 4px; }
.sg-close:hover { color: var(--black); }
.sg-tabs { display: flex; margin-bottom: 24px; border-bottom: 1px solid var(--border); }
.sg-tab { background: none; border: none; padding: 10px 20px; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; color: #999; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.sg-tab.active { color: var(--black); border-bottom-color: var(--black); }
.sg-note { font-size: 12px; color: #888; margin-bottom: 16px; }
.sg-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.sg-table th { text-align: left; padding: 10px 12px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; font-size: 11px; color: #888; border-bottom: 1px solid var(--border); }
.sg-table td { padding: 12px; border-bottom: 1px solid #f0f0f0; }
.sg-table tbody tr:hover { background: #fafafa; }
.sg-table td:first-child { font-weight: 600; }
</style>
