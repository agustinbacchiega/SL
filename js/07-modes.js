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

/* ================= CONSTELLATION ================= */

// Your own constellation: six stars unlocked in order by personal milestones.
const CONSTELLATION = [
  { name: ['Primer Destello', 'Brisa del Alba'], req: '30 misiones diarias completadas', prog: () => [S.totalDaily, 30],
    desc: 'La misión diaria otorga +15% de XP.' },
  { name: ['Pulso del Cazador', 'Filo del Oeste'], req: 'Alcanzar el nivel 25', prog: () => [S.level, 25],
    desc: '+1 ranura de habilidad.' },
  { name: ['Segunda Oportunidad', 'Juramento Inquebrantable'], req: 'Derrotar 6 jefes semanales', prog: () => [S.bossKills || 0, 6],
    desc: 'Una vez por semana, si no completás la diaria, no hay castigo y la racha no se rompe.' },
  { name: ['Ojo del Cazador', 'Mirada del Explorador'], req: 'Mejor racha de 30 días', prog: () => [S.bestStreak, 30],
    desc: 'Los eventos aleatorios aparecen más seguido (+15%) y las mazmorras raras son más probables.' },
  { name: ['Forja Interior', 'Forja de Mondstadt'], req: '75 rutinas completadas', prog: () => [S.routineLog.length, 75],
    desc: 'Cada nivel otorga 4 puntos de habilidad en lugar de 3.' },
  { name: ['Monarca de Su Propia Estrella', 'Estrella del Viento Libre'], req: 'Mejor racha de 100 días', prog: () => [S.bestStreak, 100],
    desc: 'Toda la XP +10%. Además, cada misión diaria tiene 25% de activar la <b>Resonancia Estelar</b>: todas sus recompensas se duplican (XP, oro, caja, puntos de habilidad y 💎). Tu nombre brilla en dorado.' },
];
const cons = () => S.cons || 0;
const consName = (i) => CONSTELLATION[i].name[S.theme === 'varka' ? 1 : 0];
const apPerLevel = () => (cons() >= 5 ? 4 : 3);

function checkConstellation() {
  if (!S.awakened || !S.profile) return;
  while (cons() < 6) {
    const [have, need] = CONSTELLATION[cons()].prog();
    if (have < need) break;
    S.cons = cons() + 1;
    const c = CONSTELLATION[cons() - 1];
    notify('Constelación', `✦ Se encendió una estrella de tu constelación ✦\n\n<b>C${cons()} · ${consName(cons() - 1)}</b>\n\n${c.desc}`);
    if (cons() === 2) ensureEquipped();
  }
}

// Weekly shield from C3: returns true when it absorbed a missed day.
function consShield() {
  if (cons() < 3 || S.consShield === weekStart()) return false;
  S.consShield = weekStart();
  notify('Constelación', `<b>C3 · ${consName(2)}</b>\n\nNo completaste la misión diaria, pero tu constelación te protegió.\nSin castigo y tu racha sigue intacta.\n\nSe recarga el lunes.`);
  return true;
}

function resonance(xp, g) {
  if (cons() < 6 || Math.random() >= 0.25) return '';
  const xp2 = gainXP(xp, 'daily');
  const g2 = gainGold(g);
  addItem('box'); S.ap += 3; gainProto(60);
  return `\n\n✨ <b>Resonancia Estelar</b> ✨\nRecompensas duplicadas: XP +${xp2} · Oro +${g2} · Caja · +3 puntos`;
}

