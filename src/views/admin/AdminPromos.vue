<script setup>
import { ref } from 'vue'
import { promos, addPromo, deletePromo, togglePromo } from '../../composebles/useGoods.js'

const newCode = ref('')
const newDiscount = ref('')
const formError = ref('')
const confirmDelete = ref(null)

function submitPromo() {
  formError.value = ''
  const code = newCode.value.trim().toUpperCase()
  const discount = Number(newDiscount.value)

  if (!code) {
    formError.value = 'Введите код промокода'
    return
  }
  if (!discount || discount <= 0 || discount > 99) {
    formError.value = 'Скидка должна быть от 1 до 99%'
    return
  }

  const ok = addPromo(code, discount)
  if (!ok) {
    formError.value = 'Промокод с таким кодом уже существует'
    return
  }
  newCode.value = ''
  newDiscount.value = ''
}

function askDelete(code) {
  confirmDelete.value = code
}

function confirmDeletePromo() {
  if (confirmDelete.value) {
    deletePromo(confirmDelete.value)
    confirmDelete.value = null
  }
}

function cancelDelete() {
  confirmDelete.value = null
}
</script>

<template>
  <div class="promos-page">
    <h2 class="page-title">ПРОМОКОДЫ</h2>

    <!-- Форма создания -->
    <div class="promo-form-block">
      <div class="promo-form-row">
        <div class="promo-field">
          <label>Код промокода</label>
          <input
            v-model="newCode"
            type="text"
            placeholder="ЛЕТНЯЯ20"
            class="promo-input-field"
            @input="formError = ''"
          />
        </div>
        <div class="promo-field promo-field--short">
          <label>Скидка (%)</label>
          <input
            v-model="newDiscount"
            type="number"
            placeholder="20"
            min="1"
            max="99"
            class="promo-input-field"
            @input="formError = ''"
          />
        </div>
        <button class="promo-add-btn" @click="submitPromo">Добавить</button>
      </div>
      <p v-if="formError" class="promo-form-error">{{ formError }}</p>
    </div>

    <!-- Таблица промокодов -->
    <div v-if="promos.length === 0" class="promos-empty">
      Промокоды не созданы
    </div>

    <table v-else class="promos-table">
      <thead>
        <tr>
          <th>Код</th>
          <th>Скидка</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="promo in promos" :key="promo.code" :class="{ 'row-inactive': !promo.active }">
          <td class="td-code">{{ promo.code }}</td>
          <td class="td-discount">{{ promo.discount }}%</td>
          <td>
            <span class="status-badge" :class="promo.active ? 'status-active' : 'status-inactive'">
              {{ promo.active ? 'Активен' : 'Отключён' }}
            </span>
          </td>
          <td class="td-actions">
            <button class="action-btn toggle-btn" @click="togglePromo(promo.code)">
              {{ promo.active ? 'Отключить' : 'Включить' }}
            </button>
            <button class="action-btn delete-btn" @click="askDelete(promo.code)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Модальное подтверждение удаления -->
    <div v-if="confirmDelete" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-box">
        <p class="modal-text">Удалить промокод <b>{{ confirmDelete }}</b>?</p>
        <div class="modal-btns">
          <button class="modal-btn modal-btn--danger" @click="confirmDeletePromo">Удалить</button>
          <button class="modal-btn modal-btn--ghost" @click="cancelDelete">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.promos-page { padding: 0 0 60px; }

.page-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--black);
  margin: 0 0 28px;
}

/* Форма */
.promo-form-block {
  background: var(--gray-bg);
  padding: 20px 22px;
  margin-bottom: 28px;
}
.promo-form-row { display: flex; align-items: flex-end; gap: 14px; flex-wrap: wrap; }
.promo-field { display: flex; flex-direction: column; gap: 6px; }
.promo-field label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-mid); }
.promo-field--short { width: 90px; }
.promo-input-field {
  border: 1px solid var(--border);
  padding: 9px 12px;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--black);
  background: var(--white);
  width: 180px;
  box-sizing: border-box;
}
.promo-field--short .promo-input-field { width: 90px; }
.promo-input-field:focus { outline: none; border-color: var(--black); }
.promo-add-btn {
  padding: 9px 22px;
  background: var(--black);
  color: var(--white);
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  height: 38px;
}
.promo-add-btn:hover { background: #333; }
.promo-form-error { font-size: 11px; color: #e53935; margin-top: 8px; }

/* Таблица */
.promos-empty { font-size: 12px; color: var(--gray-mid); padding: 20px 0; }
.promos-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.promos-table th {
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gray-mid);
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
}
.promos-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); }
.row-inactive td { opacity: 0.5; }
.td-code { font-weight: 700; letter-spacing: 0.12em; }
.td-discount { font-weight: 600; }
.td-actions { display: flex; gap: 8px; }

.status-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
}
.status-active { background: #e6f4ea; color: #2d7d2d; }
.status-inactive { background: #f5f5f5; color: var(--gray-mid); }

.action-btn {
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 5px 12px;
}
.toggle-btn { background: var(--black); color: var(--white); }
.toggle-btn:hover { background: #333; }
.delete-btn { background: transparent; color: #e53935; border: 1px solid #e53935; }
.delete-btn:hover { background: #ffeaea; }

/* Модальное окно */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: var(--white);
  padding: 32px 28px 24px;
  width: 320px;
  text-align: center;
}
.modal-text { font-size: 13px; margin-bottom: 22px; line-height: 1.6; }
.modal-btns { display: flex; gap: 10px; justify-content: center; }
.modal-btn {
  padding: 10px 24px;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
}
.modal-btn--danger { background: #e53935; color: #fff; }
.modal-btn--danger:hover { background: #c62828; }
.modal-btn--ghost { background: transparent; color: var(--gray-mid); border: 1px solid var(--border); }
.modal-btn--ghost:hover { color: var(--black); border-color: var(--black); }

@media (max-width: 600px) {
  .promos-page { padding: 0 0 40px; }
  .page-title { font-size: 20px; margin-bottom: 16px; }
  .promo-form-block { padding: 16px; }
  .promo-form-row { flex-direction: column; gap: 10px; }
  .promo-field--short { width: 100%; }
  .promo-input-field { width: 100% !important; }
  .promo-add-btn { width: 100%; height: 44px; }
  .promos-table { font-size: 11px; }
  .promos-table th { padding: 8px 8px; font-size: 9px; }
  .promos-table td { padding: 10px 8px; }
  .td-actions { flex-direction: column; gap: 5px; }
  .action-btn { width: 100%; text-align: center; padding: 8px; }
}
</style>
