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
  body: { name: 'Cuerpo Despertado', desc: 'Alcanzaste tu peso objetivo.', bonus: 'Todas las estadísticas se sienten más ligeras (XP +10%)' },
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
  { name: 'Mazmorra de rango E', boss: 'Lycan de Colmillos de Acero', xp: 150, m: 1 },
  { name: 'Mazmorra de rango D', boss: 'Kasaka, la Serpiente Venenosa', xp: 200, m: 1.5 },
  { name: 'Mazmorra de rango C', boss: 'Caballero Sangriento Igris', xp: 250, m: 2 },
  { name: 'Mazmorra de rango B', boss: 'Cerbero, Guardián del Castillo', xp: 300, m: 2.5 },
  { name: 'Mazmorra de rango A', boss: 'Vulcan, Señor de los Demonios', xp: 350, m: 3 },
  { name: 'Castillo del Demonio', boss: 'Baran, el Rey Demonio', xp: 500, m: 4 },
];

// [name, base amount, unit, type, injuries to avoid]
const EX_POOL = [
  ['Burpees', 10, 'rep', 'cardio', ['knee', 'shoulder']],
  ['Saltos de tijera', 40, 'rep', 'cardio', ['knee']],
  ['Mountain climbers', 30, 'rep', 'cardio', ['shoulder']],
  ['Rodillas al pecho', 30, 'sec', 'cardio', ['knee']],
  ['Boxeo de sombra', 60, 'sec', 'cardio', []],
  ['Caminata rápida', 300, 'sec', 'cardio', []],
  ['Zancadas', 20, 'rep', 'str', ['knee']],
  ['Flexiones', 15, 'rep', 'str', ['shoulder']],
  ['Puente de glúteo', 20, 'rep', 'str', []],
  ['Superman', 15, 'rep', 'str', ['back']],
  ['Elevación de talones', 30, 'rep', 'str', []],
  ['Sentadilla isométrica en pared', 40, 'sec', 'str', ['knee']],
  ['Dead bug', 16, 'rep', 'core', []],
  ['Abdominales bicicleta', 20, 'rep', 'core', ['back']],
  ['Plancha', 45, 'sec', 'core', ['shoulder']],
  ['Plancha lateral (cada lado)', 30, 'sec', 'core', ['shoulder']],
];

function makeDungeon(tier) {
  const D = DUNGEONS[tier];
  const a = S.profile ? S.profile.answers : {};
  const pool = EX_POOL.filter((e) => !e[4].includes(a.injury));
  const prefer = { fat: 'cardio', endurance: 'cardio', muscle: 'str', recomp: 'str' }[a.goal];
  const weighted = pool.flatMap((e) => (e[3] === prefer ? [e, e, e] : [e]));
  const picked = [];
  while (picked.length < 2) {
    const e = weighted[Math.floor(Math.random() * weighted.length)];
    if (!picked.includes(e)) picked.push(e);
  }
  const timed = pool.filter((e) => e[2] === 'sec' && !picked.includes(e));
  const boss = timed[Math.floor(Math.random() * timed.length)];
  const step = (e, mult) => {
    const n = e[2] === 'sec' ? Math.round((e[1] * D.m * mult) / 15) * 15 : Math.round(e[1] * D.m * mult);
    return { name: e[0], n, unit: e[2], done: false };
  };
  return { name: D.name, boss: D.boss, xp: D.xp, steps: [step(picked[0], 1), step(picked[1], 1), step(boss, 1.5)], run: null, done: false };
}

const stepText = (st) => (st.unit === 'sec' ? `${st.name}: ${fmtMin(st.n)}` : `${st.n} × ${st.name}`);
const fmtMin = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

// Routines: [exercise, amount, 'rep'|'sec', injuries to avoid, substitute]
const ROUTINES = {
  despertar: { name: 'Despertar', sub: 'Cuerpo completo · principiante', stat: 'vit', rest: 60, scale: 'str', ex: [
    ['Sentadillas', 10, 'rep', ['knee'], 'Puente de glúteo'],
    ['Flexiones con rodillas apoyadas', 8, 'rep', ['shoulder'], 'Flexiones en pared'],
    ['Puente de glúteo', 12, 'rep', [], null],
    ['Plancha', 20, 'sec', ['shoulder'], 'Dead bug lento'],
    ['Bird dog (cada lado)', 8, 'rep', [], null],
    ['Caminata en el lugar', 120, 'sec', [], null]] },
  igris: { name: 'Arsenal de Igris', sub: 'Fuerza · tren superior', stat: 'str', rest: 60, scale: 'str', ex: [
    ['Flexiones', 12, 'rep', ['shoulder'], 'Flexiones en pared'],
    ['Remo invertido bajo una mesa', 10, 'rep', ['back'], 'Remo con mochila a una mano'],
    ['Fondos en silla', 10, 'rep', ['shoulder'], 'Extensión de tríceps con mochila'],
    ['Flexiones pica', 8, 'rep', ['shoulder'], 'Elevaciones laterales con botellas'],
    ['Flexiones diamante', 8, 'rep', ['shoulder'], 'Curl de bíceps con mochila'],
    ['Plancha', 40, 'sec', ['shoulder'], 'Dead bug lento']] },
  lobo: { name: 'Pasos del Lobo', sub: 'Fuerza · piernas y glúteos', stat: 'agi', rest: 60, scale: 'str', ex: [
    ['Sentadillas', 20, 'rep', ['knee'], 'Puente de glúteo'],
    ['Zancadas alternas', 12, 'rep', ['knee'], 'Puente de glúteo a una pierna'],
    ['Sentadilla búlgara (cada pierna)', 8, 'rep', ['knee'], 'Patada de glúteo en cuadrupedia'],
    ['Puente de glúteo', 15, 'rep', [], null],
    ['Elevación de talones', 25, 'rep', [], null],
    ['Sentadilla isométrica en pared', 40, 'sec', ['knee'], 'Abducción de cadera acostado']] },
  nucleo: { name: 'Núcleo de Sombra', sub: 'Core y estabilidad', stat: 'vit', rest: 30, scale: 'str', ex: [
    ['Plancha', 40, 'sec', ['shoulder'], 'Dead bug lento'],
    ['Dead bug', 12, 'rep', [], null],
    ['Abdominales bicicleta', 20, 'rep', ['back'], 'Bird dog (cada lado)'],
    ['Plancha lateral (cada lado)', 25, 'sec', ['shoulder'], 'Pallof con toalla'],
    ['Elevación de piernas', 12, 'rep', ['back'], 'Marcha en el suelo (dead bug)'],
    ['Superman', 12, 'rep', ['back'], 'Bird dog (cada lado)']] },
  kasaka: { name: 'Persecución de Kasaka', sub: 'HIIT · quema de grasa', stat: 'agi', rest: 20, scale: 'run', ex: [
    ['Saltos de tijera', 40, 'sec', ['knee'], 'Paso lateral con brazos arriba'],
    ['Mountain climbers', 30, 'sec', ['shoulder'], 'Rodillas al pecho de pie'],
    ['Burpees', 30, 'sec', ['knee', 'shoulder'], 'Boxeo de sombra'],
    ['Rodillas al pecho', 30, 'sec', ['knee'], 'Boxeo de sombra'],
    ['Sentadilla con salto', 30, 'sec', ['knee'], 'Puñetazos rápidos de pie'],
    ['Boxeo de sombra', 45, 'sec', [], null]] },
  legion: { name: 'Marcha de la Legión', sub: 'Resistencia · cardio', stat: 'vit', rest: 0, scale: 'run', sets: 1, ex: [
    ['Trote suave', 600, 'sec', ['knee'], 'Caminata rápida'],
    ['Intervalos 1 min rápido / 1 min suave', 480, 'sec', ['knee'], 'Intervalos caminando rápido / lento'],
    ['Escaleras o step', 180, 'sec', ['knee'], 'Caminata en pendiente'],
    ['Caminata de recuperación', 300, 'sec', [], null]] },
  tank: { name: 'Fortaleza de Tank', sub: 'Hipertrofia · volumen', stat: 'str', rest: 90, scale: 'str', ex: [
    ['Flexiones lentas (3 s bajando)', 10, 'rep', ['shoulder'], 'Flexiones en pared lentas'],
    ['Sentadillas lentas (3 s bajando)', 15, 'rep', ['knee'], 'Puente de glúteo con pausa'],
    ['Remo con mochila a una mano', 12, 'rep', ['back'], 'Face pull con toalla'],
    ['Zancada inversa', 10, 'rep', ['knee'], 'Puente de glúteo a una pierna'],
    ['Fondos en silla', 12, 'rep', ['shoulder'], 'Extensión de tríceps con mochila'],
    ['Superman con pausa', 12, 'rep', ['back'], 'Bird dog (cada lado)']] },
  monarca: { name: 'Respiración del Monarca', sub: 'Movilidad · recuperación', stat: 'per', rest: 0, scale: null, sets: 1, ex: [
    ['Gato-vaca', 60, 'sec', [], null],
    ['Estiramiento de cadera (cada lado)', 45, 'sec', [], null],
    ['Estiramiento de isquiotibiales', 45, 'sec', [], null],
    ['Apertura de pecho en pared', 45, 'sec', [], null],
    ['Postura del niño', 60, 'sec', [], null],
    ['Respiración 4-7-8', 120, 'sec', [], null]] },
};

