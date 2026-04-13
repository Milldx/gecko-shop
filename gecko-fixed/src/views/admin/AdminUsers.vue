<script setup>
import { ref, computed, onMounted } from 'vue'

const GENDER_LABELS = { female: 'Женский', male: 'Мужской' }

const usersData = ref([])
onMounted(function() {
  const rawUsers = localStorage.getItem('users')
  if (rawUsers) usersData.value = JSON.parse(rawUsers)
})
const users = computed(function() { return usersData.value })

const search = ref('')

const filteredUsers = computed(function() {
  const q = search.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter(function(user) {
    return user.login.toLowerCase().includes(q) ||
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q))
  })
})

function getOrderCount(login) {
  const raw = localStorage.getItem('orders_user_' + login)
  if (!raw) return 0
  return JSON.parse(raw).length
}

// Всплывающее окно пользователя
const selected = ref(null)
function viewUser(u) { selected.value = u }

// Итоги: потрачено
function getUserTotal(login) {
  const raw = localStorage.getItem('orders_user_' + login)
  if (!raw) return 0
  const orders = JSON.parse(raw)
  let total = 0
  for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) total += orders[orderIndex].total || 0
  return total
}
</script>

<template>
  <div class="users-page">
    <div class="users-head">
      <h2 class="page-title">Пользователи</h2>
      <div class="search-wrap">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" type="text" placeholder="Поиск по логину, имени, email..." class="search-input" />
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat">
        <span class="stat-num">{{ users.length }}</span>
        <span class="stat-label">Зарегистрировано</span>
      </div>
    </div>

    <div v-if="!filteredUsers.length" class="empty">
      <p>{{ search ? 'Ничего не найдено' : 'Нет зарегистрированных пользователей' }}</p>
    </div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Логин</th>
          <th>Имя</th>
          <th>Email</th>
          <th>Телефон</th>
          <th>Пол</th>
          <th>Заказов</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in filteredUsers" :key="u.login">
          <td class="login-cell">{{ u.login }}</td>
          <td>{{ u.name || '—' }}</td>
          <td>{{ u.email || '—' }}</td>
          <td>{{ u.phone || '—' }}</td>
          <td>{{ GENDER_LABELS[u.gender] || '—' }}</td>
          <td>
            <span class="order-count">{{ getOrderCount(u.login) }}</span>
          </td>
          <td>
            <button class="btn-view" @click="viewUser(u)">Подробнее</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Модал с деталями пользователя -->
      <div v-if="selected" class="modal-overlay" @click.self="selected = null">
        <div class="modal">
          <div class="modal-head">
            <h3 class="modal-title">{{ selected.name || selected.login }}</h3>
            <button class="modal-close" @click="selected = null">✕</button>
          </div>

          <div class="modal-rows">
            <div class="mrow"><span class="mkey">Логин</span><span>{{ selected.login }}</span></div>
            <div class="mrow" v-if="selected.name"><span class="mkey">Имя</span><span>{{ selected.name }}</span></div>
            <div class="mrow" v-if="selected.email"><span class="mkey">Email</span><span>{{ selected.email }}</span></div>
            <div class="mrow" v-if="selected.phone"><span class="mkey">Телефон</span><span>{{ selected.phone }}</span></div>
            <div class="mrow" v-if="selected.birthDate"><span class="mkey">Дата рождения</span><span>{{ selected.birthDate }}</span></div>
            <div class="mrow" v-if="selected.gender"><span class="mkey">Пол</span><span>{{ GENDER_LABELS[selected.gender] || selected.gender }}</span></div>
            <div class="mrow"><span class="mkey">Заказов</span><span>{{ getOrderCount(selected.login) }}</span></div>
            <div class="mrow" v-if="getOrderCount(selected.login) > 0">
              <span class="mkey">Потрачено</span>
              <span>{{ getUserTotal(selected.login).toLocaleString('ru-RU') }} ₽</span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
.users-page { }
.users-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; }

.search-wrap { display: flex; align-items: center; gap: 10px; border: 1px solid var(--border); padding: 8px 14px; }
.search-input { border: none; outline: none; font-family: 'Montserrat', sans-serif; font-size: 12px; color: var(--black); width: 260px; background: transparent; }
.search-input::placeholder { color: var(--gray-light); }

.stats-bar { display: flex; gap: 32px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
.stat { display: flex; flex-direction: column; gap: 4px; }
.stat-num { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400; line-height: 1; }
.stat-label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); }

.empty { padding: 40px 0; font-size: 13px; color: var(--gray-mid); }

.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); padding: 0 14px 12px 0; border-bottom: 1px solid var(--border); }
.table td { padding: 13px 14px 13px 0; font-size: 13px; border-bottom: 1px solid #f5f5f5; vertical-align: middle; }
.login-cell { font-weight: 600; letter-spacing: 0.04em; }
.order-count { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; background: var(--gray-bg); border-radius: 50%; font-size: 11px; font-weight: 700; }

.btn-view { padding: 5px 14px; background: transparent; border: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: border-color .2s; }
.btn-view:hover { border-color: var(--black); }

/* Модал */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; width: 400px; max-width: 95vw; padding: 32px 36px; }
.modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; }
.modal-close { background: none; border: none; font-size: 16px; cursor: pointer; color: var(--gray-mid); transition: color .2s; }
.modal-close:hover { color: var(--black); }
.modal-rows { display: flex; flex-direction: column; gap: 0; }
.mrow { display: flex; gap: 16px; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
.mrow:last-child { border-bottom: none; }
.mkey { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gray-mid); padding-top: 1px; }
</style>
