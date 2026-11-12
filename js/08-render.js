'use strict';

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
  const emg = $('#emg');
  if (emg && S.event) {
    const left = (S.event.until - Date.now()) / 1000;
    if (left <= 0) render(); else emg.textContent = fmt(left);
  }
  tickGuide();
  const gclock = guide && document.querySelector('#app .row.label span:last-child');
  if (gclock) gclock.textContent = fmt((Date.now() - guide.started) / 1000);
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
  const views = document.querySelectorAll('#rest, .rest-view');
  const el = views.length ? { set textContent(t) { views.forEach((v) => { v.textContent = t; }); } } : null;
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
  document.body.classList.toggle('gm', gmOn());
  const rootBg = S.penalty ? '#120205' : S.theme === 'varka' ? '#06110f' : '#050a14';
  document.documentElement.style.backgroundColor = rootBg;
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.setAttribute('content', rootBg);
  // Point icons/manifest at the active theme. The browser tab updates at once; the
  // home-screen icon is fixed at install time, so it changes on the next install.
  const v = S.theme === 'varka';
  const setHref = (sel, href) => { const l = document.querySelector(sel); if (l && l.getAttribute('href') !== href) l.setAttribute('href', href); };
  setHref('link[rel=manifest]', v ? 'manifest-varka.webmanifest' : 'manifest.webmanifest');
  setHref('link[rel=icon]', v ? 'icons/icon-varka.svg' : 'icons/icon.svg');
  setHref('link[rel=apple-touch-icon]', v ? 'icons/icon-varka-192.png' : 'icons/icon-192.png');
  if (tab === 'gear' && S.theme !== 'varka') tab = 'status';
  $('#tabs').classList.toggle('seven', S.theme === 'varka');
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.hidden = b.dataset.tab === 'gear' && S.theme !== 'varka';
    b.dataset.label = b.dataset.label || b.textContent;
    b.textContent = themed(b.dataset.label);
  });
  const app = $('#app');
  if (!S.awakened) { $('#tabs').hidden = true; app.innerHTML = viewAwaken(); bindAwaken(); return; }
  if (!S.profile || evalDraft) { $('#tabs').hidden = true; app.innerHTML = themed(viewEval()); return; }
  if (guide) { $('#tabs').hidden = true; app.innerHTML = themed(viewGuide()); return; }
  $('#tabs').hidden = false;
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
  decayFatigue();
  app.innerHTML = themed({ status: viewStatus, quests: viewQuests, routines: viewRoutines, inventory: viewInventory, shop: viewShop, more: viewMore, gear: viewGear }[tab]());
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
      : `<div class="row"><input id="qnum" type="text" inputmode="decimal" value="${val ?? ''}" placeholder="${q.unit}">
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
  S.profile = { since: (S.profile && S.profile.since) || today(), answers: a, plan: p, reminderHour: { morning: 12, afternoon: 19, night: 21 }[a.when], start: +a.weight };
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
  const kg = num($('#wkg').value);
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
  if (d === today() && pausedOn(d) && !S.daily.claimed) return 'paused';
  if (d === today()) {
    if (S.daily.claimed) return 'done';
    return S.penalty ? 'penalty' : 'today';
  }
  if (!L) return '';
  if (L.daily) return 'done';
  if (L.paused) return 'paused';
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
    const marks = (L.secret ? '★' : '') + (L.routines ? '•' : '') + (L.dungeon ? '⚔' : '') + ((S.journal || {})[d] && S.journal[d].text ? '✎' : '');
    cells += `<button class="cal-d ${st} ${d === calSel ? 'sel' : ''} ${d > today() ? 'future' : ''}" data-day="${d}">${i}<small>${marks}</small></button>`;
  }
  return `<div class="win"><div class="win-title">Calendario</div>
    <div class="row"><button class="btn small" data-cal="-1">‹</button>
      <b>${monthName}</b>
      <button class="btn small" data-cal="1">›</button></div>
    <div class="cal">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => `<span class="label">${d}</span>`).join('')}${cells}</div>
    <p class="muted center" style="font-size:13px;margin:6px 0">
      <span class="cal-key done"></span> Diaria completa <span class="cal-key penalty"></span> Castigo <span class="cal-key partial"></span> Otra actividad
      · ★ secreta · • rutina · ⚔ mazmorra · ✎ diario</p>
    <div class="row"><span class="label">Diarias completadas este mes</span><b>${doneCount}</b></div>
    <hr>${viewDay(calSel)}
    ${viewJournal(calSel)}
  </div>`;
}

const MOODS = ['😫', '😕', '😐', '🙂', '🔥'];

function viewJournal(d) {
  if (d > today()) return '';
  const j = (S.journal || {})[d] || {};
  return `<hr><div class="row"><span class="label">Diario</span>
      <span>${MOODS.map((m, i) => `<button class="btn small mood ${j.mood === i ? 'on' : ''}" data-mood="${i}" title="Ánimo">${m}</button>`).join('')}</span></div>
    <textarea id="journal" data-date="${d}" maxlength="2000" rows="5"
      placeholder="¿Cómo te fue hoy? ¿Qué entrenaste, cómo te sentiste, qué querés mejorar mañana?">${esc(j.text || '')}</textarea>
    <p class="muted" style="font-size:13px;margin:4px 0 0">${d === today() && !j.xp ? 'Escribir la entrada de hoy da +15 XP. ' : ''}Se guarda solo mientras escribís.</p>`;
}

let journalTimer = null;
function saveJournal(el, final) {
  const d = el.dataset.date;
  S.journal = S.journal || {};
  const j = (S.journal[d] = S.journal[d] || {});
  j.text = el.value.slice(0, 2000);
  if (!j.text && j.mood == null) delete S.journal[d];
  clearTimeout(journalTimer);
  // While typing, write straight to storage: save() could pop an achievement over the keyboard.
  if (!final) { journalTimer = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }, 600); return; }
  // XP only for today's entry, once, when the user finishes writing (on blur).
  if (final && d === today() && j.text.trim().length >= 10 && !j.xp) {
    j.xp = true;
    const xp = gainXP(15);
    gainProto(5);
    hitBoss('journal');
    notify('Diario', `Entrada del diario guardada.\n\nXP +${xp}`);
  }
  save();
}

function viewDay(d) {
  const isToday = d === today();
  const L = { ...((S.log || {})[d] || {}) };
  if (isToday) { L.progress = S.daily.progress; L.targets = Object.fromEntries(Object.keys(S.targets).map((k) => [k, tgt(k)])); L.daily = S.daily.claimed; L.timer = Math.round(timerSec()); }
  const date = new Date(d + 'T12:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, (c) => c.toUpperCase());
  const rows = [];
  if (L.daily) rows.push('✔ Misión diaria completada');
  else if (L.progress && L.targets)
    rows.push(`${isToday ? '◻ Misión diaria en curso' : '✖ Misión diaria incompleta'}: ` +
      Object.entries(EXERCISES).map(([k, e]) => `${exLabel(k)} ${L.progress[k] || 0}/${L.targets[k]}${e.unit}`).join(' · '));
  else if (L.missed) rows.push('✖ Misión diaria incompleta');
  if (L.secret) rows.push('★ Misión secreta: Superar los límites');
  (L.routines || []).forEach((id) => rows.push(`• Rutina: ${ALL_ROUTINES()[id] ? ALL_ROUTINES()[id].name : id}`));
  (L.side || []).forEach((n) => rows.push(`◆ ${esc(n)}`));
  if (L.boss) rows.push(`👑 Jefe semanal derrotado: ${L.boss}`);
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
    <div class="row"><input id="wkg" type="text" inputmode="decimal" placeholder="Peso de hoy (kg)"><button class="btn small" id="wlog">Registrar</button></div>
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
        ${S.reeval ? `<div><span class="label">Evaluación:</span> <span class="rank">${gradeName(S.reeval.grade)}</span></div>` : ''}
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
  <button class="btn block" id="card" style="margin:-4px 0 16px">🪪 Tarjeta de cazador</button>
  ${viewCalendar()}
  ${viewProgress()}
  ${viewProfile()}
  <div class="win"><div class="win-title">Habilidades</div>
    <p class="muted center" style="margin-top:0;font-size:14px">Ranuras equipadas: <b>${(S.equipped || []).length} / ${maxSlots()}</b>
      ${S.level < 25 ? '<br>Nivel 25: +1 ranura' : ''}${S.job === 'Ninguno' ? '<br>Cambio de clase: +1 ranura' : ''}</p>
    ${SKILLS.map((s, i) => {
      const has = skillUnlocked(s);
      const eq = s.job || (S.equipped || []).includes(s.name);
      return `<div class="item" style="${has ? '' : 'opacity:.35'}"><div class="info">
        <b>${has ? s.name : '???'}</b><span class="tag">${s.type}</span>${has && eq ? '<span class="tag">Equipada</span>' : ''}
        <div class="desc">${has ? s.desc : (s.job ? 'Requiere cambio de clase.' : `Se desbloquea en nivel ${s.lv}.`)}</div></div>
        ${has && !s.job ? `<button class="btn small" data-skill="${i}" ${!eq && S.equipped.length >= maxSlots() ? 'disabled' : ''}>${eq ? 'Quitar' : 'Equipar'}</button>` : ''}</div>`;
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
  if (S.theme === 'varka') {
    html += `<div class="win"><div class="win-title">Carta del Gran Maestro</div>
      <p style="font-style:italic;margin-top:0">"${letterOfDay()}"</p>
      <p class="muted" style="text-align:right;margin:0">— Varka, desde la expedición</p></div>`;
  }
  html += `<div class="win"><div class="win-title">Misión Diaria</div>
    ${pausedOn(today()) ? '<p class="center" style="margin-top:0;font-size:15px;color:var(--accent)">⏸ Modo pausa: hoy no hay castigo</p>' : ''}
    ${gmOn() ? '<p class="center gold" style="margin-top:0;font-size:15px">⚜ Régimen del Gran Maestro: objetivos ×1,5</p>' : ''}
    ${isDeload() ? '<p class="center gold" style="margin-top:0;font-size:15px">Semana de descarga: objetivos −30%</p>' : ''}
    <p class="center" style="margin-top:0">[Entrenamiento de fuerza]<br><b>Preparativos para volverse poderoso</b></p>
    ${Object.entries(EXERCISES).map(([k, e]) => {
      const ok = p[k] >= tgt(k);
      return `<div class="goal ${ok ? 'done' : ''}">
        <span class="name">${exLabel(k)}</span>
        <span class="ctrls">
          <button class="btn small" data-ex="${k}" data-n="${-e.steps[0]}">−</button>
          <button class="btn small" data-ex="${k}" data-n="${e.steps[0]}">+${e.steps[0]}</button>
          <button class="btn small" data-ex="${k}" data-n="${e.steps[1]}">+${e.steps[1]}</button>
        </span>
        <span class="count">[${p[k]}/${tgt(k)}${e.unit}]</span></div>`;
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
  html += viewEvent();
  html += viewBoss();
  html += viewCommissions();
  html += viewWeeklyRequest();
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
  return `${viewSeason()}<div class="win"><div class="win-title">Inventario</div>
    ${owned.length ? owned.map(([id, n]) => `<div class="item"><div class="ico">${itemIco(id)}</div>
      <div class="info"><b>${ITEMS[id].name}</b> ×${n}<div class="desc">${ITEMS[id].desc}</div></div>
      <button class="btn small" data-use="${id}">${id === 'box' ? 'Abrir' : 'Usar'}</button></div>`).join('')
      : '<p class="muted center">Vacío.</p>'}
  </div>
  ${viewAchievements()}
  <div class="win"><div class="win-title">Títulos</div>
    ${Object.entries(TITLES).map(([id, t]) => {
      const has = S.titles.includes(id);
      return `<div class="item" style="${has ? '' : 'opacity:.6'}"><div class="info">
        <b>${has || !t.secret ? t.name : '???'}</b>${has ? '' : ' 🔒'}${S.title === id ? '<span class="tag">Equipado</span>' : ''}
        <div class="desc">${has ? `${t.desc}<br>Efecto: ${t.bonus}` : t.secret ? 'Misión secreta.' : `Requisito: ${t.desc}<br>Efecto: ${t.bonus}`}</div></div>
        ${has ? `<button class="btn small" data-title="${id}">${S.title === id ? 'Quitar' : 'Equipar'}</button>` : ''}</div>`;
    }).join('')}
  </div>`;
}

function viewShop() {
  return `<div class="win"><div class="win-title">Tienda</div>
    <div class="row" style="margin-bottom:8px"><span class="label">Oro disponible</span><b class="gold">${S.gold.toLocaleString('es')}</b></div>
    ${Object.entries(ITEMS).map(([id, it]) => `<div class="item"><div class="ico">${itemIco(id)}</div>
      <div class="info"><b>${it.name}</b><div class="desc">${it.desc}</div></div>
      <button class="btn small" data-buy="${id}" ${S.gold < priceOf(id) ? 'disabled' : ''}>${priceOf(id) < it.price ? `<s style="opacity:.6">${it.price}</s> ` : ''}${priceOf(id)} ${coin()}</button></div>`).join('')}
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
  ${viewPause()}
  <div class="win"><div class="win-title" data-secret>Sistema</div>
    ${S.themeUnlocked ? `<div class="row" style="margin-bottom:8px"><span>Tema</span>
      <select id="theme" style="width:auto"><option value="sl" ${S.theme === 'sl' ? 'selected' : ''}>Solo Leveling</option>
      <option value="varka" ${S.theme === 'varka' ? 'selected' : ''}>Caballeros de Favonius</option></select></div>` : ''}
    <div class="row" style="margin-bottom:8px"><span>Semana de descarga cada 6</span><button class="btn small" id="deloadTgl">${S.deload !== false ? 'Sí' : 'No'}</button></div>
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
