/* =====================================================================
   cart.js — Sepet sayfası (giriş kontrolü ile)
   ===================================================================== */
(function (global) {
  'use strict';
  const App = global.App;

  function init() {
    const root = document.getElementById('cartRoot');
    if (!root) return;
    App.getProducts().then(products => render(root, products));
  }

  function render(root, products) {
    const items = App.getCartDetailed(products);
    const totals = App.calculateTotals(items);
    const countEl = document.getElementById('cartItemCount');
    if (countEl) countEl.textContent = String(totals.count);

    if (!items.length) {
      root.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state__icon">' + App.ICONS.emptyCart + '</div>' +
          '<h2>Sepetiniz boş</h2>' +
          '<p>Henüz sepetinize ürün eklemediniz.</p>' +
          '<a class="btn btn--primary" href="category.html">Alışverişe Başla</a>' +
        '</div>';
      return;
    }

    root.innerHTML =
      '<div class="cart-layout">' +
        '<div class="cart-main">' +
          '<div class="cart-list" id="cartList">' + items.map(cartItemHTML).join('') + '</div>' +
          '<div class="cart-actions">' +
            '<a class="btn btn--ghost" href="category.html">← Alışverişe Devam Et</a>' +
            '<button class="btn btn--danger-ghost" type="button" id="clearCartBtn">Sepeti Temizle</button>' +
          '</div>' +
        '</div>' +
        '<aside class="summary">' +
          '<h2>Sipariş Özeti</h2>' +
          '<div class="summary__row"><span>Ara Toplam</span><span>' + App.formatPrice(totals.subtotal) + '</span></div>' +
          '<div class="summary__row"><span>Kargo</span><span>' + (totals.shipping === 0 ? 'Ücretsiz' : App.formatPrice(totals.shipping)) + '</span></div>' +
          '<div class="summary__row"><span>Ürün Adedi</span><span>' + totals.count + ' adet</span></div>' +
          (totals.shipping > 0
            ? '<div class="summary__note">' + App.formatPrice(App.FREE_SHIPPING_LIMIT - totals.subtotal) + ' daha ekleyin, kargo ücretsiz olsun!</div>'
            : '<div class="summary__note">Tebrikler! Kargo ücretsiz.</div>') +
          '<div class="summary__row summary__row--total"><span>Genel Toplam</span><span>' + App.formatPrice(totals.total) + '</span></div>' +
          '<button class="btn btn--primary btn--block" type="button" id="goCheckout">Ödemeye Geç</button>' +
        '</aside>' +
      '</div>';

    bindEvents(root, products);
  }

  function cartItemHTML(entry) {
    const p = entry.product, qty = entry.qty;
    const lineTotal = Number(p.price) * qty;
    const image = (p.images && p.images[0]) || '';
    return (
      '<article class="cart-item" data-id="' + p.id + '">' +
        '<img class="cart-item__img" src="' + App.escapeHTML(image) + '" alt="' + App.escapeHTML(p.name) + '" loading="lazy">' +
        '<div class="cart-item__info">' +
          '<span class="cart-item__brand">' + App.escapeHTML(p.brand) + '</span>' +
          '<a class="cart-item__name" href="product.html?id=' + encodeURIComponent(p.id) + '">' + App.escapeHTML(p.name) + '</a>' +
          '<span class="cart-item__unit">Birim: ' + App.formatPrice(p.price) + '</span>' +
        '</div>' +
        '<div class="qty">' +
          '<button type="button" data-cart-dec="' + p.id + '" aria-label="Azalt">−</button>' +
          '<input type="number" min="1" value="' + qty + '" data-cart-qty="' + p.id + '" aria-label="Adet">' +
          '<button type="button" data-cart-inc="' + p.id + '" aria-label="Artır">+</button>' +
        '</div>' +
        '<div class="cart-item__total">' + App.formatPrice(lineTotal) + '</div>' +
        '<button class="cart-item__remove" type="button" data-cart-remove="' + p.id + '" aria-label="Kaldır">' + App.ICONS.trash + '</button>' +
      '</article>'
    );
  }

  function bindEvents(root, products) {
    root.querySelectorAll('.cart-item__img').forEach(App.attachImageFallback);

    root.addEventListener('click', e => {
      const dec = e.target.closest('[data-cart-dec]');
      if (dec) {
        const id = dec.getAttribute('data-cart-dec');
        const item = App.getCart().find(i => i.id === Number(id));
        if (!item) return;
        if (item.qty <= 1) { App.removeFromCart(id); App.toast('Ürün sepetten kaldırıldı.', 'info'); }
        else { App.updateCartItem(id, item.qty - 1); }
        render(root, products);
        return;
      }
      const inc = e.target.closest('[data-cart-inc]');
      if (inc) {
        const id = inc.getAttribute('data-cart-inc');
        const item = App.getCart().find(i => i.id === Number(id));
        if (!item) return;
        App.updateCartItem(id, item.qty + 1);
        render(root, products);
        return;
      }
      const rem = e.target.closest('[data-cart-remove]');
      if (rem) {
        App.removeFromCart(rem.getAttribute('data-cart-remove'));
        App.toast('Ürün sepetten kaldırıldı.', 'info');
        render(root, products);
        return;
      }
      const clearBtn = e.target.closest('#clearCartBtn');
      if (clearBtn) {
        if (window.confirm('Sepetteki tüm ürünleri kaldırmak istediğinize emin misiniz?')) {
          App.clearCart();
          App.toast('Sepet temizlendi.', 'info');
          render(root, products);
        }
        return;
      }
      const checkoutBtn = e.target.closest('#goCheckout');
      if (checkoutBtn) {
        if (!App.getCurrentUser()) {
          App.toast('Ödeme için giriş yapmanız gerekiyor.', 'info');
          setTimeout(() => {
            window.location.href = 'login.html?redirect=' + encodeURIComponent('checkout.html');
          }, 500);
          return;
        }
        window.location.href = 'checkout.html';
      }
    });

    root.addEventListener('change', e => {
      const input = e.target.closest('[data-cart-qty]');
      if (!input) return;
      const id = input.getAttribute('data-cart-qty');
      const value = parseInt(input.value, 10);
      if (!Number.isFinite(value) || value < 1) {
        App.removeFromCart(id);
        App.toast('Ürün sepetten kaldırıldı.', 'info');
      } else {
        App.updateCartItem(id, value);
      }
      render(root, products);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.getAttribute('data-page') === 'cart') init();
  });
})(window);