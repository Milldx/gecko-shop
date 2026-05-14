<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="footer-brand">
        <p class="footer-logo">GECKO</p>
        <p class="footer-tagline">Современная одежда для тех,<br>кто ценит стиль и качество</p>
      </div>

      <div class="footer-col">
        <h4>Покупателям</h4>
        <RouterLink :to="{ name: 'delivery' }">Доставка и оплата</RouterLink>
        <RouterLink :to="{ name: 'return' }">Возврат и обмен</RouterLink>
        <RouterLink :to="{ name: 'size-guide' }">Таблица размеров</RouterLink>
        <RouterLink :to="{ name: 'loyalty' }">Программа лояльности</RouterLink>
      </div>

      <div class="footer-col">
        <h4>Компания</h4>
        <RouterLink :to="{ name: 'about' }">О бренде</RouterLink>
        <RouterLink :to="{ name: 'contacts' }">Контакты</RouterLink>
        <RouterLink :to="{ name: 'press' }">Пресса</RouterLink>
      </div>

      <div class="footer-col">
        <h4>Соцсети</h4>
        <a href="#">Instagram</a>
        <a href="#">Telegram</a>
        <a href="#">VK</a>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© {{ year }} GECKO. Все права защищены.</span>
      <span>Пользовательское соглашение · Политика конфиденциальности</span>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  margin-top: 100px;
  background: var(--white);
}

.footer-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
  padding: 60px 60px 50px;
}

.footer-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.3em;
  margin-bottom: 16px;
}

.footer-tagline {
  font-size: 12px;
  color: var(--gray-mid);
  line-height: 1.7;
}

.footer-col h4 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 18px;
  color: var(--black);
}

.footer-col a {
  display: block;
  font-size: 12px;
  color: var(--gray-dark);
  margin-bottom: 10px;
  transition: color .2s;
}
.footer-col a:hover { color: var(--black); }

.footer-bottom {
  border-top: 1px solid var(--border);
  padding: 18px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--gray-mid);
  letter-spacing: 0.04em;
}
</style>