const GOAL_ROUTINES = {
  fat: ['kasaka', 'lobo', 'legion', 'nucleo', 'igris'],
  muscle: ['igris', 'lobo', 'tank', 'nucleo'],
  recomp: ['igris', 'kasaka', 'lobo', 'nucleo', 'tank'],
  endurance: ['legion', 'kasaka', 'lobo', 'nucleo'],
  health: ['despertar', 'legion', 'nucleo', 'lobo'],
};
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const TRAIN_DAYS = [[0, 2, 4], [0, 2, 4], [0, 1, 3, 4], [0, 1, 2, 4, 5]];

function recommended() {
  const a = S.profile.answers;
  let list = [...GOAL_ROUTINES[a.goal]];
  if ((a.pushups === '0' || a.activity === '0') && list[0] !== 'despertar') list = ['despertar', ...list.filter((r) => r !== 'despertar')];
  return list;
}

function weekPlan() {
  const rec = recommended();
  const days = TRAIN_DAYS[+S.profile.answers.activity];
  return DAYS.map((d, i) => {
    const k = days.indexOf(i);
    return k >= 0 ? rec[k % rec.length] : i === 6 ? 'monarca' : null;
  });
}

function buildRoutine(id) {
  const R = ROUTINES[id], a = S.profile.answers;
  const lvl = R.scale === 'run' ? +a.run : R.scale === 'str' ? +a.pushups : 1;
  const f = R.scale ? [0.6, 0.8, 1, 1.3][lvl] : 1;
  const count = Math.min(R.ex.length, { 15: 3, 30: 4, 45: 5, 60: 6 }[a.time]);
  const sets = R.sets || [2, 3, 3, 4][lvl];
  const ex = R.ex.slice(0, count).map(([n, amt, unit, avoid, sub]) => {
    const swap = avoid.includes(a.injury) && sub;
    const v = unit === 'sec' ? Math.max(15, Math.round((amt * f) / 5) * 5) : Math.max(4, Math.round(amt * f));
    return { name: swap ? sub : n, adapted: !!swap, v, unit };
  });
  const work = ex.reduce((t, e) => t + (e.unit === 'sec' ? e.v : e.v * 3), 0);
  const mins = Math.max(5, Math.round((sets * (work + ex.length * R.rest)) / 60));
  return { ...R, id, sets, ex, mins };
}

const routineDone = (id) => S.routineLog.some((r) => r.date === today() && r.id === id);

function completeRoutine(id) {
  if (routineDone(id)) return;
  S.routineLog.push({ date: today(), id });
  dayLog().routines = pushUnique(dayLog().routines || [], id);
  const R = ROUTINES[id];
  const xp = gainXP(id === 'monarca' ? 30 : 60);
  decayFatigue();
  if (id === 'monarca') S.fatigue = Math.max(0, S.fatigue - 30);
  else S.fatigue = Math.min(100, S.fatigue + 15);
  const week = S.routineLog.filter((r) => Date.now() - new Date(r.date) < 7 * 864e5).length;
  notify('Entrenamiento Completado', `[${R.name}]\n\nXP +${xp}\n${id === 'monarca' ? 'Fatiga -30' : 'Fatiga +15'}\n\nRutinas esta semana: ${week}`);
  save(); render();
}

function routineCard(id, open) {
  const r = buildRoutine(id);
  const done = routineDone(id);
  return `<details class="routine" ${open ? 'open' : ''}><summary>
      <b>${r.name}</b> ${done ? '<span class="check">✔</span>' : ''}<span class="tag">${STATS[r.stat][1]}</span>
      <div class="desc muted">${r.sub} · ~${r.mins} min</div></summary>
    <p class="muted" style="font-size:14px;margin:6px 0">${r.sets > 1 ? `${r.sets} ${id === 'kasaka' ? 'rondas' : 'series'}` : '1 vuelta'}${r.rest ? ` · descanso ${r.rest} s entre ejercicios` : ''}</p>
    ${r.ex.map((e) => `<div class="goal"><span class="name">${e.name}${e.adapted ? ' <span class="tag">adaptado</span>' : ''}</span>
      ${e.unit === 'sec'
        ? `<button class="btn small" data-rest="${e.v}" data-label="${esc(e.name)}">⏱ ${fmtMin(e.v)}</button>`
        : `<span class="count">${e.v} reps</span>`}</div>`).join('')}
    ${r.rest ? `<div class="row" style="justify-content:center;margin-top:8px"><button class="btn small" data-rest="${r.rest}">Descanso ${r.rest}s</button></div>` : ''}
    ${done ? '<p class="center" style="color:var(--accent)">✔ Completada hoy</p>' : `<button class="btn block" data-routine="${id}">Completar rutina</button>`}
  </details>`;
}

function viewRoutines() {
  const plan = weekPlan();
  const ti = (new Date().getDay() + 6) % 7;
  const todayId = plan[ti];
  const rec = recommended();
  const a = S.profile.answers;
  return `<div class="win"><div class="win-title">Plan Semanal</div>
    <p class="center muted" style="margin-top:0;font-size:15px">Objetivo: <b>${GOALS[a.goal]}</b> · ${TRAIN_DAYS[+a.activity].length} días de entrenamiento${a.injury !== 'none' ? ' · ejercicios adaptados a tu lesión' : ''}</p>
    ${plan.map((id, i) => `<div class="row" style="padding:5px 8px;${i === ti ? 'border:1px solid var(--line);border-radius:4px;box-shadow:0 0 8px var(--glow)' : ''}">
      <span class="label">${DAYS[i]}</span><span>${id ? ROUTINES[id].name : '<span class="muted">Descanso</span>'}${id && routineDone(id) ? ' ✔' : ''}</span></div>`).join('')}
  </div>
  <div class="win"><div class="win-title">Entrenamiento de Hoy</div>
    ${todayId ? routineCard(todayId, true) : `<p class="center">Hoy es día de descanso.<br><span class="muted">La misión diaria sigue activa. Si querés moverte, hacé <b>Respiración del Monarca</b>.</span></p>`}
    <p class="center timer" id="rest" style="min-height:1.2em">${rest ? `${rest.label || 'Descanso'}: ${Math.ceil((rest.end - Date.now()) / 1000)} s` : ''}</p>
  </div>
  <div class="win"><div class="win-title">Recomendadas</div>
    ${rec.filter((id) => id !== todayId).map((id) => routineCard(id)).join('')}
    ${todayId !== 'monarca' ? routineCard('monarca') : ''}
  </div>
  <div class="win"><div class="win-title">Otras Rutinas</div>
    ${Object.keys(ROUTINES).filter((id) => !rec.includes(id) && id !== 'monarca' && id !== todayId).map((id) => routineCard(id)).join('')}
  </div>`;
}

