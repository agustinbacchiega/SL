'use strict';

/* ================= EVENTS, TESTS, ACHIEVEMENTS ================= */

// Accepts "72,5" as well as "72.5" (phone keyboards in Spanish use a comma).
const num = (v) => Number(String(v).trim().replace(',', '.'));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function priceOf(id) {
  let pr = ITEMS[id].price * (hasSkill('Ojo del Mercader') ? 0.85 : 1);
  const ev = S.event;
  if (ev && ev.type === 'merchant' && ev.item === id && ev.date === today() && !ev.done) pr *= 0.5;
  return Math.round(pr);
}

function rollEvent() {
  if (!S.awakened || !S.profile || S.eventDay === today() || pausedOn(today())) return;
  S.eventDay = today();
  S.event = null;
  if (Math.random() >= 0.35 + (hasSkill('Instinto del Cazador') ? 0.15 : 0)) { save(); return; }
  const type = pick(['emergency', 'emergency', 'merchant', 'gate', 'blessing', 'chest']);
  const ev = { date: today(), type, done: false };
  if (type === 'emergency') {
    const e = pick(EX_POOL.filter((x) => !x[4].includes(S.profile.answers.injury)));
    const m = 1 + Math.min(S.level, 60) / 30;
    ev.task = e[2] === 'sec' ? `${e[0]}: ${fmtMin(Math.round((e[1] * m) / 15) * 15)}` : `${Math.round(e[1] * m)} × ${e[0]}`;
    ev.until = Date.now() + 2 * 3.6e6;
    notify('Misión de Emergencia', `[Misión de Emergencia]\n\n<b>${ev.task}</b>\n\nTiempo límite: 2 horas\nRecompensa: XP +120 · Caja Aleatoria`, { danger: true });
  } else if (type === 'merchant') {
    ev.item = pick(['hp', 'mp', 'fat', 'key', 'box', 'stone']);
    notify('Evento', `Un comerciante ambulante apareció.\n\nHoy: ${itemIco(ev.item)} <b>${ITEMS[ev.item].name}</b> a mitad de precio en la Tienda.`);
  } else if (type === 'gate') {
    addItem('key'); ev.done = true;
    notify('Evento', 'Una puerta apareció cerca de vos.\n\nHas obtenido:\n🗝️ <b>[Llave de Mazmorra Instantánea]</b>');
  } else if (type === 'blessing') {
    notify('Evento', '[Bendición del Sistema]\n\nToda la XP obtenida hoy aumenta un 50%.');
  } else {
    ev.gold = gainGold(200 + Math.floor(Math.random() * 300)); ev.done = true;
    notify('Evento', `Encontraste un cofre abandonado.\n\n<span class="gold">Oro +${ev.gold}</span>`);
  }
  S.event = ev;
  save();
}

function viewEvent() {
  const ev = S.event;
  if (!ev || ev.date !== today()) return '';
  if (ev.type === 'emergency') {
    const left = (ev.until - Date.now()) / 1000;
    return `<div class="win" style="--line:var(--red);--glow:var(--red-glow)"><div class="win-title">Misión de Emergencia</div>
      <p class="center" style="margin-top:0"><b>${ev.task}</b><br><span class="muted">Recompensa: XP +120 · Caja Aleatoria</span></p>
      ${ev.done ? '<p class="center" style="color:var(--accent)">✔ Completada</p>'
        : left <= 0 ? '<p class="center red">Tiempo agotado.</p>'
        : `<div class="center big-level red" style="font-size:32px" id="emg">${fmt(left)}</div><button class="btn block danger" id="emgDone">Completada</button>`}</div>`;
  }
  const text = {
    merchant: `🛒 Comerciante ambulante: ${ITEMS[ev.item] ? ITEMS[ev.item].name : ''} a mitad de precio en la Tienda${ev.done ? ' (ya compraste)' : ''}.`,
    gate: '🗝️ Una puerta apareció: recibiste una Llave de Mazmorra.',
    blessing: '✨ Bendición del Sistema: toda la XP de hoy +50%.',
    chest: `💰 Encontraste un cofre abandonado: +${ev.gold} de oro.`,
  }[ev.type];
  return `<div class="win"><div class="win-title">Evento de Hoy</div><p class="center" style="margin:0">${text}</p></div>`;
}

