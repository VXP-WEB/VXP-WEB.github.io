/* Secretos de VXP: escribe el nombre de algo que me guste (o su código) */
(function () {
  var base = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');
  var D = [
    "umbrella|Resident Evil|Una farmacéutica con un paraguas que no cubre de nada|Cuidado con los pasillos largos: siempre hay algo detrás de la siguiente puerta.",
    "haddonfield|Halloween|Una noche de octubre en un pueblo de Illinois|Michael Myers nunca corre, y aun así siempre te alcanza.",
    "pikachu|Pokémon|Amarillo, mejillas rojas y cola de rayo|Un Pokémon salvaje apareció y se llevó tu tarde entera.",
    "kamehameha|Dragon Ball|Manos juntas, grito largo y una ola azul|Tu nivel de poder acaba de subir de forma sospechosa.",
    "rasengan|Naruto|Una esfera de viento girando en la palma|Nunca te rindas, ni cuando el entrenamiento duele.",
    "spartan|Halo|Armadura verde, casco dorado y un anillo gigante|Un anillo, una armadura y cero ganas de descansar.",
    "triforce|Zelda|Tres triángulos dorados en la mano|Tres piezas de oro, un héroe con ocarina y años de nostalgia.",
    "rayados|Rayados de Monterrey|Azul y blanco, con el Cerro de la Silla al fondo|Azul y blanco hasta el final: la fe del aficionado no se negocia.",
    "dovahkiin|Skyrim|Un nacido bajo el grito de un dragón|Ibas a salvar el mundo, pero primero explorar una cueva más.",
    "animus|Assassin's Creed|Una máquina que revive recuerdos ajenos|Un salto de fe, un montón de heno y cero miedo a las alturas.",
    "creeper|Minecraft|Verde, silencioso y termina con un siseo|Ssssss… tranquilo, esta vez solo era un secreto.",
    "praisethesun|Dark Souls|Un caballero con los brazos en alto ante el sol|Has muerto, pero tu paciencia sigue en pie. La hoguera está cerca.",
    "juggernog|Black Ops Zombies|Una bebida roja que te hace aguantar más golpes|Una ronda más. Siempre dices que es la última.",
    "grovestreet|GTA San Andreas|Una calle verde en Los Santos|Moraleja: perseguir un tren en bicicleta nunca sale bien a la primera.",
    "jedi|Star Wars|Un sable de luz y mucho drama familiar|Una galaxia muy, muy lejana… pero este secreto estaba a un clic.",
    "mellon|El Señor de los Anillos|La palabra élfica para «amigo», que abre una puerta|Una puerta antigua, una palabra olvidada y un anillo que nadie debería llevar.",
    "dracarys|Game of Thrones|Una palabra en valyrio que invoca fuego|Piénsalo dos veces antes de aceptar una invitación a una boda en Poniente.",
    "expelliarmus|Harry Potter|Un hechizo que desarma al rival|Si tu carta de Hogwarts no llegó, seguramente la lechuza se perdió.",
    "wraith|Apex Legends|Una voz que susurra atajos desde otra dimensión|Te susurró un atajo… y era una trampa.",
    "pentakill|League of Legends|Cinco bajas seguidas en la grieta|Cinco derribos, un sonido legendario y tu equipo pidiendo la repetición.",
    "rekkles|Rekkles|Un tirador sueco de mirada tranquila|Jugar con calma también es una forma de hacer ruido.",
    "radiant|Valorant|El rango más alto del juego|Plantar la spike y rezar: sigue siendo el plan favorito.",
    "fnatic|Fnatic|Naranja y negro, con mucha historia en Europa|Naranja, negro y un equipo que nunca deja de ser tu equipo.",
    "riasgremory|Highschool DxD|Una cabellera roja y un club de ocultismo|Hay secretos que es mejor guardar sin hacer demasiadas preguntas. xd",
    "lala|To Love Ru|Una princesa alienígena con muy mala suerte|Tropezar justo en el momento equivocado: la especialidad de la casa. xd",
    "excelsior|Marvel|La palabra con la que firmaba el creador de los héroes|El universo más largo del cine, y todavía te falta una serie por ver.",
    "clicker|The Last of Us|Sonidos que chasquean en la oscuridad|Silencio, agáchate y que ese ladrillo no falle.",
    "fatality|Mortal Kombat|La palabra con la que termina una pelea sin piedad|Una pelea sin piedad, un final sangriento y una victoria muy dudosa.",
    "dualipa|Dua Lipa|Pop de pista de baile nacido en Londres|Muévete: este secreto merece una pista de baile.",
    "paramore|Hayley Williams|La voz pelirroja de una banda de Tennessee|Una voz que ha acompañado más de una época de tu vida.",
    "slimshady|Eminem|El alter ego rubio del rapero de Detroit|Rapidez, rimas y una historia que empezó en Detroit.",
    "greenday|Green Day|Punk californiano con tres integrantes|Tres acordes, mucha energía y nostalgia de otra época.",
    "blink182|Blink-182|Pop punk con tres cifras|Pop punk, bromas y esa vibra de verano que no se va.",
    "falloutboy|Fall Out Boy|Emo pop con nombre de historieta, de Chicago|Un nombre de cómic y estribillos que se te quedan en la cabeza.",
    "californication|Red Hot Chili Peppers|Un álbum con nombre de estado soñado|Bajo con groove, funk y un ritmo que se queda en las piernas.",
    "motomami|La Rosalía|Un álbum con nombre de moto|Flamenco, reguetón y un cambio de piel con cada disco."
  ];
  function norm(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  var S = D.map(function (r) { var p = r.split('|'); return { c: p[0], n: p[1], h: p[2], r: p[3], k: norm(p[1]) }; });
  var KEY = 'vxp_secretos', got = [];
  try { got = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(got)); } catch (e) {} }

  // Sonido sintetizado (sin archivos de audio)
  var ac = null;
  function soundOn() { try { return localStorage.getItem('vxp_sonido') !== '0'; } catch (e) { return true; } }
  function tone(notes, type, step, vol) {
    if (!soundOn()) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      notes.forEach(function (f, i) {
        var t = ac.currentTime + i * step, o = ac.createOscillator(), g = ac.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + step * 2.2);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + step * 2.4);
      });
    } catch (e) {}
  }
  function chime() { tone([659, 880, 1175], 'triangle', 0.09, 0.15); }
  function fanfare() { tone([523, 659, 784, 1047, 1319, 1568], 'triangle', 0.13, 0.18); }
  function nope() { tone([196, 147], 'sine', 0.12, 0.12); }

  function toast(t, m) {
    var d = document.createElement('div');
    d.className = 'toast'; d.setAttribute('role', 'status');
    var a = document.createElement('strong'), b = document.createElement('span');
    a.textContent = t; b.textContent = m; d.append(a, b);
    document.body.appendChild(d);
    setTimeout(function () { d.classList.add('out'); setTimeout(function () { d.remove(); }, 400); }, 5000);
  }
  function counter() {
    var f = document.querySelector('.footer-copy'); if (!f) return;
    var a = document.getElementById('secret-count');
    if (!got.length) { if (a) a.remove(); return; }
    if (!a) {
      a = document.createElement('a'); a.id = 'secret-count'; a.href = base + 'secretos.html';
      f.appendChild(document.createTextNode(' · ')); f.appendChild(a);
    }
    a.textContent = '🗝 ' + got.length + '/' + S.length;
  }
  function render() {
    var l = document.getElementById('secretos-list'); if (!l) return;
    l.innerHTML = '';
    S.forEach(function (s) {
      var ok = got.indexOf(s.c) > -1, d = document.createElement('div');
      d.className = 'secret-item' + (ok ? ' open' : '');
      var h = document.createElement('strong'), p = document.createElement('p');
      h.textContent = ok ? '🗝 ' + s.n : '🔒 ???';
      p.textContent = ok ? s.r : 'Pista: ' + s.h;
      d.append(h, p); l.appendChild(d);
    });
    var c = document.getElementById('secretos-count');
    if (c) c.textContent = got.length + ' / ' + S.length;
    var w = document.getElementById('secretos-win');
    if (w) w.hidden = got.length < S.length;
    var sb = document.getElementById('secreto-sonido');
    if (sb) sb.textContent = '🔊 Sonido: ' + (soundOn() ? 'sí' : 'no');
  }
  function unlock(s) {
    if (got.indexOf(s.c) > -1) { toast('Ya lo tenías', '«' + s.n + '» ya está en tu diario.'); return; }
    got.push(s.c); save();
    toast('🗝 Secreto desbloqueado: ' + s.n, s.r); chime();
    if (got.length === S.length) setTimeout(function () { toast('🏆 ¡Los encontraste todos!', 'Entra al diario: hay una sala oculta esperándote.'); fanfare(); }, 5300);
    counter(); render();
  }
  function match(v) { return S.find(function (x) { return v.endsWith(x.c) || v.endsWith(x.k); }); }

  // Teclado: escribe el nombre en cualquier página
  var buf = '';
  addEventListener('keydown', function (e) {
    var t = e.target;
    if ((t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key && e.key.length === 1 ? e.key.toLowerCase() : '';
    if (!/[a-z0-9]/.test(k)) return;
    buf = (buf + k).slice(-30);
    var s = match(buf);
    if (s) { buf = ''; unlock(s); }
  });

  // Puerta secreta: el símbolo © del pie de página
  var f = document.querySelector('.footer-copy');
  if (f) {
    f.innerHTML = f.innerHTML.replace('©', '<span id="secret-door">©</span>');
    f.addEventListener('click', function (e) { if (e.target.id === 'secret-door') location.href = base + 'secretos.html'; });
  }
  counter(); render();

  // Página del diario: entrada de códigos (sirve también en celular)
  var i = document.getElementById('secreto-input'), b = document.getElementById('secreto-btn');
  function go() {
    var v = norm(i.value); i.value = ''; if (!v) return;
    var s = match(v);
    if (s) unlock(s); else { toast('Nada por aquí…', 'Ese código no abre nada. Sigue buscando.'); nope(); }
  }
  if (i && b) { b.addEventListener('click', go); i.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); }); }

  var sb = document.getElementById('secreto-sonido'), rb = document.getElementById('secreto-reset');
  if (sb) sb.addEventListener('click', function () {
    try { localStorage.setItem('vxp_sonido', soundOn() ? '0' : '1'); } catch (e) {}
    render(); chime();
  });
  if (rb) rb.addEventListener('click', function () {
    if (!confirm('¿Reiniciar tu progreso? Se borrarán todos los secretos desbloqueados.')) return;
    got = []; save(); counter(); render(); toast('Progreso reiniciado', 'Vuelve a empezar la búsqueda.');
  });

  // Viernes 13: la página cambia a rojo
  var d = new Date();
  if (d.getDay() === 5 && d.getDate() === 13) {
    document.documentElement.classList.add('viernes13');
    try { if (!sessionStorage.getItem('vxp13')) { sessionStorage.setItem('vxp13', 1); toast('🔪 Es viernes 13', 'Algo se ve distinto por aquí…'); } } catch (e) {}
  }
  try { console.log('%cVXP', 'font-size:20px;color:#bb86fc;font-weight:bold', 'Curioseando, ¿eh? Hay secretos escondidos: escribe el nombre de algo que me guste, o prueba a pulsar el ©.'); } catch (e) {}
})();
