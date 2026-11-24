/* =====================================================================
   checkout.js — Demo ödeme (kart + kod) + stok düşme + profile yönlendirme
   ===================================================================== */
(function (global) {
  'use strict';
  const App = global.App;
  const PAYMENT_CODE = 'DEMO2026';

  function init() {
    const root = document.getElementById('checkoutRoot');
    if (!root) return;

    // Giriş kontrolü
    if (!App.getCurrentUser()) {
      App.toast('Ödeme için giriş yapın.', 'info');
      setTimeout(() => {
        window.location.href = 'login.html?redirect=' + encodeURIComponent('checkout.html');
      }, 400);
      return;
    }

    App.getProducts().then(products => {
      const items = App.getCartDetailed(products);
      if (!items.length) { renderEmpty(root); return; }
      renderCheckout(root, items);
    });
  }

  function renderEmpty(root) {
    root.innerHTML =
      '<div class="empty-state">' +
        '<div class="empty-state__icon">' + App.ICONS.emptyCart + '</div>' +
        '<h2>Ödeme yapılacak ürün yok</h2>' +
        '<p>Sepetiniz boş görünüyor.</p>' +
        '<a class="btn btn--primary" href="category.html">Alışverişe Başla</a>' +
      '</div>';
  }

  function renderCheckout(root, items) {
    const totals = App.calculateTotals(items);
    const profile = App.getUserProfile() || {};

    root.innerHTML =
      '<div class="checkout-layout">' +
        '<form class="checkout-form" id="checkoutForm" novalidate>' +

          '<fieldset>' +
            '<h2>Teslimat Bilgileri</h2>' +
            '<div class="form-grid">' +
              field('name', 'Ad Soyad', 'text', 'Örn. Ayşe Yılmaz', 'name', profile.name || '') +
              field('email', 'E-posta', 'email', 'ornek@eposta.com', 'email', profile.email || '') +
              field('phone', 'Telefon', 'tel', '05XX XXX XX XX', 'tel', profile.phone || '') +
              field('city', 'Şehir', 'text', 'Örn. İstanbul', 'address-level2', profile.city || '') +
              field('address', 'Adres', 'text', 'Mahalle, sokak, no, daire', 'street-address', profile.address || '', true) +
            '</div>' +
          '</fieldset>' +

          '<fieldset>' +
            '<h2>Kart Bilgileri (Demo)</h2>' +
            '<div class="pay-code-hint">' +
              'Bu demo ödeme ekranıdır; gerçek kart bilgisi istemez ve para çekmez. ' +
              'Sadece demo kartı kullanın: <strong>4242 4242 4242 4242</strong> · ' +
              'İsim: <strong>DEMO KART</strong> · SKT: <strong>12/30</strong> · CVV: <strong>123</strong>' +
            '</div>' +
            '<div class="form-grid">' +
              field('cardNumber', 'Kart Numarası', 'text', '4242 4242 4242 4242', 'cc-number', '', false, 'cardNumber') +
              field('cardHolder', 'Kart Üzerindeki İsim', 'text', 'DEMO KART', 'cc-name') +
              field('cardExpiry', 'Son Kullanma (AA/YY)', 'text', '12/30', 'cc-exp') +
              field('cardCvv', 'CVV', 'password', '123', 'cc-csc') +
            '</div>' +
          '</fieldset>' +

          '<fieldset>' +
            '<h2>Demo Ödeme Kodu</h2>' +
            '<div class="pay-code-hint">Devam etmek için kodu girin: <code>' + PAYMENT_CODE + '</code></div>' +
            '<div class="form-grid">' + field('paycode', 'Demo Ödeme Kodu', 'text', 'DEMO2026', 'off', '', false, 'paycode') + '</div>' +
          '</fieldset>' +

          '<button type="submit" class="btn btn--primary btn--block" style="margin-top:6px">Ödemeyi Tamamla — ' + App.formatPrice(totals.total) + '</button>' +
        '</form>' +

        '<aside class="summary">' +
          '<h2>Sipariş Özeti</h2>' +
          '<div class="checkout-items">' + items.map(entry => {
            const img = (entry.product.images && entry.product.images[0]) || '';
            return '<div class="checkout-item">' +
              '<img class="checkout-item__img" src="' + App.escapeHTML(img) + '" alt="" loading="lazy">' +
              '<div class="checkout-item__body">' +
                '<div class="checkout-item__name">' + App.escapeHTML(entry.product.name) + '</div>' +
                '<div class="checkout-item__qty">' + entry.qty + ' adet × ' + App.formatPrice(entry.product.price) + '</div>' +
              '</div>' +
              '<div class="checkout-item__price">' + App.formatPrice(Number(entry.product.price) * entry.qty) + '</div>' +
            '</div>';
          }).join('') + '</div>' +
          '<div class="summary__row"><span>Ara Toplam</span><span>' + App.formatPrice(totals.subtotal) + '</span></div>' +
          '<div class="summary__row"><span>Kargo</span><span>' + (totals.shipping === 0 ? 'Ücretsiz' : App.formatPrice(totals.shipping)) + '</span></div>' +
          '<div class="summary__row summary__row--total"><span>Genel Toplam</span><span>' + App.formatPrice(totals.total) + '</span></div>' +
          '<div class="summary__note">Demo kod: <strong>' + PAYMENT_CODE + '</strong></div>' +
          '<a class="btn btn--ghost btn--block" href="cart.html" style="margin-top:8px">Sepete Dön</a>' +
        '</aside>' +
      '</div>';

    root.querySelectorAll('.checkout-item__img').forEach(App.attachImageFallback);

    const num = root.querySelector('#ck-cardNumber');
    if (num) num.addEventListener('input', () => {
      let v = num.value.replace(/\D/g, '').slice(0, 16);
      num.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
    const exp = root.querySelector('#ck-cardExpiry');
    if (exp) exp.addEventListener('input', () => {
      let v = exp.value.replace(/\D/g, '').slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
      exp.value = v;
    });

    bindForm(root, items, totals);
  }

  function field(name, label, type, placeholder, autocomplete, value, full, extraId) {
    const id = 'ck-' + (extraId || name);
    return (
      '<div class="form-field' + (full ? ' form-field--full' : '') + '" data-field="' + name + '">' +
        '<label for="' + id + '">' + label + '</label>' +
        '<input type="' + type + '" id="' + id + '" name="' + name + '" placeholder="' + placeholder + '" autocomplete="' + autocomplete + '"' +
          (value ? ' value="' + App.escapeHTML(value) + '"' : '') + '>' +
        '<span class="field-error" data-error="' + name + '"></span>' +
      '</div>'
    );
  }

  function bindForm(root, items, totals) {
    const form = root.querySelector('#checkoutForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();

      // Giriş kontrolü (sayfa yenilendiyse ve çıkış yapıldıysa tekrar kontrol)
      if (!App.getCurrentUser()) {
        App.toast('Ödeme için giriş yapın.', 'info');
        setTimeout(() => { window.location.href = 'login.html?redirect=' + encodeURIComponent('checkout.html'); }, 400);
        return;
      }

      const get = k => {
        const el = form.querySelector('[name="' + k + '"]');
        return el ? el.value.trim() : '';
      };

      const values = {
        name: get('name'),
        email: get('email'),
        phone: get('phone'),
        city: get('city'),
        address: get('address'),
        cardNumber: get('cardNumber').replace(/\s/g, ''),
        cardHolder: get('cardHolder').toUpperCase(),
        cardExpiry: get('cardExpiry'),
        cardCvv: get('cardCvv'),
        paycode: get('paycode')
      };

      const errors = {};
      if (values.name.length < 3) errors.name = 'Ad soyad girin.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) errors.email = 'Geçerli e-posta girin.';
      if (values.phone.replace(/\D/g, '').length < 10) errors.phone = 'Geçerli telefon girin.';
      if (values.city.length < 2) errors.city = 'Şehir girin.';
      if (values.address.length < 10) errors.address = 'En az 10 karakter adres girin.';
      if (values.cardNumber !== App.DEMO_CARD.number) errors.cardNumber = 'Sadece demo kart: 4242 4242 4242 4242';
      if (values.cardHolder !== App.DEMO_CARD.holder) errors.cardHolder = 'Kart üzerindeki isim "DEMO KART" olmalı.';
      if (values.cardExpiry !== App.DEMO_CARD.expiry) errors.cardExpiry = 'SKT "12/30" olmalı.';
      if (values.cardCvv !== App.DEMO_CARD.cvv) errors.cardCvv = 'CVV "123" olmalı.';
      if (values.paycode !== PAYMENT_CODE) errors.paycode = 'Hatalı kod. Kod: ' + PAYMENT_CODE;

      ['name','email','phone','city','address','cardNumber','cardHolder','cardExpiry','cardCvv','paycode']
        .forEach(k => showError(form, k, errors[k] || ''));

      if (Object.keys(errors).length) {
        if (errors.paycode) App.toast('Hatalı ödeme kodu girdiniz.', 'error');
        else if (errors.cardNumber || errors.cardHolder || errors.cardExpiry || errors.cardCvv) App.toast('Kart bilgileri demo kartla eşleşmiyor.', 'error');
        else App.toast('Lütfen eksik alanları tamamlayın.', 'error');
        const first = form.querySelector('.form-field.has-error input');
        if (first) first.focus();
        return;
      }

      // Sipariş oluştur
      const orderNo = generateOrderNo();
      const order = {
        orderNo,
        date: new Date().toISOString(),
        status: 'Teslim Edildi (Demo)',
        items: items.map(e => ({ id: e.product.id, name: e.product.name, image: (e.product.images && e.product.images[0]) || '', price: Number(e.product.price), qty: e.qty })),
        totals: { subtotal: totals.subtotal, shipping: totals.shipping, total: totals.total, count: totals.count },
        customer: { name: values.name, email: values.email, phone: values.phone, city: values.city, address: values.address }
      };

      const orders = App.readJSON(App.KEYS.orders, []);
      const list = Array.isArray(orders) ? orders : [];
      list.unshift(order);
      App.writeJSON(App.KEYS.orders, list);

      // Stok düş
      const stockUpdates = {};
      items.forEach(entry => {
        stockUpdates[entry.product.id] = Math.max(0, Number(entry.product.stock) - entry.qty);
      });
      App.setStockBatch(stockUpdates);
      App.reloadProducts();

      // Adres bilgilerini profile kaydet (bir sonraki alışverişte otomatik dolu)
      App.updateUserProfile({
        name: values.name,
        phone: values.phone,
        city: values.city,
        address: values.address
      });

      App.clearCart();
      App.toast('Ödeme başarılı! Siparişiniz oluşturuldu.', 'success');

      setTimeout(() => {
        window.location.href = 'profile.html?tab=orders&success=' + encodeURIComponent(orderNo);
      }, 700);
    });
  }

  function showError(form, name, msg) {
    const fieldEl = form.querySelector('[data-field="' + name + '"]');
    const errEl = form.querySelector('[data-error="' + name + '"]');
    if (!fieldEl || !errEl) return;
    fieldEl.classList.toggle('has-error', !!msg);
    errEl.textContent = msg || '';
  }

  function generateOrderNo() {
    return 'MS-' + new Date().getFullYear() + '-' + (Math.floor(Math.random() * 90000) + 10000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.getAttribute('data-page') === 'checkout') init();
  });
})(window);