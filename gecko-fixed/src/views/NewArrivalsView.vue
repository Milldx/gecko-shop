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

const newGoods = computed(function() {
  const list = []
  for (let goodsIndex = 0; goodsIndex < goods.value.length; goodsIndex++) {
    if (goods.value[goodsIndex].isNew) list.push(goods.value[goodsIndex])
  }
  list.sort(function(productA, productB) { return productB.id - productA.id })
  return list
})
</script>

<template>
  <div class="gender-hero gender-hero--new">
    <div class="gender-hero-overlay"></div>
    <div class="gender-hero-text">
      <span class="gender-hero-label">Только появилось</span>
      <h1 class="gender-hero-title">Новинки</h1>
      <p class="gender-hero-sub">Свежие поступления этого сезона</p>
    </div>
  </div>

  <section class="catalog">
    <div class="catalog-toolbar">
      <div class="toolbar-left">
        <h2 class="catalog-title">Новые поступления</h2>
        <span class="catalog-count">{{ newGoods.length }} товаров</span>
      </div>
    </div>

    <div v-if="!newGoods.length" class="no-results">
      <p>Новинок пока нет — следите за обновлениями</p>
    </div>

    <div v-else class="grid">
      <div v-for="p in newGoods" :key="p.id" class="card" @click="goToProduct(p.id)">
        <div class="card-media">
          <img :src="getCardImage(p)" :alt="p.name" class="card-img" />
          <span class="badge-new">New</span>
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
  background-size: cover;
  background-position: center 30%;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.gender-hero--new {
  background-image: url('/src/assets/img/Embroidered Underbust Corset Dress.jpeg');
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
.catalog-toolbar { display: flex; align-items: baseline; justify-content: space-between; padding: 32px 0 0; }
.toolbar-left { display: flex; align-items: baseline; gap: 14px; }
.catalog-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400; letter-spacing: 0.02em; }
.catalog-count { font-size: 12px; color: var(--gray-mid); }

.no-results { padding: 60px 0; text-align: center; color: var(--gray-mid); font-size: 14px; }

.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 32px; }
.card { cursor: pointer; }
.card-media { position: relative; aspect-ratio: 3 / 4; background: var(--gray-bg); overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s cubic-bezier(.25,.46,.45,.94); }
.card:hover .card-img { transform: scale(1.06); }

.badge-new {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--black);
  color: var(--white);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
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
.card-name { font-size: 12px; font-weight: 500; color: var(--black); letter-spacing: 0.03em; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-price { font-size: 12px; color: var(--gray-dark); }
.card-out { font-size: 11px; color: #e53935; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
</style>
