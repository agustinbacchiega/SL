'use strict';

/* ================= AKADEMIYA (study pillar, Varka theme only) ================= */

// All dialogue below is original text written for this app, inspired by the
// characters' personalities; none of it is quoted from the game.

const DARSHANS = {
  haravatat: {
    name: 'Haravatat', field: 'Idiomas, lectura y escritura', mentor: 'Alhaitham',
    bonus: 'El diario da el doble de XP y suma 10 créditos.', title: 'escriba',
    letters: [
      'Leer no es acumular páginas. Si no podés explicar lo que leíste en dos frases, no lo leíste.',
      'El ruido del Bazar no me molesta. Lo que me molesta es la gente que habla sin haber leído.',
      'Un idioma nuevo es otra forma de pensar. Vale la pena el esfuerzo.',
      'Hacé tu trabajo, después descansá. En ese orden.',
    ],
    seminars: [
      'Leé un ensayo o capítulo y resumilo en 5 líneas en la bitácora.',
      'Aprendé 20 palabras nuevas de otro idioma.',
      'Escribí un texto de 300 palabras sobre algo que te interese.',
      'Leé un artículo y anotá 3 ideas con las que no estés de acuerdo.',
      'Traducí un párrafo de otro idioma y compará tu versión con una traducción profesional.',
      'Escribí una carta a mano a alguien.',
      'Leé un poema dos veces y explicá qué cambió en la segunda lectura.',
      'Mirá una película o serie en otro idioma con subtítulos en ese idioma.',
      'Buscá el origen de 5 palabras que uses todos los días.',
      'Corregí un texto tuyo viejo como si fueras su editor.',
    ],
  },
  kshahrewar: {
    name: 'Kshahrewar', field: 'Ingeniería, diseño y programación', mentor: 'Kaveh',
    bonus: 'Los avances de la tesis dan +50%.', title: 'luz',
    letters: [
      'Un buen diseño no es el que impresiona, es el que alguien puede usar todos los días.',
      'Sí, volví a rehacer el plano. Si algo vale la pena, vale la pena hacerlo bien.',
      'No construyas solo para vos. Pensá en quién va a vivir adentro de lo que hacés.',
      'Las ideas lindas en la cabeza no sirven. Dibujalas, probalas, rompelas y volvé a empezar.',
    ],
    seminars: [
      'Diseñá o construí algo pequeño y útil para tu casa o tu rutina.',
      'Terminá un mini proyecto que tengas empezado.',
      'Dibujá el plano o diagrama de algo que quieras crear.',
      'Desarmá cómo funciona un objeto cotidiano y explicalo.',
      'Rediseñá un espacio de tu casa en papel para que sea más cómodo.',
      'Arreglá algo roto en lugar de reemplazarlo.',
      'Aprendé un atajo o herramienta nueva de tu programa o software favorito.',
      'Mirá un video sobre una obra de arquitectura famosa y anotá 3 decisiones de diseño.',
      'Hacé una lista de 10 problemas cotidianos que podrías resolver diseñando algo.',
      'Construí una maqueta simple con lo que tengas en casa.',
    ],
  },
  amurta: {
    name: 'Amurta', field: 'Biología, salud y ciencias de la vida', mentor: 'Tighnari',
    bonus: 'Los encargos diarios dan +50% de XP.', title: 'guardabosques',
    letters: [
      'El bosque te enseña paciencia: nada crece por apurarlo.',
      'Dormir bien no es pereza, es mantenimiento. Hasta los hongos lo saben.',
      'Antes de opinar sobre algo vivo, observalo un rato. Mucho más de lo que creés.',
      'Si estudiás salud y no la aplicás, solo coleccionás datos.',
    ],
    seminars: [
      'Aprendé 10 términos de tu área y escribí su definición.',
      'Investigá un tema de salud y aplicá un cambio concreto esta semana.',
      'Observá una planta o animal durante 15 minutos y anotá lo que notes.',
      'Leé sobre cómo funciona un órgano del cuerpo y explicalo con tus palabras.',
      'Cociná una comida balanceada y anotá sus nutrientes principales.',
      'Investigá qué pasa en el cuerpo cuando dormís mal.',
      'Aprendé a reconocer 5 plantas o árboles de tu zona.',
      'Llevá registro de tu hidratación 3 días seguidos.',
      'Leé sobre un hongo o microorganismo curioso y contáselo a alguien.',
      'Aprendé primeros auxilios básicos: qué hacer ante una quemadura o un corte.',
    ],
  },
  rtawahist: {
    name: 'Rtawahist', field: 'Matemática, lógica y astronomía', mentor: 'Layla',
    bonus: 'Estudiar después de las 21 h da +25%.', title: 'estrellas',
    letters: [
      'Si te cuesta un problema, dormí y volvé mañana... pero volvé, eh.',
      'Las estrellas no se apuran y aun así llegan a todos lados.',
      'No hace falta entenderlo todo hoy. Una ecuación a la vez.',
      'Si estudiás de noche, abrigate. Las estrellas no dan calor.',
    ],
    seminars: [
      'Resolvé 10 problemas o ejercicios de tu área.',
      'Explicá un concepto difícil como si se lo contaras a un chico.',
      'Observá el cielo nocturno 15 minutos e identificá algo.',
      'Encontrá el error en una demostración o razonamiento.',
      'Resolvé un acertijo de lógica sin mirar la solución.',
      'Calculá cuánto gastás por mes en algo cotidiano y proyectalo a un año.',
      'Aprendé a ubicar una constelación en el cielo.',
      'Estudiá una fórmula y explicá de dónde sale.',
      'Jugá una partida de ajedrez o un juego de estrategia y analizá un error tuyo.',
      'Hacé un gráfico con datos de tu propio entrenamiento.',
    ],
  },
  spantamad: {
    name: 'Spantamad', field: 'Física, química y ciencias', mentor: 'Lisa',
    bonus: 'Las pruebas de fuerza también dan 30 créditos.', title: 'rosa',
    letters: [
      'Desde Mondstadt te sigo, querido. No me hagas venir a revisar tus apuntes.',
      'La teoría sin práctica se evapora más rápido que el agua en un laboratorio.',
      'Estudiá tranquilo, con té, sin apuro. Pero estudiá.',
      'Lo que no entiendas, preguntalo. Lo que entiendas, enseñalo.',
    ],
    seminars: [
      'Entendé un experimento o fenómeno y explicalo por escrito.',
      'Repasá un tema con 10 ejercicios.',
      'Buscá la ciencia detrás de algo que hacés todos los días.',
      'Hacé un experimento casero seguro y anotá el resultado.',
      'Investigá cómo funciona la energía que usás en tu casa.',
      'Explicá por qué el cielo es celeste.',
      'Aprendé qué pasa químicamente cuando cocinás algo (por ejemplo, el pan).',
      'Leé sobre un científico o científica y su descubrimiento más importante.',
      'Medí algo de tu entorno durante una semana (temperatura, ruido, luz) y sacá conclusiones.',
      'Resolvé 5 problemas de física aplicados a tu entrenamiento.',
    ],
  },
  vahumana: {
    name: 'Vahumana', field: 'Historia, filosofía y sociedad', mentor: 'Wanderer',
    bonus: 'Cada tesis defendida da +1 PER extra.', title: 'testigo',
    letters: [
      '¿Historia? Vi suficiente como para saber que la gente repite los mismos errores. Intentá no ser uno de ellos.',
      'Tus opiniones no valen nada si no podés defenderlas. Leé primero.',
      'No me aburras con resúmenes. Decime qué pensás vos.',
      'Hmph. Al menos estás estudiando. Ya es más que la mayoría.',
    ],
    seminars: [
      'Leé sobre un hecho histórico y escribí tu opinión.',
      'Debatí una idea con alguien y anotá su mejor argumento.',
      'Leé un texto filosófico corto y explicá con qué no estás de acuerdo.',
      'Investigá el origen de una costumbre de tu país.',
      'Preguntale a una persona mayor cómo era su vida a tu edad.',
      'Leé sobre una civilización antigua y anotá algo que todavía usemos.',
      'Escribí qué harías distinto si vivieras hace 200 años.',
      'Visitá un museo, un monumento o un lugar histórico de tu ciudad.',
      'Leé dos noticias del mismo hecho en medios distintos y compará.',
      'Escribí un párrafo defendiendo una postura que no compartís.',
    ],
  },
};

