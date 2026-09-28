/*!
 * Mirsad Admin — pages/ui-kit.js
 * أمثلة تفاعلية لصفحة المكونات. Interactive demos for the UI kit page.
 */
(function () {
  'use strict';
  var Z = window.Mirsad;
  var MSG = { success: 'تمت العملية بنجاح', warning: 'انتبه: هناك حقول تحتاج إلى مراجعة', danger: 'تم حذف العنصر نهائيًا', info: 'معلومة جديدة بانتظارك' };
  document.querySelectorAll('[data-toast]').forEach(function (b) {
    b.addEventListener('click', function () { var t = b.getAttribute('data-toast'); Z.toast(MSG[t], t); });
  });
  var lb = document.getElementById('loadingBtn');
  if (lb) {
    lb.addEventListener('click', function () {
      var sp = lb.querySelector('.spinner-border');
      sp.classList.remove('d-none'); lb.disabled = true;
      setTimeout(function () { sp.classList.add('d-none'); lb.disabled = false; Z.toast('تم التحميل'); }, 1500);
    });
  }
})();