function completeEmergency() {
  const ev = S.event;
  if (!ev || ev.done) return;
  if (Date.now() > ev.until) { render(); return; }
  ev.done = true;
  S.emergencies = (S.emergencies || 0) + 1;
  gainProto(20);
  hitBoss('emergency');
  dayLog().emergency = ev.task;
  const xp = gainXP(120, 'emergency');
  addItem('box');
  notify('Misión Completada', `[Misión de Emergencia]\n\nXP +${xp}\nCaja Aleatoria ×1`);
  save(); render();
}

const TESTS = {
  push: { name: 'Flexiones máximas seguidas', unit: 'reps', goal: 50, title: 'fist' },
  squat: { name: 'Sentadillas en 1 minuto', unit: 'reps', timer: 60, goal: 50, title: 'legs' },
  plank: { name: 'Plancha máxima', unit: 'time', goal: 180, title: 'wall', hint: 'm:ss o segundos' },
  burpee: { name: 'Burpees en 3 minutos', unit: 'reps', timer: 180, goal: 60, title: 'engine' },
  run: { name: '1 km lo más rápido posible', unit: 'time', lower: true, goal: 270, title: 'wind', hint: 'm:ss' },
};

function parseTest(id, raw) {
  raw = String(raw).trim();
  if (TESTS[id].unit !== 'time') return Math.round(num(raw));
  if (raw.includes(':')) { const [m, sec] = raw.split(':'); return num(m) * 60 + num(sec); }
  return id === 'run' ? Math.round(num(raw) * 60) : Math.round(num(raw));
}
const fmtTest = (id, v) => (TESTS[id].unit === 'time' ? fmtMin(v) : `${v} reps`);

function recordTest(id) {
  const T = TESTS[id];
  const v = parseTest(id, $('#t_' + id).value);
  if (!(v > 0) || v > 100000) return;
  const list = (S.tests[id] = S.tests[id] || []);
  const best = list.length ? (T.lower ? Math.min(...list.map((x) => x.v)) : Math.max(...list.map((x) => x.v))) : null;
  const pr = best !== null && (T.lower ? v < best : v > best);
  const weekly = !list.some((x) => Date.now() - new Date(x.date + 'T12:00') < 6.5 * 864e5);
  list.push({ date: today(), v });
  let base = (weekly ? 80 : 0) + (pr ? 50 : 0);
  if (hasSkill('Intención Asesina')) base *= 2;
  const xp = base ? gainXP(base, 'test') : 0;
  if (pr) S.prs = (S.prs || 0) + 1;
  if (base) hitBoss('test');
  if (pr) gainProto(10);
  dayLog().tests = [...(dayLog().tests || []), `${T.name}: ${fmtTest(id, v)}`];
  notify('Prueba de Fuerza', `[${T.name}]\n\nResultado: <b>${fmtTest(id, v)}</b>${pr ? '\n\n🏆 ¡Nuevo récord personal!' : best === null ? '\n\nPrimera medición registrada.' : ''}` +
    `${xp ? `\n\nXP +${xp}` : '\n\nYa hiciste esta prueba esta semana: se registra, pero solo da XP si batís tu récord.'}`);
  if (T.lower ? v <= T.goal : v >= T.goal) unlockTitle(T.title);
  save(); render();
}

function viewTests() {
  return `<div class="win"><div class="win-title">Pruebas de Fuerza</div>
    <p class="muted" style="margin-top:0;font-size:14px">Medí tu progreso real. Cada prueba da XP una vez por semana, batir tu récord da bonus y superar ciertas marcas desbloquea títulos.</p>
    ${Object.entries(TESTS).map(([id, T]) => {
      const list = S.tests[id] || [];
      const best = list.length ? (T.lower ? Math.min(...list.map((x) => x.v)) : Math.max(...list.map((x) => x.v))) : null;
      return `<div style="padding:8px 0;border-bottom:1px dashed rgba(63,182,255,.25)">
        <div class="row"><b>${T.name}</b>${T.timer ? `<button class="btn small" data-rest="${T.timer}" data-label="${T.name}">⏱ ${fmtMin(T.timer)}</button>` : ''}</div>
        <div class="muted" style="font-size:14px">Récord: ${best !== null ? fmtTest(id, best) : '—'} · Meta del título: ${T.lower ? 'menos de ' : ''}${fmtTest(id, T.goal)}</div>
        <div class="row" style="margin-top:4px"><input id="t_${id}" type="text" inputmode="decimal" placeholder="${T.hint || 'Resultado'}"><button class="btn small" data-test="${id}">Registrar</button></div>
      </div>`;
    }).join('')}
    <p class="center timer rest-view" style="min-height:1.2em"></p>
  </div>`;
}

