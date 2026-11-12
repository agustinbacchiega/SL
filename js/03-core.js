'use strict';

/* ================= NOTIFICATIONS ================= */

const queue = [];
let showing = false;

function notify(title, msg, opts = {}) {
  if (pendingProto && msg) { msg += `\n💎 Protogemas +${pendingProto}`; pendingProto = 0; }
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

// While auto-claiming yesterday's quest after midnight, logs go to that day.
let logDay = null;
let autoClaim = false;
function dayLog(d = logDay || today()) {
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
  if (source === 'dungeon' && titleIs('red')) mult += 0.2;
  if (titleIs('double')) mult += 0.15;
  if (titleIs('legend')) mult += 0.2;
  if (titleIs('srank')) mult += 0.1;
  if (titleIs('season')) mult += 0.05;
  if (titleIs('gm')) mult += 0.1;
  if (gmOn() && ['daily', 'routine', 'dungeon'].includes(source)) mult += 0.5;
  mult += gearBonus().xp;
  if (source === 'routine' && titleIs('disciplined')) mult += 0.25;
  if (source === 'emergency' && titleIs('responder')) mult += 0.5;
  if (source === 'test' && ['fist', 'legs', 'wall', 'engine', 'wind'].includes(S.title)) mult += 0.25;
  if (S.event && S.event.type === 'blessing' && S.event.date === today()) mult += 0.5;
  const xp = Math.round(base * mult);
  S.xp += xp;
  dayLog().xp = (dayLog().xp || 0) + xp;
  let ups = 0;
  while (S.xp >= xpNeeded()) {
    S.xp -= xpNeeded();
    S.level++; ups++;
    S.ap += 5;
    gainProto(50);
  }
  if (ups) {
    S.hp = maxHP(); S.mp = maxMP(); S.fatigue = 0;
    notify('Notificación', `¡Subiste de nivel!\n\nNivel ${S.level - ups} → <b>${S.level}</b>\nPuntos de habilidad +${ups * 5}\n\nHP, MP y Fatiga restaurados.`);
    SKILLS.forEach((sk) => {
      if (!sk.job && sk.lv > S.level - ups && sk.lv <= S.level && S.equipped && S.equipped.length < maxSlots()) S.equipped.push(sk.name);
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
  const g = Math.round(n * (1 + (titleIs('demon') ? 0.5 : 0) + (titleIs('conqueror') ? 0.25 : 0) + (hasSkill('Autoridad del Gobernante') ? 0.2 : 0) + gearBonus().gold));
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
  const doubled = Object.keys(S.targets).every((x) => p[x] >= tgt(x) * 2);
  if (doubled && !S.daily.secret) {
    S.daily.secret = true;
    dayLog().secret = true;
    gainProto(20);
    hitBoss('secret');
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
  gainProto(60);
  dayLog().daily = true;
  gmPerfectWeek();
  hitBoss('daily');
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
  if (!autoClaim && new Date().getHours() < 7) unlockTitle('early');
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
  // Every target done but the reward never claimed: claim it instead of punishing.
  if (S.awakened && S.profile && !S.daily.claimed && dailyComplete()) {
    notify('Notificación', 'Completaste la misión diaria pero no reclamaste las recompensas.\n\nEl Sistema las reclamó por vos.');
    logDay = S.daily.date; autoClaim = true;
    try { claimDaily(); } finally { logDay = null; autoClaim = false; }
  }
  const missed = !S.daily.claimed;
  if (S.awakened && S.daily.date) {
    const prev = dayLog(S.daily.date);
    prev.progress = { ...S.daily.progress };
    prev.targets = Object.fromEntries(Object.keys(S.targets).map((k) => [k, tgt(k)]));
    const secs = Math.round(timerSec());
    if (secs) prev.timer = secs;
    if (missed) prev.missed = true;
  }
  if (missed && S.awakened && S.daily.date && pausedOn(S.daily.date)) {
    dayLog(S.daily.date).paused = true;
    S.daily = freshDaily(t);
  } else if (missed && S.awakened && S.daily.date) {
    S.streak = 0;
    gmMissed();
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
  if (S.awakened) notify('Misión Diaria', 'La misión diaria [Entrenamiento de fuerza] ha llegado.' + (S.theme === 'varka' ? `\n\nCarta del Gran Maestro:\n<i>"${letterOfDay()}"</i>` : ''));
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
    const pool = hasSkill('Fortuna')
      ? ['hp', 'mp', 'fat', 'key', 'key', 'key', 'gold', 'gold', 'stone', 'stone']
      : ['hp', 'hp', 'mp', 'fat', 'fat', 'key', 'key', 'gold', 'gold', 'gold', 'stone'];
    const r = pool[Math.floor(Math.random() * pool.length)];
    if (r === 'gold') {
      const g = gainGold(100 + Math.floor(Math.random() * 400));
      notify('Caja Aleatoria', `Has obtenido:\n<span class="gold">${g} de oro</span>`);
    } else {
      addItem(r);
      notify('Caja Aleatoria', `Has obtenido:\n${itemIco(r)} <b>[${ITEMS[r].name}]</b>`);
    }
  } else if (id === 'hp') { S.hp = maxHP(); notify('Notificación', 'HP restaurado por completo.'); }
  else if (id === 'mp') { S.mp = maxMP(); notify('Notificación', 'MP restaurado por completo.'); }
  else if (id === 'fat') { S.fatigue = 0; notify('Notificación', 'Fatiga: 0'); }
  else if (id === 'stone') { S.ap += 1; notify('Notificación', 'Puntos de habilidad +1'); }
  else if (id === 'key') {
    if (S.daily.dungeon) { addItem('key'); notify('Notificación', 'Ya hay una mazmorra abierta hoy.'); }
    else {
      const tier = Math.min(DUNGEONS.length - 1, Math.floor(S.dungeons / 3));
      const nd = (S.daily.dungeon = makeDungeon(tier));
      const intro = { normal: '', red: '⚠ ¡Es una <b>Puerta Roja</b>! No hay salida hasta derrotar al jefe.\n\n', double: '⚠⚠ Algo no está bien... Esta es una <b>Mazmorra Doble</b>.\n\n' }[nd.variant];
      notify('Mazmorra Instantánea', `${intro}Has entrado a: <b>${nd.name}</b>\n\nDerrota ${nd.steps.length - 1} oleadas y al jefe:\n<b>${nd.boss}</b>\n\nRecompensa: ${nd.xp} XP\nEstá en la pestaña Misiones.`, { danger: nd.variant !== 'normal' });
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
  gainProto(40);
  hitBoss('dungeon');
  const xp = gainXP(d.xp, 'dungeon');
  const g = gainGold(150);
  let msg = `${d.boss ? `Has derrotado a <b>${d.boss}</b>.\n` : ''}Has despejado la mazmorra.\n\nXP +${xp}  ·  Oro +${g}`;
  if (hasSkill('Sed de Sangre')) { addItem('box'); msg += '\nCaja Aleatoria ×1'; }
  if (d.boss && Math.random() < 0.25) { addItem('key'); msg += '\n🗝️ Botín del jefe: Llave de Mazmorra'; }
  notify('Mazmorra Despejada', msg);
  if (d.variant === 'red') unlockTitle('red');
  if (d.variant === 'double') { addItem('stone'); notify('Notificación', 'Has sobrevivido a la Mazmorra Doble.\n\nRecompensa especial: 💠 Piedra Rúnica'); unlockTitle('double'); }
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
  S.sideDone = (S.sideDone || 0) + 1;
  hitBoss('side');
  dayLog().side = pushUnique(dayLog().side || [], q.name);
  const xp = gainXP(q.xp, 'side');
  let g = 0;
  if (hasSkill('Daga Mortal')) g = gainGold(10);
  notify('Misión Completada', `[${q.name}]\n\nXP +${xp}${g ? `  ·  Oro +${g}` : ''}`);
  save(); render();
}
