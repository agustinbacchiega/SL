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

const ITEM_ICO_VARKA = { box: '🎁', hp: '🍗', mp: '🍎', fat: '🍵', key: '🗝️', stone: '📜' };
const itemIco = (id) => (S.theme === 'varka' && ITEM_ICO_VARKA[id]) || ITEMS[id].ico;
const coin = () => (S.theme === 'varka' ? '🪙' : 'G');

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
  srank: { name: 'Cazador de Rango S', desc: 'Obtener rango S en una reevaluación.', bonus: 'Toda la XP +10%' },
  gm: { name: 'Discípulo del Gran Maestro', desc: 'Superar la Prueba del Gran Maestro (tema Caballeros de Favonius).', bonus: 'Toda la XP +10%' },
  season: { name: 'Campeón de Temporada', desc: 'Completar los 30 niveles de un pase de temporada.', bonus: 'Toda la XP +5%' },
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
  const r = Math.random(), luck = (hasSkill('Instinto del Cazador') ? 0.06 : 0) + (cons() >= 4 ? 0.06 : 0);
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
  const f = (R.scale ? [0.6, 0.8, 1, 1.3][lvl] : 1) * (isDeload() && R.scale ? 0.7 : 1) * (gmOn() && R.scale ? 1.15 : 1);
  const count = Math.min(R.ex.length, { 15: 3, 30: 4, 45: 5, 60: 6 }[a.time]);
  const sets = (R.sets || [2, 3, 3, 4][lvl]) + (gmOn() && R.scale && !R.sets ? 1 : 0);
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
  return `${viewGM()}<div class="win"><div class="win-title">Plan Semanal</div>
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
  ${viewReeval()}
  <div class="win"><div class="win-title">Otras Rutinas</div>
    ${Object.keys(RSET().lib).filter((id) => !rec.includes(id) && id !== RSET().rest && id !== todayId).map((id) => routineCard(id)).join('')}
  </div>`;
}

// Hidden theme: Knights of Favonius (Varka, Genshin Impact). Pure text/color reskin;
// mechanics and saved progress are shared with the default System theme.
const VARKA = [
  ['Misiones diarias', 'Entrenamientos diarios'],
  ['Misiones secundarias', 'Encargos del Gremio'],
  ['misiones secundarias', 'encargos del Gremio'],
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
  ['una mazmorra', 'un dominio'], ['la mazmorra', 'el dominio'], ['La mazmorra', 'El dominio'],
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
