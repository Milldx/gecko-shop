<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { isAdmin, token, wishlist, cart, goods } from '../composebles/useGoods.js'

defineProps({ cartCount: Number })
const router = useRouter()

const wishlistCount = computed(function() { return wishlist.value.length })
const cartCount2 = computed(function() {
  let total = 0
  for (let i = 0; i < cart.value.length; i++) {
    if (goods.value.find(function(g) { return g.id === cart.value[i].productId })) total++
  }
  return total
})

watch(isAdmin, function(val) { if (!val) router.push({ name: 'home' }) })

// Поиск
const searchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

function toggleSearch() {
  if (searchOpen.value) { searchOpen.value = false; searchQuery.value = '' }
  else {
    searchOpen.value = true
    setTimeout(function() { if (searchInput.value) searchInput.value.focus() }, 50)
  }
  mobileOpen.value = false
}
function onSearchBlur() {
  setTimeout(function() { if (!searchQuery.value.trim()) searchOpen.value = false }, 150)
}
function submitSearch() {
  const q = searchQuery.value.trim()
  if (!q) return
  const upper = q.toUpperCase()
  for (let gi = 0; gi < goods.value.length; gi++) {
    if (goods.value[gi].sku && goods.value[gi].sku.toUpperCase() === upper) {
      searchOpen.value = false; searchQuery.value = ''
      router.push({ name: 'product-description', params: { id: goods.value[gi].id } })
      return
    }
  }
  searchOpen.value = false
  router.push({ name: 'home', query: { q } })
}
function onSearchKey(e) {
  if (e.key === 'Escape') { searchOpen.value = false; searchQuery.value = '' }
  if (e.key === 'Enter') submitSearch()
}

// Мобильное меню
const mobileOpen = ref(false)
function toggleMobile() { mobileOpen.value = !mobileOpen.value; searchOpen.value = false }
function closeMobile() { mobileOpen.value = false }

// Закрывать при навигации
watch(() => router.currentRoute.value.fullPath, function() { mobileOpen.value = false })
</script>