// Hidden theme: Knights of Favonius (Varka, Genshin Impact). Pure text/color reskin;
// mechanics and saved progress are shared with the default System theme.
const VARKA = [
  ['la misión diaria', 'el entrenamiento de Favonius'],
  ['La misión diaria', 'El entrenamiento de Favonius'],
  ['Preparativos para volverse poderoso', 'Régimen del Gran Maestro Varka'],
  ['[Entrenamiento de fuerza]', '[Orden de entrenamiento de Favonius]'],
  ['Misión de Castigo: Sobrevivir', 'Castigo: Guardia en la muralla'],
  ['Misión de Cambio de Clase', 'Prueba de Ascenso'],
  ['Misiones Secundarias', 'Encargos del Gremio'],
  ['Misión Secundaria', 'Encargo del Gremio'],
  ['Misión Secreta', 'Hazaña Oculta'],
  ['Misión Diaria', 'Entrenamiento de Favonius'],
  ['misión diaria', 'entrenamiento de Favonius'],
  ['Misiones', 'Encargos'],
  ['Zona de Castigo', 'Guardia de Castigo'],
  ['Llave de Mazmorra Instantánea', 'Llave de Dominio'],
  ['Mazmorra Instantánea', 'Dominio'],
  ['Mazmorras Instantáneas', 'Dominios'],
  ['Mazmorra Despejada', 'Dominio Superado'],
  ['Mazmorra despejada', 'Dominio superado'],
  ['Mazmorra de rango', 'Dominio de rango'],
  ['mazmorras', 'dominios'], ['mazmorra', 'dominio'], ['Mazmorra', 'Dominio'],
  ['Castillo del Demonio', 'Templo del Lobo del Norte'],
  ['Lycan de Colmillos de Acero', 'Mitachurl con escudo'],
  ['Kasaka, la Serpiente Venenosa', 'Lawachurl de Piedra'],
  ['Caballero Sangriento Igris', 'Heraldo del Abismo'],
  ['Cerbero, Guardián del Castillo', 'Hipóstasis Anemo'],
  ['Vulcan, Señor de los Demonios', 'Dvalin, el Dragón del Viento'],
  ['Baran, el Rey Demonio', 'Andrius, Señor de los Lobos'],
  ['Arsenal de Igris', 'Mandoble del Gran Maestro'],
  ['Pasos del Lobo', 'Carrera de Boreas'],
  ['Núcleo de Sombra', 'Postura del Caballero'],
  ['Persecución de Kasaka', 'Patrulla del Bosque Susurrante'],
  ['Marcha de la Legión', 'La Expedición de Varka'],
  ['Fortaleza de Tank', 'Escudo de Favonius'],
  ['Respiración del Monarca', 'Brisa de Mondstadt'],
  ['>Despertar<', '>Recluta de Favonius<'],
  ['Monarca de las Sombras', 'Gran Maestro de Favonius'],
  ['Extracción de Sombras', 'Bendición del Viento del Oeste'],
  ['¡LEVÁNTATE!', '¡POR MONDSTADT!'],
  ['Ejército de sombras', 'Caballeros reclutados'],
  ['se ha unido a tu ejército', 'se ha unido a la Orden'],
  ['La sombra', 'El caballero'],
  ['Nigromante', 'Capitán de Caballería'],
  ['Caja Aleatoria', 'Cofre de Mondstadt'],
  ['Jugador', 'Caballero'],
  ['Notificación', 'Mensaje de la Orden'],
  ['ADVERTENCIA', 'AVISO DE LA ORDEN'],
  ['Sistema', 'Orden'],
  ['Tienda', 'Mercado'],
];

function themed(html) {
  if (S.theme !== 'varka') return html;
  for (const [a, b] of VARKA) html = html.split(a).join(b);
  return html.replace(/\b([Oo])ro\b/g, 'Mora');
}

const BLOCK_MODES = { none: 'Solo por honor', ios: 'iPhone (Atajos)', android: 'Android (Bienestar Digital)' };

const QUESTIONS = [
  { id: 'sex', q: 'Sexo biológico', hint: 'Solo se usa para estimar tu metabolismo.', opts: [['m', 'Hombre'], ['f', 'Mujer'], ['x', 'Prefiero no decir']] },
  { id: 'age', q: 'Edad', num: [10, 100], unit: 'años' },
  { id: 'height', q: 'Altura', num: [100, 230], unit: 'cm' },
  { id: 'weight', q: 'Peso actual', num: [30, 300], unit: 'kg', step: 0.1 },
  { id: 'goalWeight', q: 'Peso objetivo', num: [30, 300], unit: 'kg', step: 0.1 },
  { id: 'goal', q: '¿Cuál es tu objetivo principal?', opts: [['fat', 'Perder grasa'], ['muscle', 'Ganar músculo'], ['recomp', 'Recomposición (perder grasa y ganar músculo)'], ['endurance', 'Mejorar resistencia'], ['health', 'Salud general']] },
  { id: 'activity', q: '¿Cuánto ejercicio hacés actualmente?', opts: [['0', 'Nada / sedentario'], ['1', '1 – 2 días por semana'], ['2', '3 – 4 días por semana'], ['3', '5 o más días']] },
  { id: 'pushups', q: '¿Cuántas flexiones seguidas podés hacer?', opts: [['0', '0 – 5'], ['1', '6 – 15'], ['2', '16 – 30'], ['3', 'Más de 30']] },
  { id: 'run', q: '¿Cuánto podés correr sin parar?', opts: [['0', 'No corro'], ['1', 'Hasta 2 km'], ['2', '2 – 5 km'], ['3', 'Más de 5 km']] },
  { id: 'injury', q: '¿Tenés alguna lesión o limitación?', opts: [['none', 'Ninguna'], ['knee', 'Rodillas'], ['back', 'Espalda'], ['shoulder', 'Hombros / muñecas']] },
  { id: 'time', q: '¿Cuánto tiempo podés entrenar por día?', opts: [['15', '15 min'], ['30', '30 min'], ['45', '45 min'], ['60', '1 hora o más']] },
  { id: 'when', q: '¿Cuándo preferís entrenar?', hint: 'El Sistema te avisará si la misión sigue incompleta.', opts: [['morning', 'Mañana'], ['afternoon', 'Tarde'], ['night', 'Noche']] },
];

const GOALS = { fat: 'Perder grasa', muscle: 'Ganar músculo', recomp: 'Recomposición', endurance: 'Resistencia', health: 'Salud general' };
const CANON = { pushups: 100, situps: 100, squats: 100, run: 10 };

