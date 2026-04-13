<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <div class="nf">
    <p class="nf-code">404</p>
    <p class="nf-text">Страница не найдена</p>
    <button @click="router.push({ name: 'home' })">На главную</button>
  </div>
</template>
<style scoped>
.nf { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 40px; gap: 20px; text-align: center; }
.nf-code { font-family: 'Cormorant Garamond', serif; font-size: 120px; font-weight: 300; line-height: 1; color: var(--border); }
.nf-text { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gray-mid); }
button { padding: 13px 40px; background: var(--black); color: var(--white); border: none; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; }
</style>
