<script setup>
import { computed, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { goods, cart, removeFromCart, updateCartQty, clearCart, token, saveOrder } from '../composebles/useGoods.js'

const router = useRouter()

// ── Уровень лояльности текущего пользователя ─────────────
const totalSpent = computed(function() {
  if (!token.value || token.value === 'admin') return 0
  const key = 'orders_user_' + token.value
  let orders = []
  const rawOrders = localStorage.getItem(key)
  if (rawOrders) orders = JSON.parse(rawOrders)
  let sum = 0
  for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) sum = sum + (orders[orderIndex].total || 0)
  return sum
})

const loyaltyLevel = computed(function() {
  if (totalSpent.value >= 100000) return 'PLATINUM'
  if (totalSpent.value >= 50000) return 'GOLD'
  if (totalSpent.value >= 20000) return 'SILVER'
  return null
})

// % скидки по уровню
const loyaltyDiscount = computed(function() {
  if (loyaltyLevel.value === 'PLATINUM') return 15
  if (loyaltyLevel.value === 'GOLD') return 10
  if (loyaltyLevel.value === 'SILVER') return 5
  return 0
})

// Порог бесплатной курьерской доставки
const freeDeliveryThreshold = computed(function() {
  if (loyaltyLevel.value === 'PLATINUM') return 0
  if (loyaltyLevel.value === 'GOLD') return 3000
  if (loyaltyLevel.value === 'SILVER') return 5000
  return 10000
})

// ── Корзина ──────────────────────────────────────────────
const cartItems = computed(function() {
  return cart.value.map(function(item) {
    const product = goods.value.find(function(good) { return good.id === item.productId })
    return { productId: item.productId, size: item.size, qty: item.qty || 1, product: product || null }
  }).filter(function(cartItem) { return cartItem.product })
})

const totalPrice = computed(function() {
  let sum = 0
  for (let cartIndex = 0; cartIndex < cartItems.value.length; cartIndex++) sum = sum + cartItems.value[cartIndex].product.price * cartItems.value[cartIndex].qty
  return sum
})

const totalItems = computed(function() {
  let totalQty = 0
  for (let cartIndex = 0; cartIndex < cartItems.value.length; cartIndex++) totalQty = totalQty + cartItems.value[cartIndex].qty
  return totalQty
})

// Сумма скидки по лояльности
const discountAmount = computed(function() {
  if (!loyaltyDiscount.value) return 0
  return Math.round(totalPrice.value * loyaltyDiscount.value / 100)
})

// Цена после скидки
const priceAfterDiscount = computed(function() {
  return totalPrice.value - discountAmount.value
})

// Стоимость курьерской доставки
const courierCost = computed(function() {
  if (priceAfterDiscount.value >= freeDeliveryThreshold.value) return 0
  return 500
})

// Итоговая стоимость доставки в зависимости от способа
const checkoutDeliveryCost = computed(function() {
  if (form.delivery === 'pickup') return 0
  if (form.delivery === 'post') return 350
  return courierCost.value
})

// Итог
const finalPrice = computed(function() {
  return priceAfterDiscount.value + checkoutDeliveryCost.value
})

function dec(item) { updateCartQty(item.productId, item.size, item.qty - 1) }
function inc(item) { updateCartQty(item.productId, item.size, item.qty + 1) }
function remove(item) { removeFromCart(item.productId, item.size) }

// ── Шаги: 'cart' | 'checkout' | 'done' ───────────────────
const step = ref('cart')

// ── Форма оформления ──────────────────────────────────────
const form = reactive({
  phone: '',
  email: '',
  name: '',
  city: '',
  street: '',
  apartment: '',
  zip: '',
  payment: 'card',
  delivery: 'courier',
  comment: '',
  // Данные карты
  cardNumber: '',
  cardHolder: '',
  cardCvc: '',
})

const errors = reactive({})

function clearErrors() {
  for (const k in errors) delete errors[k]
}

