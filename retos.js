/* Retos de VXP */
(function () {
  var TOTAL = 10;
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

  /* 2. El maestre */
  var QS = [
    ['Literatura', '¿Cómo se conoce a Catelyn Stark tras volver a la vida en los libros?', ['Lady Stoneheart', 'La Dama Gris', 'Lady Blackwater', 'La Viuda Roja'], 0],
    ['Literatura', '¿Cuál es el segundo libro de Canción de hielo y fuego?', ['Juego de tronos', 'Choque de reyes', 'Tormenta de espadas', 'Festín de cuervos'], 1],
    ['Idiomas', '¿Quién creó el Alto Valyrio y el dothraki para la serie?', ['David J. Peterson', 'George R. R. Martin', 'Marc Okrand', 'Christopher Tolkien'], 0],
    ['Literatura', '¿Qué creó Tolkien antes que sus historias, según él mismo?', ['Los mapas', 'Las lenguas élficas', 'Los poemas', 'Los nombres de los reinos'], 1],
    ['Literatura', '¿Cuántos Anillos de Poder se forjaron para los Elfos?', ['Uno', 'Tres', 'Siete', 'Nueve'], 1],
    ['Videojuegos', '¿Qué determina la forma (aguda o grave) de Toxtricity?', ['Su naturaleza', 'Su nivel', 'Su objeto', 'Su entrenador'], 0],
    ['Videojuegos', '¿En qué región transcurren Pokémon Rubí y Zafiro?', ['Kanto', 'Johto', 'Hoenn', 'Sinnoh'], 2],
    ['Videojuegos', '¿Quién es la Campeona zora en Breath of the Wild?', ['Mipha', 'Urbosa', 'Revali', 'Daruk'], 0],
    ['Videojuegos', '¿Cuántas semillas Korok hay en Breath of the Wild?', ['600', '800', '900', '1000'], 2],
    ['Videojuegos', '¿Qué campeón de LoL usa una armadura simbiótica del Vacío?', ["Kai'Sa", "Vel'Koz", 'Kassadin', "Kha'Zix"], 0],
    ['Videojuegos', '¿Qué reino es el escenario de Dark Souls 1?', ['Lordran', 'Drangleic', 'Lothric', 'Yharnam'], 0],
    ['Videojuegos', '¿Cuál es la IA que acompaña al Jefe Maestro en Halo?', ['Cortana', 'Athena', 'GLaDOS', 'Navi'], 0],
    ['Esports', '¿Qué jugador fue campeón del mundo en 2024 como suplente de T1 sin jugar una partida?', ['Rekkles', 'Caps', 'Upset', 'Humanoid'], 0],
    ['Esports', '¿Qué colores representan a Fnatic?', ['Naranja y negro', 'Azul y blanco', 'Rojo y blanco', 'Verde y negro'], 0],
    ['Deportes', '¿Contra quién marcó Funes Mori su chilena en la final de ida del Apertura 2019?', ['América', 'Tigres', 'Cruz Azul', 'Pumas'], 0],
    ['Deportes', '¿Cómo ganó Monterrey la final de vuelta del Apertura 2019?', ['Por penales', 'Con gol de oro', '3-0 en 90 minutos', 'Por goles de visitante'], 0],
    ['Anime', '¿Cuál es la técnica de rayo de Kakashi?', ['Rasengan', 'Chidori', 'Amaterasu', 'Kirin'], 1],
    ['Anime', '¿Cuántos universos participan en el Torneo del Poder de Dragon Ball Super?', ['6', '8', '10', '12'], 1],
    ['Anime', '¿Quiénes lideraban al bando enemigo en la Cuarta Gran Guerra Ninja?', ['Obito y Madara', 'Orochimaru y Kabuto', 'Pain y Konan', 'Danzo y Root'], 0],
    ['Cine', '¿Quién dirigió Halloween (1978)?', ['John Carpenter', 'Wes Craven', 'Sean S. Cunningham', 'Rob Zombie'], 0],
    ['Cine', '¿Qué actor es Joel en The Last of Us y Din Djarin en The Mandalorian?', ['Pedro Pascal', 'Oscar Isaac', 'Diego Luna', 'Bryan Cranston'], 0],
    ['Cine', '¿Qué astronauta mexicano inspira la película A Million Miles Away?', ['José Hernández', 'Rodolfo Neri Vela', 'Carlos Noriega', 'Ellen Ochoa'], 0],
    ['Cine', '¿Quién escribió la novela Project Hail Mary?', ['Andy Weir', 'Arthur C. Clarke', 'Isaac Asimov', 'Carl Sagan'], 0],
    ['Ciencia', 'La leche es un ejemplo de…', ['Solución', 'Emulsión', 'Aleación', 'Compuesto puro'], 1],
    ['Ciencia', '¿Qué isótopo del hidrógeno tiene un neutrón?', ['Protio', 'Deuterio', 'Tritio', 'Helio'], 1],
    ['Ciencia', '¿Cuál NO es un alótropo del carbono?', ['Grafito', 'Diamante', 'Grafeno', 'Cuarzo'], 3],
    ['Ciencia', 'La doxiciclina pertenece a la familia de las…', ['Penicilinas', 'Tetraciclinas', 'Macrólidos', 'Quinolonas'], 1],
    ['Ciencia', 'Al aforar un matraz, el volumen se lee en…', ['El borde superior del menisco', 'La parte inferior del menisco', 'El tapón', 'La etiqueta'], 1],
    ['Ciencia', '¿Qué planeta tiene un día más largo que su año?', ['Venus', 'Mercurio', 'Marte', 'Neptuno'], 0],
    ['Historia', '¿En qué año se fundó Monterrey?', ['1521', '1596', '1646', '1810'], 1],
    ['Idiomas', 'En alemán, «U-Bahn» significa…', ['Metro', 'Autobús', 'Tranvía', 'Aeropuerto'], 0],
    ['Música', '¿Cuál es la afinación estándar de un bajo de 4 cuerdas (de grave a aguda)?', ['Mi, La, Re, Sol', 'Do, Mi, Sol, Si', 'Re, La, Mi, Si', 'La, Re, Sol, Do'], 0]
  ];
  function maestre(A, win) {
    var qs = [], i = 0, ok = 0, tt, t0 = 0, lock = true;
    A.innerHTML = '<p id="q-i" style="color:#fff;margin:0 0 8px"></p><div class="bar"><div id="q-b" class="barin" style="background:var(--accent-color)"></div></div><p id="q-q" style="color:#fff;font-size:1.05rem;margin:14px 0"></p><div id="q-o" style="display:grid;gap:8px"></div><p id="q-m"></p><button id="q-go" class="support-button" type="button">Empezar</button>';
    var inf = $('#q-i', A), bar = $('#q-b', A), qq = $('#q-q', A), o = $('#q-o', A), m = $('#q-m', A);
    function ask() {
      var q = qs[i]; lock = false; inf.textContent = 'Pregunta ' + (i + 1) + '/10 · ' + q[0] + ' · Aciertos: ' + ok; qq.textContent = q[1]; m.textContent = ''; o.innerHTML = '';
      q[2].map(function (t, k) { return { t: t, c: k === q[3] }; }).sort(function () { return Math.random() - 0.5; }).forEach(function (x) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'support-button'; b.style.textAlign = 'left'; b.textContent = x.t; b.onclick = function () { answer(x.c, false); }; o.appendChild(b);
      });
      t0 = performance.now(); clearInterval(tt); tt = setInterval(function () { var s = 12 - (performance.now() - t0) / 1000; bar.style.width = Math.max(s, 0) / 12 * 100 + '%'; if (s <= 0) answer(false, true); }, 100); timers.push(tt);
    }
    function answer(c, to) {
      if (lock) return; lock = true; clearInterval(tt); if (c) ok++;
      m.textContent = c ? '✔ Correcto' : (to ? '⏱ Se acabó el tiempo' : '✘ Incorrecto'); beep(c ? [660, 880] : [196, 147], 0.1, c ? 'triangle' : 'sine');
      [].forEach.call(o.querySelectorAll('button'), function (b) { b.disabled = true; });
      after(function () { if (++i >= 10) fin(); else ask(); }, 800);
    }
    function fin() {
      o.innerHTML = ''; qq.textContent = ''; bar.style.width = '0%';
      if (ok >= 8) { m.textContent = 'Aciertos: ' + ok + '/10. ¡Superado! Digno de la Ciudadela.'; win(); }
      else { m.textContent = 'Aciertos: ' + ok + '/10 (necesitas 8). Pulsa Empezar para otra tanda.'; $('#q-go', A).hidden = false; }
    }
    $('#q-go', A).onclick = function () { qs = QS.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 10); i = 0; ok = 0; $('#q-go', A).hidden = true; ask(); };
  }

  /* 4. Rekkles Mode */
  function rekkles(A, win) {
    A.innerHTML = '<div class="secret-form"><button id="k-kai" class="support-button" type="button">Jugar con Kai\'Sa</button><button id="k-ash" class="support-button" type="button">Jugar con Ashe</button></div><canvas id="k-c" width="600" height="320" style="width:100%;background:#0d0d0d;border:1px solid #2d2d2d;border-radius:8px;touch-action:none;margin-top:8px"></canvas><button id="k-atk" class="newsletter-button" type="button" style="width:100%;margin-top:8px">ATACAR (espacio)</button><p id="k-m">Muévete con WASD o las flechas (o arrastra sobre la pantalla). Sobrevive 45 s, remata 10 súbditos cuando les quede poca vida (30 o menos) y no recibas más de 2 impactos. Kai\'Sa es más veloz; Ashe ataca de más lejos.</p>';
    var cv = $('#k-c', A), cx = cv.getContext('2d'), m = $('#k-m', A), keys = {}, tgt = null, run = false, G, last = 0;
    on(document, 'keydown', function (e) { var k = e.key.toLowerCase(); keys[k] = true; if (run && (e.code === 'Space' || k.indexOf('arrow') === 0)) e.preventDefault(); if (run && e.code === 'Space') atk(); });
    on(document, 'keyup', function (e) { keys[e.key.toLowerCase()] = false; });
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * 600, y: (e.clientY - r.top) / r.height * 320 }; }
    cv.onpointerdown = function (e) { tgt = pos(e); }; cv.onpointermove = function (e) { if (tgt) tgt = pos(e); }; cv.onpointerup = cv.onpointerleave = function () { tgt = null; };
    $('#k-atk', A).onclick = function () { if (run) atk(); };
    $('#k-kai', A).onclick = function () { start('k'); }; $('#k-ash', A).onclick = function () { start('a'); };
    function start(ch) { cancelAnimationFrame(raf); G = { ch: ch, t: 0, p: { x: 80, y: 160, r: 10, sp: ch === 'k' ? 240 : 210, rg: ch === 'k' ? 90 : 150, cd: 0, inv: 0 }, mi: [], hz: [], cs: 0, hits: 0, sm: 0, sh: 1, fl: 0 }; run = true; last = 0; m.textContent = ''; raf = requestAnimationFrame(loop); }
    function atk() {
      var p = G.p; if (p.cd > 0) return; p.cd = 0.45; G.fl = 0.12; var b = null, bd = 1e9;
      G.mi.forEach(function (q) { var d = Math.hypot(q.x - p.x, q.y - p.y); if (d < p.rg && d < bd) { b = q; bd = d; } });
      if (!b) return; b.hp -= 30; if (b.hp <= 0) { G.cs++; G.mi.splice(G.mi.indexOf(b), 1); beep([880], 0.05); }
    }
    function spawn() {
      var t = G.t, r = Math.random(), y = 20 + Math.random() * 280;
      if (t > 12 && r < 0.25) G.hz.push({ k: 'r', y: y, t: 0, w: 0.9 });
      else if (t > 20 && r < 0.45) G.hz.push({ k: 's', x: 80 + Math.random() * 480, y: y, R: 46, t: 0, w: 0.8 });
      else G.hz.push({ k: 'b', x: 610, y: y, vx: -(150 + t * 4), vy: (Math.random() - 0.5) * 70, r: 7, t: 0 });
    }
    function end(ok, text) {
      run = false; var g = G;
      m.textContent = (ok ? '¡Superado! ' : text + ' ') + 'KDA 0/' + g.hits + '/0 · CS ' + g.cs + ' · Daño recibido ' + g.hits * 300 + '. ' + (ok ? 'Rekkles estaría orgulloso.' : 'Elige un campeón para reintentar.');
      if (ok) win(); else beep([196, 147], 0.12, 'sine');
    }
    function draw() {
      var g = G, p = g.p; cx.clearRect(0, 0, 600, 320);
      g.mi.forEach(function (q) { cx.fillStyle = q.hp <= 30 ? '#ffb347' : '#8a5a1e'; cx.beginPath(); cx.arc(q.x, q.y, 9, 0, 7); cx.fill(); cx.fillStyle = '#7ee787'; cx.fillRect(q.x - 10, q.y - 15, 20 * Math.min(q.hp, 130) / 130, 3); });
      g.hz.forEach(function (h) {
        if (h.k === 'b') { cx.fillStyle = '#ff5e5b'; cx.beginPath(); cx.arc(h.x, h.y, h.r, 0, 7); cx.fill(); }
        else if (h.k === 'r') { cx.fillStyle = h.t < h.w ? 'rgba(255,94,91,.25)' : '#ff5e5b'; cx.fillRect(0, h.y - (h.t < h.w ? 1 : 8), 600, h.t < h.w ? 2 : 16); }
        else { cx.beginPath(); cx.arc(h.x, h.y, h.R, 0, 7); if (h.t < h.w) { cx.strokeStyle = 'rgba(255,94,91,.6)'; cx.stroke(); } else { cx.fillStyle = 'rgba(255,94,91,.7)'; cx.fill(); } }
      });
      if (g.fl > 0) { cx.strokeStyle = 'rgba(255,255,255,.3)'; cx.beginPath(); cx.arc(p.x, p.y, p.rg, 0, 7); cx.stroke(); g.fl -= 0.016; }
      if (p.inv <= 0 || Math.floor(g.t * 12) % 2) { cx.fillStyle = g.ch === 'k' ? '#bb86fc' : '#4cc9f0'; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); }
      cx.fillStyle = '#ff7a1a'; cx.font = '13px monospace'; cx.fillText('Tiempo ' + Math.min(45, g.t).toFixed(0) + '/45 · CS ' + g.cs + '/10 · Impactos ' + g.hits + '/2', 10, 18);
    }
    function loop(now) {
      if (!run) return; var dt = Math.min((now - (last || now)) / 1000, 0.05); last = now; var g = G, p = g.p; g.t += dt;
      var dx = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0), dy = (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0);
      if (tgt) { var ex = tgt.x - p.x, ey = tgt.y - p.y, d = Math.hypot(ex, ey); if (d > 6) { dx = ex / d; dy = ey / d; } } else if (dx && dy) { dx *= 0.707; dy *= 0.707; }
      p.x = Math.max(10, Math.min(590, p.x + dx * p.sp * dt)); p.y = Math.max(10, Math.min(310, p.y + dy * p.sp * dt)); p.cd -= dt; p.inv -= dt;
      g.sm -= dt; if (g.sm <= 0) { g.sm = 1.5; g.mi.push({ x: 610, y: 25 + Math.random() * 270, hp: 55 + Math.random() * 70 }); }
      g.mi.forEach(function (q) { q.x -= 28 * dt; q.hp -= (6 + g.t * 0.1) * dt; }); g.mi = g.mi.filter(function (q) { return q.hp > 0 && q.x > -10; });
      g.sh -= dt; if (g.sh <= 0) { g.sh = Math.max(0.4, 1.25 - g.t * 0.018); spawn(); }
      g.hz.forEach(function (h) { h.t += dt; if (h.k === 'b') { h.x += h.vx * dt; h.y += h.vy * dt; } });
      g.hz = g.hz.filter(function (h) { return h.k === 'b' ? h.x > -20 && h.y > -20 && h.y < 340 : h.t < h.w + 0.25; });
      if (p.inv <= 0) g.hz.forEach(function (h) {
        var hit = h.k === 'b' ? Math.hypot(h.x - p.x, h.y - p.y) < h.r + p.r : h.t < h.w ? false : h.k === 'r' ? Math.abs(h.y - p.y) < 9 + p.r * 0.5 : Math.hypot(h.x - p.x, h.y - p.y) < h.R + p.r * 0.5;
        if (hit && p.inv <= 0) { g.hits++; p.inv = 1; beep([196, 147], 0.08, 'sawtooth'); }
      });
      draw();
      if (g.hits > 2) return end(false, 'ADC GAP: te borraron del mapa.');
      if (g.t >= 45) return end(g.cs >= 10, 'Te faltó farmeo: ' + g.cs + '/10 súbditos.');
      raf = requestAnimationFrame(loop);
    }
  }

  /* 5. El arquero */
  function arquero(A, win) {
    var RD = [[300, 28, 0], [380, 24, 0], [400, 14, 0], [430, 22, 40], [500, 18, 40]], i = 0, pts = [], fly = null, trace = [], V = 5.2, GV = 400, X0 = 60, Y0 = 250, live = true;
    A.innerHTML = '<p id="a-i" style="color:#fff;margin:0"></p><canvas id="a-c" width="600" height="300" style="width:100%;background:#0d0d0d;border:1px solid #2d2d2d;border-radius:8px"></canvas><label>Ángulo: <strong id="a-av">45</strong>°<input id="a-a" type="range" min="10" max="80" value="45" style="width:100%"></label><label>Potencia: <strong id="a-pv">60</strong><input id="a-p" type="range" min="20" max="100" value="60" style="width:100%"></label><button id="a-f" class="newsletter-button" type="button" style="width:100%;margin-top:8px">Disparar</button><p id="a-m">Cinco disparos, 50 puntos posibles. Necesitas 35. El centro (manzana dorada) vale 10. Tu disparo anterior queda dibujado como guía.</p>';
    var cv = $('#a-c', A), cx = cv.getContext('2d'), m = $('#a-m', A), sa = $('#a-a', A), sp = $('#a-p', A), inf = $('#a-i', A);
    sa.oninput = function () { $('#a-av', A).textContent = sa.value; }; sp.oninput = function () { $('#a-pv', A).textContent = sp.value; };
    function ty(tm) { return 190 + RD[i][2] * Math.sin(6.2832 * tm / 2.5); }
    function scene(now) {
      cx.clearRect(0, 0, 600, 300); var s = RD[i], tx = X0 + s[0], tm = now / 1000, y = ty(tm);
      cx.strokeStyle = '#2d2d2d'; cx.beginPath(); cx.moveTo(0, 272); cx.lineTo(600, 272); cx.stroke();
      cx.fillStyle = '#bb86fc'; cx.fillRect(X0 - 6, Y0 - 14, 4, 28); cx.strokeStyle = '#bb86fc'; cx.beginPath(); cx.arc(X0 - 6, Y0, 16, -1.2, 1.2); cx.stroke();
      [1, 0.8, 0.6, 0.4, 0.2].forEach(function (f, k) { cx.fillStyle = ['#5b3a1a', '#8a5a1e', '#b8863a', '#d6a64a', '#f2c94c'][k]; cx.beginPath(); cx.arc(tx, y, s[1] * f, 0, 7); cx.fill(); });
      if (i === 4) { cx.font = '22px serif'; cx.textAlign = 'center'; cx.fillText('🦉', tx, y - s[1] - 6); cx.textAlign = 'left'; }
      if (trace.length) { cx.fillStyle = 'rgba(255,255,255,.25)'; trace.forEach(function (q, k) { if (k % 4 === 0) cx.fillRect(q[0], q[1], 2, 2); }); }
      if (fly) { var k = Math.min(fly.p.length - 1, Math.floor((now - fly.t0) / 10)); cx.fillStyle = '#fff'; cx.fillRect(fly.p[k][0] - 5, fly.p[k][1] - 1, 10, 2); }
    }
    function frame(now) { if (!live) return; scene(now); if (fly && (now - fly.t0) / 10 >= fly.p.length - 1) { var f = fly; fly = null; land(f); } raf = requestAnimationFrame(frame); }
    function land(f) {
      var sc = f.hit ? Math.max(0, Math.round(10 * (1 - f.dy / RD[i][1]))) : 0; pts.push(sc); trace = f.p;
      m.textContent = f.hit ? (sc >= 10 ? '¡En el centro! +10' : sc ? '+' + sc + ' puntos' : 'Rozaste el borde: 0 puntos') : 'Cayó antes de llegar: 0 puntos';
      beep(sc ? [660, 880] : [196, 147], 0.1, sc ? 'triangle' : 'sine');
      var tot = pts.reduce(function (a, b) { return a + b; }, 0);
      if (++i >= 5) { live = false; $('#a-f', A).hidden = false; if (tot >= 35) { m.textContent += ' Total ' + tot + '/50. ¡Superado!'; win(); } else { m.textContent += ' Total ' + tot + '/50 (necesitas 35). Pulsa Disparar para reintentar.'; i = 0; pts = []; live = true; raf = requestAnimationFrame(frame); } }
      info();
    }
    function info() { inf.textContent = 'Disparo ' + (i + 1) + '/5 · Puntos: ' + pts.reduce(function (a, b) { return a + b; }, 0); }
    $('#a-f', A).onclick = function () {
      if (fly) return; var a = sa.value * Math.PI / 180, v = sp.value * V, s = RD[i], tx = X0 + s[0], p = [], t = 0, x, y, hit = false, dy = 0, now = performance.now();
      for (; t < 6; t += 0.01) { x = X0 + v * Math.cos(a) * t; y = Y0 - v * Math.sin(a) * t + 0.5 * GV * t * t; p.push([x, y]); if (x >= tx) { hit = true; dy = Math.abs(y - ty(now / 1000 + t)); break; } if (y > 272) break; }
      fly = { p: p, t0: now, hit: hit, dy: dy };
    };
    info(); raf = requestAnimationFrame(frame);
  }