const BEGINNER_SEMINARS = [
  'Armá un horario de estudio para esta semana.',
  'Elegí un tema para aprender este mes y anotá por qué.',
  'Estudiá 3 días seguidos al menos 20 minutos.',
  'Prepará tu lugar de estudio: ordenado, con buena luz y sin distracciones.',
  'Probá una sesión 25 / 5 y anotá cómo te sentiste.',
];
const HARD_SEMINARS = [
  'Estudiá 4 horas en total esta semana sin redes sociales mientras lo hacés.',
  'Escribí un ensayo de 800 palabras defendiendo una postura.',
  'Enseñale a alguien un tema completo de tu área.',
  'Leé un libro corto completo esta semana.',
  'Estudiá al menos 30 minutos todos los días de esta semana.',
];
const CYNO_JOKES = [
  '¿Sabés por qué los libros nunca tienen frío? Porque tienen tapas.',
  '¿Qué le dijo el lápiz a la goma? "Contigo cometo errores sin miedo."',
  'Estudiar sin descansar es como leer con los ojos cerrados: muy dramático, poco útil.',
];
const ACADEMIC_RANKS = [[0, 'Aspirante'], [5, 'Estudiante'], [20, 'Investigador'], [50, 'Erudito'], [100, 'Sabio']];
const STUDY_GOALS = [0, 15, 30, 45, 60, 90, 120];

