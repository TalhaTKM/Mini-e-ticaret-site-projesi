/* =====================================================================
   reviews.js — Yorum ve yıldız sistemi (App üzerinden)
   ===================================================================== */
(function (global) {
  'use strict';
  const App = global.App;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function formatDate(iso) {
    try { return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }); }
    catch (e) { return ''; }
  }

  function render(container, product) {
    if (!container) return;
    const stats = App.getReviewStats(product.id);
    const list = App.getProductReviews(product.id);

    container.innerHTML =
      '<section class="detail-block">' +
        '<h2 class="detail-block__title">Değerlendirmeler ve Yorumlar</h2>' +
        '<div class="reviews-summary">' +
          '<div class="reviews-summary__score">' +
            '<div class="reviews-summary__average">' + stats.average.toFixed(1) + '</div>' +
            App.starsHTML(stats.average) +
            '<div class="reviews-summary__count">' + stats.count + ' değerlendirme</div>' +
          '</div>' +
          '<div class="rating-bars">' + buildBars(stats) + '</div>' +
        '</div>' +

        '<form class="review-form" id="reviewForm" novalidate>' +
          '<h3>Yorum Yaz</h3>' +
          '<div class="form-field form-field--full" style="margin-bottom:14px">' +
            '<label>Puanınız</label>' +
            '<div class="star-picker" id="starPicker" role="radiogroup" aria-label="Puan seçin">' +
              [1,2,3,4,5].map(n => '<button type="button" data-star="' + n + '" role="radio" aria-checked="false" aria-label="' + n + ' yıldız">★</button>').join('') +
            '</div>' +
            '<span class="field-error" id="err-rating">Lütfen 1–5 arası bir puan seçin.</span>' +
          '</div>' +
          '<div class="form-grid">' +
            '<div class="form-field">' +
              '<label for="reviewName">Adınız</label>' +
              '<input type="text" id="reviewName" placeholder="Örn. Ayşe Y." maxlength="40" autocomplete="name">' +
              '<span class="field-error">En az 2 karakter girin.</span>' +
            '</div>' +
            '<div class="form-field">' +
              '<label for="reviewTitle">Yorum Başlığı</label>' +
              '<input type="text" id="reviewTitle" placeholder="Kısa bir başlık" maxlength="70">' +
              '<span class="field-error">En az 3 karakter girin.</span>' +
            '</div>' +
            '<div class="form-field form-field--full">' +
              '<label for="reviewText">Yorumunuz</label>' +
              '<textarea id="reviewText" placeholder="Ürünle ilgili deneyiminizi paylaşın…" maxlength="600"></textarea>' +
              '<span class="field-error">En az 10 karakter girin.</span>' +
            '</div>' +
          '</div>' +
          '<button type="submit" class="btn btn--primary" style="margin-top:16px">Yorumu Gönder</button>' +
        '</form>' +

        '<div class="review-list" id="reviewList">' + buildReviewList(list) + '</div>' +
      '</section>';

    bindPicker(container);
    bindForm(container, product);
  }

  function buildBars(stats) {
    let html = '';
    const total = stats.count || 1;
    for (let star = 5; star >= 1; star--) {
      const count = stats.distribution[star] || 0;
      const percent = Math.round((count / total) * 100);
      html +=
        '<div class="rating-bar">' +
          '<span class="rating-bar__label">' + star + ' ★</span>' +
          '<span class="rating-bar__track"><span class="rating-bar__fill" style="width:' + percent + '%"></span></span>' +
          '<span class="rating-bar__value">' + count + '</span>' +
        '</div>';
    }
    return html;
  }

  function buildReviewList(list) {
    if (!list.length) return '<p style="color:var(--muted);font-size:.9rem;text-align:center;padding:20px 0">Henüz yorum yapılmamış. İlk yorumu siz yazın!</p>';
    return list.map(r => {
      const initials = r.name.split(' ').map(p => p.charAt(0)).join('').slice(0, 2).toLocaleUpperCase('tr-TR');
      return (
        '<article class="review-item">' +
          '<div class="review-item__head">' +
            '<span class="review-item__avatar">' + App.escapeHTML(initials || '?') + '</span>' +
            '<span class="review-item__name">' + App.escapeHTML(r.name) + '</span>' +
            App.starsHTML(r.rating) +
            (r.demo ? '<span class="demo-tag">Demo yorumu</span>' : '') +
            '<span class="review-item__date">' + App.escapeHTML(formatDate(r.date)) + '</span>' +
          '</div>' +
          '<h4 class="review-item__title">' + App.escapeHTML(r.title) + '</h4>' +
          '<p class="review-item__text">' + App.escapeHTML(r.text) + '</p>' +
        '</article>'
      );
    }).join('');
  }

  function bindPicker(container) {
    const picker = container.querySelector('#starPicker');
    if (!picker) return;
    const buttons = Array.from(picker.querySelectorAll('[data-star]'));
    let selected = 0;

    function paint(v) { buttons.forEach(b => { const s = Number(b.getAttribute('data-star')); b.classList.toggle('is-active', s <= v); b.setAttribute('aria-checked', s === v ? 'true' : 'false'); }); }

    buttons.forEach(b => {
      b.addEventListener('click', () => {
        selected = Number(b.getAttribute('data-star'));
        paint(selected);
        picker.setAttribute('data-value', String(selected));
        picker.closest('.form-field').classList.remove('has-error');
      });
      b.addEventListener('mouseenter', () => paint(Number(b.getAttribute('data-star'))));
    });
    picker.addEventListener('mouseleave', () => paint(selected));
    picker.setAttribute('data-value', '0');
  }

  function bindForm(container, product) {
    const form = container.querySelector('#reviewForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const picker = container.querySelector('#starPicker');
      const rating = Number(picker ? picker.getAttribute('data-value') : 0);
      const nameInput = container.querySelector('#reviewName');
      const titleInput = container.querySelector('#reviewTitle');
      const textInput = container.querySelector('#reviewText');
      const name = nameInput.value.trim();
      const title = titleInput.value.trim();
      const text = textInput.value.trim();

      let ok = true;
      const setErr = (el, bad) => { if (el) el.classList.toggle('has-error', !!bad); };

      setErr(picker && picker.closest('.form-field'), rating < 1); if (rating < 1) ok = false;
      setErr(nameInput.closest('.form-field'), name.length < 2); if (name.length < 2) ok = false;
      setErr(titleInput.closest('.form-field'), title.length < 3); if (title.length < 3) ok = false;
      setErr(textInput.closest('.form-field'), text.length < 10); if (text.length < 10) ok = false;

      if (!ok) { App.toast('Lütfen tüm alanları doğru şekilde doldurun.', 'error'); return; }

      App.addProductReview(product.id, { name, title, text, rating });
      App.toast('Yorumunuz kaydedildi. Teşekkürler!', 'success');

      // Ürün sayfasındaki reviewCount + rating güncellemesi için render tekrarı
      const root = document.getElementById('reviewsRoot');
      render(root, product);

      // Üstteki rating özetini de yenile
      if (typeof global.Products !== 'undefined' && global.Products.refreshProductStats) {
        global.Products.refreshProductStats(product);
      }

      const list = document.getElementById('reviewList');
      if (list) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  global.Reviews = { render, getStats: App.getReviewStats };
})(window);