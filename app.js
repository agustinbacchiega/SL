'use strict';

/* ================= DATA ================= */

const KEY = 'sl-system-v1';

const STATS = {
  str: ['FUERZA', 'STR'],
  vit: ['VITALIDAD', 'VIT'],
  agi: ['AGILIDAD', 'AGI'],
  int: ['INTELIGENCIA', 'INT'],
  per: ['PERCEPCIÓN', 'PER'],
};

// Daily Quest canon: "Preparations to Become Powerful"
const EXERCISES = {
  pushups: { name: 'Flexiones', unit: '', steps: [1, 10] },
  situps: { name: 'Abdominales', unit: '', steps: [1, 10] },
  squats: { name: 'Sentadillas', unit: '', steps: [1, 10] },
  run: { name: 'Correr', unit: 'km', steps: [0.5, 1] },
};

const RANKS = [
  [1, 'E'], [10, 'D'], [20, 'C'], [35, 'B'], [50, 'A'], [70, 'S'], [100, 'Nivel Nacional'],
];

const ITEMS = {
  box: { ico: '🎁', name: 'Caja Aleatoria', desc: 'Contiene un objeto al azar.', price: 400 },
  hp: { ico: '🧪', name: 'Poción de Curación', desc: 'Restaura todo el HP.', price: 150 },
  mp: { ico: '🔷', name: 'Poción de Maná', desc: 'Restaura todo el MP.', price: 150 },
  fat: { ico: '💧', name: 'Poción de Recuperación de Fatiga', desc: 'Reduce la fatiga a 0.', price: 200 },
  key: { ico: '🗝️', name: 'Llave de Mazmorra Instantánea', desc: 'Abre una mazmorra: un desafío extra con gran recompensa.', price: 600 },
  stone: { ico: '💠', name: 'Piedra Rúnica: Bonus', desc: 'Otorga 1 punto de habilidad.', price: 1500 },
};

const TITLES = {
  overcame: { name: 'El que Superó la Adversidad', desc: 'Sobreviviste a la Zona de Castigo.', bonus: 'HP perdido en castigos -50%' },
  wolf: { name: 'Cazador de Lobos', desc: 'Despejaste 3 mazmorras instantáneas.', bonus: 'XP de mazmorras +40%' },
  early: { name: 'Coraje del Débil', desc: 'Misión secreta: completar la misión diaria antes de las 7:00.', bonus: 'XP diaria +10%' },
  iron: { name: 'Voluntad Inquebrantable', desc: '7 misiones diarias seguidas.', bonus: 'XP diaria +15%' },
  demon: { name: 'Cazador de Demonios', desc: '30 misiones diarias seguidas.', bonus: 'Oro +50%' },
  beyond: { name: 'El que Superó sus Límites', desc: 'Superaste el doble de los objetivos diarios en un día.', bonus: 'XP de misiones secundarias +25%' },
  monarch: { name: 'Monarca de las Sombras', desc: 'Alcanzaste el nivel 100.', bonus: 'Toda la XP +25%' },
};

const SKILLS = [
  { lv: 1, name: 'Tenacidad', type: 'Pasiva', desc: 'Mientras el HP esté bajo el 30%, la XP obtenida aumenta un 50%.' },
  { lv: 5, name: 'Sprint', type: 'Activa', desc: 'Cada km corrido otorga +10% de XP extra.' },
  { lv: 10, name: 'Sed de Sangre', type: 'Activa', desc: 'Las mazmorras instantáneas otorgan +1 Caja Aleatoria.' },
  { lv: 20, name: 'Sigilo', type: 'Activa', desc: 'Una vez por semana, evita un castigo (consume 100 MP).' },
  { lv: 30, name: 'Daga Mortal', type: 'Activa', desc: 'Las misiones secundarias otorgan +10 de oro.' },
  { job: true, name: 'Extracción de Sombras', type: 'Clase', desc: '"¡Levántate!" Al completar la diaria, invoca una sombra al ejército (cosmético).' },
];

const DUNGEONS = [
  { name: 'Mazmorra de rango E', task: '50 burpees', xp: 150 },
  { name: 'Mazmorra de rango D', task: '5 min de plancha acumulada', xp: 200 },
  { name: 'Mazmorra de rango C', task: '100 saltos de tijera + 50 zancadas', xp: 250 },
  { name: 'Mazmorra de rango B', task: '20 min de cardio intenso', xp: 300 },
  { name: 'Mazmorra de rango A', task: '3 series de 20 flexiones diamante', xp: 350 },
  { name: 'Castillo del Demonio', task: '30 min de entrenamiento libre sin pausa', xp: 500 },
];