const akaOn = () => S.theme === 'varka';
const aka = () => (S.aka = S.aka || { darshan: null, mins: 0, credits: 0, goal: 30, theses: 0 });
const studyHours = () => aka().mins / 60;
const academicRank = () => ACADEMIC_RANKS.filter(([h]) => studyHours() >= h).pop()[1];
const studiedToday = () => ((S.log || {})[today()] || {}).study || 0;
const monthKey = () => today().slice(0, 7);
const seed = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 7);
let routTab = 'train';
let studySession = null; // { mode: 'pomo'|'free', phase: 'study'|'break', start, end }

function addCredits(n) {
  const a = aka();
  a.credits += n;
  if (!a.month || a.month.id !== monthKey()) a.month = { id: monthKey(), earned: 0 };
  a.month.earned += n;
}

function enroll(id) {
  const a = aka();
  if (a.darshan && a.darshanMonth === monthKey()) return;
  const first = !a.darshan;
  a.darshan = id; a.darshanMonth = monthKey();
  if (first) {
    a.enrolled = today();
    notify('Akademiya', `Bienvenido a la Akademiya de Sumeru.\n\nGracias a la recomendación de Lisa, ahora sos estudiante del Darshan <b>${DARSHANS[id].name}</b>.\nTu mentor: <b>${DARSHANS[id].mentor}</b>.\n\n"Te explico rápido: estudiás, sumás créditos, subís de rango y cada mes presentás una tesis. Si te perdés, preguntame. Y no, no te voy a hacer la tarea."\n— Faruzan`);
  } else {
    notify('Akademiya', `Te cambiaste al Darshan <b>${DARSHANS[id].name}</b>.\nTu nuevo mentor: <b>${DARSHANS[id].mentor}</b>.\n\nPodrás volver a cambiar el mes que viene.`);
  }
  save(); render();
}

