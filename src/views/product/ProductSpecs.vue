<script setup>
import { computed } from 'vue'

const props = defineProps({ product: Object })

const compositionItems = computed(function() {
  if (!props.product) return []
  const raw = props.product.composition || props.product.specs || ''
  return raw.split(/[·;]/).map(function(s) { return s.trim() }).filter(Boolean)
})

const careItems = computed(function() {
  if (!props.product) return []
  const raw = props.product.care || ''
  return raw.split('·').map(function(s) { return s.trim() }).filter(Boolean)
})
</script>

<template>
  <div class="specs-wrap">
    <div v-if="compositionItems.length" class="specs-section">
      <p class="specs-section-title">Состав</p>
      <ul class="list">
        <li v-for="(s, i) in compositionItems" :key="'c' + i">{{ s }}</li>
      </ul>
    </div>

    <div v-if="careItems.length" class="specs-section">
      <p class="specs-section-title">Уход</p>
      <ul class="list">
        <li v-for="(s, i) in careItems" :key="'k' + i">{{ s }}</li>
      </ul>
    </div>

    <p v-if="!compositionItems.length && !careItems.length" class="empty">Не указано</p>
  </div>
</template>

<style scoped>
.specs-wrap { padding: 18px 0 0; }
.specs-section { margin-bottom: 24px; }
.specs-section:last-child { margin-bottom: 0; }
.specs-section-title {
  font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--gray-mid);
  margin-bottom: 2px; padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.list { list-style: none; padding: 0; margin: 0; }
.list li { font-size: 13px; color: var(--gray-dark); padding: 10px 0; border-bottom: 1px solid var(--border); }
.list li:last-child { border-bottom: none; }
.empty { font-size: 13px; color: var(--gray-light); padding: 10px 0; }
</style>