const SHADOWS = ['Igris', 'Iron', 'Tank', 'Tusk', 'Beru', 'Bellion', 'Kaisel', 'Greed', 'Jima', 'Fang'];

/* ================= STATE ================= */

const today = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

const freshDaily = (date) => ({ date, progress: { pushups: 0, situps: 0, squats: 0, run: 0 }, claimed: false, dungeon: null });

function defaultState() {
  return {
    v: 1, awakened: false, name: '', level: 1, xp: 0, ap: 0,
    stats: { str: 10, vit: 10, agi: 10, int: 10, per: 10 },
    hp: 100, mp: 10, fatigue: 0, fatigueAt: Date.now(), gold: 0,
    job: 'Ninguno', jobQuest: null, title: null, titles: [], shadows: [],
    inventory: { box: 1 },
    targets: { pushups: 100, situps: 100, squats: 100, run: 10 },
    penaltyTask: '4 horas de supervivencia → 100 burpees',
    daily: freshDaily(today()),
    penalty: null, stealthUsed: null,
    streak: 0, bestStreak: 0, totalDaily: 0, dungeons: 0,
    side: [
      { id: 1, name: 'Leer 20 páginas', xp: 30, stat: 'int', done: null },
      { id: 2, name: 'Tomar 2L de agua', xp: 20, stat: 'vit', done: null },
    ],
    sound: true, history: [],
  };
}

let S = load();
let tab = 'status';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { /* ignore */ }
  return defaultState();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
}

/* ================= DERIVED ================= */

const maxHP = () => 100 + (S.level - 1) * 20 + (S.stats.vit - 10) * 10;
const maxMP = () => 10 + (S.level - 1) * 5 + (S.stats.int - 10) * 10;
const xpNeeded = (lv = S.level) => Math.round(100 + 40 * lv + 2 * lv * lv);
const rank = () => RANKS.filter(([lv]) => S.level >= lv).pop()[1];
const hasSkill = (name) => SKILLS.some((s) => s.name === name && (s.job ? S.job !== 'Ninguno' : S.level >= s.lv));
const titleIs = (id) => S.title === id;

function decayFatigue() {
  const hours = (Date.now() - S.fatigueAt) / 3.6e6;
  S.fatigue = Math.max(0, S.fatigue - hours * 8);
  S.fatigueAt = Date.now();
}

function dailyComplete(d = S.daily) {
  return Object.keys(S.targets).every((k) => d.progress[k] >= S.targets[k]);
}

/* ================= NOTIFICATIONS ================= */

const queue = [];
let showing = false;

function notify(title, msg, opts = {}) {
  queue.push({ title, msg, ...opts });
  if (!showing) nextNotice();
}

function nextNotice() {
  const o = $('#overlay');
  const n = queue.shift();
  if (!n) { showing = false; o.hidden = true; o.innerHTML = ''; return; }
  showing = true;
  ding(n.danger);
  o.innerHTML = `<div class="win" ${n.danger ? 'style="--line:var(--red);--glow:var(--red-glow)"' : ''}>
    <div class="win-title">${n.title}</div>
    <div class="msg">${n.msg}</div>
    ${n.html || ''}
    <button class="btn block" id="ok">${n.ok || 'Aceptar'}</button></div>`;
  o.hidden = false;
  $('#ok').onclick = () => { n.onOk && n.onOk(); nextNotice(); };
}

let actx;
function ding(danger) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime;
    const notes = danger ? [220, 196] : [880, 1318];
    notes.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = danger ? 'sawtooth' : 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.5);
      o.connect(g).connect(actx.destination);
      o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.55);
    });
  } catch (e) { /* ignore */ }
}

/* ================= CORE MECHANICS ================= */

