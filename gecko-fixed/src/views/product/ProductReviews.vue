<script setup>
import { ref, computed } from 'vue'
import { isAdmin, token, addReview, deleteReview, updateReview } from '../../composebles/useGoods.js'

const props = defineProps({ product: Object })

// Сортировка отзывов
const reviewSort = ref('new') // new | old | rating_asc | rating_desc

const currentUser = computed(function() {
  if (!token.value) return null
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    if (users[userIndex].login === token.value) return users[userIndex]
  }
  return null
})

const canReview = computed(function() { return !!token.value || isAdmin.value })

const reviewerLogin = computed(function() {
  if (token.value) return token.value
  if (isAdmin.value) return '__admin__'
  return null
})

const authorName = computed(function() {
  if (isAdmin.value && token.value === 'admin') return 'Администратор'
  if (currentUser.value && currentUser.value.name) return currentUser.value.name
  if (reviewerLogin.value) return reviewerLogin.value
  return 'Пользователь'
})

const visibleReviews = computed(function() {
  if (!props.product || !props.product.reviews) return []
  const result = props.product.reviews.filter(function(r) {
    return r.approved || (reviewerLogin.value && r.login === reviewerLogin.value)
  })
  function getNum(id) {
    const n = Number(id.replace('r_', ''))
    if (isNaN(n)) return 0
    return n
  }
  return result.slice().sort(function(reviewA, reviewB) {
    if (reviewSort.value === 'new') return getNum(reviewB.id) - getNum(reviewA.id)
    if (reviewSort.value === 'old') return getNum(reviewA.id) - getNum(reviewB.id)
    if (reviewSort.value === 'rating_asc') return (reviewA.rating || 0) - (reviewB.rating || 0)
    if (reviewSort.value === 'rating_desc') return (reviewB.rating || 0) - (reviewA.rating || 0)
    return 0
  })
})

const myReview = computed(function() {
  if (!reviewerLogin.value || !props.product || !props.product.reviews) return null
  return props.product.reviews.find(function(r) { return r.login === reviewerLogin.value }) || null
})

// Средний рейтинг
const avgRating = computed(function() {
  const approved = (props.product?.reviews || []).filter(function(r) { return r.approved && r.rating })
  if (!approved.length) return 0
  return approved.reduce(function(sum, r) { return sum + r.rating }, 0) / approved.length
})

// Форма нового отзыва
const newText = ref('')
const newRating = ref(0)
const hoverRating = ref(0)
const newError = ref('')

function submitReview() {
  newError.value = ''
  if (!newRating.value) { newError.value = 'Поставьте оценку'; return }
  if (!newText.value.trim()) { newError.value = 'Напишите текст отзыва'; return }
  if (newText.value.trim().length < 10) { newError.value = 'Минимум 10 символов'; return }
  addReview(props.product.id, {
    id: 'r_' + Date.now(),
    author: authorName.value,
    login: reviewerLogin.value,
    text: newText.value.trim(),
    rating: newRating.value,
    approved: false,
  })
  newText.value = ''
  newRating.value = 0
}

// Редактирование
const editingId = ref(null)
const editText = ref('')
const editRating = ref(0)

function startEdit(r) { editingId.value = r.id; editText.value = r.text; editRating.value = r.rating || 0 }
function cancelEdit() { editingId.value = null }
function saveEdit(reviewId) {
  if (!editText.value.trim()) return
  updateReview(props.product.id, reviewId, editText.value.trim(), editRating.value)
  editingId.value = null
}
function onDelete(reviewId) {
  if (confirm('Удалить отзыв?')) deleteReview(props.product.id, reviewId)
}
</script>

<template>
  <div class="reviews">

    <!-- Средний рейтинг -->
    <div v-if="visibleReviews.length" class="rating-summary">
      <span class="rating-avg">{{ avgRating.toFixed(1) }}</span>
      <div class="stars-row">
        <span v-for="i in 5" :key="i" class="star" :class="{ 'star--full': i <= Math.round(avgRating) }">★</span>
      </div>
      <span class="rating-count">{{ visibleReviews.filter(function(rev) { return rev.approved }).length }} отзывов</span>
      <div class="review-sort">
        <select v-model="reviewSort" class="sort-select">
          <option value="new">Сначала новые</option>
          <option value="old">Сначала старые</option>
          <option value="rating_desc">По рейтингу ↓</option>
          <option value="rating_asc">По рейтингу ↑</option>
        </select>
      </div>
    </div>

    <!-- Форма -->
    <div v-if="canReview && !myReview" class="add-review">
      <p class="add-title">Оставить отзыв</p>
      <!-- Выбор звёзд -->
      <div class="star-picker">
        <button
          v-for="i in 5"
          :key="i"
          class="star-pick"
          :class="{ 'star-pick--lit': i <= (hoverRating || newRating) }"
          @mouseenter="hoverRating = i"
          @mouseleave="hoverRating = 0"
          @click="newRating = i"
        >★</button>
        <span class="star-pick-label">{{ newRating ? ['', 'Плохо', 'Так себе', 'Нормально', 'Хорошо', 'Отлично'][newRating] : 'Оцените товар' }}</span>
      </div>
      <textarea v-model="newText" class="add-textarea" placeholder="Поделитесь впечатлениями..." @input="newError = ''"></textarea>
      <p v-if="newError" class="add-error">{{ newError }}</p>
      <button class="btn-submit" @click="submitReview">Отправить на проверку</button>
    </div>

    <div v-else-if="!canReview" class="login-prompt">
      <RouterLink :to="{ name: 'login' }" class="login-link">Войдите</RouterLink>, чтобы оставить отзыв
    </div>

    <!-- Список -->
    <template v-if="visibleReviews.length">
      <div v-for="r in visibleReviews" :key="r.id" class="review">
        <div class="review-top">
          <span class="avatar">{{ r.author ? r.author[0] : '?' }}</span>
          <div class="review-meta">
            <strong class="author">{{ r.author }}</strong>
            <div class="review-stars" v-if="r.rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ 'star--full': i <= r.rating }">★</span>
            </div>
          </div>
          <span v-if="!r.approved" class="badge-pending">На проверке</span>
        </div>

        <template v-if="editingId === r.id">
          <div class="star-picker" style="margin-bottom:10px">
            <button v-for="i in 5" :key="i" class="star-pick" :class="{ 'star-pick--lit': i <= editRating }" @click="editRating = i">★</button>
          </div>
          <textarea v-model="editText" class="edit-textarea"></textarea>
          <div class="edit-actions">
            <button class="btn-save-edit" @click="saveEdit(r.id)">Сохранить</button>
            <button class="btn-cancel-edit" @click="cancelEdit">Отмена</button>
          </div>
        </template>
        <template v-else>
          <p class="review-text">{{ r.text }}</p>
          <div class="review-actions" v-if="(reviewerLogin && r.login === reviewerLogin) || isAdmin">
            <button v-if="reviewerLogin && r.login === reviewerLogin" class="btn-action-sm btn-edit-sm" @click="startEdit(r)">Изменить</button>
            <button class="btn-action-sm btn-del-sm" @click="onDelete(r.id)">Удалить</button>
          </div>
        </template>
      </div>
    </template>

    <p v-else class="empty">Отзывов пока нет. Будьте первым!</p>
  </div>