function computePlan(a) {
  const w = +a.weight, h = +a.height, age = +a.age;
  const push = +a.pushups, run = +a.run, act = +a.activity;
  const reps = [20, 40, 60, 100][push];
  const tf = { 15: 0.6, 30: 0.8, 45: 1, 60: 1 }[a.time];
  const r5 = (n) => Math.max(10, Math.min(100, Math.round(n / 5) * 5));
  const t = {
    pushups: r5(reps * tf * (a.injury === 'shoulder' ? 0.5 : 1)),
    situps: r5(reps * tf * (a.injury === 'back' ? 0.5 : 1)),
    squats: r5(reps * 1.25 * tf * (a.injury === 'knee' ? 0.6 : 1)),
    run: Math.max(1, Math.min(10, Math.round(([1, 2, 4, 6][run] + (a.goal === 'endurance' ? 1 : 0)) * tf * (a.injury === 'knee' ? 0.5 : 1) * 2) / 2)),
  };
  const bmr = 10 * w + 6.25 * h - 5 * age + { m: 5, f: -161, x: -78 }[a.sex];
  const tdee = bmr * [1.2, 1.375, 1.55, 1.725][act];
  const kcal = Math.round(tdee * { fat: 0.8, muscle: 1.1, recomp: 0.95, endurance: 1, health: 1 }[a.goal] / 10) * 10;
  return {
    targets: t,
    stats: { str: 8 + push * 3, agi: 8 + run * 3, vit: 8 + act * 3, int: 10, per: 10 },
    bmi: w / (h / 100) ** 2,
    bmr: Math.round(bmr), tdee: Math.round(tdee), kcal,
    protein: Math.round(w * { fat: 2, muscle: 1.8, recomp: 2, endurance: 1.4, health: 1.2 }[a.goal]),
    water: Math.round(w * 35 / 100) / 10,
  };
}

const bmiLabel = (b) => (b < 18.5 ? 'Bajo peso' : b < 25 ? 'Normal' : b < 30 ? 'Sobrepeso' : 'Obesidad');

const GOAL_SIDE = {
  fat: [['Caminar 8.000 pasos', 30, 'agi'], ['Un día sin azúcar ni ultraprocesados', 40, 'vit']],
  muscle: [['Llegar a la meta de proteína', 40, 'str'], ['Dormir 8 horas', 30, 'vit']],
  recomp: [['Llegar a la meta de proteína', 40, 'str'], ['Caminar 8.000 pasos', 30, 'agi']],
  endurance: [['10 min de estiramiento / movilidad', 20, 'agi'], ['Dormir 8 horas', 30, 'vit']],
  health: [['10 min de estiramiento / movilidad', 20, 'agi'], ['Meditar 10 minutos', 20, 'per']],
};

const SHADOWS = ['Igris', 'Iron', 'Tank', 'Tusk', 'Beru', 'Bellion', 'Kaisel', 'Greed', 'Jima', 'Fang'];

/* ================= STATE ================= */

const today = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

const freshDaily = (date) => ({ date, progress: { pushups: 0, situps: 0, squats: 0, run: 0 }, claimed: false, dungeon: null, timer: { acc: 0, start: null } });

function defaultState() {
  return {
    v: 1, awakened: false, name: '', level: 1, xp: 0, ap: 0,
    stats: { str: 10, vit: 10, agi: 10, int: 10, per: 10 },
    hp: 100, mp: 10, fatigue: 0, fatigueAt: Date.now(), gold: 0,
    job: 'Ninguno', jobQuest: null, title: null, titles: [], shadows: [],
    inventory: { box: 1 },
    targets: { pushups: 100, situps: 100, squats: 100, run: 10 },
    penaltyTask: '100 burpees',
    block: { hours: 4, apps: 'Instagram, TikTok, YouTube', mode: 'none', shortcut: 'SL Castigo' },
    daily: freshDaily(today()),
    penalty: null, stealthUsed: null,
    streak: 0, bestStreak: 0, totalDaily: 0, dungeons: 0,
    side: [
      { id: 1, name: 'Leer 20 páginas', xp: 30, stat: 'int', done: null },
      { id: 2, name: 'Tomar 2L de agua', xp: 20, stat: 'vit', done: null },
    ],
    sound: true, history: [],
    profile: null, weights: [], routineLog: [], log: null,
    theme: 'sl', themeUnlocked: false,
  };
}

let S = load();
let tab = 'status';
let calMonth = null; // first day of the month shown in the calendar
let calSel = null; // selected YYYY-MM-DD
let evalDraft = null; // { step, answers } while the evaluation is open
let rest = null; // { end } rest countdown

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const st = Object.assign(defaultState(), JSON.parse(raw));
      st.daily.timer = st.daily.timer || { acc: 0, start: null };
      st.block = Object.assign(defaultState().block, st.block);
      if (!st.log) {
        // Build the calendar from what older versions already stored.
        st.log = {};
        const L = (d) => (st.log[d] = st.log[d] || {});
        (st.history || []).forEach((d) => { L(d).daily = true; });
        (st.routineLog || []).forEach((r) => { (L(r.date).routines = L(r.date).routines || []).push(r.id); });
        (st.weights || []).forEach((w) => { L(w.date).weight = w.kg; });
      }
      return st;
    }
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
  n.title = themed(n.title); n.msg = themed(n.msg);
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

function dayLog(d = today()) {
  S.log = S.log || {};
  return (S.log[d] = S.log[d] || {});
}
const pushUnique = (arr, v) => { if (!arr.includes(v)) arr.push(v); return arr; };

function gainXP(base, source) {
  let mult = 1;
  if (S.hp < maxHP() * 0.3 && hasSkill('Tenacidad')) mult += 0.5;
  if (source === 'daily' && titleIs('early')) mult += 0.1;
  if (source === 'daily' && titleIs('iron')) mult += 0.15;
  if (source === 'dungeon' && titleIs('wolf')) mult += 0.4;
  if (source === 'side' && titleIs('beyond')) mult += 0.25;
  if (titleIs('monarch')) mult += 0.25;
  if (titleIs('body')) mult += 0.1;
  const xp = Math.round(base * mult);
  S.xp += xp;
  dayLog().xp = (dayLog().xp || 0) + xp;
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
  dayLog().progress = { ...p };
  if (amount > 0) S.fatigue = Math.min(100, S.fatigue + (k === 'run' ? amount * 4 : amount * 0.15));

  // Beyond limits / job change: double every target
  const doubled = Object.keys(S.targets).every((x) => p[x] >= S.targets[x] * 2);
  if (doubled && !S.daily.secret) {
    S.daily.secret = true;
    dayLog().secret = true;
    const xp = gainXP(150 + S.level * 5, 'daily');
    const g = gainGold(200);
    addItem('box');
    notify('Misión Secreta', `[Misión Secreta: Superar los límites]\n\nHas superado el doble de la misión diaria.\n\nRecompensa oculta:\n• XP +${xp}\n• Oro +${g}\n• Caja Aleatoria ×1`);
    unlockTitle('beyond');
    if (S.jobQuest === 'active') completeJobChange();
  }
  save(); render();
}

function claimDaily() {
  if (S.daily.claimed || !dailyComplete()) return;
  S.daily.claimed = true;
  dayLog().daily = true;
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
  if (S.profile && S.totalDaily % 7 === 0) raiseDifficulty();
  if (new Date().getHours() < 7) unlockTitle('early');
  if (S.streak >= 7) unlockTitle('iron');
  if (S.streak >= 30) unlockTitle('demon');
  save(); render();
}

