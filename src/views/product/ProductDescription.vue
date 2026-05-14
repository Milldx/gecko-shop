<script setup>
defineProps({ product: Object })
</script>
<template>
  <p v-if="product" class="text">{{ product.description }}</p>
</template>
<style scoped>
.text { font-size: 13px; line-height: 1.85; color: var(--gray-dark); padding-top: 18px; }
</style>