function gainXP(base, source) {
  let mult = 1;
  if (S.hp < maxHP() * 0.3 && hasSkill('Tenacidad')) mult += 0.5;
  if (source === 'daily' && titleIs('early')) mult += 0.1;
  if (source === 'daily' && titleIs('iron')) mult += 0.15;
  if (source === 'dungeon' && titleIs('wolf')) mult += 0.4;
  if (source === 'side' && titleIs('beyond')) mult += 0.25;
  if (titleIs('monarch')) mult += 0.25;
  const xp = Math.round(base * mult);
  S.xp += xp;
  let ups = 0;
  while (S.xp >= xpNeeded()) {
    S.xp -= xpNeeded();
    S.level++; ups++;
    S.ap += 5;
  }
  if (ups) {
    S.hp = maxHP(); S.mp = maxMP(); S.fatigue = 0;
    notify('Notificación', `¡Subiste de nivel!\n\nNivel ${S.level - ups} → <b>${S.level}</b>\nPuntos de habilidad +${ups * 5}\n\nHP, MP y Fatiga restaurados.`);
    SKILLS.forEach((sk) => {
      if (!sk.job && sk.lv > S.level - ups && sk.lv <= S.level)
        notify('Notificación', `Has adquirido una nueva habilidad:\n<b>[${sk.name}]</b>\n\n${sk.desc}`);
    });
    if (S.level >= 40 && S.job === 'Ninguno' && !S.jobQuest) {
      S.jobQuest = 'offered';
      notify('Misión de Cambio de Clase', 'Has cumplido los requisitos para el cambio de clase.\n\n¿Deseas aceptar la misión de cambio de clase?\n\nObjetivo: completar el DOBLE de la misión diaria en un solo día.', { ok: 'Aceptar' });
    }
    if (S.level >= 100) unlockTitle('monarch');
  }
  return xp;
}

function gainGold(n) {
  const g = Math.round(n * (titleIs('demon') ? 1.5 : 1));
  S.gold += g;
  return g;
}

function addItem(id, n = 1) { S.inventory[id] = (S.inventory[id] || 0) + n; }

function unlockTitle(id) {
  if (S.titles.includes(id)) return;
  S.titles.push(id);
  const t = TITLES[id];
  notify('Notificación', `Has obtenido un nuevo título:\n<b>[${t.name}]</b>\n\n${t.desc}\nEfecto: ${t.bonus}`);
}

function logExercise(k, amount) {
  decayFatigue();
  const p = S.daily.progress;
  p[k] = Math.max(0, Math.round((p[k] + amount) * 10) / 10);
  if (amount > 0) S.fatigue = Math.min(100, S.fatigue + (k === 'run' ? amount * 4 : amount * 0.15));

  // Beyond limits / job change: double every target
  const doubled = Object.keys(S.targets).every((x) => p[x] >= S.targets[x] * 2);
  if (doubled) {
    unlockTitle('beyond');
    if (S.jobQuest === 'active') completeJobChange();
  }
  save(); render();
}

function claimDaily() {
  if (S.daily.claimed || !dailyComplete()) return;
  S.daily.claimed = true;
  S.totalDaily++;
  S.streak++;
  S.bestStreak = Math.max(S.bestStreak, S.streak);
  S.history.push(S.daily.date);
  S.hp = maxHP(); S.mp = maxMP(); S.fatigue = 0;
  S.ap += 3;
  addItem('box');
  let runBonus = hasSkill('Sprint') ? Math.round(S.targets.run * 10 * 0.1) : 0;
  const xp = gainXP(200 + Math.min(S.streak, 30) * 5 + runBonus, 'daily');
  const g = gainGold(100);
  let extra = '';
  if (S.job !== 'Ninguno') {
    const sh = SHADOWS[S.shadows.length % SHADOWS.length];
    S.shadows.push(sh);
    extra = `\n\n<span class="arise">¡LEVÁNTATE!</span>\nLa sombra <b>${sh}</b> se ha unido a tu ejército.`;
  }
  notify('Misión Diaria', `Has completado la misión diaria\n[Preparativos para volverse poderoso].\n\nRecompensas:\n• Recuperación total\n• Puntos de habilidad +3\n• Caja Aleatoria ×1\n• XP +${xp}  ·  Oro +${g}${extra}`);
  if (new Date().getHours() < 7) unlockTitle('early');
  if (S.streak >= 7) unlockTitle('iron');
  if (S.streak >= 30) unlockTitle('demon');
  save(); render();
}

