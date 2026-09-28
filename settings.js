/*!
 * Mirsad Admin — pages/settings.js
 * التحقق من كلمة المرور، قوة كلمة المرور، ومزامنة إعدادات المظهر.
 * Password checks, strength meter and appearance settings.
 */
(function () {
  'use strict';
  var Z = window.Mirsad;

  /* قوة كلمة المرور وتطابقها — password strength & match */
  var np = document.getElementById('newPass'), cp = document.getElementById('confPass');
  var bar = document.getElementById('passStrength'), txt = document.getElementById('passStrengthText');
  var LEVELS = [['ضعيفة جدًا', 'bg-danger'], ['ضعيفة', 'bg-danger'], ['متوسطة', 'bg-warning'], ['جيدة', 'bg-info'], ['قوية', 'bg-success']];
  function score(p) {
    var s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return p ? Math.max(s, 0) : -1;
  }
  function checkMatch() { cp.setCustomValidity(cp.value && cp.value !== np.value ? 'mismatch' : ''); }
  if (np) {
    np.addEventListener('input', function () {
      var s = score(np.value);
      bar.className = 'progress-bar ' + (s < 0 ? '' : LEVELS[s][1]);
      bar.style.width = s < 0 ? '0%' : ((s + 1) * 20) + '%';
      txt.textContent = s < 0 ? Z.t('قوة كلمة المرور') : Z.t('قوة كلمة المرور') + ': ' + Z.t(LEVELS[s][0]);
      checkMatch();
    });
    cp.addEventListener('input', checkMatch);
    document.getElementById('passForm').zmValidate = function () { checkMatch(); return cp.checkValidity(); };
  }

  /* المظهر — theme & direction radios */
  function syncRadios() {
    var th = document.getElementById(Z.theme === 'dark' ? 'thDark' : 'thLight');
    if (th) th.checked = true;
    var dr = document.getElementById(Z.isRTL ? 'dirRtl' : 'dirLtr');
    if (dr) dr.checked = true;
  }
  syncRadios();
  document.addEventListener('mirsad:theme', syncRadios);
  document.querySelectorAll('input[name="themeOpt"]').forEach(function (r) {
    r.addEventListener('change', function () { Z.setTheme(r.value); });
  });
  document.querySelectorAll('input[name="dirOpt"]').forEach(function (r) {
    r.addEventListener('change', function () { Z.setDir(r.value); });
  });

  /* اللون الأساسي (معاينة) — live primary color preview via CSS variables */
  document.querySelectorAll('#swatches .zm-swatch').forEach(function (b) {
    b.addEventListener('click', function () {
      var root = document.documentElement.style;
      root.setProperty('--zm-primary', b.getAttribute('data-color'));
      root.setProperty('--zm-primary-rgb', b.getAttribute('data-rgb'));
      root.setProperty('--zm-primary-hover', b.getAttribute('data-hover'));
      document.querySelectorAll('#swatches .zm-swatch').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
    });
  });
})();