const ACHIEVEMENTS = [
  ['daily', 'Misiones diarias completadas', () => S.totalDaily, [1, 10, 50, 100, 365]],
  ['streak', 'Mejor racha de días', () => S.bestStreak, [3, 7, 30, 100, 365]],
  ['routines', 'Rutinas completadas', () => S.routineLog.length, [1, 10, 50, 100, 300]],
  ['dungeons', 'Mazmorras despejadas', () => S.dungeons, [1, 10, 25, 50, 100]],
  ['level', 'Nivel alcanzado', () => S.level, [10, 25, 50, 75, 100]],
  ['tests', 'Pruebas de fuerza realizadas', () => Object.values(S.tests || {}).reduce((t, l) => t + l.length, 0), [1, 10, 25, 50]],
  ['prs', 'Récords personales batidos', () => S.prs || 0, [1, 5, 15, 30]],
  ['emergency', 'Misiones de emergencia superadas', () => S.emergencies || 0, [1, 5, 10, 25]],
  ['side', 'Misiones secundarias completadas', () => S.sideDone || 0, [10, 50, 150, 500]],
  ['weight', 'Registros de peso', () => S.weights.length, [5, 20, 50, 100]],
  ['journal', 'Entradas de diario', () => Object.values(S.journal || {}).filter((j) => j.text).length, [1, 7, 30, 100, 365]],
];
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
const achReward = (i) => `${100 * (i + 1)} de oro${i >= 2 ? ' · Caja Aleatoria' : ''}${i >= 3 ? ' · +1 punto de habilidad' : ''}`;

function checkAchievements() {
  if (!S.awakened || !S.profile) return;
  S.ach = S.ach || {};
  for (const [id, name, fn, tiers] of ACHIEVEMENTS) {
    let got = S.ach[id] || 0;
    const v = fn();
    while (got < tiers.length && v >= tiers[got]) {
      const reward = achReward(got);
      gainGold(100 * (got + 1));
      if (got >= 2) addItem('box');
      if (got >= 3) S.ap += 1;
      gainProto(20 * (got + 1));
      got++;
      notify('Logro', `[Logro desbloqueado]\n\n<b>${name} ${ROMAN[got - 1]}</b>\n(${tiers[got - 1]})\n\nRecompensa: ${reward}`);
    }
    S.ach[id] = got;
  }
  if (S.dungeons >= 25) unlockTitle('conqueror');
  if (S.routineLog.length >= 50) unlockTitle('disciplined');
  if (S.bestStreak >= 100) unlockTitle('legend');
  if ((S.emergencies || 0) >= 10) unlockTitle('responder');
}

function viewAchievements() {
  return `<div class="win"><div class="win-title">Logros</div>
    ${ACHIEVEMENTS.map(([id, name, fn, tiers]) => {
      const got = (S.ach || {})[id] || 0, v = fn();
      const done = got >= tiers.length;
      const next = tiers[Math.min(got, tiers.length - 1)];
      return `<div style="padding:6px 0">
        <div class="row"><span>${name} ${got ? `<span class="tag">${ROMAN[got - 1]}</span>` : ''}</span><b>${done ? '✔ Completo' : `${v} / ${next}`}</b></div>
        ${done ? '' : bar('', v, next)}
        ${done ? '' : `<div class="muted" style="font-size:13px">Siguiente: ${achReward(got)}</div>`}
      </div>`;
    }).join('')}
  </div>`;
}

/* ================= WEEKLY BOSS ================= */

const WEEKLY_BOSSES = ['Igris, el Caballero Sangriento', 'Tusk, el Alto Orco', 'Vulcan, Señor de los Demonios', 'Baruka, el Elfo de Hielo',
  'Beru, el Rey Hormiga', 'Kargalgan, Chamán de los Alto Orcos', 'Metus, el Liche', 'Kamish, el Dragón'];
const WEEKLY_BOSSES_VARKA = ['Stormterror Dvalin', 'Andrius, Señor de los Lobos', 'Tartaglia, el Undécimo Heraldo', 'Azhdaha',
  'La Signora', 'Marioneta de la Shogun'];