function raiseDifficulty() {
  const before = JSON.stringify(S.targets);
  for (const k in S.targets) {
    const up = k === 'run' ? Math.round(S.targets[k] * 1.1 * 2) / 2 : Math.round((S.targets[k] * 1.1) / 5) * 5;
    S.targets[k] = Math.min(CANON[k], Math.max(S.targets[k] + (k === 'run' ? 0.5 : 5), up));
  }
  if (JSON.stringify(S.targets) !== before)
    notify('Notificación', 'Tu cuerpo se ha adaptado.\n\nLa dificultad de la misión diaria ha aumentado.\n\n' +
      Object.entries(EXERCISES).map(([k, e]) => `${e.name}: ${S.targets[k]}${e.unit}`).join('\n'));
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
  if (S.awakened && S.daily.date) {
    const prev = dayLog(S.daily.date);
    prev.progress = { ...S.daily.progress };
    prev.targets = { ...S.targets };
    const secs = Math.round(timerSec());
    if (secs) prev.timer = secs;
    if (missed) prev.missed = true;
  }
  if (missed && S.awakened && S.daily.date) {
    S.streak = 0;
    dayLog(t).penalty = true;
    S.penalty = { date: t, until: Date.now() + S.block.hours * 3.6e6, taskDone: false };
    const loss = Math.round(maxHP() * (titleIs('overcame') ? 0.25 : 0.5));
    S.hp = Math.max(1, S.hp - loss);
    S.daily = freshDaily(t);
    notify('ADVERTENCIA', `No has completado la misión diaria.\n\nSerás transportado a la <b>Zona de Castigo</b>.\n\n[Misión de Castigo: Sobrevivir]\nDuración: ${S.block.hours} h\nApps prohibidas: ${esc(S.block.apps || 'ninguna')}\nHP -${loss}`,
      { danger: true, ok: S.block.mode === 'none' ? 'Entendido' : 'Entrar y activar bloqueo', onOk: () => activateBlock() });
  } else {
    S.daily = freshDaily(t);
  }
  if (S.awakened) notify('Misión Diaria', 'La misión diaria [Entrenamiento de fuerza] ha llegado.');
  save();
  return true;
}

const penaltyLeft = () => (S.penalty && S.penalty.until ? Math.max(0, (S.penalty.until - Date.now()) / 1000) : 0);

function activateBlock() {
  if (!S.penalty) return;
  if (S.block.mode === 'ios') {
    const until = new Date(S.penalty.until).toISOString();
    location.href = `shortcuts://run-shortcut?name=${encodeURIComponent(S.block.shortcut)}&input=text&text=${encodeURIComponent(until)}`;
  } else if (S.block.mode === 'android') {
    location.href = 'intent://#Intent;package=com.google.android.apps.wellbeing;end';
  }
}

function checkPenalty() {
  if (S.penalty && S.penalty.taskDone && penaltyLeft() <= 0) clearPenalty();
}

function clearPenalty() {
  S.penalty = null;
  dayLog().survived = true;
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
      S.daily.dungeon = makeDungeon(tier);
      notify('Mazmorra Instantánea', `Has entrado a: <b>${DUNGEONS[tier].name}</b>\n\nDerrota 2 oleadas y al jefe:\n<b>${DUNGEONS[tier].boss}</b>\n\nRecompensa: ${DUNGEONS[tier].xp} XP\nEstá en la pestaña Misiones.`);
    }
  }
  save(); render();
}

function clearDungeon() {
  const d = S.daily.dungeon;
  if (!d || d.done) return;
  d.done = true;
  S.dungeons++;
  dayLog().dungeon = d.boss || d.name;
  const xp = gainXP(d.xp, 'dungeon');
  const g = gainGold(150);
  let msg = `${d.boss ? `Has derrotado a <b>${d.boss}</b>.\n` : ''}Has despejado la mazmorra.\n\nXP +${xp}  ·  Oro +${g}`;
  if (hasSkill('Sed de Sangre')) { addItem('box'); msg += '\nCaja Aleatoria ×1'; }
  if (d.boss && Math.random() < 0.25) { addItem('key'); msg += '\n🗝️ Botín del jefe: Llave de Mazmorra'; }
  notify('Mazmorra Despejada', msg);
  if (S.dungeons >= 3) unlockTitle('wolf');
  save(); render();
}

function dungeonStep(i) {
  const d = S.daily.dungeon;
  if (!d || !d.steps || d.steps[i].done) return;
  d.steps[i].done = true;
  d.run = null;
  if (d.steps.every((st) => st.done)) return clearDungeon();
  if (i === d.steps.length - 2) notify('Notificación', `Oleadas despejadas.\n\nEl jefe <b>${d.boss}</b> ha aparecido.`, { danger: true });
  save(); render();
}

function completeSide(q) {
  if (q.done === today()) return;
  q.done = today();
  dayLog().side = pushUnique(dayLog().side || [], q.name);
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

const fmt = (sec) => {
  const z = (n) => String(n).padStart(2, '0');
  sec = Math.max(0, Math.floor(sec));
  return `${z(Math.floor(sec / 3600))}:${z(Math.floor((sec % 3600) / 60))}:${z(sec % 60)}`;
};
const timerSec = () => {
  const t = S.daily.timer;
  return t.acc + (t.start ? (Date.now() - t.start) / 1000 : 0);
};

function tickTimers() {
  const sw = $('#sw');
  if (sw) sw.textContent = fmt(timerSec());
  const pen = $('#pen');
  if (pen) pen.textContent = fmt(penaltyLeft());
  if (S.penalty && S.penalty.until && penaltyLeft() <= 0 && !S.penalty.notified) {
    S.penalty.notified = true; save();
    notify('Notificación', S.penalty.taskDone ? 'Tiempo cumplido.' : 'El tiempo de castigo terminó.\nCompleta el ejercicio de castigo para salir.', { onOk: checkPenalty });
    render();
  }
  const d = S.daily.dungeon;
  if (d && d.run) {
    const left = (d.run.end - Date.now()) / 1000;
    const el = $('#drun');
    if (left <= 0) { ding(false); if (navigator.vibrate) navigator.vibrate([200, 100, 200]); dungeonStep(d.run.i); }
    else if (el) el.textContent = fmtMin(Math.ceil(left));
  }
  if (!rest) return;
  const left = (rest.end - Date.now()) / 1000;
  const el = $('#rest');
  if (left <= 0) {
    rest = null;
    ding(false); setTimeout(() => ding(false), 350);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    if (el) el.textContent = rest === null ? '¡Tiempo!' : '';
  } else if (el) el.textContent = `${rest.label || 'Descanso'}: ${Math.ceil(left)} s`;
}

function render() {
  document.body.classList.toggle('penalty', !!S.penalty);
  document.body.classList.toggle('varka', S.theme === 'varka');
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.dataset.label = b.dataset.label || b.textContent;
    b.textContent = themed(b.dataset.label);
  });
  const app = $('#app');
  if (!S.awakened) { $('#tabs').hidden = true; app.innerHTML = viewAwaken(); bindAwaken(); return; }
  if (!S.profile || evalDraft) { $('#tabs').hidden = true; app.innerHTML = themed(viewEval()); return; }
  $('#tabs').hidden = false;
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
  decayFatigue();
  app.innerHTML = themed({ status: viewStatus, quests: viewQuests, routines: viewRoutines, inventory: viewInventory, shop: viewShop, more: viewMore }[tab]());
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
    notify('Notificación', 'Iniciando evaluación del Jugador...\n\nResponde con honestidad. El Sistema ajustará tus misiones a tu condición actual.');
    render();
  };
}