function completeJobChange() {
  S.jobQuest = 'done';
  S.job = 'Nigromante';
  notify('Notificación', 'Has completado la misión de cambio de clase.\n\nClase: <b>Nigromante</b>\n\nHas adquirido la habilidad de clase\n<b>[Extracción de Sombras]</b>.\n\n<span class="arise">¡LEVÁNTATE!</span>');
}

function rollover() {
  const t = today();
  if (S.daily.date === t) return false;
  const missed = !S.daily.claimed;
  if (missed && S.awakened && S.daily.date) {
    S.streak = 0;
    S.penalty = { date: t, done: false };
    const loss = Math.round(maxHP() * (titleIs('overcame') ? 0.25 : 0.5));
    S.hp = Math.max(1, S.hp - loss);
    S.daily = freshDaily(t);
    notify('ADVERTENCIA', `No has completado la misión diaria.\n\nSerás transportado a la <b>Zona de Castigo</b>.\n\n[Misión de Castigo: Sobrevivir]\nHP -${loss}`, { danger: true, ok: 'Entendido' });
  } else {
    S.daily = freshDaily(t);
  }
  if (S.awakened) notify('Misión Diaria', 'La misión diaria [Entrenamiento de fuerza] ha llegado.');
  save();
  return true;
}

function clearPenalty() {
  S.penalty = null;
  unlockTitle('overcame');
  notify('Notificación', 'Has sobrevivido a la Zona de Castigo.\n\nRegresando al mundo original...');
  save(); render();
}

function useItem(id) {
  if (!S.inventory[id]) return;
  S.inventory[id]--;
  if (id === 'box') {
    const pool = ['hp', 'hp', 'mp', 'fat', 'fat', 'key', 'key', 'gold', 'gold', 'gold', 'stone'];
    const r = pool[Math.floor(Math.random() * pool.length)];
    if (r === 'gold') {
      const g = gainGold(100 + Math.floor(Math.random() * 400));
      notify('Caja Aleatoria', `Has obtenido:\n<span class="gold">${g} de oro</span>`);
    } else {
      addItem(r);
      notify('Caja Aleatoria', `Has obtenido:\n${ITEMS[r].ico} <b>[${ITEMS[r].name}]</b>`);
    }
  } else if (id === 'hp') { S.hp = maxHP(); notify('Notificación', 'HP restaurado por completo.'); }
  else if (id === 'mp') { S.mp = maxMP(); notify('Notificación', 'MP restaurado por completo.'); }
  else if (id === 'fat') { S.fatigue = 0; notify('Notificación', 'Fatiga: 0'); }
  else if (id === 'stone') { S.ap += 1; notify('Notificación', 'Puntos de habilidad +1'); }
  else if (id === 'key') {
    if (S.daily.dungeon) { addItem('key'); notify('Notificación', 'Ya hay una mazmorra abierta hoy.'); }
    else {
      const tier = Math.min(DUNGEONS.length - 1, Math.floor(S.dungeons / 3));
      S.daily.dungeon = { ...DUNGEONS[tier], done: false };
      notify('Mazmorra Instantánea', `Has entrado a: <b>${DUNGEONS[tier].name}</b>\n\nObjetivo: ${DUNGEONS[tier].task}\nRecompensa: ${DUNGEONS[tier].xp} XP\n\nEstá en la pestaña Misiones.`);
    }
  }
  save(); render();
}

function clearDungeon() {
  const d = S.daily.dungeon;
  if (!d || d.done) return;
  d.done = true;
  S.dungeons++;
  const xp = gainXP(d.xp, 'dungeon');
  const g = gainGold(150);
  let msg = `Has despejado la mazmorra.\n\nXP +${xp}  ·  Oro +${g}`;
  if (hasSkill('Sed de Sangre')) { addItem('box'); msg += '\nCaja Aleatoria ×1'; }
  notify('Mazmorra Despejada', msg);
  if (S.dungeons >= 3) unlockTitle('wolf');
  save(); render();
}

function completeSide(q) {
  if (q.done === today()) return;
  q.done = today();
  const xp = gainXP(q.xp, 'side');
  let g = 0;
  if (hasSkill('Daga Mortal')) g = gainGold(10);
  notify('Misión Completada', `[${q.name}]\n\nXP +${xp}${g ? `  ·  Oro +${g}` : ''}`);
  save(); render();
}

/* ================= RENDER ================= */

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bar = (cls, v, max) => `<div class="bar ${cls}"><i style="width:${Math.min(100, (v / max) * 100)}%"></i></div>`;

