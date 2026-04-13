<script setup>
import { ref } from 'vue'

const activeTab = ref('women')

const womenClothes = [
  { size: 'XS', ru: '40–42', bust: '80–84', waist: '62–66', hips: '88–92' },
  { size: 'S',  ru: '42–44', bust: '84–88', waist: '66–70', hips: '92–96' },
  { size: 'M',  ru: '44–46', bust: '88–92', waist: '70–74', hips: '96–100' },
  { size: 'L',  ru: '46–48', bust: '92–96', waist: '74–78', hips: '100–104' },
  { size: 'XL', ru: '48–50', bust: '96–100', waist: '78–82', hips: '104–108' },
  { size: 'XXL',ru: '50–52', bust: '100–104', waist: '82–86', hips: '108–112' },
]

const menClothes = [
  { size: 'XS', ru: '44',    chest: '84–88',  waist: '70–74',  hips: '88–92'   },
  { size: 'S',  ru: '46',    chest: '88–92',  waist: '74–78',  hips: '92–96'   },
  { size: 'M',  ru: '48',    chest: '92–96',  waist: '78–82',  hips: '96–100'  },
  { size: 'L',  ru: '50',    chest: '96–100', waist: '82–86',  hips: '100–104' },
  { size: 'XL', ru: '52',    chest: '100–104',waist: '86–90',  hips: '104–108' },
  { size: 'XXL',ru: '54–56', chest: '104–110',waist: '90–96',  hips: '108–114' },
]

const womenShoes = [
  { ru: '35', eu: '35', cm: '22.5' },
  { ru: '36', eu: '36', cm: '23'   },
  { ru: '37', eu: '37', cm: '23.5' },
  { ru: '38', eu: '38', cm: '24.5' },
  { ru: '39', eu: '39', cm: '25'   },
  { ru: '40', eu: '40', cm: '25.5' },
  { ru: '41', eu: '41', cm: '26.5' },
]

const menShoes = [
  { ru: '39', eu: '39', cm: '25'   },
  { ru: '40', eu: '40', cm: '25.5' },
  { ru: '41', eu: '41', cm: '26.5' },
  { ru: '42', eu: '42', cm: '27'   },
  { ru: '43', eu: '43', cm: '27.5' },
  { ru: '44', eu: '44', cm: '28.5' },
  { ru: '45', eu: '45', cm: '29'   },
]
</script>

