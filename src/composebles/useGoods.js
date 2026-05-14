import { ref, watch } from 'vue'

const _imgBase = import.meta.glob('/src/assets/img/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' })
const _imgNew = import.meta.glob('/src/assets/img-new/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' })
const _imgSale = import.meta.glob('/src/assets/img-sale/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' })
const _imgCollection = import.meta.glob('/src/assets/img-collection/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' })

function _img(modules, name) {
  for (const path in modules) {
    if (path.endsWith('/' + name)) return modules[path]
  }
  return ''
}
function _base(name) { return _img(_imgBase, name) }
function _new(name) { return _img(_imgNew, name) }
function _sale(name) { return _img(_imgSale, name) }
function _col(name) { return _img(_imgCollection, name) }

const defaultGoods = [
  {
    id: 1,
    sku: 'GCK-001',
    createdAt: '2025-01-10',
    isCollection: true,
    name: 'Свитер прямого кроя',
    gender: 'women',
    price: 7999,
    image: _col('Cotton sweater with a collar.jpeg'),
    images: [_col('Cotton sweater with a collar.jpeg')],
    colors: [
      { name: 'Бежевый', image: _col('Cotton sweater with a collar.jpeg') },
      { name: 'Тёмно-синий', image: _col('Cotton sweater with a collar.jpeg') },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Лаконичный свитер прямого кроя из мягкой шерстяной смеси. Идеален для casual-образов в прохладное время года. Подчёркивает силуэт, не сковывает движений.',
    composition: '60% шерсть, 40% акрил', care: 'Машинная стирка 30°C · Прямой крой · Рибана на манжетах',
    reviews: [
      { id: 'r_1', author: 'Анна', login: '', text: 'Очень мягкий, не колется. Сидит отлично на 44 размере.', rating: 5, approved: true },
      { id: 'r_2', author: 'Полина', login: '', text: 'Беру уже второй — первый до сих пор как новый после двух сезонов.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10, 'XL': 10 },
  },
  {
    id: 2,
    sku: 'GCK-002',
    createdAt: '2025-01-15',
    isSale: true,
    salePrice: 3999,
    name: 'Трикотажный костюм',
    gender: 'women',
    price: 5499,
    image: _sale('Knitted dress with a zigzag pattern.jpeg'),
    images: [_sale('Knitted dress with a zigzag pattern.jpeg')],
    colors: [
      { name: 'Чёрный', image: _sale('Knitted dress with a zigzag pattern.jpeg') },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Элегантный трикотажный костюм — идеальный выбор для офиса и встреч. Приятная к телу ткань, хорошо держит форму. Комплект включает джемпер и юбку-карандаш.',
    composition: '70% вискоза, 30% полиэстер', care: 'Ручная стирка · Приталенный силуэт · Размерный ряд S–XL',
    reviews: [
      { id: 'r_3', author: 'Диана', login: '', text: 'Ношу в офис — все спрашивают, где купила.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10 },
  },
  {
    id: 3,
    sku: 'GCK-003',
    createdAt: '2025-01-20',
    isSale: true,
    salePrice: 4499,
    name: 'Классические брюки',
    gender: 'women',
    price: 6299,
    image: _sale('pants.jpeg'),
    images: [_sale('pants.jpeg')],
    colors: [
      { name: 'Серый', image: _sale('pants.jpeg') },
      { name: 'Чёрный', image: _sale('pants.jpeg') },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Строгие классические брюки с высокой посадкой. Универсальная модель, которая подойдёт как к блузке, так и к casual-топу. Боковые карманы, потайная молния сбоку.',
    composition: '55% полиэстер, 45% вискоза', care: 'Высокая посадка · Прямой силуэт · Потайная молния',
    reviews: [
      { id: 'r_4', author: 'Катерина', login: '', text: 'Длина идеальная, не нужно подшивать. Ткань не мнётся.', rating: 5, approved: true },
      { id: 'r_5', author: 'Юля', login: '', text: 'Взяла под блузку и под свитер — оба варианта работают.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10, 'XL': 10, 'XXL': 10 },
  },
  {
    id: 4,
    sku: 'GCK-004',
    createdAt: '2025-02-01',
    isCollection: true,
    name: 'Свитер oversize',
    gender: 'men',
    price: 12999,
    image: _col('Cotton bomber jacket.jpeg'),
    images: [_col('Cotton bomber jacket.jpeg')],
    colors: [
      { name: 'Молочный', image: _col('Cotton bomber jacket.jpeg') },
    ],
    sizes: ['S', 'M', 'L'],
    description: 'Объёмный свитер oversize из 100% мериносовой шерсти. Уютная вещь для холодных дней. Подходит поверх рубашек или с высоким воротом. Drop-плечо, широкие рукава.',
    composition: '100% мериносовая шерсть', care: 'Ручная стирка холодной водой · Оверсайз крой · Drop-плечо',
    reviews: [
      { id: 'r_6', author: 'Ирина', login: '', text: 'Дорого, но того стоит. Шерсть высшего качества, не щиплет.', rating: 5, approved: true },
    ],
    stock: { 'S': 10, 'M': 10, 'L': 10 },
  },
  {
    id: 5,
    sku: 'GCK-005',
    createdAt: '2025-02-10',
    isNew: true,
    name: 'Джинсовая рубашка из хлопка и лиоцелла',
    gender: 'women',
    price: 6599,
    image: _new('Striped cotton zip-up shirt.jpeg'),
    images: [_new('Striped cotton zip-up shirt.jpeg')],
    colors: [
      { name: 'Голубой деним', image: _new('Striped cotton zip-up shirt.jpeg') },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Рубашка прямого кроя из денима на основе хлопка и лиоцелла. Винтажный эффект потертости. Отложной воротник. Нагрудные накладные карманы с клапанами. Длинные рукава с манжетами. Закругленный нижний край. Застежка на пуговицы из имитирующего натуральный рог материал.',
    composition: '80% ХЛОПОК, 20% ЛИОЦЕЛЛ', care: 'Деликатная стирка 30°C',
    reviews: [
      { id: 'r_7', author: 'Маша', login: '', text: 'Невероятно красивое, ткань очень плотная и тёплая.', rating: 5, approved: true },
      { id: 'r_8', author: 'Соня', login: '', text: 'Взяла — подходит буквально ко всему в гардеробе.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10 },
  },
  {
    id: 6,
    sku: 'GCK-006',
    createdAt: '2025-02-18',
    isNew: true,
    name: 'Трикотажный кардиган из хлопка с вышивкой',
    gender: 'women',
    price: 5999,
    image: _new('Elastic printed top.jpeg'),
    images: [_new('Elastic printed top.jpeg')],
    colors: [
      { name: 'Бежевый', image: _new('Elastic printed top.jpeg') },
    ],
    sizes: ['XS', 'S', 'M'],
    description: 'Кардиган прямого кроя из смесового трикотажа на основе хлопка. Контрастная отделка. Вышивка на левой стороне груди. Закругленный воротник. Длинные рукава. Эластичная отделка по краям. Застежка на молнию.',
    composition: '84% ХЛОПОК, 16% ПОЛИЭСТЕР', care: 'Машинная стирка 30°C',
    reviews: [
      { id: 'r_9', author: 'Лена', login: '', text: 'Ткань приятная, не просвечивает. Сидит очень женственно.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10 },
  },
  {
    id: 7,
    sku: 'GCK-007',
    createdAt: '2025-03-05',
    isSale: true,
    salePrice: 6900,
    name: 'Платье-корсет на косточках с вышивкой',
    gender: 'women',
    price: 9400,
    image: _sale('Embroidered Underbust Corset Dress.jpeg'),
    images: [_sale('Embroidered Underbust Corset Dress.jpeg')],
    colors: [
      { name: 'Чёрный', image: _sale('Embroidered Underbust Corset Dress.jpeg') },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Формирующая силуэт модель корсетного кроя. Мини-платье на внутренних ребрах жесткости и ярко выраженным объемом на бедрах. Украшено вышивкой с кристаллами и перламутровыми жемчужинами. Дополнено открытыми плечами, вырезом халтер с застежкой на бретеле, лифом-бюстье и акцентной молнией на спине. Прилегающее к телу изделие с мягкой подкладкой для приятных ощущений на коже.',
    composition: '90% ПОЛИЭСТЕР, 10% ЭЛАСТАН; Подкладка: 84% ЛИОЦЕЛЛ, 16% ПОЛИЭСТЕР', care: 'Деликатная стирка 30°C · Не отжимать',
    reviews: [
      { id: 'r_10', author: 'Вика', login: '', text: 'Очень тянется, сидит как влитое. Уже заказала второй цвет.', rating: 5, approved: true },
      { id: 'r_11', author: 'Тоня', login: '', text: 'На 46 размер взяла M — всё идеально, ничего не тянет.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10, 'XL': 10 },
  },
  {
    id: 8,
    sku: 'GCK-008',
    createdAt: '2025-03-14',
    isNew: true,
    name: 'Приталенный блейзер с округлыми плечами',
    gender: 'women',
    price: 8999,
    image: _new('Printed Elastic Cotton T-shirt.jpeg'),
    images: [_new('Printed Elastic Cotton T-shirt.jpeg')],
    colors: [
      { name: 'Серо-бежевый', image: _new('Printed Elastic Cotton T-shirt.jpeg') },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Блейзер с округлой линией плеча, акцентом на талии и длиной до бедра. Дополнен фактурными складками. Подплечники реглан. На подкладке. Однобортная застежка на потайной крючок и обтяжные пуговицы.',
    composition: '66% ПОЛИЭСТЕР, 28% ВИСКОЗА, 6% ЭЛАСТАН; Подкладка: 55% ПОЛИЭСТЕР, 45% ВИСКОЗА', care: 'Деликатная стирка · Не отбеливать',
    reviews: [
      { id: 'r_12', author: 'Наташа', login: '', text: 'Купила год назад — носила всю весну и осень, как новый.', rating: 5, approved: true },
    ],
    stock: { 'XS': 10, 'S': 10, 'M': 10, 'L': 10 },
  },
]

const DATA_VERSION = '18'
const storedVersion = localStorage.getItem('goodsVersion')
const storedGoods = localStorage.getItem('goods')
let initialGoods = defaultGoods

if (storedGoods) {
  const parsed = JSON.parse(storedGoods)
  if (storedVersion === DATA_VERSION) {
    // Версия совпадает — берём как есть, но добираем sku/createdAt если нет
    initialGoods = parsed
    for (let pi = 0; pi < initialGoods.length; pi++) {
      if (!initialGoods[pi].sku) {
        initialGoods[pi].sku = 'GCK-' + String(initialGoods[pi].id).padStart(3, '0')
      }
      if (!initialGoods[pi].createdAt) {
        initialGoods[pi].createdAt = '2025-01-01'
      }
    }
  } else {
    // Версия изменилась — обновляем дефолтные, сохраняем пользовательские
    const maxDefaultId = defaultGoods.length > 0 ? defaultGoods[defaultGoods.length - 1].id : 0
    const userGoods = []
    for (let pi = 0; pi < parsed.length; pi++) {
      if (parsed[pi].id > maxDefaultId) {
        const ug = parsed[pi]
        if (!ug.sku) ug.sku = 'GCK-' + String(ug.id).padStart(3, '0')
        if (!ug.createdAt) ug.createdAt = '2025-01-01'
        userGoods.push(ug)
      }
    }
    initialGoods = defaultGoods.slice()
    for (let ui = 0; ui < userGoods.length; ui++) initialGoods.push(userGoods[ui])
    localStorage.setItem('goodsVersion', DATA_VERSION)
  }
} else {
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
  // Артикул: GCK-XXX, дата добавления
  if (!newProduct.sku) {
    const skuNum = String(newProduct.id).padStart(3, '0')
    newProduct.sku = 'GCK-' + skuNum
  }
  if (!newProduct.createdAt) {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    newProduct.createdAt = y + '-' + m + '-' + d
  }
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

// ── ПРОМОКОДЫ ────────────────────────────────────────────────────────────────

const defaultPromos = []

function loadPromos() {
  const raw = localStorage.getItem('promos')
  if (!raw) return defaultPromos
  return JSON.parse(raw)
}

function savePromos(data) {
  localStorage.setItem('promos', JSON.stringify(data))
}

const promos = ref(loadPromos())

function addPromo(code, discount) {
  const upper = code.trim().toUpperCase()
  for (let pi = 0; pi < promos.value.length; pi++) {
    if (promos.value[pi].code === upper) return false
  }
  promos.value.push({ code: upper, discount: Number(discount), active: true })
  savePromos(promos.value)
  return true
}

function deletePromo(code) {
  const upper = code.trim().toUpperCase()
  promos.value = promos.value.filter(function(p) { return p.code !== upper })
  savePromos(promos.value)
}

function togglePromo(code) {
  const upper = code.trim().toUpperCase()
  for (let pi = 0; pi < promos.value.length; pi++) {
    if (promos.value[pi].code === upper) {
      promos.value[pi].active = !promos.value[pi].active
      savePromos(promos.value)
      return
    }
  }
}

function applyPromo(code) {
  const upper = code.trim().toUpperCase()
  for (let pi = 0; pi < promos.value.length; pi++) {
    if (promos.value[pi].code === upper && promos.value[pi].active) {
      return promos.value[pi].discount
    }
  }
  return null
}

export { goods, addProduct, getProductById, updateProduct, deleteProduct, isAdmin, token, wishlist, toggleWishlist, isWishlisted, cart, addToCart, isInCart, removeFromCart, updateCartQty, clearCart, addReview, deleteReview, updateReview, approveReview, addProductImage, removeProductImage, updateProductImage, addColor, removeColor, updateColor, addColorImage, removeColorImage, saveOrder, getOrders, getAllOrders, updateOrderStatus, promos, addPromo, deletePromo, togglePromo, applyPromo }