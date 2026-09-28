/*!
 * مرصاد | Mirsad Admin — lists.js
 * تصفية عامة للقوائم والجداول والبطاقات: تبويبات الحالة + البحث + قائمة الفئات + العداد + حالة "لا توجد نتائج".
 * Generic list filtering: status tabs [data-zm-filter], search [data-zm-search], select [data-zm-select],
 * rows (tr[data-status]) or cards ([data-zm-item]) inside [data-zm-list] / [data-zm-grid], counter [data-zm-count].
 */
(function () {
  'use strict';
  var groups = {};
  function items(g) {
    var box = document.querySelector('[data-zm-list="' + g + '"], [data-zm-grid="' + g + '"]');
    if (!box) return [];
    var list = box.querySelectorAll('[data-zm-item="' + g + '"]');
    if (!list.length) list = box.querySelectorAll('tbody tr');
    return Array.prototype.slice.call(list);
  }
  function state(g) { return groups[g] || (groups[g] = { filter: 'all', q: '', sel: 'all' }); }
  function apply(g) {
    var s = state(g), shown = 0;
    items(g).forEach(function (el) {
      var st = (el.getAttribute('data-status') || '').split(' ');
      var okF = s.filter === 'all' || st.indexOf(s.filter) > -1;
      var okS = s.sel === 'all' || el.getAttribute('data-cat') === s.sel;
      var okQ = !s.q || el.textContent.toLowerCase().indexOf(s.q) > -1;
      var ok = okF && okS && okQ;
      el.classList.toggle('d-none', !ok);
      if (ok) shown++;
    });
    var c = document.querySelector('[data-zm-count="' + g + '"]');
    if (c) c.textContent = shown;
    var e = document.querySelector('[data-zm-empty="' + g + '"]');
    if (e) e.classList.toggle('d-none', shown > 0);
  }
  document.querySelectorAll('[data-zm-filter]').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.getAttribute('data-zm-group');
      document.querySelectorAll('[data-zm-group="' + g + '"]').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      state(g).filter = b.getAttribute('data-zm-filter');
      apply(g);
    });
  });
  document.querySelectorAll('[data-zm-search]').forEach(function (i) {
    i.addEventListener('input', function () { var g = i.getAttribute('data-zm-search'); state(g).q = i.value.trim().toLowerCase(); apply(g); });
  });
  document.querySelectorAll('[data-zm-select]').forEach(function (i) {
    i.addEventListener('change', function () { var g = i.getAttribute('data-zm-select'); state(g).sel = i.value; apply(g); });
  });
  // حذف بطاقة منتج (عرض فقط) — remove a product card (demo)
  document.querySelectorAll('.zm-del-card').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = b.closest('[data-zm-item]');
      var tip = bootstrap.Tooltip.getInstance(b); if (tip) tip.dispose();
      if (card) { card.remove(); apply(card.getAttribute('data-zm-item')); Mirsad.toast('تم حذف المنتج', 'danger'); }
    });
  });
  // الإشعارات: تحديد الكل كمقروء — notifications: mark all read
  var mark = document.getElementById('markAll');
  if (mark) mark.addEventListener('click', function () {
    document.querySelectorAll('.zm-notif-row.unread').forEach(function (r) {
      r.classList.remove('unread');
      r.setAttribute('data-status', r.getAttribute('data-status').replace(' unread', ''));
      var d = r.querySelector('.zm-unread-dot'); if (d) d.remove();
    });
    apply('notifs');
    Mirsad.toast('تم تحديد كل الإشعارات كمقروءة');
  });
})();