function viewEval() {
  if (!evalDraft) evalDraft = { step: 0, answers: S.profile ? { ...S.profile.answers } : {} };
  const { step, answers } = evalDraft;
  if (step >= QUESTIONS.length) return viewEvalResult();
  const q = QUESTIONS[step];
  const val = answers[q.id];
  return `<div class="awaken"><div class="win">
    <div class="win-title">Evaluación</div>
    <div class="label">${step + 1} / ${QUESTIONS.length}</div>${bar('', step, QUESTIONS.length)}
    <p class="msg">${q.q}</p>
    ${q.hint ? `<p class="muted" style="font-size:14px;margin-top:-6px">${q.hint}</p>` : ''}
    ${q.opts
      ? q.opts.map(([v, l]) => `<button class="btn block" data-ans="${v}" style="${val === v ? 'background:rgba(63,182,255,.35)' : ''}">${l}</button>`).join('')
      : `<div class="row"><input id="qnum" type="number" inputmode="decimal" min="${q.num[0]}" max="${q.num[1]}" step="${q.step || 1}" value="${val ?? ''}" placeholder="${q.unit}">
         <span class="muted">${q.unit}</span></div>
         <p class="red" id="qerr" style="font-size:14px;min-height:1em"></p>
         <button class="btn block" id="qnext">Siguiente</button>`}
    ${step > 0 ? '<button class="btn block small" id="qback" style="opacity:.7">Atrás</button>' : ''}
    ${S.profile ? '<button class="btn block small danger" id="qcancel">Cancelar</button>' : ''}
  </div></div>`;
}

function viewEvalResult() {
  const a = evalDraft.answers;
  const p = computePlan(a);
  const first = !S.profile;
  return `<div class="win"><div class="win-title">Resultado</div>
    <p class="center" style="margin-top:0">Evaluación completada.<br><b>Objetivo: ${GOALS[a.goal]}</b></p>
    ${first ? `<hr><div class="label center">Estadísticas iniciales</div>
      <div class="grid2">${Object.entries(STATS).map(([k, [, ab]]) => `<div class="stat"><span>${ab}</span><b>${p.stats[k]}</b></div>`).join('')}</div>` : ''}
    <hr><div class="label center">Misión diaria asignada</div>
    ${Object.entries(EXERCISES).map(([k, e]) => `<div class="row"><span>${e.name}</span><b>${p.targets[k]}${e.unit}</b></div>`).join('')}
    <p class="muted" style="font-size:14px">Cada 7 misiones completadas la dificultad sube un 10% hasta llegar al estándar del Sistema: 100 / 100 / 100 / 10 km.
    ${a.injury !== 'none' ? '<br>Se redujo la carga en la zona lesionada.' : ''}</p>
    <hr><div class="label center">Datos del cuerpo</div>
    <div class="row"><span>IMC</span><b>${p.bmi.toFixed(1)} · ${bmiLabel(p.bmi)}</b></div>
    <div class="row"><span>Gasto diario estimado</span><b>${p.tdee} kcal</b></div>
    <div class="row"><span>Calorías recomendadas</span><b class="gold">${p.kcal} kcal</b></div>
    <div class="row"><span>Proteína</span><b>${p.protein} g/día</b></div>
    <div class="row"><span>Agua</span><b>${p.water} L/día</b></div>
    <p class="muted" style="font-size:13px">Son estimaciones generales, no reemplazan a un médico o nutricionista.</p>
    <button class="btn block" id="qdone">${first ? 'Aceptar y comenzar' : 'Aplicar'}</button>
    <button class="btn block small" id="qback" style="opacity:.7">Atrás</button>
  </div>`;
}

function finishEval() {
  const a = evalDraft.answers;
  const p = computePlan(a);
  const first = !S.profile;
  S.profile = { answers: a, plan: p, reminderHour: { morning: 12, afternoon: 19, night: 21 }[a.when], start: +a.weight };
  S.targets = { ...p.targets };
  if (!S.weights.length || S.weights[S.weights.length - 1].kg !== +a.weight) S.weights.push({ date: today(), kg: +a.weight });
  if (first) {
    S.stats = { ...p.stats };
    S.hp = maxHP(); S.mp = maxMP();
    for (const [name, xp, stat] of GOAL_SIDE[a.goal])
      if (!S.side.some((q) => q.name === name)) S.side.push({ id: Date.now() + xp + S.side.length, name, xp, stat, done: null });
  }
  evalDraft = null;
  save();
  if (first) notify('Misión Diaria', 'La misión diaria [Entrenamiento de fuerza] ha llegado.\n\nRevisa la pestaña Misiones.');
  else notify('Notificación', 'Evaluación actualizada.\nLa misión diaria fue ajustada.');
  tab = first ? 'quests' : tab;
  render();
}

function logWeight() {
  const kg = Number($('#wkg').value);
  if (!(kg >= 30 && kg <= 300)) return;
  const last = S.weights[S.weights.length - 1];
  dayLog().weight = kg;
  if (last && last.date === today()) last.kg = kg; else S.weights.push({ date: today(), kg });
  const goal = +S.profile.answers.goalWeight, dir = Math.sign(goal - S.profile.start);
  if (dir === 0 || (kg - goal) * dir >= 0) unlockTitle('body');
  save(); render();
}

function dayStatus(d) {
  const L = (S.log || {})[d];
  if (d === today()) {
    if (S.daily.claimed) return 'done';
    return S.penalty ? 'penalty' : 'today';
  }
  if (!L) return '';
  if (L.daily) return 'done';
  if (L.penalty && !L.survived) return 'penalty';
  if (L.missed) return 'missed';
  return L.routines || L.side || L.dungeon ? 'partial' : '';
}

function viewCalendar() {
  const now = new Date();
  if (!calMonth) calMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  if (!calSel) calSel = today();
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const first = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const monthName = cap(calMonth.toLocaleDateString('es', { month: 'long', year: 'numeric' }));
  let cells = '<span></span>'.repeat(first);
  let doneCount = 0;
  for (let i = 1; i <= days; i++) {
    const d = today(new Date(y, m, i));
    const st = dayStatus(d);
    const L = (S.log || {})[d] || {};
    if (st === 'done') doneCount++;
    const marks = (L.secret ? '★' : '') + (L.routines ? '•' : '') + (L.dungeon ? '⚔' : '');
    cells += `<button class="cal-d ${st} ${d === calSel ? 'sel' : ''} ${d > today() ? 'future' : ''}" data-day="${d}">${i}<small>${marks}</small></button>`;
  }
  return `<div class="win"><div class="win-title">Calendario</div>
    <div class="row"><button class="btn small" data-cal="-1">‹</button>
      <b>${monthName}</b>
      <button class="btn small" data-cal="1">›</button></div>
    <div class="cal">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => `<span class="label">${d}</span>`).join('')}${cells}</div>
    <p class="muted center" style="font-size:13px;margin:6px 0">
      <span class="cal-key done"></span> Diaria completa <span class="cal-key penalty"></span> Castigo <span class="cal-key partial"></span> Otra actividad
      · ★ secreta · • rutina · ⚔ mazmorra</p>
    <div class="row"><span class="label">Diarias completadas este mes</span><b>${doneCount}</b></div>
    <hr>${viewDay(calSel)}
  </div>`;
}