<template>
  <div class="promo-bar">
    <span>Бесплатная доставка от 10 000 ₽ &nbsp;·&nbsp; Возврат в течение 30 дней</span>
  </div>

  <header class="header">
    <!-- Левая навигация (десктоп) -->
    <div class="nav nav--left">
      <RouterLink :to="{ name: 'new-arrivals' }" class="nav-link">Новинки</RouterLink>
      <RouterLink :to="{ name: 'women' }" class="nav-link">Женщинам</RouterLink>
      <RouterLink :to="{ name: 'men' }" class="nav-link">Мужчинам</RouterLink>
      <RouterLink :to="{ name: 'sale' }" class="nav-link nav-link--sale">Sale</RouterLink>
    </div>

    <!-- Логотип -->
    <RouterLink :to="{ name: 'home' }" class="logo">GECKO</RouterLink>

    <!-- Правая навигация (десктоп) -->
    <div class="nav nav--right">
      <RouterLink v-if="isAdmin" :to="{ name: 'admin-products' }" class="nav-link nav-link--admin">Панель</RouterLink>
      <div class="search-inline" :class="{ 'search-inline--open': searchOpen }">
        <input v-if="searchOpen" ref="searchInput" v-model="searchQuery" type="text"
          class="search-inline-input" placeholder="Поиск" @keydown="onSearchKey" @blur="onSearchBlur" />
        <button class="search-inline-btn" @click="toggleSearch">
          <svg v-if="!searchOpen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <RouterLink :to="token ? { name: 'profile' } : { name: 'login' }" class="icon-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span v-if="token" class="profile-dot"></span>
      </RouterLink>
      <RouterLink :to="{ name: 'wishlist' }" class="icon-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <span v-if="wishlistCount > 0" class="cart-badge">{{ wishlistCount }}</span>
      </RouterLink>
      <RouterLink :to="{ name: 'cart' }" class="icon-btn cart-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span v-if="cartCount2 > 0" class="cart-badge">{{ cartCount2 }}</span>
      </RouterLink>
    </div>

    <!-- Мобильная панель (иконки + бургер) -->
    <div class="mobile-actions">
      <RouterLink :to="{ name: 'cart' }" class="icon-btn cart-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span v-if="cartCount2 > 0" class="cart-badge">{{ cartCount2 }}</span>
      </RouterLink>
      <button class="burger" @click="toggleMobile" :aria-label="mobileOpen ? 'Закрыть меню' : 'Открыть меню'">
        <span class="burger-line" :class="{ 'burger-line--open-1': mobileOpen }"></span>
        <span class="burger-line" :class="{ 'burger-line--open-2': mobileOpen }"></span>
        <span class="burger-line" :class="{ 'burger-line--open-3': mobileOpen }"></span>
      </button>
    </div>
  </header>

  <!-- Мобильное меню (drawer) -->
  <Transition name="drawer">
    <div v-if="mobileOpen" class="mobile-drawer">
      <!-- Шапка drawer: логотип + крестик -->
      <div class="drawer-header">
        <RouterLink :to="{ name: 'home' }" class="drawer-logo" @click="closeMobile">GECKO</RouterLink>
        <button class="drawer-close" @click="closeMobile" aria-label="Закрыть меню">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="drawer-body">
        <nav class="mobile-nav">
          <RouterLink :to="{ name: 'new-arrivals' }" class="mobile-link" @click="closeMobile">Новинки</RouterLink>
          <RouterLink :to="{ name: 'women' }" class="mobile-link" @click="closeMobile">Женщинам</RouterLink>
          <RouterLink :to="{ name: 'men' }" class="mobile-link" @click="closeMobile">Мужчинам</RouterLink>
          <RouterLink :to="{ name: 'sale' }" class="mobile-link mobile-link--sale" @click="closeMobile">Sale</RouterLink>
          <RouterLink :to="{ name: 'collection' }" class="mobile-link" @click="closeMobile">Коллекция</RouterLink>
        </nav>
        <div class="mobile-divider"></div>
        <nav class="mobile-nav mobile-nav--secondary">
          <RouterLink :to="token ? { name: 'profile' } : { name: 'login' }" class="mobile-link-sm" @click="closeMobile">
            {{ token ? 'Личный кабинет' : 'Войти' }}
          </RouterLink>
          <RouterLink :to="{ name: 'wishlist' }" class="mobile-link-sm" @click="closeMobile">
            Избранное<span v-if="wishlistCount > 0" class="mobile-badge">{{ wishlistCount }}</span>
          </RouterLink>
          <RouterLink v-if="isAdmin" :to="{ name: 'admin-products' }" class="mobile-link-sm" @click="closeMobile">Панель управления</RouterLink>
        </nav>
        <div class="mobile-divider"></div>
        <div class="mobile-search">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по названию или артикулу"
            class="mobile-search-input"
            @keyup.enter="submitSearch"
          />
          <button class="mobile-search-btn" @click="submitSearch">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
  <div v-if="mobileOpen" class="mobile-overlay" @click="closeMobile"></div>
</template>

<style scoped>
.promo-bar {
  background: var(--black); color: var(--white);
  text-align: center; padding: 9px 20px;
  font-size: 11px; letter-spacing: 0.12em; font-weight: 500;
}

.header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0;
  background: var(--white); z-index: 300;
}

.logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px; font-weight: 500; letter-spacing: 0.35em;
  color: var(--black); text-align: center; text-transform: uppercase;
}

