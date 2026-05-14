<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { sanitizeObject } from '../composebles/sanitize.js'

const router = useRouter()

const form = reactive({
  login: '',
  password: '',
  email: '',
  name: '',
  phone: '',
  birthDate: '',
  gender: '',
})

const errors = reactive({
  login: '',
  password: '',
  email: '',
  name: '',
  phone: ''
})

const hasErrors = ref(false)

function validate() {
  hasErrors.value = false
  errors.login = ''
  errors.password = ''
  errors.email = ''
  errors.name = ''
  errors.phone = ''

  if (!form.login) {
    errors.login = 'Логин обязателен'
    hasErrors.value = true
  } else if (form.login.length < 3) {
    errors.login = 'Логин не короче 3 символов'
    hasErrors.value = true
  }

  if (!form.password) {
    errors.password = 'Пароль обязателен'
    hasErrors.value = true
  } else if (form.password.length < 6) {
    errors.password = 'Пароль не короче 6 символов'
    hasErrors.value = true
  }

  if (!form.email) {
    errors.email = 'Почта обязательна'
    hasErrors.value = true
  } else if (!form.email.includes('@')) {
    errors.email = 'Некорректный e-mail'
    hasErrors.value = true
  }

  if (!form.name) {
    errors.name = 'Имя обязательно'
    hasErrors.value = true
  }

  if (form.phone && isNaN(Number(form.phone))) {
    errors.phone = 'Телефон должен содержать только цифры'
    hasErrors.value = true
  }
}

function submit() {
  validate()
  if (hasErrors.value) return

  const users = JSON.parse(localStorage.getItem('users') || '[]')

  let exists = false
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    if (users[userIndex].login === form.login) {
      exists = true
      break
    }
  }

  if (exists) {
    errors.login = 'Пользователь с таким логином уже существует'
    return
  }

  const cleanUser = sanitizeObject({
    login: form.login,
    password: form.password,
    email: form.email,
    name: form.name,
    phone: form.phone,
    birthDate: form.birthDate,
    gender: form.gender,
  })
  users.push(cleanUser)

  localStorage.setItem('users', JSON.stringify(users))
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-box">
      <h2 class="auth-title">Регистрация</h2>

      <div class="field">
        <label>Логин *</label>
        <input type="text" v-model="form.login" @input="errors.login = ''" />
        <p v-if="errors.login" class="field-error">{{ errors.login }}</p>
      </div>

      <div class="field">
        <label>Пароль *</label>
        <input type="password" v-model="form.password" @input="errors.password = ''" />
        <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
      </div>

      <div class="field">
        <label>E-mail *</label>
        <input type="email" v-model="form.email" @input="errors.email = ''" />
        <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
      </div>

      <div class="field">
        <label>Имя *</label>
        <input type="text" v-model="form.name" @input="errors.name = ''" />
        <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
      </div>

      <div class="field">
        <label>Телефон</label>
        <input type="text" v-model="form.phone" @input="errors.phone = ''" />
        <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
      </div>

      <div class="field">
        <label>Дата рождения</label>
        <input type="date" v-model="form.birthDate" />
      </div>

      <div class="field">
        <label>Пол</label>
        <div class="gender-tabs">
          <button type="button" :class="['gender-btn', { 'gender-btn--active': form.gender === 'female' }]" @click="form.gender = 'female'">Женский</button>
          <button type="button" :class="['gender-btn', { 'gender-btn--active': form.gender === 'male' }]" @click="form.gender = 'male'">Мужской</button>
        </div>
      </div>

      <button class="btn-submit" @click="submit">Зарегистрироваться</button>

      <p class="auth-link">Уже есть аккаунт? <RouterLink :to="{ name: 'login' }">Войти</RouterLink></p>
    </div>
  </div>
</template>

<style scoped>
.auth-page { min-height: 60vh; display: flex; align-items: center; justify-content: center; padding: 60px 20px; }
.auth-box { width: 100%; max-width: 400px; }
.auth-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400; margin-bottom: 32px; letter-spacing: 0.04em; }

.field { margin-bottom: 20px; }
label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 7px; }
input { width: 100%; border: 1px solid var(--border); padding: 11px 13px; font-size: 13px; font-family: 'Montserrat', sans-serif; color: var(--black); background: var(--white); transition: border-color .2s; box-sizing: border-box; }
input:focus { outline: none; border-color: var(--black); }

.field-error { font-size: 11px; color: #e53935; margin-top: 5px; }

.gender-tabs { display: flex; border: 1px solid var(--border); width: 100%; }
.gender-btn { flex: 1; padding: 11px 0; background: transparent; border: none; border-right: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); cursor: pointer; transition: all .2s; }
.gender-btn:last-child { border-right: none; }
.gender-btn--active { background: var(--black); color: var(--white); }
.gender-btn:hover:not(.gender-btn--active) { color: var(--black); }

.btn-submit { width: 100%; padding: 14px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: background .2s; margin-bottom: 20px; }
.btn-submit:hover { background: #333; }

.auth-link { font-size: 12px; color: var(--gray-mid); text-align: center; }
.auth-link a { color: var(--black); text-decoration: underline; text-underline-offset: 3px; }
</style>
