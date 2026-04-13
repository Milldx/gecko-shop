<template>
  <div class="press-page">

    <div class="page-hero">
      <h1 class="page-title">Пресса</h1>
      <p class="page-sub">СМИ о нас — публикации, интервью и упоминания бренда GECKO</p>
    </div>

    <!-- Публикации -->
    <div class="press-section">
      <h2 class="section-title">Публикации</h2>
      <div class="press-list">

        <div class="press-item">
          <div class="press-meta">
            <span class="press-outlet">Vogue Russia</span>
            <span class="press-date">Март 2026</span>
          </div>
          <p class="press-title-text">«GECKO: минимализм как философия, а не тренд»</p>
          <p class="press-excerpt">Редакция Vogue рассказала об основателе бренда и о том, как небольшая московская марка стала одним из самых заметных имён в российском фэшн-пространстве.</p>
          <a href="#" class="press-link">Читать материал →</a>
        </div>

        <div class="press-item">
          <div class="press-meta">
            <span class="press-outlet">Forbes Style</span>
            <span class="press-date">Январь 2026</span>
          </div>
          <p class="press-title-text">«10 российских брендов, которые выросли без инвестиций»</p>
          <p class="press-excerpt">GECKO вошёл в подборку Forbes как пример органичного роста: от 12 позиций в первой коллекции до полноценного ассортимента из 300+ наименований за пять лет.</p>
          <a href="#" class="press-link">Читать материал →</a>
        </div>

        <div class="press-item">
          <div class="press-meta">
            <span class="press-outlet">Elle</span>
            <span class="press-date">Ноябрь 2025</span>
          </div>
          <p class="press-title-text">«Базовый гардероб: что покупать в 2026 году»</p>
          <p class="press-excerpt">Редакторы Elle включили несколько позиций GECKO в подборку must-have базовых вещей — в частности, пальто и трикотаж из осенне-зимней коллекции.</p>
          <a href="#" class="press-link">Читать материал →</a>
        </div>

        <div class="press-item">
          <div class="press-meta">
            <span class="press-outlet">Buro 24/7</span>
            <span class="press-date">Сентябрь 2025</span>
          </div>
          <p class="press-title-text">«Российские бренды, которые мы носим каждый день»</p>
          <p class="press-excerpt">Buro включил GECKO в число брендов, формирующих новый облик российской моды: доступно, качественно, без лишнего шума.</p>
          <a href="#" class="press-link">Читать материал →</a>
        </div>

        <div class="press-item">
          <div class="press-meta">
            <span class="press-outlet">RBC Style</span>
            <span class="press-date">Июнь 2025</span>
          </div>
          <p class="press-title-text">«Медленная мода: почему россияне выбирают качество»</p>
          <p class="press-excerpt">Основатель GECKO дал развёрнутое интервью о концепции slow fashion, производстве малыми партиями и отказе от агрессивного маркетинга.</p>
          <a href="#" class="press-link">Читать материал →</a>
        </div>

        <div class="press-item">
          <div class="press-meta">
            <span class="press-outlet">The Blueprint</span>
            <span class="press-date">Март 2025</span>
          </div>
          <p class="press-title-text">«Новая волна: марки, за которыми стоит следить»</p>
          <p class="press-excerpt">The Blueprint назвал GECKO одним из брендов новой волны, чья эстетика резонирует с запросом на вещи «вне времени» и честное производство.</p>
          <a href="#" class="press-link">Читать материал →</a>
        </div>

      </div>
    </div>

    <!-- Для СМИ -->
    <div class="media-section">
      <h2 class="section-title">Для представителей СМИ</h2>
      <div class="media-grid">
        <div class="media-block">
          <p class="media-block-title">Пресс-кит</p>
          <p class="media-block-desc">Логотипы, фотографии коллекций и описание бренда в высоком разрешении</p>
          <a href="#" class="media-btn">Скачать пресс-кит</a>
        </div>
        <div class="media-block">
          <p class="media-block-title">Связаться с PR-отделом</p>
          <p class="media-block-desc">По вопросам интервью, съёмок и партнёрских материалов</p>
          <a href="mailto:pr@gecko.ru" class="media-btn">pr@gecko.ru</a>
        </div>
        <div class="media-block">
          <p class="media-block-title">Образцы для съёмок</p>
          <p class="media-block-desc">Предоставляем образцы коллекций для редакционных и коммерческих съёмок</p>
          <a href="mailto:pr@gecko.ru" class="media-btn">Оставить заявку</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.press-page {
  max-width: 900px;
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

.section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--black);
  margin-bottom: 32px;
}

/* Публикации */
.press-section {
  margin-bottom: 70px;
  padding-bottom: 70px;
  border-bottom: 1px solid var(--border);
}

.press-list {
  display: flex;
  flex-direction: column;
}

.press-item {
  padding: 32px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.press-item:first-child { border-top: 1px solid var(--border); }

.press-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.press-outlet {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--black);
  border: 1px solid var(--border);
  padding: 3px 10px;
}

.press-date {
  font-size: 11px;
  color: var(--gray-light);
  letter-spacing: 0.06em;
}

.press-title-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 400;
  color: var(--black);
  line-height: 1.3;
}

.press-excerpt {
  font-size: 12px;
  color: var(--gray-mid);
  line-height: 1.8;
  max-width: 680px;
}

.press-link {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--black);
  text-transform: uppercase;
  transition: opacity .2s;
  width: fit-content;
}
.press-link:hover { opacity: 0.5; }

/* Для СМИ */
.media-section { }

.media-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.media-block {
  border: 1px solid var(--border);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.media-block-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--black);
  letter-spacing: 0.04em;
}

.media-block-desc {
  font-size: 12px;
  color: var(--gray-mid);
  line-height: 1.7;
  flex: 1;
}

.media-btn {
  display: inline-block;
  padding: 10px 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--black);
  border-bottom: 1px solid var(--black);
  transition: opacity .2s;
  width: fit-content;
}
.media-btn:hover { opacity: 0.5; }
</style>