function timeLeft() {
  const now = new Date();
  const end = new Date(now); end.setHours(24, 0, 0, 0);
  const s = Math.floor((end - now) / 1000);
  const z = (n) => String(n).padStart(2, '0');
  return `${z(Math.floor(s / 3600))}:${z(Math.floor((s % 3600) / 60))}:${z(s % 60)}`;
}

function render() {
  document.body.classList.toggle('penalty', !!S.penalty);
  const app = $('#app');
  if (!S.awakened) { $('#tabs').hidden = true; app.innerHTML = viewAwaken(); bindAwaken(); return; }
  $('#tabs').hidden = false;
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
  decayFatigue();
  app.innerHTML = { status: viewStatus, quests: viewQuests, inventory: viewInventory, shop: viewShop, more: viewMore }[tab]();
}

function viewAwaken() {
  return `<div class="awaken"><div class="win">
    <div class="win-title flicker">Notificación</div>
    <p class="msg">Has adquirido las cualificaciones<br>para ser un <b>Jugador</b>.<br><br>¿Aceptarás?</p>
    <input id="nm" placeholder="Nombre del Jugador" maxlength="24" autocomplete="off">
    <button class="btn block" id="yes">Aceptar</button>
    <button class="btn block danger" id="no">Rechazar</button>
  </div></div>`;
}

function bindAwaken() {
  $('#no').onclick = () => notify('ADVERTENCIA', 'Si eliges no aceptar,\ntu corazón se detendrá en 0.02 segundos.', { danger: true, ok: 'Reconsiderar' });
  $('#yes').onclick = () => {
    const nm = $('#nm').value.trim();
    if (!nm) { $('#nm').focus(); return; }
    S.awakened = true; S.name = nm;
    S.daily = freshDaily(today());
    save();
    notify('Notificación', `Felicidades por convertirte en Jugador, <b>${esc(nm)}</b>.`);
    notify('Misión Diaria', 'La misión diaria [Entrenamiento de fuerza] ha llegado.\n\nRevisa la pestaña Misiones.');
    render();
  };
}

function viewStatus() {
  const t = S.title ? TITLES[S.title].name : 'Ninguno';
  return `<div class="win"><div class="win-title">Estado</div>
    <div class="row">
      <div><div class="big-level">${S.level}</div><div class="label">Nivel</div></div>
      <div style="text-align:right">
        <div><span class="label">Nombre:</span> ${esc(S.name)}</div>
        <div><span class="label">Clase:</span> ${S.job}</div>
        <div><span class="label">Título:</span> ${t}</div>
        <div><span class="label">Rango:</span> <span class="rank">${rank()}</span></div>
      </div>
    </div>
    <hr>
    <div class="row label"><span>XP</span><span>${S.xp} / ${xpNeeded()}</span></div>${bar('', S.xp, xpNeeded())}
    <div class="row label"><span>HP</span><span>${S.hp} / ${maxHP()}</span></div>${bar('hp', S.hp, maxHP())}
    <div class="row label"><span>MP</span><span>${S.mp} / ${maxMP()}</span></div>${bar('mp', S.mp, maxMP())}
    <div class="row label"><span>Fatiga</span><span>${Math.round(S.fatigue)}</span></div>${bar('fat', S.fatigue, 100)}
    <hr>
    <div class="grid2">${Object.entries(STATS).map(([k, [n, ab]]) => `
      <div class="stat"><span>${ab}: <b>${S.stats[k]}</b></span>
      ${S.ap ? `<button class="btn plus" data-stat="${k}" title="${n}">+</button>` : ''}</div>`).join('')}
      <div class="stat"><span class="muted">Puntos:</span> <b class="gold">${S.ap}</b></div>
    </div>
    ${S.ap ? '<p class="muted center" style="font-size:14px">Distribuí tus puntos de habilidad.</p>' : ''}
    <hr>
    <div class="row"><span class="label">Oro</span><b class="gold">${S.gold.toLocaleString('es')}</b></div>
    <div class="row"><span class="label">Racha</span><b>${S.streak} días (mejor: ${S.bestStreak})</b></div>
    ${S.shadows.length ? `<div class="row"><span class="label">Ejército de sombras</span><b style="color:var(--purple)">${S.shadows.length}</b></div>` : ''}
  </div>
  <div class="win"><div class="win-title">Habilidades</div>
    ${SKILLS.map((s) => {
      const has = s.job ? S.job !== 'Ninguno' : S.level >= s.lv;
      return `<div class="item" style="${has ? '' : 'opacity:.35'}"><div class="info">
        <b>${has ? s.name : '???'}</b><span class="tag">${s.type}</span>
        <div class="desc">${has ? s.desc : (s.job ? 'Requiere cambio de clase.' : `Se desbloquea en nivel ${s.lv}.`)}</div></div></div>`;
    }).join('')}
  </div>`;
}