var EVH = {
  1: { t: 'El suelo está seco.', f: function (S, k) { S.a -= 20 * k; } },
  5: { t: 'Se aproxima una ola de calor.', f: function (S, k) { S.a -= 25 * k; S.l += 10; } },
  10: { t: 'El árbol necesita nutrientes.', f: function (S, k) { S.n -= 25 * k; } },
  12: { t: 'Nacho y Tania escarban cerca de las raíces.', f: function (S, k) { S.s -= 12 * k; } },
  15: { t: 'Lluvias abundantes.', f: function (S, k) { S.a += 35 * (k < 1 ? 0.3 : 1); } },
  18: { t: 'Un búho se posa en las ramas y vigila.', f: function (S) { S.s += 8; } },
  22: { t: 'Aparece una plaga.', f: function (S, k) { S.s -= 40 * k; } },
  26: { t: 'Llega una helada nocturna.', f: function (S, k) { S.s -= 20 * k; S.l -= 15 * k; } }
};
function cl(v) { return Math.max(0, Math.min(100, v)); }
function hstep(S, day, act, rnd) {
  var prot = act === 'p', k = prot ? 0.3 : 1;
  if (act === 'r') S.a += 30;
  if (act === 'a') { S.n += 30; S.a -= 4; }
  if (act === 'e') { S.l += 4; S.s += 1; }
  if (prot) S.s += 2;
  if (EVH[day]) EVH[day].f(S, k);
  S.a -= 6; S.n -= 3; S.l += rnd() * 22 - 12;
  S.a = cl(S.a); S.n = cl(S.n); S.l = Math.max(20, cl(S.l)); S.s = cl(S.s);
  var d = 0;
  if (S.a < 35 || S.a > 88) d -= 6;
  if (S.n < 25) d -= 4;
  if (S.l < 30) d -= 3;
  if (S.a >= 40 && S.a <= 80 && S.n >= 40 && S.l >= 45) d += 2;
  S.s = cl(S.s + d);
}

  /* 6. El huerto */
  function huerto(A, win) {
    var day = 1, S = null, done = true;
    A.innerHTML = '<p id="h-t" style="color:#fff;margin:0"></p><div id="h-tree" style="font-size:3rem;text-align:center;margin:6px 0">🌱</div><div id="h-bars"></div><p id="h-e" style="color:#fff;margin:10px 0 2px"></p><p id="h-w" style="color:var(--muted-color);margin:0 0 10px"></p><div class="secret-form"><button class="support-button" type="button" data-a="r">💧 Regar</button><button class="support-button" type="button" data-a="a">🌿 Abonar</button><button class="support-button" type="button" data-a="e">⏳ Esperar</button><button class="support-button" type="button" data-a="p">🛡 Proteger</button></div><p id="h-m">Cuida a Prūbres durante 30 días y llega al final con al menos 80 de salud. Cada acción consume un día.</p><button id="h-go" class="support-button" type="button">Empezar</button>';
    var m = $('#h-m', A);
    function bar(n, v, c) { return '<div style="margin:4px 0;font-size:.85rem">' + n + ' ' + Math.round(v) + '<div class="bar" style="height:10px"><div class="barin" style="width:' + v + '%;background:' + c + '"></div></div></div>'; }
    function render() {
      $('#h-t', A).textContent = 'Día ' + Math.min(day, 30) + '/30 · Prūbres';
      $('#h-tree', A).textContent = day < 6 ? '🌱' : day < 13 ? '🌿' : day < 25 ? '🌳' : '🌳🍎';
      $('#h-bars', A).innerHTML = bar('💧 Agua', S.a, '#4cc9f0') + bar('☀️ Luz', S.l, '#f2c94c') + bar('🌿 Nutrientes', S.n, '#bb86fc') + bar('❤️ Salud', S.s, '#7ee787');
      $('#h-e', A).textContent = 'Hoy: ' + (EVH[day] ? EVH[day].t : 'un día tranquilo.');
      $('#h-w', A).textContent = EVH[day + 1] ? 'Mañana: ' + EVH[day + 1].t : '';
    }
    function lose(t) { done = true; m.textContent = t + ' Pulsa Empezar para plantar otra semilla.'; $('#h-go', A).hidden = false; beep([196, 147], 0.12, 'sine'); }
    [].forEach.call(A.querySelectorAll('[data-a]'), function (b) {
      b.onclick = function () {
        if (done) return; hstep(S, day, b.getAttribute('data-a'), Math.random); day++;
        if (S.s <= 0) { render(); return lose('Tu árbol no lo logró.'); }
        if (day > 30) {
          done = true; $('#h-bars', A).innerHTML = bar('❤️ Salud', S.s, '#7ee787'); $('#h-e', A).textContent = ''; $('#h-w', A).textContent = '';
          if (S.s >= 80) { $('#h-tree', A).textContent = '🌳🍎✨'; m.textContent = 'Salud ' + Math.round(S.s) + '/100. Prūbres da una manzana dorada, grande, jugosa y tierna.'; win(); }
          else { $('#h-tree', A).textContent = '🌳'; lose('Salud ' + Math.round(S.s) + '/100 (necesitas 80).'); }
          return;
        }
        render(); m.textContent = '';
      };
    });
    $('#h-go', A).onclick = function () { S = { a: 60, l: 70, n: 60, s: 55 }; day = 1; done = false; $('#h-go', A).hidden = true; m.textContent = ''; render(); };
  }

  /* 7. La contraseña */
  function nrm(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  var RQ = {
    A: [['No soy español, ni inglés, ni alemán. Nací para dragones y llevo 800 días con él en una aplicación del búho verde.', ['altovalyrio', 'valyrio', 'altovalirio', 'valirio'], 'Lo habla Daenerys.'],
      ['Tengo cuatro cuerdas, sonido grave y soy negro, de marca Yamaha. Doy el ritmo desde las sombras.', ['bajo', 'bajoelectrico'], 'Flea me toca.'],
      ['Fui un pollito de fuego en Hoenn y acabé siendo un luchador con mega evolución.', ['blaziken'], 'Mi forma inicial se llama Torchic.'],
      ['Soy la princesa zora que fue campeona. Mi historia emocionó mucho a Void en Breath of the Wild.', ['mipha'], 'Su nombre empieza con M.']],
    B: [['No tengo cuerpo y corro sin internet en una computadora. Mi avatar es un búho con lentes. ¿Cómo me llamo?', ['john'], 'Mi creador me imagina como un Jarvis amable.'],
      ['Pequeño, gris, ordenado y limpio: sería el compañero que llevaría al hombro.', ['minccino'], 'Es un Pokémon chinchilla.'],
      ['Pokémon eléctrico y veneno, bajista y punk. Lo elijo porque se parece a mí.', ['toxtricity'], 'Su forma depende de su naturaleza.'],
      ['Naranja y negro desde 2018. Mi mejor amigo apoya a su rival: G2.', ['fnatic'], 'Rekkles brilló aquí.']],
    C: [['Campeón del mundo sin jugar una sola partida. Es el ADC que siempre defiendo ante PepeChambas.', ['rekkles'], 'Es sueco.'],
      ['Caballo negro de Hyrule bautizado con el nombre de un dragón de ASOIAF.', ['vermax'], 'Era el dragón de Jacaerys.'],
      ['En una competencia de aforo, el volumen era cada vez menor. ¿Cuántos mL fue el último? (solo el número)', ['1', '1ml', 'unml', 'unmililitro'], 'Es menos que una micropipeta de 300 µL.']],
    D: [['Estuve rodeado de uno sin saberlo: era la mascota de mi facultad.', ['buho', 'lechuza'], 'Mi IA lleva uno con lentes.']],
    E: [['Nos metió al LoL a mí, a BAD (su hermano) y a PepeChambas. En el juego lo llaman…', ['plazma', 'mauro'], 'Empieza con P.'],
      ['Grité «Uy, ese ___ es mío» justo antes de que un Rengar fedeado me borrara delante de mis amigos.', ['red', 'buffrojo', 'bufrojo', 'rojo'], 'Es un color y un buff.']]
  };
  function clave(A, win) {
    var qs = [], i = 0, ok = 0, err = 0, lock = true, tt, t0 = 0, usedHint = false;
    A.innerHTML = '<p id="c-i" style="color:#fff;margin:0 0 8px"></p><div class="bar"><div id="c-b" class="barin" style="background:var(--accent-color)"></div></div><p id="c-q" style="color:#fff;font-size:1.05rem;margin:14px 0"></p><p id="c-h" style="color:var(--muted-color);margin:0 0 8px"></p><input id="c-in" class="newsletter-input" style="width:100%" disabled autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Tu respuesta"><div class="secret-form"><button id="c-ok" class="newsletter-button" type="button">Responder</button><button id="c-hint" class="support-button" type="button">💡 Pista (−0,5)</button></div><p id="c-m">Diez acertijos sobre mí, 20 segundos cada uno, sin pegar. Puedes fallar dos veces (una pista cuesta medio error).</p><button id="c-go" class="support-button" type="button">Empezar</button>';
    var inf = $('#c-i', A), bar = $('#c-b', A), qq = $('#c-q', A), hh = $('#c-h', A), inp = $('#c-in', A), m = $('#c-m', A);
    function pickN(a, n) { return a.slice().sort(function () { return Math.random() - 0.5; }).slice(0, n); }
    function stat() { inf.textContent = 'Acertijo ' + (i + 1) + '/10 · Aciertos: ' + ok + ' · Errores: ' + String(err).replace('.', ',') + '/2'; }
    function ask() { lock = false; usedHint = false; stat(); qq.textContent = qs[i][0]; hh.textContent = ''; inp.value = ''; inp.disabled = false; inp.focus(); t0 = performance.now(); clearInterval(tt); tt = setInterval(function () { var s = 20 - (performance.now() - t0) / 1000; bar.style.width = Math.max(s, 0) / 20 * 100 + '%'; if (s <= 0) submit(true); }, 100); timers.push(tt); }
    function after1(good, text) { m.textContent = text; beep(good ? [660, 880] : [196, 147], 0.1, good ? 'triangle' : 'sine'); stat(); if (err > 2) { return fail('Demasiados errores.'); } after(function () { if (++i >= 10) { m.textContent = 'Aciertos: ' + ok + '/10. ¡Superado! Sí que me conoces.'; qq.textContent = ''; hh.textContent = ''; win(); } else ask(); }, 900); }
    function submit(to) {
      if (lock) return; lock = true; clearInterval(tt); inp.disabled = true; var v = nrm(inp.value);
      if (!to && qs[i][1].indexOf(v) > -1) { ok++; after1(true, '✔ Correcto'); } else { err++; after1(false, to ? '⏱ Se acabó el tiempo.' : '✘ Incorrecto.'); }
    }
    function fail(t) { lock = true; clearInterval(tt); m.textContent = t + ' Pulsa Empezar para reintentar con otros acertijos.'; $('#c-go', A).hidden = false; }
    on(inp, 'paste', function (e) { e.preventDefault(); }); on(inp, 'drop', function (e) { e.preventDefault(); });
    on(inp, 'keydown', function (e) { if (e.key === 'Enter') submit(false); });
    $('#c-ok', A).onclick = function () { submit(false); };
    $('#c-hint', A).onclick = function () { if (lock || usedHint) return; usedHint = true; err += 0.5; hh.textContent = 'Pista: ' + qs[i][2]; stat(); if (err > 2) { clearInterval(tt); inp.disabled = true; lock = true; fail('Demasiados errores.'); } };
    $('#c-go', A).onclick = function () { qs = pickN(RQ.A, 3).concat(pickN(RQ.B, 3), pickN(RQ.C, 2), pickN(RQ.D, 1), pickN(RQ.E, 1)); i = 0; ok = 0; err = 0; m.textContent = ''; $('#c-go', A).hidden = true; ask(); };
  }

  var GAMES = [{ id: 'smite', n: '1. Smite or Die', d: 'Difícil · Reflejos', f: smite }, { id: 'maestre', n: '2. El maestre', d: 'Medio-difícil · Conocimiento', f: maestre }, { id: 'menisco', n: '3. El menisco perfecto', d: 'Difícil · Precisión', f: menisco },
    { id: 'rekkles', n: '4. Rekkles Mode', d: 'Difícil · Coordinación', f: rekkles }, { id: 'arquero', n: '5. El arquero', d: 'Medio-difícil · Precisión', f: arquero }, { id: 'huerto', n: '6. El huerto', d: 'Medio · Administración', f: huerto }, { id: 'clave', n: '7. La contraseña', d: 'Muy difícil · Deducción', f: clave },
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