<template>
  <div class="size-guide">

    <div class="size-guide-hero">
      <h1 class="size-guide-title">Таблица размеров</h1>
      <p class="size-guide-sub">Чтобы выбрать идеальный размер, измерьте себя и сверьтесь с таблицей</p>
    </div>

    <!-- Переключатель Женщинам / Мужчинам -->
    <div class="sg-tabs">
      <button
        :class="['sg-tab', { 'sg-tab--active': activeTab === 'women' }]"
        @click="activeTab = 'women'"
      >Женщинам</button>
      <button
        :class="['sg-tab', { 'sg-tab--active': activeTab === 'men' }]"
        @click="activeTab = 'men'"
      >Мужчинам</button>
    </div>

    <div class="sg-content">

      <!-- Как снять мерки -->
      <div class="sg-measure">
        <h2 class="sg-section-title">Как снять мерки</h2>
        <div class="sg-measure-grid">
          <div class="sg-measure-item">
            <span class="sg-measure-num">01</span>
            <div>
              <p class="sg-measure-name">Обхват груди</p>
              <p class="sg-measure-desc">Измерьте по самой выступающей части груди, держа сантиметр параллельно полу</p>
            </div>
          </div>
          <div class="sg-measure-item">
            <span class="sg-measure-num">02</span>
            <div>
              <p class="sg-measure-name">Обхват талии</p>
              <p class="sg-measure-desc">Измерьте по самой узкой части талии, не затягивая сантиметр</p>
            </div>
          </div>
          <div class="sg-measure-item">
            <span class="sg-measure-num">03</span>
            <div>
              <p class="sg-measure-name">Обхват бёдер</p>
              <p class="sg-measure-desc">Измерьте по самой выступающей части бёдер, ноги вместе</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Таблица одежды -->
      <div class="sg-table-block">
        <h2 class="sg-section-title">Одежда</h2>
        <div class="sg-table-wrap">
          <table class="sg-table">
            <thead>
              <tr>
                <th>Размер</th>
                <th>RU</th>
                <th v-if="activeTab === 'women'">Обхват груди, см</th>
                <th v-if="activeTab === 'men'">Обхват груди, см</th>
                <th>Обхват талии, см</th>
                <th>Обхват бёдер, см</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="activeTab === 'women'" v-for="row in womenClothes" :key="row.size">
                <td class="sg-size-label">{{ row.size }}</td>
                <td>{{ row.ru }}</td>
                <td>{{ row.bust }}</td>
                <td>{{ row.waist }}</td>
                <td>{{ row.hips }}</td>
              </tr>
              <tr v-if="activeTab === 'men'" v-for="row in menClothes" :key="row.size">
                <td class="sg-size-label">{{ row.size }}</td>
                <td>{{ row.ru }}</td>
                <td>{{ row.chest }}</td>
                <td>{{ row.waist }}</td>
                <td>{{ row.hips }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Таблица обуви -->
      <div class="sg-table-block">
        <h2 class="sg-section-title">Обувь</h2>
        <div class="sg-table-wrap">
          <table class="sg-table">
            <thead>
              <tr>
                <th>RU</th>
                <th>EU</th>
                <th>Длина стопы, см</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="activeTab === 'women'" v-for="row in womenShoes" :key="row.ru">
                <td class="sg-size-label">{{ row.ru }}</td>
                <td>{{ row.eu }}</td>
                <td>{{ row.cm }}</td>
              </tr>
              <tr v-if="activeTab === 'men'" v-for="row in menShoes" :key="row.ru">
                <td class="sg-size-label">{{ row.ru }}</td>
                <td>{{ row.eu }}</td>
                <td>{{ row.cm }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Подсказка -->
      <div class="sg-tip">
        <p>Если ваши мерки находятся на границе двух размеров — выбирайте больший. При необходимости наши консультанты помогут с выбором.</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.size-guide {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.size-guide-hero {
  padding: 60px 0 40px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 40px;
}

.size-guide-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 42px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--black);
  margin-bottom: 12px;
}

.size-guide-sub {
  font-size: 13px;
  color: var(--gray-mid);
  letter-spacing: 0.04em;
}

/* Вкладки */
.sg-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 50px;
}

.sg-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding: 14px 28px 14px 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gray-mid);
  cursor: pointer;
  transition: color .2s;
}
.sg-tab:hover { color: var(--black); }
.sg-tab--active { color: var(--black); border-bottom-color: var(--black); }

.sg-content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.sg-section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--black);
  margin-bottom: 24px;
}

/* Как снять мерки */
.sg-measure-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.sg-measure-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.sg-measure-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 400;
  color: var(--border);
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
}

.sg-measure-name {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--black);
  margin-bottom: 8px;
}

.sg-measure-desc {
  font-size: 12px;
  color: var(--gray-mid);
  line-height: 1.7;
}

/* Таблица */
.sg-table-wrap {
  overflow-x: auto;
}

.sg-table {
  width: 100%;
  border-collapse: collapse;
}

.sg-table th {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gray-mid);
  text-align: left;
  padding: 0 20px 14px 0;
  border-bottom: 1px solid var(--border);
}

.sg-table td {
  font-size: 13px;
  color: var(--black);
  padding: 14px 20px 14px 0;
  border-bottom: 1px solid var(--gray-bg);
}

.sg-table tbody tr:hover td {
  background: var(--gray-bg);
}

.sg-size-label {
  font-weight: 600;
  letter-spacing: 0.06em;
}

/* Подсказка */
.sg-tip {
  border-left: 2px solid var(--black);
  padding: 0 0 0 20px;
}

.sg-tip p {
  font-size: 12px;
  color: var(--gray-mid);
  line-height: 1.8;
  letter-spacing: 0.03em;
}
</style>