function viewDay(d) {
  const isToday = d === today();
  const L = { ...((S.log || {})[d] || {}) };
  if (isToday) { L.progress = S.daily.progress; L.targets = S.targets; L.daily = S.daily.claimed; L.timer = Math.round(timerSec()); }
  const date = new Date(d + 'T12:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, (c) => c.toUpperCase());
  const rows = [];
  if (L.daily) rows.push('✔ Misión diaria completada');
  else if (L.progress && L.targets)
    rows.push(`${isToday ? '◻ Misión diaria en curso' : '✖ Misión diaria incompleta'}: ` +
      Object.entries(EXERCISES).map(([k, e]) => `${e.name} ${L.progress[k] || 0}/${L.targets[k]}${e.unit}`).join(' · '));
  else if (L.missed) rows.push('✖ Misión diaria incompleta');
  if (L.secret) rows.push('★ Misión secreta: Superar los límites');
  (L.routines || []).forEach((id) => rows.push(`• Rutina: ${ROUTINES[id] ? ROUTINES[id].name : id}`));
  (L.side || []).forEach((n) => rows.push(`◆ ${esc(n)}`));
  if (L.dungeon) rows.push(`⚔ Mazmorra despejada: ${L.dungeon}`);
  if (L.penalty) rows.push(L.survived ? '☠ Zona de Castigo: sobreviviste' : '☠ Zona de Castigo');
  if (L.timer) rows.push(`⏱ Tiempo entrenado: ${fmt(L.timer)}`);
  if (L.weight) rows.push(`⚖ Peso: ${L.weight} kg`);
  if (L.xp) rows.push(`<span class="gold">XP ganada: ${L.xp}</span>`);
  return `<div class="label">${date}</div>
    ${rows.length ? rows.map((r) => `<div style="padding:3px 0">${r}</div>`).join('') : `<p class="muted">${d > today() ? 'Todavía no llegó.' : 'Sin actividad registrada.'}</p>`}`;
}

function viewProfile() {
  if (!S.profile) return '';
  const a = S.profile.answers, p = S.profile.plan;
  const cur = S.weights.length ? S.weights[S.weights.length - 1].kg : +a.weight;
  const goal = +a.goalWeight, start = S.profile.start;
  const pct = start === goal ? 100 : Math.max(0, Math.min(100, ((start - cur) / (start - goal)) * 100));
  const bmi = cur / (a.height / 100) ** 2;
  const recent = S.weights.slice(-5).reverse();
  return `<div class="win"><div class="win-title">Cuerpo</div>
    <div class="row"><span class="label">Objetivo</span><b>${GOALS[a.goal]}</b></div>
    <div class="row label" style="margin-top:8px"><span>${start} kg</span><span>Actual ${cur} kg</span><span>Meta ${goal} kg</span></div>
    ${bar('', pct, 100)}
    <div class="row"><span>IMC</span><b>${bmi.toFixed(1)} · ${bmiLabel(bmi)}</b></div>
    <div class="row"><span>Calorías</span><b class="gold">${p.kcal} kcal</b></div>
    <div class="row"><span>Proteína · Agua</span><b>${p.protein} g · ${p.water} L</b></div>
    <hr>
    <div class="row"><input id="wkg" type="number" inputmode="decimal" step="0.1" placeholder="Peso de hoy (kg)"><button class="btn small" id="wlog">Registrar</button></div>
    ${recent.length > 1 ? `<p class="muted" style="font-size:14px">${recent.map((w) => `${w.date.slice(5)}: ${w.kg} kg`).join(' · ')}</p>` : ''}
  </div>`;
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
  ${viewCalendar()}
  ${viewProfile()}
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
      ${S.penalty.until ? `<div class="label center">Tiempo restante</div>
      <div class="center big-level red" style="font-size:40px;margin:4px 0" id="pen">${fmt(penaltyLeft())}</div>
      ${S.block.apps ? `<p class="center">Apps prohibidas:<br><b>${esc(S.block.apps)}</b></p>` : ''}
      ${S.block.mode !== 'none' && penaltyLeft() > 0 ? `<button class="btn block danger" id="blockOn">🔒 Activar bloqueo</button>` : ''}` : ''}
      <hr>
      <div class="goal ${S.penalty.taskDone ? 'done' : ''}"><span class="name">${esc(S.penaltyTask)}</span>
        ${S.penalty.taskDone ? '<span class="check">✔</span>' : '<button class="btn small danger" id="ptaskDone">Hecho</button>'}</div>
      <p class="muted center" style="font-size:14px">Para sobrevivir: cumplí el tiempo sin usar esas apps y hacé el ejercicio de castigo.</p>
      ${!S.penalty.until ? '<button class="btn block danger" id="survive">He sobrevivido</button>' : ''}
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
    <hr>
    <div class="label center">Cronómetro de entrenamiento</div>
    <div class="center big-level" style="font-size:40px;margin:6px 0" id="sw">${fmt(timerSec())}</div>
    <div class="row" style="justify-content:center">
      <button class="btn small" id="swToggle">${S.daily.timer.start ? 'Pausar' : (S.daily.timer.acc ? 'Reanudar' : 'Iniciar')}</button>
      <button class="btn small" id="swReset">Reiniciar</button>
    </div>
    <div class="row" style="justify-content:center;margin-top:10px">
      <span class="muted">Descanso</span>
      ${[30, 60, 90].map((n) => `<button class="btn small" data-rest="${n}">${n}s</button>`).join('')}
    </div>
    <p class="center timer" id="rest" style="min-height:1.2em">${rest ? `Descanso: ${Math.ceil((rest.end - Date.now()) / 1000)} s` : ''}</p>
    ${S.jobQuest === 'active' ? '<p class="center" style="color:var(--purple)">Misión de cambio de clase activa: completá el doble de cada objetivo hoy.</p>' : ''}
  </div>`;
  if (S.jobQuest === 'offered') {
    html += `<div class="win"><div class="win-title">Cambio de Clase</div>
      <p class="center">Completar el DOBLE de la misión diaria en un solo día.</p>
      <button class="btn block" id="jobAccept">Aceptar misión</button></div>`;
  }
  if (S.daily.dungeon) {
    const d = S.daily.dungeon;
    if (!d.steps) {
      html += `<div class="win"><div class="win-title">Mazmorra Instantánea</div>
        <p class="center"><b>${d.name}</b><br>${d.task}<br><span class="muted">Recompensa: ${d.xp} XP</span></p>
        ${d.done ? '<p class="center" style="color:var(--accent)">✔ Despejada</p>' : '<button class="btn block" id="dungeon">Mazmorra despejada</button>'}</div>`;
    } else {
      const wavesDone = d.steps.slice(0, -1).every((st) => st.done);
      html += `<div class="win"><div class="win-title">Mazmorra Instantánea</div>
        <p class="center" style="margin-top:0"><b>${d.name}</b><br><span class="muted">Recompensa: ${d.xp} XP</span></p>
        ${d.steps.map((st, i) => {
          const isBoss = i === d.steps.length - 1;
          const locked = isBoss && !wavesDone;
          const running = d.run && d.run.i === i;
          return `<div class="goal ${st.done ? 'done' : ''}" style="${locked ? 'opacity:.35' : ''}">
            <span class="name">${isBoss ? `<b class="red">JEFE: ${d.boss}</b><br>` : `<span class="label">Oleada ${i + 1}</span><br>`}${locked ? '???' : stepText(st)}</span>
            ${st.done ? '<span class="check">✔</span>' : locked ? '' : running
              ? `<span class="timer" id="drun">${fmtMin(Math.ceil((d.run.end - Date.now()) / 1000))}</span>`
              : st.unit === 'sec' ? `<button class="btn small" data-dstart="${i}">⏱ Iniciar</button>` : `<button class="btn small" data-dstep="${i}">Hecho</button>`}
          </div>`;
        }).join('')}
        ${d.done ? '<p class="center" style="color:var(--accent)">✔ Mazmorra despejada</p>' : ''}</div>`;
    }
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
  </div>
  <div class="win"><div class="win-title">Zona de Castigo</div>
    <label>Ejercicio de castigo<input id="ptask" value="${esc(S.penaltyTask)}"></label>
    <div class="grid2" style="margin-top:8px">
      <label>Duración<select id="bhours">${[1, 2, 4, 8, 12, 24].map((h) => `<option value="${h}" ${S.block.hours === h ? 'selected' : ''}>${h} h${h === 4 ? ' (canon)' : ''}</option>`).join('')}</select></label>
      <label>Bloqueo<select id="bmode">${Object.entries(BLOCK_MODES).map(([k, l]) => `<option value="${k}" ${S.block.mode === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    </div>
    <label style="display:block;margin-top:8px">Apps prohibidas<input id="bapps" value="${esc(S.block.apps)}" placeholder="Instagram, TikTok..."></label>
    ${S.block.mode === 'ios' ? `<label style="display:block;margin-top:8px">Nombre del Atajo<input id="bshort" value="${esc(S.block.shortcut)}"></label>` : ''}
    <details style="margin-top:10px"><summary class="muted">¿Cómo funciona el bloqueo real?</summary>
      ${S.block.mode === 'android' ? `<p style="font-size:15px">El botón "Activar bloqueo" abre <b>Bienestar Digital</b>. Ahí activá el <b>Modo concentración</b> con las apps prohibidas: quedan pausadas hasta que lo desactives. Configuralo una vez y después es un toque.</p>`
      : `<ol style="font-size:15px;padding-left:20px">
        <li>En la app <b>Atajos</b> creá un atajo llamado <b>${esc(S.block.shortcut)}</b> que reciba texto y lo guarde con <i>Guardar archivo</i> en <code>SL/castigo.txt</code> (reemplazar). Opcional: agregá <i>Activar Concentración</i>.</li>
        <li>En <b>Automatización → App</b> elegí las apps prohibidas, "Se abre", "Ejecutar inmediatamente".</li>
        <li>Acciones: <i>Obtener archivo</i> SL/castigo.txt → <i>Obtener fechas</i> → <i>Si</i> la fecha actual es anterior → <i>Mostrar notificación</i> "Estás en la Zona de Castigo" → <i>Ir a pantalla de inicio</i>.</li>
      </ol><p class="muted" style="font-size:14px">Cuando la app castiga, te pide activar el bloqueo y le pasa al atajo la hora de fin. Pasado ese tiempo, las apps se abren normal solas.</p>`}
    </details>
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
  <div class="win"><div class="win-title" data-secret>Sistema</div>
    ${S.themeUnlocked ? `<div class="row" style="margin-bottom:8px"><span>Tema</span>
      <select id="theme" style="width:auto"><option value="sl" ${S.theme === 'sl' ? 'selected' : ''}>Solo Leveling</option>
      <option value="varka" ${S.theme === 'varka' ? 'selected' : ''}>Caballeros de Favonius</option></select></div>` : ''}
    <div class="row"><span>Sonido</span><button class="btn small" id="snd">${S.sound ? 'Sí' : 'No'}</button></div>
    <div class="row" style="margin-top:8px"><span>Recordatorio</span><button class="btn small" id="notif">Activar</button></div>
    <p class="muted" style="font-size:14px">Misiones diarias completadas: ${S.totalDaily} · Mazmorras: ${S.dungeons}</p>
    <button class="btn block" id="reeval">Repetir evaluación</button>
    <button class="btn block" id="export">Exportar datos</button>
    <button class="btn block" id="import">Importar datos</button>
    <button class="btn block danger" id="reset">Reiniciar Jugador</button>
    <p class="muted center" style="font-size:13px">Fan app inspirada en Solo Leveling. Datos guardados solo en este dispositivo.</p>
  </div>`;
}

/* ================= EVENTS ================= */

let secretTaps = [];
document.addEventListener('click', (ev) => {
  if (ev.target.closest('[data-secret]') && !S.themeUnlocked) {
    const now = Date.now();
    secretTaps = secretTaps.filter((t) => now - t < 3000).concat(now);
    if (secretTaps.length >= 7) {
      S.themeUnlocked = true; save(); render();
      notify('Notificación', '[Acceso desbloqueado]\n\nSe detectó una señal del viento del oeste...\n\nNuevo tema disponible:\n<b>Caballeros de Favonius</b>');
    }
  }
});

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
  if (d.ans) { evalDraft.answers[QUESTIONS[evalDraft.step].id] = d.ans; evalDraft.step++; render(); return; }
  if (d.rest) { rest = { end: Date.now() + d.rest * 1000, label: d.label }; tickTimers(); return; }
  if (d.routine) return completeRoutine(d.routine);
  if (d.day) { calSel = d.day; render(); return; }
  if (d.cal) { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + Number(d.cal), 1); render(); return; }
  if (d.dstep) return dungeonStep(Number(d.dstep));
  if (d.dstart) {
    const st = S.daily.dungeon.steps[d.dstart];
    S.daily.dungeon.run = { i: Number(d.dstart), end: Date.now() + st.n * 1000 };
    save(); render(); return;
  }
  if (d.del) { S.side = S.side.filter((q) => q.id != d.del); save(); render(); return; }
  switch (b.id) {
    case 'qnext': {
      const q = QUESTIONS[evalDraft.step], v = Number($('#qnum').value);
      if (!(v >= q.num[0] && v <= q.num[1])) { $('#qerr').textContent = `Ingresá un valor entre ${q.num[0]} y ${q.num[1]}.`; return; }
      evalDraft.answers[q.id] = v; evalDraft.step++; render(); return;
    }
    case 'qback': evalDraft.step--; render(); return;
    case 'qcancel': evalDraft = null; render(); return;
    case 'qdone': return finishEval();
    case 'reeval': evalDraft = { step: 0, answers: { ...S.profile.answers } }; render(); window.scrollTo(0, 0); return;
    case 'wlog': return logWeight();
    case 'swToggle': {
      const t = S.daily.timer;
      if (t.start) { t.acc += (Date.now() - t.start) / 1000; t.start = null; } else t.start = Date.now();
      save(); render(); return;
    }
    case 'swReset': S.daily.timer = { acc: 0, start: null }; save(); render(); return;
    case 'claim': return claimDaily();
    case 'survive': return clearPenalty();
    case 'blockOn': return activateBlock();
    case 'ptaskDone':
      S.penalty.taskDone = true; save();
      if (penaltyLeft() > 0) notify('Notificación', `Ejercicio de castigo completado.\n\nSobrevive ${fmt(penaltyLeft())} más.`, { danger: true });
      checkPenalty(); render(); return;
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

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter' && ev.target.id === 'qnum') $('#qnext').click();
});

document.addEventListener('change', (ev) => {
  const el = ev.target;
  if (el.dataset.target) {
    const v = Math.max(el.dataset.target === 'run' ? 0.5 : 1, Number(el.value) || 0);
    S.targets[el.dataset.target] = v; save();
  }
  if (el.id === 'theme') {
    S.theme = el.value; save(); render();
    if (S.theme === 'varka') notify('Notificación', 'Bienvenido a los Caballeros de Favonius.\n\nEl Gran Maestro Varka sigue de expedición, pero dejó su régimen de entrenamiento para los caballeros de Mondstadt.\n\n¡Que el viento te acompañe!');
    return;
  }
  if (el.id === 'bhours') { S.block.hours = Number(el.value); save(); }
  if (el.id === 'bapps') { S.block.apps = el.value.trim(); save(); }
  if (el.id === 'bshort') { S.block.shortcut = el.value.trim() || 'SL Castigo'; save(); render(); }
  if (el.id === 'bmode') { S.block.mode = el.value; save(); render(); }
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
  notify('Notificación', `Recordatorios activados.\nCon la app abierta o en segundo plano, el Sistema te avisará a las ${S.profile?.reminderHour ?? 20}:00 si la misión diaria sigue incompleta.`);
}

let reminded = null;
function maybeRemind() {
  if (!S.awakened || S.daily.claimed || reminded === today()) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (new Date().getHours() < (S.profile?.reminderHour ?? 20)) return;
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
  tickTimers();
}, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { rollover(); render(); } });

if ('serviceWorker' in navigator) {
  // When a new version takes over, reload once so the update shows right away.
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) location.reload(); });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
    reg.update();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update(); });
  }).catch(() => {});
}
