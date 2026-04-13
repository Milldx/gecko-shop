<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrders } from '../composebles/useGoods.js'

const router = useRouter()

const orders = ref([])
onMounted(function() { orders.value = getOrders() })

const STATUS_LABELS = {
  new: { label: 'Новый', color: '#e89b00' },
  confirmed: { label: 'Подтверждён', color: '#2196f3' },
  shipped: { label: 'Отправлен', color: '#9c27b0' },
  delivered: { label: 'Доставлен', color: '#2d7d2d' },
  cancelled: { label: 'Отменён', color: '#e53935' },
}

function statusLabel(s) { return STATUS_LABELS[s] || { label: s, color: '#999' } }

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
}

const DELIVERY_LABELS = { courier: 'Курьером', pickup: 'Самовывоз', post: 'Почта России' }
const PAYMENT_LABELS = { card: 'Банковская карта', cash: 'Наличными', sbp: 'СБП' }

const expanded = ref(null)
function toggle(id) {
  if (expanded.value === id) {
    expanded.value = null
  } else {
    expanded.value = id
  }
}
</script>

<template>
  <div class="orders-page">
    <div class="orders-breadcrumb">
      <RouterLink :to="{ name: 'home' }">Главная</RouterLink>
      <span>/</span>
      <RouterLink :to="{ name: 'profile' }">Личный кабинет</RouterLink>
      <span>/</span>
      <span>История заказов</span>
    </div>

    <h1 class="orders-title">История заказов</h1>

    <div v-if="!orders.length" class="orders-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <p>У вас пока нет заказов</p>
      <button class="btn-catalog" @click="router.push({ name: 'home' })">Перейти в каталог</button>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <!-- Шапка заказа -->
        <div class="order-head" @click="toggle(order.id)">
          <div class="order-info">
            <span class="order-num">Заказ #{{ order.id.replace('order_', '') }}</span>
            <span class="order-date">{{ formatDate(order.date) }}</span>
          </div>
          <div class="order-right">
            <span class="order-total">{{ order.total.toLocaleString('ru-RU') }} ₽</span>
            <span class="order-status" :style="{ color: statusLabel(order.status).color, borderColor: statusLabel(order.status).color }">
              {{ statusLabel(order.status).label }}
            </span>
            <span class="order-arrow" :class="{ 'order-arrow--open': expanded === order.id }">›</span>
          </div>
        </div>

        <!-- Детали заказа -->
        <div v-if="expanded === order.id" class="order-body">
          <!-- Товары -->
          <div class="order-items">
            <div v-for="(item, i) in order.items" :key="i" class="order-item">
              <span class="oi-name">{{ item.name }}</span>
              <span class="oi-meta">{{ item.size }} · {{ item.qty }} шт.</span>
              <span class="oi-price">{{ (item.price * item.qty).toLocaleString('ru-RU') }} ₽</span>
            </div>
          </div>

          <!-- Детали доставки -->
          <div class="order-details">
            <div v-if="order.name" class="od-row">
              <span class="od-label">Получатель</span>
              <span>{{ order.name }}</span>
            </div>
            <div v-if="order.delivery" class="od-row">
              <span class="od-label">Доставка</span>
              <span>{{ DELIVERY_LABELS[order.delivery] || order.delivery }}</span>
            </div>
            <div v-if="order.payment" class="od-row">
              <span class="od-label">Оплата</span>
              <span>{{ PAYMENT_LABELS[order.payment] || order.payment }}</span>
            </div>
            <div v-if="order.contact?.phone" class="od-row">
              <span class="od-label">Телефон</span>
              <span>{{ order.contact.phone }}</span>
            </div>
            <div v-if="order.contact?.email" class="od-row">
              <span class="od-label">Email</span>
              <span>{{ order.contact.email }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-page { padding: 24px 40px 60px; max-width: 900px; margin: 0 auto; }

.orders-breadcrumb { display: flex; gap: 8px; font-size: 11px; color: var(--gray-mid); letter-spacing: 0.06em; margin-bottom: 32px; }
.orders-breadcrumb a:hover { color: var(--black); }

.orders-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 400; margin-bottom: 32px; }

.orders-empty { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 60px 0; color: var(--gray-mid); text-align: center; }
.orders-empty p { font-size: 14px; }
.btn-catalog { padding: 12px 32px; background: var(--black); color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }

.orders-list { display: flex; flex-direction: column; gap: 0; }

.order-card { border: 1px solid var(--border); margin-bottom: 8px; }

.order-head { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; cursor: pointer; transition: background .15s; }
.order-head:hover { background: #fafafa; }

.order-info { display: flex; flex-direction: column; gap: 4px; }
.order-num { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; }
.order-date { font-size: 11px; color: var(--gray-mid); }

.order-right { display: flex; align-items: center; gap: 16px; }
.order-total { font-size: 14px; font-weight: 600; }
.order-status { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid; padding: 4px 10px; }
.order-arrow { font-size: 18px; color: var(--gray-mid); transition: transform .2s; display: inline-block; }
.order-arrow--open { transform: rotate(90deg); }

.order-body { border-top: 1px solid var(--border); padding: 20px; display: flex; gap: 40px; flex-wrap: wrap; }

.order-items { flex: 1; min-width: 240px; }
.order-item { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
.order-item:last-child { border-bottom: none; }
.oi-name { flex: 1; font-weight: 500; }
.oi-meta { color: var(--gray-mid); font-size: 11px; white-space: nowrap; }
.oi-price { font-weight: 600; white-space: nowrap; }

.order-details { display: flex; flex-direction: column; gap: 10px; min-width: 200px; }
.od-row { display: flex; gap: 12px; font-size: 12px; }
.od-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-mid); min-width: 80px; }
</style>
