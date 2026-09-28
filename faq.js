/*!
 * Mirsad Admin — pages/faq.js
 * البحث والتصفية في الأسئلة الشائعة. FAQ search & category filter.
 */
(function () {
  'use strict';
  var items = document.querySelectorAll('#faqAcc .accordion-item');
  var input = document.getElementById('faqSearch'), reset = document.getElementById('faqReset');
  if (!input) return;
  function apply(q, cat) {
    var n = 0;
    items.forEach(function (it) {
      var ok = (!q || it.textContent.toLowerCase().indexOf(q.toLowerCase()) !== -1) && (!cat || it.getAttribute('data-cat') === cat);
      it.classList.toggle('d-none', !ok);
      if (ok) n++;
    });
    document.getElementById('faqEmpty').classList.toggle('d-none', n > 0);
    reset.classList.toggle('d-none', !q && !cat);
  }
  input.addEventListener('input', function () { apply(input.value.trim(), ''); });
  document.querySelectorAll('.zm-help-cat[data-cat]').forEach(function (c) {
    c.addEventListener('click', function () {
      input.value = '';
      /* data-cat يحمل الاسم العربي الأصلي لتعمل التصفية بالاتجاهين */
      apply('', c.getAttribute('data-cat'));
    });
  });
  reset.addEventListener('click', function () { input.value = ''; apply('', ''); });
})();
