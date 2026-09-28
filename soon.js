/*!
 * مرصاد | Mirsad Admin — soon.js — عداد تنازلي لصفحة «قريبًا» (غيّر data-target) — countdown.
 */
(function () {
  'use strict';
  var box = document.getElementById('soonCountdown'); if (!box) return;
  var target = new Date(box.getAttribute('data-target')).getTime();
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var d = Math.max(0, target - Date.now()), s = Math.floor(d / 1000);
    var v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    Object.keys(v).forEach(function (k) { box.querySelector('[data-unit="' + k + '"]').textContent = pad(v[k]); });
  }
  tick(); setInterval(tick, 1000);
})();
