// End-to-end checks of the main flows, run in headless Chromium against a local server.
// Usage: serve the repo on :8765 (python3 -m http.server 8765) and run `node tests/e2e.js`.
const { chromium, devices } = require('playwright');

const URL = process.env.APP_URL || 'http://localhost:8765/';
let failures = 0;

function check(name, cond, detail = '') {
  console.log(`${cond ? '✔' : '✖'} ${name}${cond ? '' : `  → ${detail}`}`);
  if (!cond) failures++;
}

async function newPlayer(browser, answers = ['fat', '1', '1', '1', 'knee', '30', 'night'], ctxOpts = { viewport: { width: 390, height: 844 } }) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && page.errors.push(m.text()));
  page.on('dialog', (d) => d.accept());
  page.okAll = async () => {
    const msgs = [];
    while (await page.$('#ok')) { msgs.push((await page.textContent('#overlay .win')).replace(/\s+/g, ' ')); await page.click('#ok'); }
    return msgs;
  };
  await page.goto(URL);
  await page.fill('#nm', 'Tester'); await page.click('#yes'); await page.okAll();
  await page.click('[data-ans=m]');
  for (const v of ['25', '175', '85,5', '75']) { await page.fill('#qnum', v); await page.click('#qnext'); }
  for (const v of answers) await page.click(`[data-ans="${v}"]`);
  await page.click('#qdone'); await page.okAll();
  return page;
}

const yesterday = () => { const y = new Date(); y.setDate(y.getDate() - 1); return y; };

