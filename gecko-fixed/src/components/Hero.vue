<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <section class="hero">
    <div class="hero-inner">
      <p class="hero-sub">Весенняя коллекция</p>
      <h1 class="hero-title">Весна —<br><em>2026</em></h1>
      <button class="hero-btn" @click="router.push({ name: 'new-arrivals' })">Смотреть коллекцию</button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 82vh;
  min-height: 500px;
  display: flex;
  align-items: flex-end;
  background-image: url('/src/assets/img/hero-banner.jpeg');
  background-size: cover;
  background-position: center top;
  overflow: hidden;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 60%);
}

.hero-inner {
  position: relative;
  z-index: 2;
  padding: 0 60px 60px;
  color: #fff;
}

.hero-sub {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 14px;
  opacity: 0.8;
}

.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(48px, 7vw, 90px);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin-bottom: 32px;
}
.hero-title em {
  font-style: italic;
  font-weight: 300;
}

.hero-btn {
  display: inline-block;
  padding: 13px 36px;
  background: #fff;
  color: #111;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: background .2s, color .2s;
}
.hero-btn:hover {
  background: #111;
  color: #fff;
}
</style>
