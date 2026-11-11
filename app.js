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
  early: { name: 'Coraje del Débil', desc: 'Misión secreta: completar la misión diaria antes de las 7:00.', bonus: 'XP diaria +10%', secret: true },
  iron: { name: 'Voluntad Inquebrantable', desc: '7 misiones diarias seguidas.', bonus: 'XP diaria +15%' },
  demon: { name: 'Cazador de Demonios', desc: '30 misiones diarias seguidas.', bonus: 'Oro +50%' },
  beyond: { name: 'El que Superó sus Límites', desc: 'Superaste el doble de los objetivos diarios en un día.', bonus: 'XP de misiones secundarias +25%' },
  body: { name: 'Cuerpo Despertado', desc: 'Alcanzaste tu peso objetivo.', bonus: 'Todas las estadísticas se sienten más ligeras (XP +10%)' },
  red: { name: 'Superviviente de la Puerta Roja', desc: 'Despejar una Puerta Roja (mazmorra rara).', bonus: 'XP de mazmorras +20%' },
  double: { name: 'Elegido del Templo', desc: 'Sobreviviste a la Mazmorra Doble.', bonus: 'Toda la XP +15%', secret: true },
  conqueror: { name: 'Conquistador de Mazmorras', desc: 'Despejar 25 mazmorras.', bonus: 'Oro +25%' },
  disciplined: { name: 'Disciplinado', desc: 'Completar 50 rutinas.', bonus: 'XP de rutinas +25%' },
  responder: { name: 'Respuesta Inmediata', desc: 'Superar 10 misiones de emergencia.', bonus: 'XP de emergencias +50%' },
  legend: { name: 'Leyenda Viviente', desc: '100 misiones diarias seguidas.', bonus: 'Toda la XP +20%' },
  fist: { name: 'Puño de Hierro', desc: 'Prueba de fuerza: 50 flexiones seguidas.', bonus: 'XP de pruebas de fuerza +25%' },
  legs: { name: 'Piernas de Acero', desc: 'Prueba de fuerza: 50 sentadillas en 1 minuto.', bonus: 'XP de pruebas de fuerza +25%' },
  wall: { name: 'Muro Inamovible', desc: 'Prueba de fuerza: 3 minutos de plancha.', bonus: 'XP de pruebas de fuerza +25%' },
  engine: { name: 'Motor Incansable', desc: 'Prueba de fuerza: 60 burpees en 3 minutos.', bonus: 'XP de pruebas de fuerza +25%' },
  wind: { name: 'Pies de Viento', desc: 'Prueba de fuerza: 1 km en menos de 4:30.', bonus: 'XP de pruebas de fuerza +25%' },
  monarch: { name: 'Monarca de las Sombras', desc: 'Alcanzaste el nivel 100.', bonus: 'Toda la XP +25%' },
};