function validateForm() {
  clearErrors()
  let ok = true

  if (!token.value) {
    const phoneRe = /^[\+\d][\d\s\-\(\)]{6,}$/
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.phone.trim() || !phoneRe.test(form.phone.trim())) {
      errors.phone = 'Введите корректный номер телефона'
      ok = false
    }
    if (!form.email.trim() || !emailRe.test(form.email.trim())) {
      errors.email = 'Введите корректный email'
      ok = false
    }
  }

  if (!form.name.trim()) { errors.name = 'Укажите имя получателя'; ok = false }

  if (form.delivery === 'courier') {
    if (!form.city.trim()) { errors.city = 'Укажите город'; ok = false }
    if (!form.street.trim()) { errors.street = 'Укажите улицу и дом'; ok = false }
  }

  if (form.payment === 'card') {
    const digits = form.cardNumber.replace(/\s/g, '')
    if (!digits || digits.length < 16) { errors.cardNumber = 'Введите номер карты (16 цифр)'; ok = false }
    if (!form.cardHolder.trim()) { errors.cardHolder = 'Введите имя держателя карты'; ok = false }
    if (!form.cardCvc.trim() || form.cardCvc.length < 3) { errors.cardCvc = 'Введите CVC (3 цифры)'; ok = false }
  }

  return ok
}

