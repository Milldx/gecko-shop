<script setup>
import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {

  getProductById, updateProduct,
  addProductImage, removeProductImage, updateProductImage,
  addColor, removeColor, updateColor,
  addColorImage, removeColorImage
} from '../composebles/useGoods.js'

function sizesInclude(sizeArray, sizeValue) {
  for (let si = 0; si < sizeArray.length; si = si + 1) {
    if (sizeArray[si] === sizeValue) return true
  }
  return false
}


const route = useRoute()
const router = useRouter()

const ALL_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

const imgModules = import.meta.glob('/src/assets/img/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' })
const defaultImages = Object.entries(imgModules)
  .filter(function(entry) { return !entry[0].includes('hero-banner') })
  .map(function(entry) { return entry[1] })
  .sort()

const productId = route.params.id
const product = getProductById(productId)
if (!product) router.push({ name: 'admin-products' })

// ── Форма ──────────────────────────────────────────────────────────────
const form = reactive({
  name: product.name,
  price: product.price,
  image: product.image,
  description: product.description,
  specs: product.specs,
  gender: product.gender || 'women',
})

const errors = reactive({ name: '', price: '', description: '' })

function validate() {
  errors.name = ''
  errors.price = ''
  errors.description = ''
  let ok = true
  if (!form.name.trim()) { errors.name = 'Название обязательно'; ok = false }
  if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
    errors.price = 'Введите корректную цену'
    ok = false
  }
  if (!form.description.trim()) { errors.description = 'Описание обязательно'; ok = false }
  return ok
}

// ── Размеры ────────────────────────────────────────────────────────────
const checkedSizes = reactive({})
const sizeStock = reactive({})

for (let sizeIndex = 0; sizeIndex < ALL_SIZES.length; sizeIndex++) {
  const size = ALL_SIZES[sizeIndex]
  if (product.stock && product.stock[size] !== undefined) {
    checkedSizes[size] = true
    sizeStock[size] = product.stock[size]
  } else if (product.sizes && sizesInclude(product.sizes, size)) {
    checkedSizes[size] = true
    sizeStock[size] = 10
  } else {
    checkedSizes[size] = false
    sizeStock[size] = 0
  }
}

function onCheck(size) {
  if (!checkedSizes[size]) {
    sizeStock[size] = 0
  } else if (sizeStock[size] === 0) {
    sizeStock[size] = 10
  }
}

// ── Подтверждение удаления (без браузерного confirm) ───────────────────
const confirmAction = ref(null)

function askConfirm(type, label, index, colorIndex, imgIndex) {
  confirmAction.value = { type, label, index, colorIndex, imgIndex }
}

function doConfirm() {
  if (!confirmAction.value) return
  const a = confirmAction.value
  if (a.type === 'photo') removeProductImage(productId, a.index)
  if (a.type === 'color') removeColor(productId, a.index)
  if (a.type === 'colorPhoto') removeColorImage(productId, a.colorIndex, a.imgIndex)
  confirmAction.value = null
}

function cancelConfirm() {
  confirmAction.value = null
}

// ── Фото товара ────────────────────────────────────────────────────────
const editingImgIndex = ref(null)
const editingImgUrl = ref('')
const newImgUrl = ref('')
const newImgError = ref('')

const currentImages = computed(function() {
  const p = getProductById(productId)
  if (!p) return []
  if (p.images && p.images.length) return p.images
  if (p.image) return [p.image]
  return []
})

function startEditImg(i) {
  editingImgIndex.value = i
  editingImgUrl.value = currentImages.value[i] || ''
}

function saveEditImg() {
  if (!editingImgUrl.value.trim()) return
  updateProductImage(productId, editingImgIndex.value, editingImgUrl.value.trim())
  editingImgIndex.value = null
}

function removeImg(i) {
  askConfirm('photo', 'Удалить фото товара?', i, null, null)
}

function addImg() {
  newImgError.value = ''
  const url = newImgUrl.value.trim()
  if (!url) { newImgError.value = 'Введите URL фотографии'; return }
  addProductImage(productId, url)
  newImgUrl.value = ''
}

// ── Цвета ──────────────────────────────────────────────────────────────
const editingColorIndex = ref(null)
const editingColor = reactive({ name: '', image: '' })
const newColor = reactive({ name: '', image: '' })
const newColorError = ref('')
const colorNewImg = ref({})

const currentColors = computed(function() {
  const p = getProductById(productId)
  if (!p || !p.colors) return []
  return p.colors
})

