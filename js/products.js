/* =====================================================================
   products.js — Ürün kartları, ana sayfa, kategori, ürün detay (galeri+zoom)
   ===================================================================== */
(function (global) {
  'use strict';
  const App = global.App;

  /* ---------- ÜRÜN KARTI ---------- */
  function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const stats = App.getReviewStats(product.id);
    const discount = App.discountPercent(product.price, product.oldPrice);
    const outOfStock = Number(product.stock) <= 0;
    const fav = App.isFavorite(product.id);
    const image = (product.images && product.images[0]) || '';

    card.innerHTML =
      '<div class="product-card__media">' +
        '<a class="product-card__image-link" href="product.html?id=' + encodeURIComponent(product.id) + '" aria-label="' + App.escapeHTML(product.name) + '">' +
          '<img src="' + App.escapeHTML(image) + '" alt="' + App.escapeHTML(product.name) + '" loading="lazy">' +
        '</a>' +
        (discount ? '<span class="badge-discount">%' + discount + ' indirim</span>' : '') +
        (outOfStock ? '<span class="badge-stock">Stokta yok</span>' : '') +
        '<button type="button" class="fav-btn' + (fav ? ' is-active' : '') + '" data-fav-toggle="' + product.id + '" ' +
          'aria-label="Favorilere ekle" aria-pressed="' + (fav ? 'true' : 'false') + '">' + App.ICONS.heart + '</button>' +
      '</div>' +
      '<div class="product-card__body">' +
        '<span class="product-card__brand">' + App.escapeHTML(product.brand) + '</span>' +
        '<h3 class="product-card__title"><a href="product.html?id=' + encodeURIComponent(product.id) + '">' + App.escapeHTML(product.name) + '</a></h3>' +
        '<div class="product-card__rating">' +
          App.starsHTML(stats.average) +
          '<span class="product-card__reviews">(' + stats.count + ')</span>' +
        '</div>' +
        '<div class="product-card__prices">' +
          '<span class="price">' + App.formatPrice(product.price) + '</span>' +
          (Number(product.oldPrice) > Number(product.price) ? '<span class="price-old">' + App.formatPrice(product.oldPrice) + '</span>' : '') +
        '</div>' +
        '<button type="button" class="btn btn--primary btn--block" data-add-to-cart="' + product.id + '" ' +
          (outOfStock ? 'disabled' : '') + '>' + (outOfStock ? 'Stokta Yok' : 'Sepete Ekle') + '</button>' +
      '</div>';

    App.attachImageFallback(card.querySelector('img'));
    return card;
  }

  function renderProducts(container, list) {
    if (!container) return;
    container.innerHTML = '';
    if (!list || !list.length) {
      container.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1">' +
          '<div class="empty-state__icon">' + App.ICONS.box + '</div>' +
          '<h2>Ürün bulunamadı</h2>' +
          '<p>Aradığınız kriterlere uygun ürün bulunmuyor.</p>' +
          '<a class="btn btn--primary" href="category.html">Tüm Ürünleri Gör</a>' +
        '</div>';
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(p => frag.appendChild(createProductCard(p)));
    container.appendChild(frag);
  }

  const byNewest = (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  const byDiscount = (a, b) => App.discountPercent(b.price, b.oldPrice) - App.discountPercent(a.price, a.oldPrice);
  const byPopularity = (a, b) => App.getReviewStats(b.id).count - App.getReviewStats(a.id).count;

  /* ---------- ANA SAYFA ---------- */
  const CATEGORY_ICON_MAP = {
    'Elektronik': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path></svg>',
    'Giyim': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3l3 2 3-2 4 3-2 3v12H7V9L5 6z"></path></svg>',
    'Ev & Yaşam': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path><path d="M10 20v-5h4v5"></path></svg>',
    'Spor': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"></path></svg>',
    'Kozmetik': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3h4v4h-4z"></path><path d="M9 7h6l1 3v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10z"></path></svg>',
    'Aksesuar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="14" height="12" rx="2"></rect><path d="M9 8V5a3 3 0 0 1 6 0v3"></path></svg>',
    'Eğlence': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="9" cy="10" r="1"></circle><circle cx="15" cy="10" r="1"></circle><path d="M8 15c1.5 1.5 6.5 1.5 8 0"></path></svg>'
  };

  function initHomePage() {
    App.getProducts().then(products => {
      if (!products.length) return;

      const catBox = document.getElementById('homeCategories');
      if (catBox) {
        catBox.innerHTML = App.CATEGORIES.map(cat => {
          const count = products.filter(p => p.category === cat).length;
          if (!count) return '';
          return '<a class="category-card" href="category.html?category=' + encodeURIComponent(cat) + '">' +
            '<span class="category-card__icon">' + (CATEGORY_ICON_MAP[cat] || '') + '</span>' +
            '<span class="category-card__name">' + App.escapeHTML(cat) + '</span>' +
            '<span class="category-card__count">' + count + ' ürün</span>' +
          '</a>';
        }).join('');
      }

      renderProducts(document.getElementById('bestSellersGrid'), products.slice().sort(byPopularity).slice(0, 8));
      renderProducts(document.getElementById('newArrivalsGrid'), products.slice().sort(byNewest).slice(0, 8));
      renderProducts(document.getElementById('dealsGrid'),
        products.filter(p => App.discountPercent(p.price, p.oldPrice) > 0).sort(byDiscount).slice(0, 8));
    });
  }

  /* ---------- KATEGORİ ---------- */
  function initCategoryPage() {
    const grid = document.getElementById('categoryGrid');
    const countEl = document.getElementById('resultCount');
    const panel = document.getElementById('filtersPanel');
    const sortSel = document.getElementById('sortSelect');
    const filterToggle = document.getElementById('filterToggle');
    const resetBtn = document.getElementById('resetFilters');
    const titleEl = document.getElementById('categoryTitle');
    const brandBox = document.getElementById('brandFilters');
    const catBox = document.getElementById('categoryFilters');
    const minIn = document.getElementById('minPrice');
    const maxIn = document.getElementById('maxPrice');
    const stockChk = document.getElementById('inStockOnly');
    if (!grid) return;

    const params = new URLSearchParams(window.location.search);
    const state = {
      categories: params.get('category') ? [params.get('category')] : [],
      brands: params.get('brand') ? [params.get('brand')] : [],
      min: null, max: null, inStock: false,
      sort: params.get('sort') || 'default',
      query: params.get('q') || '',
      onlyFavorites: params.get('fav') === '1'
    };

    let all = [];

    App.getProducts().then(products => {
      all = products;
      if (!all.length) { renderProducts(grid, []); if (countEl) countEl.textContent = '0'; return; }

      buildCatFilters();
      buildBrandFilters();
      bindPriceStock();
      apply();

      sortSel && sortSel.addEventListener('change', () => { state.sort = sortSel.value; apply(); });
      filterToggle && panel && filterToggle.addEventListener('click', () => {
        const open = panel.classList.toggle('is-open');
        filterToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      resetBtn && resetBtn.addEventListener('click', () => {
        state.categories = []; state.brands = []; state.min = null; state.max = null; state.inStock = false;
        state.sort = 'default'; state.onlyFavorites = false;
        if (minIn) minIn.value = ''; if (maxIn) maxIn.value = ''; if (stockChk) stockChk.checked = false; if (sortSel) sortSel.value = 'default';
        buildCatFilters(); buildBrandFilters(); apply();
        App.toast('Filtreler temizlendi.', 'info');
      });

      function buildCatFilters() {
        if (!catBox) return;
        const counts = {};
        all.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
        catBox.innerHTML = Object.keys(counts).sort().map(cat =>
          '<label class="filter-option' + (state.categories.indexOf(cat) !== -1 ? ' is-selected' : '') + '">' +
            '<input type="checkbox" value="' + App.escapeHTML(cat) + '" data-cat ' + (state.categories.indexOf(cat) !== -1 ? 'checked' : '') + '>' +
            '<span>' + App.escapeHTML(cat) + '</span>' +
            '<span class="filter-option__count">' + counts[cat] + '</span>' +
          '</label>').join('');
        catBox.querySelectorAll('[data-cat]').forEach(cb => cb.addEventListener('change', () => {
          state.categories = Array.from(catBox.querySelectorAll('[data-cat]:checked')).map(i => i.value);
          catBox.querySelectorAll('.filter-option').forEach(l => l.classList.toggle('is-selected', l.querySelector('input').checked));
          buildBrandFilters(); apply();
        }));
      }

      function buildBrandFilters() {
        if (!brandBox) return;
        const counts = {};
        all.forEach(p => {
          if (state.categories.length && state.categories.indexOf(p.category) === -1) return;
          counts[p.brand] = (counts[p.brand] || 0) + 1;
        });
        const brands = Object.keys(counts).sort();
        brandBox.innerHTML = brands.length ? brands.map(b =>
          '<label class="filter-option' + (state.brands.indexOf(b) !== -1 ? ' is-selected' : '') + '">' +
            '<input type="checkbox" value="' + App.escapeHTML(b) + '" data-brand ' + (state.brands.indexOf(b) !== -1 ? 'checked' : '') + '>' +
            '<span>' + App.escapeHTML(b) + '</span>' +
            '<span class="filter-option__count">' + counts[b] + '</span>' +
          '</label>').join('') : '<p style="font-size:.84rem;color:var(--muted);margin:0">Marka bulunamadı.</p>';
        brandBox.querySelectorAll('[data-brand]').forEach(cb => cb.addEventListener('change', () => {
          state.brands = Array.from(brandBox.querySelectorAll('[data-brand]:checked')).map(i => i.value);
          brandBox.querySelectorAll('.filter-option').forEach(l => l.classList.toggle('is-selected', l.querySelector('input').checked));
          apply();
        }));
      }

      function bindPriceStock() {
        if (minIn) minIn.addEventListener('change', () => { const v = parseFloat(minIn.value); state.min = Number.isFinite(v) && v >= 0 ? v : null; apply(); });
        if (maxIn) maxIn.addEventListener('change', () => { const v = parseFloat(maxIn.value); state.max = Number.isFinite(v) && v >= 0 ? v : null; apply(); });
        if (stockChk) {
          stockChk.checked = state.inStock;
          stockChk.addEventListener('change', () => { state.inStock = stockChk.checked; apply(); });
        }
      }

      function apply() {
        let list = all.slice();
        if (state.query) { const q = App.normalize(state.query); list = list.filter(p =>
          App.normalize(p.name).indexOf(q) !== -1 || App.normalize(p.brand).indexOf(q) !== -1 || App.normalize(p.category).indexOf(q) !== -1); }
        if (state.onlyFavorites) { const f = App.getFavorites(); list = list.filter(p => f.indexOf(Number(p.id)) !== -1); }
        if (state.categories.length) list = list.filter(p => state.categories.indexOf(p.category) !== -1);
        if (state.brands.length) list = list.filter(p => state.brands.indexOf(p.brand) !== -1);
        if (state.min !== null) list = list.filter(p => Number(p.price) >= state.min);
        if (state.max !== null) list = list.filter(p => Number(p.price) <= state.max);
        if (state.inStock) list = list.filter(p => Number(p.stock) > 0);

        switch (state.sort) {
          case 'price-asc': list.sort((a, b) => Number(a.price) - Number(b.price)); break;
          case 'price-desc': list.sort((a, b) => Number(b.price) - Number(a.price)); break;
          case 'rating': list.sort(byPopularity); break;
          case 'newest': list.sort(byNewest); break;
          default: list.sort((a, b) => Number(a.id) - Number(b.id));
        }

        if (titleEl) {
          if (state.onlyFavorites) titleEl.textContent = 'Favorilerim';
          else if (state.query) titleEl.textContent = '“' + state.query + '” için sonuçlar';
          else if (state.categories.length === 1) titleEl.textContent = state.categories[0];
          else titleEl.textContent = 'Tüm Ürünler';
        }
        if (countEl) countEl.innerHTML = '<strong>' + list.length + '</strong> ürün listeleniyor';
        renderProducts(grid, list);
      }
    });
  }

  /* ---------- ÜRÜN DETAY ---------- */
  function initProductPage() {
    const root = document.getElementById('productDetail');
    if (!root) return;
    const idParam = new URLSearchParams(window.location.search).get('id');

    App.getProducts().then(products => {
      const product = products.find(p => Number(p.id) === Number(idParam));
      if (!product) { renderNotFound(root); return; }
      renderDetail(root, product);
      renderRelated(product, products);
      const rev = document.getElementById('reviewsRoot');
      if (rev && global.Reviews) global.Reviews.render(rev, product);
    });
  }

  function renderNotFound(root) {
    document.title = 'Ürün Bulunamadı — MiniShop';
    const bc = document.getElementById('breadcrumb'); if (bc) bc.innerHTML = '';
    root.innerHTML = '<div class="empty-state"><div class="empty-state__icon">' + App.ICONS.box + '</div>' +
      '<h2>Ürün bulunamadı</h2><p>Aradığınız ürün kaldırılmış veya bağlantı hatalı olabilir.</p>' +
      '<a class="btn btn--primary" href="category.html">Tüm Ürünleri Gör</a></div>';
    const rev = document.getElementById('reviewsRoot'); if (rev) rev.innerHTML = '';
    const rel = document.getElementById('relatedSection'); if (rel) rel.remove();
  }

  function renderDetail(root, product) {
    document.title = product.name + ' — MiniShop';
    const stats = App.getReviewStats(product.id);

    const bc = document.getElementById('breadcrumb');
    if (bc) bc.innerHTML =
      '<a href="index.html">Ana Sayfa</a><span class="breadcrumb__sep">/</span>' +
      '<a href="category.html?category=' + encodeURIComponent(product.category) + '">' + App.escapeHTML(product.category) + '</a>' +
      '<span class="breadcrumb__sep">/</span><span>' + App.escapeHTML(product.name) + '</span>';

    const images = (Array.isArray(product.images) && product.images.length) ? product.images : [''];
    const discount = App.discountPercent(product.price, product.oldPrice);
    const stock = Number(product.stock) || 0;
    const out = stock <= 0;
    const low = stock > 0 && stock <= 10;
    const stockCls = out ? 'is-out' : (low ? 'is-low' : '');
    const stockText = out ? 'Stokta yok' : (low ? 'Son ' + stock + ' ürün — acele edin!' : 'Stokta (' + stock + ' adet)');

    const thumbs = images.map((src, i) =>
      '<button type="button" class="gallery__thumb' + (i === 0 ? ' is-active' : '') + '" data-index="' + i + '" aria-label="Görsel ' + (i + 1) + '">' +
        '<img src="' + App.escapeHTML(src) + '" alt=""></button>').join('');

    const installments = Array.isArray(product.installmentOptions) ? product.installmentOptions : [];
    const instRows = installments.map(n => {
      const monthly = Number(product.price) / Number(n);
      return '<tr><td>' + n + ' Taksit</td><td>' + App.formatPrice(monthly) + '</td><td>' + App.formatPrice(product.price) + '</td></tr>';
    }).join('');

    const specs = product.specifications || {};
    const specRows = Object.keys(specs).map(k => '<tr><th>' + App.escapeHTML(k) + '</th><td>' + App.escapeHTML(specs[k]) + '</td></tr>').join('');

    root.innerHTML =
      '<div class="product-detail">' +
        '<div class="gallery">' +
          '<div class="gallery__main" id="galleryMain">' +
            '<button type="button" class="gallery__nav gallery__nav--prev" id="galPrev" aria-label="Önceki görsel">‹</button>' +
            '<img id="mainImage" src="' + App.escapeHTML(images[0]) + '" alt="' + App.escapeHTML(product.name) + '">' +
            '<button type="button" class="gallery__nav gallery__nav--next" id="galNext" aria-label="Sonraki görsel">›</button>' +
            '<button type="button" class="gallery__zoom" id="galZoom" aria-label="Görseli büyüt">⤢</button>' +
          '</div>' +
          (images.length > 1 ? '<div class="gallery__thumbs">' + thumbs + '</div>' : '') +
        '</div>' +
        '<div class="product-info">' +
          '<span class="product-info__brand">' + App.escapeHTML(product.brand) + '</span>' +
          '<h1 class="product-info__title">' + App.escapeHTML(product.name) + '</h1>' +
          '<div class="product-info__rating">' + App.starsHTML(stats.average) +
            '<strong>' + stats.average.toFixed(1) + '</strong>' +
            '<span>· ' + stats.count + ' değerlendirme</span></div>' +
          '<div class="product-info__price-row">' +
            '<span class="product-info__price">' + App.formatPrice(product.price) + '</span>' +
            (Number(product.oldPrice) > Number(product.price) ? '<span class="product-info__old">' + App.formatPrice(product.oldPrice) + '</span>' : '') +
            (discount ? '<span class="product-info__discount">%' + discount + ' indirim</span>' : '') +
          '</div>' +
          '<p class="product-info__desc">' + App.escapeHTML(product.description) + '</p>' +
          '<div class="stock-line ' + stockCls + '"><span class="dot"></span>' + stockText + '</div>' +
          '<div class="qty-row">' +
            '<span class="qty-row__label">Adet</span>' +
            '<div class="qty">' +
              '<button type="button" id="qtyDec" aria-label="Azalt"' + (out ? ' disabled' : '') + '>−</button>' +
              '<input id="qtyInput" type="number" min="1" max="' + Math.max(1, stock) + '" value="1" aria-label="Ürün adedi"' + (out ? ' disabled' : '') + '>' +
              '<button type="button" id="qtyInc" aria-label="Artır"' + (out ? ' disabled' : '') + '>+</button>' +
            '</div>' +
          '</div>' +
          '<div class="product-info__actions">' +
            '<button type="button" class="btn btn--primary" data-add-to-cart="' + product.id + '" data-qty-input="#qtyInput"' + (out ? ' disabled' : '') + '>' + (out ? 'Stokta Yok' : 'Sepete Ekle') + '</button>' +
            '<button type="button" class="btn btn--ghost" data-fav-toggle="' + product.id + '">Favorilere Ekle</button>' +
          '</div>' +
          '<div class="info-boxes">' +
            '<div class="info-box">' + App.ICONS.truck + '<div><strong>Hızlı Teslimat</strong><span>750 TL üzeri siparişlerde kargo ücretsiz.</span></div></div>' +
            '<div class="info-box">' + App.ICONS.shield + '<div><strong>Garanti</strong><span>' + App.escapeHTML(product.warranty || 'Garanti bilgisi mevcut değil') + '</span></div></div>' +
            '<div class="info-box">' + App.ICONS.refresh + '<div><strong>Kolay İade</strong><span>Teslimattan sonra 30 gün içinde iade imkânı.</span></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<section class="detail-block"><h2 class="detail-block__title">Ürün Açıklaması</h2><p>' + App.escapeHTML(product.description) + '</p></section>' +
      (specRows ? '<section class="detail-block"><h2 class="detail-block__title">Teknik Özellikler</h2><table class="spec-table"><tbody>' + specRows + '</tbody></table></section>' : '') +
      (instRows ? '<section class="detail-block"><h2 class="detail-block__title">Taksit Seçenekleri</h2>' +
        '<table class="installment-table"><thead><tr><th>Taksit</th><th>Aylık</th><th>Toplam</th></tr></thead><tbody>' + instRows + '</tbody></table></section>' : '');

    App.attachImageFallback(root.querySelector('#mainImage'));

    // Galeri
    let currentIndex = 0;
    const mainImage = root.querySelector('#mainImage');
    const thumbsEl = root.querySelectorAll('.gallery__thumb');

    function setImage(idx) {
      currentIndex = (idx + images.length) % images.length;
      if (mainImage) mainImage.src = images[currentIndex];
      thumbsEl.forEach(t => t.classList.toggle('is-active', Number(t.getAttribute('data-index')) === currentIndex));
    }
    thumbsEl.forEach(t => {
      const im = t.querySelector('img'); App.attachImageFallback(im);
      t.addEventListener('click', () => setImage(Number(t.getAttribute('data-index'))));
    });
    root.querySelector('#galPrev')?.addEventListener('click', () => setImage(currentIndex - 1));
    root.querySelector('#galNext')?.addEventListener('click', () => setImage(currentIndex + 1));
    root.querySelector('#galZoom')?.addEventListener('click', () => openLightbox(images, currentIndex));
    mainImage?.addEventListener('click', () => openLightbox(images, currentIndex));

    // Qty
    const qtyIn = root.querySelector('#qtyInput');
    const dec = root.querySelector('#qtyDec');
    const inc = root.querySelector('#qtyInc');
    const clampQ = v => { const max = Math.max(1, stock); let n = parseInt(v, 10); if (!Number.isFinite(n)) n = 1; return Math.min(max, Math.max(1, n)); };
    if (qtyIn && dec && inc && !out) {
      dec.addEventListener('click', () => { qtyIn.value = clampQ(parseInt(qtyIn.value, 10) - 1); });
      inc.addEventListener('click', () => { qtyIn.value = clampQ(parseInt(qtyIn.value, 10) + 1); });
      qtyIn.addEventListener('change', () => { qtyIn.value = clampQ(qtyIn.value); });
    }

    // Favori metni
    const favBtn = root.querySelector('[data-fav-toggle]');
    if (favBtn) {
      const upd = () => { favBtn.textContent = App.isFavorite(product.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'; };
      upd();
      favBtn.addEventListener('click', () => setTimeout(upd, 0));
    }
  }

  /* ---------- LIGHTBOX ---------- */
  function openLightbox(images, start) {
    let root = document.getElementById('lightbox-root');
    if (!root) { root = document.createElement('div'); root.id = 'lightbox-root'; document.body.appendChild(root); }
    let idx = start;

    function paint() {
      root.innerHTML =
        '<div class="lightbox">' +
          '<button type="button" class="lightbox__close" data-lb-close aria-label="Kapat">×</button>' +
          (images.length > 1 ? '<button type="button" class="lightbox__nav lightbox__nav--prev" data-lb-prev aria-label="Önceki">‹</button>' : '') +
          '<img class="lightbox__img" src="' + App.escapeHTML(images[idx]) + '" alt="">' +
          (images.length > 1 ? '<button type="button" class="lightbox__nav lightbox__nav--next" data-lb-next aria-label="Sonraki">›</button>' : '') +
          '<div class="lightbox__counter">' + (idx + 1) + ' / ' + images.length + '</div>' +
        '</div>';
      App.attachImageFallback(root.querySelector('.lightbox__img'));
      root.querySelector('[data-lb-close]')?.addEventListener('click', close);
      root.querySelector('[data-lb-prev]')?.addEventListener('click', () => { idx = (idx - 1 + images.length) % images.length; paint(); });
      root.querySelector('[data-lb-next]')?.addEventListener('click', () => { idx = (idx + 1) % images.length; paint(); });
    }

    function close() { root.innerHTML = ''; document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', key); }
    function key(e) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft' && images.length > 1) { idx = (idx - 1 + images.length) % images.length; paint(); }
      else if (e.key === 'ArrowRight' && images.length > 1) { idx = (idx + 1) % images.length; paint(); }
    }
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', key);
    root.addEventListener('click', e => { if (e.target === root || e.target.classList.contains('lightbox')) close(); });
    paint();
  }

  function renderRelated(product, products) {
    const sec = document.getElementById('relatedSection');
    const grid = document.getElementById('relatedGrid');
    if (!sec || !grid) return;
    const rel = products.filter(p => p.category === product.category && Number(p.id) !== Number(product.id)).slice(0, 4);
    if (!rel.length) { sec.style.display = 'none'; return; }
    renderProducts(grid, rel);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.getAttribute('data-page');
    if (page === 'index') initHomePage();
    else if (page === 'category') initCategoryPage();
    else if (page === 'product') initProductPage();
  });

  global.Products = { createProductCard, renderProducts };
})(window);