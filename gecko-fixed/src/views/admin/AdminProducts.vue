<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { goods, deleteProduct } from '../../composebles/useGoods.js'
const router = useRouter()

const confirmId = ref(null)

function onDelete(id) {
  confirmId.value = id
}

function confirmDelete() {
  if (confirmId.value !== null) {
    deleteProduct(confirmId.value)
    confirmId.value = null
  }
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
      <h2 class="section-title">Товары</h2>
      <button class="btn-add" @click="router.push({ name: 'admin-add' })">+ Добавить</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Фото</th>
          <th>Название</th>
          <th>Цена</th>
          <th>В наличии</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in goods" :key="p.id">
          <td><img :src="p.image" :alt="p.name" class="thumb" /></td>
          <td class="name-cell">{{ p.name }}</td>
          <td class="price-cell">{{ p.price.toLocaleString('ru-RU') }} ₽</td>
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
.section-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; }
.btn-add { padding: 10px 24px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }
.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); padding: 0 16px 12px 0; border-bottom: 1px solid var(--border); }
.table td { padding: 14px 16px 14px 0; font-size: 13px; border-bottom: 1px solid var(--gray-bg); vertical-align: middle; }
.thumb { width: 72px; height: 92px; object-fit: cover; background: var(--gray-bg); display: block; }
.name-cell { font-weight: 500; }
.price-cell { color: var(--gray-dark); }
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
</style>
