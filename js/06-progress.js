'use strict';

/* ================= DELOAD WEEK ================= */

// Every 6th week the System lowers the load 30% so the body can recover.
function weekIndex() {
  if (!S.profile || !S.profile.since) return 0;
  return Math.round((new Date(weekStart()) - new Date(weekStart(new Date(S.profile.since + 'T12:00')))) / (7 * 864e5));
}
const isDeload = () => S.deload !== false && !!S.profile && weekIndex() % 6 === 5;
const tgt = (k) => {
  const m = (gmOn() ? 1.5 : 1) * (isDeload() ? 0.7 : 1);
  if (m === 1) return S.targets[k];
  return k === 'run' ? Math.max(0.5, Math.round(S.targets[k] * m * 2) / 2) : Math.max(5, Math.round((S.targets[k] * m) / 5) * 5);
};

function ensureSince() {
  if (!S.profile || S.profile.since) return;
  const days = Object.keys(S.log || {}).sort();
  S.profile.since = days[0] || today();
}

function checkDeloadNotice() {
  if (!isDeload() || S.deloadNotified === weekStart()) return;
  S.deloadNotified = weekStart();
  notify('Notificación', 'Semana de descarga.\n\nTu cuerpo acumuló 5 semanas de esfuerzo. Esta semana la misión diaria y las rutinas bajan un 30% para que te recuperes y vuelvas más fuerte.');
  save();
}

/* ================= REAL STAT GROWTH ================= */

function totals() {
  const t = { pushups: 0, situps: 0, squats: 0, run: 0 };
  for (const L of Object.values(S.log || {})) if (L.progress) for (const k in t) t[k] += Number(L.progress[k]) || 0;
  t.run = Math.round(t.run * 10) / 10;
  return t;
}

// [id, stat, label, value(totals), every]
const REAL_GAINS = [
  ['push', 'str', 'Flexiones', (t) => t.pushups, 1000],
  ['squat', 'str', 'Sentadillas', (t) => t.squats, 1500],
  ['sit', 'vit', 'Abdominales', (t) => t.situps, 1000],
  ['km', 'agi', 'Km corridos', (t) => t.run, 25],
  ['journal', 'int', 'Entradas de diario', () => Object.values(S.journal || {}).filter((j) => j.text).length, 10],
  ['pr', 'per', 'Récords personales', () => S.prs || 0, 5],
];

function checkRealStats() {
  if (!S.awakened || !S.profile) return;
  S.realGains = S.realGains || {};
  const t = totals();
  for (const [id, stat, label, fn, every] of REAL_GAINS) {
    const earned = Math.floor(fn(t) / every);
    const had = S.realGains[id] || 0;
    if (earned > had) {
      S.stats[stat] += earned - had;
      S.realGains[id] = earned;
      notify('Notificación', `Tu cuerpo se fortaleció con el entrenamiento real.\n\n<b>${STATS[stat][1]} +${earned - had}</b>\n(${label}: ${Math.floor(fn(t)).toLocaleString('es')} en total)`);
    }
  }
}

/* ================= RANK RE-EVALUATION ================= */

// Thresholds for grades D, C, B, A, S (below the first = E).
const GRADES = {
  push: [10, 20, 35, 50, 70],
  squat: [20, 30, 40, 50, 60],
  plank: [30, 60, 120, 180, 300],
  burpee: [20, 35, 50, 65, 80],
  run: [420, 360, 300, 255, 225],
};
const LETTERS = ['E', 'D', 'C', 'B', 'A', 'S'];
const gradeOf = (id, v) => GRADES[id].filter((th) => (TESTS[id].lower ? v <= th : v >= th)).length;
const gradeName = (g) => (S.theme === 'varka' ? RANKS_VARKA[g] : LETTERS[g]);

function monthBests() {
  const m = today().slice(0, 7), out = {};
  for (const id of Object.keys(TESTS)) {
    const l = (S.tests[id] || []).filter((x) => x.date.startsWith(m));
    if (l.length) out[id] = TESTS[id].lower ? Math.min(...l.map((x) => x.v)) : Math.max(...l.map((x) => x.v));
  }
  return out;
}

