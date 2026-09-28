/*!
 * Mirsad Admin — pages/tables.js
 * ترتيب الجدول التفاعلي والبحث فيه. Sortable & searchable table.
 * يكفي إضافة data-sort="text" أو data-sort="num" إلى رأس العمود.
 */
(function () {
  'use strict';
  var table = document.getElementById('empTable');
  if (!table) return;
  var tbody = table.querySelector('tbody');
  var ths = table.querySelectorAll('th[data-sort]');
  ths.forEach(function (th) {
    th.setAttribute('tabindex', '0');
    var sort = function () {
      var idx = Array.prototype.indexOf.call(th.parentElement.children, th);
      var asc = !th.classList.contains('asc');
      ths.forEach(function (x) { x.classList.remove('asc', 'desc'); x.removeAttribute('aria-sort'); });
      th.classList.add(asc ? 'asc' : 'desc');
      th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
      var num = th.getAttribute('data-sort') === 'num';
      var rows = Array.prototype.slice.call(tbody.rows);
      rows.sort(function (a, b) {
        var x = a.cells[idx], y = b.cells[idx];
        var vx = num ? +(x.getAttribute('data-v') || x.textContent.replace(/[^\d.]/g, '')) : x.textContent.trim();
        var vy = num ? +(y.getAttribute('data-v') || y.textContent.replace(/[^\d.]/g, '')) : y.textContent.trim();
        var r = num ? vx - vy : vx.localeCompare(vy, 'ar');
        return asc ? r : -r;
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
    };
    th.addEventListener('click', sort);
    th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sort(); } });
  });
  var s = document.getElementById('empSearch');
  s.addEventListener('input', function () {
    var q = s.value.trim().toLowerCase();
    Array.prototype.forEach.call(tbody.rows, function (r) { r.classList.toggle('d-none', !!q && r.textContent.toLowerCase().indexOf(q) === -1); });
  });
})();
