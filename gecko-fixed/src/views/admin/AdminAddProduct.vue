<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { addProduct, goods } from '../../composebles/useGoods.js'

const ALL_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
const router = useRouter()

const imgModules = import.meta.glob('/src/assets/img/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' })
const defaultImages = Object.entries(imgModules)
  .filter(function(entry) { return !entry[0].includes('hero-banner') })
  .map(function(entry) { return entry[1] }).sort()

// ── Форма ─────────────────────────────────────────────────
const form = reactive({ name: '', price: '', image: '', description: '', specs: '', gender: 'women' })
const errors = reactive({ name: '', price: '', description: '' })
const hasErrors = ref(false)

const checkedSizes = reactive({ XXS: false, XS: true, S: true, M: true, L: true, XL: true, XXL: false })
const sizeStock = reactive({ XXS: 10, XS: 10, S: 10, M: 10, L: 10, XL: 10, XXL: 10 })
function onCheck(size) {
  if (!checkedSizes[size]) sizeStock[size] = 0
  else if (sizeStock[size] === 0) sizeStock[size] = 10
}

// ── Цвета ─────────────────────────────────────────────────
const colors = ref([])
const newColorName = ref('')
const newColorImage = ref('')
const newColorError = ref('')

function selectColorImg(url) { newColorImage.value = url }

function addColor() {
  newColorError.value = ''
  if (!newColorName.value.trim()) { newColorError.value = 'Введите название'; return }
  if (!newColorImage.value.trim()) { newColorError.value = 'Выберите фото'; return }
  colors.value.push({ name: newColorName.value.trim(), image: newColorImage.value.trim() })
  newColorName.value = ''
  newColorImage.value = ''
}
function removeColor(i) { colors.value.splice(i, 1) }

// ── Валидация и сохранение ─────────────────────────────────
function validate() {
  hasErrors.value = false
  errors.name = errors.price = errors.description = ''
  if (!form.name) { errors.name = 'Обязательное поле'; hasErrors.value = true }
  if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) { errors.price = 'Введите корректную цену'; hasErrors.value = true }
  if (!form.description) { errors.description = 'Обязательное поле'; hasErrors.value = true }
}

function submit() {
  validate()
  if (hasErrors.value) return
  const image = form.image || defaultImages[0]
  const sizes = [], stock = {}
  ALL_SIZES.forEach(function(size) {
    if (checkedSizes[size]) { sizes.push(size); stock[size] = Number(sizeStock[size]) || 0 }
  })
  let colorsToSave = colors.value
  if (colors.value.length === 0) {
    colorsToSave = [{ name: form.name, image: image }]
  }

  addProduct({
    name: form.name, price: Number(form.price), image, images: [image],
    colors: colorsToSave,
    gender: form.gender, description: form.description, specs: form.specs,
    sizes, stock, reviews: [],
  })
  const allGoods = goods.value
  if (allGoods.length) {
    router.push({ name: 'product-description', params: { id: allGoods[allGoods.length - 1].id } })
  } else {
    router.push({ name: 'admin-products' })
  }
}
</script>