function recordStudy(min) {
  if (min < 1) return;
  const a = aka(), L = dayLog();
  const before = L.study || 0;
  L.study = before + min;
  a.mins += min;
  a.lastStudy = today();
  let mult = 1;
  if (a.darshan === 'rtawahist' && new Date().getHours() >= 21) mult += 0.25;
  if (a.capsule) { mult *= 2; a.capsule = false; }
  const cr = Math.round(min * mult);
  addCredits(cr);
  const xp = gainXP(Math.round(min * 2 * mult), 'study');
  let msg = `Sesión de estudio: <b>${min} min</b>\n\nXP +${xp} · Créditos +${cr}${mult >= 2 ? '\n(Cápsula de Conocimiento: ×2)' : ''}`;
  if (a.goal && before < a.goal && L.study >= a.goal) {
    gainXP(50, 'study');
    hitBoss('study');
    msg += `\n\n✔ Meta de estudio del día cumplida (${a.goal} min)\nXP +50`;
  }
  const rankBefore = ACADEMIC_RANKS.filter(([h]) => (a.mins - min) / 60 >= h).pop()[1];
  if (academicRank() !== rankBefore) {
    msg += `\n\n🎓 Nuevo rango académico: <b>${academicRank()}</b>`;
    if (academicRank() === 'Sabio') sageReward();
  }
  notify('Akademiya', msg);
  save(); render();
}

function sageReward() {
  const a = aka();
  addItem('stone'); gainProto(320);
  if (a.darshan) unlockTitle(DARSHANS[a.darshan].title);
  notify('Akademiya', '"Cien horas buscando entender el mundo. Eso no es solo estudiar: es una forma de vivir. Estoy orgullosa de vos."\n— Nahida\n\nRecompensas:\n• 💠 Piedra Rúnica\n• 💎 320\n• Título de tu Darshan');
}

// ---- study timer ----
function startStudy(mode) {
  studySession = { mode, phase: 'study', start: Date.now(), end: mode === 'pomo' ? Date.now() + 25 * 60e3 : null };
  render();
}

function stopStudy() {
  const s = studySession;
  studySession = null;
  if (s && s.phase === 'study') recordStudy(Math.floor((Date.now() - s.start) / 60e3));
  else render();
}

function akaTick() {
  const s = studySession;
  if (!s) return;
  const el = $('#studyClock');
  if (s.mode === 'pomo' && Date.now() >= s.end) {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    if (s.phase === 'study') {
      studySession = { mode: 'pomo', phase: 'break', start: Date.now(), end: Date.now() + 5 * 60e3 };
      recordStudy(25);
    } else {
      studySession = { mode: 'pomo', phase: 'study', start: Date.now(), end: Date.now() + 25 * 60e3 };
      render();
    }
    return;
  }
  if (el) el.textContent = s.mode === 'pomo' ? fmtMin(Math.ceil((s.end - Date.now()) / 1000)) : fmt((Date.now() - s.start) / 1000);
}

// ---- weekly seminar ----
function ensureSeminar() {
  const a = aka();
  if (!a.darshan) return;
  const wk = weekStart();
  if (a.sem && a.sem.week === wk) return;
  const beginner = a.enrolled && Date.now() - new Date(a.enrolled + 'T12:00') < 7 * 864e5;
  const hard = !beginner && Math.random() < 0.15;
  const pool = beginner ? BEGINNER_SEMINARS : hard ? HARD_SEMINARS : DARSHANS[a.darshan].seminars;
  a.sem = { week: wk, task: pick(pool), who: beginner ? 'Collei' : hard ? 'Wanderer' : DARSHANS[a.darshan].mentor, hard, done: false };
  save();
}

function completeSeminar() {
  const a = aka();
  if (!a.sem || a.sem.done) return;
  a.sem.done = true;
  a.semDone = (a.semDone || 0) + 1;
  const k = a.sem.hard ? 2 : 1;
  addCredits(60 * k);
  gainProto(80 * k);
  const xp = gainXP(150 * k, 'study');
  hitBoss('study');
  dayLog().seminar = a.sem.task;
  notify('Seminario', `${a.sem.hard ? '"...Aceptable. No esperaba menos, pero tampoco más."\n— Wanderer' : `"Bien hecho."\n— ${a.sem.who}`}\n\nXP +${xp} · Créditos +${60 * k}`);
  save(); render();
}

