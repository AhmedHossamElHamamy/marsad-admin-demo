/*!
 * Mirsad Admin — pages/pricing.js
 * التبديل بين الأسعار الشهرية والسنوية. Monthly / yearly price switch.
 */
(function () {
  'use strict';
  var t = document.getElementById('billingToggle');
  if (!t) return;
  t.addEventListener('change', function () {
    document.querySelectorAll('.zm-price').forEach(function (p) {
      p.textContent = p.getAttribute(t.checked ? 'data-yearly' : 'data-monthly');
    });
  });
})();