<template>
  <div class="add-page">
    <h2 class="page-title">Добавить товар</h2>

    <form @submit.prevent="submit" class="add-layout">
      <!-- ЛЕВАЯ КОЛОНКА -->
      <div class="add-col">

        <div class="fg">
          <label>Название *</label>
          <input type="text" v-model="form.name" @input="errors.name = ''" />
          <p v-if="errors.name" class="ferr">{{ errors.name }}</p>
        </div>

        <div class="fg">
          <label>Категория</label>
          <div class="gtabs">
            <button type="button" :class="['gtab', { 'gtab--on': form.gender === 'women' }]" @click="form.gender = 'women'">Женский</button>
            <button type="button" :class="['gtab', { 'gtab--on': form.gender === 'men' }]" @click="form.gender = 'men'">Мужской</button>
          </div>
        </div>

        <div class="fg">
          <label>Цена (₽) *</label>
          <input type="text" v-model="form.price" @input="errors.price = ''" />
          <p v-if="errors.price" class="ferr">{{ errors.price }}</p>
        </div>

        <div class="fg">
          <label>Описание *</label>
          <textarea v-model="form.description" @input="errors.description = ''"></textarea>
          <p v-if="errors.description" class="ferr">{{ errors.description }}</p>
        </div>

        <div class="fg">
          <label>Состав и уход (через ·)</label>
          <input type="text" v-model="form.specs" />
        </div>

        <div class="form-actions">
          <button class="btn-save" type="submit">Добавить товар</button>
          <button class="btn-cancel" type="button" @click="router.push({ name: 'admin-products' })">Отмена</button>
        </div>
      </div>

      <!-- ПРАВАЯ КОЛОНКА -->
      <div class="add-col">

        <!-- БЛОК 1: Главное фото -->
        <div class="right-section">
          <p class="right-title">Главное фото <span class="block-hint">— отображается в каталоге</span></p>
          <div class="main-photo-preview">
            <img v-if="form.image" :src="form.image" class="main-photo-img" />
            <div v-else class="main-photo-empty">Фото не выбрано</div>
          </div>
          <div class="img-picker">
            <img v-for="img in defaultImages" :key="img" :src="img" :class="['picker-img', { sel: form.image === img }]" @click="form.image = img" />
          </div>
          <p class="hint">Или вставьте URL:</p>
          <input type="text" v-model="form.image" placeholder="https://..." />
        </div>

        <!-- БЛОК 2: Варианты цвета -->
        <div class="right-section">
          <p class="right-title">Варианты цвета</p>
          <div v-if="colors.length" class="colors-list">
            <div v-for="(c, i) in colors" :key="i" class="color-item">
              <img :src="c.image" class="color-img" />
              <span class="color-name">{{ c.name }}</span>
              <button type="button" class="btn-del-sm" @click="removeColor(i)">✕</button>
            </div>
          </div>
          <div class="color-add">
            <input type="text" v-model="newColorName" placeholder="Название цвета" class="sub-input" @input="newColorError = ''" />
            <div v-if="newColorImage" class="selected-color-preview">
              <img :src="newColorImage" class="selected-color-preview__img" />
              <span class="selected-color-preview__label">Выбранное фото цвета</span>
            </div>
            <p class="picker-title">Фото из папки img</p>
            <div class="asset-picker">
              <img
                v-for="img in defaultImages"
                :key="img"
                :src="img"
                :class="['asset-picker__img', { 'asset-picker__img--active': newColorImage === img }]"
                @click="selectColorImg(img)"
              />
            </div>
            <p class="hint">Или URL фото:</p>
            <input type="text" v-model="newColorImage" placeholder="https://..." class="sub-input" @input="newColorError = ''" />
            <button type="button" class="btn-add-sm" @click="addColor">+ Добавить цвет</button>
            <p v-if="newColorError" class="ferr">{{ newColorError }}</p>
          </div>
        </div>

        <!-- Размеры -->
        <div class="right-section">
          <p class="right-title">Размеры и количество</p>
          <div class="size-rows">
            <div v-for="size in ALL_SIZES" :key="size" class="size-row">
              <label class="check-label">
                <input type="checkbox" v-model="checkedSizes[size]" @change="onCheck(size)" class="check-input" />
                <span class="size-tag" :class="{ 'size-tag--on': checkedSizes[size] }">{{ size }}</span>
              </label>
              <div v-if="checkedSizes[size]" class="stock-wrap">
                <input type="number" v-model="sizeStock[size]" min="0" class="stock-input" />
                <span class="stock-unit">шт.</span>
              </div>
              <span v-else class="stock-none">— недоступен</span>
            </div>
          </div>
        </div>

      </div>
    </form>
  </div>
</template>

<style scoped>
.add-page { padding: 40px 48px 60px; max-width: 1300px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 400; margin-bottom: 40px; }

.add-layout { display: grid; grid-template-columns: 55% 1fr; gap: 64px; align-items: start; }

/* Поля */
.fg { margin-bottom: 28px; }
.fg label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 10px; }
.ferr { font-size: 11px; color: #e53935; margin-top: 5px; }
.hint { font-size: 11px; color: var(--gray-light); margin-bottom: 8px; }

input[type="text"], input[type="number"], textarea {
  width: 100%; border: 1px solid var(--border); padding: 13px 16px;
  font-size: 13px; font-family: "Montserrat", sans-serif; color: var(--black);
  background: var(--white); transition: border-color .2s; box-sizing: border-box;
}
input:focus, textarea:focus { outline: none; border-color: var(--black); }
textarea { resize: vertical; min-height: 110px; }

/* Категория */
.gtabs { display: flex; border: 1px solid var(--border); width: fit-content; }
.gtab { padding: 10px 28px; background: transparent; border: none; border-right: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); cursor: pointer; transition: all .2s; }
.gtab:last-child { border-right: none; }
.gtab--on { background: var(--black); color: var(--white); }
.gtab:hover:not(.gtab--on) { color: var(--black); }

