'use strict';

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
GEAR.w_granmaestro = { slot: 'weapon', name: 'Mandoble del Gran Maestro', r: 5, exclusive: true };

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
  if (gmOn()) n *= 2;
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
    const pool = Object.keys(GEAR).filter((id) => GEAR[id].r === r && !GEAR[id].exclusive);
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
