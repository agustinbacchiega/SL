'use strict';

/* ================= GRAND MASTER REGIMEN (Varka sub-mode) ================= */

const gmOn = () => S.theme === 'varka' && S.gm && S.gm.unlocked && S.gm.active;

function lastDays(n) {
  const out = [];
  for (let i = 0; i < n; i++) { const d = new Date(); d.setDate(d.getDate() - i); out.push(today(d)); }
  return out;
}

// Two weeks of consistency across most of the app.
function gmReqs() {
  const days = lastDays(14), L = (d) => (S.log || {})[d] || {};
  const dailies = days.filter((d) => L(d).daily || (d === today() && S.daily.claimed)).length;
  const routines = days.reduce((a, d) => a + (L(d).routines ? L(d).routines.length : 0), 0);
  const journal = days.filter((d) => S.journal && S.journal[d] && S.journal[d].text).length;
  const boss = days.some((d) => L(d).boss) ? 1 : 0;
  return [
    ['Entrenamientos de Favonius completos', dailies, 11],
    ['Rutinas completadas', routines, 6],
    ['Entradas de la bitácora', journal, 5],
    ['Jefe semanal derrotado', boss, 1],
  ];
}
const gmReady = () => gmReqs().every(([, have, need]) => have >= need) && !S.penalty;

// [name, amount, unit, injuries, substitute [name, amount, unit]]
const GM_TRIAL = [
  ['Marcha con mochila cargada', 1800, 'sec', ['knee', 'back'], ['Caminata rápida sin carga', 2400, 'sec']],
  ['Flexiones (en las series que necesites)', 100, 'rep', ['shoulder'], ['Puente de glúteo', 150, 'rep']],
  ['Sentadillas', 150, 'rep', ['knee'], ['Puente de glúteo a una pierna (total)', 80, 'rep']],
  ['Plancha acumulada', 300, 'sec', ['shoulder'], ['Dead bug lento (acumulado)', 300, 'sec']],
  ['Burpees', 50, 'rep', ['knee', 'shoulder'], ['Boxeo de sombra', 600, 'sec']],
];

function buildTrial() {
  const a = S.profile.answers, fac = [0.5, 0.7, 0.85, 1][+a.pushups];
  return GM_TRIAL.map(([name, amt, unit, avoid, sub]) => {
    const [n, v, u] = avoid.includes(a.injury) ? sub : [name, amt, unit];
    const val = n.startsWith('Marcha') || n.startsWith('Caminata') ? v : u === 'sec' ? Math.round((v * fac) / 15) * 15 : Math.round((v * fac) / 5) * 5;
    return { name: n, v: val, unit: u, done: false };
  });
}

// Varka writes once when the requirements are met; resets if they slip again.
function gmReadyNotice() {
  if (S.theme !== 'varka' || !S.gm || S.gm.unlocked || S.gm.trial) return;
  const ready = gmReady();
  if (ready && !S.gm.readyNotified) {
    S.gm.readyNotified = true;
    notify('Carta del Gran Maestro', '"Te estuve observando estas dos semanas. Estás listo."\n— Varka\n\nCumpliste los requisitos del <b>Régimen del Gran Maestro</b>.\nAceptá la prueba en la pestaña Rutinas.');
  } else if (!ready && S.gm.readyNotified) {
    S.gm.readyNotified = false;
  }
}

function gmCheckTrial() {
  const tr = S.gm && S.gm.trial;
  if (!tr || tr.date === today()) return;
  S.gm.trial = null;
  S.gm.lastFail = tr.date;
  notify('Prueba del Gran Maestro', 'No completaste la prueba a tiempo.\n\n"La fuerza no se improvisa. Volvé a intentarlo cuando estés listo."\n\nPodés reintentarla en 3 días.', { danger: true });
  save();
}

