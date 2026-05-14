<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { isAdmin, token } from '../composebles/useGoods.js'
import { sanitize } from '../composebles/sanitize.js'

const router = useRouter()

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]')
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

const currentUser = computed(function() {
  if (!token.value) return null
  if (token.value === 'admin') {
    return { login: 'admin', name: 'Администратор', email: '', isAdminAccount: true }
  }
  const users = getUsers()
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    if (users[userIndex].login === token.value) return users[userIndex]
  }
  return null
})

// ── Программа лояльности ──────────────────────────────────
const totalSpent = computed(function() {
  if (!token.value || token.value === 'admin') return 0
  const key = 'orders_user_' + token.value
  let orders = []
  const rawOrders = localStorage.getItem(key)
  if (rawOrders) orders = JSON.parse(rawOrders)
  let sum = 0
  for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
    sum = sum + (orders[orderIndex].total || 0)
  }
  return sum
})

const loyaltyLevel = computed(function() {
  if (totalSpent.value >= 100000) return 'PLATINUM'
  if (totalSpent.value >= 50000) return 'GOLD'
  if (totalSpent.value >= 20000) return 'SILVER'
  return null
})

const nextLevel = computed(function() {
  if (totalSpent.value >= 100000) return null
  if (totalSpent.value >= 50000) return { name: 'PLATINUM', threshold: 100000 }
  if (totalSpent.value >= 20000) return { name: 'GOLD', threshold: 50000 }
  return { name: 'SILVER', threshold: 20000 }
})

const progressPercent = computed(function() {
  if (!nextLevel.value) return 100
  if (totalSpent.value >= 50000) return Math.min(100, (totalSpent.value - 50000) / 500)
  if (totalSpent.value >= 20000) return Math.min(100, (totalSpent.value - 20000) / 300)
  return Math.min(100, totalSpent.value / 200)
})

const amountLeft = computed(function() {
  if (!nextLevel.value) return 0
  return nextLevel.value.threshold - totalSpent.value
})

// --- Режим: view | edit ---
const mode = ref('view')

const editForm = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '',
  password: '',
  newPassword: '',
})

const editErrors = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
})

function startEdit() {
  const u = currentUser.value
  editForm.name = u.name || ''
  editForm.email = u.email || ''
  editForm.phone = u.phone || ''
  editForm.birthDate = u.birthDate || ''
  editForm.gender = u.gender || ''
  editForm.password = ''
  editForm.newPassword = ''
  editErrors.name = ''
  editErrors.email = ''
  editErrors.phone = ''
  editErrors.password = ''
  mode.value = 'edit'
}

function cancelEdit() {
  mode.value = 'view'
}

const saveSuccess = ref(false)

function saveEdit() {
  editErrors.name = ''
  editErrors.email = ''
  editErrors.phone = ''
  editErrors.password = ''
  let hasErr = false

  if (!editForm.name) {
    editErrors.name = 'Имя обязательно'
    hasErr = true
  }
  if (!editForm.email || !editForm.email.includes('@')) {
    editErrors.email = 'Укажите корректный e-mail'
    hasErr = true
  }
  if (editForm.phone && isNaN(Number(editForm.phone))) {
    editErrors.phone = 'Телефон должен содержать только цифры'
    hasErr = true
  }
  if (editForm.newPassword && !editForm.password) {
    editErrors.password = 'Введите текущий пароль для смены'
    hasErr = true
  }
  if (editForm.newPassword && editForm.password && editForm.password !== currentUser.value.password) {
    editErrors.password = 'Текущий пароль неверный'
    hasErr = true
  }
  if (hasErr) return

  const users = getUsers()
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    if (users[userIndex].login === token.value) {
      users[userIndex].name = sanitize(editForm.name)
      users[userIndex].email = sanitize(editForm.email)
      users[userIndex].phone = sanitize(editForm.phone)
      users[userIndex].birthDate = editForm.birthDate
      users[userIndex].gender = editForm.gender
      if (editForm.newPassword) {
        users[userIndex].password = editForm.newPassword
      }
      break
    }
  }
  saveUsers(users)
  mode.value = 'view'
  saveSuccess.value = true
  setTimeout(function() { saveSuccess.value = false }, 2500)
}