// ---- monthly thesis ----
function proposeThesis() {
  const topic = ($('#thTopic').value || '').trim();
  if (topic.length < 3) return;
  const steps = [1, 2, 3, 4].map((i) => ({ text: ($(`#thStep${i}`).value || '').trim() || `Avance ${i}`, done: false }));
  aka().thesis = { month: monthKey(), topic, steps, defended: false };
  notify('Akademiya', `Tesis registrada:\n<b>${esc(topic)}</b>\n\nTenés hasta fin de mes para completar los 4 avances y defenderla.`);
  save(); render();
}

function thesisStep(i) {
  const t = aka().thesis;
  if (!t || t.steps[i].done) return;
  t.steps[i].done = true;
  const k = aka().darshan === 'kshahrewar' ? 1.5 : 1;
  addCredits(Math.round(40 * k));
  const xp = gainXP(Math.round(60 * k), 'study');
  notify('Akademiya', `Avance de tesis completado:\n<b>${esc(t.steps[i].text)}</b>\n\nXP +${xp} · Créditos +${Math.round(40 * k)}`);
  save(); render();
}

function defendThesis() {
  const a = aka(), t = a.thesis;
  const summary = ($('#thSummary').value || '').trim();
  if (!t || t.defended || !t.steps.every((x) => x.done) || summary.length < 80) return;
  t.defended = true; t.summary = summary;
  a.theses = (a.theses || 0) + 1;
  archiveThesis(t, a.darshan);
  addCredits(300);
  gainProto(160);
  const xp = gainXP(400, 'study');
  if (a.darshan === 'vahumana') S.stats.per += 1;
  unlockTitle('thesis');
  dayLog().thesis = t.topic;
  notify('Defensa de Tesis', `"Lo explicaste con tus propias palabras. Eso es lo que separa a quien memoriza de quien entiende."\n— Nahida\n\nTesis aprobada: <b>${esc(t.topic)}</b>\n\nXP +${xp} · Créditos +300${a.darshan === 'vahumana' ? '\nPER +1 (Vahumana)' : ''}`);
  save(); render();
}

// ---- the Matra (Cyno) ----
function akaChecks() {
  if (!akaOn() || !S.aka || !S.aka.darshan) return;
  const a = aka();
  // Thesis from a past month that was never defended: the Matra take part of that month's credits.
  if (a.thesis && !a.thesis.defended && a.thesis.month < monthKey()) {
    const lost = a.month && a.month.id === a.thesis.month ? Math.round(a.month.earned * 0.3) : 0;
    a.credits = Math.max(0, a.credits - lost);
    notify('Matra', `Tu tesis <b>${esc(a.thesis.topic)}</b> quedó sin defender.\n\nLa Akademiya registra una falta académica: −${lost} créditos.\n\n"${pick(CYNO_JOKES)}"\n— Cyno, Gran Mahamatra`, { danger: true });
    a.thesis = null;
    save();
    return;
  }
  // Three days without studying while a thesis is in progress: a warning from Cyno.
  if (a.thesis && !a.thesis.defended && a.warned !== today()) {
    const last = new Date((a.lastStudy || a.thesis.month + '-01') + 'T12:00');
    if (Date.now() - last > 3 * 864e5) {
      a.warned = today();
      notify('Matra', `Llevás 3 días sin estudiar y tenés una tesis en curso.\n\n"Los Matra vigilan. No me obligues a visitarte."\n— Cyno\n\nPD: ${pick(CYNO_JOKES)}`, { danger: true });
      save();
    }
  }
}

