/*!
 * Mirsad Admin — pages/invoices.js
 * تصفية الفواتير حسب الحالة والبحث والحذف. Invoice list filter/search/delete.
 */
(function () {
  'use strict';
  var Z = window.Mirsad;
  var table = document.getElementById('invTable');
  if (!table) return;
  var filter = 'all';
  var search = document.getElementById('invSearch');

  function apply() {
    var q = (search.value || '').trim().toLowerCase();
    var shown = 0;
    table.querySelectorAll('tbody tr').forEach(function (tr) {
      var st = tr.getAttribute('data-status');
      var okFilter = filter === 'all' || st === filter || (filter === 'pending' && st === 'sent');
      var okSearch = !q || tr.textContent.toLowerCase().indexOf(q) !== -1;
      var show = okFilter && okSearch;
      tr.classList.toggle('d-none', !show);
      if (show) shown++;
    });
    document.getElementById('invCount').textContent = shown;
    document.getElementById('invEmpty').classList.toggle('d-none', shown > 0);
  }
  document.querySelectorAll('#invTabs [data-filter]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('#invTabs .nav-link').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      filter = b.getAttribute('data-filter');
      apply();
    });
  });
  search.addEventListener('input', apply);
  table.addEventListener('click', function (e) {
    var del = e.target.closest('.zm-del');
    if (!del) return;
    var tip = bootstrap.Tooltip.getInstance(del);
    if (tip) tip.dispose();
    del.closest('tr').remove();
    apply();
    Z.toast('تم حذف الفاتورة', 'danger');
  });
})();