function viewQuests() {
  const p = S.daily.progress;
  const done = dailyComplete();
  let html = '';
  if (S.penalty) {
    html += `<div class="win"><div class="win-title">Zona de Castigo</div>
      <p class="msg center">[Misión de Castigo: Sobrevivir]</p>
      <p class="center">${esc(S.penaltyTask)}</p>
      <p class="muted center" style="font-size:14px">Hasta que no sobrevivas, el Sistema permanecerá en rojo.</p>
      <button class="btn block danger" id="survive">He sobrevivido</button>
      ${hasSkill('Sigilo') ? `<button class="btn block" id="stealth" ${S.mp < 100 || (S.stealthUsed && Date.now() - S.stealthUsed < 7 * 864e5) ? 'disabled' : ''}>Usar [Sigilo] (100 MP, 1/semana)</button>` : ''}
    </div>`;
  }
  html += `<div class="win"><div class="win-title">Misión Diaria</div>
    <p class="center" style="margin-top:0">[Entrenamiento de fuerza]<br><b>Preparativos para volverse poderoso</b></p>
    ${Object.entries(EXERCISES).map(([k, e]) => {
      const ok = p[k] >= S.targets[k];
      return `<div class="goal ${ok ? 'done' : ''}">
        <span class="name">${e.name}</span>
        <span class="ctrls">
          <button class="btn small" data-ex="${k}" data-n="${-e.steps[0]}">−</button>
          <button class="btn small" data-ex="${k}" data-n="${e.steps[0]}">+${e.steps[0]}</button>
          <button class="btn small" data-ex="${k}" data-n="${e.steps[1]}">+${e.steps[1]}</button>
        </span>
        <span class="count">[${p[k]}/${S.targets[k]}${e.unit}]</span></div>`;
    }).join('')}
    ${S.daily.claimed
      ? '<p class="center" style="color:var(--accent)">✔ Misión completada. Recompensas recibidas.</p>'
      : `<button class="btn block" id="claim" ${done ? '' : 'disabled'}>${done ? 'Reclamar recompensas' : 'Incompleta'}</button>`}
    <div class="warn">ADVERTENCIA: no completar la misión diaria resultará en un castigo apropiado.
      <div class="row" style="margin-top:4px"><span>Tiempo restante</span><span class="timer" id="timer">${timeLeft()}</span></div></div>
    ${S.jobQuest === 'active' ? '<p class="center" style="color:var(--purple)">Misión de cambio de clase activa: completá el doble de cada objetivo hoy.</p>' : ''}
  </div>`;
  if (S.jobQuest === 'offered') {
    html += `<div class="win"><div class="win-title">Cambio de Clase</div>
      <p class="center">Completar el DOBLE de la misión diaria en un solo día.</p>
      <button class="btn block" id="jobAccept">Aceptar misión</button></div>`;
  }
  if (S.daily.dungeon) {
    const d = S.daily.dungeon;
    html += `<div class="win"><div class="win-title">Mazmorra Instantánea</div>
      <p class="center"><b>${d.name}</b><br>${d.task}<br><span class="muted">Recompensa: ${d.xp} XP</span></p>
      ${d.done ? '<p class="center" style="color:var(--accent)">✔ Despejada</p>' : '<button class="btn block" id="dungeon">Mazmorra despejada</button>'}</div>`;
  }
  html += `<div class="win"><div class="win-title">Misiones Secundarias</div>
    ${S.side.length ? '' : '<p class="muted center">Sin misiones. Agregalas en Sistema.</p>'}
    ${S.side.map((q) => `<div class="goal ${q.done === today() ? 'done' : ''}">
      <span class="name">${esc(q.name)} <span class="tag">${STATS[q.stat][1]}</span></span>
      <span class="count">+${q.xp} XP</span>
      ${q.done === today() ? '<span class="check">✔</span>' : `<button class="btn small" data-side="${q.id}">Hecho</button>`}
    </div>`).join('')}
  </div>`;
  return html;
}

