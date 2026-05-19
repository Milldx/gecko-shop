<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { addProduct, goods } from '../../composebles/useGoods.js'

const ALL_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
const router = useRouter()

const imgModules = import.meta.glob('/src/assets/img/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' })
const imgNewModules = import.meta.glob('/src/assets/img-new/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' })
const imgSaleModules = import.meta.glob('/src/assets/img-sale/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' })
const imgCollectionModules = import.meta.glob('/src/assets/img-collection/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' })

function toImgList(modules) {
  return Object.entries(modules)
    .filter(function(e) { return !e[0].includes('hero-banner') })
    .map(function(e) { return e[1] }).sort()
}
const folderMap = {
  catalog: toImgList(imgModules),
  new: toImgList(imgNewModules),
  sale: toImgList(imgSaleModules),
  collection: toImgList(imgCollectionModules),
}
const FOLDER_LABELS = {
  catalog: 'Основной каталог (img)',
  new: 'Новинки (img-new)',
  sale: 'Распродажа (img-sale)',
  collection: 'Коллекция (img-collection)',
}
const selectedFolder = ref('catalog')
const currentImages = computed(function() { return folderMap[selectedFolder.value] || [] })

const form = reactive({
  name: '', price: '', image: '', description: '', composition: '', care: '', gender: 'women',
  pageCategory: 'none', salePrice: '',
})
const errors = reactive({ name: '', price: '', description: '' })
const hasErrors = ref(false)

const checkedSizes = reactive({ XXS: false, XS: true, S: true, M: true, L: true, XL: true, XXL: false })
const sizeStock = reactive({ XXS: 10, XS: 10, S: 10, M: 10, L: 10, XL: 10, XXL: 10 })
function onCheck(size) {
  if (!checkedSizes[size]) sizeStock[size] = 0
  else if (sizeStock[size] === 0) sizeStock[size] = 10
}

const colors = ref([])
const newColorName = ref('')
const newColorImage = ref('')
const newColorError = ref('')
const newColorGallery = ref([])   // доп. фото нового цвета
const newColorGalleryInput = ref('')

function selectColorImg(url) { newColorImage.value = url }

function addGalleryImg() {
  const url = newColorGalleryInput.value.trim()
  if (!url) return
  newColorGallery.value.push(url)
  newColorGalleryInput.value = ''
}
function removeGalleryImg(i) { newColorGallery.value.splice(i, 1) }