</template>

<style scoped>
.reviews { padding-top: 18px; display: flex; flex-direction: column; gap: 0; }

/* Средний рейтинг */
.rating-summary { display: flex; align-items: center; gap: 12px; padding: 14px 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 4px; flex-wrap: wrap; }
.rating-avg { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 400; line-height: 1; }
.rating-count { font-size: 11px; color: var(--gray-mid); letter-spacing: 0.06em; }
.review-sort { margin-left: auto; }
.sort-select { appearance: none; border: 1px solid var(--border); padding: 7px 28px 7px 12px; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--black); background: var(--white) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 8px center; cursor: pointer; }
.sort-select:focus { outline: none; border-color: var(--black); }

/* Звёзды отображение */
.stars-row { display: flex; gap: 2px; }
.star { font-size: 16px; color: #ddd; }
.star--full { color: #222; }
.star--half { color: #222; }

/* Выбор звёзд в форме */
.star-picker { display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
.star-pick { background: none; border: none; font-size: 28px; color: #ddd; cursor: pointer; padding: 0; line-height: 1; transition: color .1s; }
.star-pick--lit { color: #222; }
.star-pick-label { font-size: 11px; color: var(--gray-mid); letter-spacing: 0.08em; text-transform: uppercase; margin-left: 8px; }

/* Форма */
.add-review { margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid var(--border); }
.add-title { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 14px; }
.add-textarea { width: 100%; min-height: 90px; border: 1px solid var(--border); padding: 11px 13px; font-size: 13px; font-family: 'Montserrat', sans-serif; color: var(--black); resize: vertical; transition: border-color .2s; box-sizing: border-box; background: var(--white); }
.add-textarea:focus { outline: none; border-color: var(--black); }
.add-error { font-size: 11px; color: #e53935; margin: 6px 0; }
.btn-submit { margin-top: 10px; padding: 10px 24px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: background .2s; }
.btn-submit:hover { background: #333; }

.login-prompt { font-size: 13px; color: var(--gray-mid); margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
.login-link { color: var(--black); text-decoration: underline; text-underline-offset: 3px; }

/* Отзыв */
.review { padding: 16px 0; border-bottom: 1px solid var(--border); }
.review:last-child { border-bottom: none; }
.review-top { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
.avatar { width: 30px; height: 30px; background: var(--black); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
.review-meta { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.author { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.review-stars { display: flex; gap: 2px; }
.review-stars .star { font-size: 13px; color: #ddd; }
.review-stars .star--full { color: #222; }
.badge-pending { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #e89b00; border: 1px solid #e89b00; padding: 2px 7px; border-radius: 2px; margin-left: auto; flex-shrink: 0; }
.review-text { font-size: 13px; color: var(--gray-dark); line-height: 1.7; }

.review-actions { display: flex; gap: 8px; margin-top: 10px; }
.btn-action-sm { padding: 4px 12px; font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border: 1px solid; transition: all .2s; }
.btn-edit-sm { background: transparent; border-color: var(--border); color: var(--black); }
.btn-edit-sm:hover { border-color: var(--black); }
.btn-del-sm { background: transparent; border-color: #e53935; color: #e53935; }
.btn-del-sm:hover { background: #e53935; color: #fff; }

.edit-textarea { width: 100%; min-height: 80px; border: 1px solid var(--black); padding: 10px 12px; font-size: 13px; font-family: 'Montserrat', sans-serif; color: var(--black); resize: vertical; background: var(--white); box-sizing: border-box; }
.edit-textarea:focus { outline: none; }
.edit-actions { display: flex; gap: 8px; margin-top: 8px; }
.btn-save-edit { padding: 6px 16px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; }
.btn-cancel-edit { padding: 6px 16px; background: transparent; color: var(--black); border: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; }

.empty { font-size: 13px; color: var(--gray-light); padding-top: 18px; }
</style>
