/* =====================================================================
   auth.js — Login ve Register sayfalarını yönetir
   ===================================================================== */
(function (global) {
  'use strict';
  const App = global.App;

  function getSafeRedirect(fallback) {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (!redirect) return fallback;
    // Sadece iç yollar — protokol / çift slash yasak
    if (/^[a-zA-Z0-9_\-\.\/\?\=\&\#\%]+$/.test(redirect) && !redirect.startsWith('//')) {
      return redirect;
    }
    return fallback;
  }

  function initLogin() {
    const root = document.getElementById('loginRoot');
    if (!root) return;

    const user = App.getCurrentUser();
    if (user) {
      // Zaten giriş yapmış
      window.location.href = getSafeRedirect('profile.html?tab=overview');
      return;
    }

    root.innerHTML =
      '<div class="auth-card">' +
        '<h1 class="auth-title">Giriş Yap</h1>' +
        '<p class="auth-sub">Hesabınıza giriş yaparak alışverişe devam edin.</p>' +
        '<form class="auth-form" id="loginForm" novalidate>' +
          '<div class="form-field">' +
            '<label for="loginEmail">E-posta</label>' +
            '<input type="email" id="loginEmail" autocomplete="email" placeholder="ornek@eposta.com">' +
            '<span class="field-error">Geçerli bir e-posta girin.</span>' +
          '</div>' +
          '<div class="form-field">' +
            '<label for="loginPassword">Şifre</label>' +
            '<input type="password" id="loginPassword" autocomplete="current-password" placeholder="••••••••">' +
            '<span class="field-error">Şifre en az 4 karakter olmalı.</span>' +
          '</div>' +
          '<button class="btn btn--primary btn--block" type="submit">Giriş Yap</button>' +
          '<div class="auth-hint">Hesabınız yok mu? <a href="register.html' +
            (window.location.search ? window.location.search.replace('?', '?') : '') + '">Kayıt olun</a></div>' +
          '<div class="auth-demo">Demo admin: <strong>admin@minishop.demo</strong> / <strong>admin123</strong></div>' +
        '</form>' +
      '</div>';

    // Register linkine redirect parametresini taşı
    const regLink = root.querySelector('a[href^="register"]');
    if (regLink) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      regLink.href = 'register.html' + (redirect ? '?redirect=' + encodeURIComponent(redirect) : '');
    }

    root.querySelector('#loginForm').addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = root.querySelector('#loginEmail');
      const passInput = root.querySelector('#loginPassword');
      const email = emailInput.value.trim();
      const pass = passInput.value;

      emailInput.closest('.form-field').classList.toggle('has-error', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email));
      passInput.closest('.form-field').classList.toggle('has-error', pass.length < 4);

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || pass.length < 4) {
        App.toast('Lütfen e-posta ve şifrenizi doğru girin.', 'error');
        return;
      }

      const res = App.login(email, pass);
      if (!res.ok) { App.toast(res.error, 'error'); return; }

      App.toast('Hoş geldin, ' + res.user.name + '!', 'success');
      const target = res.user.role === 'admin'
        ? 'admin.html'
        : getSafeRedirect('profile.html?tab=overview');
      setTimeout(() => { window.location.href = target; }, 400);
    });
  }

  function initRegister() {
    const root = document.getElementById('registerRoot');
    if (!root) return;

    const user = App.getCurrentUser();
    if (user) {
      window.location.href = getSafeRedirect('profile.html?tab=overview');
      return;
    }

    root.innerHTML =
      '<div class="auth-card">' +
        '<h1 class="auth-title">Hesap Oluştur</h1>' +
        '<p class="auth-sub">Hızlıca kayıt olun, alışverişe başlayın.</p>' +
        '<form class="auth-form" id="registerForm" novalidate>' +
          '<div class="form-field">' +
            '<label for="regName">Ad Soyad</label>' +
            '<input type="text" id="regName" autocomplete="name" placeholder="Ayşe Yılmaz">' +
            '<span class="field-error">Ad en az 2 karakter olmalı.</span>' +
          '</div>' +
          '<div class="form-field">' +
            '<label for="regEmail">E-posta</label>' +
            '<input type="email" id="regEmail" autocomplete="email" placeholder="ornek@eposta.com">' +
            '<span class="field-error">Geçerli bir e-posta girin.</span>' +
          '</div>' +
          '<div class="form-field">' +
            '<label for="regPassword">Şifre</label>' +
            '<input type="password" id="regPassword" autocomplete="new-password" placeholder="En az 4 karakter">' +
            '<span class="field-error">Şifre en az 4 karakter olmalı.</span>' +
          '</div>' +
          '<button class="btn btn--primary btn--block" type="submit">Hesap Oluştur</button>' +
          '<div class="auth-hint">Zaten hesabınız var mı? <a href="login.html" id="loginLink">Giriş yapın</a></div>' +
        '</form>' +
      '</div>';

    const loginLink = root.querySelector('#loginLink');
    if (loginLink) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      loginLink.href = 'login.html' + (redirect ? '?redirect=' + encodeURIComponent(redirect) : '');
    }

    root.querySelector('#registerForm').addEventListener('submit', e => {
      e.preventDefault();
      const nameInput = root.querySelector('#regName');
      const emailInput = root.querySelector('#regEmail');
      const passInput = root.querySelector('#regPassword');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const pass = passInput.value;

      nameInput.closest('.form-field').classList.toggle('has-error', name.length < 2);
      emailInput.closest('.form-field').classList.toggle('has-error', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email));
      passInput.closest('.form-field').classList.toggle('has-error', pass.length < 4);

      if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || pass.length < 4) {
        App.toast('Lütfen tüm alanları doğru doldurun.', 'error');
        return;
      }

      const res = App.register(name, email, pass);
      if (!res.ok) { App.toast(res.error, 'error'); return; }

      App.toast('Hesabınız oluşturuldu. Hoş geldiniz!', 'success');
      const target = getSafeRedirect('profile.html?tab=overview');
      setTimeout(() => { window.location.href = target; }, 500);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.getAttribute('data-page');
    if (page === 'login') initLogin();
    else if (page === 'register') initRegister();
  });
})(window);