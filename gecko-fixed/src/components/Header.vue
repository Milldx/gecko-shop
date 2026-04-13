<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { isAdmin, token, wishlist, cart, goods } from '../composebles/useGoods.js'

defineProps({ cartCount: Number })
const router = useRouter()

const wishlistCount = computed(function() { return wishlist.value.length })
const cartCount2 = computed(function() {
  let cartCount = 0
  for (let cartIdx = 0; cartIdx < cart.value.length; cartIdx++) {
    const found = goods.value.find(function(good) { return good.id === cart.value[cartIdx].productId })
    if (found) cartCount = cartCount + 1
  }
  return cartCount
})

watch(isAdmin, function(newValue) {
  if (!newValue) router.push({ name: 'home' })
})

// Поиск inline
const searchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

function toggleSearch() {
  if (searchOpen.value) {
    closeSearch()
  } else {
    searchOpen.value = true
    setTimeout(function() {
      if (searchInput.value) searchInput.value.focus()
    }, 50)
  }
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
}

function onSearchBlur() {
  setTimeout(function() {
    if (!searchQuery.value.trim()) searchOpen.value = false
  }, 150)
}

function submitSearch() {
  const q = searchQuery.value.trim()
  if (!q) return
  searchOpen.value = false
  router.push({ name: 'home', query: { q } })
}

function onSearchKey(event) {
  if (event.key === 'Escape') closeSearch()
  if (event.key === 'Enter') submitSearch()
}
</script>

<template>
  <div class="promo-bar">
    <span>Бесплатная доставка от 10 000 ₽ &nbsp;·&nbsp; Возврат в течение 30 дней</span>
  </div>

  <header class="header">
    <div class="nav nav--left">
      <RouterLink :to="{ name: 'new-arrivals' }" class="nav-link">Новинки</RouterLink>
      <RouterLink :to="{ name: 'women' }" class="nav-link">Женщинам</RouterLink>
      <RouterLink :to="{ name: 'men' }" class="nav-link">Мужчинам</RouterLink>
      <RouterLink :to="{ name: 'sale' }" class="nav-link nav-link--sale">Sale</RouterLink>
    </div>

    <RouterLink :to="{ name: 'home' }" class="logo">GECKO</RouterLink>

    <div class="nav nav--right">
      <RouterLink v-if="isAdmin" :to="{ name: 'admin-products' }" class="nav-link nav-link--admin">Панель</RouterLink>
      <div class="search-inline" :class="{ 'search-inline--open': searchOpen }">
        <input
          v-if="searchOpen"
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="search-inline-input"
          placeholder="Поиск"
          @keydown="onSearchKey"
          @blur="onSearchBlur"
        />
        <button class="search-inline-btn" @click="toggleSearch" :title="searchOpen ? 'Закрыть' : 'Поиск'">
          <svg v-if="!searchOpen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <RouterLink :to="token ? { name: 'profile' } : { name: 'login' }" class="icon-btn" title="Личный кабинет">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span v-if="token" class="profile-dot"></span>
      </RouterLink>
      <RouterLink :to="{ name: 'wishlist' }" class="icon-btn wishlist-btn" title="Избранное">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <span v-if="wishlistCount > 0" class="cart-badge">{{ wishlistCount }}</span>
      </RouterLink>
      <RouterLink :to="{ name: 'cart' }" class="icon-btn cart-btn" title="Корзина">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span v-if="cartCount2 > 0" class="cart-badge">{{ cartCount2 }}</span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.promo-bar {
  background: var(--black);
  color: var(--white);
  text-align: center;
  padding: 9px 20px;
  font-size: 11px;
  letter-spacing: 0.12em;
  font-weight: 500;
}

.header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--white);
  z-index: 200;
}

.logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 0.35em;
  color: var(--black);
  text-align: center;
  text-transform: uppercase;
}

.nav { display: flex; align-items: center; gap: 20px; }
.nav--right { justify-content: flex-end; }

.nav-link {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gray-dark);
  transition: color .2s;
  white-space: nowrap;
}
.nav-link:hover { color: var(--black); }
.nav-link.router-link-active { color: var(--black); }
.nav-link--admin { color: var(--black); font-weight: 600; }
.nav-link--sale { color: #c0392b; }

.role-switcher { display: flex; border: 1px solid var(--border); overflow: hidden; }
.role-btn { padding: 4px 10px; background: transparent; border: none; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-mid); transition: all .2s; cursor: pointer; }
.role-btn.active { background: var(--black); color: var(--white); }
.icon-btn { position: relative; background: none; border: none; color: var(--black); display: flex; align-items: center; justify-content: center; padding: 4px; transition: opacity .2s; cursor: pointer; }
.icon-btn:hover { opacity: 0.5; }
.profile-dot { position: absolute; top: 2px; right: 2px; width: 6px; height: 6px; background: var(--black); border-radius: 50%; }
.cart-btn { position: relative; }
.cart-badge { position: absolute; top: -4px; right: -6px; background: var(--black); color: var(--white); font-size: 9px; font-weight: 700; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

.search-inline { display: flex; align-items: center; gap: 0; }
.search-inline-input {
  width: 0;
  border: none;
  border-bottom: 1px solid var(--black);
  padding: 2px 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--black);
  background: transparent;
  outline: none;
  transition: width .25s ease;
  overflow: hidden;
}
.search-inline--open .search-inline-input { width: 160px; padding: 2px 8px 2px 0; }
.search-inline-input::placeholder { color: var(--gray-light); letter-spacing: 0.06em; }
.search-inline-btn { background: none; border: none; color: var(--black); cursor: pointer; display: flex; align-items: center; padding: 4px; transition: opacity .2s; }
.search-inline-btn:hover { opacity: 0.5; }
</style>
