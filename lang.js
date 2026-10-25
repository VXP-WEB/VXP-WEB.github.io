/* Botón "English": traduce la página actual con Google Translate */
(function () {
  var a = document.getElementById('translate-link');
  if (!a) return;
  var h = location.hostname;
  // Si ya estamos viendo la versión traducida, ocultamos el botón
  if (h.indexOf('translate.goog') !== -1) { a.style.display = 'none'; return; }
  var proxy = h.replace(/-/g, '--').replace(/\./g, '-') + '.translate.goog';
  a.href = 'https://' + proxy + location.pathname +
    '?_x_tr_sl=es&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp';
})();
