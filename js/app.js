/* =====================================================================
   app.js — Ortak çekirdek: header, footer, auth, sepet, favori, yorum, stok
   ===================================================================== */
(function (global) {
  'use strict';

  const KEYS = {
    cart: 'minishop.cart',
    favorites: 'minishop.favorites',
    reviews: 'minishop.reviews',
    reviewsSeeded: 'minishop.reviews.seeded',
    orders: 'minishop.orders',
    users: 'minishop.users',
    currentUser: 'minishop.currentUser',
    stockOverrides: 'minishop.stockOverrides'
  };

  const CATEGORIES = ['Elektronik', 'Giyim', 'Ev & Yaşam', 'Spor', 'Kozmetik', 'Aksesuar', 'Eğlence'];

  const ADMIN_EMAIL = 'admin@minishop.demo';
  const ADMIN_PASSWORD = 'admin123';

  const FREE_SHIPPING_LIMIT = 750;
  const SHIPPING_FEE = 49.9;
  const SEED_VERSION = 3;

  const DEMO_CARD = { number: '4242424242424242', holder: 'DEMO KART', expiry: '12/30', cvv: '123' };

  const FALLBACK_IMAGE =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">' +
        '<rect width="600" height="600" fill="#eef1f7"/>' +
        '<g fill="#b7bfd0"><circle cx="300" cy="250" r="55"/>' +
        '<path d="M150 470c0-83 67-150 150-150s150 67 150 150z"/></g>' +
        '<text x="300" y="545" font-family="Arial,sans-serif" font-size="24" fill="#8b95a9" text-anchor="middle">Görsel yüklenemedi</text>' +
      '</svg>'
    );

  const ICONS = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.6-3.6"></path></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2A2 2 0 0 0 9.4 17h7.7a2 2 0 0 0 1.95-1.6L21 8H6.2"></path><circle cx="10" cy="20" r="1.5"></circle><circle cx="18" cy="20" r="1.5"></circle></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 3.4c0 5.1-7.5 9.7-7.5 9.7z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"></path><path d="M10 11v6M14 11v6"></path><path d="M6 7l1 13h10l1-13"></path><path d="M9 7V4h6v3"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 16V6h11v10"></path><path d="M14 10h4l3 3v3h-7"></path><circle cx="7" cy="18" r="2"></circle><circle cx="17" cy="18" r="2"></circle></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z"></path><path d="M9 12l2 2 4-4"></path></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"></path><path d="M3 21v-5h5"></path></svg>',
    support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2"></path><rect x="2" y="13" width="4" height="6" rx="1.5"></rect><rect x="18" y="13" width="4" height="6" rx="1.5"></rect><path d="M20 19a4 4 0 0 1-4 3h-2"></path></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8l-9-5-9 5 9 5 9-5z"></path><path d="M3 8v8l9 5 9-5V8"></path><path d="M12 13v8"></path></svg>',
    emptyCart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2A2 2 0 0 0 9.4 17h7.7a2 2 0 0 0 1.95-1.6L21 8H6.2"></path><circle cx="10" cy="20" r="1.5"></circle><circle cx="18" cy="20" r="1.5"></circle></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>'
  };

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed = JSON.parse(raw);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (err) { return fallback; }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (err) { return false; }
  }

  function escapeHTML(v) {
    return String(v === null || v === undefined ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  const _fmt = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function formatPrice(v) { const n = Number(v); return Number.isFinite(n) ? _fmt.format(n) : '—'; }

  function normalize(t) { return String(t === null || t === undefined ? '' : t).toLocaleLowerCase('tr-TR').trim(); }

  function discountPercent(price, oldPrice) {
    const p = Number(price), o = Number(oldPrice);
    if (!Number.isFinite(p) || !Number.isFinite(o) || o <= p || o <= 0) return 0;
    return Math.round(((o - p) / o) * 100);
  }

  function debounce(fn, wait) {
    let timer = null;
    return function () { const a = arguments; clearTimeout(timer); timer = setTimeout(() => fn.apply(null, a), wait); };
  }

  function starsHTML(rating) {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));
    const rounded = Math.round(value * 2) / 2;
    let h = '';
    for (let i = 1; i <= 5; i++) {
      if (rounded >= i) h += '<span class="star star--full">★</span>';
      else if (rounded >= i - 0.5) h += '<span class="star star--half">★</span>';
      else h += '<span class="star star--empty">★</span>';
    }
    return '<span class="stars" aria-label="' + value.toFixed(1) + ' / 5">' + h + '</span>';
  }

  function attachImageFallback(img) {
    if (!img) return;
    if (!img.getAttribute('src')) { img.src = FALLBACK_IMAGE; return; }
    img.addEventListener('error', function handler() { img.removeEventListener('error', handler); img.src = FALLBACK_IMAGE; });
    if (img.complete && img.naturalWidth === 0) img.src = FALLBACK_IMAGE;
  }

  /* ---------------- AUTH ---------------- */
  function getUsers() {
    const raw = readJSON(KEYS.users, []);
    return Array.isArray(raw) ? raw : [];
  }

  function getCurrentUser() {
    const u = readJSON(KEYS.currentUser, null);
    return u && u.email ? u : null;
  }

  function getUserProfile() {
    const current = getCurrentUser();
    if (!current) return null;
    const users = getUsers();
    const full = users.find(u => u.email === current.email);
    if (!full) return current;
    const safe = Object.assign({}, full);
    delete safe.password;
    return safe;
  }

  function register(name, email, password) {
    name = String(name || '').trim();
    email = String(email || '').trim().toLowerCase();
    const pass = String(password || '');
    if (name.length < 2) return { ok: false, error: 'Ad en az 2 karakter olmalı.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: 'Geçerli bir e-posta girin.' };
    if (pass.length < 4) return { ok: false, error: 'Şifre en az 4 karakter olmalı.' };
    if (email === ADMIN_EMAIL) return { ok: false, error: 'Bu e-posta kullanılamaz.' };
    const users = getUsers();
    if (users.find(u => u.email === email)) return { ok: false, error: 'Bu e-posta zaten kayıtlı. Giriş yapın.' };
    users.push({ name, email, password: pass, role: 'user', createdAt: new Date().toISOString(), phone: '', city: '', address: '' });
    writeJSON(KEYS.users, users);
    const user = { name, email, role: 'user' };
    writeJSON(KEYS.currentUser, user);
    return { ok: true, user };
  }

  function login(email, password) {
    email = String(email || '').trim().toLowerCase();
    const pass = String(password || '');
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      const user = { name: 'Admin', email: ADMIN_EMAIL, role: 'admin' };
      writeJSON(KEYS.currentUser, user);
      return { ok: true, user };
    }
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === pass);
    if (!found) return { ok: false, error: 'E-posta veya şifre hatalı.' };
    const user = { name: found.name, email: found.email, role: found.role || 'user' };
    writeJSON(KEYS.currentUser, user);
    return { ok: true, user };
  }

  function logout() { localStorage.removeItem(KEYS.currentUser); }
  function isAdmin() { const u = getCurrentUser(); return !!(u && u.role === 'admin'); }

  function updateUserProfile(updates) {
    const current = getCurrentUser();
    if (!current) return { ok: false, error: 'Giriş yapmış kullanıcı yok.' };
    const users = getUsers();
    const idx = users.findIndex(u => u.email === current.email);
    if (idx === -1) return { ok: false, error: 'Kullanıcı bulunamadı.' };

    const allowed = ['name', 'phone', 'city', 'address'];
    allowed.forEach(k => {
      if (updates[k] !== undefined) users[idx][k] = String(updates[k] || '').trim();
    });
    if (!users[idx].name || users[idx].name.length < 2) {
      return { ok: false, error: 'Ad en az 2 karakter olmalı.' };
    }
    writeJSON(KEYS.users, users);
    const newUser = { name: users[idx].name, email: users[idx].email, role: users[idx].role || 'user' };
    writeJSON(KEYS.currentUser, newUser);
    return { ok: true, user: newUser };
  }

  function getMyOrders() {
    const user = getCurrentUser();
    if (!user) return [];
    const orders = readJSON(KEYS.orders, []);
    if (!Array.isArray(orders)) return [];
    return orders.filter(o => o && o.customer && o.customer.email === user.email);
  }

  /* ---------------- STOK ---------------- */
  function getStockOverrides() {
    const raw = readJSON(KEYS.stockOverrides, {});
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  }

  function applyStockOverride(product) {
    const o = getStockOverrides();
    const id = String(product.id);
    if (o[id] !== undefined) return Object.assign({}, product, { stock: Math.max(0, Number(o[id]) || 0) });
    return product;
  }

  function setStockBatch(updates) {
    const o = getStockOverrides();
    Object.keys(updates || {}).forEach(id => { o[String(id)] = Math.max(0, Math.floor(Number(updates[id]) || 0)); });
    writeJSON(KEYS.stockOverrides, o);
  }

  function setStock(id, stock) { setStockBatch({ [id]: stock }); }

  /* ---------------- YORUMLAR ---------------- */
  const DEMO_NAMES = ['Ayşe K.', 'Mehmet D.', 'Zeynep T.', 'Burak S.', 'Elif Y.', 'Can A.', 'Deniz M.', 'Selin Ö.', 'Hakan T.', 'Melis B.'];
  const DEMO_TITLES = ['Beklentimin üzerinde bir ürün','Fiyat/performans harika','Kargo çok hızlı geldi','Kalitesi gerçekten iyi','Tavsiye ederim','Gayet başarılı buldum','Bir tık daha iyi olabilirdi','Tekrar satın alırım','İşini yapıyor','Memnun kaldım'];
  const DEMO_TEXTS = [
    'Ürünü iki haftadır kullanıyorum ve gerçekten memnun kaldım. Paketleme özenliydi, kargo beklediğimden çok daha hızlı geldi.',
    'Fiyatına göre performansı çok iyi. Küçük detaylar düşünülmüş, günlük kullanım için oldukça ideal.',
    'Görselde göründüğü gibi geldi. Malzeme kalitesi sağlam hissettiriyor, uzun süre kullanacağımı düşünüyorum.',
    'İlk izlenimim olumlu. Kurulumu kolaydı ve kullanım kılavuzu yeterliydi.',
    'Arkadaşımın tavsiyesiyle aldım, iyi ki almışım. Birkaç gün daha kullanıp tekrar yorum yazacağım.',
    'Beklediğimden biraz küçük çıktı ama işlevsel olarak sorunsuz. Yine de tavsiye ederim.',
    'Kargo biraz geç geldi ama ürün sorunsuz. Satıcı ilgiliydi.',
    'Bu fiyata bu kalite gerçekten şaşırtıcı. Kesinlikle tavsiye ederim.',
    'Kullanımı kolay, malzeme kaliteli. Eksik yönü yok denecek kadar az.',
    'Beklentilerimi karşıladı, hatta biraz aştı. Teşekkürler.'
  ];

  let reviewsCache = null;
  let statsCache = {};

  function getAllReviewsData() {
    if (reviewsCache === null) {
      const raw = readJSON(KEYS.reviews, {});
      reviewsCache = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    }
    return reviewsCache;
  }

  function invalidateStats(id) {
    if (id === undefined) statsCache = {};
    else delete statsCache[String(id)];
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function buildDemoReviews(product) {
    const target = Math.max(0, Math.floor(Number(product.reviewCount) || 0));
    const targetRating = Math.max(1, Math.min(5, Number(product.rating) || 4));
    if (target === 0) return [];

    const ratings = [];
    if (targetRating >= 4) { const top = Math.round(target * (targetRating - 4)); const rest = target - top; for (let i = 0; i < top; i++) ratings.push(5); for (let i = 0; i < rest; i++) ratings.push(4); }
    else if (targetRating >= 3) { const top = Math.round(target * (targetRating - 3)); const rest = target - top; for (let i = 0; i < top; i++) ratings.push(4); for (let i = 0; i < rest; i++) ratings.push(3); }
    else if (targetRating >= 2) { const top = Math.round(target * (targetRating - 2)); const rest = target - top; for (let i = 0; i < top; i++) ratings.push(3); for (let i = 0; i < rest; i++) ratings.push(2); }
    else { const top = Math.round(target * (targetRating - 1)); const rest = target - top; for (let i = 0; i < top; i++) ratings.push(2); for (let i = 0; i < rest; i++) ratings.push(1); }

    const shuffled = ratings.map((r, i) => ({ r, s: (Number(product.id) * 37 + i * 13) % 1000 })).sort((a, b) => a.s - b.s).map(x => x.r);

    const out = [];
    for (let i = 0; i < target; i++) {
      const seed = Number(product.id) * 7 + i * 13;
      const daysAgo = (seed % 60) + i * 0.5;
      const date = new Date(); date.setDate(date.getDate() - daysAgo);
      out.push({
        id: 'demo-' + product.id + '-' + i,
        name: DEMO_NAMES[seed % DEMO_NAMES.length],
        title: DEMO_TITLES[seed % DEMO_TITLES.length],
        text: DEMO_TEXTS[seed % DEMO_TEXTS.length],
        rating: shuffled[i],
        date: date.toISOString(),
        demo: true
      });
    }
    return out;
  }

  function ensureReviewsSeeded(products) {
    const currentVersion = Number(readJSON(KEYS.reviewsSeeded, 0)) || 0;
    const data = getAllReviewsData();
    let changed = false;
    (Array.isArray(products) ? products : []).forEach(product => {
      const key = String(product.id);
      const existing = Array.isArray(data[key]) ? data[key] : [];
      const userReviews = existing.filter(r => r && !r.demo);
      const demoReviews = existing.filter(r => r && r.demo);
      const targetCount = Math.max(0, Math.floor(Number(product.reviewCount) || 0));
      const needsReseed = currentVersion < SEED_VERSION || demoReviews.length !== targetCount;
      if (needsReseed) {
        data[key] = buildDemoReviews(product).concat(userReviews);
        changed = true;
      }
    });
    if (changed || currentVersion < SEED_VERSION) {
      writeJSON(KEYS.reviews, data);
      writeJSON(KEYS.reviewsSeeded, SEED_VERSION);
      invalidateStats();
    }
  }

  function getProductReviews(productId) {
    const data = getAllReviewsData();
    const list = data[String(productId)];
    if (!Array.isArray(list)) return [];
    return list.filter(r => r && Number(r.rating) > 0).map(r => ({
      id: String(r.id || ''),
      name: String(r.name || 'Anonim'),
      title: String(r.title || ''),
      text: String(r.text || ''),
      rating: clamp(Number(r.rating) || 0, 1, 5),
      date: r.date || new Date().toISOString(),
      demo: Boolean(r.demo)
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function getReviewStats(productId) {
    const key = String(productId);
    if (statsCache[key]) return statsCache[key];
    const list = getProductReviews(productId);
    const count = list.length;
    const sum = list.reduce((s, r) => s + r.rating, 0);
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    list.forEach(r => { const k = Math.round(r.rating); if (dist[k] !== undefined) dist[k]++; });
    const stats = { average: count ? sum / count : 0, count, distribution: dist };
    statsCache[key] = stats;
    return stats;
  }

  function addProductReview(productId, review) {
    const data = getAllReviewsData();
    const key = String(productId);
    if (!Array.isArray(data[key])) data[key] = [];
    data[key].push({
      id: 'u-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      name: String(review.name || 'Anonim').slice(0, 40),
      title: String(review.title || '').slice(0, 70),
      text: String(review.text || '').slice(0, 600),
      rating: clamp(Number(review.rating) || 0, 1, 5),
      date: new Date().toISOString(),
      demo: false
    });
    writeJSON(KEYS.reviews, data);
    invalidateStats(productId);
    return getProductReviews(productId);
  }

  /* ---------------- TOAST ---------------- */
  function ensureToastStack() {
    let s = document.getElementById('toast-stack');
    if (!s) {
      s = document.createElement('div');
      s.id = 'toast-stack'; s.className = 'toast-stack';
      s.setAttribute('role', 'status'); s.setAttribute('aria-live', 'polite');
      document.body.appendChild(s);
    }
    return s;
  }
  const TOAST_ICONS = { success: '✓', error: '!', info: 'i', warning: '!' };
  function toast(message, type) {
    const kind = type || 'success';
    const stack = ensureToastStack();
    const el = document.createElement('div');
    el.className = 'toast toast--' + kind;
    const icon = document.createElement('span'); icon.className = 'toast__icon'; icon.textContent = TOAST_ICONS[kind] || '✓';
    const msg = document.createElement('span'); msg.className = 'toast__msg'; msg.textContent = String(message);
    el.appendChild(icon); el.appendChild(msg); stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-visible'));
    setTimeout(() => {
      el.classList.remove('is-visible');
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
    }, 2800);
  }

  /* ---------------- ÜRÜNLER ---------------- */
  let productsPromise = null;
  function getProducts() {
    if (!productsPromise) {
      productsPromise = fetch('data/products.json', { cache: 'no-cache' })
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(list => {
          const arr = Array.isArray(list) ? list : [];
          const withStock = arr.map(applyStockOverride);
          try { ensureReviewsSeeded(withStock); } catch (e) { /* noop */ }
          return withStock;
        })
        .catch(err => {
          console.error('[MiniShop] Ürün verisi yüklenemedi:', err);
          toast('Ürün verisi yüklenemedi. Sunucu üzerinden açın.', 'error');
          return [];
        });
    }
    return productsPromise;
  }
  function reloadProducts() { productsPromise = null; invalidateStats(); return getProducts(); }

  /* ---------------- SEPET ---------------- */
  function getCart() {
    const raw = readJSON(KEYS.cart, []);
    if (!Array.isArray(raw)) return [];
    return raw.filter(i => i && i.id !== undefined && Number(i.qty) > 0)
      .map(i => ({ id: Number(i.id), qty: Math.max(1, Math.floor(Number(i.qty))) }));
  }
  function saveCart(cart) { writeJSON(KEYS.cart, cart); updateCartBadge(); }
  function addToCart(id, qty) {
    const n = Number(id), amount = Math.max(1, Math.floor(Number(qty) || 1));
    if (!Number.isFinite(n)) return getCart();
    const cart = getCart();
    const ex = cart.find(i => i.id === n);
    if (ex) ex.qty += amount; else cart.push({ id: n, qty: amount });
    saveCart(cart); return cart;
  }
  function updateCartItem(id, qty) {
    const n = Number(id), amount = Math.floor(Number(qty));
    let cart = getCart();
    if (!Number.isFinite(amount) || amount <= 0) cart = cart.filter(i => i.id !== n);
    else { const it = cart.find(i => i.id === n); if (it) it.qty = amount; }
    saveCart(cart); return cart;
  }
  function removeFromCart(id) { const n = Number(id); const c = getCart().filter(i => i.id !== n); saveCart(c); return c; }
  function clearCart() { saveCart([]); }
  function getCartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }
  function getCartDetailed(products) {
    const list = Array.isArray(products) ? products : [];
    return getCart().map(item => {
      const p = list.find(x => Number(x.id) === item.id);
      return p ? { product: p, qty: item.qty } : null;
    }).filter(Boolean);
  }
  function calculateTotals(items) {
    const list = Array.isArray(items) ? items : [];
    const subtotal = list.reduce((s, e) => s + Number(e.product.price) * e.qty, 0);
    const count = list.reduce((s, e) => s + e.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;
    return { subtotal, shipping, total: subtotal + shipping, count };
  }
  function updateCartBadge() {
    const c = getCartCount();
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = String(c); el.hidden = c === 0; });
  }

  /* ---------------- FAVORİLER ---------------- */
  function getFavorites() {
    const raw = readJSON(KEYS.favorites, []);
    return Array.isArray(raw) ? raw.map(Number).filter(Number.isFinite) : [];
  }
  function isFavorite(id) { return getFavorites().indexOf(Number(id)) !== -1; }
  function saveFavorites(l) { writeJSON(KEYS.favorites, l); updateFavBadge(); }
  function toggleFavorite(id) {
    const n = Number(id);
    const favs = getFavorites();
    const idx = favs.indexOf(n);
    let added;
    if (idx === -1) { favs.push(n); added = true; } else { favs.splice(idx, 1); added = false; }
    saveFavorites(favs);
    document.querySelectorAll('[data-fav-toggle="' + n + '"]').forEach(btn => {
      btn.classList.toggle('is-active', added);
      btn.setAttribute('aria-pressed', added ? 'true' : 'false');
    });
    return added;
  }
  function updateFavBadge() {
    const c = getFavorites().length;
    document.querySelectorAll('[data-fav-count]').forEach(el => { el.textContent = String(c); el.hidden = c === 0; });
  }

  /* ---------------- HEADER ---------------- */
  function getActiveNav() {
    const page = document.body.getAttribute('data-page');
    const params = new URLSearchParams(window.location.search);
    const a = {};
    if (page === 'index') a.home = true;
    else if (page === 'category') {
      const cat = params.get('category');
      if (cat && CATEGORIES.indexOf(cat) !== -1) a['cat:' + cat] = true;
      else a.all = true;
    } else if (page === 'cart' || page === 'checkout') a.cart = true;
    else if (page === 'login' || page === 'register') a.auth = true;
    else if (page === 'profile') a.profile = true;
    return a;
  }

  function headerTemplate() {
    const active = getActiveNav();
    const catLinks = CATEGORIES.map(cat => {
      const on = active['cat:' + cat] ? ' is-active' : '';
      return '<a class="nav-link' + on + '" href="category.html?category=' + encodeURIComponent(cat) + '">' + escapeHTML(cat) + '</a>';
    }).join('');

    return (
      '<div class="header__main">' +
        '<div class="container header__inner">' +
          '<button type="button" class="burger" id="burgerBtn" aria-label="Menüyü aç" aria-expanded="false" aria-controls="mainNav">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<a href="index.html" class="logo" aria-label="MiniShop ana sayfa">' +
            '<span class="logo__mark" aria-hidden="true">M</span>' +
            '<span class="logo__text">Mini<strong>Shop</strong></span>' +
          '</a>' +
          '<form class="search" id="searchForm" role="search" autocomplete="off">' +
            '<label class="sr-only" for="searchInput">Ürün ara</label>' +
            '<input class="search__input" id="searchInput" type="search" placeholder="Ürün, kategori veya marka ara…" />' +
            '<button class="search__submit" type="submit" aria-label="Ara">' + ICONS.search + '</button>' +
            '<div class="search__panel" id="searchPanel" hidden></div>' +
          '</form>' +
          '<div class="header__actions">' +
            '<a class="action" href="category.html?fav=1" title="Favorilerim">' + ICONS.heart +
              '<span class="action__label">Favoriler</span>' +
              '<span class="badge" data-fav-count hidden>0</span>' +
            '</a>' +
            '<a class="action" href="cart.html" title="Sepetim">' + ICONS.cart +
              '<span class="action__label">Sepetim</span>' +
              '<span class="badge" data-cart-count hidden>0</span>' +
            '</a>' +
            '<div id="authSlot" class="auth-slot"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<nav class="header__nav" id="mainNav" aria-label="Ana menü">' +
        '<div class="container header__nav-inner">' +
          '<a class="nav-link' + (active.home ? ' is-active' : '') + '" href="index.html">Ana Sayfa</a>' +
          '<a class="nav-link' + (active.all ? ' is-active' : '') + '" href="category.html">Tüm Ürünler</a>' +
          catLinks +
        '</div>' +
      '</nav>'
    );
  }

  function renderAuthSlot() {
    const slot = document.getElementById('authSlot');
    if (!slot) return;
    const user = getCurrentUser();

    if (!user) {
      slot.innerHTML =
        '<a class="action" href="login.html" title="Giriş Yap">' + ICONS.user +
          '<span class="action__label">Giriş Yap</span></a>';
      return;
    }

    const initial = (user.name || '?').trim().charAt(0).toLocaleUpperCase('tr-TR');
    slot.innerHTML =
      '<div class="user-menu">' +
        '<button type="button" class="action user-menu__toggle" aria-label="Hesap menüsü" aria-haspopup="true">' +
          '<span class="user-avatar">' + escapeHTML(initial) + '</span>' +
          '<span class="action__label">' + escapeHTML((user.name || '').split(' ')[0]) + '</span>' +
        '</button>' +
        '<div class="user-menu__dropdown" hidden>' +
          '<div class="user-menu__head">' +
            '<strong>' + escapeHTML(user.name) + '</strong>' +
            '<small>' + escapeHTML(user.email) + '</small>' +
            (user.role === 'admin' ? '<span class="user-badge">Admin</span>' : '') +
          '</div>' +
          '<a class="user-menu__item" href="profile.html?tab=overview">Profil</a>' +
          '<a class="user-menu__item" href="profile.html?tab=info">Bilgilerim</a>' +
          '<a class="user-menu__item" href="profile.html?tab=orders">Siparişlerim</a>' +
          (user.role === 'admin' ? '<a class="user-menu__item" href="admin.html">Admin Paneli</a>' : '') +
          '<div class="user-menu__sep"></div>' +
          '<button type="button" class="user-menu__item user-menu__item--danger" data-logout>Çıkış Yap</button>' +
        '</div>' +
      '</div>';

    const toggle = slot.querySelector('.user-menu__toggle');
    const dropdown = slot.querySelector('.user-menu__dropdown');
    if (toggle && dropdown) {
      toggle.addEventListener('click', e => { e.stopPropagation(); dropdown.hidden = !dropdown.hidden; });
      document.addEventListener('click', () => { dropdown.hidden = true; });
    }
    const out = slot.querySelector('[data-logout]');
    if (out) out.addEventListener('click', () => { logout(); toast('Çıkış yapıldı.', 'info'); setTimeout(() => window.location.reload(), 300); });
  }

  /* ---------------- FOOTER (iletişim inline) ---------------- */
  function footerTemplate() {
    return (
      '<div class="container">' +
        '<div class="footer__grid">' +
          '<div class="footer__brand">' +
            '<a href="index.html" class="logo"><span class="logo__mark" aria-hidden="true">M</span><span class="logo__text">Mini<strong>Shop</strong></span></a>' +
            '<p class="footer__about">Modern, hızlı ve güvenli alışveriş deneyimi. Binlerce ürün, uygun fiyat ve kapıya teslimat.</p>' +
            '<div class="socials">' +
              '<button type="button" data-social="Instagram" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1"></circle></svg></button>' +
              '<button type="button" data-social="X (Twitter)" aria-label="X"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16M20 4L4 20"></path></svg></button>' +
              '<button type="button" data-social="Facebook" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></button>' +
              '<button type="button" data-social="YouTube" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="4"></rect><path d="M10 9.5l5 2.5-5 2.5z"></path></svg></button>' +
            '</div>' +
            '<div class="footer-contact">' +
              '<div class="footer-contact__item"><span class="footer-contact__icon">✉</span><span>destek@minishop.demo</span></div>' +
              '<div class="footer-contact__item"><span class="footer-contact__icon">☏</span><span>0850 000 00 00</span></div>' +
              '<div class="footer-contact__item"><span class="footer-contact__icon">⌂</span><span>Demo Plaza, No: 1, İstanbul</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="footer__col">' +
            '<h4 class="footer__title">Kurumsal</h4>' +
            '<div class="footer__links">' +
              '<a href="info.html#about">Hakkımızda</a>' +
              '<a href="info.html#help">Yardım</a>' +
              '<a href="info.html#privacy">Gizlilik Politikası</a>' +
              '<a href="info.html#terms">Kullanım Koşulları</a>' +
              '<a href="info.html#kvkk">KVKK Aydınlatma Metni</a>' +
              '<a href="info.html#distance-sales">Mesafeli Satış Sözleşmesi</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer__col">' +
            '<h4 class="footer__title">Alışveriş</h4>' +
            '<div class="footer__links">' +
              '<a href="category.html">Tüm Ürünler</a>' +
              CATEGORIES.slice(0, 4).map(c => '<a href="category.html?category=' + encodeURIComponent(c) + '">' + escapeHTML(c) + '</a>').join('') +
            '</div>' +
          '</div>' +
          '<div class="footer__col">' +
            '<h4 class="footer__title">Bülten</h4>' +
            '<p class="footer__about" style="margin-bottom:0">Yeni ürünler ve indirimlerden ilk siz haberdar olun.</p>' +
            '<form class="newsletter" id="newsletterForm">' +
              '<label class="sr-only" for="newsletterEmail">E-posta</label>' +
              '<input id="newsletterEmail" type="email" placeholder="E-posta adresiniz" required />' +
              '<button class="btn btn--primary" type="submit">Katıl</button>' +
            '</form>' +
          '</div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<span>© ' + new Date().getFullYear() + ' MiniShop. Tüm hakları saklıdır. Demo projedir.</span>' +
          '<div class="footer__bottom-links">' +
            '<a href="info.html#privacy">Gizlilik</a>' +
            '<a href="info.html#terms">Kullanım</a>' +
            '<a href="info.html#about">Hakkımızda</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ---------------- ARAMA ---------------- */
  function matchesQuery(p, q) {
    if (!q) return false;
    return [p.name, p.brand, p.category].map(normalize).join(' ').indexOf(q) !== -1;
  }

  function initHeaderSearch() {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const panel = document.getElementById('searchPanel');
    if (!form || !input || !panel) return;

    let activeIdx = -1, results = [];
    function closePanel() { panel.hidden = true; panel.innerHTML = ''; activeIdx = -1; results = []; }
    function renderPanel(list, term) {
      if (!list.length) {
        panel.innerHTML = '<div class="search-empty">“' + escapeHTML(term) + '” için sonuç bulunamadı.</div>';
        panel.hidden = false; return;
      }
      panel.innerHTML = list.map(p =>
        '<a class="search-result" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
          '<img class="search-result__img" src="' + escapeHTML((p.images && p.images[0]) || '') + '" alt="" loading="lazy">' +
          '<span class="search-result__body">' +
            '<span class="search-result__name">' + escapeHTML(p.name) + '</span>' +
            '<span class="search-result__meta">' + escapeHTML(p.brand) + ' · ' + escapeHTML(p.category) + '</span>' +
          '</span>' +
          '<span class="search-result__price">' + formatPrice(p.price) + '</span>' +
        '</a>'
      ).join('') + '<a class="search__all" href="category.html?q=' + encodeURIComponent(term) + '">Tüm sonuçları gör →</a>';
      panel.querySelectorAll('img').forEach(attachImageFallback);
      panel.hidden = false; activeIdx = -1;
      results = Array.from(panel.querySelectorAll('.search-result'));
    }

    const search = debounce(term => {
      const q = normalize(term);
      if (!q) { closePanel(); return; }
      getProducts().then(list => {
        renderPanel(list.filter(p => matchesQuery(p, q)).slice(0, 6), term.trim());
      });
    }, 180);

    input.addEventListener('input', () => search(input.value));
    input.addEventListener('focus', () => { if (input.value.trim()) search(input.value); });
    input.addEventListener('keydown', e => {
      if (panel.hidden || !results.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = (activeIdx + 1) % results.length; updateActive(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = (activeIdx - 1 + results.length) % results.length; updateActive(); }
      else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); window.location.href = results[activeIdx].getAttribute('href'); }
      else if (e.key === 'Escape') closePanel();
    });
    function updateActive() { results.forEach((el, i) => el.classList.toggle('is-active', i === activeIdx)); if (results[activeIdx]) results[activeIdx].scrollIntoView({ block: 'nearest' }); }
    form.addEventListener('submit', e => {
      e.preventDefault();
      const t = input.value.trim(); if (!t) return;
      window.location.href = 'category.html?q=' + encodeURIComponent(t);
    });
    document.addEventListener('click', e => { if (!form.contains(e.target)) closePanel(); });
  }

  /* ---------------- GLOBAL DELEGATION ---------------- */
  function initDelegation() {
    document.addEventListener('click', e => {
      const add = e.target.closest('[data-add-to-cart]');
      if (add && !add.disabled) {
        e.preventDefault();
        const id = add.getAttribute('data-add-to-cart');
        const qSel = add.getAttribute('data-qty-input');
        let qty = 1;
        if (qSel) { const i = document.querySelector(qSel); if (i) qty = Math.max(1, parseInt(i.value, 10) || 1); }
        addToCart(id, qty);
        toast('Ürün sepete eklendi.', 'success');
        return;
      }
      const fav = e.target.closest('[data-fav-toggle]');
      if (fav) {
        e.preventDefault();
        const id = fav.getAttribute('data-fav-toggle');
        const added = toggleFavorite(id);
        toast(added ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.', added ? 'success' : 'info');
        return;
      }
      const soc = e.target.closest('[data-social]');
      if (soc) { e.preventDefault(); toast(soc.getAttribute('data-social') + ' demo kapsamındadır.', 'info'); }
    });
  }

  function initHeader() {
    const host = document.getElementById('site-header'); if (!host) return;
    host.innerHTML = headerTemplate();
    const burger = document.getElementById('burgerBtn');
    const nav = document.getElementById('mainNav');
    if (burger && nav) {
      burger.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    initHeaderSearch();
    renderAuthSlot();
    updateCartBadge();
    updateFavBadge();
  }

  function initFooter() {
    const host = document.getElementById('site-footer'); if (!host) return;
    host.innerHTML = footerTemplate();
    const form = document.getElementById('newsletterForm');
    if (form) form.addEventListener('submit', e => {
      e.preventDefault();
      const input = document.getElementById('newsletterEmail');
      const v = input ? input.value.trim() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { toast('Geçerli bir e-posta girin.', 'error'); input && input.focus(); return; }
      toast('Bültene kaydoldunuz.', 'success');
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initFooter();
    initDelegation();
  });

  global.App = {
    KEYS, CATEGORIES, ICONS, FALLBACK_IMAGE, FREE_SHIPPING_LIMIT, SHIPPING_FEE, DEMO_CARD, ADMIN_EMAIL,
    escapeHTML, formatPrice, normalize, discountPercent, debounce, starsHTML, attachImageFallback,
    readJSON, writeJSON, toast,
    getProducts, reloadProducts,
    getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartCount,
    getCartDetailed, calculateTotals, updateCartBadge,
    getFavorites, isFavorite, toggleFavorite, updateFavBadge,
    getUsers, getCurrentUser, getUserProfile, register, login, logout, isAdmin,
    updateUserProfile, getMyOrders,
    getStockOverrides, setStock, setStockBatch, applyStockOverride,
    getProductReviews, getReviewStats, addProductReview, ensureReviewsSeeded,
    renderAuthSlot
  };
})(window);