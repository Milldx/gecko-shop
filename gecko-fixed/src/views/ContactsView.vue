<template>
  <div class="contacts-page">

    <div class="page-hero">
      <h1 class="page-title">Контакты</h1>
      <p class="page-sub">Мы всегда на связи — выберите удобный способ обращения</p>
    </div>

    <div class="contacts-layout">

      <!-- Левая колонка: карточки -->
      <div class="contacts-left">

        <div class="contact-card">
          <div class="contact-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div class="contact-card-body">
            <p class="contact-card-label">Email</p>
            <a href="mailto:support@gecko.ru" class="contact-card-value">support@gecko.ru</a>
            <p class="contact-card-hint">Отвечаем в течение 24 часов</p>
          </div>
        </div>

        <div class="contact-card">
          <div class="contact-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.45 19.45 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div class="contact-card-body">
            <p class="contact-card-label">Телефон</p>
            <a href="tel:+74951234567" class="contact-card-value">+7 (495) 123-45-67</a>
            <p class="contact-card-hint">Пн–Пт, 10:00–20:00 (МСК)</p>
          </div>
        </div>

        <div class="contact-card">
          <div class="contact-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="contact-card-body">
            <p class="contact-card-label">Мессенджеры</p>
            <div class="messengers">
              <a href="#" class="messenger-link">Telegram</a>
              <span class="messenger-sep">·</span>
              <a href="#" class="messenger-link">WhatsApp</a>
              <span class="messenger-sep">·</span>
              <a href="#" class="messenger-link">VK</a>
            </div>
            <p class="contact-card-hint">Быстрые ответы в рабочее время</p>
          </div>
        </div>

        <div class="contact-card">
          <div class="contact-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="contact-card-body">
            <p class="contact-card-label">Адрес офиса</p>
            <p class="contact-card-value">Москва, ул. Тверская, 10</p>
            <p class="contact-card-hint">Только для корреспонденции, розничной торговли нет</p>
          </div>
        </div>

      </div>

      <!-- Правая колонка: форма -->
      <div class="contacts-right">
        <h2 class="form-heading">Написать нам</h2>
        <p class="form-sub">Оставьте сообщение и мы свяжемся с вами в ближайшее время</p>

        <div v-if="sent" class="form-success">
          <div class="success-icon">✓</div>
          <p class="success-text">Сообщение отправлено! Мы ответим вам в течение 24 часов.</p>
          <button class="btn-ghost" @click="resetForm">Отправить ещё</button>
        </div>

        <div v-else class="contact-form">
          <div class="form-row-2">
            <div class="form-field">
              <label>Имя *</label>
              <input v-model="form.name" type="text" placeholder="Иван Иванов" :class="{ error: errors.name }" @input="errors.name = ''" />
              <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
            </div>
            <div class="form-field">
              <label>Email *</label>
              <input v-model="form.email" type="email" placeholder="mail@example.com" :class="{ error: errors.email }" @input="errors.email = ''" />
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>
          </div>
          <div class="form-field">
            <label>Тема</label>
            <select v-model="form.topic" class="form-select">
              <option value="">Выберите тему</option>
              <option value="order">Вопрос по заказу</option>
              <option value="return">Возврат и обмен</option>
              <option value="delivery">Доставка</option>
              <option value="product">Вопрос о товаре</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div class="form-field">
            <label>Сообщение *</label>
            <textarea v-model="form.message" placeholder="Опишите ваш вопрос..." class="form-textarea" :class="{ error: errors.message }" @input="errors.message = ''"></textarea>
            <span v-if="errors.message" class="field-error">{{ errors.message }}</span>
          </div>
          <button class="btn-submit" @click="submitForm">Отправить</button>
        </div>
      </div>

    </div>

    <!-- Режим работы -->
    <div class="schedule-section">
      <h2 class="section-title">Режим работы поддержки</h2>
      <div class="schedule-grid">
        <div class="schedule-row">
          <span class="schedule-day">Понедельник — пятница</span>
          <span class="schedule-time">10:00 — 20:00</span>
        </div>
        <div class="schedule-row">
          <span class="schedule-day">Суббота</span>
          <span class="schedule-time">11:00 — 18:00</span>
        </div>
        <div class="schedule-row">
          <span class="schedule-day">Воскресенье</span>
          <span class="schedule-time">Выходной</span>
        </div>
      </div>
      <p class="schedule-note">Обращения, поступившие в нерабочее время, обрабатываются на следующий рабочий день</p>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const sent = ref(false)