// Damage per activity; HP scales with planned training days so a normal week can win.
const BOSS_DMG = { daily: 100, routine: 60, dungeon: 80, secret: 50, emergency: 50, test: 40, side: 20, journal: 10 };

function weekStart(d = new Date()) {
  const x = new Date(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return today(x);
}

function ensureBoss() {
  if (!S.awakened || !S.profile) return;
  const wk = weekStart();
  if (S.boss && S.boss.week === wk) return;
  if (S.boss && !S.boss.defeated && S.boss.hp < S.boss.max)
    notify('Jefe Semanal', `<b>${S.boss.name}</b> escapó con ${S.boss.hp} HP.\n\nUn nuevo jefe apareció esta semana.`);
  const n = Math.round((new Date(wk) - new Date('2024-01-01')) / (7 * 864e5));
  const max = 350 + 80 * TRAIN_DAYS[+S.profile.answers.activity].length;
  S.boss = { week: wk, n, max, hp: max, defeated: false, hits: [] };
}

const bossName = () => {
  const list = S.theme === 'varka' ? WEEKLY_BOSSES_VARKA : WEEKLY_BOSSES;
  return list[Math.abs(S.boss.n) % list.length];
};

function hitBoss(kind) {
  seasonGain(kind);
  ensureBoss();
  const b = S.boss;
  if (!b || b.defeated) return;
  const dmg = BOSS_DMG[kind] || BOSS_DMG.side;
  b.hp = Math.max(0, b.hp - dmg);
  b.hits = [{ kind, dmg, date: today() }, ...b.hits].slice(0, 6);
  if (b.hp > 0) return;
  b.defeated = true;
  const xp = gainXP(300);
  const g = gainGold(300);
  addItem('box'); addItem('key');
  gainProto(160);
  seasonGain('boss');
  dayLog().boss = bossName();
  notify('Jefe Semanal', `¡Has derrotado a <b>${bossName()}</b>!\n\nRecompensas:\n• XP +${xp}\n• Oro +${g}\n• Caja Aleatoria ×1\n• Llave de Mazmorra ×1\n\nUn nuevo jefe aparecerá el lunes.`);
}

const HIT_LABEL = { commission: 'Encargo', daily: 'Misión diaria', routine: 'Rutina', dungeon: 'Mazmorra', secret: 'Misión secreta', emergency: 'Emergencia', test: 'Prueba de fuerza', side: 'Misión secundaria', journal: 'Diario' };

function viewBoss() {
  ensureBoss();
  const b = S.boss;
  if (!b) return '';
  const end = new Date(b.week + 'T00:00'); end.setDate(end.getDate() + 7);
  const days = Math.ceil((end - Date.now()) / 864e5);
  return `<div class="win"><div class="win-title">Jefe Semanal</div>
    <p class="center" style="margin-top:0"><b class="red">${bossName()}</b></p>
    ${b.defeated ? '<p class="center" style="color:var(--accent)">✔ Derrotado esta semana</p>'
      : `<div class="row label"><span>HP</span><span>${b.hp} / ${b.max}</span></div>${bar('hp', b.hp, b.max)}
      <p class="muted" style="font-size:13px;margin:4px 0">Todo lo que hacés le hace daño: diaria ${BOSS_DMG.daily} · rutina ${BOSS_DMG.routine} · mazmorra ${BOSS_DMG.dungeon} · secreta ${BOSS_DMG.secret} · emergencia ${BOSS_DMG.emergency} · prueba ${BOSS_DMG.test} · secundaria ${BOSS_DMG.side} · diario ${BOSS_DMG.journal}.<br>
      Quedan ${days} día${days === 1 ? '' : 's'}. Recompensa: 300 XP, 300 de oro, Caja y Llave.</p>`}
    ${b.hits.length ? `<div class="muted" style="font-size:13px">Últimos golpes: ${b.hits.map((h) => `${HIT_LABEL[h.kind]} −${h.dmg}`).join(' · ')}</div>` : ''}
  </div>`;
}

/* ================= GUIDED TRAINING ================= */

let guide = null; // { id, steps, i, end, left, started }

function startGuide(id) {
  const r = buildRoutine(id);
  const steps = [];
  for (let set = 1; set <= r.sets; set++) {
    r.ex.forEach((e, k) => {
      steps.push({ kind: 'ex', e, set });
      const last = set === r.sets && k === r.ex.length - 1;
      if (r.rest && !last) steps.push({ kind: 'rest', sec: r.rest });
    });
  }
  guide = { id, name: r.name, sets: r.sets, steps, i: 0, end: null, left: null, started: Date.now() };
  armStep();
  render(); window.scrollTo(0, 0);
}

function guideSecs(st) { return st.kind === 'rest' ? st.sec : st.e.unit === 'sec' ? st.e.v : 0; }

function armStep() {
  const st = guide.steps[guide.i];
  guide.left = null;
  // Rests start on their own; timed exercises wait for "Iniciar" so the user can get in position.
  guide.end = st.kind === 'rest' ? Date.now() + st.sec * 1000 : null;
}

function guideNext(delta = 1) {
  guide.i += delta;
  if (guide.i < 0) guide.i = 0;
  if (guide.i >= guide.steps.length) return finishGuide();
  armStep(); render();
}

function finishGuide() {
  const g = guide;
  guide = null;
  S.daily.timer.acc += (Date.now() - g.started) / 1000;
  if (routineDone(g.id)) { notify('Entrenamiento', `[${g.name}]\n\nEntrenamiento terminado.`); save(); render(); return; }
  completeRoutine(g.id);
}

function viewGuide() {
  const st = guide.steps[guide.i];
  const next = guide.steps.slice(guide.i + 1).find((x) => x.kind === 'ex');
  const secs = guideSecs(st);
  const left = guide.end ? Math.max(0, (guide.end - Date.now()) / 1000) : guide.left ?? secs;
  let body;
  if (st.kind === 'rest') {
    body = `<div class="label center">Descanso</div>
      <div class="center big-level" style="font-size:64px;margin:10px 0" id="gtime">${fmtMin(Math.ceil(left))}</div>
      <button class="btn block" id="gSkip">Saltar descanso</button>`;
  } else if (st.e.unit === 'sec') {
    body = `<div class="label center">Serie ${st.set} / ${guide.sets}</div>
      <p class="msg center" style="font-size:24px;margin:8px 0"><b>${st.e.name}</b></p>
      <div class="center big-level" style="font-size:64px;margin:10px 0" id="gtime">${fmtMin(Math.ceil(left))}</div>
      <button class="btn block" id="gToggle">${guide.end ? 'Pausar' : guide.left != null ? 'Reanudar' : 'Iniciar'}</button>
      <button class="btn block small" id="gSkip">Hecho, siguiente</button>`;
  } else {
    body = `<div class="label center">Serie ${st.set} / ${guide.sets}</div>
      <p class="msg center" style="font-size:24px;margin:8px 0"><b>${st.e.name}</b></p>
      <div class="center big-level" style="font-size:64px;margin:10px 0">${st.e.v}</div>
      <div class="label center">repeticiones</div>
      <button class="btn block" id="gSkip">Hecho ✓</button>`;
  }
  return `<div class="win"><div class="win-title">${guide.name}</div>
    <div class="row label"><span>Paso ${guide.i + 1} / ${guide.steps.length}</span><span>${fmt((Date.now() - guide.started) / 1000)}</span></div>
    ${bar('', guide.i, guide.steps.length)}
    ${body}
    <p class="muted center" style="font-size:14px">${next ? `Siguiente: ${next.e.name}${next.e.unit === 'sec' ? ` (${fmtMin(next.e.v)})` : ` (${next.e.v})`}` : 'Último paso'}</p>
    <div class="row"><button class="btn small" id="gPrev" ${guide.i ? '' : 'disabled'}>‹ Anterior</button>
      <button class="btn small danger" id="gExit">Salir</button></div>
  </div>`;
}

function tickGuide() {
  if (!guide || !guide.end) return;
  const left = (guide.end - Date.now()) / 1000;
  const el = $('#gtime');
  if (left <= 0) {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    guideNext();
  } else if (el) el.textContent = fmtMin(Math.ceil(left));
}

/* ================= HUNTER CARD ================= */

let cardBlob = null;

async function makeCard() {
  const W = 1080, H = 1350;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  const css = getComputedStyle(document.body);
  const col = (v) => css.getPropertyValue(v).trim();
  const line = col('--line'), accent = col('--accent'), gold = col('--gold'), text = col('--text'), muted = col('--muted');
  // Don't hang when offline and the web font can't load.
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) { /* ignore */ }
  const F = (size, w = 600) => `${w} ${size}px Rajdhani, "Segoe UI", sans-serif`;
  const g = x.createRadialGradient(W / 2, 0, 100, W / 2, 300, 1300);
  g.addColorStop(0, S.theme === 'varka' ? '#123a36' : '#0c1d38');
  g.addColorStop(1, S.theme === 'varka' ? '#06110f' : '#050a14');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = line; x.lineWidth = 4; x.shadowColor = line; x.shadowBlur = 24;
  x.strokeRect(50, 50, W - 100, H - 100);
  x.shadowBlur = 0;
  x.textAlign = 'center';
  x.fillStyle = accent; x.font = F(44, 700);
  x.fillText(themed(S.theme === 'varka' ? 'LICENCIA DE CABALLERO DE FAVONIUS' : 'LICENCIA DE CAZADOR'), W / 2, 140);
  x.fillStyle = text; x.font = F(96, 700);
  x.fillText(S.name, W / 2, 270);
  x.font = F(40); x.fillStyle = muted;
  x.fillText(themed(`${S.job === 'Ninguno' ? 'Sin clase' : S.job} · ${S.title ? TITLES[S.title].name : 'Sin título'}`), W / 2, 330);
  // level + rank
  x.fillStyle = text; x.font = F(180, 700);
  x.fillText(String(S.level), W / 2 - 200, 560);
  x.font = F(36); x.fillStyle = muted; x.fillText('NIVEL', W / 2 - 200, 610);
  x.fillStyle = gold; x.font = F(rank().length > 3 ? 64 : 160, 700);
  x.fillText(rank(), W / 2 + 200, 560);
  x.font = F(36); x.fillStyle = muted; x.fillText('RANGO', W / 2 + 200, 610);
  // stats
  x.strokeStyle = line; x.lineWidth = 2; x.beginPath(); x.moveTo(120, 670); x.lineTo(W - 120, 670); x.stroke();
  Object.entries(STATS).forEach(([k, [, ab]], i) => {
    const cx = 160 + i * 190;
    x.fillStyle = muted; x.font = F(34); x.fillText(ab, cx, 730);
    x.fillStyle = text; x.font = F(64, 700); x.fillText(String(S.stats[k]), cx, 800);
  });
  x.beginPath(); x.moveTo(120, 850); x.lineTo(W - 120, 850); x.stroke();
  // records
  const best = (id) => {
    const l = S.tests[id] || [];
    if (!l.length) return '—';
    const v = TESTS[id].lower ? Math.min(...l.map((r) => r.v)) : Math.max(...l.map((r) => r.v));
    return fmtTest(id, v);
  };
  const rows = [
    ['Racha actual', `${S.streak} días (mejor ${S.bestStreak})`],
    ['Misiones diarias', String(S.totalDaily)],
    ['Mazmorras despejadas', String(S.dungeons)],
    ['Flexiones seguidas', best('push')],
    ['1 km', best('run')],
  ];
  x.textAlign = 'left';
  rows.forEach(([k, v], i) => {
    const y = 920 + i * 70;
    x.fillStyle = muted; x.font = F(40); x.fillText(themed(k), 140, y);
    x.textAlign = 'right'; x.fillStyle = text; x.font = F(44, 700); x.fillText(v, W - 140, y);
    x.textAlign = 'left';
  });
  x.textAlign = 'center'; x.fillStyle = muted; x.font = F(30);
  x.fillText(themed('El Sistema · agustinbacchiega.github.io/SL'), W / 2, H - 90);
  return new Promise((res) => c.toBlob(res, 'image/png'));
}

async function showCard() {
  const btn = $('#card');
  if (btn) { btn.disabled = true; btn.textContent = 'Generando…'; }
  cardBlob = await makeCard();
  if (btn) { btn.disabled = false; btn.textContent = themed('🪪 Tarjeta de cazador'); }
  const url = URL.createObjectURL(cardBlob);
  notify('Tarjeta de Cazador', '', {
    html: `<img src="${url}" alt="Tarjeta" style="width:100%;border:1px solid var(--line);border-radius:4px">
      <button class="btn block" id="cardShare">Compartir</button>`,
    ok: 'Cerrar',
  });
}

async function shareCard() {
  if (!cardBlob) return;
  const file = new File([cardBlob], 'tarjeta-cazador.png', { type: 'image/png' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Mi tarjeta de cazador' }); return; }
  } catch (e) { if (e.name === 'AbortError') return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(cardBlob); a.download = 'tarjeta-cazador.png'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
