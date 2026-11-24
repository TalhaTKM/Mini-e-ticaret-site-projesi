/* =====================================================================
   profile.js — Profil / Bilgilerim / Siparişlerim
   ===================================================================== */
(function (global) {
  'use strict';
  const App = global.App;

  function init() {
    const root = document.getElementById('profileRoot');
    if (!root) return;

    if (!App.getCurrentUser()) {
      const redirect = (window.location.pathname.split('/').pop() || 'profile.html') + window.location.search;
      window.location.href = 'login.html?redirect=' + encodeURIComponent(redirect);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || 'overview';
    const success = params.get('success');
    if (success) {
      App.toast('Siparişiniz alındı: ' + success, 'success');
    }

    render(root, tab, success);
  }

  function initials(name) {
    return String(name || '?').trim().split(/\s+/).map(p => p.charAt(0)).join('').slice(0, 2).toLocaleUpperCase('tr-TR');
  }

  function render(root, activeTab, success) {
    const user = App.getCurrentUser();
    const orders = App.getMyOrders();
    const favorites = App.getFavorites();

    root.innerHTML =
      '<div class="profile-layout">' +
        '<aside class="profile-sidebar">' +
          '<div class="profile-header">' +
            '<div class="profile-avatar">' + App.escapeHTML(initials(user.name)) + '</div>' +
            '<div class="profile-header__info">' +
              '<div class="profile-name">' + App.escapeHTML(user.name) + '</div>' +
              '<div class="profile-email">' + App.escapeHTML(user.email) + '</div>' +
            '</div>' +
          '</div>' +
          '<nav class="profile-nav">' +
            '<a class="profile-nav__item' + (activeTab === 'overview' ? ' is-active' : '') + '" href="profile.html?tab=overview">Profil</a>' +
            '<a class="profile-nav__item' + (activeTab === 'info' ? ' is-active' : '') + '" href="profile.html?tab=info">Bilgilerim</a>' +
            '<a class="profile-nav__item' + (activeTab === 'orders' ? ' is-active' : '') + '" href="profile.html?tab=orders">' +
              'Siparişlerim <span class="profile-nav__badge">' + orders.length + '</span>' +
            '</a>' +
            '<a class="profile-nav__item" href="category.html?fav=1">Favorilerim <span class="profile-nav__badge">' + favorites.length + '</span></a>' +
            (user.role === 'admin' ? '<a class="profile-nav__item" href="admin.html">Admin Paneli</a>' : '') +
          '</nav>' +
        '</aside>' +
        '<div class="profile-content" id="profileContent"></div>' +
      '</div>';

    const content = root.querySelector('#profileContent');
    if (activeTab === 'info') renderInfo(content, user);
    else if (activeTab === 'orders') renderOrders(content, orders, success);
    else renderOverview(content, user, orders, favorites);
  }

  function renderOverview(container, user, orders, favorites) {
    const profile = App.getUserProfile() || {};
    const totalSpent = orders.reduce((s, o) => s + (o.totals && o.totals.total ? o.totals.total : 0), 0);

    container.innerHTML =
      '<section class="detail-block">' +
        '<h1 class="detail-block__title">Profil</h1>' +
        '<p>Hoş geldin, <strong>' + App.escapeHTML(user.name) + '</strong>!</p>' +
        '<div class="profile-stats">' +
          '<div class="profile-stat"><div class="profile-stat__value">' + orders.length + '</div><div class="profile-stat__label">Sipariş</div></div>' +
          '<div class="profile-stat"><div class="profile-stat__value">' + App.formatPrice(totalSpent) + '</div><div class="profile-stat__label">Toplam Harcama</div></div>' +
          '<div class="profile-stat"><div class="profile-stat__value">' + favorites.length + '</div><div class="profile-stat__label">Favori</div></div>' +
        '</div>' +
      '</section>' +
      '<section class="detail-block">' +
        '<h2 class="detail-block__title">Hesap Bilgileri</h2>' +
        '<table class="spec-table"><tbody>' +
          '<tr><th>Ad Soyad</th><td>' + App.escapeHTML(profile.name || '—') + '</td></tr>' +
          '<tr><th>E-posta</th><td>' + App.escapeHTML(profile.email || '—') + '</td></tr>' +
          '<tr><th>Telefon</th><td>' + App.escapeHTML(profile.phone || 'Belirtilmedi') + '</td></tr>' +
          '<tr><th>Şehir</th><td>' + App.escapeHTML(profile.city || 'Belirtilmedi') + '</td></tr>' +
          '<tr><th>Adres</th><td>' + App.escapeHTML(profile.address || 'Belirtilmedi') + '</td></tr>' +
          '<tr><th>Üyelik Tarihi</th><td>' + (profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('tr-TR') : '—') + '</td></tr>' +
        '</tbody></table>' +
        '<a class="btn btn--primary" href="profile.html?tab=info" style="margin-top:16px">Bilgilerimi Düzenle</a>' +
      '</section>';
  }

  function renderInfo(container, user) {
    const profile = App.getUserProfile() || {};

    container.innerHTML =
      '<section class="detail-block">' +
        '<h1 class="detail-block__title">Bilgilerim</h1>' +
        '<p style="color:var(--muted);font-size:.9rem">Hesap bilgilerinizi ve teslimat adresinizi güncelleyin. E-posta değiştirilemez.</p>' +
        '<form id="infoForm" novalidate>' +
          '<div class="form-grid">' +
            '<div class="form-field" data-field="name">' +
              '<label for="infoName">Ad Soyad</label>' +
              '<input type="text" id="infoName" value="' + App.escapeHTML(profile.name || '') + '">' +
              '<span class="field-error" data-error="name"></span>' +
            '</div>' +
            '<div class="form-field" data-field="email">' +
              '<label for="infoEmail">E-posta</label>' +
              '<input type="email" id="infoEmail" value="' + App.escapeHTML(profile.email || '') + '" readonly style="background:var(--bg);cursor:not-allowed">' +
            '</div>' +
            '<div class="form-field" data-field="phone">' +
              '<label for="infoPhone">Telefon</label>' +
              '<input type="tel" id="infoPhone" value="' + App.escapeHTML(profile.phone || '') + '" placeholder="05XX XXX XX XX">' +
              '<span class="field-error" data-error="phone"></span>' +
            '</div>' +
            '<div class="form-field" data-field="city">' +
              '<label for="infoCity">Şehir</label>' +
              '<input type="text" id="infoCity" value="' + App.escapeHTML(profile.city || '') + '" placeholder="Örn. İstanbul">' +
            '</div>' +
            '<div class="form-field form-field--full" data-field="address">' +
              '<label for="infoAddress">Adres</label>' +
              '<textarea id="infoAddress" placeholder="Mahalle, sokak, no, daire">' + App.escapeHTML(profile.address || '') + '</textarea>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">' +
            '<button class="btn btn--primary" type="submit">Kaydet</button>' +
            '<a class="btn btn--ghost" href="profile.html?tab=overview">İptal</a>' +
          '</div>' +
        '</form>' +
      '</section>';

    const form = container.querySelector('#infoForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = container.querySelector('#infoName').value.trim();
      const phone = container.querySelector('#infoPhone').value.trim();
      const city = container.querySelector('#infoCity').value.trim();
      const address = container.querySelector('#infoAddress').value.trim();

      const nameField = container.querySelector('[data-field="name"]');
      const phoneField = container.querySelector('[data-field="phone"]');
      const nameErr = container.querySelector('[data-error="name"]');
      const phoneErr = container.querySelector('[data-error="phone"]');

      nameField.classList.toggle('has-error', name.length < 2);
      nameErr.textContent = name.length < 2 ? 'Ad en az 2 karakter olmalı.' : '';

      const phoneDigits = phone.replace(/\D/g, '');
      const phoneBad = phone.length > 0 && phoneDigits.length < 10;
      phoneField.classList.toggle('has-error', phoneBad);
      phoneErr.textContent = phoneBad ? 'Geçerli bir telefon girin.' : '';

      if (name.length < 2 || phoneBad) {
        App.toast('Lütfen alanları kontrol edin.', 'error');
        return;
      }

      const res = App.updateUserProfile({ name, phone, city, address });
      if (!res.ok) { App.toast(res.error, 'error'); return; }

      App.renderAuthSlot(); // header'ı güncelle
      App.toast('Bilgileriniz kaydedildi.', 'success');

      setTimeout(() => { window.location.href = 'profile.html?tab=overview'; }, 500);
    });
  }

  function renderOrders(container, orders, successOrderNo) {
    if (!orders.length) {
      container.innerHTML =
        '<section class="detail-block">' +
          '<h1 class="detail-block__title">Siparişlerim</h1>' +
          '<div class="empty-state" style="margin:20px auto">' +
            '<div class="empty-state__icon">' + App.ICONS.box + '</div>' +
            '<h2>Henüz siparişiniz yok</h2>' +
            '<p>İlk siparişinizi oluşturmak için alışverişe başlayın.</p>' +
            '<a class="btn btn--primary" href="category.html">Alışverişe Başla</a>' +
          '</div>' +
        '</section>';
      return;
    }

    container.innerHTML =
      '<section class="detail-block">' +
        '<h1 class="detail-block__title">Siparişlerim</h1>' +
        '<div class="orders-list">' +
          orders.map(o => orderCardHTML(o, o.orderNo === successOrderNo)).join('') +
        '</div>' +
      '</section>';

    container.querySelectorAll('.order-card__item-img').forEach(App.attachImageFallback);
  }

  function orderCardHTML(order, highlight) {
    const date = order.date ? new Date(order.date).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' }) : '';
    const items = Array.isArray(order.items) ? order.items : [];

    return (
      '<article class="order-card' + (highlight ? ' order-card--highlight' : '') + '">' +
        '<div class="order-card__head">' +
          '<div>' +
            '<div class="order-card__no">#' + App.escapeHTML(order.orderNo) + '</div>' +
            '<div class="order-card__date">' + App.escapeHTML(date) + '</div>' +
          '</div>' +
          '<span class="order-status">' + App.escapeHTML(order.status || 'Hazırlanıyor') + '</span>' +
        '</div>' +
        '<div class="order-card__items">' +
          items.map(it =>
            '<div class="order-card__item">' +
              '<img class="order-card__item-img" src="' + App.escapeHTML(it.image || '') + '" alt="" loading="lazy">' +
              '<div class="order-card__item-body">' +
                '<div class="order-card__item-name">' + App.escapeHTML(it.name) + '</div>' +
                '<div class="order-card__item-meta">' + it.qty + ' adet × ' + App.formatPrice(it.price) + '</div>' +
              '</div>' +
              '<div class="order-card__item-total">' + App.formatPrice(Number(it.price) * it.qty) + '</div>' +
            '</div>'
          ).join('') +
        '</div>' +
        '<div class="order-card__foot">' +
          '<div class="order-card__addr">' +
            '<strong>Teslimat:</strong> ' + App.escapeHTML((order.customer && order.customer.name) || '') +
            ' — ' + App.escapeHTML((order.customer && order.customer.city) || '') +
          '</div>' +
          '<div class="order-card__total">Toplam: <strong>' + App.formatPrice(order.totals ? order.totals.total : 0) + '</strong></div>' +
        '</div>' +
      '</article>'
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.getAttribute('data-page') === 'profile') init();
  });
})(window);