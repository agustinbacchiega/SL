'use strict';

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
    equipped: null, event: null, eventDay: null, tests: {}, prs: 0, emergencies: 0, sideDone: 0, ach: {},
    journal: {},
    gear: { primos: 1600, pity5: 0, pity4: 0, inv: {}, eq: {} },
    pause: null, pauseDays: [], comm: null, season: null, seasonWins: 0, wreq: null, wreqDone: 0, friends: {},
    gm: { unlocked: false, active: false, trial: null, lastFail: null, misses: [], perfect: null },
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
      st.tests = st.tests || {};
      st.journal = st.journal || {};
      st.gear = Object.assign(defaultState().gear, st.gear);
      st.gm = Object.assign(defaultState().gm, st.gm);
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
  checkRealStats();
  checkAchievements();
  gmReadyNotice();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
}

/* ================= DERIVED ================= */

const maxHP = () => 100 + (S.level - 1) * 20 + (S.stats.vit - 10) * 10;
const maxMP = () => 10 + (S.level - 1) * 5 + (S.stats.int - 10) * 10;
// Tuned so level 100 takes roughly 1–1.5 years of steady daily play.
const xpNeeded = (lv = S.level) => Math.round(60 + 15 * lv + 0.25 * lv * lv);
const RANKS_VARKA = ['Recluta', 'Escudero', 'Caballero', 'Caballero de Élite', 'Capitán', 'Gran Maestro Adjunto', 'Gran Maestro'];
const rank = () => {
  const i = RANKS.filter(([lv]) => S.level >= lv).length - 1;
  return S.theme === 'varka' ? RANKS_VARKA[i] : RANKS[i][1];
};
const EX_VARKA = { pushups: 'Flexiones de caballero', situps: 'Abdominales de escudero', squats: 'Sentadillas del mandoble', run: 'Marcha de expedición' };
const exLabel = (k) => (S.theme === 'varka' ? EX_VARKA[k] : EXERCISES[k].name);

// Letters "sent" by Varka from the expedition (original flavor text).
const VARKA_LETTERS = [
  'Caballeros: la expedición sigue avanzando hacia el norte. Si nosotros caminamos con nieve hasta las rodillas, ustedes pueden completar su entrenamiento de hoy.',
  'Un caballero no entrena para lucirse en un desfile. Entrena para que, el día que lo necesiten, su cuerpo no le falle.',
  'Hoy cargamos las provisiones montaña arriba. Al final, los más fuertes no eran los más grandes: eran los que no se detuvieron.',
  'Jean me escribe que Mondstadt está en buenas manos. Asegúrense de que también lo esté su propio cuerpo.',
  'La disciplina es un viento constante: no derriba nada en un día, pero con los años mueve montañas.',
  'Si fallan un día, no se castiguen dos. Levántense, coman bien y vuelvan al patio de entrenamiento.',
  'Mis piernas recuerdan cada marcha de esta expedición. Las suyas recordarán cada sentadilla.',
  'Descansar no es rendirse. Hasta el lobo del norte duerme antes de la cacería.',
  'Un mandoble pesado se vuelve ligero en las manos de quien lo levanta cada día.',
  'Cuando vuelva a Mondstadt, quiero ver caballeros más fuertes que cuando me fui. Ese es mi único pedido.',
  'El frío de estas tierras enseña algo simple: el que deja de moverse, pierde.',
  'Hoy un recluta me preguntó cuál es el secreto de la fuerza. Le respondí: repetirlo mañana.',
];
const letterOfDay = () => {
  const list = gmOn() ? GM_LETTERS : VARKA_LETTERS;
  return list[[...today()].reduce((h, c) => h + c.charCodeAt(0), 0) % list.length];
};
const skillUnlocked = (s) => (s.job ? S.job !== 'Ninguno' : S.level >= s.lv);
const maxSlots = () => 3 + (S.level >= 25 ? 1 : 0) + (S.job !== 'Ninguno' ? 1 : 0);
const hasSkill = (name) => SKILLS.some((s) => s.name === name && skillUnlocked(s) && (s.job || (S.equipped || []).includes(name)));
function ensureEquipped() {
  if (!Array.isArray(S.equipped)) S.equipped = SKILLS.filter((s) => !s.job && skillUnlocked(s)).slice(0, maxSlots()).map((s) => s.name);
}
const titleIs = (id) => S.title === id;

function decayFatigue() {
  const hours = (Date.now() - S.fatigueAt) / 3.6e6;
  S.fatigue = Math.max(0, S.fatigue - hours * (hasSkill('Regeneración') ? 16 : 8) * (1 + gearBonus().fat));
  S.fatigueAt = Date.now();
}

function dailyComplete(d = S.daily) {
  return Object.keys(S.targets).every((k) => d.progress[k] >= tgt(k));
}
