<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { goods, approveReview, deleteReview } from '../../composebles/useGoods.js'

const router = useRouter()

// Сортировка
const sortBy = ref('new') // new | old | rating_asc | rating_desc

const sortOptions = [
  { value: 'new', label: 'Сначала новые' },
  { value: 'old', label: 'Сначала старые' },
  { value: 'rating_asc', label: 'По рейтингу ↑' },
  { value: 'rating_desc', label: 'По рейтингу ↓' },
]

const allReviews = computed(function() {
  const result = []
  for (let goodsIndex = 0; goodsIndex < goods.value.length; goodsIndex++) {
    const p = goods.value[goodsIndex]
    if (!p.reviews) continue
    for (let reviewIndex = 0; reviewIndex < p.reviews.length; reviewIndex++) {
      result.push({ review: p.reviews[reviewIndex], product: p, index: reviewIndex })
    }
  }
  return result
})

function getReviewNum(id) {
  // r_1 -> 1, r_1710000000000 -> 1710000000000
  const n = Number(id.replace('r_', ''))
  if (isNaN(n)) return 0
  return n
}

function sortList(list) {
  const s = sortBy.value
  return list.slice().sort(function(reviewA, reviewB) {
    if (s === 'new') return getReviewNum(reviewB.review.id) - getReviewNum(reviewA.review.id)
    if (s === 'old') return getReviewNum(reviewA.review.id) - getReviewNum(reviewB.review.id)
    if (s === 'rating_asc') return (reviewA.review.rating || 0) - (reviewB.review.rating || 0)
    if (s === 'rating_desc') return (reviewB.review.rating || 0) - (reviewA.review.rating || 0)
    return 0
  })
}

const pending = computed(function() {
  return sortList(allReviews.value.filter(function(reviewItem) { return !reviewItem.review.approved }))
})

const approved = computed(function() {
  return sortList(allReviews.value.filter(function(reviewItem) { return reviewItem.review.approved }))
})

function onApprove(productId, reviewId) {
  approveReview(productId, reviewId)
}

const deleteTarget = ref(null)

function onDelete(productId, reviewId) {
  deleteTarget.value = { productId, reviewId }
}

function confirmDelete() {
  if (deleteTarget.value) {
    deleteReview(deleteTarget.value.productId, deleteTarget.value.reviewId)
    deleteTarget.value = null
  }
}

function stars(rating) {
  if (!rating) return '—'
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}
</script>

<template>
  <div class="mod-page">
    <!-- Модал подтверждения удаления -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal">
        <p class="modal-title">Удалить отзыв?</p>
        <p class="modal-sub">Это действие необратимо.</p>
        <div class="modal-actions">
          <button class="modal-btn-del" @click="confirmDelete">Удалить</button>
          <button class="modal-btn-cancel" @click="deleteTarget = null">Отмена</button>
        </div>
      </div>
    </div>
    <!-- Сортировка -->
    <div class="sort-bar">
      <span class="sort-label">Сортировка:</span>
      <div class="sort-tabs">
        <button
          v-for="opt in sortOptions"
          :key="opt.value"
          :class="['sort-tab', { 'sort-tab--active': sortBy === opt.value }]"
          @click="sortBy = opt.value"
        >{{ opt.label }}</button>
      </div>
    </div>

    <!-- На проверке -->
    <div class="section">
      <h3 class="section-title">
        На проверке
        <span v-if="pending.length" class="badge">{{ pending.length }}</span>
      </h3>
      <div v-if="pending.length === 0" class="empty">Нет отзывов на проверке</div>
      <div v-for="item in pending" :key="item.review.id" class="card card--pending">
        <div class="card-meta">
          <span class="product-name" @click="router.push({ name: 'product-description', params: { id: item.product.id } })">{{ item.product.name }}</span>
          <span class="sep">·</span>
          <span class="author">{{ item.review.author }}</span>
          <span v-if="item.review.rating" class="stars">{{ stars(item.review.rating) }}</span>
        </div>
        <p class="review-text">{{ item.review.text }}</p>
        <div class="card-actions">
          <button class="btn-approve" @click="onApprove(item.product.id, item.review.id)">✓ Одобрить</button>
          <button class="btn-delete" @click="onDelete(item.product.id, item.review.id)">Удалить</button>
        </div>
      </div>
    </div>

    <!-- Одобренные -->
    <div class="section">
      <h3 class="section-title">Опубликованные</h3>
      <div v-if="approved.length === 0" class="empty">Нет опубликованных отзывов</div>
      <div v-for="item in approved" :key="item.review.id" class="card card--approved">
        <div class="card-meta">
          <span class="product-name" @click="router.push({ name: 'product-description', params: { id: item.product.id } })">{{ item.product.name }}</span>
          <span class="sep">·</span>
          <span class="author">{{ item.review.author }}</span>
          <span v-if="item.review.rating" class="stars">{{ stars(item.review.rating) }}</span>
        </div>
        <p class="review-text">{{ item.review.text }}</p>
        <div class="card-actions">
          <button class="btn-delete" @click="onDelete(item.product.id, item.review.id)">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mod-page { display: flex; flex-direction: column; gap: 36px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; padding: 36px 40px; width: 340px; max-width: 95vw; }
.modal-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; margin-bottom: 8px; }
.modal-sub { font-size: 12px; color: var(--gray-mid); margin-bottom: 24px; }
.modal-actions { display: flex; gap: 10px; }
.modal-btn-del { flex: 1; padding: 11px; background: #e53935; color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; }
.modal-btn-del:hover { background: #c62828; }
.modal-btn-cancel { flex: 1; padding: 11px; background: transparent; color: var(--black); border: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; }
.modal-btn-cancel:hover { border-color: var(--black); }

.sort-bar { display: flex; align-items: center; gap: 14px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
.sort-label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); flex-shrink: 0; }
.sort-tabs { display: flex; border: 1px solid var(--border); }
.sort-tab { padding: 8px 16px; background: transparent; border: none; border-right: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gray-mid); cursor: pointer; transition: all .2s; white-space: nowrap; }
.sort-tab:last-child { border-right: none; }
.sort-tab--active { background: var(--black); color: var(--white); }
.sort-tab:hover:not(.sort-tab--active) { color: var(--black); }

.section-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
.badge { display: inline-flex; align-items: center; justify-content: center; background: #e89b00; color: #fff; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; min-width: 22px; height: 22px; border-radius: 50%; padding: 0 4px; }
.empty { font-size: 13px; color: var(--gray-light); padding: 16px 0; }

.card { border: 1px solid var(--border); padding: 16px 20px; margin-bottom: 10px; }
.card--pending { border-left: 3px solid #e89b00; }
.card--approved { border-left: 3px solid #2d7d2d; }

.card-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.product-name { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--black); cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
.sep { color: var(--gray-light); }
.author { font-size: 12px; font-weight: 600; color: var(--gray-dark); }
.stars { font-size: 13px; color: var(--black); letter-spacing: 1px; }

.review-text { font-size: 13px; color: var(--gray-dark); line-height: 1.7; margin-bottom: 12px; }

.card-actions { display: flex; gap: 8px; }
.btn-approve { padding: 6px 16px; background: #2d7d2d; color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background .2s; }
.btn-approve:hover { background: #1e5e1e; }
.btn-delete { padding: 6px 16px; background: transparent; color: #e53935; border: 1px solid #e53935; font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all .2s; }
.btn-delete:hover { background: #e53935; color: #fff; }
</style>
