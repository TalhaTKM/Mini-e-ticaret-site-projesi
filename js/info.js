/* =====================================================================
   info.js — Kurumsal / yasal bilgi sayfası
   ===================================================================== */
(function (global) {
  'use strict';
  const App = global.App;

  function init() {
    const root = document.getElementById('infoRoot');
    if (!root) return;

    // URL hash'ine göre scroll
    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.getAttribute('data-page') === 'info') init();
  });
})(window);