// ---- Nahida: one letter per week (original text) ----
const NAHIDA_LETTERS = [
  'Aprender no es llenar un recipiente, es encender una lámpara. Cuidá esa luz esta semana.',
  'Cuando algo no te salga, preguntate qué te está enseñando. A veces la respuesta es más interesante que el éxito.',
  'Descansar también es parte de estudiar. Los sueños ordenan lo que aprendiste durante el día.',
  'No compares tu camino con el de otros. Cada árbol crece a su propio ritmo.',
  'Si una pregunta te persigue, no huyas. Seguila: suele llevar a lugares hermosos.',
  'Enseñarle algo a otra persona es la mejor forma de descubrir si realmente lo entendiste.',
  'La curiosidad es como una semilla: con un poco de constancia, se vuelve un bosque.',
  'Esta semana, intentá aprender algo solo porque te da curiosidad, sin pensar si sirve.',
];

function readNahida() {
  const a = aka();
  if (a.nahida === weekStart()) return;
  a.nahida = weekStart();
  addCredits(20);
  notify('Akademiya', '"Gracias por leerme."\n— Nahida\n\nCréditos +20');
  save(); render();
}

// ---- Dori's credit shop ----
const CREDIT_SHOP = [
  ['capsule', '🧠 Cápsula de Conocimiento', 'Tu próxima sesión rinde el doble.', 80, () => addItem('capsule')],
  ['box', '🎁 Cofre de Mondstadt', 'Un objeto al azar.', 120, () => addItem('box')],
  ['key', '🗝️ Llave de Dominio', 'Abre un dominio.', 150, () => addItem('key')],
  ['primo', '💎 160 Protogemas', 'Un deseo.', 250, () => { S.gear.primos += 160; }],
  ['stone', '📜 Sello de la Orden', '+1 punto de habilidad.', 400, () => addItem('stone')],
];

function buyWithCredits(id) {
  const it = CREDIT_SHOP.find((x) => x[0] === id), a = aka();
  if (!it || a.credits < it[3]) return;
  a.credits -= it[3];
  it[4]();
  notify('Dori', `"¡Un placer hacer negocios con vos! Volvé cuando tengas más créditos~"\n— Dori\n\nCompraste: <b>${it[1]}</b>`);
  save(); render();
}

function archiveThesis(t, darshan) {
  const a = aka();
  a.archive = a.archive || [];
  if (!a.archive.some((x) => x.month === t.month)) a.archive.unshift({ month: t.month, topic: t.topic, summary: t.summary || '', darshan, steps: t.steps.map((x) => x.text) });
}

// ---- views ----
function viewRoutinesTabs(trainingHtml) {
  if (!akaOn()) return trainingHtml;
  const seg = `<div class="seg"><button data-rtab="train" class="${routTab === 'train' ? 'on' : ''}">Entrenamiento</button><button data-rtab="study" class="${routTab === 'study' ? 'on' : ''}">Estudio</button></div>`;
  return seg + (routTab === 'study' ? viewStudy() : trainingHtml);
}