function gmStepDone(i) {
  const tr = S.gm.trial;
  if (!tr || tr.steps[i].done) return;
  tr.steps[i].done = true;
  if (tr.steps.every((x) => x.done)) {
    S.gm.trial = null;
    S.gm.unlocked = true;
    S.gm.active = true;
    S.gm.misses = [];
    S.gear.inv.w_granmaestro = Math.max(1, S.gear.inv.w_granmaestro || 0);
    S.gear.primos += 1600;
    const xp = gainXP(500);
    unlockTitle('gm');
    notify('Prueba del Gran Maestro', `Has superado la Prueba del Gran Maestro.\n\n"Bienvenido a mi régimen. Desde hoy entrenás como yo."\n— Varka\n\nRecompensas:\n• XP +${xp}\n• 💎 Protogemas +1600\n• ★★★★★ <b>Mandoble del Gran Maestro</b> (exclusivo)\n\nEl Régimen del Gran Maestro está activo.`);
  }
  save(); render();
}

function gmMissed() {
  if (!gmOn()) return;
  const wk = weekStart();
  S.gm.misses = (S.gm.misses || []).filter((d) => weekStart(new Date(d + 'T12:00')) === wk).concat(today());
  if (S.gm.misses.length >= 2) {
    S.gm.unlocked = false; S.gm.active = false; S.gm.misses = [];
    notify('Régimen del Gran Maestro', '"Dos ausencias en una semana. Un caballero de mi régimen no falta."\n— Varka\n\nPerdiste el acceso al Régimen del Gran Maestro. Volvé a cumplir los requisitos y superar la prueba para recuperarlo.\nTu título y tu mandoble se quedan con vos.', { danger: true });
  } else {
    notify('Régimen del Gran Maestro', 'Faltaste a un entrenamiento.\n\nUna ausencia más esta semana y perdés el régimen.', { danger: true });
  }
}

function gmPerfectWeek() {
  if (!gmOn() || S.gm.perfect === weekStart()) return;
  const start = new Date(weekStart() + 'T12:00');
  for (let i = 0; i < 7; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i);
    const k = today(d);
    if (!((S.log || {})[k] || {}).daily) return;
  }
  S.gm.perfect = weekStart();
  S.ap += 1;
  S.gear.primos += 320;
  notify('Régimen del Gran Maestro', '[Semana perfecta]\n\n7 de 7 entrenamientos bajo el régimen del Gran Maestro.\n\nRecompensas:\n• Sello del Gran Maestro: +1 punto de habilidad\n• 💎 Protogemas +320');
}

const GM_LETTERS = [
  'Ahora entrenás como yo. Eso significa que no hay días fáciles, solo días hechos.',
  'Mi régimen no es para todos. Lo sé porque te vi llegar hasta acá.',
  'Cuando la expedición encuentra una montaña, no busca rodearla.',
  'Un Gran Maestro no exige a sus caballeros nada que no se exija primero a sí mismo.',
  'El cansancio de hoy es la fuerza de la próxima expedición.',
  'Dos semanas de constancia te trajeron hasta acá. Ahora sostenelo.',
];