const SKILLS = [
  { lv: 1, name: 'Tenacidad', type: 'Pasiva', desc: 'Mientras el HP esté bajo el 30%, la XP obtenida aumenta un 50%.' },
  { lv: 5, name: 'Sprint', type: 'Activa', desc: 'Cada km corrido otorga +10% de XP extra.' },
  { lv: 8, name: 'Ojo del Mercader', type: 'Pasiva', desc: 'Los precios de la tienda bajan un 15%.' },
  { lv: 10, name: 'Sed de Sangre', type: 'Activa', desc: 'Las mazmorras instantáneas otorgan +1 Caja Aleatoria.' },
  { lv: 12, name: 'Respiración Profunda', type: 'Pasiva', desc: 'Las rutinas otorgan +20 XP.' },
  { lv: 15, name: 'Instinto del Cazador', type: 'Pasiva', desc: 'Los eventos aleatorios aparecen más seguido y las mazmorras raras son más probables.' },
  { lv: 20, name: 'Sigilo', type: 'Activa', desc: 'Una vez por semana, evita un castigo (consume 100 MP).' },
  { lv: 25, name: 'Fortuna', type: 'Pasiva', desc: 'Las Cajas Aleatorias dan mejores objetos.' },
  { lv: 30, name: 'Daga Mortal', type: 'Activa', desc: 'Las misiones secundarias otorgan +10 de oro.' },
  { lv: 35, name: 'Regeneración', type: 'Pasiva', desc: 'La fatiga baja el doble de rápido.' },
  { lv: 45, name: 'Autoridad del Gobernante', type: 'Activa', desc: 'Todo el oro obtenido aumenta un 20%.' },
  { lv: 55, name: 'Intención Asesina', type: 'Activa', desc: 'Las pruebas de fuerza otorgan el doble de XP.' },
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

const BOSSES = [
  ['Lycan de Colmillos de Acero', 'Goblin Hechicero', 'Araña Gigante de la Cueva'],
  ['Kasaka, la Serpiente Venenosa', 'Hobgoblin Jefe', 'Lobo de Escarcha'],
  ['Caballero Sangriento Igris', 'Orco Chamán', 'Golem de Piedra'],
  ['Cerbero, Guardián del Castillo', 'Kargalgan, Chamán de los Alto Orcos', 'Reina de las Hormigas'],
  ['Vulcan, Señor de los Demonios', 'Baruka, el Elfo de Hielo', 'Metus, el Liche'],
  ['Baran, el Rey Demonio', 'El Rey Hormiga', 'Kamish, el Dragón'],
];
const BOSSES_VARKA = [
  ['Mitachurl con escudo', 'Mago Abismal de Hidro', 'Slime Anemo gigante'],
  ['Lawachurl de Piedra', 'Cazadores de Tesoros Fatui', 'Lobo de Wolvendom'],
  ['Heraldo del Abismo', 'Agente Pirotécnico Fatui', 'Guardián de las Ruinas'],
  ['Hipóstasis Anemo', 'Regisvine Criogénica', 'Cazador de las Ruinas'],
  ['Dvalin, el Dragón del Viento', 'Hipóstasis Criogénica', 'Lector del Abismo'],
  ['Andrius, Señor de los Lobos', 'Dvalin enfurecido', 'Heraldo del Abismo Supremo'],
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
  const r = Math.random(), luck = hasSkill('Instinto del Cazador') ? 0.06 : 0;
  const variant = r < 0.07 + luck ? 'double' : r < 0.27 + luck * 2 ? 'red' : 'normal';
  const waves = variant === 'normal' ? 2 : 3;
  const vm = variant === 'normal' ? 1 : 1.3;
  const picked = [];
  while (picked.length < waves) {
    const e = weighted[Math.floor(Math.random() * weighted.length)];
    if (!picked.includes(e)) picked.push(e);
  }
  const timed = pool.filter((e) => e[2] === 'sec' && !picked.includes(e));
  const boss = timed[Math.floor(Math.random() * timed.length)];
  const step = (e, mult) => {
    const n = e[2] === 'sec' ? Math.round((e[1] * D.m * mult * vm) / 15) * 15 : Math.round(e[1] * D.m * mult * vm);
    return { name: e[0], n, unit: e[2], done: false };
  };
  const bosses = (S.theme === 'varka' ? BOSSES_VARKA : BOSSES)[tier];
  return {
    name: variant === 'double' ? 'Mazmorra Doble: Templo de Cartenon' : (variant === 'red' ? 'Puerta Roja · ' : '') + D.name,
    variant,
    boss: variant === 'double' ? 'La Estatua de Dios' : bosses[Math.floor(Math.random() * bosses.length)],
    xp: Math.round(D.xp * { normal: 1, red: 1.6, double: 2.5 }[variant]),
    steps: [...picked.map((e) => step(e, 1)), step(boss, 1.5)], run: null, done: false,
  };
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

// Varka's regimen: loaded carries, long marches and combat drills, the kind of
// training a Grand Master leading a years-long expedition would demand.
const ROUTINES_VARKA = {
  juramento: { name: 'Juramento del Recluta', sub: 'Cuerpo completo · principiante', stat: 'vit', rest: 60, scale: 'str', lore: 'Todo caballero empezó jurando proteger Mondstadt con un cuerpo todavía débil.', ex: [
    ['Sentadillas', 10, 'rep', ['knee'], 'Puente de glúteo'],
    ['Flexiones inclinadas en una mesa', 8, 'rep', ['shoulder'], 'Flexiones en pared'],
    ['Puente de glúteo', 12, 'rep', [], null],
    ['Plancha', 20, 'sec', ['shoulder'], 'Dead bug lento'],
    ['Bird dog (cada lado)', 8, 'rep', [], null],
    ['Marcha en el lugar', 120, 'sec', [], null]] },
  mandoble: { name: 'Entrenamiento del Mandoble', sub: 'Fuerza total con carga · mochila con peso', stat: 'str', rest: 75, scale: 'str', lore: 'Un mandoble no se blande con los brazos: se blande con las piernas, la cadera y el núcleo.', ex: [
    ['Swing de mochila (como pesa rusa)', 15, 'rep', ['back'], 'Puente de glúteo con mochila'],
    ['Sentadilla abrazando la mochila', 12, 'rep', ['knee'], 'Puente de glúteo con mochila'],
    ['Remo con mochila a una mano', 10, 'rep', ['back'], 'Face pull con toalla'],
    ['Press de hombros con mochila', 10, 'rep', ['shoulder'], 'Curl de bíceps con mochila'],
    ['Leñador: rotación con mochila (cada lado)', 10, 'rep', ['back'], 'Pallof con toalla'],
    ['Plancha con mochila en la espalda', 30, 'sec', ['shoulder', 'back'], 'Dead bug lento']] },
  expedicion: { name: 'Marcha de la Expedición', sub: 'Resistencia · marcha con carga', stat: 'vit', rest: 0, scale: 'run', sets: 1, lore: 'La expedición recorre tierras lejanas a pie, con todo el equipo a cuestas.', ex: [
    ['Marcha rápida con mochila cargada', 1200, 'sec', ['knee', 'back'], 'Caminata rápida sin carga'],
    ['Subir y bajar escaleras', 300, 'sec', ['knee'], 'Caminata rápida en llano'],
    ['Paseo del granjero (bolsas pesadas)', 60, 'sec', ['back'], 'Marcha con brazos arriba'],
    ['Caminata de recuperación', 300, 'sec', [], null]] },
  espinadragon: { name: 'Ascenso al Espinadragón', sub: 'Piernas y resistencia de montaña', stat: 'agi', rest: 60, scale: 'str', lore: 'En la montaña helada, cada paso cuesta el doble. Por eso se entrena ahí.', ex: [
    ['Subidas al escalón (cada pierna)', 12, 'rep', ['knee'], 'Puente de glúteo a una pierna'],
    ['Zancadas caminando', 16, 'rep', ['knee'], 'Patada de glúteo en cuadrupedia'],
    ['Sentadilla isométrica en pared', 45, 'sec', ['knee'], 'Abducción de cadera acostado'],
    ['Elevación de talones en escalón', 25, 'rep', [], null],
    ['Burpees', 10, 'rep', ['knee', 'shoulder'], 'Puñetazos al aire (por brazo)'],
    ['Ducha fría final (opcional)', 60, 'sec', [], null]] },
  duelo: { name: 'Duelo en el Patio de la Orden', sub: 'Combate · intervalos', stat: 'agi', rest: 20, scale: 'run', rounds: true, lore: 'Los caballeros entrenan en parejas hasta que el cansancio les enseña a no malgastar movimientos.', ex: [
    ['Boxeo de sombra con guardia alta', 45, 'sec', [], null],
    ['Estocadas alternas', 30, 'sec', ['knee'], 'Puñetazos rápidos de pie'],
    ['Sentadilla + bloqueo', 30, 'sec', ['knee'], 'Paso lateral con guardia'],
    ['Sprawls (burpee sin salto)', 30, 'sec', ['knee', 'shoulder'], 'Boxeo de sombra'],
    ['Guardia isométrica: brazos al frente', 40, 'sec', ['shoulder'], 'Marcha en el lugar'],
    ['Mountain climbers', 30, 'sec', ['shoulder'], 'Rodillas al pecho de pie']] },
  explorador: { name: 'Carreras del Explorador', sub: 'Velocidad · agilidad', stat: 'agi', rest: 40, scale: 'run', rounds: true, lore: 'Los exploradores de la Orden llegan primero y vuelven a avisar. La velocidad salva vidas.', ex: [
    ['Sprint', 20, 'sec', ['knee'], 'Caminata muy rápida'],
    ['Skipping alto', 30, 'sec', ['knee'], 'Marcha alta en el lugar'],
    ['Saltos laterales', 30, 'sec', ['knee'], 'Pasos laterales rápidos'],
    ['Trote suave', 120, 'sec', ['knee'], 'Caminata rápida']] },
  muralla: { name: 'La Muralla de Mondstadt', sub: 'Core y estabilidad', stat: 'vit', rest: 30, scale: 'str', lore: 'Un caballero es la muralla que se queda en pie cuando todo lo demás cae.', ex: [
    ['Plancha', 45, 'sec', ['shoulder'], 'Dead bug lento'],
    ['Plancha lateral (cada lado)', 30, 'sec', ['shoulder'], 'Pallof con toalla'],
    ['Dead bug', 12, 'rep', [], null],
    ['Bird dog (cada lado)', 10, 'rep', [], null],
    ['Superman', 12, 'rep', ['back'], 'Bird dog lento'],
    ['Hollow hold', 20, 'sec', ['back'], 'Dead bug lento']] },
  taberna: { name: 'Descanso en el Obsequio del Ángel', sub: 'Movilidad · recuperación', stat: 'per', rest: 0, scale: null, sets: 1, lore: 'Hasta el Gran Maestro descansa. Recuperarse también es parte del régimen.', ex: [
    ['Gato-vaca', 60, 'sec', [], null],
    ['Estiramiento de cadera (cada lado)', 45, 'sec', [], null],
    ['Estiramiento de isquiotibiales', 45, 'sec', [], null],
    ['Apertura de pecho en pared', 45, 'sec', [], null],
    ['Postura del niño', 60, 'sec', [], null],
    ['Respiración lenta mirando el cielo', 120, 'sec', [], null]] },
};

const GOAL_ROUTINES_VARKA = {
  fat: ['duelo', 'expedicion', 'mandoble', 'muralla', 'explorador'],
  muscle: ['mandoble', 'espinadragon', 'muralla', 'duelo'],
  recomp: ['mandoble', 'duelo', 'espinadragon', 'muralla', 'expedicion'],
  endurance: ['expedicion', 'explorador', 'duelo', 'muralla'],
  health: ['juramento', 'expedicion', 'muralla', 'explorador'],
};

const ALL_ROUTINES = () => ({ ...ROUTINES, ...ROUTINES_VARKA });
const RSET = () => (S.theme === 'varka'
  ? { lib: ROUTINES_VARKA, goals: GOAL_ROUTINES_VARKA, rest: 'taberna', beginner: 'juramento' }
  : { lib: ROUTINES, goals: GOAL_ROUTINES, rest: 'monarca', beginner: 'despertar' });
const isRestRoutine = (id) => id === 'monarca' || id === 'taberna';

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
  const { goals, beginner } = RSET();
  let list = [...goals[a.goal]];
  if ((a.pushups === '0' || a.activity === '0') && list[0] !== beginner) list = [beginner, ...list.filter((r) => r !== beginner)];
  return list;
}

function weekPlan() {
  const rec = recommended();
  const days = TRAIN_DAYS[+S.profile.answers.activity];
  return DAYS.map((d, i) => {
    const k = days.indexOf(i);
    return k >= 0 ? rec[k % rec.length] : i === 6 ? RSET().rest : null;
  });
}

function buildRoutine(id) {
  const R = ALL_ROUTINES()[id], a = S.profile.answers;
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
  gainProto(10);
  hitBoss('routine');
  const R = ALL_ROUTINES()[id];
  const xp = gainXP((isRestRoutine(id) ? 30 : 60) + (hasSkill('Respiración Profunda') ? 20 : 0), 'routine');
  decayFatigue();
  if (isRestRoutine(id)) S.fatigue = Math.max(0, S.fatigue - 30);
  else S.fatigue = Math.min(100, S.fatigue + 15);
  const week = S.routineLog.filter((r) => Date.now() - new Date(r.date) < 7 * 864e5).length;
  notify('Entrenamiento Completado', `[${R.name}]\n\nXP +${xp}\n${isRestRoutine(id) ? 'Fatiga -30' : 'Fatiga +15'}\n\nRutinas esta semana: ${week}`);
  save(); render();
}

function routineCard(id, open) {
  const r = buildRoutine(id);
  const done = routineDone(id);
  return `<details class="routine" ${open ? 'open' : ''}><summary>
      <b>${r.name}</b> ${done ? '<span class="check">✔</span>' : ''}<span class="tag">${STATS[r.stat][1]}</span>
      <div class="desc muted">${r.sub} · ~${r.mins} min</div></summary>
    ${r.lore ? `<p style="font-size:14px;font-style:italic;margin:6px 0;color:var(--accent)">"${r.lore}"</p>` : ''}
    <p class="muted" style="font-size:14px;margin:6px 0">${r.sets > 1 ? `${r.sets} ${id === 'kasaka' || r.rounds ? 'rondas' : 'series'}` : '1 vuelta'}${r.rest ? ` · descanso ${r.rest} s entre ejercicios` : ''}</p>
    ${r.ex.map((e) => `<div class="goal"><span class="name">${e.name}${e.adapted ? ' <span class="tag">adaptado</span>' : ''}</span>
      ${e.unit === 'sec'
        ? `<button class="btn small" data-rest="${e.v}" data-label="${esc(e.name)}">⏱ ${fmtMin(e.v)}</button>`
        : `<span class="count">${e.v} reps</span>`}</div>`).join('')}
    ${r.rest ? `<div class="row" style="justify-content:center;margin-top:8px"><button class="btn small" data-rest="${r.rest}">Descanso ${r.rest}s</button></div>` : ''}
    <button class="btn block" data-guide="${id}">▶ Entrenamiento guiado</button>
    ${done ? '<p class="center" style="color:var(--accent)">✔ Completada hoy</p>' : `<button class="btn block small" data-routine="${id}">Ya la hice: completar</button>`}
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
      <span class="label">${DAYS[i]}</span><span>${id ? ALL_ROUTINES()[id].name : '<span class="muted">Descanso</span>'}${id && routineDone(id) ? ' ✔' : ''}</span></div>`).join('')}
  </div>
  <div class="win"><div class="win-title">Entrenamiento de Hoy</div>
    ${todayId ? routineCard(todayId, true) : `<p class="center">Hoy es día de descanso.<br><span class="muted">La misión diaria sigue activa. Si querés moverte, hacé <b>${ALL_ROUTINES()[RSET().rest].name}</b>.</span></p>`}
    <p class="center timer" id="rest" style="min-height:1.2em">${rest ? `${rest.label || 'Descanso'}: ${Math.ceil((rest.end - Date.now()) / 1000)} s` : ''}</p>
  </div>
  <div class="win"><div class="win-title">Recomendadas</div>
    ${rec.filter((id) => id !== todayId).map((id) => routineCard(id)).join('')}
    ${todayId !== RSET().rest ? routineCard(RSET().rest) : ''}
  </div>
  ${viewTests()}
  <div class="win"><div class="win-title">Otras Rutinas</div>
    ${Object.keys(RSET().lib).filter((id) => !rec.includes(id) && id !== RSET().rest && id !== todayId).map((id) => routineCard(id)).join('')}
  </div>`;
}

// Hidden theme: Knights of Favonius (Varka, Genshin Impact). Pure text/color reskin;
// mechanics and saved progress are shared with the default System theme.
const VARKA = [
  ['Ojo del Mercader', 'Ojo del Comerciante'],
  ['Autoridad del Gobernante', 'Autoridad del Gran Maestro'],
  ['Intención Asesina', 'Presión del Mandoble'],
  ['Instinto del Cazador', 'Instinto del Explorador'],
  ['Templo de Cartenon', 'Templo Olvidado del Espinadragón'],
  ['La Estatua de Dios', 'El Guardián Olvidado'],
  ['Puerta Roja', 'Dominio Sellado'],
  ['Misión de Emergencia', 'Encargo Urgente'],
  ['Comerciante ambulante', 'Mercader de Liyue de paso'],
  ['comerciante ambulante', 'mercader de Liyue de paso'],
  ['Bendición del Sistema', 'Bendición de Barbatos'],
  ['Pruebas de Fuerza', 'Pruebas de la Orden'],
  ['Entradas de diario', 'Entradas de la bitácora'],
  ['>Diario<', '>Bitácora de expedición<'],
  ['Entrada del diario', 'Entrada de la bitácora'],
  ['Prueba de Fuerza', 'Prueba de la Orden'],
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
  ['Dominio de rango E', 'Dominio del Bosque Susurrante'],
  ['Dominio de rango D', 'Dominio del Valle Estelar'],
  ['Dominio de rango C', 'Dominio del Cabo del Juramento'],
  ['Dominio de rango B', 'Dominio del Espinadragón'],
  ['Dominio de rango A', 'Dominio de la Guarida de Stormterror'],
  ['Poción de Curación', 'Pollo Dulce Madame'],
  ['Poción de Maná', 'Jugo de manzana de Mondstadt'],
  ['Poción de Recuperación de Fatiga', 'Té de menta del Viñedo del Amanecer'],
  ['Piedra Rúnica: Bonus', 'Sello de la Orden'],
  ['El que Superó la Adversidad', 'Superviviente de la Muralla'],
  ['El que Superó sus Límites', 'Fuerza del Gran Maestro'],
  ['Cazador de Lobos', 'Amigo de Wolvendom'],
  ['Coraje del Débil', 'Guardia del Alba'],
  ['Voluntad Inquebrantable', 'Disciplina de Favonius'],
  ['Cazador de Demonios', 'Veterano de la Expedición'],
  ['Cuerpo Despertado', 'Forjado por el Viento'],
  ['Superar los límites', 'La fuerza del Gran Maestro'],
  ['[Sprint]', '[Paso del Viento]'], ['>Sprint<', '>Paso del Viento<'],
  ['Sed de Sangre', 'Rugido del Lobo del Norte'],
  ['[Sigilo]', '[Planeador del Viento]'], ['>Sigilo<', '>Planeador del Viento<'],
  ['Daga Mortal', 'Corte del Mandoble'],
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
    equipped: null, event: null, eventDay: null, tests: {}, prs: 0, emergencies: 0, sideDone: 0, ach: {},
    journal: {},
    gear: { primos: 1600, pity5: 0, pity4: 0, inv: {}, eq: {} },
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
  checkAchievements();
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
const letterOfDay = () => VARKA_LETTERS[[...today()].reduce((h, c) => h + c.charCodeAt(0), 0) % VARKA_LETTERS.length];
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
  return Object.keys(S.targets).every((k) => d.progress[k] >= S.targets[k]);
}

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
  if (source === 'dungeon' && titleIs('red')) mult += 0.2;
  if (titleIs('double')) mult += 0.15;
  if (titleIs('legend')) mult += 0.2;
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
  const doubled = Object.keys(S.targets).every((x) => p[x] >= S.targets[x] * 2);
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
  if (!S.awakened || !S.profile || S.eventDay === today()) return;
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
    notify('Evento', `Un comerciante ambulante apareció.\n\nHoy: ${ITEMS[ev.item].ico} <b>${ITEMS[ev.item].name}</b> a mitad de precio en la Tienda.`);
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
  ensureBoss();
  const b = S.boss;
  if (!b || b.defeated) return;
  const dmg = BOSS_DMG[kind];
  b.hp = Math.max(0, b.hp - dmg);
  b.hits = [{ kind, dmg, date: today() }, ...b.hits].slice(0, 6);
  if (b.hp > 0) return;
  b.defeated = true;
  const xp = gainXP(300);
  const g = gainGold(300);
  addItem('box'); addItem('key');
  gainProto(160);
  dayLog().boss = bossName();
  notify('Jefe Semanal', `¡Has derrotado a <b>${bossName()}</b>!\n\nRecompensas:\n• XP +${xp}\n• Oro +${g}\n• Caja Aleatoria ×1\n• Llave de Mazmorra ×1\n\nUn nuevo jefe aparecerá el lunes.`);
}

const HIT_LABEL = { daily: 'Misión diaria', routine: 'Rutina', dungeon: 'Mazmorra', secret: 'Misión secreta', emergency: 'Emergencia', test: 'Prueba de fuerza', side: 'Misión secundaria', journal: 'Diario' };

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

/* ================= FAVONIUS GEAR (Varka theme only) ================= */

const GEAR_SLOTS = {
  weapon: { name: 'Arma', ico: '🗡️', stat: 'xp' },
  flower: { name: 'Flor de la Vida', ico: '🌸', stat: 'fat' },
  plume: { name: 'Pluma de la Muerte', ico: '🪶', stat: 'gold' },
  sands: { name: 'Arenas del Eón', ico: '⏳', stat: 'xp' },
  goblet: { name: 'Cáliz de Eonotema', ico: '🏆', stat: 'gold' },
  circlet: { name: 'Tiara de Logos', ico: '👑', stat: 'xp' },
};
const STAT_LABEL = { xp: 'XP', gold: 'Mora', fat: 'Recuperación de fatiga' };
const WEAPONS = [
  ['lapida', 'Lápida del Lobo', 5], ['orgullo', 'Orgullo Celestial', 5], ['pinos', 'Canción de los Pinos Rotos', 5],
  ['favonius', 'Espadón de Favonius', 4], ['cortalluvias', 'Cortalluvias', 4], ['sacrificio', 'Espadón del Sacrificio', 4],
  ['hierro', 'Espadón de Hierro Blanco', 3], ['sangre', 'Espadón Ensangrentado', 3], ['debate', 'Garrote de Debate', 3],
];
const ART_SETS = [
  ['glad', 'Gladiador', 5], ['esmeralda', 'Sombra Esmeralda', 5], ['caballero', 'Caballero Ensangrentado', 5],
  ['instructor', 'Instructor', 4], ['aventurero', 'Aventurero', 3], ['afortunado', 'Perro Afortunado', 3],
];
const GEAR = {};
WEAPONS.forEach(([id, name, r]) => { GEAR['w_' + id] = { slot: 'weapon', name, r }; });
ART_SETS.forEach(([set, setName, r]) => Object.entries(GEAR_SLOTS).forEach(([slot, sl]) => {
  if (slot !== 'weapon') GEAR[`a_${set}_${slot}`] = { slot, set, name: `${sl.name} del ${setName}`, r };
}));
const SET_NAME = Object.fromEntries(ART_SETS.map(([id, n]) => [id, n]));

// Deliberately tiny: a full 5★ build adds up to roughly +5% XP and a few % elsewhere.
const gearValue = (g, refine) => ({ 3: 0.25, 4: 0.5, 5: 1 }[g.r] * (g.slot === 'weapon' ? 2 : 1) * (1 + 0.25 * (refine - 1))) / 100;
const owned = (id) => S.gear.inv[id] || 0;

function gearBonus() {
  const b = { xp: 0, gold: 0, fat: 0 };
  if (S.theme !== 'varka' || !S.gear) return b;
  const sets = {};
  for (const [slot, id] of Object.entries(S.gear.eq)) {
    if (!id || !owned(id)) continue;
    const g = GEAR[id];
    b[GEAR_SLOTS[slot].stat] += gearValue(g, owned(id));
    if (g.set) sets[g.set] = (sets[g.set] || 0) + 1;
  }
  for (const n of Object.values(sets)) { if (n >= 2) b.xp += 0.005; if (n >= 4) b.xp += 0.01; }
  return b;
}

const activeSets = () => {
  const sets = {};
  Object.values(S.gear.eq).forEach((id) => { if (id && GEAR[id].set) sets[GEAR[id].set] = (sets[GEAR[id].set] || 0) + 1; });
  return Object.entries(sets).filter(([, n]) => n >= 2);
};

function combatPower() {
  let cp = S.level * 20 + Object.values(S.stats).reduce((a, v) => a + v, 0) * 10;
  for (const id of Object.values(S.gear.eq)) if (id && owned(id)) cp += { 3: 100, 4: 250, 5: 600 }[GEAR[id].r] * (1 + 0.2 * (owned(id) - 1));
  return Math.round(cp);
}

let pendingProto = 0;
function gainProto(n) {
  if (S.theme !== 'varka') return;
  S.gear.primos += n;
  pendingProto += n;
}

function wish(times) {
  const cost = 160 * times;
  if (S.gear.primos < cost) return;
  S.gear.primos -= cost;
  const results = [];
  for (let i = 0; i < times; i++) {
    S.gear.pity5++; S.gear.pity4++;
    let r = 3;
    const roll = Math.random();
    if (S.gear.pity5 >= 60 || roll < 0.02) r = 5;
    else if (S.gear.pity4 >= 10 || roll < 0.15) r = 4;
    if (r === 5) S.gear.pity5 = 0;
    if (r >= 4) S.gear.pity4 = 0;
    const pool = Object.keys(GEAR).filter((id) => GEAR[id].r === r);
    const id = pool[Math.floor(Math.random() * pool.length)];
    let note = '';
    if (owned(id) >= 5) { const back = { 3: 5, 4: 20, 5: 80 }[r]; S.gear.primos += back; note = ` (R5 máx · +${back} 💎)`; }
    else { S.gear.inv[id] = owned(id) + 1; note = owned(id) > 1 ? ` (refinado R${owned(id)})` : ' (nuevo)'; }
    results.push({ id, r, note });
  }
  results.sort((a, b) => b.r - a.r);
  const best = results[0].r;
  notify(best === 5 ? '★★★★★ Deseo' : 'Deseo', '', {
    html: `<div style="text-align:left;max-height:50vh;overflow:auto">${results.map((x) => `<div class="gear-r${x.r}" style="padding:4px 0">
      ${'★'.repeat(x.r)} ${GEAR_SLOTS[GEAR[x.id].slot].ico} <b>${GEAR[x.id].name}</b><span class="muted" style="font-size:13px">${x.note}</span></div>`).join('')}</div>`,
  });
  save(); render();
}

let gearSlot = 'weapon';

function viewGear() {
  if (S.theme !== 'varka') return '';
  const b = gearBonus();
  const pct = (v) => `+${(v * 100).toFixed(2).replace(/\.?0+$/, '')}%`;
  const slotCard = (slot) => {
    const sl = GEAR_SLOTS[slot], id = S.gear.eq[slot], g = id && owned(id) ? GEAR[id] : null;
    return `<button class="gear-slot ${g ? 'gear-r' + g.r : ''} ${gearSlot === slot ? 'sel' : ''}" data-gslot="${slot}">
      <span class="gear-ico">${sl.ico}</span>
      <small class="muted">${sl.name}</small>
      <b>${g ? g.name : '— vacío —'}</b>
      ${g ? `<small>${'★'.repeat(g.r)} · R${owned(id)} · ${STAT_LABEL[sl.stat]} ${pct(gearValue(g, owned(id)))}</small>` : ''}
    </button>`;
  };
  const list = Object.keys(GEAR).filter((id) => GEAR[id].slot === gearSlot && owned(id)).sort((x, y) => GEAR[y].r - GEAR[x].r);
  return `<div class="win"><div class="win-title">Equipamiento</div>
    <div class="center"><div class="label">Poder de combate</div><div class="big-level gold" style="font-size:44px">${combatPower().toLocaleString('es')}</div></div>
    <div class="gear-grid">${Object.keys(GEAR_SLOTS).map(slotCard).join('')}</div>
    <p class="center" style="font-size:15px;margin:10px 0 0">XP ${pct(b.xp)} · Mora ${pct(b.gold)} · Recuperación ${pct(b.fat)}</p>
    ${activeSets().length ? `<p class="center muted" style="font-size:13px;margin:4px 0 0">${activeSets().map(([set, n]) => `${SET_NAME[set]} (${n}): XP +${n >= 4 ? '1,5' : '0,5'}%`).join(' · ')}</p>` : ''}
  </div>
  <div class="win"><div class="win-title">${GEAR_SLOTS[gearSlot].ico} ${GEAR_SLOTS[gearSlot].name}</div>
    ${list.length ? list.map((id) => {
      const g = GEAR[id], eq = S.gear.eq[gearSlot] === id;
      return `<div class="item"><div class="info gear-r${g.r}"><b>${g.name}</b> <small>${'★'.repeat(g.r)} R${owned(id)}</small>
        <div class="desc">${STAT_LABEL[GEAR_SLOTS[gearSlot].stat]} ${pct(gearValue(g, owned(id)))}${g.set ? ` · Set ${SET_NAME[g.set]}` : ''}</div></div>
        <button class="btn small" data-gequip="${id}">${eq ? 'Quitar' : 'Equipar'}</button></div>`;
    }).join('') : '<p class="muted center">No tenés piezas para esta ranura. Conseguilas con Deseos.</p>'}
  </div>
  <div class="win"><div class="win-title">Deseo</div>
    <p class="center" style="margin-top:0"><b>Viento del Gran Maestro</b><br><span class="muted" style="font-size:14px">Armas y artefactos de Mondstadt</span></p>
    <div class="center big-level" style="font-size:36px">💎 ${S.gear.primos.toLocaleString('es')}</div>
    <div class="grid2" style="margin-top:8px">
      <button class="btn" data-wish="1" ${S.gear.primos < 160 ? 'disabled' : ''}>Deseo ×1<br><small>160 💎</small></button>
      <button class="btn" data-wish="10" ${S.gear.primos < 1600 ? 'disabled' : ''}>Deseo ×10<br><small>1.600 💎</small></button>
    </div>
    <p class="muted center" style="font-size:13px">5★ garantizado en ${60 - S.gear.pity5} · 4★ o más en ${10 - S.gear.pity4}<br>Probabilidad: 5★ 2% · 4★ 13% · 3★ 85% · Repetidos refinan hasta R5</p>
    <details><summary class="muted" style="font-size:14px">¿Cómo consigo protogemas?</summary>
      <p style="font-size:14px">Entrenamiento de Favonius 60 · Jefe semanal 160 · Subir de nivel 50 por nivel · Dominio 40 · Logros 20–100 · Hazaña oculta 20 · Encargo urgente 20 · Rutina 10 · Récord personal 10 · Bitácora 5.<br>Solo se ganan con el tema de Caballeros de Favonius activo.</p></details>
  </div>`;
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
  if (isToday) { L.progress = S.daily.progress; L.targets = S.targets; L.daily = S.daily.claimed; L.timer = Math.round(timerSec()); }
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
  html += viewBoss();
  html += viewEvent();
  if (S.theme === 'varka') {
    html += `<div class="win"><div class="win-title">Carta del Gran Maestro</div>
      <p style="font-style:italic;margin-top:0">"${letterOfDay()}"</p>
      <p class="muted" style="text-align:right;margin:0">— Varka, desde la expedición</p></div>`;
  }
  html += `<div class="win"><div class="win-title">Misión Diaria</div>
    <p class="center" style="margin-top:0">[Entrenamiento de fuerza]<br><b>Preparativos para volverse poderoso</b></p>
    ${Object.entries(EXERCISES).map(([k, e]) => {
      const ok = p[k] >= S.targets[k];
      return `<div class="goal ${ok ? 'done' : ''}">
        <span class="name">${exLabel(k)}</span>
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
    ${Object.entries(ITEMS).map(([id, it]) => `<div class="item"><div class="ico">${it.ico}</div>
      <div class="info"><b>${it.name}</b><div class="desc">${it.desc}</div></div>
      <button class="btn small" data-buy="${id}" ${S.gold < priceOf(id) ? 'disabled' : ''}>${priceOf(id) < it.price ? `<s style="opacity:.6">${it.price}</s> ` : ''}${priceOf(id)} G</button></div>`).join('')}
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
    const pr = priceOf(d.buy);
    if (S.gold < pr) return;
    if (S.event && S.event.type === 'merchant' && S.event.item === d.buy && S.event.date === today()) S.event.done = true;
    S.gold -= pr; addItem(d.buy); save(); render();
    notify('Tienda', `Has comprado:\n${it.ico} <b>[${it.name}]</b>`); return;
  }
  if (d.ans) { evalDraft.answers[QUESTIONS[evalDraft.step].id] = d.ans; evalDraft.step++; render(); return; }
  if (d.rest) { rest = { end: Date.now() + d.rest * 1000, label: d.label }; tickTimers(); return; }
  if (d.routine) return completeRoutine(d.routine);
  if (d.guide) return startGuide(d.guide);
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

/* ================= BOOT ================= */

rollover();
ensureEquipped();
rollEvent();
ensureBoss();
render();
setInterval(() => {
  if (rollover()) { rollEvent(); ensureBoss(); render(); }
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
