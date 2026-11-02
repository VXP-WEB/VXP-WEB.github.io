/* Secretos de VXP: escribe el nombre de algo que me guste (o su código) */
(function () {
  var base = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');
  var D = [
    "Pokémon|Escribe el nombre de uno de mis Pokémon favoritos.|Tu equipo ya está listo: solo falta decidir quién lidera.|Toxtricity;Decidueye;Gardevoir;Minccino;Tyranitar;Blaziken;Milotic;Gastrodon;Conkeldurr;Ampharos",
    "Halo|El Jefe Maestro, su armadura verde y un anillo.|Un héroe no necesita hablar. Cuando se haya ido, el mundo hablará por él.|Noble;Spartan;Cortana;John;117;Flood;XBOX",
    "Resident Evil|Raccoon City, zombis y una corporación con paraguas.|Tenemos que enfrentar nuestros miedos antes de poder superarlos.|Leon;Chris;Rebecca;Claire;Ada;Jill;Ethan;Tyrant;Raccoon;T-Virus;Umbrella;Wesker",
    "Zelda|El héroe de verde, la princesa y la Trifuerza.|Tres piezas de oro, un héroe con ocarina y años de nostalgia.|Ocarina;Link;Ganon;Ganondorf;Gerudo;Zora;Orni;Goron;Trifuerza;Coraje;Poder;Sabiduria;Leyenda;Hyrule;NINTENDO",
    "Halloween|Una máscara blanca y una noche de octubre.|Michael Myers nunca corre, y aun así siempre te alcanza.|Laurie;Myers;Loomis;Mascara;Haddonfield;1978;Michael Myers",
    "Dragon Ball|Saiyajins, esferas del dragón y un grito de energía.|Tu nivel de poder acaba de subir de forma sospechosa.|Goku;Gohan;Vegeta;Goten;Trunks;Kamehameha;Genkidama;Esferas",
    "Naruto|Ninjas de Konoha y el sueño de ser Hokage.|Todo el esfuerzo es inútil, si no crees en ti mismo.|Sasuke;Sakura;Kakashi;Rasengan;Chidori;Sharingan;Jutsu;Hokage",
    "Rayados de Monterrey|Mi equipo: azul y blanco, de Monterrey.|Azul y blanco hasta el final: la fe del aficionado no se negocia.|Chupete;Suazo;Funes Mori;Monty;Rayados;La Raya;Adiccion;Carne Asada",
    "Skyrim|El Sangre de Dragón y su grito.|Ibas a salvar el mundo, pero primero explorar una cueva más.|Dovahkiin;Tamriel;FusRoDah;bollodulce;Ruiseñor",
    "Assassin's Creed|Asesinos contra templarios, con saltos de fe.|Nada es verdad, todo está permitido.|Altair;Ezio;Edward;Arno;Connor;Credo;Animus;Templario;Kenway;Auditore",
    "Minecraft|Bloques, picos y un creeper detrás de ti.|Ssssss… tranquilo, esta vez solo era un secreto.|WaterDrop;Creeper;Nether;Diamante;Redstone;Mina",
    "Dark Souls|Hogueras, muertes y alabar al sol.|¿Por qué no ayudarnos unos a otros en este viaje solitario?|Estus;La flama;Hueco;Gwyn;Solaire;Lordran",
    "Black Ops Zombies|Cuatro sobrevivientes y rondas infinitas.|El honor es el camino a través de los momentos más oscuros.|Takeo;Dempsey;Nikolai;Richtofen;Primis;Victis;Ultimis;Raygun;Baston Elemental;Arco Elemental;Origins",
    "Grand Theft Auto|Mundo abierto de crimen: Los Santos, Liberty City…|Como dice en el libro: estamos bendecidos y maldecidos a la vez.|GTA;Niko;CJ;BigSmoke;Roman;Michael;Trevor;Franklin;GroveStreet;LasVenturas;LosSantos;LibertyCity;ViceCity",
    "Star Wars|Jedi, Sith y una galaxia muy lejana.|Hazlo o no lo hagas, pero no lo intentes.|Anakin;Luke;Leia;Skywalker;Jedi;Sith;SabledeLuz;Palpatine;Vader;ObiWan;Kenobi;HelloThere",
    "El Señor de los Anillos|Una comunidad, un anillo y la Tierra Media.|Una puerta antigua, una palabra olvidada y un anillo que nadie debería llevar.|Gandalf;Frodo;Sam;Merry;Pippin;Boromir;Legolas;Aragorn;Gimli;Anillo;Mellon;Bilbo;Gollum",
    "Game of Thrones|Casas nobles, tronos y dragones en Poniente.|Piénsalo dos veces antes de aceptar una invitación a una boda en Poniente.|Westeros;Essos;JonSnow;Stark;Lannister;Baratheon;Targaryen;Arryn;Martell;Greyjoy;Velaryon;Hightower;Tyrell;Tully;Snow;Rhaenyra;Eddard;Daenerys;Tyrion",
    "Harry Potter|Un mago con cicatriz y su escuela.|Si tu carta de Hogwarts no llegó, seguramente la lechuza se perdió.|Expelliarmus;Patronum;Leviosa;Potter;Wesley;Granger;Malfoy;Voldemort",
    "Apex Legends|Leyendas y un battle royale con armas pesadas.|No confíes en las voces, confía en lo que puedes hacer ahora.|R-99;R-301;Wingman;Peacekeeper;Kraber;Wraith;Wattson",
    "League of Legends|Campeones y una grieta de cinco contra cinco.|Cinco derribos, un sonido legendario y tu equipo pidiendo la repetición.|Kai’sa;Neeko;Ashe;LeeSin;ADC;TOP;JG;MID;SUPP;Zeri;Draven;Kalista;Ezreal;Xayah;Sivir;Nilah;Yunara;Aphelios;Ziggs;Caitlyn;Lucian;Jinx;Varus;Kog’Maw;MissFortune;Corki;Smolder;Kennen;Vayne;Samira;Yasuo;LOL",
    "Rekkles|El tirador sueco, leyenda de mi equipo favorito.|Jugar con calma también es una forma de hacer ruido.|Pentakill;MSI;Worlds;Sweden;Jhin;Tristana",
    "Fnatic|Naranja y negro, equipo europeo de LoL.|Los Reyes sin corona de un trono olvidado.|Selfmade;Razork;Broxah;Soaz;Hylissang;Boaster;Humanoid;Xpeke;Mikyx;Werlyb;Caps;Wunder;Nemesis;Bwipo;Upset",
    "Highschool DxD|Demonios, ángeles y un club escolar.|Hay secretos que es mejor guardar sin hacer demasiadas preguntas. xd|Rias;Gremory;Issei;Akeno;Demonio;Angel;AngelCaido;Asia;Xenovia;Irina;Koneko;Rossweisse;Gasper;RedDragon;WhiteDragon;Boost;Divide;DXD",
    "To Love Ru|Comedia alienígena con una princesa y mala suerte.|Estoy luchando por entenderme a mí mismo en este momento.|Darkness;Lala;Momo;Nana;Rito;Yuki;Haruna;Yami",
    "Marvel|Héroes, un martillo y un escudo.|Pero ¿qué es el duelo, sino el amor que perdura?|Stark;CapitanAmerica;IronMan;SpiderMan;Wolverine;Gambit;Hulk;Hawkeye;Excelsior;Maximoff;WinterSoldier;AntMan;Nightcrawler;DarkPhoenix;Cyclops;X-Men;FantasticFour;Avengers;Shield",
    "The Last of Us|Un mundo infectado y un viaje entre dos.|Cuando estés perdido en la oscuridad, busca la luz.|Joel;Tommy;Ellie;Dina;Luciernaga;Jackson;Clicker;PLAYSTATION;Abby;Yara;Lev;Santaolalla;Maria;Jesse;Sarah;Miller",
    "Mortal Kombat|Un torneo de pelea con fatalities.|Nacemos solos. Morimos solos.|NoobSaibot;Scorpion;Subzero;JohnnyCage;Kitana;Milena;Ermac;Tremor;Reptile;Smoke;Fatality;Mercy;Flawless;FinishHim;Skarlet;Jade;Rain;Sektor;Tanya;Frost;Brutality;LinKuei;ShiraiRyu",
    "Dua Lipa|Pop de pista de baile: escribe una canción o un álbum.|Muévete: este secreto merece una pista de baile.|FallingForever;RadicalOptimism;HappyForYou;Don’tStartNow;Fever;DulaPeep;Lipa;Dua;Duolingo;Physical;FutureNostalgia;ColdHeart",
    "Hayley Williams|La voz pelirroja de Paramore: un álbum o una canción.|Una voz que ha acompañado más de una época de tu vida.|EgoDeath;Paramore;MiseryBusiness;MisseryBussines;Glum;Parachute;Simmer;CrystalClear;PetalsForArmor;Whim;Hard;Mirtazapine",
    "Eminem|El rapero de Detroit: su alter ego, un álbum o una canción.|Rapidez, rimas y una historia que empezó en Detroit.|SlimShady;Renegade;Kamikaze;Venom;Mockingbird;Infinite;WithoutMe;Monster;RapGod;Stan;LoseYourself;8Mille",
    "Green Day|Punk californiano: un álbum, una canción o un integrante.|Tres acordes, mucha energía y nostalgia de otra época.|Warning;21Guns;BasketCase;Dookie;Nimrod;SeptemberEnds;BrokenDreams;RevolutionRadio;AmericanIdiot;Insomnia;Kerplunk;FatherOfAll;Shenanigans;Tre;Mike;Billie;Armstrong;Saviors",
    "Blink-182|Pop punk: un integrante, un álbum o una canción.|Pop punk, bromas y esa vibra de verano que no se va.|Tom;Mark;Travis;Matt;NINE;Buddha;CheshireCat;DudeRanch;EnemaOfTheState;TakeOffYourPantsAndJacket;TakeOfYourPantsAndJacket;Blink;182;California;ONEMORETIME;MissYou;SmallThings;MyAge",
    "Fall Out Boy|Emo pop de Chicago: un álbum o una canción.|Un nombre de cómic y estribillos que se te quedan en la cabeza.|FallOutBoy;DanceDance;SaveRockNRoll;InfinityOnHigh;SoMuchForStardust;TnksFrThMmrs;MissMissingYou",
    "Red Hot Chili Peppers|Funk rock californiano: un álbum, una canción o el bajista.|Bajo con groove, funk y un ritmo que se queda en las piernas.|ChilliPepper;RedHot;Flea;Can’tStop;DaniCalifornia;DarkNecessities;Cabron;Encore;Californication",
    "La Rosalía|Flamenco pop: un álbum o una canción.|Flamenco, reguetón y un cambio de piel con cada disco.|Rosalia;Motomami;BarefootInThePark;LUX;LLYLM;Despechá",
    "Imagine Dragons|Rock alternativo de Las Vegas: un álbum o una canción.|Tambores que retumban, coros que se cantan solos y estadios llenos.|Demons;NightVisions;InYourCorner;Roots;Amsterdam;BadLiar;Bones;Enemy;Loom;Evolve;Smoke+Mirrors",
    "Canserbero|El rapero venezolano: un álbum o una canción.|Palabras que pesan, rimas que se quedan y una voz que sigue sonando.|Maquiavélico;StupidLoveStory;Can;EsÉpico;MundoDePiedra;AllWeNeedIsLove;Muerte;Vida;GiveMe5;DeLaVidaComoPelicula;TragediaComediaYFiccion;Bendecidos",
    "Linkin Park|Nu metal: un álbum, una canción o un integrante.|Guitarras pesadas, un grito y una época que se recuerda completa.|HybridTheory;Meteora;Metheora;MinutesToMidnight;Reanimation;ThousandSuns;LivingThings;OneMoreLight;Recharged;TheHuntingParty;FromZero;InTheEnd;Numb;EmptinessMachine;OverEachOther;BleedItOut;Crawling;WaitingForTheEnd;GoodThingsGo;MrHan;Chester;Emily;Shinoda;Brad;Collin;Dave;Rob",
    "Sputnik|La banda mexicana: una canción o un álbum.|Rock mexicano con mucho corazón y ganas de hacerlo a tu manera.|Joe;Trouble;Amarela;Delirio;TerriblesTerrores;Problemas;NoMeRevientes;GranBlanco;Monumentos;DiasDeTrueno;DanzaDespierta;NaturalezaMuerta",
    "Alec Benjamin|Cantautor: una canción o un álbum.|Historias contadas en voz baja, de esas que se sienten propias.|Steve;NarratedForYou;TheseTwoWindows;12Notes;UnCommentary;WaterFountain;LetMeDownSlowly;FollowMe;JustLikeYou;TheWayYouFelt"
  ];
  function norm(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  var S = D.map(function (r) { var p = r.split('|'); return { id: norm(p[0]), n: p[0], h: p[1], r: p[2], ks: (p[3] || '').split(';').concat(p[0]).map(norm).filter(Boolean) }; });
  var F = window.VXP_FRASES || {};
  S.forEach(function (s) { if (typeof F[s.n] === 'string' && F[s.n].trim()) s.r = F[s.n]; });
  var KEY = 'vxp_secretos2', got = [];
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
      var ok = got.indexOf(s.id) > -1, d = document.createElement('div');
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
    if (got.indexOf(s.id) > -1) { toast('Ya lo tenías', '«' + s.n + '» ya está en tu diario.'); return; }
    got.push(s.id); save();
    toast('🗝 Secreto desbloqueado: ' + s.n, s.r); chime();
    if (got.length === S.length) setTimeout(function () { toast('🏆 ¡Los encontraste todos!', 'Entra al diario: hay una sala oculta esperándote.'); fanfare(); }, 5300);
    counter(); render();
  }
  function pick(l) { return l.find(function (x) { return got.indexOf(x.id) < 0; }) || l[0]; }
  function findExact(v) { var l = S.filter(function (x) { return x.ks.indexOf(v) > -1; }); return l.length ? pick(l) : null; }
  function findEnd(b) {
    var best = 0, l = [];
    S.forEach(function (x) { x.ks.forEach(function (k) {
      if (k.length >= 4 && b.endsWith(k)) {
        if (k.length > best) { best = k.length; l = [x]; } else if (k.length === best && l.indexOf(x) < 0) l.push(x);
      }
    }); });
    return l.length ? pick(l) : null;
  }

  // Teclado: escribe el nombre en cualquier página
  var buf = '', timer;
  addEventListener('keydown', function (e) {
    var t = e.target;
    if ((t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key && e.key.length === 1 ? e.key.toLowerCase() : '';
    if (!/[a-z0-9]/.test(k)) return;
    buf = (buf + k).slice(-40);
    clearTimeout(timer);
    timer = setTimeout(function () { var s = findEnd(buf); if (s) { buf = ''; unlock(s); } }, 650);
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
    var s = findExact(v);
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