function startEditColor(i) {
  editingColorIndex.value = i
  editingColor.name = currentColors.value[i].name
  editingColor.image = currentColors.value[i].image
}

function saveEditColor() {
  if (!editingColor.name.trim() || !editingColor.image.trim()) return
  updateColor(productId, editingColorIndex.value, {
    name: editingColor.name.trim(),
    image: editingColor.image.trim(),
    images: currentColors.value[editingColorIndex.value].images || []
  })
  editingColorIndex.value = null
}

function removeColorItem(i) {
  askConfirm('color', 'Удалить цвет?', i, null, null)
}

function addColorItem() {
  newColorError.value = ''
  if (!newColor.name.trim()) { newColorError.value = 'Введите название цвета'; return }
  if (!newColor.image.trim()) { newColorError.value = 'Введите URL изображения'; return }
  addColor(productId, { name: newColor.name.trim(), image: newColor.image.trim(), images: [] })
  newColor.name = ''
  newColor.image = ''
}

function getColorImages(ci) {
  const p = getProductById(productId)
  if (!p || !p.colors || !p.colors[ci]) return []
  return p.colors[ci].images || []
}

function addImgToColor(ci) {
  const url = (colorNewImg.value[ci] || '').trim()
  if (!url) return
  addColorImage(productId, ci, url)
  colorNewImg.value[ci] = ''
}

function removeImgFromColor(ci, imgIndex) {
  askConfirm('colorPhoto', 'Удалить фото?', null, ci, imgIndex)
}

// ── Сохранение ─────────────────────────────────────────────────────────
const savedToast = ref(false)

function save() {
  if (!validate()) return

  const sizes = []
  const stock = {}
  for (let sizeIndex = 0; sizeIndex < ALL_SIZES.length; sizeIndex++) {
    const size = ALL_SIZES[sizeIndex]
    if (checkedSizes[size]) {
      sizes.push(size)
      stock[size] = Number(sizeStock[size]) || 0
    }
  }

  updateProduct(productId, {
    name: form.name.trim(),
    price: Number(form.price),
    image: form.image,
    description: form.description.trim(),
    specs: form.specs,
    gender: form.gender,
    sizes: sizes,
    stock: stock,
  })

  savedToast.value = true
  setTimeout(function() {
    savedToast.value = false
  }, 2000)
}
</script>

