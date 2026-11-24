/* =====================================================================
   admin.js — Admin paneli (siparişler, kullanıcılar, stok yönetimi)
   ===================================================================== */
(function (global) {
  'use strict';
  const App = global.App;

  function init() {
    const root = document.getElementById('adminRoot');
    if (!root) return;

    if (!App.isAdmin()) {
      root.innerHTML =
        '<div class="empty-state"><div class="empty-state__icon">' + App.ICONS.shield + '</div>' +
          '<h2>Yetkisiz erişim</h2><p>Bu sayfayı yalnızca admin görebilir.</p>' +
          '<a class="btn btn--primary" href="auth.html">Giriş Yap</a></div>';
      return;
    }

    render(root);
  }

  function render(root) {
    App.getProducts().then(products => {
      const orders = App.readJSON(App.KEYS.orders, []);
      const orderList = Array.isArray(orders) ? orders : [];
      const users = App.getUsers();

      root.innerHTML =
        '<div class="admin-grid">' +

          '<section class="detail-block">' +
            '<h2 class="detail-block__title">Siparişler (' + orderList.length + ')</h2>' +
            (orderList.length
              ? '<div class="admin-list">' + orderList.map(o =>
                  '<div class="admin-item">' +
                    '<div class="admin-item__head">' +
                      '<strong>' + App.escapeHTML(o.orderNo) + '</strong>' +
                      '<span class="admin-item__date">' + new Date(o.date).toLocaleString('tr-TR') + '</span>' +
                    '</div>' +
                    '<div class="admin-item__body">' +
                      '<div><strong>Müşteri:</strong> ' + App.escapeHTML(o.customer.name) + ' — ' + App.escapeHTML(o.customer.email) + '</div>' +
                      '<div><strong>Adres:</strong> ' + App.escapeHTML(o.customer.address) + ', ' + App.escapeHTML(o.customer.city) + '</div>' +
                      '<div><strong>Ürünler:</strong> ' + o.items.map(it => App.escapeHTML(it.name) + ' ×' + it.qty).join(', ') + '</div>' +
                      '<div><strong>Toplam:</strong> ' + App.formatPrice(o.totals.total) + '</div>' +
                    '</div>' +
                  '</div>').join('') + '</div>'
              : '<p style="color:var(--muted)">Henüz sipariş yok.</p>') +
          '</section>' +

          '<section class="detail-block">' +
            '<h2 class="detail-block__title">Kullanıcılar (' + users.length + ')</h2>' +
            (users.length
              ? '<table class="spec-table"><tbody>' + users.map(u =>
                  '<tr><th>' + App.escapeHTML(u.name) + '</th><td>' + App.escapeHTML(u.email) + '</td></tr>'
                ).join('') + '</tbody></table>'
              : '<p style="color:var(--muted)">Kayıtlı kullanıcı yok.</p>') +
          '</section>' +

          '<section class="detail-block" style="grid-column:1/-1">' +
            '<h2 class="detail-block__title">Stok Yönetimi</h2>' +
            '<table class="admin-table">' +
              '<thead><tr><th>ID</th><th>Ürün</th><th>Kategori</th><th>Stok</th><th></th></tr></thead>' +
              '<tbody>' + products.map(p =>
                '<tr>' +
                  '<td>' + p.id + '</td>' +
                  '<td>' + App.escapeHTML(p.name) + '</td>' +
                  '<td>' + App.escapeHTML(p.category) + '</td>' +
                  '<td><input type="number" min="0" step="1" class="admin-stock" data-stock-id="' + p.id + '" value="' + Number(p.stock) + '"></td>' +
                  '<td><button type="button" class="btn btn--primary" data-stock-save="' + p.id + '">Kaydet</button></td>' +
                '</tr>').join('') + '</tbody>' +
            '</table>' +
          '</section>' +

        '</div>';

      root.querySelectorAll('[data-stock-save]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-stock-save');
          const input = root.querySelector('[data-stock-id="' + id + '"]');
          const v = parseInt(input.value, 10);
          if (!Number.isFinite(v) || v < 0) { App.toast('Geçersiz stok.', 'error'); return; }
          App.setStock(id, v);
          App.reloadProducts().then(() => App.toast('Stok güncellendi.', 'success'));
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.getAttribute('data-page') === 'admin') init();
  });
})(window);