function viewGM() {
  if (S.theme !== 'varka') return '';
  const g = S.gm;
  if (g.unlocked) {
    return `<div class="win gm-win"><div class="win-title">Régimen del Gran Maestro</div>
      <p class="center" style="margin-top:0">${g.active ? '<b class="gold">ACTIVO</b>' : '<span class="muted">En pausa</span>'}</p>
      <ul style="font-size:14px;padding-left:18px;margin:6px 0">
        <li>Entrenamiento diario <b>×1,5</b> · rutinas con <b>+1 serie</b> y más carga</li>
        <li>XP de entrenamiento, rutinas y dominios <b>+50%</b> · protogemas <b>×2</b></li>
        <li>Semana perfecta (7/7): +1 punto de habilidad y 320 💎</li>
        <li>Dos ausencias en la misma semana y perdés el régimen</li>
      </ul>
      ${g.active ? `<p class="center muted" style="font-size:13px">Ausencias esta semana: ${(g.misses || []).filter((d) => weekStart(new Date(d + 'T12:00')) === weekStart()).length} / 2</p>` : ''}
      <button class="btn block" id="gmToggle">${g.active ? 'Pausar régimen' : 'Reanudar régimen'}</button>
    </div>`;
  }
  if (g.trial) {
    return `<div class="win gm-win"><div class="win-title">Prueba del Gran Maestro</div>
      <p class="center" style="margin-top:0;font-size:15px">Completá todo <b>hoy</b>. Podés hacerlo en partes a lo largo del día.</p>
      ${g.trial.steps.map((st, i) => `<div class="goal ${st.done ? 'done' : ''}"><span class="name">${st.unit === 'sec' ? `${st.name}: ${fmtMin(st.v)}` : `${st.v} × ${st.name}`}</span>
        ${st.done ? '<span class="check">✔</span>' : `${st.unit === 'sec' ? `<button class="btn small" data-rest="${st.v}" data-label="${esc(st.name)}">⏱</button>` : ''}<button class="btn small" data-gmstep="${i}">Hecho</button>`}</div>`).join('')}
      <p class="center timer rest-view" style="min-height:1.2em"></p>
    </div>`;
  }
  const reqs = gmReqs(), ready = gmReady();
  const cooldown = g.lastFail && (Date.now() - new Date(g.lastFail + 'T12:00')) < 3 * 864e5;
  return `<div class="win gm-win"><div class="win-title">Régimen del Gran Maestro</div>
    <p style="margin-top:0;font-size:15px;font-style:italic">"Si querés entrenar como yo, primero demostrá que podés sostenerlo." — Varka</p>
    <div class="label">Requisitos (últimos 14 días)</div>
    ${reqs.map(([label, have, need]) => `<div class="row" style="padding:3px 0"><span>${have >= need ? '✔' : '◻'} ${label}</span><b>${Math.min(have, need)} / ${need}</b></div>${bar('', Math.min(have, need), need)}`).join('')}
    ${S.penalty ? '<p class="red center" style="font-size:14px">No podés intentarlo mientras estés castigado.</p>' : ''}
    <button class="btn block" id="gmTrial" ${ready && !cooldown ? '' : 'disabled'}>${cooldown ? 'Podés reintentar en unos días' : ready ? 'Aceptar la Prueba del Gran Maestro' : 'Requisitos incompletos'}</button>
    <p class="muted" style="font-size:13px">La prueba dura un día: marcha con carga, flexiones, sentadillas, plancha y burpees, ajustados a tu nivel y lesiones.</p>
  </div>`;
}

/* ================= PAUSE MODE ================= */

// Sick or travelling: no penalty, the streak is frozen. Max 7 paused days per month.
const PAUSE_PER_MONTH = 7;
const pausedOn = (d) => !!(S.pause && d >= S.pause.from && d <= S.pause.to);
const pauseUsed = () => (S.pauseDays || []).filter((d) => d.startsWith(today().slice(0, 7))).length;
const PAUSE_REASONS = { sick: 'Enfermo / lesionado', travel: 'De viaje', other: 'Otro motivo' };

function startPause(days, reason) {
  const left = PAUSE_PER_MONTH - pauseUsed();
  days = Math.min(days, left);
  if (days < 1 || S.penalty) return;
  const from = today(), end = new Date(); end.setDate(end.getDate() + days - 1);
  S.pause = { from, to: today(end), reason };
  S.pauseDays = S.pauseDays || [];
  for (let i = 0; i < days; i++) { const d = new Date(); d.setDate(d.getDate() + i); pushUnique(S.pauseDays, today(d)); }
  notify('Notificación', `Modo pausa activado hasta el ${shortDate(S.pause.to)}.\n\nNo habrá castigos y tu racha queda congelada.\n\nRecuperate bien.`);
  save(); render();
}

function endPause() {
  if (!S.pause) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  // Today stops being protected; unused future days go back to the monthly allowance.
  S.pauseDays = (S.pauseDays || []).filter((d) => d < today());
  S.pause = S.pause.from < today() ? { ...S.pause, to: today(y) } : null;
  notify('Notificación', 'Modo pausa terminado.\n\nBienvenido de vuelta. La misión diaria de hoy vuelve a contar.');
  save(); render();
}

