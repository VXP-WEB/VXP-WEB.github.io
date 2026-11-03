/* Entrada secreta a los retos (solo en "Sobre el proyecto") */
(function () {
  var SEQ = ['p-h1', 'p-h1', 'p-h1', 'p-julio', 'p-h2', 'p-h2', 'p-sup', 'p-cont'], pos = 0, ac;
  function tick(f) {
    try {
      if (localStorage.getItem('vxp_sonido') === '0') return;
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = 0.04;
      o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.06);
    } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[id^="p-"]');
    if (!el || SEQ.indexOf(el.id) < 0) return;
    if (el.id === SEQ[pos]) pos++; else pos = (el.id === SEQ[0]) ? 1 : 0;
    if (pos > 0) tick(300 + pos * 60);
    if (pos === SEQ.length) {
      try { localStorage.setItem('vxp_retos_on', '1'); } catch (x) {}
      tick(880); setTimeout(function () { location.href = 'retos.html'; }, 500);
    }
  });
})();