.nav { display: flex; align-items: center; gap: 20px; }
.nav--right { justify-content: flex-end; }
.nav-link { font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-dark); transition: color .2s; white-space: nowrap; }
.nav-link:hover, .nav-link.router-link-active { color: var(--black); }
.nav-link--admin { color: var(--black); font-weight: 600; }
.nav-link--sale { color: #c0392b; }

.icon-btn { position: relative; background: none; border: none; color: var(--black); display: flex; align-items: center; justify-content: center; padding: 4px; transition: opacity .2s; cursor: pointer; }
.icon-btn:hover { opacity: 0.5; }
.profile-dot { position: absolute; top: 2px; right: 2px; width: 6px; height: 6px; background: var(--black); border-radius: 50%; }
.cart-badge { position: absolute; top: -4px; right: -6px; background: var(--black); color: var(--white); font-size: 9px; font-weight: 700; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

.search-inline { display: flex; align-items: center; }
.search-inline-input { width: 0; border: none; border-bottom: 1px solid var(--black); padding: 2px 0; font-family: 'Montserrat', sans-serif; font-size: 11px; letter-spacing: 0.08em; color: var(--black); background: transparent; outline: none; transition: width .25s ease; }
.search-inline--open .search-inline-input { width: 160px; padding: 2px 8px 2px 0; }
.search-inline-input::placeholder { color: var(--gray-light); }
.search-inline-btn { background: none; border: none; color: var(--black); cursor: pointer; display: flex; align-items: center; padding: 4px; transition: opacity .2s; }
.search-inline-btn:hover { opacity: 0.5; }

/* ── Мобильные элементы ── */
.mobile-actions { display: none; align-items: center; gap: 12px; }

.burger { display: flex; flex-direction: column; justify-content: center; gap: 5px; background: none; border: none; width: 28px; height: 28px; padding: 2px; cursor: pointer; }
.burger-line { display: block; height: 1.5px; background: var(--black); transition: all .3s cubic-bezier(.4,0,.2,1); transform-origin: center; }
.burger-line--open-1 { transform: translateY(6.5px) rotate(45deg); }
.burger-line--open-2 { opacity: 0; transform: scaleX(0); }
.burger-line--open-3 { transform: translateY(-6.5px) rotate(-45deg); }

/* ── Drawer ── */
.mobile-drawer {
  position: fixed; top: 0; right: 0;
  width: min(340px, 100vw);
  max-width: 100vw;
  height: 100vh;
  background: var(--white);
  z-index: 400;
  overflow-y: auto;
  box-shadow: -4px 0 32px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
}
.drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 64px;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.drawer-logo {
  font-family: 'Cormorant Garamond', serif; font-size: 22px;
  font-weight: 500; letter-spacing: 0.32em; color: var(--black); text-transform: uppercase;
}
.drawer-close {
  background: none; border: none; color: var(--black); cursor: pointer;
  display: flex; align-items: center; justify-content: center; padding: 6px;
  min-height: unset; transition: opacity .2s;
}
.drawer-close:hover { opacity: 0.5; }
.drawer-body { padding: 24px 24px 40px; flex: 1; overflow-y: auto; }
.mobile-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 399;
}

.mobile-nav { display: flex; flex-direction: column; gap: 0; }
.mobile-link {
  display: block;
  font-size: 18px;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--black);
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  transition: opacity .15s;
}
.mobile-link:hover { opacity: 0.6; }
.mobile-link--sale { color: #c0392b; }
.mobile-nav--secondary { margin-top: 4px; }
.mobile-link-sm {
  display: flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--gray-mid);
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.mobile-badge { background: var(--black); color: var(--white); font-size: 9px; font-weight: 700; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.mobile-divider { height: 20px; }

.mobile-search { display: flex; border: 1px solid var(--border); overflow: hidden; }
.mobile-search-input { flex: 1; border: none; padding: 11px 14px; font-family: 'Montserrat', sans-serif; font-size: 12px; color: var(--black); }
.mobile-search-input:focus { outline: none; }
.mobile-search-btn { padding: 11px 14px; background: var(--black); color: var(--white); border: none; cursor: pointer; }

/* Transition */
.drawer-enter-active, .drawer-leave-active { transition: transform .35s cubic-bezier(.4,0,.2,1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }

/* ── Responsive ── */
@media (max-width: 600px) {
  .header { padding: 0 16px; }
  .mobile-actions {
    display: flex;
    grid-column: 3;
    justify-self: end;
  }
  .nav--left, .nav--right { display: none; }
  .logo { font-size: 22px; letter-spacing: 0.26em; }
  .promo-bar { font-size: 9px; padding: 7px 10px; letter-spacing: 0.05em; }
  /* Drawer на 100% ширину экрана */
  .mobile-drawer { width: 100vw; right: 0; box-shadow: none; }
  /* Overlay оставляем — закрывает страницу за drawer */
  .mobile-overlay { display: block; }
}
</style>
