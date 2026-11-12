'use strict';

/* ================= EVENTS ================= */

let secretTaps = [];
document.addEventListener('click', (ev) => {
  const tip = ev.target.closest('[data-tip]');
  if (tip) { const box = tip.closest('.chart').querySelector('.chart-tip'); box.textContent = tip.dataset.tip; box.classList.remove('muted'); }
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
    const pr = priceOf(d.buy);
    if (S.gold < pr) return;
    if (S.event && S.event.type === 'merchant' && S.event.item === d.buy && S.event.date === today()) S.event.done = true;
    S.gold -= pr; addItem(d.buy); save(); render();
    notify('Tienda', `Has comprado:\n${itemIco(d.buy)} <b>[${it.name}]</b>`); return;
  }
  if (d.ans) { evalDraft.answers[QUESTIONS[evalDraft.step].id] = d.ans; evalDraft.step++; render(); return; }
  if (d.rest) { rest = { end: Date.now() + d.rest * 1000, label: d.label }; tickTimers(); return; }
  if (d.routine) return completeRoutine(d.routine);
  if (d.guide) return startGuide(d.guide);
  if (d.gmstep) return gmStepDone(Number(d.gmstep));
  if (d.comm) return commissionDone(Number(d.comm));
  if (d.gslot) { gearSlot = d.gslot; render(); return; }
  if (d.gequip) {
    const sl = GEAR[d.gequip].slot;
    S.gear.eq[sl] = S.gear.eq[sl] === d.gequip ? null : d.gequip;
    save(); render(); return;
  }
  if (d.wish) return wish(Number(d.wish));
  if (d.day) { calSel = d.day; render(); return; }
  if (d.mood) {
    S.journal = S.journal || {};
    const j = (S.journal[calSel] = S.journal[calSel] || {});
    j.mood = j.mood === Number(d.mood) ? null : Number(d.mood);
    save(); render(); return;
  }
  if (d.cal) { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + Number(d.cal), 1); render(); return; }
  if (d.dstep) return dungeonStep(Number(d.dstep));
  if (d.test) return recordTest(d.test);
  if (d.skill) {
    const sk = SKILLS[Number(d.skill)];
    if (S.equipped.includes(sk.name)) S.equipped = S.equipped.filter((n) => n !== sk.name);
    else if (S.equipped.length < maxSlots()) S.equipped.push(sk.name);
    save(); render(); return;
  }
  if (d.dstart) {
    const st = S.daily.dungeon.steps[d.dstart];
    S.daily.dungeon.run = { i: Number(d.dstart), end: Date.now() + st.n * 1000 };
    save(); render(); return;
  }
  if (d.del) { S.side = S.side.filter((q) => q.id != d.del); save(); render(); return; }
  switch (b.id) {
    case 'qnext': {
      const q = QUESTIONS[evalDraft.step], v = num($('#qnum').value);
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
    case 'emgDone': return completeEmergency();
    case 'pauseStart':
      if (confirm('¿Activar el modo pausa? Los días usados no se recuperan este mes.')) startPause(Number($('#pauseDays').value), $('#pauseReason').value);
      return;
    case 'pauseEnd': return endPause();
    case 'gmTrial':
      if (!gmReady()) return;
      S.gm.trial = { date: today(), steps: buildTrial() };
      notify('Prueba del Gran Maestro', '"Muy bien. Mostrame de qué estás hecho."\n— Varka\n\nTenés hasta la medianoche para completar la prueba.');
      save(); render(); return;
    case 'gmToggle': S.gm.active = !S.gm.active; save(); render(); return;
    case 'rankEval': return reevaluate();
    case 'deloadTgl': S.deload = S.deload === false; save(); render(); return;
    case 'card': return showCard();
    case 'cardShare': return shareCard();
    case 'gSkip': return guideNext();
    case 'gPrev': return guideNext(-1);
    case 'gExit': guide = null; render(); return;
    case 'gToggle':
      if (guide.end) { guide.left = (guide.end - Date.now()) / 1000; guide.end = null; }
      else guide.end = Date.now() + (guide.left ?? guideSecs(guide.steps[guide.i])) * 1000;
      render(); return;
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

document.addEventListener('input', (ev) => {
  if (ev.target.id === 'journal') saveJournal(ev.target, false);
});

document.addEventListener('change', (ev) => {
  if (ev.target.id === 'journal') { saveJournal(ev.target, true); return; }
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

/* ================= SWIPE BETWEEN TABS ================= */

// The page follows the finger while the neighbour tab slides in beside it (a
// read-only preview in #peek). On release it either completes or springs back.
// Any drag also swallows the click that would otherwise hit a button.
let swipe = null;
let suppressClickUntil = 0;

const visibleTabs = () => [...document.querySelectorAll('#tabs button')].filter((b) => !b.hidden).map((b) => b.dataset.tab);
const TAB_VIEWS = () => ({ status: viewStatus, quests: viewQuests, routines: viewRoutines, inventory: viewInventory, shop: viewShop, more: viewMore, gear: viewGear });

function peekEl() {
  let el = document.getElementById('peek');
  if (!el) {
    el = document.createElement('div');
    el.id = 'peek';
    el.innerHTML = '<div class="peek-inner"></div>';
    document.body.appendChild(el);
  }
  return el;
}

function setPeek(name) {
  const el = peekEl();
  if (el.dataset.tab === name) return;
  el.dataset.tab = name || '';
  el.firstChild.innerHTML = name ? themed(TAB_VIEWS()[name]()) : '';
  el.hidden = !name;
}

function place(x, peekX, ms) {
  const tr = ms ? `transform ${ms}ms cubic-bezier(.2,.7,.3,1)` : 'none';
  const app = $('#app'), pk = peekEl();
  app.style.transition = tr; pk.style.transition = tr;
  app.style.transform = x ? `translate3d(${x}px,0,0)` : '';
  pk.style.transform = `translate3d(${peekX}px,0,0)`;
}

function resetSwipeView() {
  place(0, 0, 0);
  setPeek(null);
}

document.addEventListener('touchstart', (ev) => {
  const t = ev.touches[0];
  if (ev.touches.length !== 1 || !$('#overlay').hidden || $('#tabs').hidden || ev.target.closest('input, textarea, select')) { swipe = null; return; }
  swipe = { x: t.clientX, y: t.clientY, at: Date.now(), axis: null, dx: 0 };
}, { passive: true });

document.addEventListener('touchmove', (ev) => {
  if (!swipe) return;
  const t = ev.touches[0];
  const dx = t.clientX - swipe.x, dy = t.clientY - swipe.y;
  if (!swipe.axis) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    swipe.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y';
    suppressClickUntil = Date.now() + 500;
  }
  if (swipe.axis !== 'x') return;
  ev.preventDefault(); // keep the page from scrolling vertically mid-swipe
  const W = window.innerWidth, tabs = visibleTabs(), i = tabs.indexOf(tab);
  const next = tabs[i + (dx < 0 ? 1 : -1)];
  swipe.dx = dx;
  if (!next) { setPeek(null); place(dx * 0.25, 0, 0); return; } // rubber band at the ends
  setPeek(next);
  place(dx, dx + (dx < 0 ? W : -W), 0);
}, { passive: false });

document.addEventListener('touchend', () => {
  if (!swipe) return;
  const sw = swipe;
  swipe = null;
  if (sw.axis) suppressClickUntil = Date.now() + 400;
  if (sw.axis !== 'x') return;
  const W = window.innerWidth, v = Math.abs(sw.dx) / Math.max(1, Date.now() - sw.at);
  const tabs = visibleTabs(), i = tabs.indexOf(tab) + (sw.dx < 0 ? 1 : -1);
  const far = Math.abs(sw.dx) >= W * 0.25, flick = v >= 0.5 && Math.abs(sw.dx) >= 60;
  const back = sw.dx < 0 ? W : -W;
  if (i < 0 || i >= tabs.length || !(far || flick)) {
    place(0, back, 220);
    setTimeout(() => { if (!swipe) setPeek(null); }, 230);
    return;
  }
  place(-back, 0, 200);
  setTimeout(() => {
    tab = tabs[i];
    render(); window.scrollTo(0, 0);
    resetSwipeView();
  }, 200);
});

document.addEventListener('touchcancel', () => { if (swipe && swipe.axis === 'x') { place(0, swipe.dx < 0 ? window.innerWidth : -window.innerWidth, 220); setTimeout(() => setPeek(null), 230); } swipe = null; });

// Capture phase: runs before the app's own click handlers.
document.addEventListener('click', (ev) => {
  if (Date.now() < suppressClickUntil) { ev.stopPropagation(); ev.preventDefault(); }
}, true);
