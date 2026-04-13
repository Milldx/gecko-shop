<template>
  <div class="loyalty">

    <div class="loyalty-hero">
      <h1 class="loyalty-title">Программа лояльности</h1>
      <p class="loyalty-sub">Покупайте и получайте привилегии — чем больше вы с нами, тем выгоднее каждая покупка</p>
    </div>

    <!-- Уровни -->
    <div class="levels-section">
      <h2 class="section-title">Уровни программы</h2>
      <div class="levels-grid">

        <div class="level-card">
          <div class="level-badge level-badge--silver">SILVER</div>
          <p class="level-from">от 20 000 ₽</p>
          <ul class="level-perks">
            <li>Скидка 5% на все заказы</li>
            <li>Бесплатная доставка от 5 000 ₽</li>
            <li>Доступ к акциям и распродажам</li>
          </ul>
        </div>

        <div class="level-card level-card--featured">
          <div class="level-badge level-badge--gold">GOLD</div>
          <p class="level-from">от 50 000 ₽</p>
          <ul class="level-perks">
            <li>Скидка 10% на все заказы</li>
            <li>Бесплатная доставка от 3 000 ₽</li>
            <li>Ранний доступ к новым коллекциям</li>
            <li>Приоритетная поддержка</li>
          </ul>
        </div>

        <div class="level-card">
          <div class="level-badge level-badge--platinum">PLATINUM</div>
          <p class="level-from">от 100 000 ₽</p>
          <ul class="level-perks">
            <li>Скидка 15% на все заказы</li>
            <li>Бесплатная доставка на все заказы</li>
            <li>Подарок ко дню рождения</li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Как это работает -->
    <div class="how-section">
      <h2 class="section-title">Как это работает</h2>
      <div class="steps-grid">
        <div class="step">
          <span class="step-num">01</span>
          <p class="step-name">Зарегистрируйтесь</p>
          <p class="step-desc">Создайте аккаунт на сайте — вы автоматически становитесь участником программы</p>
        </div>
        <div class="step">
          <span class="step-num">02</span>
          <p class="step-name">Совершайте покупки</p>
          <p class="step-desc">Сумма всех оплаченных заказов накапливается на вашем счёте и определяет ваш уровень</p>
        </div>
        <div class="step">
          <span class="step-num">03</span>
          <p class="step-name">Получайте привилегии</p>
          <p class="step-desc">При достижении порога уровень повышается автоматически — скидки начинают действовать сразу</p>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="faq-section">
      <h2 class="section-title">Вопросы и ответы</h2>
      <div class="faq-list">
        <div class="faq-item">
          <p class="faq-q">Как долго действует статус?</p>
          <p class="faq-a">Статус действует в течение 12 месяцев с момента достижения порога. Для его сохранения достаточно совершить покупки на необходимую сумму в течение года.</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">Засчитываются ли возвращённые товары?</p>
          <p class="faq-a">Сумма возвращённых товаров вычитается из накопленной суммы покупок. Если после вычета ваш уровень снизится, новый статус вступит в силу со следующего заказа.</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">Где узнать свой текущий статус?</p>
          <p class="faq-a">Текущий уровень и накопленная сумма покупок отображаются в личном кабинете в разделе «Мои данные».</p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="loyalty-cta">
      <p class="cta-text">Ещё не с нами?</p>
      <RouterLink :to="{ name: 'register' }" class="cta-btn">Зарегистрироваться</RouterLink>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.loyalty {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.loyalty-hero {
  padding: 60px 0 50px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 60px;
}

.loyalty-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 42px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--black);
  margin-bottom: 14px;
}

.loyalty-sub {
  font-size: 13px;
  color: var(--gray-mid);
  line-height: 1.8;
  max-width: 560px;
  letter-spacing: 0.03em;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--black);
  margin-bottom: 32px;
}

/* ── Уровни ── */
.levels-section { margin-bottom: 70px; }

.levels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.level-card {
  border: 1px solid var(--border);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.level-card--featured {
  border-color: var(--black);
  background: var(--black);
  color: var(--white);
}

.level-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  padding: 5px 12px;
  border: 1px solid currentColor;
  width: fit-content;
}

.level-badge--silver  { color: #999; border-color: #ccc; }
.level-badge--gold    { color: #c9a84c; border-color: #c9a84c; }
.level-badge--platinum { color: #7a8ba6; border-color: #7a8ba6; }
.level-card--featured .level-badge--gold { color: #e8c96d; border-color: #e8c96d; }

.level-from {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0.04em;
}
.level-card--featured .level-from { color: var(--white); }

.level-perks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.level-perks li {
  font-size: 12px;
  color: var(--gray-dark);
  padding-left: 14px;
  position: relative;
  line-height: 1.5;
}
.level-perks li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--gray-light);
  font-size: 10px;
}
.level-card--featured .level-perks li { color: rgba(255,255,255,0.75); }
.level-card--featured .level-perks li::before { color: rgba(255,255,255,0.3); }

/* ── Как работает ── */
.how-section { margin-bottom: 70px; padding-top: 60px; border-top: 1px solid var(--border); }

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.step { display: flex; flex-direction: column; gap: 12px; }

.step-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 400;
  color: var(--border);
  line-height: 1;
}

.step-name {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--black);
}

.step-desc {
  font-size: 12px;
  color: var(--gray-mid);
  line-height: 1.7;
}

/* ── FAQ ── */
.faq-section { margin-bottom: 70px; padding-top: 60px; border-top: 1px solid var(--border); }
.faq-list { display: flex; flex-direction: column; }

.faq-item {
  padding: 24px 0;
  border-bottom: 1px solid var(--border);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.faq-q {
  font-size: 13px;
  font-weight: 500;
  color: var(--black);
  letter-spacing: 0.02em;
}

.faq-a {
  font-size: 12px;
  color: var(--gray-mid);
  line-height: 1.8;
}

/* ── CTA ── */
.loyalty-cta {
  padding-top: 60px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 32px;
}

.cta-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 400;
  color: var(--black);
}

.cta-btn {
  padding: 14px 40px;
  background: var(--black);
  color: var(--white);
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: background .2s;
  display: inline-block;
}
.cta-btn:hover { background: #333; }
</style>