function viewConstellation() {
  const pts = [[30, 80], [80, 40], [135, 70], [185, 25], [240, 60], [285, 30]];
  const lit = cons();
  const svg = `<svg viewBox="0 0 315 110" class="cons-map" role="img" aria-label="Constelación C${lit}">
    ${pts.slice(1).map(([x, y], i) => `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${x}" y2="${y}" class="${i + 1 < lit ? 'on' : ''}"/>`).join('')}
    ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 5 ? 9 : 7}" class="${i < lit ? 'on' : ''}"/><text x="${x}" y="${y + 24}" text-anchor="middle">C${i + 1}</text>`).join('')}
  </svg>`;
  return `<div class="win"><div class="win-title">Constelación</div>
    <p class="center muted" style="margin-top:0;font-size:14px">${esc(S.name)} · <b class="gold">C${lit}</b> de 6</p>
    ${svg}
    ${CONSTELLATION.map((c, i) => {
      const on = i < lit, next = i === lit;
      const [have, need] = c.prog();
      return `<div style="padding:8px 0;border-bottom:1px dashed rgba(63,182,255,.25);${on || next ? '' : 'opacity:.55'}">
        <div class="row"><b>${on ? '✦' : '✧'} C${i + 1} · ${consName(i)}</b>${on ? '<span class="tag">Activa</span>' : ''}</div>
        <div style="font-size:14px;margin-top:2px">${c.desc}</div>
        ${on ? '' : `<div class="muted" style="font-size:13px;margin-top:3px">Requisito: ${c.req}${next ? ` · ${Math.min(have, need)} / ${need}` : i > lit ? ' (requiere la anterior)' : ''}</div>${next ? bar('', Math.min(have, need), need) : ''}`}
      </div>`;
    }).join('')}
  </div>`;
}

/* ================= WEEKLY REQUEST (Varka theme) ================= */

// One request per week from someone in Mondstadt. Not only training: social,
// creative, habits, adventure. Honor-based, like the rest of the app.
const WEEKLY_REQUESTS = [
  ['Diluc', 'Dueño del Viñedo del Amanecer', 'No es de muchas palabras, pero sabe que los lazos se cuidan.', 'Visitá o llamá a alguien con quien no hablás hace tiempo.', 'social'],
  ['Klee', 'Caballero Chispeante', '¡Klee quiere ver algo que hayas creado vos!', 'Dedicá 30 minutos a crear algo: dibujar, cocinar una receta nueva, armar algo con tus manos.', 'creativo'],
  ['Mona', 'Astróloga', 'Las estrellas ayudan, pero un plan escrito ayuda más.', 'Escribí un plan para la semana que viene: objetivos, horarios y comidas.', 'hábitos'],
  ['Fischl', 'Princesa del Juicio', '¡Mi narrador real necesita nuevas crónicas!', 'Escribí una página: un cuento, un poema o una carta.', 'creativo'],
  ['Bennett', 'Líder del Club Benny', 'Todo aventurero empieza con algo nuevo, ¡aunque salga mal!', 'Probá un deporte o una actividad física que nunca hayas hecho.', 'aventura'],
  ['Razor', 'Chico lobo de Wolvendom', 'Bosque. Aire. Lupical. Bueno.', 'Pasá al menos 1 hora en la naturaleza: parque, plaza grande, montaña o playa.', 'aventura'],
  ['Sucrose', 'Alquimista', 'La curiosidad es el primer paso de todo experimento.', 'Dedicá 1 hora a aprender algo nuevo que te interese.', 'mente'],
  ['Rosaria', 'Hermana de la Iglesia de Favonius', 'No me gusta el ruido. Probá el silencio.', 'Pasá una noche entera sin redes sociales.', 'hábitos'],
  ['Mika', 'Cartógrafo de la expedición', 'Todo mapa empieza caminando por donde nunca fuiste.', 'Caminá 5 km por una zona que no conozcas.', 'aventura'],
  ['Lisa', 'Bibliotecaria de los Caballeros', 'Querido, esos libros no se van a leer solos.', 'Leé 50 páginas en la semana.', 'mente'],
  ['Kaeya', 'Capitán de Caballería', 'Una buena comida es mejor estrategia de lo que parece.', 'Cocinate algo saludable que nunca hayas preparado.', 'hábitos'],
  ['Noelle', 'Sirvienta de los Caballeros', '¡Un caballero empieza por cuidar su propio hogar!', 'Hacé una limpieza a fondo de un ambiente de tu casa.', 'hábitos'],
  ['Jean', 'Gran Maestra en funciones', 'Proteger Mondstadt también es ayudar a quien lo necesita.', 'Ayudá a alguien con algo que le cueste.', 'social'],
  ['Eula', 'Capitana de Reconocimiento', 'La gracia también es fuerza. Lo anotaré en mi libro de venganza si no lo hacés.', 'Hacé 3 sesiones de 20 minutos de movilidad, yoga o baile.', 'cuerpo'],
  ['Albedo', 'Alquimista Jefe', 'Un espacio ordenado es una mente ordenada.', 'Ordená tu escritorio y tus archivos digitales.', 'hábitos'],
  ['Venti', 'Bardo errante', '¡Una canción por un vaso de... jugo de manzana!', 'Escuchá un álbum completo sin hacer otra cosa, o aprendé una canción.', 'creativo'],
  ['Amber', 'Exploradora', '¡Desde arriba todo se ve mejor!', 'Subí a un lugar alto con buena vista: un cerro, una terraza o un mirador.', 'aventura'],
  ['Diona', 'Barman del Cola de Gato', 'El alcohol arruina a los caballeros. ¡Es mi misión destruir la industria del vino!', 'Pasá la semana sin alcohol ni bebidas azucaradas.', 'hábitos'],
  ['Barbara', 'Diaconisa e ídolo de Mondstadt', '¡Dormir bien también es cuidarse!', 'Dormí 7 horas o más durante 5 noches esta semana.', 'hábitos'],
  ['Dahlia', 'Diácono de la Iglesia', 'A veces la mejor ayuda es escuchar.', 'Tené una conversación larga y sin pantallas con alguien.', 'social'],
];

function ensureWeeklyRequest() {
  if (S.theme !== 'varka' || !S.profile) return;
  const wk = weekStart();
  if (S.wreq && S.wreq.week === wk) return;
  const prev = S.wreq ? S.wreq.idx : -1;
  let idx;
  do idx = Math.floor(Math.random() * WEEKLY_REQUESTS.length); while (idx === prev);
  S.wreq = { week: wk, idx, done: false, rerolled: false };
  save();
}

function rerollWeeklyRequest() {
  const w = S.wreq;
  if (!w || w.done || w.rerolled) return;
  let idx;
  do idx = Math.floor(Math.random() * WEEKLY_REQUESTS.length); while (idx === w.idx);
  w.idx = idx; w.rerolled = true;
  save(); render();
}

function completeWeeklyRequest() {
  const w = S.wreq;
  if (!w || w.done) return;
  w.done = true;
  const [who] = WEEKLY_REQUESTS[w.idx];
  S.friends = S.friends || {};
  S.friends[who] = (S.friends[who] || 0) + 1;
  S.wreqDone = (S.wreqDone || 0) + 1;
  gainProto(160);
  const xp = gainXP(300);
  addItem('box');
  hitBoss('secret');
  dayLog().wreq = who;
  notify('Petición Semanal', `"¡Gracias! Mondstadt tiene suerte de tenerte."\n— ${who}\n\nRecompensas:\n• XP +${xp}\n• Cofre de Mondstadt ×1\n• Amistad con ${who}: ${S.friends[who]}`);
  save(); render();
}

function viewWeeklyRequest() {
  if (S.theme !== 'varka') return '';
  ensureWeeklyRequest();
  const w = S.wreq;
  if (!w) return '';
  const [who, role, quote, task, kind] = WEEKLY_REQUESTS[w.idx];
  const end = new Date(w.week + 'T00:00'); end.setDate(end.getDate() + 7);
  const days = Math.ceil((end - Date.now()) / 864e5);
  return `<div class="win"><div class="win-title">Petición Semanal</div>
    <p class="center" style="margin-top:0"><b>${who}</b><br><span class="muted" style="font-size:14px">${role}</span></p>
    <p style="font-style:italic;font-size:15px">"${quote}"</p>
    <p style="margin:6px 0"><b>${task}</b> <span class="tag">${kind}</span></p>
    <p class="muted" style="font-size:13px;margin:4px 0">Recompensa: 300 XP · 160 💎 · Cofre · +1 amistad con ${who}${w.done ? '' : ` · Quedan ${days} día${days === 1 ? '' : 's'}`}</p>
    ${w.done ? `<p class="center" style="color:var(--accent)">✔ Completada · Amistad con ${who}: ${S.friends[who]}</p>`
      : `<button class="btn block" id="wreqDone">Completada</button>
         ${w.rerolled ? '' : '<button class="btn block small" id="wreqReroll" style="opacity:.8">Pedir otra petición (1 vez por semana)</button>'}`}
    ${S.wreqDone ? `<p class="center muted" style="font-size:13px;margin:6px 0 0">Peticiones completadas: ${S.wreqDone}</p>` : ''}
  </div>`;
}
