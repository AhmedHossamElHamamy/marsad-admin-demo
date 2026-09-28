/*!
 * Mirsad Admin — pages/auth.js
 * تطابق كلمتي المرور في صفحة إنشاء الحساب. Password confirmation on register.
 */
(function () {
  'use strict';
  var form = document.getElementById('regForm');
  if (!form) return;
  var p1 = document.getElementById('rPass'), p2 = document.getElementById('rPass2');
  function check() { p2.setCustomValidity(p2.value && p2.value !== p1.value ? 'mismatch' : ''); }
  p1.addEventListener('input', check);
  p2.addEventListener('input', check);
  form.zmValidate = function () { check(); return p2.checkValidity(); };
})();