// --- Удаление аккаунта ---
const showDeleteConfirm = ref(false)
const deletePassword = ref('')
const deleteError = ref('')

function confirmDelete() {
  deleteError.value = ''
  if (!deletePassword.value) {
    deleteError.value = 'Введите пароль для подтверждения'
    return
  }
  if (deletePassword.value !== currentUser.value.password) {
    deleteError.value = 'Неверный пароль'
    return
  }
  const users = getUsers()
  const filtered = []
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    if (users[userIndex].login !== token.value) filtered.push(users[userIndex])
  }
  saveUsers(filtered)
  token.value = ''
  isAdmin.value = false
  router.push({ name: 'home' })
}

// --- Выход ---
function logout() {
  token.value = ''
  isAdmin.value = false
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-box">

      <!-- Просмотр -->
      <template v-if="mode === 'view'">
        <div class="profile-header">
          <h2 class="profile-title">Личный кабинет</h2>
          <button v-if="!currentUser?.isAdminAccount" class="btn-edit" @click="startEdit">Изменить данные</button>
        </div>

        <p v-if="saveSuccess" class="success-msg">Данные успешно сохранены</p>

        <div class="profile-info" v-if="currentUser">
          <!-- Бейдж администратора -->
          <div v-if="isAdmin" class="admin-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Администратор
          </div>
          <div class="info-row">
            <span class="info-label">Логин</span>
            <span class="info-value">{{ currentUser.login }}</span>
          </div>
          <div class="info-row" v-if="currentUser.name">
            <span class="info-label">Имя</span>
            <span class="info-value">{{ currentUser.name }}</span>
          </div>
          <div class="info-row" v-if="currentUser.email">
            <span class="info-label">E-mail</span>
            <span class="info-value">{{ currentUser.email }}</span>
          </div>
          <div class="info-row" v-if="currentUser.phone">
            <span class="info-label">Телефон</span>
            <span class="info-value">{{ currentUser.phone }}</span>
          </div>
          <div class="info-row" v-if="currentUser.birthDate">
            <span class="info-label">Дата рождения</span>
            <span class="info-value">{{ currentUser.birthDate }}</span>
          </div>
          <div class="info-row" v-if="currentUser.gender">
            <span class="info-label">Пол</span>
            <span class="info-value">{{ currentUser.gender === 'female' ? 'Женский' : 'Мужской' }}</span>
          </div>
        </div>

        <!-- Блок лояльности -->
        <div v-if="!currentUser?.isAdminAccount" class="loyalty-block">
          <div class="loyalty-top">
            <span class="loyalty-label">Программа лояльности</span>
            <span v-if="loyaltyLevel" :class="['loyalty-badge', 'loyalty-badge--' + loyaltyLevel.toLowerCase()]">
              {{ loyaltyLevel }}
            </span>
            <span v-else class="loyalty-badge-none">Нет статуса</span>
          </div>

          <div class="loyalty-spent">
            Потрачено: <strong>{{ totalSpent.toLocaleString('ru-RU') }} ₽</strong>
          </div>

          <div v-if="nextLevel" class="loyalty-progress-block">
            <div class="loyalty-progress-bar">
              <div class="loyalty-progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <p class="loyalty-hint">
              До статуса <strong>{{ nextLevel.name }}</strong> осталось
              <strong>{{ amountLeft.toLocaleString('ru-RU') }} ₽</strong>
            </p>
          </div>
          <div v-else class="loyalty-max">
            Максимальный уровень достигнут
          </div>

          <RouterLink :to="{ name: 'loyalty' }" class="loyalty-link">Подробнее о программе →</RouterLink>
        </div>

        <button class="btn-logout" @click="logout">Выйти из аккаунта</button>

        <RouterLink v-if="!currentUser?.isAdminAccount" :to="{ name: 'orders' }" class="btn-orders">
          📋 История заказов
        </RouterLink>

        <button v-if="!currentUser?.isAdminAccount" class="btn-delete-account" @click="showDeleteConfirm = true">Удалить аккаунт</button>

        <!-- Подтверждение удаления -->
        <div v-if="showDeleteConfirm" class="delete-confirm">
          <p class="delete-warn">Это действие необратимо. Введите пароль для подтверждения:</p>
          <input type="password" v-model="deletePassword" class="delete-input" placeholder="Ваш пароль" @input="deleteError = ''" />
          <p v-if="deleteError" class="field-error">{{ deleteError }}</p>
          <div class="delete-btns">
            <button class="btn-confirm-delete" @click="confirmDelete">Удалить навсегда</button>
            <button class="btn-cancel-delete" @click="showDeleteConfirm = false; deletePassword = ''">Отмена</button>
          </div>
        </div>
      </template>

      <!-- Редактирование -->
      <template v-if="mode === 'edit'">
        <div class="profile-header">
          <h2 class="profile-title">Изменить данные</h2>
        </div>

        <div class="field">
          <label>Имя *</label>
          <input type="text" v-model="editForm.name" @input="editErrors.name = ''" />
          <p v-if="editErrors.name" class="field-error">{{ editErrors.name }}</p>
        </div>

        <div class="field">
          <label>E-mail *</label>
          <input type="email" v-model="editForm.email" @input="editErrors.email = ''" />
          <p v-if="editErrors.email" class="field-error">{{ editErrors.email }}</p>
        </div>

        <div class="field">
          <label>Телефон</label>
          <input type="text" v-model="editForm.phone" @input="editErrors.phone = ''" />
          <p v-if="editErrors.phone" class="field-error">{{ editErrors.phone }}</p>
        </div>

        <div class="field">
          <label>Дата рождения</label>
          <input type="date" v-model="editForm.birthDate" />
        </div>

        <div class="edit-field">
          <label>Пол</label>
          <div class="gender-tabs">
            <button type="button" :class="['gender-btn', { 'gender-btn--active': editForm.gender === 'female' }]" @click="editForm.gender = editForm.gender === 'female' ? '' : 'female'">Женский</button>
            <button type="button" :class="['gender-btn', { 'gender-btn--active': editForm.gender === 'male' }]" @click="editForm.gender = editForm.gender === 'male' ? '' : 'male'">Мужской</button>
          </div>
        </div>

        <div class="divider"></div>
        <p class="section-hint">Смена пароля (оставьте пустым, чтобы не менять)</p>

        <div class="field">
          <label>Текущий пароль</label>
          <input type="password" v-model="editForm.password" @input="editErrors.password = ''" />
          <p v-if="editErrors.password" class="field-error">{{ editErrors.password }}</p>
        </div>

        <div class="field">
          <label>Новый пароль</label>
          <input type="password" v-model="editForm.newPassword" />
        </div>

        <div class="edit-actions">
          <button class="btn-save" @click="saveEdit">Сохранить</button>
          <button class="btn-cancel" @click="cancelEdit">Отмена</button>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
.profile-page { min-height: 60vh; display: flex; align-items: center; justify-content: center; padding: 60px 20px; }
.profile-box { width: 100%; max-width: 440px; }

.profile-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 28px; }
.profile-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400; letter-spacing: 0.04em; }
.btn-edit { background: none; border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gray-mid); cursor: pointer; padding: 0; transition: color .2s; }
.btn-edit:hover { color: var(--black); }