function reevaluate() {
  const m = today().slice(0, 7), bests = monthBests();
  const ids = Object.keys(bests);
  if (ids.length < 3 || (S.reeval && S.reeval.month === m)) return;
  const grade = Math.round(ids.reduce((a, id) => a + gradeOf(id, bests[id]), 0) / ids.length);
  S.reeval = { month: m, grade };
  const xp = gainXP(200);
  gainProto(100);
  notify('Reevaluación', `[Reevaluación de rango]\n\n${ids.map((id) => `${TESTS[id].name}: ${fmtTest(id, bests[id])} → ${LETTERS[gradeOf(id, bests[id])]}`).join('\n')}\n\nTu rango por evaluación es:\n<b style="font-size:28px">${gradeName(grade)}</b>\n\nXP +${xp}`);
  if (grade === 5) unlockTitle('srank');
  save(); render();
}

function viewReeval() {
  const m = today().slice(0, 7), bests = monthBests();
  const n = Object.keys(bests).length, done = S.reeval && S.reeval.month === m;
  return `<div class="win"><div class="win-title">Reevaluación de Rango</div>
    <p class="muted" style="margin-top:0;font-size:14px">Una vez por mes, el Sistema mide tu rendimiento real con las pruebas de fuerza del mes (mínimo 3) y te asigna un rango por evaluación, independiente del nivel.</p>
    ${Object.keys(TESTS).map((id) => `<div class="row" style="padding:3px 0"><span>${TESTS[id].name}</span>
      <b>${bests[id] != null ? `${fmtTest(id, bests[id])} · ${LETTERS[gradeOf(id, bests[id])]}` : '<span class="muted">pendiente</span>'}</b></div>`).join('')}
    ${S.reeval ? `<p class="center" style="margin:10px 0 0">Último rango por evaluación: <b class="gold">${gradeName(S.reeval.grade)}</b> <span class="muted">(${S.reeval.month})</span></p>` : ''}
    ${done ? '<p class="center muted">Ya te reevaluaste este mes.</p>'
      : `<button class="btn block" id="rankEval" ${n < 3 ? 'disabled' : ''}>${n < 3 ? `Faltan ${3 - n} prueba${3 - n === 1 ? '' : 's'} este mes` : 'Solicitar reevaluación'}</button>`}
  </div>`;
}

/* ================= PROGRESS CHARTS ================= */

const shortDate = (d) => `${+d.slice(8, 10)}/${+d.slice(5, 7)}`;