(async () => {
  const browser = await chromium.launch();

  // 1. Evaluation, daily quest, decimal comma, journal
  {
    const p = await newPlayer(browser);
    const st = await p.evaluate(() => ({ t: S.targets, w: S.profile.answers.weight }));
    check('evaluación adapta objetivos a lesión de rodilla', st.t.pushups === 30 && st.t.squats === 25 && st.t.run === 1, JSON.stringify(st.t));
    check('acepta coma decimal en el peso', st.w === 85.5, st.w);
    await p.click('[data-tab=quests]');
    for (const k of ['pushups', 'situps']) for (let i = 0; i < 3; i++) await p.click(`[data-ex=${k}][data-n="10"]`);
    for (let i = 0; i < 3; i++) await p.click('[data-ex=squats][data-n="10"]');
    await p.click('[data-ex=run][data-n="1"]');
    await p.click('#claim');
    const msgs = await p.okAll();
    check('reclamar diaria da recompensas', msgs.some((m) => m.includes('Has completado la misión diaria')), msgs.join(' | '));
    check('racha sube a 1', (await p.evaluate(() => S.streak)) === 1);
    await p.click('[data-tab=status]');
    await p.click('#journal'); await p.keyboard.type('Entrené fuerte y me sentí bien hoy.'); await p.click('.cal');
    check('diario guarda y da XP', (await p.okAll()).some((m) => m.includes('Entrada del diario')));
    check('sin errores (flujo básico)', p.errors.length === 0, p.errors.join(' | '));
    await p.context().close();
  }

  // 2. Penalty, auto-claim, pause
  {
    const p = await newPlayer(browser);
    await p.evaluate((y) => { S.daily.date = y; rollover(); render(); }, await p.evaluate((d) => today(new Date(d)), yesterday().toISOString()));
    check('diaria incompleta activa el castigo', await p.evaluate(() => !!S.penalty));
    await p.okAll();
    await p.evaluate(() => { S.penalty = null; const y = new Date(); y.setDate(y.getDate() - 1); S.daily.date = today(y); for (const k in S.targets) S.daily.progress[k] = S.targets[k]; rollover(); render(); });
    const auto = await p.okAll();
    check('diaria completa sin reclamar se reclama sola', auto.some((m) => m.includes('reclamó por vos')) && !(await p.evaluate(() => !!S.penalty)), auto.join(' | '));
    await p.click('[data-tab=more]'); await p.selectOption('#pauseDays', '2'); await p.click('#pauseStart'); await p.okAll();
    await p.evaluate(() => { S.streak = 4; const y = new Date(); y.setDate(y.getDate() - 1); S.daily.date = today(y); S.pause.from = today(y); rollover(); render(); });
    await p.okAll();
    const ps = await p.evaluate(() => ({ pen: !!S.penalty, streak: S.streak }));
    check('modo pausa evita castigo y congela la racha', !ps.pen && ps.streak === 4, JSON.stringify(ps));
    check('sin errores (castigo/pausa)', p.errors.length === 0, p.errors.join(' | '));
    await p.context().close();
  }

  // 3. Routines (guided), dungeons, tests, season, achievements
  {
    const p = await newPlayer(browser, ['muscle', '2', '1', '1', 'shoulder', '15', 'night']);
    await p.evaluate(() => startGuide('igris'));
    const steps = await p.evaluate(() => guide.steps.length);
    for (let i = 0; i < steps; i++) { if (!(await p.$('#gSkip'))) break; await p.click('#gSkip'); }
    const g = await p.okAll();
    check('entrenamiento guiado completa la rutina', g.some((m) => m.includes('Arsenal de Igris')), g.join(' | '));
    check('rutina adaptada a lesión de hombro', await p.evaluate(() => buildRoutine('igris').ex.some((e) => e.adapted)));
    const variants = await p.evaluate(() => { const c = {}; for (let i = 0; i < 400; i++) { const v = makeDungeon(2).variant; c[v] = (c[v] || 0) + 1; } return c; });
    check('mazmorras raras aparecen', variants.red > 0 && variants.double > 0 && variants.normal > variants.red, JSON.stringify(variants));
    await p.click('[data-tab=routines]');
    await p.fill('#t_push', '55'); await p.click('[data-test=push]');
    const t = await p.okAll();
    check('prueba de fuerza desbloquea título por marca', t.some((m) => m.includes('Puño de Hierro')), t.join(' | '));
    check('temporada suma puntos', (await p.evaluate(() => S.season.pts)) > 0);
    check('sin errores (rutinas/mazmorras/pruebas)', p.errors.length === 0, p.errors.join(' | '));
    await p.context().close();
  }

  // 4. Varka theme: unlock, commissions, wishes, gear, Grand Master requirements
  {
    const p = await newPlayer(browser);
    await p.click('[data-tab=more]');
    for (let i = 0; i < 7; i++) await p.click('[data-secret]');
    await p.okAll(); await p.selectOption('#theme', 'varka'); await p.okAll();
    const tabs = await p.$$eval('#tabs button', (bs) => bs.filter((b) => !b.hidden).map((b) => b.textContent));
    check('tema Favonius cambia pestañas y muestra Equipo', tabs.includes('Encargos') && tabs.includes('Equipo'), tabs.join(','));
    await p.click('[data-tab=quests]');
    for (const id of await p.$$eval('[data-comm]', (bs) => bs.map((b) => b.dataset.comm))) { await p.click(`[data-comm="${id}"]`); await p.okAll(); }
    check('4 encargos diarios completos', (await p.evaluate(() => S.comm.done.length)) === 4);
    check('petición semanal visible', !!(await p.$('#wreqDone')));
    await p.click('#wreqDone');
    const wr = await p.okAll();
    check('petición semanal completa suma amistad', wr.some((m) => m.includes('Amistad con')), wr.join(' | '));
    await p.click('[data-tab=gear]'); await p.click('[data-wish="10"]'); await p.okAll();
    check('deseo ×10 entrega 10 piezas', (await p.evaluate(() => Object.values(S.gear.inv).reduce((a, n) => a + n, 0))) >= 1);
    await p.click('[data-tab=routines]');
    check('requisitos del Gran Maestro visibles', !!(await p.$('#gmTrial')));
    check('sin errores (tema Favonius)', p.errors.length === 0, p.errors.join(' | '));
    await p.context().close();
  }

  // 5. Swipe between tabs on a phone, without triggering buttons underneath
  {
    const p = await newPlayer(browser, undefined, { ...devices['iPhone 13'] });
    await p.click('[data-tab=status]');
    const res = await p.evaluate(() => new Promise((done) => {
      const el = document.querySelector('#card');
      const mk = (x) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 300 });
      el.dispatchEvent(new TouchEvent('touchstart', { touches: [mk(330)], changedTouches: [mk(330)], bubbles: true, cancelable: true }));
      for (let x = 320; x >= 120; x -= 25) el.dispatchEvent(new TouchEvent('touchmove', { touches: [mk(x)], changedTouches: [mk(x)], bubbles: true, cancelable: true }));
      el.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [mk(120)], bubbles: true, cancelable: true }));
      el.click();
      setTimeout(() => done({ tab, overlay: document.querySelector('#overlay').hidden }), 500);
    }));
    check('deslizar cambia de pestaña', res.tab === 'quests', res.tab);
    check('deslizar no activa el botón de abajo', res.overlay === true);
    check('sin errores (deslizar)', p.errors.length === 0, p.errors.join(' | '));
    await p.context().close();
  }

  await browser.close();
  console.log(failures ? `\n${failures} prueba(s) fallaron` : '\nTodas las pruebas pasaron');
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