.success-msg { font-size: 12px; color: #2d7d2d; margin-bottom: 16px; }

.profile-info { margin-bottom: 24px; }
.admin-badge { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--white); background: var(--black); padding: 6px 14px; margin-bottom: 20px; }
.info-row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border); }
.info-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gray-mid); }
.info-value { font-size: 13px; color: var(--black); }

/* ── Лояльность ── */
.loyalty-block {
  border: 1px solid var(--border);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loyalty-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.loyalty-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gray-mid);
}

.loyalty-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  padding: 4px 10px;
  border: 1px solid currentColor;
}
.loyalty-badge--silver   { color: #999; border-color: #ccc; }
.loyalty-badge--gold     { color: #c9a84c; border-color: #c9a84c; }
.loyalty-badge--platinum { color: #7a8ba6; border-color: #7a8ba6; }
.loyalty-badge-none { font-size: 11px; color: var(--gray-light); }

.loyalty-spent {
  font-size: 13px;
  color: var(--black);
}
.loyalty-spent strong { font-weight: 700; }

.loyalty-progress-bar {
  height: 2px;
  background: var(--gray-bg);
  border: 1px solid var(--border);
}
.loyalty-progress-fill {
  height: 100%;
  background: var(--black);
  transition: width .4s ease;
}

.loyalty-hint {
  font-size: 12px;
  color: var(--gray-mid);
  margin-top: 8px;
  line-height: 1.6;
}
.loyalty-hint strong { color: var(--black); }

.loyalty-max {
  font-size: 12px;
  color: #2d7d2d;
  font-weight: 600;
}

.loyalty-link {
  font-size: 11px;
  color: var(--gray-mid);
  letter-spacing: 0.06em;
  transition: color .2s;
}
.loyalty-link:hover { color: var(--black); }

/* ── Кнопки ── */
.btn-logout { width: 100%; padding: 13px; background: transparent; color: var(--black); border: 1px solid var(--black); font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: all .2s; margin-bottom: 12px; }
.btn-logout:hover { background: var(--black); color: var(--white); }
.btn-orders { display: block; width: 100%; padding: 13px; background: var(--gray-bg); color: var(--black); border: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; text-align: center; text-decoration: none; margin-bottom: 12px; transition: border-color .2s; }
.btn-orders:hover { border-color: var(--black); }

.btn-delete-account { width: 100%; padding: 13px; background: transparent; color: #e53935; border: 1px solid #e53935; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: all .2s; }
.btn-delete-account:hover { background: #e53935; color: #fff; }

.delete-confirm { margin-top: 20px; padding: 20px; border: 1px solid #e53935; }
.delete-warn { font-size: 12px; color: var(--gray-dark); margin-bottom: 12px; line-height: 1.6; }
.delete-input { width: 100%; border: 1px solid var(--border); padding: 10px 13px; font-size: 13px; font-family: 'Montserrat', sans-serif; color: var(--black); box-sizing: border-box; margin-bottom: 6px; background: var(--white); }
.delete-input:focus { outline: none; border-color: #e53935; }
.delete-btns { display: flex; gap: 10px; margin-top: 12px; }
.btn-confirm-delete { flex: 1; padding: 11px; background: #e53935; color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; }
.btn-cancel-delete { flex: 1; padding: 11px; background: transparent; color: var(--black); border: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; }

/* Форма редактирования */
.field { margin-bottom: 18px; }
label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 7px; }
input { width: 100%; border: 1px solid var(--border); padding: 11px 13px; font-size: 13px; font-family: 'Montserrat', sans-serif; color: var(--black); background: var(--white); transition: border-color .2s; box-sizing: border-box; }
input:focus { outline: none; border-color: var(--black); }
.field-error { font-size: 11px; color: #e53935; margin-top: 5px; }

.gender-tabs { display: flex; border: 1px solid var(--border); width: 100%; margin-top: 7px; }
.gender-btn { flex: 1; padding: 11px 0; background: transparent; border: none; border-right: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); cursor: pointer; transition: all .2s; }
.gender-btn:last-child { border-right: none; }
.gender-btn--active { background: var(--black); color: var(--white); }
.gender-btn:hover:not(.gender-btn--active) { color: var(--black); }

.divider { border: none; border-top: 1px solid var(--border); margin: 20px 0 14px; }
.section-hint { font-size: 11px; color: var(--gray-mid); margin-bottom: 16px; letter-spacing: 0.04em; }

.edit-actions { display: flex; gap: 10px; margin-top: 10px; }
.btn-save { flex: 1; padding: 13px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: background .2s; }
.btn-save:hover { background: #333; }
.btn-cancel { flex: 1; padding: 13px; background: transparent; color: var(--black); border: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: border-color .2s; }
.btn-cancel:hover { border-color: var(--black); }
</style>