const form = reactive({
  name: '',
  email: '',
  topic: '',
  message: '',
})

const errors = reactive({
  name: '',
  email: '',
  message: '',
})

function submitForm() {
  errors.name = ''
  errors.email = ''
  errors.message = ''
  let ok = true

  if (!form.name.trim()) { errors.name = 'Введите имя'; ok = false }
  if (!form.email.trim() || !form.email.includes('@')) { errors.email = 'Введите корректный email'; ok = false }
  if (!form.message.trim()) { errors.message = 'Введите сообщение'; ok = false }

  if (!ok) return
  sent.value = true
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.topic = ''
  form.message = ''
  errors.name = ''
  errors.email = ''
  errors.message = ''
  sent.value = false
}
</script>

<style scoped>
.contacts-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.page-hero {
  padding: 60px 0 50px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 60px;
}

.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 42px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--black);
  margin-bottom: 14px;
}

.page-sub {
  font-size: 13px;
  color: var(--gray-mid);
  line-height: 1.8;
}

/* Основной лейаут */
.contacts-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 60px;
  margin-bottom: 70px;
  padding-bottom: 70px;
  border-bottom: 1px solid var(--border);
}

/* Карточки контактов */
.contacts-left {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.contact-card {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  padding: 22px 0;
  border-bottom: 1px solid var(--border);
}
.contact-card:first-child { border-top: 1px solid var(--border); }

.contact-card-icon {
  color: var(--black);
  flex-shrink: 0;
  margin-top: 2px;
}

.contact-card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-card-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gray-mid);
}

.contact-card-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  transition: opacity .2s;
}
a.contact-card-value:hover { opacity: 0.6; }

.contact-card-hint {
  font-size: 11px;
  color: var(--gray-light);
  margin-top: 2px;
}

.messengers {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.messenger-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  transition: opacity .2s;
}
.messenger-link:hover { opacity: 0.6; }
.messenger-sep { color: var(--gray-light); }

/* Форма */
.contacts-right { display: flex; flex-direction: column; gap: 0; }

.form-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 400;
  color: var(--black);
  margin-bottom: 8px;
}

.form-sub {
  font-size: 12px;
  color: var(--gray-mid);
  margin-bottom: 28px;
  line-height: 1.6;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.form-field:last-child { margin-bottom: 0; }

.form-field label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gray-mid);
}

.form-field input,
.form-select,
.form-textarea {
  border: 1px solid var(--border);
  padding: 11px 13px;
  font-size: 13px;
  font-family: 'Montserrat', sans-serif;
  color: var(--black);
  background: var(--white);
  transition: border-color .2s;
  width: 100%;
  box-sizing: border-box;
}

.form-field input:focus,
.form-select:focus,
.form-textarea:focus { outline: none; border-color: var(--black); }

.form-field input.error,
.form-textarea.error { border-color: #e53935; }

.form-select { cursor: pointer; }

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.field-error { font-size: 11px; color: #e53935; margin-top: -2px; }

.btn-submit {
  margin-top: 8px;
  padding: 14px 40px;
  background: var(--black);
  color: var(--white);
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background .2s;
  width: 100%;
}
.btn-submit:hover { background: #333; }

/* Успех */
.form-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 0;
  text-align: center;
}

.success-icon {
  width: 56px;
  height: 56px;
  border: 2px solid var(--black);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.success-text {
  font-size: 13px;
  color: var(--gray-dark);
  line-height: 1.7;
  max-width: 320px;
}

.btn-ghost {
  background: none;
  border: 1px solid var(--border);
  padding: 11px 28px;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gray-mid);
  cursor: pointer;
  transition: all .2s;
}
.btn-ghost:hover { border-color: var(--black); color: var(--black); }

/* Режим работы */
.schedule-section { }

.section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--black);
  margin-bottom: 24px;
}

.schedule-grid {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-bottom: 16px;
}

.schedule-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.schedule-row:first-child { border-top: 1px solid var(--border); }

.schedule-day {
  font-size: 13px;
  color: var(--black);
}

.schedule-time {
  font-size: 13px;
  font-weight: 600;
  color: var(--black);
}

.schedule-note {
  font-size: 11px;
  color: var(--gray-mid);
  line-height: 1.7;
  max-width: 440px;
}
</style>
