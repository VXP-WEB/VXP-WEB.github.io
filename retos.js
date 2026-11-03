/* Retos de VXP (entrega 1: 5 de 10) */
(function () {
  var TOTAL = 5; // subir a 10 cuando estén los 10 retos
  function $(s, r) { return (r || document).querySelector(s); }
  var timers = [], offs = [], raf = 0, ac;
  function clr() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; cancelAnimationFrame(raf); offs.forEach(function (f) { f(); }); offs = []; }
  function after(f, ms) { var t = setTimeout(f, ms); timers.push(t); return t; }
  function on(el, ev, fn) { el.addEventListener(ev, fn); offs.push(function () { el.removeEventListener(ev, fn); }); }
  function beep(ns, step, type) {
    try {
      if (localStorage.getItem('vxp_sonido') === '0') return;
      ac = ac || new (window.AudioContext || window.webkitAudioContext)(); step = step || 0.1;
      ns.forEach(function (f, i) {
        var t = ac.currentTime + i * step, o = ac.createOscillator(), g = ac.createGain();
        o.type = type || 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.15, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + step * 2.5);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + step * 2.7);
      });
    } catch (e) {}
  }

  /* 1. Smite or Die */
  function smite(A, win) {
    var R = [['Dragón', 1800, 600, 700], ['Heraldo', 2400, 800, 950], ['Buff Rojo', 2100, 900, 1100], ['Dragón Ancestral', 3000, 1000, 1400], ['Barón', 3500, 1200, 1600]], i = 0, live = false, t0 = 0, r;
    A.innerHTML = '<p id="s-t" style="color:#fff;margin:0 0 8px"></p><div class="bar"><div id="s-b" class="barin"></div><div id="s-m" class="mark"></div></div><button id="s-btn" class="newsletter-button" type="button" style="width:100%;padding:18px;margin:12px 0">SMITE</button><p id="s-msg">La línea blanca marca el daño de tu Smite. Púlsalo cuando la vida baje de la línea, pero antes de que llegue a cero (también sirve la barra espaciadora).</p><button id="s-go" class="support-button" type="button">Empezar</button>';
    var b = $('#s-b', A), m = $('#s-m', A), msg = $('#s-msg', A), t = $('#s-t', A), go = $('#s-go', A);
    function hpNow() { return r[1] - r[3] * (performance.now() - t0) / 1000; }
    function end(ok, text) {
      live = false; cancelAnimationFrame(raf); msg.textContent = text;
      if (ok) { beep([660, 880]); if (++i >= R.length) { msg.textContent += ' ¡Cinco objetivos asegurados!'; win(); return; } after(round, 1700); }
      else { beep([196, 147], 0.12, 'sine'); i = 0; go.hidden = false; go.textContent = 'Reintentar'; }
    }
    function tick() { if (!live) return; var h = hpNow(); b.style.width = Math.max(h, 0) / r[1] * 100 + '%'; if (h <= 0) { end(false, 'JG DIFF: el ' + r[0] + ' murió antes de tu Smite.'); return; } raf = requestAnimationFrame(tick); }
    function round() {
      r = R[i]; t.textContent = 'Objetivo ' + (i + 1) + '/5: ' + r[0] + ' · Daño del Smite: ' + r[2];
      m.style.left = r[2] / r[1] * 100 + '%'; b.style.width = '100%'; msg.textContent = i === 2 ? 'Uy, ese red es mío…' : 'Preparado…';
      after(function () { t0 = performance.now(); live = true; raf = requestAnimationFrame(tick); }, 1200);
    }
    function press() {
      if (!live) return; var h = hpNow();
      if (h <= 0) return end(false, 'JG DIFF: el ' + r[0] + ' murió antes de tu Smite.');
      if (h <= r[2]) return end(true, '¡Asegurado! El ' + r[0] + ' es tuyo.');
      end(false, i === 2 ? 'Ese red NO era tuyo: Rengar salió del arbusto.' : 'Demasiado pronto: GG NO JG.');
    }
    go.onclick = function () { go.hidden = true; round(); };
    $('#s-btn', A).onclick = press;
    on(document, 'keydown', function (e) { if (e.code === 'Space' && live) { e.preventDefault(); press(); } });
  }

  /* 3. El menisco perfecto */
  function menisco(A, win) {
    var C = [1000, 500, 100, 10, 1], S = [12, 16, 22, 30, 40], i = 0, f = 0, hold = false, T = 0.78, last = 0;
    A.innerHTML = '<p id="m-t" style="color:#fff;margin:0;text-align:center"></p><div class="flask"><div id="m-l" class="liq"></div><div class="aforo"></div></div><div class="secret-form" style="justify-content:center"><button id="m-pour" class="newsletter-button" type="button" style="touch-action:none">Mantén para verter</button><button id="m-drop" class="support-button" type="button">💧 Gota</button><button id="m-ok" class="support-button" type="button">Aforar ✔</button></div><p id="m-msg" style="text-align:center">Lleva el menisco hasta la línea roja. Error máximo: 2 %. No se puede sacar líquido.</p>';
    var l = $('#m-l', A), msg = $('#m-msg', A), t = $('#m-t', A);
    function reset() { f = 0; l.style.height = '0%'; t.textContent = 'Matraz ' + (i + 1) + '/5 · ' + C[i] + ' mL' + (i === 4 ? ' (como en la competencia)' : ''); }
    function fail(text) { msg.textContent = text; beep([196, 147], 0.12, 'sine'); reset(); }
    function show() { l.style.height = Math.min(f, 1) * 100 + '%'; if (f > T * 1.02) { hold = false; fail('Te pasaste del aforo. Otro matraz limpio.'); } }
    function loop(now) { var dt = last ? now - last : 0; last = now; if (hold) { f += S[i] / 100 * dt / 1000; show(); } raf = requestAnimationFrame(loop); }
    var p = $('#m-pour', A);
    p.onpointerdown = function () { hold = true; }; p.onpointerup = p.onpointerleave = p.onpointercancel = function () { hold = false; };
    $('#m-drop', A).onclick = function () { f += 0.004; show(); };
    $('#m-ok', A).onclick = function () {
      if (f <= 0) return; var e = Math.abs(f - T) / T * 100;
      if (e <= 2) {
        beep([660, 880]); msg.textContent = 'Error ' + e.toFixed(1) + ' %. ¡Aforado!';
        if (++i >= 5) { msg.textContent += ' Respeto. Nada más.'; cancelAnimationFrame(raf); win(); return; }
        after(function () { reset(); msg.textContent = 'Siguiente matraz…'; }, 1200);
      } else fail('Error de ' + e.toFixed(1) + ' %: fuera del 2 %.');
    };
    reset(); raf = requestAnimationFrame(loop);
  }

  /* 8. Memoria */
  function memoria(A, win) {
    var SY = ['<polygon points="24,6 32,20 16,20" fill="#f2c94c"/><polygon points="16,22 24,36 8,36" fill="#f2c94c"/><polygon points="32,22 40,36 24,36" fill="#f2c94c"/>',
      '<ellipse cx="24" cy="24" rx="20" ry="11" fill="#ff7a1a"/><ellipse cx="24" cy="24" rx="3.5" ry="11" fill="#111"/>',
      '<polygon points="24,6 42,40 6,40" fill="none" stroke="#fff" stroke-width="3"/><circle cx="24" cy="31" r="8" fill="none" stroke="#fff" stroke-width="3"/><line x1="24" y1="6" x2="24" y2="40" stroke="#fff" stroke-width="3"/>',
      '<text x="24" y="29" text-anchor="middle" font-size="14" font-weight="bold" fill="#4cc9f0" font-family="monospace">QWER</text>',
      '<path d="M10 42V20a14 14 0 0 1 28 0v22z" fill="#b8c4cc"/><path d="M14 18h20v6h-7v10h-6V24h-7z" fill="#111"/>',
      '<text x="24" y="34" text-anchor="middle" font-size="28">🦉</text>'],
      F = [82.41, 110, 146.83, 196, 246.94, 329.63], D = [900, 800, 700, 600, 500, 450, 400], seq = [], rd = 0, step = 0, busy = true;
    A.innerHTML = '<div class="pads6">' + SY.map(function (s) { return '<button class="pad6" type="button"><svg viewBox="0 0 48 48" width="52" height="52" aria-hidden="true">' + s + '</svg></button>'; }).join('') + '</div><p id="mm" style="text-align:center">Repite la secuencia. Siete rondas (hasta 15 símbolos). Cada símbolo suena como una cuerda de bajo.</p><button id="mg" class="support-button" type="button">Empezar</button>';
    var pads = [].slice.call(A.querySelectorAll('.pad6')), mm = $('#mm', A);
    function flash(k, ms, cb) { pads[k].classList.add('on'); beep([F[k]], 0.2, 'sawtooth'); after(function () { pads[k].classList.remove('on'); if (cb) cb(); }, ms); }
    function play() { busy = true; var j = 0; mm.textContent = 'Ronda ' + (rd + 1) + '/7 · ' + seq.length + ' símbolos. Mira…'; (function n() { if (j >= seq.length) { busy = false; step = 0; mm.textContent = 'Tu turno'; return; } flash(seq[j++], D[rd], function () { after(n, 160); }); })(); }
    function add(n) { for (var k = 0; k < n; k++) seq.push(Math.floor(Math.random() * 6)); }
    $('#mg', A).onclick = function () { seq = []; rd = 0; add(3); after(play, 400); };
    pads.forEach(function (p, k) {
      p.onclick = function () {
        if (busy) return; flash(k, 200);
        if (k !== seq[step]) { busy = true; mm.textContent = 'Fallaste en la ronda ' + (rd + 1) + '. Pulsa Empezar.'; beep([196, 147], 0.12, 'sine'); return; }
        if (++step === seq.length) { busy = true; if (rd >= 6) { mm.textContent = '¡Superado!'; win(); } else { rd++; add(2); mm.textContent = 'Bien…'; after(play, 700); } }
      };
    });
  }

  /* 9. Reflejos */
  function reflejos(A, win) {
    var RD = [[10, 1600, 700], [15, 1200, 550], [20, 900, 400]], TY = [['g', 'SMITE'], ['r', 'BUFF ROJO'], ['b', 'FLASH ×2'], ['y', 'RECALL (mantén)']], err = 0, n = 0, rd = 0, cur = null, rt = [], st = 'off', gapT, finT;
    A.innerHTML = '<p id="r-i" style="color:#fff;margin:0"></p><div id="rb" class="ref-box">Pulsa Empezar</div><p>Verde: Smite (1 clic) · Rojo: Buff Rojo (NO pulses) · Azul: Flash (doble clic) · Amarillo: Recall (mantén 1 s). Máximo 2 errores. No pulses sin señal.</p><button id="rg" class="support-button" type="button">Empezar</button>';
    var box = $('#rb', A), info = $('#r-i', A);
    function stat() { info.textContent = 'Ronda ' + (rd + 1) + '/3 · Señal ' + Math.min(n + 1, RD[rd][0]) + '/' + RD[rd][0] + ' · Errores: ' + err + '/2'; }
    function next() {
      if (n >= RD[rd][0]) {
        rd++; n = 0;
        if (rd >= 3) { var avg = rt.length ? Math.round(rt.reduce(function (a, b) { return a + b; }, 0) / rt.length) : 0; st = 'off'; box.className = 'ref-box'; box.textContent = '¡Superado! Promedio ' + avg + ' ms · mejor ' + Math.round(Math.min.apply(null, rt.concat([9999]))) + ' ms'; win(); return; }
      }
      stat(); st = 'gap'; cur = null; box.className = 'ref-box wait'; box.textContent = 'Espera…';
      gapT = after(show, RD[rd][1] * (0.6 + Math.random() * 0.9));
    }
    function show() {
      var ty = TY[Math.floor(Math.random() * 4)], dur = ty[0] === 'g' ? (rd === 2 && Math.random() < 0.4 ? 300 : RD[rd][2]) : ty[0] === 'r' ? 900 : ty[0] === 'b' ? 1100 : 1800;
      cur = { k: ty[0], t0: performance.now(), hit: 0, c: 0, dn: 0, held: 0 }; st = 'sig'; box.className = 'ref-box ' + ty[0]; box.textContent = ty[1];
      finT = after(finish, dur);
    }
    function good(text) { st = 'off'; cur = null; n++; box.textContent = text; after(next, 350); }
    function bad(text) {
      st = 'off'; cur = null; err++; n++; beep([196, 147], 0.1, 'sine');
      if (err > 2) { box.className = 'ref-box'; box.textContent = 'GG NO JG: demasiados errores. Pulsa Empezar.'; return; }
      box.className = 'ref-box'; box.textContent = text; stat(); after(next, 800);
    }
    function finish() {
      var c = cur; if (!c || st !== 'sig') return; if (c.dn) c.held = Math.max(c.held, performance.now() - c.dn);
      if (c.k === 'r') return good('Bien: esquivaste el Buff Rojo.');
      if (c.k === 'y' && c.held >= 1000) return good('Recall completo.');
      bad(c.k === 'g' ? 'Muy lento: JG DIFF.' : 'Señal fallida.');
    }
    on(box, 'pointerdown', function (e) {
      e.preventDefault();
      if (st === 'gap') { clearTimeout(gapT); return bad('Demasiado pronto.'); }
      if (st !== 'sig' || !cur) return; var c = cur;
      if (c.k === 'g') { clearTimeout(finT); var ms = performance.now() - c.t0; rt.push(ms); good(Math.round(ms) + ' ms'); }
      else if (c.k === 'r') { clearTimeout(finT); bad('Ese red NO era tuyo.'); }
      else if (c.k === 'b') { if (++c.c >= 2) { clearTimeout(finT); good('Flash ×2'); } }
      else c.dn = performance.now();
    });
    on(box, 'pointerup', function () { if (st === 'sig' && cur && cur.dn) { cur.held = Math.max(cur.held, performance.now() - cur.dn); cur.dn = 0; } });
    $('#rg', A).onclick = function () { clearTimeout(gapT); clearTimeout(finT); err = 0; n = 0; rd = 0; rt = []; next(); };
  }

  /* 10. Tecleo veloz */
  function tecleo(A, win) {
    var RD = [[15, ['Alotropo, isótopo y deuterio.', 'Brot es pan y U-Bahn es metro.']],
      [20, ['La leche es una emulsión de grasa dispersa en agua y proteínas.', 'Zaldrīzes es dragón, prūbres es manzana y rōva es grande.']],
      [25, ['Rogelio Funes Mori marcó de chilena en la final de ida del Apertura 2019 contra el América.', "Kai'Sa, Ashe y Lee Sin: dos arqueras y un monje ciego buscando objetivos en la jungla y la línea."]],
      [30, ['Doxiciclina, estereoisomería y micropipetas de 300 a 1000 microlitros: el menisco perfecto exige paciencia, pulso y calma.', 'Toxtricity grave, Decidueye, Gardevoir, Blaziken y Minccino: mi equipo ideal tiene bajo, arco, magia, fuego y orden.']]],
      rd = 0, tx = '', t0 = 0, tt, done = true;
    A.innerHTML = '<p id="t-i" style="color:#fff;margin:0"></p><p id="t-f" style="color:#fff;font-size:1.05rem"></p><input id="t-in" class="newsletter-input" style="width:100%" disabled autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Escribe el texto"><p id="t-m"></p><button id="t-go" class="support-button" type="button">Empezar</button>';
    var inp = $('#t-in', A), m = $('#t-m', A), fr = $('#t-f', A), inf = $('#t-i', A);
    function nz(s) { return s.replace(/[āēīōū]/g, function (c) { return 'aeiou'['āēīōū'.indexOf(c)]; }); }
    function load() { var o = RD[rd][1]; tx = o[Math.floor(Math.random() * o.length)]; fr.textContent = tx; inf.textContent = 'Ronda ' + (rd + 1) + '/4 · ' + tx.length + ' caracteres · ' + RD[rd][0] + ' s (empieza al teclear; con o sin rayita en el Alto Valyrio)'; inp.value = ''; inp.disabled = false; inp.focus(); t0 = 0; done = false; m.textContent = ''; }
    function finish(timeout) {
      if (done) return; done = true; clearInterval(tt); inp.disabled = true;
      var a = nz(tx), b = nz(inp.value), ok = 0; for (var k = 0; k < a.length; k++) if (b[k] === a[k]) ok++;
      var acc = ok / a.length * 100, el = (performance.now() - t0) / 60000, wpm = Math.round(inp.value.length / 5 / Math.max(el, 0.01));
      if (!timeout && b.length >= a.length && acc >= 95) {
        beep([660, 880]); m.textContent = 'Precisión ' + acc.toFixed(0) + ' % · ' + wpm + ' WPM.';
        if (++rd >= 4) { m.textContent += ' ¡Superado!'; win(); return; } after(load, 1500);
      } else { beep([196, 147], 0.12, 'sine'); m.textContent = (timeout ? 'Se acabó el tiempo. ' : '') + 'Precisión ' + acc.toFixed(0) + ' % (mínimo 95 %). Pulsa Empezar para reintentar la ronda.'; }
    }
    on(inp, 'paste', function (e) { e.preventDefault(); }); on(inp, 'drop', function (e) { e.preventDefault(); });
    on(inp, 'input', function () {
      if (!t0) { t0 = performance.now(); tt = setInterval(function () { var s = RD[rd][0] - (performance.now() - t0) / 1000; m.textContent = 'Tiempo: ' + Math.max(0, s).toFixed(1) + ' s'; if (s <= 0) finish(true); }, 100); timers.push(tt); }
      if (nz(inp.value).length >= nz(tx).length) finish(false);
    });
    $('#t-go', A).onclick = function () { clearInterval(tt); load(); };
  }

  var GAMES = [{ id: 'smite', n: '1. Smite or Die', d: 'Difícil · Reflejos', f: smite }, { id: 'maestre', n: '2. El maestre' }, { id: 'menisco', n: '3. El menisco perfecto', d: 'Difícil · Precisión', f: menisco },
    { id: 'rekkles', n: '4. Rekkles Mode' }, { id: 'arquero', n: '5. El arquero' }, { id: 'huerto', n: '6. El huerto' }, { id: 'clave', n: '7. La contraseña' },
    { id: 'memoria', n: '8. Memoria', d: 'Difícil · Concentración', f: memoria }, { id: 'reflejos', n: '9. Reflejos', d: 'Muy difícil · Atención', f: reflejos }, { id: 'tecleo', n: '10. Tecleo veloz', d: 'Difícil · Precisión', f: tecleo }];
  var IDS = GAMES.filter(function (g) { return g.f; }).map(function (g) { return g.id; }), P = [];
  try { P = JSON.parse(localStorage.getItem('vxp_retos2')) || []; } catch (e) {}
  function sync() {
    P = P.filter(function (id) { return IDS.indexOf(id) > -1; });
    try { localStorage.setItem('vxp_retos2', JSON.stringify(P)); localStorage.setItem('vxp_retos_total', TOTAL); localStorage.setItem('vxp_retos_ok', P.length >= TOTAL ? '1' : '0'); } catch (e) {}
  }
  function hub() {
    var h = $('#r-hub'); h.innerHTML = '';
    GAMES.forEach(function (g) {
      var b = document.createElement('button'), s = document.createElement('strong'), d = document.createElement('span'), ok = P.indexOf(g.id) > -1;
      b.type = 'button'; b.className = 'reto-card' + (ok ? ' ok' : ''); b.disabled = !g.f;
      s.textContent = (ok ? '✔ ' : '') + g.n; d.textContent = g.f ? g.d : 'En camino…'; b.append(s, d);
      if (g.f) b.onclick = function () { play(g); };
      h.appendChild(b);
    });
    $('#r-prog').textContent = 'Retos superados: ' + P.length + ' / ' + TOTAL + (TOTAL < 10 ? ' (más retos llegarán pronto)' : '');
  }
  function play(g) {
    clr(); $('#r-area').hidden = false; $('#r-title').textContent = g.n; $('#r-area').scrollIntoView({ behavior: 'smooth' });
    g.f($('#r-game'), function () { if (P.indexOf(g.id) < 0) P.push(g.id); sync(); hub(); beep([523, 659, 784, 1047], 0.12); });
  }
  var open = false; try { open = localStorage.getItem('vxp_retos_on') === '1'; } catch (e) {}
  if (!open) { $('#r-no').hidden = false; return; }
  $('#r-yes').hidden = false; sync(); hub();
  var intro = $('#intro'), seen = false; try { seen = localStorage.getItem('vxp_retos_intro') === '1'; } catch (e) {}
  if (!seen) intro.hidden = false;
  $('#intro-ok').onclick = function () { intro.hidden = true; try { localStorage.setItem('vxp_retos_intro', '1'); } catch (e) {} };
  $('#intro-ver').onclick = function () { intro.hidden = false; };
})();
