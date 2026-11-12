'use strict';

/* ================= BOOT ================= */

rollover();
ensureEquipped();
rollEvent();
ensureBoss();
ensureSince();
checkDeloadNotice();
gmCheckTrial();
render();
setInterval(() => {
  if (rollover()) { rollEvent(); ensureBoss(); checkDeloadNotice(); gmCheckTrial(); render(); }
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
