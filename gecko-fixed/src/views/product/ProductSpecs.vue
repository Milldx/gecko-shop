<script setup>
import { ref } from 'vue'

const props = defineProps({ product: Object })

const list = ref([])

if (props.product && props.product.specs) {
  list.value = props.product.specs.split('·').map(function(s) { return s.trim() }).filter(Boolean)
}
</script>
<template>
  <ul class="list">
    <li v-for="(s, i) in list" :key="i">{{ s }}</li>
    <li v-if="!list.length" class="empty">Не указано</li>
  </ul>
</template>
<style scoped>
.list { list-style: none; padding: 18px 0 0; }
.list li { font-size: 13px; color: var(--gray-dark); padding: 10px 0; border-bottom: 1px solid var(--border); }
.list li:last-child { border-bottom: none; }
.empty { color: var(--gray-light); }
</style>