function viewInventory() {
  const owned = Object.entries(S.inventory).filter(([, n]) => n > 0);
  return `<div class="win"><div class="win-title">Inventario</div>
    ${owned.length ? owned.map(([id, n]) => `<div class="item"><div class="ico">${ITEMS[id].ico}</div>
      <div class="info"><b>${ITEMS[id].name}</b> ×${n}<div class="desc">${ITEMS[id].desc}</div></div>
      <button class="btn small" data-use="${id}">${id === 'box' ? 'Abrir' : 'Usar'}</button></div>`).join('')
      : '<p class="muted center">Vacío.</p>'}
  </div>
  <div class="win"><div class="win-title">Títulos</div>
    ${Object.entries(TITLES).map(([id, t]) => {
      const has = S.titles.includes(id);
      return `<div class="item" style="${has ? '' : 'opacity:.35'}"><div class="info">
        <b>${has ? t.name : '???'}</b>${S.title === id ? '<span class="tag">Equipado</span>' : ''}
        <div class="desc">${has ? `${t.desc}<br>Efecto: ${t.bonus}` : 'Misión secreta.'}</div></div>
        ${has ? `<button class="btn small" data-title="${id}">${S.title === id ? 'Quitar' : 'Equipar'}</button>` : ''}</div>`;
    }).join('')}
  </div>`;
}

function viewShop() {
  return `<div class="win"><div class="win-title">Tienda</div>
    <div class="row" style="margin-bottom:8px"><span class="label">Oro disponible</span><b class="gold">${S.gold.toLocaleString('es')}</b></div>
    ${Object.entries(ITEMS).map(([id, it]) => `<div class="item"><div class="ico">${it.ico}</div>
      <div class="info"><b>${it.name}</b><div class="desc">${it.desc}</div></div>
      <button class="btn small" data-buy="${id}" ${S.gold < it.price ? 'disabled' : ''}>${it.price} G</button></div>`).join('')}
  </div>`;
}

function viewMore() {
  return `<div class="win"><div class="win-title">Dificultad</div>
    <p class="muted" style="margin-top:0;font-size:15px">Canon: 100 / 100 / 100 / 10 km. Ajustalo a tu nivel real y subilo con el tiempo.</p>
    <div class="grid2">${Object.entries(EXERCISES).map(([k, e]) => `<label>${e.name}${e.unit ? ` (${e.unit})` : ''}
      <input type="number" min="0" step="${k === 'run' ? 0.5 : 1}" data-target="${k}" value="${S.targets[k]}"></label>`).join('')}</div>
    <label style="display:block;margin-top:10px">Castigo<input id="ptask" value="${esc(S.penaltyTask)}"></label>
  </div>
  <div class="win"><div class="win-title">Nueva Misión Secundaria</div>
    <input id="sqName" placeholder="Ej: Meditar 10 minutos" maxlength="40">
    <div class="grid2" style="margin-top:8px">
      <select id="sqStat">${Object.entries(STATS).map(([k, [n]]) => `<option value="${k}">${n}</option>`).join('')}</select>
      <select id="sqXp"><option value="20">Fácil (20 XP)</option><option value="40" selected>Normal (40 XP)</option><option value="70">Difícil (70 XP)</option></select>
    </div>
    <button class="btn block" id="sqAdd">Agregar</button>
    ${S.side.map((q) => `<div class="goal"><span class="name">${esc(q.name)}</span><button class="btn small danger" data-del="${q.id}">✕</button></div>`).join('')}
  </div>
  <div class="win"><div class="win-title">Sistema</div>
    <div class="row"><span>Sonido</span><button class="btn small" id="snd">${S.sound ? 'Sí' : 'No'}</button></div>
    <div class="row" style="margin-top:8px"><span>Recordatorio</span><button class="btn small" id="notif">Activar</button></div>
    <p class="muted" style="font-size:14px">Misiones diarias completadas: ${S.totalDaily} · Mazmorras: ${S.dungeons}</p>
    <button class="btn block" id="export">Exportar datos</button>
    <button class="btn block" id="import">Importar datos</button>
    <button class="btn block danger" id="reset">Reiniciar Jugador</button>
    <p class="muted center" style="font-size:13px">Fan app inspirada en Solo Leveling. Datos guardados solo en este dispositivo.</p>
  </div>`;
}

