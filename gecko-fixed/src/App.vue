<script setup>
import { computed } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { cart } from './composebles/useGoods.js'

const cartCount = computed(function() { return cart.value.length })
</script>

<template>
  <Header :cartCount="cartCount" />
  <RouterView />
  <Footer />
</template>