<template>
  <div class="edit-page">

    <!-- Тост -->
      <transition name="toast-fade">
        <div v-if="savedToast" class="toast-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Изменения сохранены
        </div>
      </transition>

    <button class="back-btn" @click="router.push({ name: 'admin-products' })">← Список товаров</button>
    <h2 class="page-title">Редактировать товар</h2>

    <div class="edit-layout">

      <!-- ── КОЛОНКА 1: Основные поля ── -->
      <div class="edit-col">
        <div class="col-inner">

          <div class="col-header">Основные данные</div>

          <div class="form-group">
            <label>Название *</label>
            <input type="text" v-model="form.name" @input="errors.name = ''" :class="{ 'input-error': errors.name }" />
            <p v-if="errors.name" class="field-err">{{ errors.name }}</p>
          </div>

          <div class="form-group">
            <label>Цена (₽) *</label>
            <input type="text" v-model="form.price" @input="errors.price = ''" :class="{ 'input-error': errors.price }" />
            <p v-if="errors.price" class="field-err">{{ errors.price }}</p>
          </div>

          <div class="form-group">
            <label>Категория</label>
            <div class="gender-tabs">
              <button :class="['gender-tab', { 'gender-tab--active': form.gender === 'women' }]" @click="form.gender = 'women'">Женский</button>
              <button :class="['gender-tab', { 'gender-tab--active': form.gender === 'men' }]" @click="form.gender = 'men'">Мужской</button>
            </div>
          </div>

          <div class="form-group">
            <label>Описание *</label>
            <textarea v-model="form.description" @input="errors.description = ''" :class="{ 'input-error': errors.description }" rows="6"></textarea>
            <p v-if="errors.description" class="field-err">{{ errors.description }}</p>
          </div>

          <div class="form-group">
            <label>Состав и уход <span class="label-hint">(через ·)</span></label>
            <input type="text" v-model="form.specs" placeholder="60% хлопок · Машинная стирка 30°С" />
          </div>

          <div class="col-header" style="margin-top: 8px;">Размеры и остатки</div>

          <div class="size-rows">
            <div v-for="size in ALL_SIZES" :key="size" class="size-row">
              <label class="check-label">
                <input type="checkbox" v-model="checkedSizes[size]" @change="onCheck(size)" class="check-input" />
                <span class="size-tag" :class="{ 'size-tag--active': checkedSizes[size] }">{{ size }}</span>
              </label>
              <div v-if="checkedSizes[size]" class="stock-input-wrap">
                <input type="number" v-model="sizeStock[size]" min="0" class="stock-input" />
                <span class="stock-unit">шт.</span>
              </div>
              <span v-else class="stock-none">— недоступен</span>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-save" @click="save">Сохранить изменения</button>
            <button class="btn-cancel" @click="router.push({ name: 'admin-products' })">Отмена</button>
          </div>

        </div>
      </div>

      <!-- ── КОЛОНКА 2: Главное фото ── -->
      <div class="edit-col edit-col--no-scroll">
        <div class="col-inner">

          <div class="col-header">Главное фото <span class="col-header-hint">— каталог и карточка товара</span></div>

          <div class="main-preview">
            <img v-if="form.image" :src="form.image" class="main-preview-img" />
            <div v-else class="main-preview-empty">Фото не выбрано</div>
          </div>

          <p class="picker-label">Выберите из библиотеки:</p>
          <div class="img-picker">
            <img
              v-for="img in defaultImages"
              :key="img"
              :src="img"
              :class="['picker-img', { 'picker-img--active': form.image === img }]"
              @click="form.image = img"
            />
          </div>

          <p class="picker-label" style="margin-top: 14px;">Или вставьте свой URL:</p>
          <input type="text" v-model="form.image" placeholder="https://..." class="url-input" />

        </div>
      </div>

      <!-- ── КОЛОНКА 3: Варианты цвета ── -->
      <div class="edit-col">
        <div class="col-inner">

          <div class="col-header">Варианты цвета</div>

          <!-- Список существующих цветов -->
          <div v-if="currentColors.length === 0" class="empty-hint">Нет добавленных цветов</div>

          <div v-for="(color, ci) in currentColors" :key="ci" class="color-block">

            <!-- Шапка цвета -->
            <div class="color-block-head">
              <img :src="color.image" class="color-thumb" />
              <div class="color-block-meta">
                <span class="color-name">{{ color.name }}</span>
                <div class="color-btns">
                  <button class="btn-sm btn-sm--edit" @click="startEditColor(ci)">Изменить</button>
                  <button class="btn-sm btn-sm--del" @click="removeColorItem(ci)">✕</button>
                </div>
              </div>
            </div>

            <!-- Редактирование цвета -->
            <div v-if="editingColorIndex === ci" class="color-edit-form">
              <input type="text" v-model="editingColor.name" placeholder="Название цвета" class="url-input" />
              <input type="text" v-model="editingColor.image" placeholder="Главное фото (URL)" class="url-input" />
              <div class="color-edit-actions">
                <button class="btn-sm btn-sm--save" @click="saveEditColor">Сохранить</button>
                <button class="btn-sm btn-sm--cancel" @click="editingColorIndex = null">Отмена</button>
              </div>
            </div>

            <!-- Галерея фото этого цвета -->
            <div class="color-gallery">
              <p class="gallery-title">Галерея цвета «{{ color.name }}»</p>

              <div v-if="getColorImages(ci).length === 0" class="empty-hint-sm">
                Нет фото — в карусели будет показано главное фото цвета
              </div>

              <div v-for="(img, ii) in getColorImages(ci)" :key="ii" class="gallery-item">
                <img :src="img" class="gallery-thumb" />
                <div class="gallery-item-info">
                  <span class="gallery-num">Фото {{ ii + 1 }}</span>
                  <button class="btn-sm btn-sm--del" @click="removeImgFromColor(ci, ii)">✕</button>
                </div>
              </div>

              <div class="add-row">
                <input type="text" v-model="colorNewImg[ci]" placeholder="URL фото для этого цвета..." class="url-input url-input--flex" />
                <button class="btn-add" @click="addImgToColor(ci)">+ Добавить</button>
              </div>
            </div>

          </div>

          <!-- Добавить новый цвет -->
          <div class="add-color-form">
            <div class="col-header" style="margin-top: 4px;">Добавить цвет</div>
            <input type="text" v-model="newColor.name" placeholder="Название (напр. Тёмно-синий)" class="url-input" @input="newColorError = ''" />
            <input type="text" v-model="newColor.image" placeholder="Главное фото цвета (URL)" class="url-input" @input="newColorError = ''" />
            <p v-if="newColorError" class="field-err">{{ newColorError }}</p>
            <button class="btn-add-primary" @click="addColorItem">+ Добавить цвет</button>
          </div>

        </div>
      </div>

    </div>
  </div>

  <!-- Модал подтверждения удаления -->
  <div v-if="confirmAction" class="confirm-overlay" @click.self="cancelConfirm">
    <div class="confirm-box">
      <p class="confirm-text">{{ confirmAction.label }}</p>
      <div class="confirm-btns">
        <button class="confirm-btn-yes" @click="doConfirm">Удалить</button>
        <button class="confirm-btn-no" @click="cancelConfirm">Отмена</button>
      </div>
    </div>
  </div>