function viewStudy() {
  const a = aka();
  if (!a.darshan) {
    return `<div class="win"><div class="win-title">Akademiya de Sumeru</div>
      <p style="margin-top:0;font-style:italic">"Te recomendé a la Akademiya, querido. Elegí tu Darshan con cuidado: es la escuela que te va a acompañar."<br><span class="muted">— Lisa</span></p>
      ${Object.entries(DARSHANS).map(([id, d]) => `<div class="item"><div class="info"><b>${d.name}</b> <span class="tag">${d.mentor}</span>
        <div class="desc">${d.field}<br>Bonus: ${d.bonus}</div></div><button class="btn small" data-darshan="${id}">Elegir</button></div>`).join('')}
    </div>`;
  }
  ensureSeminar();
  if (a.thesis && a.thesis.defended) archiveThesis(a.thesis, a.darshan);
  const d = DARSHANS[a.darshan], s = studySession, sem = a.sem, t = a.thesis && a.thesis.month === monthKey() ? a.thesis : null;
  const letter = d.letters[seed(today()) % d.letters.length];
  const nextRank = ACADEMIC_RANKS.find(([h]) => studyHours() < h);
  const canChange = a.darshanMonth !== monthKey();
  return `<div class="win"><div class="win-title">Carta de ${d.mentor}</div>
      <p style="font-style:italic;margin-top:0">"${letter}"</p>
      <p class="muted" style="text-align:right;margin:0">— ${d.mentor}, Darshan ${d.name}</p></div>
    <div class="win"><div class="win-title">Carta de Nahida</div>
      <p style="font-style:italic;margin-top:0">"${NAHIDA_LETTERS[seed(weekStart()) % NAHIDA_LETTERS.length]}"</p>
      <div class="row"><span class="muted" style="font-size:13px">Una nueva cada lunes</span>
        ${a.nahida === weekStart() ? '<span class="check">✔</span>' : '<button class="btn small" id="nahidaRead">Leída · +20 créditos</button>'}</div></div>
    <div class="win"><div class="win-title">Sesión de Estudio</div>
      <div class="row"><span class="label">Hoy</span><b>${studiedToday()} / ${a.goal || '—'} min</b></div>
      ${a.goal ? bar('', Math.min(studiedToday(), a.goal), a.goal) : ''}
      ${s ? `<div class="label center" style="margin-top:8px">${s.phase === 'study' ? 'Estudiando' : 'Descanso'}${s.mode === 'pomo' ? ' · bloques de 25/5' : ''}</div>
          <div class="center big-level" style="font-size:44px;margin:6px 0" id="studyClock">${s.mode === 'pomo' ? fmtMin(Math.ceil((s.end - Date.now()) / 1000)) : fmt((Date.now() - s.start) / 1000)}</div>
          <button class="btn block" id="studyStop">${s.phase === 'study' ? 'Terminar y guardar' : 'Terminar'}</button>`
        : `<div class="grid2" style="margin-top:10px"><button class="btn" id="studyPomo">25 / 5</button><button class="btn" id="studyFree">Libre</button></div>`}
      ${a.capsule ? '<p class="center gold" style="font-size:14px">Cápsula de Conocimiento activa: próxima sesión ×2</p>' : ''}
      <div class="row" style="margin-top:10px"><span class="muted" style="font-size:14px">Meta diaria</span>
        <select id="studyGoal" style="width:auto">${STUDY_GOALS.map((g) => `<option value="${g}" ${a.goal === g ? 'selected' : ''}>${g ? g + ' min' : 'Sin meta'}</option>`).join('')}</select></div>
    </div>
    <div class="win"><div class="win-title">Seminario Semanal</div>
      <p class="center" style="margin-top:0"><b>${sem.who}</b>${sem.hard ? ' <span class="tag">difícil · ×2</span>' : ''}</p>
      <p style="margin:6px 0"><b>${sem.task}</b></p>
      <p class="muted" style="font-size:13px;margin:4px 0">Recompensa: ${150 * (sem.hard ? 2 : 1)} XP · ${60 * (sem.hard ? 2 : 1)} créditos · 💎 ${80 * (sem.hard ? 2 : 1)}</p>
      ${sem.done ? '<p class="center" style="color:var(--accent)">✔ Completado</p>' : '<button class="btn block" id="semDone">Completado</button>'}
    </div>
    <div class="win"><div class="win-title">Tesis del Mes</div>
      ${!t ? `<p class="muted" style="margin-top:0;font-size:14px">Elegí un tema para investigar este mes y 4 avances, más o menos uno por semana.</p>
          <input id="thTopic" placeholder="Tema de la tesis" maxlength="80">
          ${[1, 2, 3, 4].map((i) => `<input id="thStep${i}" placeholder="Avance ${i} (opcional)" maxlength="60" style="margin-top:6px">`).join('')}
          <button class="btn block" id="thPropose">Registrar tesis</button>`
        : t.defended ? `<p class="center" style="margin-top:0"><b>${esc(t.topic)}</b><br><span style="color:var(--accent)">✔ Defendida y aprobada</span></p>`
        : `<p class="center" style="margin-top:0"><b>${esc(t.topic)}</b></p>
          ${t.steps.map((st, i) => `<div class="goal ${st.done ? 'done' : ''}"><span class="name">${esc(st.text)}</span>${st.done ? '<span class="check">✔</span>' : `<button class="btn small" data-thstep="${i}">Hecho</button>`}</div>`).join('')}
          ${t.steps.every((x) => x.done) ? `<textarea id="thSummary" rows="4" maxlength="1500" placeholder="Resumí qué aprendiste (mínimo 80 caracteres)"></textarea>
            <button class="btn block" id="thDefend">Defender ante Nahida</button>` : '<p class="muted" style="font-size:13px">Completá los 4 avances para defenderla.</p>'}`}
    </div>
    ${fold('dori', `${a.credits.toLocaleString('es')} créditos`, `<div class="win"><div class="win-title">Tienda de Dori</div>
      <p class="muted" style="margin-top:0;font-size:14px">"¿Créditos académicos? ¡Claro que los acepto! Todo tiene precio~"</p>
      ${CREDIT_SHOP.map(([id, name, desc, cost]) => `<div class="item"><div class="info"><b>${name}</b><div class="desc">${desc}</div></div>
        <button class="btn small" data-cbuy="${id}" ${a.credits < cost ? 'disabled' : ''}>${cost} cr</button></div>`).join('')}
    </div>`)}
    ${(a.archive || []).length ? fold('archive', `${a.archive.length} tesis`, `<div class="win"><div class="win-title">Archivo de Tesis</div>
      ${a.archive.map((x) => `<details style="padding:6px 0;border-bottom:1px dashed rgba(143,207,90,.3)"><summary><b>${esc(x.topic)}</b> <span class="muted" style="font-size:13px">${x.month} · ${DARSHANS[x.darshan] ? DARSHANS[x.darshan].name : ''}</span></summary>
        <p style="font-size:14px;white-space:pre-line">${esc(x.summary)}</p>
        <div class="muted" style="font-size:13px">Avances: ${x.steps.map(esc).join(' · ')}</div></details>`).join('')}
    </div>`) : ''}
    <div class="win"><div class="win-title">Expediente</div>
      <div class="row"><span>Darshan</span><b>${d.name}</b></div>
      <div class="row"><span>Rango académico</span><b class="gold">${academicRank()}</b></div>
      <div class="row"><span>Horas de estudio</span><b>${(Math.round(studyHours() * 10) / 10).toLocaleString('es')} h</b></div>
      ${nextRank ? `${bar('', studyHours(), nextRank[0])}<div class="muted" style="font-size:13px;text-align:right">${nextRank[1]} a las ${nextRank[0]} h</div>` : ''}
      <div class="row"><span>Créditos</span><b>${a.credits.toLocaleString('es')}</b></div>
      <div class="row"><span>Tesis defendidas</span><b>${a.theses || 0}</b></div>
      <p class="muted" style="font-size:13px">Bonus de ${d.name}: ${d.bonus}</p>
      ${canChange ? `<details><summary class="muted" style="font-size:14px">Cambiar de Darshan (1 vez por mes)</summary>
        ${Object.entries(DARSHANS).filter(([id]) => id !== a.darshan).map(([id, x]) => `<div class="row" style="padding:4px 0"><span>${x.name} · ${x.mentor}</span><button class="btn small" data-darshan="${id}">Cambiar</button></div>`).join('')}</details>` : ''}
    </div>`;
}

function studyWeeksChart() {
  const pts = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i * 7);
    const w = weekStart(d);
    let m = 0;
    for (let k = 0; k < 7; k++) { const x = new Date(w + 'T12:00'); x.setDate(x.getDate() + k); m += ((S.log || {})[today(x)] || {}).study || 0; }
    pts.push({ d: w, v: Math.round((m / 60) * 10) / 10 });
  }
  return lineChart(pts, { fmtV: (v) => `${Math.round(v * 10) / 10} h` });
}