function goToCheckout() {
  if (!cartItems.value.length) return
  step.value = 'checkout'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function placeOrder() {
  if (!validateForm()) return

  let contactData = null
  if (!token.value) {
    contactData = { phone: form.phone, email: form.email }
  }

  saveOrder({
    items: cartItems.value.map(function(item) {
      return { productId: item.productId, name: item.product.name, size: item.size, qty: item.qty, price: item.product.price }
    }),
    total: finalPrice.value,
    contact: contactData,
    name: form.name,
    delivery: form.delivery,
    payment: form.payment,
  })
  step.value = 'done'
  clearCart()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Форматирование номера карты — группы по 4 цифры
function formatCardNumber(event) {
  let val = event.target.value.replace(/\D/g, '').slice(0, 16)
  let formatted = ''
  for (let index = 0; index < val.length; index++) {
    if (index > 0 && index % 4 === 0) formatted += ' '
    formatted += val[index]
  }
  form.cardNumber = formatted
  delete errors.cardNumber
}

function onlyDigitsCvc(event) {
  form.cardCvc = event.target.value.replace(/\D/g, '').slice(0, 3)
  delete errors.cardCvc
}
</script>

<template>
  <div class="cart-page">

    <!-- ХЛЕБНЫЕ КРОШКИ -->
    <div class="cart-breadcrumb">
      <RouterLink :to="{ name: 'home' }">Главная</RouterLink>
      <span>/</span>
      <span v-if="step === 'cart'">Корзина</span>
      <template v-else-if="step === 'checkout'">
        <span class="bc-link" @click="step = 'cart'">Корзина</span>
        <span>/</span>
        <span>Оформление заказа</span>
      </template>
      <span v-else>Заказ оформлен</span>
    </div>

    <!-- ══════════ ШАГ 1: КОРЗИНА ══════════ -->
    <template v-if="step === 'cart'">
      <h1 class="page-title">Корзина <span v-if="totalItems" class="page-count">{{ totalItems }}</span></h1>

      <div v-if="!cartItems.length" class="cart-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <p>В корзине пока ничего нет</p>
        <button class="btn-primary" @click="router.push({ name: 'home' })">Перейти в каталог</button>
      </div>

      <div v-else class="cart-layout">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.productId + '-' + item.size" class="cart-item">
            <div class="item-img" @click="router.push({ name: 'product-description', params: { id: item.productId } })">
              <img :src="item.product.image" :alt="item.product.name" />
            </div>
            <div class="item-info">
              <p class="item-name" @click="router.push({ name: 'product-description', params: { id: item.productId } })">{{ item.product.name }}</p>
              <p class="item-meta">Размер: {{ item.size }}</p>
              <p class="item-price">{{ (item.product.price * item.qty).toLocaleString('ru-RU') }} ₽</p>
              <div class="item-qty">
                <button class="qty-btn" @click="dec(item)" :disabled="item.qty <= 1">−</button>
                <span class="qty-val">{{ item.qty }}</span>
                <button class="qty-btn" @click="inc(item)">+</button>
              </div>
            </div>
            <button class="item-remove" @click="remove(item)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <h2 class="summary-title">Итого</h2>
          <div class="summary-row"><span>Товары ({{ totalItems }})</span><span>{{ totalPrice.toLocaleString('ru-RU') }} ₽</span></div>

          <!-- Скидка по лояльности -->
          <div v-if="loyaltyLevel" class="summary-row summary-discount">
            <span>Скидка {{ loyaltyLevel }} {{ loyaltyDiscount }}%</span>
            <span class="discount-val">− {{ discountAmount.toLocaleString('ru-RU') }} ₽</span>
          </div>

          <div class="summary-row">
            <span>Доставка курьером</span>
            <span v-if="courierCost === 0" class="free">Бесплатно</span>
            <span v-else>{{ courierCost }} ₽</span>
          </div>

          <div class="summary-divider"></div>
          <div class="summary-row summary-total">
            <span>К оплате</span>
            <span>{{ (priceAfterDiscount + courierCost).toLocaleString('ru-RU') }} ₽</span>
          </div>

          <button class="btn-primary btn-full" @click="goToCheckout">Перейти к оформлению</button>
          <button class="btn-ghost btn-full" @click="clearCart">Очистить корзину</button>
        </div>
      </div>
    </template>

    <!-- ══════════ ШАГ 2: ОФОРМЛЕНИЕ ══════════ -->
    <template v-else-if="step === 'checkout'">
      <h1 class="page-title">Оформление заказа</h1>

      <div class="checkout-layout">
        <div class="checkout-form">

          <!-- Контактные данные (только гостям) -->
          <template v-if="!token">
            <div class="form-section">
              <h3 class="form-section-title">Контактные данные</h3>
              <div class="form-row-2">
                <div class="form-field">
                  <label>Телефон *</label>
                  <input v-model="form.phone" type="tel" placeholder="+7 900 000-00-00" :class="{ error: errors.phone }" @input="delete errors.phone" />
                  <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
                </div>
                <div class="form-field">
                  <label>Email *</label>
                  <input v-model="form.email" type="email" placeholder="mail@example.com" :class="{ error: errors.email }" @input="delete errors.email" />
                  <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Получатель -->
          <div class="form-section">
            <h3 class="form-section-title">Получатель</h3>
            <div class="form-field">
              <label>Имя и фамилия *</label>
              <input v-model="form.name" type="text" placeholder="Иван Иванов" :class="{ error: errors.name }" @input="delete errors.name" />
              <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
            </div>
          </div>

          <!-- Способ доставки -->
          <div class="form-section">
            <h3 class="form-section-title">Способ доставки</h3>
            <div class="radio-group">
              <label class="radio-card" :class="{ 'radio-card--active': form.delivery === 'courier' }">
                <input type="radio" v-model="form.delivery" value="courier" />
                <div class="radio-body">
                  <span class="radio-label">Курьером</span>
                  <span class="radio-desc">1–3 дня · {{ courierCost === 0 ? 'Бесплатно' : courierCost + ' ₽' }}</span>
                </div>
              </label>
              <label class="radio-card" :class="{ 'radio-card--active': form.delivery === 'pickup' }">
                <input type="radio" v-model="form.delivery" value="pickup" />
                <div class="radio-body">
                  <span class="radio-label">Самовывоз</span>
                  <span class="radio-desc">Пункт выдачи · Бесплатно</span>
                </div>
              </label>
              <label class="radio-card" :class="{ 'radio-card--active': form.delivery === 'post' }">
                <input type="radio" v-model="form.delivery" value="post" />
                <div class="radio-body">
                  <span class="radio-label">Почта России</span>
                  <span class="radio-desc">5–14 дней · 350 ₽</span>
                </div>
              </label>
            </div>

            <div v-if="form.delivery === 'courier'" class="address-fields">
              <div class="form-row-2">
                <div class="form-field">
                  <label>Город *</label>
                  <input v-model="form.city" type="text" placeholder="Москва" :class="{ error: errors.city }" @input="delete errors.city" />
                  <span v-if="errors.city" class="field-error">{{ errors.city }}</span>
                </div>
                <div class="form-field">
                  <label>Индекс</label>
                  <input v-model="form.zip" type="text" placeholder="123456" />
                </div>
              </div>
              <div class="form-field">
                <label>Улица и дом *</label>
                <input v-model="form.street" type="text" placeholder="ул. Ленина, д. 1" :class="{ error: errors.street }" @input="delete errors.street" />
                <span v-if="errors.street" class="field-error">{{ errors.street }}</span>
              </div>
              <div class="form-field">
                <label>Квартира / офис</label>
                <input v-model="form.apartment" type="text" placeholder="кв. 42" />
              </div>
            </div>
          </div>

          <!-- Способ оплаты -->
          <div class="form-section">
            <h3 class="form-section-title">Способ оплаты</h3>
            <div class="radio-group">
              <label class="radio-card" :class="{ 'radio-card--active': form.payment === 'card' }">
                <input type="radio" v-model="form.payment" value="card" />
                <div class="radio-body">
                  <span class="radio-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    Банковская карта
                  </span>
                  <span class="radio-desc">Visa, Mastercard, Мир</span>
                </div>
              </label>
              <label class="radio-card" :class="{ 'radio-card--active': form.payment === 'cash' }">
                <input type="radio" v-model="form.payment" value="cash" />
                <div class="radio-body">
                  <span class="radio-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>
                    Наличными
                  </span>
                  <span class="radio-desc">При получении</span>
                </div>
              </label>
              <label class="radio-card" :class="{ 'radio-card--active': form.payment === 'sbp' }">
                <input type="radio" v-model="form.payment" value="sbp" />
                <div class="radio-body">
                  <span class="radio-label">СБП</span>
                  <span class="radio-desc">Система быстрых платежей</span>
                </div>
              </label>
            </div>

            <!-- Поля карты -->
            <div v-if="form.payment === 'card'" class="card-fields">
              <div class="form-field">
                <label>Номер карты *</label>
                <input
                  :value="form.cardNumber"
                  @input="formatCardNumber"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxlength="19"
                  :class="{ error: errors.cardNumber }"
                />
                <span v-if="errors.cardNumber" class="field-error">{{ errors.cardNumber }}</span>
              </div>
              <div class="form-field">
                <label>Имя держателя карты *</label>
                <input v-model="form.cardHolder" type="text" placeholder="IVAN IVANOV" @input="delete errors.cardHolder" :class="{ error: errors.cardHolder }" />
                <span v-if="errors.cardHolder" class="field-error">{{ errors.cardHolder }}</span>
              </div>
              <div class="form-field card-cvc-field">
                <label>CVC *</label>
                <input
                  :value="form.cardCvc"
                  @input="onlyDigitsCvc"
                  type="password"
                  placeholder="•••"
                  maxlength="3"
                  :class="{ error: errors.cardCvc }"
                />
                <span v-if="errors.cardCvc" class="field-error">{{ errors.cardCvc }}</span>
              </div>
            </div>
          </div>

          <!-- Комментарий -->
          <div class="form-section">
            <h3 class="form-section-title">Комментарий к заказу</h3>
            <textarea v-model="form.comment" placeholder="Пожелания по доставке, упаковке..." class="comment-input"></textarea>
          </div>
        </div>

        <!-- Правая колонка -->
        <div class="checkout-summary">
          <h2 class="summary-title">Ваш заказ</h2>
          <div class="checkout-items">
            <div v-for="item in cartItems" :key="item.productId + '-' + item.size" class="checkout-item">
              <img :src="item.product.image" :alt="item.product.name" class="checkout-item-img" />
              <div class="checkout-item-info">
                <p class="checkout-item-name">{{ item.product.name }}</p>
                <p class="checkout-item-meta">{{ item.size }} · {{ item.qty }} шт.</p>
                <p class="checkout-item-price">{{ (item.product.price * item.qty).toLocaleString('ru-RU') }} ₽</p>
              </div>
            </div>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row"><span>Товары</span><span>{{ totalPrice.toLocaleString('ru-RU') }} ₽</span></div>

          <!-- Скидка по лояльности -->
          <div v-if="loyaltyLevel" class="summary-row summary-discount">
            <span>Скидка {{ loyaltyLevel }} {{ loyaltyDiscount }}%</span>
            <span class="discount-val">− {{ discountAmount.toLocaleString('ru-RU') }} ₽</span>
          </div>

          <div class="summary-row">
            <span>Доставка</span>
            <span v-if="form.delivery === 'pickup'" class="free">Бесплатно</span>
            <span v-else-if="form.delivery === 'post'">350 ₽</span>
            <span v-else-if="courierCost === 0" class="free">Бесплатно</span>
            <span v-else>{{ courierCost }} ₽</span>
          </div>

          <div class="summary-divider"></div>
          <div class="summary-row summary-total">
            <span>Итого</span>
            <span>{{ finalPrice.toLocaleString('ru-RU') }} ₽</span>
          </div>

          <button class="btn-primary btn-full" @click="placeOrder">Подтвердить заказ</button>
          <button class="btn-ghost btn-full" @click="step = 'cart'">← Вернуться в корзину</button>
        </div>
      </div>
    </template>

    <!-- ══════════ ШАГ 3: УСПЕХ ══════════ -->
    <div v-else class="order-success">
      <div class="success-icon">✓</div>
      <h2 class="success-title">Заказ оформлен!</h2>
      <p class="success-sub">
        <template v-if="!token && form.phone">Мы свяжемся с вами по номеру {{ form.phone }} для подтверждения.</template>
        <template v-else>Мы свяжемся с вами для подтверждения в ближайшее время.</template>
      </p>
      <button class="btn-primary" @click="router.push({ name: 'home' })">Продолжить покупки</button>
    </div>

  </div>
</template>

<style scoped>
.cart-page { padding: 24px 40px 60px; max-width: 1200px; margin: 0 auto; }

.cart-breadcrumb { display: flex; gap: 8px; font-size: 11px; color: var(--gray-mid); letter-spacing: 0.06em; margin-bottom: 32px; }
.cart-breadcrumb a, .bc-link { transition: color .2s; cursor: pointer; }
.cart-breadcrumb a:hover, .bc-link:hover { color: var(--black); }

.page-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 400; margin-bottom: 32px; display: flex; align-items: baseline; gap: 12px; }
.page-count { font-family: 'Montserrat', sans-serif; font-size: 13px; color: var(--gray-mid); font-weight: 400; }

.cart-empty { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 80px 40px; color: var(--gray-mid); text-align: center; }
.cart-empty p { font-size: 14px; }

/* ── Корзина ── */
.cart-layout { display: grid; grid-template-columns: 1fr 300px; gap: 48px; align-items: start; }
.cart-items { display: flex; flex-direction: column; }
.cart-item { display: flex; gap: 20px; padding: 24px 0; border-bottom: 1px solid var(--border); position: relative; }
.cart-item:first-child { border-top: 1px solid var(--border); }
.item-img { width: 100px; height: 130px; flex-shrink: 0; overflow: hidden; background: var(--gray-bg); cursor: pointer; }
.item-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity .2s; }
.item-img:hover img { opacity: 0.8; }
.item-info { flex: 1; display: flex; flex-direction: column; gap: 7px; }
.item-name { font-size: 13px; font-weight: 500; cursor: pointer; }
.item-name:hover { text-decoration: underline; text-underline-offset: 3px; }
.item-meta { font-size: 11px; color: var(--gray-mid); letter-spacing: 0.08em; text-transform: uppercase; }
.item-price { font-size: 14px; font-weight: 500; margin-top: auto; }
.item-qty { display: flex; align-items: center; border: 1px solid var(--border); width: fit-content; }
.qty-btn { width: 32px; height: 32px; background: none; border: none; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.qty-btn:hover { background: var(--gray-bg); }
.qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.qty-val { width: 36px; text-align: center; font-size: 13px; font-weight: 500; }
.item-remove { position: absolute; top: 24px; right: 0; background: none; border: none; color: var(--gray-mid); cursor: pointer; padding: 4px; transition: color .2s; }
.item-remove:hover { color: var(--black); }

/* ── Итог ── */
.cart-summary { border: 1px solid var(--border); padding: 24px; position: sticky; top: 80px; }
.summary-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; margin-bottom: 18px; }
.summary-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; color: var(--gray-dark); }
.summary-discount { color: #2d7d2d; }
.discount-val { font-weight: 600; }
.summary-total { font-size: 15px; font-weight: 600; color: var(--black); margin-bottom: 0; }
.free { color: #2d7d2d; font-weight: 600; }
.summary-divider { border-top: 1px solid var(--border); margin: 14px 0; }


/* ── Оформление ── */
.checkout-layout { display: grid; grid-template-columns: 1fr 340px; gap: 56px; align-items: start; }

.form-section { margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
.form-section:last-child { border-bottom: none; }
.form-section-title { font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 18px; }

.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.form-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.form-field:last-child { margin-bottom: 0; }
.form-field label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); }
.form-field input { border: 1px solid var(--border); padding: 11px 13px; font-size: 13px; font-family: 'Montserrat', sans-serif; color: var(--black); transition: border-color .2s; background: var(--white); }
.form-field input:focus { outline: none; border-color: var(--black); }
.form-field input.error { border-color: #e53935; }
.field-error { font-size: 11px; color: #e53935; margin-top: -2px; }

.radio-group { display: flex; flex-direction: column; gap: 10px; }
.radio-card { display: flex; align-items: center; gap: 14px; border: 1px solid var(--border); padding: 14px 16px; cursor: pointer; transition: border-color .2s; }
.radio-card input[type="radio"] { accent-color: var(--black); flex-shrink: 0; width: 16px; height: 16px; }
.radio-card--active { border-color: var(--black); }
.radio-body { display: flex; flex-direction: column; gap: 3px; }
.radio-label { font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
.radio-desc { font-size: 11px; color: var(--gray-mid); }
.address-fields { margin-top: 16px; }

/* Поля карты */
.card-fields { margin-top: 18px; border-top: 1px solid var(--border); padding-top: 18px; display: flex; flex-direction: column; gap: 0; }
.card-cvc-field { max-width: 140px; }

.comment-input { width: 100%; min-height: 90px; border: 1px solid var(--border); padding: 11px 13px; font-size: 13px; font-family: 'Montserrat', sans-serif; color: var(--black); resize: vertical; box-sizing: border-box; }
.comment-input:focus { outline: none; border-color: var(--black); }

/* Правая колонка оформления */
.checkout-summary { border: 1px solid var(--border); padding: 24px; position: sticky; top: 80px; }
.checkout-items { display: flex; flex-direction: column; gap: 14px; margin-bottom: 18px; }
.checkout-item { display: flex; gap: 12px; }
.checkout-item-img { width: 56px; height: 72px; object-fit: cover; flex-shrink: 0; background: var(--gray-bg); }
.checkout-item-info { display: flex; flex-direction: column; gap: 4px; }
.checkout-item-name { font-size: 12px; font-weight: 500; line-height: 1.4; }
.checkout-item-meta { font-size: 10px; color: var(--gray-mid); letter-spacing: 0.08em; text-transform: uppercase; }
.checkout-item-price { font-size: 13px; font-weight: 500; margin-top: auto; }

/* Кнопки */
.btn-primary { padding: 14px 32px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; transition: background .2s; }
.btn-primary:hover { background: #333; }
.btn-ghost { padding: 12px 32px; background: transparent; color: var(--gray-mid); border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: color .2s; }
.btn-ghost:hover { color: var(--black); }
.btn-full { width: 100%; margin-top: 14px; }

/* Успех */
.order-success { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 80px 40px; text-align: center; }
.success-icon { width: 64px; height: 64px; border: 2px solid var(--black); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.success-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400; }
.success-sub { font-size: 13px; color: var(--gray-mid); max-width: 400px; line-height: 1.7; }
</style>