function addColorItem() {
  newColorError.value = ''
  if (!newColorName.value.trim()) { newColorError.value = 'Введите название'; return }
  if (!newColorImage.value.trim()) { newColorError.value = 'Выберите фото'; return }
  colors.value.push({
    name: newColorName.value.trim(),
    image: newColorImage.value.trim(),
    images: newColorGallery.value.slice(),
  })
  newColorName.value = ''
  newColorImage.value = ''
  newColorGallery.value = []
  newColorGalleryInput.value = ''
}
function removeColor(i) { colors.value.splice(i, 1) }

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
  const image = form.image || currentImages.value[0]
  const sizes = [], stock = {}
  ALL_SIZES.forEach(function(size) {
    if (checkedSizes[size]) { sizes.push(size); stock[size] = Number(sizeStock[size]) || 0 }
  })
  const colorsToSave = colors.value.length > 0 ? colors.value : [{ name: form.name, image: image }]
  addProduct({
    name: form.name, price: Number(form.price), image, images: [image],
    colors: colorsToSave, gender: form.gender,
    description: form.description, composition: form.composition.trim(), care: form.care.trim(),
    isNew: form.pageCategory === 'new',
    isSale: form.pageCategory === 'sale',
    salePrice: form.pageCategory === 'sale' && form.salePrice ? Number(form.salePrice) : null,
    isCollection: form.pageCategory === 'collection',
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
    <div class="edit-layout">

      <!-- КОЛ 1 -->
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
              <button type="button" :class="['gender-tab', { 'gender-tab--active': form.gender === 'women' }]" @click="form.gender = 'women'">Женский</button>
              <button type="button" :class="['gender-tab', { 'gender-tab--active': form.gender === 'men' }]" @click="form.gender = 'men'">Мужской</button>
            </div>
          </div>

          <div class="form-group">
            <label>Описание *</label>
            <textarea v-model="form.description" @input="errors.description = ''" :class="{ 'input-error': errors.description }" rows="5"></textarea>
            <p v-if="errors.description" class="field-err">{{ errors.description }}</p>
          </div>

          <div class="form-group">
            <label>Состав <span class="label-hint">(материалы через запятую)</span></label>
            <input type="text" v-model="form.composition" placeholder="60% хлопок, 40% полиэстер" />
          </div>

          <div class="form-group">
            <label>Уход <span class="label-hint">(инструкции через ·)</span></label>
            <input type="text" v-model="form.care" placeholder="Машинная стирка 30°C · Не отбеливать" />
          </div>

          <div class="form-group">
            <label>Раздел сайта</label>
            <div class="radio-group">
              <label class="radio-label"><input type="radio" v-model="form.pageCategory" value="none" class="radio-input" /><span>Основной каталог</span></label>
              <label class="radio-label"><input type="radio" v-model="form.pageCategory" value="new" class="radio-input" /><span>Новинки</span></label>
              <label class="radio-label"><input type="radio" v-model="form.pageCategory" value="collection" class="radio-input" /><span>Коллекция</span></label>
              <label class="radio-label"><input type="radio" v-model="form.pageCategory" value="sale" class="radio-input" /><span>SALE</span></label>
            </div>
          </div>

          <div v-if="form.pageCategory === 'sale'" class="form-group">
            <label>Цена со скидкой (₽) *</label>
            <input type="text" v-model="form.salePrice" placeholder="Например: 2490" />
            <p v-if="form.salePrice && Number(form.salePrice) >= Number(form.price)" class="field-err">Цена со скидкой должна быть меньше основной</p>
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
            <button class="btn-save" type="button" @click="submit">Добавить товар</button>
            <button class="btn-cancel" type="button" @click="router.push({ name: 'admin-products' })">Отмена</button>
          </div>
        </div>
      </div>

      <!-- КОЛ 2: Фото -->
      <div class="edit-col">
        <div class="col-inner">
          <div class="col-header">Главное фото <span class="col-header-hint">— каталог и карточка товара</span></div>
          <div class="main-preview">
            <img v-if="form.image" :src="form.image" class="main-preview-img" />
            <div v-else class="main-preview-empty">Фото не выбрано</div>
          </div>
          <p class="picker-label">Выберите из библиотеки:</p>
          <div class="folder-select-row"><select v-model="selectedFolder" class="folder-select"><option v-for="(label, key) in FOLDER_LABELS" :key="key" :value="key">{{ label }}</option></select></div>
          <div class="img-picker">
            <img v-for="img in currentImages" :key="img" :src="img" :class="['picker-img', { 'picker-img--active': form.image === img }]" @click="form.image = img" />
          </div>
          <p class="picker-label" style="margin-top:14px;">Или вставьте URL:</p>
          <input type="text" v-model="form.image" placeholder="https://..." class="url-input" />
        </div>
      </div>

      <!-- КОЛ 3: Цвета -->
      <div class="edit-col">
        <div class="col-inner">
          <div class="col-header">Варианты цвета</div>

          <div v-if="!colors.length" class="empty-hint">Нет добавленных цветов</div>
          <div v-for="(c, i) in colors" :key="i" class="color-block">
            <div class="color-block-head">
              <img :src="c.image" class="color-thumb" />
              <span class="color-block-name">{{ c.name }}</span>
              <button class="btn-del-color" @click="removeColor(i)">✕</button>
            </div>
            <div v-if="c.images && c.images.length" class="color-gallery-preview">
              <img v-for="(img, gi) in c.images" :key="gi" :src="img" class="gallery-preview-thumb" />
            </div>
          </div>

          <div class="col-header" style="margin-top:20px;">Добавить цвет</div>

          <div class="form-group">
            <label>Название цвета</label>
            <input type="text" v-model="newColorName" placeholder="Напр. Тёмно-синий" class="url-input" @input="newColorError = ''" />
          </div>

          <div class="form-group">
            <label>Главное фото цвета (URL)</label>
            <input type="text" v-model="newColorImage" placeholder="https://..." class="url-input" @input="newColorError = ''" />
          </div>

          <p class="picker-label">Фото из папки IMG:</p>
          <div class="folder-select-row"><select v-model="selectedFolder" class="folder-select"><option v-for="(label, key) in FOLDER_LABELS" :key="key" :value="key">{{ label }}</option></select></div>
          <div class="img-picker">
            <img v-for="img in currentImages" :key="'ci-' + img" :src="img" :class="['picker-img', { 'picker-img--active': newColorImage === img }]" @click="selectColorImg(img)" />
          </div>

          <div v-if="newColorImage" class="color-preview-row">
            <img :src="newColorImage" class="color-preview-img" />
            <span class="color-preview-label">Главное фото цвета</span>
          </div>

          <div class="gallery-section">
            <p class="picker-label" style="margin-top:14px;">Доп. фото галереи этого цвета</p>
            <div v-if="newColorGallery.length" class="gallery-added-list">
              <div v-for="(img, gi) in newColorGallery" :key="gi" class="gallery-added-item">
                <img :src="img" class="gallery-added-thumb" />
                <button class="btn-del-color" @click="removeGalleryImg(gi)">✕</button>
              </div>
            </div>
            <div class="gallery-input-row">
              <input
                type="text"
                v-model="newColorGalleryInput"
                placeholder="URL фото..."
                class="url-input url-input--flex"
                @keyup.enter="addGalleryImg"
              />
              <button class="btn-gallery-add" @click="addGalleryImg">+ Фото</button>
            </div>
            <div class="img-picker" style="margin-top:8px;">
              <img
                v-for="img in currentImages"
                :key="'gi-' + img"
                :src="img"
                :class="['picker-img', { 'picker-img--active': newColorGalleryInput === img }]"
                @click="newColorGalleryInput = img"
              />
            </div>
          </div>

          <p v-if="newColorError" class="field-err">{{ newColorError }}</p>
          <button class="btn-add-color" @click="addColorItem">+ Добавить цвет</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.add-page { padding: 0 0 60px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 400; margin-bottom: 32px; }
.edit-layout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; align-items: start; border: 1px solid var(--border); }
.edit-col { border-right: 1px solid var(--border); }
.edit-col:last-child { border-right: none; }
.col-inner { padding: 28px 28px 32px; }
.col-header { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.col-header-hint { font-size: 9px; font-weight: 400; letter-spacing: 0.04em; text-transform: none; color: var(--gray-light); }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 8px; }
.label-hint { font-size: 9px; font-weight: 400; letter-spacing: 0.04em; text-transform: none; color: var(--gray-light); }
.field-err { font-size: 11px; color: #e53935; margin-top: 5px; }
input[type="text"], input[type="number"], textarea { width: 100%; border: 1px solid var(--border); padding: 11px 14px; font-size: 13px; font-family: "Montserrat", sans-serif; color: var(--black); background: var(--white); transition: border-color .2s; box-sizing: border-box; }
input:focus, textarea:focus { outline: none; border-color: var(--black); }
textarea { resize: vertical; min-height: 100px; }
.input-error { border-color: #e53935 !important; }
.url-input { width: 100%; border: 1px solid var(--border); padding: 10px 12px; font-size: 12px; font-family: "Montserrat", sans-serif; color: var(--black); background: var(--white); box-sizing: border-box; }
.url-input:focus { outline: none; border-color: var(--black); }
.gender-tabs { display: flex; border: 1px solid var(--border); width: fit-content; }
.gender-tab { padding: 9px 22px; background: transparent; border: none; border-right: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-mid); cursor: pointer; transition: all .2s; }
.gender-tab:last-child { border-right: none; }
.gender-tab--active { background: var(--black); color: var(--white); }
.radio-group { display: flex; flex-direction: column; gap: 8px; }
.radio-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; }
.radio-input { width: 14px; height: 14px; accent-color: var(--black); cursor: pointer; flex-shrink: 0; }
.size-rows { border: 1px solid var(--border); margin-bottom: 20px; }
.size-row { display: flex; align-items: center; gap: 16px; padding: 9px 12px; border-bottom: 1px solid #f0f0f0; }
.size-row:last-child { border-bottom: none; }
.check-label { display: flex; align-items: center; gap: 8px; cursor: pointer; min-width: 72px; }
.check-input { width: 14px; height: 14px; accent-color: var(--black); cursor: pointer; flex-shrink: 0; }
.size-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: var(--gray-light); }
.size-tag--active { color: var(--black); }
.stock-input-wrap { display: flex; align-items: center; gap: 8px; }
.stock-input { width: 64px !important; padding: 6px 8px !important; text-align: center; }
.stock-unit { font-size: 11px; color: var(--gray-mid); }
.stock-none { font-size: 11px; color: var(--gray-light); font-style: italic; }
.form-actions { display: flex; gap: 10px; padding-top: 12px; border-top: 1px solid var(--border); margin-top: 4px; }
.btn-save { padding: 12px 28px; background: var(--black); color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }
.btn-save:hover { background: #222; }
.btn-cancel { padding: 12px 28px; background: transparent; color: var(--black); border: 1px solid var(--border); font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }
.btn-cancel:hover { border-color: var(--black); }
.main-preview { margin-bottom: 12px; border: 1px solid var(--border); background: var(--gray-bg); }
.main-preview-img { width: 100%; max-height: 200px; object-fit: contain; display: block; }
.main-preview-empty { height: 80px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--gray-light); }
.picker-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 8px; }
.img-picker { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
.picker-img { width: 52px; height: 68px; object-fit: cover; cursor: pointer; border: 2px solid transparent; transition: border-color .15s; }
.picker-img--active { border-color: var(--black); }
.picker-img:hover:not(.picker-img--active) { border-color: var(--gray-mid); }
.empty-hint { font-size: 12px; color: var(--gray-light); font-style: italic; padding: 4px 0 14px; }
.color-block { margin-bottom: 8px; }
.color-block-head { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: var(--gray-bg); border-left: 3px solid var(--border); }
.color-thumb { width: 38px; height: 48px; object-fit: cover; flex-shrink: 0; }
.color-block-name { flex: 1; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
.btn-del-color { background: transparent; border: 1px solid #e53935; color: #e53935; padding: 3px 7px; cursor: pointer; font-size: 11px; }
.btn-del-color:hover { background: #e53935; color: #fff; }
.color-preview-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--border); background: #fafafa; margin-bottom: 10px; }
.color-preview-img { width: 38px; height: 48px; object-fit: cover; }
.color-preview-label { font-size: 10px; color: var(--gray-mid); }
.btn-add-color { padding: 9px 18px; background: transparent; border: 1px solid var(--black); color: var(--black); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all .2s; margin-top: 4px; }
.btn-add-color:hover { background: var(--black); color: #fff; }
.gallery-section { background: var(--gray-bg); padding: 12px; margin-bottom: 12px; }
.gallery-added-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.gallery-added-item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.gallery-added-thumb { width: 52px; height: 68px; object-fit: cover; border: 1px solid var(--border); }
.gallery-input-row { display: flex; gap: 6px; align-items: stretch; }
.url-input--flex { flex: 1; }
.btn-gallery-add { padding: 8px 12px; background: var(--black); color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; white-space: nowrap; }
.btn-gallery-add:hover { background: #333; }
.color-gallery-preview { display: flex; flex-wrap: wrap; gap: 4px; padding: 6px 10px; background: #fafafa; border-left: 3px solid var(--border); }
.gallery-preview-thumb { width: 38px; height: 50px; object-fit: cover; border: 1px solid var(--border); }
.folder-select-row { margin-bottom: 8px; }
.folder-select { width: 100%; border: 1px solid var(--border); padding: 8px 10px; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; color: var(--black); background: var(--white); cursor: pointer; min-height: unset; }
.folder-select:focus { outline: none; border-color: var(--black); }

@media (max-width: 600px) {
  .add-page { padding: 0 0 40px; }
  .page-title { font-size: 26px; margin-bottom: 20px; }
  .edit-layout { grid-template-columns: 1fr !important; border: none; }
  .edit-col { border-right: none !important; border-bottom: 1px solid var(--border); }
  .edit-col:last-child { border-bottom: none; }
  .col-inner { padding: 20px 14px; }
  .gender-tabs { width: 100%; }
  .gender-tab { flex: 1; text-align: center; }
  .radio-group { gap: 10px; }
  .radio-label { font-size: 12px; min-height: 36px; align-items: center; }
  .size-row { padding: 8px 10px; }
  .btn-save, .btn-cancel { flex: 1; text-align: center; }
  .form-actions { flex-direction: column; gap: 8px; }
  .img-picker { gap: 4px; }
  .picker-img { width: 46px; height: 60px; }
}
</style>