function viewPause() {
  const on = S.pause && pausedOn(today());
  const left = PAUSE_PER_MONTH - pauseUsed();
  return `<div class="win"><div class="win-title">Modo Pausa</div>
    ${on ? `<p class="center" style="margin-top:0">En pausa hasta el <b>${shortDate(S.pause.to)}</b><br><span class="muted">${PAUSE_REASONS[S.pause.reason]}</span></p>
      <button class="btn block" id="pauseEnd">Terminar pausa</button>`
    : `<p class="muted" style="margin-top:0;font-size:14px">Si estás enfermo, lesionado o de viaje: sin castigos y con la racha congelada. Te quedan <b>${left}</b> de ${PAUSE_PER_MONTH} días este mes.</p>
      <div class="grid2"><select id="pauseDays">${Array.from({ length: Math.max(1, left) }, (_, i) => `<option value="${i + 1}">${i + 1} día${i ? 's' : ''}</option>`).join('')}</select>
        <select id="pauseReason">${Object.entries(PAUSE_REASONS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
      <button class="btn block" id="pauseStart" ${left < 1 || S.penalty ? 'disabled' : ''}>${S.penalty ? 'No disponible durante un castigo' : 'Activar pausa'}</button>`}
  </div>`;
}

/* ================= FAVONIUS COMMISSIONS (Varka theme) ================= */

// [task, requester]; 4 per day picked from the date so they're stable all day.
const COMMISSIONS = [
  ['Tomar 2 vasos de agua al despertar', 'Sara, del Obsequio del Ángel'],
  ['Estirar 5 minutos', 'Noelle, sirvienta de los Caballeros'],
  ['Caminar 10 minutos al aire libre', 'Amber, exploradora'],
  ['Escribir en la bitácora', 'Lisa, bibliotecaria'],
  ['Ordenar tu espacio durante 5 minutos', 'Adelinde, del Viñedo del Amanecer'],
  ['30 minutos sin pantallas antes de dormir', 'Barbara, diaconisa'],
  ['Comer una fruta', 'Flora, florista de Mondstadt'],
  ['Usar las escaleras en lugar del ascensor', 'Kaeya, capitán de caballería'],
  ['2 minutos de respiración lenta', 'Venti, bardo errante'],
  ['1 minuto de plancha extra', 'Eula, capitana de reconocimiento'],
  ['Leer 10 páginas', 'Albedo, alquimista jefe'],
  ['Hacer algo amable por alguien', 'Jean, Gran Maestra en funciones'],
];

function todaysCommissions() {
  const seed = [...today()].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 7);
  const idx = [];
  for (let k = 0; idx.length < 4; k++) { const i = (seed + k * 5) % COMMISSIONS.length; if (!idx.includes(i)) idx.push(i); }
  return idx;
}

function commissionDone(i) {
  if (!S.comm || S.comm.date !== today()) S.comm = { date: today(), done: [], bonus: false };
  if (S.comm.done.includes(i)) return;
  S.comm.done.push(i);
  gainProto(10);
  const xp = gainXP(15);
  hitBoss('commission');
  let msg = `[${COMMISSIONS[i][0]}]\n\n"¡Gracias, caballero!" — ${COMMISSIONS[i][1]}\n\nXP +${xp}`;
  if (S.comm.done.length === 4 && !S.comm.bonus) {
    S.comm.bonus = true;
    gainProto(20);
    const g = gainGold(100);
    msg += `\n\n<b>Encargos diarios completos</b>\nKatheryne te entrega la recompensa del Gremio: Mora +${g}`;
  }
  notify('Encargo Completado', msg);
  save(); render();
}

function viewCommissions() {
  if (S.theme !== 'varka') return '';
  const done = S.comm && S.comm.date === today() ? S.comm.done : [];
  return `<div class="win"><div class="win-title">Encargos Diarios</div>
    <p class="muted" style="margin-top:0;font-size:14px">Del Gremio de Aventureros. Cada uno: +10 💎 y 15 XP. Los 4: +20 💎 y Mora extra.</p>
    ${todaysCommissions().map((i) => `<div class="goal ${done.includes(i) ? 'done' : ''}"><span class="name">${COMMISSIONS[i][0]}<br><small class="muted">${COMMISSIONS[i][1]}</small></span>
      ${done.includes(i) ? '<span class="check">✔</span>' : `<button class="btn small" data-comm="${i}">Hecho</button>`}</div>`).join('')}
    <p class="center muted" style="font-size:13px;margin:6px 0 0">${done.length} / 4</p>
  </div>`;
}

/* ================= SEASONS ================= */

const SEASON_LEVELS = 30, SEASON_STEP = 120;
const SEASON_PTS = { daily: 100, routine: 60, dungeon: 80, secret: 50, emergency: 50, test: 40, side: 20, journal: 20, commission: 15, boss: 150 };
const SEASON_NAMES = ['del Despertar', 'de la Puerta Roja', 'del Castillo del Demonio', 'de las Hormigas de Jeju', 'del Monarca', 'de los Cazadores',
  'de la Mazmorra Doble', 'de los Gremios', 'de las Sombras', 'del Rango S', 'de la Reevaluación', 'del Nivel Nacional'];
const SEASON_NAMES_VARKA = ['del Viento del Oeste', 'del Bosque Susurrante', 'del Espinadragón', 'de la Expedición', 'del Cabo del Juramento', 'del Lobo del Norte',
  'de Barbatos', 'del Viñedo del Amanecer', 'del Valle Estelar', 'de la Orden', 'de Wolvendom', 'del Gran Maestro'];
const seasonName = () => `Temporada ${(S.theme === 'varka' ? SEASON_NAMES_VARKA : SEASON_NAMES)[+today().slice(5, 7) - 1]}`;

function seasonReward(lv) {
  if (lv === SEASON_LEVELS) return { label: '🏆 Título «Campeón de Temporada» + Piedra Rúnica', give: () => { addItem('stone'); unlockTitle('season'); S.seasonWins = (S.seasonWins || 0) + 1; } };
  if (lv % 10 === 0) return { label: '💠 Piedra Rúnica', give: () => addItem('stone') };
  if (lv % 5 === 0) return { label: '🗝️ Llave + 💎 160', give: () => { addItem('key'); gainProto(160); } };
  if (lv % 3 === 0) return { label: '🎁 Caja Aleatoria', give: () => addItem('box') };
  return { label: `🪙 ${50 + lv * 10} de oro`, give: () => gainGold(50 + lv * 10) };
}

function ensureSeason() {
  const id = today().slice(0, 7);
  if (!S.season || S.season.id !== id) S.season = { id, pts: 0, lvl: 0 };
}

function seasonGain(kind) {
  if (!S.awakened || !S.profile) return;
  ensureSeason();
  const se = S.season;
  se.pts += SEASON_PTS[kind] || 0;
  const got = [];
  while (se.lvl < SEASON_LEVELS && se.pts >= (se.lvl + 1) * SEASON_STEP) {
    se.lvl++;
    const r = seasonReward(se.lvl);
    r.give();
    got.push(`Nivel ${se.lvl}: ${r.label}`);
  }
  if (got.length) notify('Pase de Temporada', `${seasonName()}\n\n${got.join('\n')}`);
}

function viewSeason() {
  ensureSeason();
  const se = S.season;
  const end = new Date(); end.setMonth(end.getMonth() + 1, 1); end.setHours(0, 0, 0, 0);
  const days = Math.ceil((end - Date.now()) / 864e5);
  const into = se.pts - se.lvl * SEASON_STEP;
  const next = [];
  for (let lv = se.lvl + 1; lv <= Math.min(SEASON_LEVELS, se.lvl + 4); lv++) next.push(`<div class="row" style="font-size:14px;padding:2px 0"><span class="muted">Nivel ${lv}</span><span>${seasonReward(lv).label}</span></div>`);
  return `<div class="win"><div class="win-title">Pase de Temporada</div>
    <p class="center" style="margin-top:0"><b>${seasonName()}</b><br><span class="muted" style="font-size:14px">Termina en ${days} día${days === 1 ? '' : 's'}</span></p>
    <div class="row"><span class="label">Nivel</span><b class="gold" style="font-size:22px">${se.lvl} / ${SEASON_LEVELS}</b></div>
    ${se.lvl < SEASON_LEVELS ? `${bar('', into, SEASON_STEP)}<div class="muted" style="font-size:13px;text-align:right">${into} / ${SEASON_STEP} puntos</div>${next.join('')}` : '<p class="center" style="color:var(--accent)">✔ ¡Pase completo! Campeón de esta temporada.</p>'}
    <details><summary class="muted" style="font-size:14px">¿Cómo sumo puntos?</summary>
      <p style="font-size:14px">Diaria 100 · Jefe semanal 150 · Mazmorra 80 · Rutina 60 · Misión secreta 50 · Emergencia 50 · Prueba 40 · Secundaria 20 · Diario 20 · Encargo 15.<br>Cada mes empieza una temporada nueva desde cero.</p></details>
  </div>`;
}

/* ================= AVATAR ================= */

const rankIndex = () => RANKS.filter(([lv]) => S.level >= lv).length - 1;

// Layered silhouette that grows with rank: aura, weapon, cape, glowing eyes, crown, flames.
function avatarSVG(i = rankIndex(), size = 120) {
  const v = S.theme === 'varka';
  const c = (v ? ['#8fb5ad', '#4fd1b4', '#7fe0c8', '#e8c46a', '#f0a35e', '#fff1c9', '#ffd36b'] : ['#7f8ea3', '#3fb6ff', '#46d39a', '#ffd36b', '#ff7a59', '#b48cff', '#8b5cff'])[i];
  const id = 'av' + i + (v ? 'v' : '');
  return `<svg viewBox="0 0 120 140" width="${size}" height="${size * 140 / 120}" xmlns="http://www.w3.org/2000/svg" aria-label="Avatar">
    <defs><radialGradient id="${id}" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="${c}" stop-opacity="${0.15 + i * 0.1}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs>
    <circle cx="60" cy="72" r="58" fill="url(#${id})"/>
    ${i >= 6 ? [0, 1, 2, 3, 4, 5, 6].map((k) => `<path d="M${18 + k * 14} 128 Q${22 + k * 14} ${92 - (k % 3) * 10} ${26 + k * 14} 128 Z" fill="${c}" opacity=".55"/>`).join('') : ''}
    ${i >= 3 ? `<path d="M34 78 Q60 70 86 78 L100 134 L20 134 Z" fill="${c}" opacity=".35"/>` : ''}
    <path d="M30 134 Q30 84 60 76 Q90 84 90 134 Z" fill="#0b1424" stroke="${c}" stroke-width="2"/>
    ${!v && i < 3 ? `<path d="M40 50 Q40 22 60 22 Q80 22 80 50 Q80 64 60 66 Q40 64 40 50 Z" fill="#0b1424" stroke="${c}" stroke-width="2"/>` : ''}
    <circle cx="60" cy="47" r="15" fill="#0b1424" stroke="${c}" stroke-width="2"/>
    ${v && i >= 1 ? `<path d="M45 44 Q60 26 75 44 L75 50 L45 50 Z" fill="#0b1424" stroke="${c}" stroke-width="2"/>` : ''}
    ${i >= 4 ? `<ellipse cx="54" cy="48" rx="3" ry="1.6" fill="${c}"/><ellipse cx="66" cy="48" rx="3" ry="1.6" fill="${c}"/>` : ''}
    ${i >= 2 ? (v ? `<path d="M92 132 L100 62 L104 62 L98 132 Z" fill="${c}"/><rect x="94" y="88" width="14" height="3" fill="${c}"/>`
      : `<path d="M86 112 L104 82 L107 84 L90 114 Z" fill="${c}"/><rect x="84" y="111" width="8" height="3" transform="rotate(-58 88 112)" fill="${c}"/>`) : ''}
    ${i >= 5 ? (v ? `<path d="M60 30 Q70 14 82 20 Q70 22 64 32 Z" fill="${c}"/>`
      : `<path d="M46 34 L50 22 L55 31 L60 18 L65 31 L70 22 L74 34 Z" fill="${c}"/>`) : ''}
  </svg>`;
}

function viewAvatar() {
  return `<div class="win" style="display:flex;align-items:center;gap:14px">
    <div style="flex:none">${avatarSVG()}</div>
    <div><div class="label">${S.theme === 'varka' ? 'Caballero' : 'Cazador'}</div>
      <div style="font-size:24px;font-weight:700">${esc(S.name)}</div>
      <div class="muted">Rango <b class="gold">${rank()}</b></div>
      <div class="muted" style="font-size:13px">${rankIndex() < RANKS.length - 1 ? `Nueva apariencia en nivel ${RANKS[rankIndex() + 1][0]}` : 'Apariencia máxima'}</div></div>
  </div>`;
}