function lineChart(pts, { fmtV, goal, lower } = {}) {
  pts = [...pts].sort((p1, p2) => (p1.d < p2.d ? -1 : p1.d > p2.d ? 1 : 0));
  if (pts.length < 2) return '<p class="muted center" style="font-size:14px">Necesitás al menos 2 registros para ver la evolución.</p>';
  const W = 320, H = 140, L = 40, R = 12, T = 12, B = 24;
  const xs = pts.map((p) => new Date(p.d + 'T12:00').getTime());
  const vals = pts.map((p) => p.v).concat(goal != null ? [goal] : []);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.15 || 1; lo -= pad; hi += pad;
  const x = (t) => L + ((t - xs[0]) / (xs[xs.length - 1] - xs[0] || 1)) * (W - L - R);
  const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const ticks = [lo + pad, (lo + hi) / 2, hi - pad];
  const f = fmtV || ((v) => String(Math.round(v * 10) / 10));
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img">
    ${ticks.map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" class="axis">${f(v)}</text>`).join('')}
    ${goal != null ? `<line x1="${L}" x2="${W - R}" y1="${y(goal)}" y2="${y(goal)}" class="goal"/><text x="${W - R}" y="${y(goal) - 4}" text-anchor="end" class="axis">Meta ${f(goal)}</text>` : ''}
    <polyline points="${pts.map((p, i) => `${x(xs[i])},${y(p.v)}`).join(' ')}" class="series"/>
    ${pts.map((p, i) => `<circle cx="${x(xs[i])}" cy="${y(p.v)}" r="4" class="dot"/><circle cx="${x(xs[i])}" cy="${y(p.v)}" r="14" class="hit" data-tip="${shortDate(p.d)}: ${f(p.v)}"/>`).join('')}
    <text x="${L}" y="${H - 6}" class="axis">${shortDate(pts[0].d)}</text>
    <text x="${W - R}" y="${H - 6}" text-anchor="end" class="axis">${shortDate(pts[pts.length - 1].d)}</text>
  </svg><div class="chart-tip muted">Tocá un punto para ver el valor${lower ? ' · más bajo es mejor' : ''}</div></div>`;
}

function weeklyChart() {
  const weeks = [];
  for (let i = 7; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i * 7); weeks.push(weekStart(d)); }
  const data = weeks.map((w) => {
    let daily = 0, rout = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(w + 'T12:00'); d.setDate(d.getDate() + i);
      const L = (S.log || {})[today(d)];
      if (L && L.daily) daily++;
      if (L && L.routines) rout += L.routines.length;
    }
    return { w, daily, rout };
  });
  const W = 320, H = 140, L = 24, R = 8, T = 12, B = 24;
  const max = Math.max(7, ...data.map((d) => d.rout));
  const slot = (W - L - R) / data.length, bw = (slot - 10) / 2;
  const y = (v) => T + (1 - v / max) * (H - T - B);
  return `<div class="chart">
    <div class="legend"><span><i style="background:var(--c1)"></i>Diarias</span><span><i style="background:var(--c2)"></i>Rutinas</span></div>
    <svg viewBox="0 0 ${W} ${H}" role="img">
    ${[0, Math.round(max / 2), max].map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 4}" y="${y(v) + 4}" text-anchor="end" class="axis">${v}</text>`).join('')}
    ${data.map((d, i) => {
      const x0 = L + i * slot + 4;
      return `<rect x="${x0}" y="${y(d.daily)}" width="${bw}" height="${Math.max(0, y(0) - y(d.daily))}" rx="2" fill="var(--c1)"/>
        <rect x="${x0 + bw + 2}" y="${y(d.rout)}" width="${bw}" height="${Math.max(0, y(0) - y(d.rout))}" rx="2" fill="var(--c2)"/>
        <rect x="${x0 - 2}" y="${T}" width="${slot}" height="${H - T - B}" class="hit" data-tip="Semana del ${shortDate(d.w)}: ${d.daily} diarias · ${d.rout} rutinas"/>`;
    }).join('')}
    <text x="${L}" y="${H - 6}" class="axis">${shortDate(data[0].w)}</text>
    <text x="${W - R}" y="${H - 6}" text-anchor="end" class="axis">Esta semana</text>
  </svg><div class="chart-tip muted">Tocá una semana para ver el detalle</div></div>`;
}

function viewProgress() {
  const t = totals();
  const weights = S.weights.map((w) => ({ d: w.date, v: w.kg }));
  const testCharts = Object.keys(TESTS).map((id) => {
    const byDay = {};
    for (const r of S.tests[id] || []) byDay[r.date] = byDay[r.date] == null ? r.v : TESTS[id].lower ? Math.min(byDay[r.date], r.v) : Math.max(byDay[r.date], r.v);
    const pts = Object.entries(byDay).sort().map(([d, v]) => ({ d, v }));
    if (pts.length < 2) return '';
    return `<div class="label" style="margin-top:12px">${TESTS[id].name}</div>${lineChart(pts, { fmtV: (v) => fmtTest(id, Math.round(v)).replace(' reps', ''), lower: TESTS[id].lower })}`;
  }).join('');
  return `<div class="win"><div class="win-title">Progreso</div>
    <div class="label">Constancia (últimas 8 semanas)</div>${weeklyChart()}
    <div class="label" style="margin-top:12px">Peso (kg)</div>${lineChart(weights, { goal: S.profile ? +S.profile.answers.goalWeight : null })}
    ${testCharts || '<p class="muted" style="font-size:14px;margin-top:12px">Hacé las pruebas de fuerza más de una vez para ver cómo mejoran tus récords.</p>'}
    <hr><div class="label">Entrenamiento acumulado</div>
    ${REAL_GAINS.map(([id, stat, label, fn, every]) => {
      const v = fn(t), next = (Math.floor(v / every) + 1) * every;
      return `<div class="row" style="padding:3px 0;font-size:15px"><span>${label}: <b>${(Math.round(v * 10) / 10).toLocaleString('es')}</b></span>
        <span class="muted">${STATS[stat][1]} +1 en ${(Math.round((next - v) * 10) / 10).toLocaleString('es')}</span></div>`;
    }).join('')}
  </div>`;
}
