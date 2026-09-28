/*!
 * مرصاد | Mirsad Admin — files.js — رفع ملفات تجريبي — demo upload feedback.
 */
(function () {
  'use strict';
  var up = document.getElementById('fmUpload');
  if (up) up.addEventListener('change', function () {
    if (up.files.length) Mirsad.toast(Mirsad.t('تم رفع') + ' ' + up.files.length + ' ' + Mirsad.t('ملف'));
    up.value = '';
  });
})();