/* ================= EVENTS ================= */

document.addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  const d = b.dataset;
  if (d.tab) { tab = d.tab; render(); window.scrollTo(0, 0); return; }
  if (d.stat && S.ap > 0) {
    S.ap--; S.stats[d.stat]++;
    if (d.stat === 'vit') S.hp += 10;
    if (d.stat === 'int') S.mp += 10;
    save(); render(); return;
  }
  if (d.ex) return logExercise(d.ex, Number(d.n));
  if (d.side) return completeSide(S.side.find((q) => q.id == d.side));
  if (d.use) return useItem(d.use);
  if (d.title) { S.title = S.title === d.title ? null : d.title; save(); render(); return; }
  if (d.buy) {
    const it = ITEMS[d.buy];
    if (S.gold < it.price) return;
    S.gold -= it.price; addItem(d.buy); save(); render();
    notify('Tienda', `Has comprado:\n${it.ico} <b>[${it.name}]</b>`); return;
  }
  if (d.del) { S.side = S.side.filter((q) => q.id != d.del); save(); render(); return; }
  switch (b.id) {
    case 'claim': return claimDaily();
    case 'survive': return clearPenalty();
    case 'stealth':
      S.mp -= 100; S.stealthUsed = Date.now(); S.penalty = null;
      notify('Notificación', '[Sigilo] activado.\nHas evitado la Zona de Castigo.'); save(); render(); return;
    case 'jobAccept': S.jobQuest = 'active'; save(); render(); return;
    case 'dungeon': return clearDungeon();
    case 'sqAdd': {
      const name = $('#sqName').value.trim();
      if (!name) return;
      S.side.push({ id: Date.now(), name, stat: $('#sqStat').value, xp: Number($('#sqXp').value), done: null });
      save(); render(); return;
    }
    case 'snd': S.sound = !S.sound; save(); render(); return;
    case 'notif': return enableReminder();
    case 'export': return exportData();
    case 'import': return importData();
    case 'reset':
      if (confirm('¿Borrar todo el progreso del Jugador?')) { S = defaultState(); save(); tab = 'status'; render(); }
      return;
  }
});

document.addEventListener('change', (ev) => {
  const el = ev.target;
  if (el.dataset.target) {
    const v = Math.max(el.dataset.target === 'run' ? 0.5 : 1, Number(el.value) || 0);
    S.targets[el.dataset.target] = v; save();
  }
  if (el.id === 'ptask') { S.penaltyTask = el.value.trim() || defaultState().penaltyTask; save(); }
});

function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `sistema-${today()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function importData() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'application/json';
  inp.onchange = async () => {
    try {
      const data = JSON.parse(await inp.files[0].text());
      if (!data || typeof data.level !== 'number') throw new Error();
      S = Object.assign(defaultState(), data); save(); render();
      notify('Notificación', 'Datos importados correctamente.');
    } catch (e) { notify('Error', 'Archivo inválido.', { danger: true }); }
  };
  inp.click();
}

async function enableReminder() {
  if (!('Notification' in window)) return notify('Error', 'Este dispositivo no soporta notificaciones.', { danger: true });
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return notify('Notificación', 'Permiso denegado.');
  notify('Notificación', 'Recordatorios activados.\nCon la app abierta o en segundo plano, el Sistema te avisará a las 20:00 si la misión diaria sigue incompleta.');
}

let reminded = null;
function maybeRemind() {
  if (!S.awakened || S.daily.claimed || reminded === today()) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (new Date().getHours() < 20) return;
  reminded = today();
  const body = 'La misión diaria sigue incompleta. No completarla resultará en un castigo apropiado.';
  navigator.serviceWorker?.ready
    .then((r) => r.showNotification('[ADVERTENCIA]', { body, icon: 'icons/icon-192.png', tag: 'daily' }))
    .catch(() => new Notification('[ADVERTENCIA]', { body }));
}

/* ================= BOOT ================= */

rollover();
render();
setInterval(() => {
  if (rollover()) render();
  maybeRemind();
  const t = $('#timer');
  if (t) t.textContent = timeLeft();
}, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { rollover(); render(); } });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
