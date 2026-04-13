<template>
  <div class="delivery-page">

    <div class="delivery-hero">
      <h1 class="delivery-title">Доставка и оплата</h1>
      <p class="delivery-sub">Доставляем по всей России — выберите удобный способ получения и оплаты</p>
    </div>

    <!-- Способы доставки -->
    <div class="section">
      <h2 class="section-title">Способы доставки</h2>

      <div class="delivery-cards">

        <div class="d-card">
          <div class="d-card-head">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span class="d-card-name">Курьерская доставка</span>
          </div>
          <p class="d-card-time">1–3 рабочих дня</p>
          <ul class="d-card-list">
            <li>Стоимость доставки — <strong>500 ₽</strong></li>
            <li>Бесплатно при заказе от <strong>10 000 ₽</strong></li>
            <li>Для участников SILVER — бесплатно от <strong>5 000 ₽</strong></li>
            <li>Для участников GOLD — бесплатно от <strong>3 000 ₽</strong></li>
            <li>Для участников PLATINUM — <strong>всегда бесплатно</strong></li>
          </ul>
        </div>

        <div class="d-card">
          <div class="d-card-head">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="d-card-name">Самовывоз</span>
          </div>
          <p class="d-card-time">Готов к выдаче через 1–2 дня</p>
          <ul class="d-card-list">
            <li><strong>Бесплатно</strong> для всех заказов</li>
            <li>Уведомление о готовности на e-mail</li>
            <li>Хранение заказа — <strong>7 дней</strong></li>
          </ul>
        </div>

        <div class="d-card">
          <div class="d-card-head">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.45 19.45 0 0 1-6-6 19.79 19.79 0 0 1-3.93-8.41A2 2 0 0 1 3.44 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.72-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.28 17z"/></svg>
            <span class="d-card-name">Почта России</span>
          </div>
          <p class="d-card-time">5–14 рабочих дней</p>
          <ul class="d-card-list">
            <li>Стоимость доставки — <strong>350 ₽</strong></li>
            <li>Доставка в любой населённый пункт России</li>
            <li>Трек-номер для отслеживания</li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Способы оплаты -->
    <div class="section">
      <h2 class="section-title">Способы оплаты</h2>

      <div class="payment-grid">

        <div class="p-item">
          <div class="p-item-head">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <span>Банковская карта</span>
          </div>
          <p class="p-item-desc">Visa, Mastercard, Мир. Оплата производится в защищённой форме при оформлении заказа. Данные карты не сохраняются на наших серверах.</p>
        </div>

        <div class="p-item">
          <div class="p-item-head">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            <span>СБП</span>
          </div>
          <p class="p-item-desc">Система быстрых платежей — моментальное списание, без комиссии. Доступно для всех банков — участников системы.</p>
        </div>

        <div class="p-item">
          <div class="p-item-head">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>
            <span>Наличными</span>
          </div>
          <p class="p-item-desc">Оплата курьеру при получении. Доступно только для курьерской доставки. Убедитесь, что у вас есть сдача на нужную сумму.</p>
        </div>

      </div>
    </div>

    <!-- FAQ -->
    <div class="section">
      <h2 class="section-title">Часто задаваемые вопросы</h2>
      <div class="faq-list">
        <div class="faq-item">
          <p class="faq-q">Можно ли изменить адрес доставки после оформления заказа?</p>
          <p class="faq-a">Да, если заказ ещё не передан в службу доставки. Свяжитесь с нами в течение 2 часов после оформления.</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">Как отследить статус заказа?</p>
          <p class="faq-a">После отправки заказа вам придёт уведомление на e-mail с трек-номером. Также статус доступен в личном кабинете в разделе «История заказов».</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">Доставляете ли вы в другие страны?</p>
          <p class="faq-a">На данный момент доставка осуществляется только по территории России. Международная доставка находится в разработке.</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">Что делать, если товар пришёл с дефектом?</p>
          <p class="faq-a">Сфотографируйте дефект и свяжитесь с нашей службой поддержки. Мы организуем бесплатный возврат и полностью возместим стоимость товара.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.delivery-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.delivery-hero {
  padding: 60px 0 50px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 60px;
}

.delivery-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 42px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--black);
  margin-bottom: 14px;
}

.delivery-sub {
  font-size: 13px;
  color: var(--gray-mid);
  line-height: 1.8;
  letter-spacing: 0.03em;
}

/* Секции */
.section {
  margin-bottom: 70px;
  padding-bottom: 70px;
  border-bottom: 1px solid var(--border);
}
.section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--black);
  margin-bottom: 32px;
}

/* Карточки доставки */
.delivery-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.d-card {
  border: 1px solid var(--border);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.d-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--black);
}

.d-card-name {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.d-card-time {
  font-size: 11px;
  color: var(--gray-mid);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.d-card-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.d-card-list li {
  font-size: 12px;
  color: var(--gray-dark);
  line-height: 1.6;
  padding-left: 12px;
  position: relative;
}

.d-card-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--gray-light);
  font-size: 10px;
}

/* Оплата */
.payment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.p-item {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  border: 1px solid var(--border);
}

.p-item-head {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--black);
}

.p-item-desc {
  font-size: 12px;
  color: var(--gray-mid);
  line-height: 1.8;
}

/* FAQ */
.faq-list { display: flex; flex-direction: column; }

.faq-item {
  padding: 24px 0;
  border-bottom: 1px solid var(--border);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.faq-item:first-child { border-top: 1px solid var(--border); }

.faq-q {
  font-size: 13px;
  font-weight: 500;
  color: var(--black);
  line-height: 1.5;
}

.faq-a {
  font-size: 12px;
  color: var(--gray-mid);
  line-height: 1.8;
}
</style>
