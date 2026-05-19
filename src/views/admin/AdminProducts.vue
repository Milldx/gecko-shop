<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { goods, deleteProduct } from '../../composebles/useGoods.js'
const router = useRouter()

const confirmId = ref(null)
const sortBy = ref('date_desc')
const searchQuery = ref('')

const sortedGoods = computed(function() {
  let list = goods.value.slice()

  // Поиск по названию или артикулу
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(function(p) {
      const nameMatch = p.name.toLowerCase().includes(q)
      const skuMatch = p.sku && p.sku.toLowerCase().includes(q)
      return nameMatch || skuMatch
    })
  }

  if (sortBy.value === 'date_desc') list.sort(function(a, b) { return b.id - a.id })
  if (sortBy.value === 'date_asc') list.sort(function(a, b) { return a.id - b.id })
  if (sortBy.value === 'price_asc') list.sort(function(a, b) { return a.price - b.price })
  if (sortBy.value === 'price_desc') list.sort(function(a, b) { return b.price - a.price })
  if (sortBy.value === 'name') list.sort(function(a, b) { return a.name.localeCompare(b.name, 'ru') })
  return list
})

function onDelete(id) { confirmId.value = id }
function confirmDelete() {
  if (confirmId.value !== null) { deleteProduct(confirmId.value); confirmId.value = null }
}
</script>

<template>
  <div>
      <div v-if="confirmId !== null" class="modal-overlay" @click.self="confirmId = null">
        <div class="modal">
          <p class="modal-title">Удалить товар?</p>
          <p class="modal-sub">Это действие необратимо.</p>
          <div class="modal-actions">
            <button class="modal-btn-del" @click="confirmDelete">Удалить</button>
            <button class="modal-btn-cancel" @click="confirmId = null">Отмена</button>
          </div>
        </div>
      </div>

    <div class="top-bar">
      <div class="products-header">
        <h2 class="section-title">Товары</h2>
        <span class="products-total">{{ sortedGoods.length }} из {{ goods.length }} позиций</span>
      </div>
      <div class="top-controls">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по названию или артикулу..."
          class="search-input"
        />
        <button class="btn-add" @click="router.push({ name: 'admin-add' })">+ Добавить</button>
        <select v-model="sortBy" class="sort-select">
          <option value="date_desc">Сначала новые</option>
          <option value="date_asc">Сначала старые</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
          <option value="name">По названию</option>
        </select>
      </div>
    </div>
    <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th>Фото</th>
          <th>Артикул</th>
          <th>Название</th>
          <th>Цена</th>
          <th>Метки</th>
          <th>Дата</th>
          <th>В наличии</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in sortedGoods" :key="p.id">
          <td><img :src="p.image" :alt="p.name" class="thumb" /></td>
          <td class="sku-cell">{{ p.sku || '—' }}</td>
          <td class="name-cell">{{ p.name }}</td>
          <td class="price-cell">
            <span v-if="p.isSale && p.salePrice" class="price-old-sm">{{ p.price.toLocaleString('ru-RU') }} ₽</span>
            <span :class="p.isSale && p.salePrice ? 'price-sale-sm' : ''">{{ (p.isSale && p.salePrice ? p.salePrice : p.price).toLocaleString('ru-RU') }} ₽</span>
          </td>
          <td class="badges-cell">
            <span v-if="p.isNew" class="badge badge-new">NEW</span>
            <span v-if="p.isSale" class="badge badge-sale">SALE</span>
            <span v-if="p.isCollection" class="badge badge-coll">COLL</span>
          </td>
          <td class="date-cell">{{ p.createdAt || '—' }}</td>
          <td>
            <template v-if="p.stock && (p.stock && Object.keys(p.stock).length > 0)">
              <div v-for="(qty, size) in p.stock" :key="size" class="stock-row">
                <span class="stock-size">{{ size }}:</span>
                <span :class="['stock-qty', { 'stock-out': qty === 0 }]">{{ qty }} шт.</span>
              </div>
            </template>
            <template v-else>
              <span :class="['stock-qty', { 'stock-out': !p.stock || p.stock <= 0 }]">
                {{ p.stock > 0 ? p.stock + ' шт.' : 'Нет' }}
              </span>
            </template>
          </td>
          <td>
            <button class="btn-action btn-view" @click="router.push({ name: 'product-description', params: { id: p.id } })">Просмотр</button>
            <button class="btn-action btn-edit" @click="router.push({ name: 'edit', params: { id: p.id } })">Изменить</button>
            <button class="btn-action btn-delete" @click="onDelete(p.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; padding: 36px 40px; width: 360px; max-width: 95vw; }
.modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; margin-bottom: 8px; }
.modal-sub { font-size: 12px; color: var(--gray-mid); margin-bottom: 28px; letter-spacing: 0.04em; }
.modal-actions { display: flex; gap: 12px; }
.modal-btn-del { flex: 1; padding: 12px; background: #e53935; color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }
.modal-btn-del:hover { background: #c62828; }
.modal-btn-cancel { flex: 1; padding: 12px; background: transparent; color: var(--black); border: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }
.modal-btn-cancel:hover { border-color: var(--black); }

.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.products-header { display: flex; align-items: baseline; gap: 14px; margin-bottom: 12px; }
.section-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; margin: 0; }
.products-total { font-size: 11px; color: var(--gray-mid); letter-spacing: 0.06em; }
.top-controls { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.search-input { border: 1px solid var(--border); padding: 8px 14px; font-family: 'Montserrat', sans-serif; font-size: 11px; color: var(--black); background: var(--white); min-width: 260px; flex: 1; }
.search-input:focus { outline: none; border-color: var(--black); }
.sort-select { border: 1px solid var(--border); padding: 7px 12px; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; color: var(--black); background: var(--white); cursor: pointer; }
.sort-select:focus { outline: none; border-color: var(--black); }
.sku-cell { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--gray-mid); white-space: nowrap; }
.date-cell { font-size: 11px; color: var(--gray-mid); white-space: nowrap; }
.btn-add { padding: 10px 24px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }
.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); padding: 0 16px 12px 0; border-bottom: 1px solid var(--border); }
.table td { padding: 14px 16px 14px 0; font-size: 13px; border-bottom: 1px solid var(--gray-bg); vertical-align: middle; }
.thumb { width: 72px; height: 92px; object-fit: cover; background: var(--gray-bg); display: block; }
.name-cell { font-weight: 500; }
.price-cell { color: var(--gray-dark); }
.price-old-sm { font-size: 10px; color: var(--gray-mid); text-decoration: line-through; display: block; }
.price-sale-sm { font-size: 12px; color: #c0392b; font-weight: 600; }
.badges-cell { white-space: nowrap; }
.badge { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; padding: 2px 6px; margin-right: 3px; }
.badge-new { background: #e8f5e9; color: #2e7d32; }
.badge-sale { background: #fce4e4; color: #c0392b; }
.badge-coll { background: #e8eaf6; color: #3949ab; }
.btn-action { padding: 6px 14px; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-right: 6px; cursor: pointer; transition: all .2s; }
.btn-view { background: transparent; border: 1px solid var(--border); color: var(--black); }
.btn-view:hover { border-color: var(--black); }
.btn-edit { background: var(--black); border: 1px solid var(--black); color: var(--white); }
.btn-edit:hover { background: #333; }
.btn-delete { background: transparent; border: 1px solid #e53935; color: #e53935; }
.btn-delete:hover { background: #e53935; color: #fff; }
.stock-row { display: flex; gap: 6px; align-items: center; line-height: 1.7; }
.stock-size { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; color: var(--gray-mid); min-width: 28px; }
.stock-qty { font-size: 12px; color: #2d7d2d; }
.stock-out { color: #e53935; }
@media (max-width: 600px) {
  .top-bar { flex-direction: column; align-items: flex-start; gap: 10px; margin-bottom: 16px; }
  .top-controls { width: 100%; flex-direction: column; gap: 8px; }
  .search-input { min-width: unset; width: 100%; }
  .sort-select { width: 100%; }
  .btn-add { width: 100%; text-align: center; padding: 10px; }
  .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .table { min-width: 640px; font-size: 11px; }
  .thumb { width: 36px; height: 46px; }
  .section-title { font-size: 22px; }
}
</style>