</template>

<style scoped>
/* ── Страница ── */
.edit-page {
  padding: 40px 20px 80px;
}

.back-btn {
  background: none;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gray-mid);
  cursor: pointer;
  margin-bottom: 28px;
  padding: 0;
  transition: color .2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.back-btn:hover { color: var(--black); }

.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 38px;
  font-weight: 400;
  margin-bottom: 36px;
  letter-spacing: 0.02em;
}

/* ── Сетка 3 колонки ── */
.edit-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  align-items: start;
  border: 1px solid var(--border);
}

.edit-col {
  border-right: 1px solid var(--border);
}
.edit-col:last-child { border-right: none; }

.col-inner {
  padding: 28px 28px 32px;
}

/* ── Заголовок секции ── */
.col-header {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gray-mid);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.col-header-hint {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: none;
  color: var(--gray-light);
}

/* ── Поля формы ── */
.form-group {
  margin-bottom: 22px;
}

label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gray-mid);
  margin-bottom: 8px;
}

.label-hint {
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0.04em;
  color: var(--gray-light);
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  border: 1px solid var(--border);
  padding: 11px 13px;
  font-size: 13px;
  font-family: 'Montserrat', sans-serif;
  color: var(--black);
  background: var(--white);
  transition: border-color .2s;
  box-sizing: border-box;
}
input[type="text"]:focus,
input[type="number"]:focus,
textarea:focus { outline: none; border-color: var(--black); }
textarea { resize: vertical; min-height: 120px; }

.input-error { border-color: #e53935 !important; }
.field-err { font-size: 11px; color: #e53935; margin-top: 5px; }

/* ── Категория ── */
.gender-tabs {
  display: flex;
  border: 1px solid var(--border);
  width: fit-content;
}
.gender-tab {
  padding: 10px 24px;
  background: transparent;
  border: none;
  border-right: 1px solid var(--border);
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gray-mid);
  cursor: pointer;
  transition: all .2s;
}
.gender-tab:last-child { border-right: none; }
.gender-tab--active { background: var(--black); color: var(--white); }
.gender-tab:hover:not(.gender-tab--active) { color: var(--black); }

/* ── Размеры ── */
.size-rows {
  border: 1px solid var(--border);
  margin-bottom: 28px;
}
.size-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--gray-bg);
}
.size-row:last-child { border-bottom: none; }
.check-label { display: flex; align-items: center; gap: 8px; cursor: pointer; min-width: 72px; }
.check-input { width: 14px; height: 14px; accent-color: var(--black); cursor: pointer; flex-shrink: 0; }
.size-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: var(--gray-light); transition: color .2s; }
.size-tag--active { color: var(--black); }
.stock-input-wrap { display: flex; align-items: center; gap: 6px; }
.stock-input { width: 64px; border: 1px solid var(--border); padding: 6px 10px; font-size: 13px; font-family: 'Montserrat', sans-serif; color: var(--black); text-align: center; background: var(--white); transition: border-color .2s; }
.stock-input:focus { outline: none; border-color: var(--black); }
.stock-unit { font-size: 11px; color: var(--gray-mid); }
.stock-none { font-size: 11px; color: var(--gray-light); font-style: italic; }

/* ── Кнопки сохранения ── */
.form-actions {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}
.btn-save {
  padding: 13px 32px;
  background: var(--black);
  color: var(--white);
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background .2s;
}
.btn-save:hover { background: #333; }
.btn-cancel {
  padding: 13px 32px;
  background: transparent;
  color: var(--black);
  border: 1px solid var(--border);
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color .2s;
}
.btn-cancel:hover { border-color: var(--black); }

/* ── Главное фото ── */
.main-preview {
  margin-bottom: 16px;
  border: 1px solid var(--border);
  background: var(--gray-bg);
}
.main-preview-img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
}
.main-preview-empty {
  aspect-ratio: 3/4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--gray-light);
  font-style: italic;
}

