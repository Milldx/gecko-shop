import { ref, watch } from 'vue'

const defaultGoods = [
  {
    id: 1,
    name: 'Свитер прямого кроя',
    gender: 'women',
    price: 7999,
    image: '/src/assets/img/jacket.jpeg',
    images: ['/src/assets/img/jacket.jpeg'],
    colors: [
      { name: 'Бежевый', image: '/src/assets/img/jacket.jpeg' },
      { name: 'Тёмно-синий', image: '/src/assets/img/jacket.jpeg' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Лаконичный свитер прямого кроя из мягкой шерстяной смеси. Идеален для casual-образов в прохладное время года. Подчёркивает силуэт, не сковывает движений.',
    specs: '60% шерсть, 40% акрил · Машинная стирка 30°C · Прямой крой · Рибана на манжетах',
    reviews: [
      { id: 'r_1', author: 'Анна', login: '', text: 'Очень мягкий, не колется. Сидит отлично на 44 размере.', rating: 5, approved: true },
      { id: 'r_2', author: 'Полина', login: '', text: 'Беру уже второй — первый до сих пор как новый после двух сезонов.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10, 'XL': 10 },
  },
  {
    id: 2,
    isSale: true,
    salePrice: 3999,
    name: 'Трикотажный костюм',
    gender: 'women',
    price: 5499,
    image: '/src/assets/img/dress.jpeg',
    images: ['/src/assets/img/dress.jpeg'],
    colors: [
      { name: 'Чёрный', image: '/src/assets/img/dress.jpeg' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Элегантный трикотажный костюм — идеальный выбор для офиса и встреч. Приятная к телу ткань, хорошо держит форму. Комплект включает джемпер и юбку-карандаш.',
    specs: '70% вискоза, 30% полиэстер · Ручная стирка · Приталенный силуэт · Размерный ряд S–XL',
    reviews: [
      { id: 'r_3', author: 'Диана', login: '', text: 'Ношу в офис — все спрашивают, где купила.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10 },
  },
  {
    id: 3,
    isSale: true,
    salePrice: 4499,
    name: 'Классические брюки',
    gender: 'women',
    price: 6299,
    image: '/src/assets/img/pants.jpeg',
    images: ['/src/assets/img/pants.jpeg'],
    colors: [
      { name: 'Серый', image: '/src/assets/img/pants.jpeg' },
      { name: 'Чёрный', image: '/src/assets/img/pants.jpeg' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Строгие классические брюки с высокой посадкой. Универсальная модель, которая подойдёт как к блузке, так и к casual-топу. Боковые карманы, потайная молния сбоку.',
    specs: '55% полиэстер, 45% вискоза · Высокая посадка · Прямой силуэт · Потайная молния',
    reviews: [
      { id: 'r_4', author: 'Катерина', login: '', text: 'Длина идеальная, не нужно подшивать. Ткань не мнётся.', rating: 5, approved: true },
      { id: 'r_5', author: 'Юля', login: '', text: 'Взяла под блузку и под свитер — оба варианта работают.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10, 'XL': 10, 'XXL': 10 },
  },
  {
    id: 4,
    name: 'Свитер oversize',
    gender: 'men',
    price: 12999,
    image: '/src/assets/img/coat.jpeg',
    images: ['/src/assets/img/coat.jpeg'],
    colors: [
      { name: 'Молочный', image: '/src/assets/img/coat.jpeg' },
    ],
    sizes: ['S', 'M', 'L'],
    description: 'Объёмный свитер oversize из 100% мериносовой шерсти. Уютная вещь для холодных дней. Подходит поверх рубашек или с высоким воротом. Drop-плечо, широкие рукава.',
    specs: '100% мериносовая шерсть · Ручная стирка холодной водой · Оверсайз крой · Drop-плечо',
    reviews: [
      { id: 'r_6', author: 'Ирина', login: '', text: 'Дорого, но того стоит. Шерсть высшего качества, не щиплет.', rating: 5, approved: true },
    ],
    stock: { 'S': 10, 'M': 10, 'L': 10 },
  },
  {
    id: 5,
    isNew: true,
    name: 'Джинсовая рубашка из хлопка и лиоцелла',
    gender: 'women',
    price: 6599,
    image: 'https://cache-limeshop.cdnvideo.ru/limeshop/aa/14cb0ec85f4651a3bd8327b58f520079.jpeg?q=85&w=849',
    images: ['https://cache-limeshop.cdnvideo.ru/limeshop/aa/14cb0ec85f4651a3bd8327b58f520079.jpeg?q=85&w=849'],
    colors: [
      { name: 'Голубой деним', image: 'https://cache-limeshop.cdnvideo.ru/limeshop/aa/14cb0ec85f4651a3bd8327b58f520079.jpeg?q=85&w=849' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Рубашка прямого кроя из денима на основе хлопка и лиоцелла. Винтажный эффект потертости. Отложной воротник. Нагрудные накладные карманы с клапанами. Длинные рукава с манжетами. Закругленный нижний край. Застежка на пуговицы из имитирующего натуральный рог материал.',
    specs: 'Основной материал: 80% ХЛОПОК/20% ЛИОЦЕЛЛ',
    reviews: [
      { id: 'r_7', author: 'Маша', login: '', text: 'Невероятно красивое, ткань очень плотная и тёплая.', rating: 5, approved: true },
      { id: 'r_8', author: 'Соня', login: '', text: 'Взяла — подходит буквально ко всему в гардеробе.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10 },
  },
  {
    id: 6,
    isNew: true,
    name: 'Трикотажный кардиган из хлопка с вышивкой',
    gender: 'women',
    price: 5999,
    image: 'https://cache-limeshop.cdnvideo.ru/limeshop/aa/d8c9e39c4c58547cbae9f207a2682307.jpeg?q=85&w=1536',
    images: ['https://cache-limeshop.cdnvideo.ru/limeshop/aa/d8c9e39c4c58547cbae9f207a2682307.jpeg?q=85&w=1536'],
    colors: [
      { name: 'Бежевый', image: 'https://cache-limeshop.cdnvideo.ru/limeshop/aa/d8c9e39c4c58547cbae9f207a2682307.jpeg?q=85&w=1536' },
    ],
    sizes: ['XS', 'S', 'M'],
    description: 'Кардиган прямого кроя из смесового трикотажа на основе хлопка. Контрастная отделка. Вышивка на левой стороне груди. Закругленный воротник. Длинные рукава. Эластичная отделка по краям. Застежка на молнию.',
    specs: 'Основной материал: 84% ХЛОПОК/16% ПОЛИЭСТЕР',
    reviews: [
      { id: 'r_9', author: 'Лена', login: '', text: 'Ткань приятная, не просвечивает. Сидит очень женственно.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10 },
  },
  {
    id: 7,
    isNew: true,
    isSale: true,
    salePrice: 6900,
    name: 'Платье-корсет на косточках с вышивкой',
    gender: 'women',
    price: 9400,
    image: 'https://cache-limeshop.cdnvideo.ru/limeshop/aa/46e44bb64c0d5aabb4317626a01cc5b6.jpeg?q=85&w=849',
    images: ['https://cache-limeshop.cdnvideo.ru/limeshop/aa/46e44bb64c0d5aabb4317626a01cc5b6.jpeg?q=85&w=849'],
    colors: [
      { name: 'Чёрный', image: 'https://cache-limeshop.cdnvideo.ru/limeshop/aa/46e44bb64c0d5aabb4317626a01cc5b6.jpeg?q=85&w=849' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Формирующая силуэт модель корсетного кроя. Мини-платье на внутренних ребрах жесткости и ярко выраженным объемом на бедрах. Украшено вышивкой с кристаллами и перламутровыми жемчужинами. Дополнено открытыми плечами, вырезом халтер с застежкой на бретеле, лифом-бюстье и акцентной молнией на спине. Прилегающее к телу изделие с мягкой подкладкой для приятных ощущений на коже.',
    specs: 'Основной материал: 90% ПОЛИЭСТЕР/10% ЭЛАСТАН; Подкладка: 84% ЛИОЦЕЛЛ/16% ПОЛИЭСТЕР',
    reviews: [
      { id: 'r_10', author: 'Вика', login: '', text: 'Очень тянется, сидит как влитое. Уже заказала второй цвет.', rating: 5, approved: true },
      { id: 'r_11', author: 'Тоня', login: '', text: 'На 46 размер взяла M — всё идеально, ничего не тянет.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10, 'XL': 10 },
  },
  {
    id: 8,
    isNew: true,
    name: 'Приталенный блейзер с округлыми плечами',
    gender: 'women',
    price: 8999,
    image: 'https://cache-limeshop.cdnvideo.ru/limeshop/aa/8207645685185570a78c595bdba7eaa7.jpeg?q=85&w=849',
    images: ['https://cache-limeshop.cdnvideo.ru/limeshop/aa/8207645685185570a78c595bdba7eaa7.jpeg?q=85&w=849'],
    colors: [
      { name: 'Серо-бежевый', image: 'https://cache-limeshop.cdnvideo.ru/limeshop/aa/8207645685185570a78c595bdba7eaa7.jpeg?q=85&w=849' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Блейзер с округлой линией плеча, акцентом на талии и длиной до бедра. Дополнен фактурными складками. Подплечники реглан. На подкладке. Однобортная застежка на потайной крючок и обтяжные пуговицы.',
    specs: 'Основной материал: 66% ПОЛИЭСТЕР/28% ВИСКОЗА/6% ЭЛАСТАН; Подкладка: 55% ПОЛИЭСТЕР/45% ВИСКОЗА',
    reviews: [
      { id: 'r_12', author: 'Наташа', login: '', text: 'Купила год назад — носила всю весну и осень, как новый.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10 },
  },
]

const DATA_VERSION = '9'
const storedVersion = localStorage.getItem('goodsVersion')
const storedGoods = localStorage.getItem('goods')
let initialGoods = defaultGoods
if (storedGoods && storedVersion === DATA_VERSION) {
  initialGoods = JSON.parse(storedGoods)
} else {
  localStorage.removeItem('goods')
  localStorage.setItem('goodsVersion', DATA_VERSION)
}
const goods = ref(initialGoods)

let maxId = 0
if (goods.value.length) {
  for (let goodsIndex = 0; goodsIndex < goods.value.length; goodsIndex++) {
    if (goods.value[goodsIndex].id > maxId) {
      maxId = goods.value[goodsIndex].id
    }
  }
}
let nextId = ref(maxId + 1)

function saveGoods() {
  localStorage.setItem('goods', JSON.stringify(goods.value))
}

function addProduct(product) {
  const newProduct = {}
  for (const key in product) {
    newProduct[key] = product[key]
  }
  newProduct.id = nextId.value++
  goods.value.push(newProduct)
  saveGoods()
}

function getProductById(id) {
  return goods.value.find(function(good) { return good.id === Number(id) })
}

function updateProduct(id, updated) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(id) })
  if (index === -1) return
  const merged = {}
  for (const key in goods.value[index]) {
    merged[key] = goods.value[index][key]
  }
  for (const key in updated) {
    merged[key] = updated[key]
  }
  goods.value[index] = merged
  saveGoods()
}

const isAdmin = ref(!!localStorage.getItem('isAdmin'))

watch(isAdmin, function(newValue) {
  if (newValue) {
    localStorage.setItem('isAdmin', '1')
  } else {
    localStorage.removeItem('isAdmin')
  }
})

const token = ref(localStorage.getItem('token') || '')

watch(token, function(newValue) {
  if (newValue) {
    localStorage.setItem('token', newValue)
  } else {
    localStorage.removeItem('token')
  }
})

// ── ИЗБРАННОЕ — отдельное для каждого пользователя ──────────────────────────

function getWishlistKey() {
  if (token.value) return 'wishlist_user_' + token.value
  return 'wishlist_guest'
}

function loadWishlist() {
  const raw = localStorage.getItem(getWishlistKey())
  if (!raw) return []
  return JSON.parse(raw)
}

function saveWishlistData(data) {
  localStorage.setItem(getWishlistKey(), JSON.stringify(data))
}

const wishlist = ref(loadWishlist())

watch(token, function() {
  wishlist.value = loadWishlist()
})

function toggleWishlist(id) {
  let wishlistPos = -1
  for (let wi = 0; wi < wishlist.value.length; wi = wi + 1) {
    if (wishlist.value[wi] === id) { wishlistPos = wi; break }
  }
  const i = wishlistPos
  if (i !== -1) wishlist.value.splice(i, 1)
  else wishlist.value.push(id)
  saveWishlistData(wishlist.value)
}

function isWishlisted(id) {
  return wishlist.value.includes(id)
}

// ── КОРЗИНА — отдельная для каждого пользователя ──────────────────────────────

function getCartKey() {
  if (token.value) return 'cart_user_' + token.value
  return 'cart_guest'
}

function loadCart() {
  const key = getCartKey()
  if (!key) return []
  const raw = localStorage.getItem(key)
  if (!raw) return []
  return JSON.parse(raw)
}

function saveCartData(data) {
  const key = getCartKey()
  if (!key) return
  localStorage.setItem(key, JSON.stringify(data))
}

const cart = ref(loadCart())

// При смене пользователя — переключаем корзину
watch([token, isAdmin], function() {
  cart.value = loadCart()
})

function addToCart(productId, size) {
  for (let cartIndex = 0; cartIndex < cart.value.length; cartIndex++) {
    if (cart.value[cartIndex].productId === productId && cart.value[cartIndex].size === size) return
  }
  cart.value.push({ productId: productId, size: size, qty: 1 })
  saveCartData(cart.value)
}

function removeFromCart(productId, size) {
  cart.value = cart.value.filter(function(cartItem) {
    return !(cartItem.productId === productId && cartItem.size === size)
  })
  saveCartData(cart.value)
}

function updateCartQty(productId, size, qty) {
  for (let cartIndex = 0; cartIndex < cart.value.length; cartIndex++) {
    if (cart.value[cartIndex].productId === productId && cart.value[cartIndex].size === size) {
      if (qty <= 0) cart.value.splice(cartIndex, 1)
      else cart.value[cartIndex].qty = qty
      break
    }
  }
  saveCartData(cart.value)
}

function clearCart() {
  cart.value = []
  saveCartData([])
}

function isInCart(productId, size) {
  for (let cartIndex = 0; cartIndex < cart.value.length; cartIndex++) {
    if (cart.value[cartIndex].productId === productId && cart.value[cartIndex].size === size) {
      return true
    }
  }
  return false
}

function deleteProduct(id) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(id) })
  if (index === -1) return
  goods.value.splice(index, 1)
  saveGoods()
}

function addReview(productId, review) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  if (!goods.value[index].reviews) goods.value[index].reviews = []
  goods.value[index].reviews.push(review)
  saveGoods()
}

function deleteReview(productId, reviewId) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  const reviews = goods.value[index].reviews
  const ri = reviews.findIndex(function(r) { return r.id === reviewId })
  if (ri === -1) return
  reviews.splice(ri, 1)
  saveGoods()
}

function updateReview(productId, reviewId, newText, newRating) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  const reviews = goods.value[index].reviews
  const ri = reviews.findIndex(function(r) { return r.id === reviewId })
  if (ri === -1) return
  reviews[ri].text = newText
  if (newRating) reviews[ri].rating = newRating
  saveGoods()
}

function approveReview(productId, reviewId) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  const reviews = goods.value[index].reviews
  const ri = reviews.findIndex(function(r) { return r.id === reviewId })
  if (ri === -1) return
  reviews[ri].approved = true
  saveGoods()
}

function addProductImage(productId, url) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  if (!goods.value[index].images) goods.value[index].images = []
  goods.value[index].images.push(url)
  goods.value[index].image = goods.value[index].images[0]
  saveGoods()
}

function removeProductImage(productId, imgIndex) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  goods.value[index].images.splice(imgIndex, 1)
  if (goods.value[index].images.length > 0) {
    goods.value[index].image = goods.value[index].images[0]
  }
  saveGoods()
}

function updateProductImage(productId, imgIndex, url) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  goods.value[index].images[imgIndex] = url
  if (imgIndex === 0) goods.value[index].image = url
  saveGoods()
}

function addColor(productId, color) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  if (!goods.value[index].colors) goods.value[index].colors = []
  goods.value[index].colors.push(color)
  saveGoods()
}

function removeColor(productId, colorIndex) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  goods.value[index].colors.splice(colorIndex, 1)
  saveGoods()
}

function updateColor(productId, colorIndex, color) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  goods.value[index].colors[colorIndex] = color
  saveGoods()
}

function addColorImage(productId, colorIndex, url) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  const color = goods.value[index].colors[colorIndex]
  if (!color) return
  if (!color.images) color.images = []
  color.images.push(url)
  saveGoods()
}

function removeColorImage(productId, colorIndex, imgIndex) {
  const index = goods.value.findIndex(function(good) { return good.id === Number(productId) })
  if (index === -1) return
  const color = goods.value[index].colors[colorIndex]
  if (!color || !color.images) return
  color.images.splice(imgIndex, 1)
  saveGoods()
}

// ── ЗАКАЗЫ ────────────────────────────────────────────────────────────────────

function getOrdersKey() {
  if (token.value) return 'orders_user_' + token.value
  return 'orders_guest'
}

function saveOrder(orderData) {
  const key = getOrdersKey()
  let orders = []
  const raw = localStorage.getItem(key)
  if (raw) orders = JSON.parse(raw)
  const order = {
    id: 'order_' + Date.now(),
    date: new Date().toISOString(),
    status: 'new',
    items: orderData.items,
    total: orderData.total,
    contact: orderData.contact || null,
    delivery: orderData.delivery || null,
    payment: orderData.payment || null,
    name: orderData.name || null,
  }
  orders.unshift(order)
  localStorage.setItem(key, JSON.stringify(orders))
  return order
}

function getOrders() {
  const key = getOrdersKey()
  const raw = localStorage.getItem(key)
  if (!raw) return []
  return JSON.parse(raw)
}

// Для админа — все заказы всех пользователей
function getAllOrders() {
  const result = []
  const keys = Object.keys(localStorage)
  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    const k = keys[keyIndex]
    if (k.startsWith('orders_')) {
      let orders = []
      const raw = localStorage.getItem(k)
      if (raw) orders = JSON.parse(raw)
      for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
        const copy = {}
        for (const field in orders[orderIndex]) {
          copy[field] = orders[orderIndex][field]
        }
        copy._source = k
        result.push(copy)
      }
    }
  }
  result.sort(function(orderA, orderB) { return orderB.id.localeCompare(orderA.id) })
  return result
}

function updateOrderStatus(orderId, status) {
  const keys = Object.keys(localStorage)
  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    const k = keys[keyIndex]
    if (!k.startsWith('orders_')) continue
    const raw = localStorage.getItem(k)
    if (!raw) continue
    const orders = JSON.parse(raw)
    const idx = orders.findIndex(function(order) { return order.id === orderId })
    if (idx !== -1) {
      orders[idx].status = status
      localStorage.setItem(k, JSON.stringify(orders))
      return
    }
  }
}

export { goods, addProduct, getProductById, updateProduct, deleteProduct, isAdmin, token, wishlist, toggleWishlist, isWishlisted, cart, addToCart, isInCart, removeFromCart, updateCartQty, clearCart, addReview, deleteReview, updateReview, approveReview, addProductImage, removeProductImage, updateProductImage, addColor, removeColor, updateColor, addColorImage, removeColorImage, saveOrder, getOrders, getAllOrders, updateOrderStatus }