/* Пикер изображений */
.img-picker { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.img-picker img { width: 60px; height: 78px; object-fit: cover; cursor: pointer; border: 2px solid transparent; transition: border-color .15s; }
.img-picker img.sel { border-color: var(--black); }
.picker-img { width: 60px; height: 78px; object-fit: cover; cursor: pointer; border: 2px solid transparent; transition: border-color .15s; }
.picker-img.sel { border-color: var(--black); }
.main-photo-preview { margin-bottom: 14px; }
.main-photo-img { width: 100%; max-height: 180px; object-fit: contain; border: 1px solid var(--border); background: var(--gray-bg); display: block; }
.main-photo-empty { height: 80px; border: 1px dashed var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--gray-light); }
.block-hint { font-size: 10px; font-weight: 400; letter-spacing: 0.04em; text-transform: none; color: var(--gray-light); }

/* Кнопки */
.form-actions { display: flex; gap: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
.btn-save { padding: 13px 36px; background: var(--black); color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; }
.btn-save:hover { background: #222; }
.btn-cancel { padding: 13px 36px; background: transparent; color: var(--black); border: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; }
.btn-cancel:hover { border-color: var(--black); }

/* Правая колонка */
.right-section { margin-bottom: 0; padding: 0 0 32px; border-bottom: 1px solid var(--border); margin-bottom: 32px; }
.right-section:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
.right-title { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 16px; }

/* Цвета */
.colors-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.color-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f8f8f8; border-left: 3px solid var(--border); }
.color-img { width: 44px; height: 56px; object-fit: cover; flex-shrink: 0; }
.color-name { flex: 1; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
.btn-del-sm { background: transparent; border: 1px solid #e53935; color: #e53935; padding: 3px 8px; cursor: pointer; transition: all .2s; }
.btn-del-sm:hover { background: #e53935; color: #fff; }
.color-add { display: flex; flex-direction: column; gap: 8px; }
.picker-title { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-mid); margin-top: 2px; }
.asset-picker { display: flex; flex-wrap: wrap; gap: 10px; }
.asset-picker__img { width: 58px; height: 74px; object-fit: cover; cursor: pointer; border: 2px solid transparent; transition: border-color .15s, transform .15s; background: var(--gray-bg); }
.asset-picker__img:hover { transform: translateY(-1px); }
.asset-picker__img--active { border-color: var(--black); }
.selected-color-preview { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border: 1px solid var(--border); background: #fafafa; }
.selected-color-preview__img { width: 44px; height: 56px; object-fit: cover; flex-shrink: 0; }
.selected-color-preview__label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-mid); }
.sub-input { border: 1px solid var(--border); padding: 9px 12px; font-family: 'Montserrat', sans-serif; font-size: 12px; box-sizing: border-box; width: 100%; }
.sub-input:focus { outline: none; border-color: var(--black); }
.btn-add-sm { align-self: flex-start; padding: 9px 20px; background: transparent; border: 1px solid var(--black); color: var(--black); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all .2s; }
.btn-add-sm:hover { background: var(--black); color: #fff; }

/* Размеры */
.size-rows { border: 1px solid var(--border); }
.size-row { display: flex; align-items: center; gap: 20px; padding: 11px 16px; border-bottom: 1px solid #f0f0f0; }
.size-row:last-child { border-bottom: none; }
.check-label { display: flex; align-items: center; gap: 10px; cursor: pointer; min-width: 80px; }
.check-input { width: 15px; height: 15px; accent-color: var(--black); cursor: pointer; flex-shrink: 0; }
.size-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: var(--gray-light); }
.size-tag--on { color: var(--black); }
.stock-wrap { display: flex; align-items: center; gap: 8px; }
.stock-input { width: 68px !important; padding: 7px 10px !important; text-align: center; }
.stock-unit { font-size: 11px; color: var(--gray-mid); }
.stock-none { font-size: 11px; color: var(--gray-light); font-style: italic; }
</style>