.picker-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-mid);
  margin-bottom: 10px;
}

.img-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;
}
.picker-img {
  width: 58px;
  height: 74px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color .15s;
}
.picker-img--active { border-color: var(--black); }

.url-input {
  width: 100%;
  border: 1px solid var(--border);
  padding: 10px 12px;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  color: var(--black);
  background: var(--white);
  box-sizing: border-box;
  transition: border-color .2s;
  display: block;
  margin-bottom: 8px;
}
.url-input:focus { outline: none; border-color: var(--black); }
.url-input--flex { flex: 1; min-width: 0; margin-bottom: 0; }

/* ── Цвета ── */
.color-block {
  border: 1px solid var(--border);
  margin-bottom: 12px;
  overflow: hidden;
}

.color-block-head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  background: var(--gray-bg);
}

.color-thumb {
  width: 44px;
  height: 56px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.color-block-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-name {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--black);
}

.color-btns {
  display: flex;
  gap: 6px;
}

.color-edit-form {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid var(--border);
  background: #fafafa;
}

.color-edit-actions {
  display: flex;
  gap: 8px;
}

/* ── Галерея цвета ── */
.color-gallery {
  padding: 12px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gallery-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-mid);
}

.gallery-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 10px;
  background: var(--gray-bg);
  border-left: 2px solid var(--border);
}

.gallery-thumb {
  width: 40px;
  height: 52px;
  object-fit: cover;
  flex-shrink: 0;
}

.gallery-item-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gallery-num {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-mid);
}

.add-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-color-form {
  border-top: 2px solid var(--border);
  padding-top: 16px;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Маленькие кнопки ── */
.btn-sm {
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 5px 11px;
  cursor: pointer;
  transition: all .2s;
  border: 1px solid;
  white-space: nowrap;
}
.btn-sm--edit { background: transparent; border-color: var(--border); color: var(--black); }
.btn-sm--edit:hover { border-color: var(--black); }
.btn-sm--del { background: transparent; border-color: #e53935; color: #e53935; }
.btn-sm--del:hover { background: #e53935; color: #fff; }
.btn-sm--save { background: var(--black); border-color: var(--black); color: #fff; }
.btn-sm--save:hover { background: #333; }
.btn-sm--cancel { background: transparent; border-color: var(--border); color: var(--black); }
.btn-sm--cancel:hover { border-color: var(--black); }

.btn-add {
  padding: 10px 16px;
  background: transparent;
  border: 1px solid var(--black);
  color: var(--black);
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  transition: all .2s;
  flex-shrink: 0;
}
.btn-add:hover { background: var(--black); color: #fff; }

.btn-add-primary {
  padding: 12px 20px;
  background: var(--black);
  border: none;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background .2s;
  align-self: flex-start;
}
.btn-add-primary:hover { background: #333; }

.empty-hint {
  font-size: 12px;
  color: var(--gray-light);
  font-style: italic;
  padding: 8px 0;
}
.empty-hint-sm {
  font-size: 11px;
  color: var(--gray-light);
  font-style: italic;
}

/* ── Тост ── */
.toast-success {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--black);
  color: var(--white);
  padding: 14px 28px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 9999;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
}
.toast-fade-enter-active { transition: opacity .25s ease, transform .25s ease; }
.toast-fade-leave-active { transition: opacity .2s ease, transform .2s ease; }
.toast-fade-enter-from { opacity: 0; transform: translateX(-50%) translateY(12px); }
.toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }

/* ── Подтверждение удаления ── */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-box {
  background: var(--white);
  padding: 32px 36px;
  max-width: 340px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.confirm-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  text-align: center;
}
.confirm-btns { display: flex; gap: 10px; }
.confirm-btn-yes {
  flex: 1;
  padding: 12px;
  background: #e53935;
  color: #fff;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background .2s;
}
.confirm-btn-yes:hover { background: #c62828; }
.confirm-btn-no {
  flex: 1;
  padding: 12px;
  background: transparent;
  color: var(--black);
  border: 1px solid var(--border);
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color .2s;
}
.confirm-btn-no:hover { border-color: var(--black); }
</style>
