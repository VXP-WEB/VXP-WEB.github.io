/* Botón "English" (Google Translate) + carga de los secretos */
(function () {
  var me = document.currentScript;
  var a = document.getElementById('translate-link');
  var h = location.hostname;
  // En la versión traducida no hace falta ni el botón ni los secretos
  if (h.indexOf('translate.goog') !== -1) { if (a) a.style.display = 'none'; return; }
  if (a) {
    var proxy = h.replace(/-/g, '--').replace(/\./g, '-') + '.translate.goog';
    a.href = 'https://' + proxy + location.pathname +
      '?_x_tr_sl=es&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp';
  }
  if (me && me.src) {
    var s = document.createElement('script');
    s.src = me.src.replace('lang.js', 'secretos.js');
    s.defer = true;
    document.body.appendChild(s);
  }
})();
