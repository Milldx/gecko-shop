<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { token, isAdmin } from '../composebles/useGoods.js'

const router = useRouter()

const form = reactive({
  login: '',
  password: ''
})

const errors = reactive({
  login: '',
  password: ''
})

const serverError = ref('')

function submit() {
  errors.login = ''
  errors.password = ''
  serverError.value = ''

  if (!form.login) {
    errors.login = 'Введите логин'
    return
  }
  if (!form.password) {
    errors.password = 'Введите пароль'
    return
  }

  // Проверка встроенного аккаунта администратора
  if (form.login === 'admin' && form.password === 'admin1') {
    token.value = 'admin'
    isAdmin.value = true
    router.push({ name: 'home' })
    return
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]')
  let found = null
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    if (users[userIndex].login === form.login && users[userIndex].password === form.password) {
      found = users[userIndex]
      break
    }
  }

  if (!found) {
    serverError.value = 'Неверный логин или пароль'
    return
  }

  token.value = found.login
  isAdmin.value = false
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-box">
      <h2 class="auth-title">Вход</h2>

      <div class="field">
        <label>Логин</label>
        <input type="text" v-model="form.login" @input="errors.login = ''" />
        <p v-if="errors.login" class="field-error">{{ errors.login }}</p>
      </div>

      <div class="field">
        <label>Пароль</label>
        <input type="password" v-model="form.password" @input="errors.password = ''" />
        <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
      </div>

      <p v-if="serverError" class="server-error">{{ serverError }}</p>

      <button class="btn-submit" @click="submit">Войти</button>

      <p class="auth-link">Нет аккаунта? <RouterLink :to="{ name: 'register' }">Зарегистрироваться</RouterLink></p>
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
.server-error { font-size: 12px; color: #e53935; margin-bottom: 16px; }

.btn-submit { width: 100%; padding: 14px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: background .2s; margin-bottom: 20px; }
.btn-submit:hover { background: #333; }

.auth-link { font-size: 12px; color: var(--gray-mid); text-align: center; }
.auth-link a { color: var(--black); text-decoration: underline; text-underline-offset: 3px; }
</style>
