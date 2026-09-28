/*!
 * Mirsad Admin — pages/crm.js
 * لوحة مراحل الصفقات بالسحب والإفلات + رسم مصادر العملاء.
 * Kanban drag & drop (native HTML5 DnD) + lead sources chart.
 */
(function () {
  'use strict';
  var Z = window.Mirsad, P = Z.palette;
  var board = document.getElementById('kanban');
  var dragged = null;

  function refreshTotals() {
    board.querySelectorAll('.zm-kanban-col').forEach(function (col) {
      var deals = col.querySelectorAll('.zm-deal');
      var total = 0;
      deals.forEach(function (d) { total += +d.getAttribute('data-value'); });
      col.querySelector('.zm-count').textContent = deals.length;
      col.querySelector('.zm-total .ltr-num').textContent = Z.fmt(total);
    });
  }
  function afterElement(list, y) {
    var items = Array.prototype.slice.call(list.querySelectorAll('.zm-deal:not(.dragging)'));
    var best = { offset: -Infinity, el: null };
    items.forEach(function (el) {
      var box = el.getBoundingClientRect();
      var offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > best.offset) best = { offset: offset, el: el };
    });
    return best.el;
  }

  if (board) {
    board.addEventListener('dragstart', function (e) {
      var card = e.target.closest('.zm-deal');
      if (!card) return;
      dragged = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', ''); } catch (err) { /* old browsers */ }
    });
    board.addEventListener('dragend', function () {
      if (dragged) dragged.classList.remove('dragging');
      board.querySelectorAll('.drag-over').forEach(function (l) { l.classList.remove('drag-over'); });
      dragged = null;
    });
    board.querySelectorAll('.zm-kanban-list').forEach(function (list) {
      list.addEventListener('dragover', function (e) {
        if (!dragged) return;
        e.preventDefault();
        list.classList.add('drag-over');
        var after = afterElement(list, e.clientY);
        if (after) list.insertBefore(dragged, after); else list.appendChild(dragged);
      });
      list.addEventListener('dragleave', function (e) {
        if (!list.contains(e.relatedTarget)) list.classList.remove('drag-over');
      });
      list.addEventListener('drop', function (e) {
        e.preventDefault();
        list.classList.remove('drag-over');
        refreshTotals();
        var stage = list.closest('.zm-kanban-col').querySelector('h6 span').textContent;
        Z.toast(Z.t('تم نقل الصفقة إلى مرحلة') + ' «' + stage + '»');
      });
    });
    board.querySelectorAll('.zm-add-deal').forEach(function (b) {
      b.addEventListener('click', function () { Z.toast('أضف نموذج الصفقة الخاص بك هنا', 'info'); });
    });
  }

  var ls = document.getElementById('leadSourceChart');
  if (ls) {
    new Chart(ls, {
      type: 'bar',
      data: {
        labels: [Z.t('موقع إلكتروني'), Z.t('إحالة'), Z.t('لينكدإن'), Z.t('معرض تجاري'), Z.t('حملة بريدية')],
        datasets: [{ label: Z.t('العملاء المحتملون'), data: [128, 96, 74, 52, 38], backgroundColor: [P.primary, P.accent, P.info, P.warning, P.danger], borderRadius: 6, maxBarThickness: 18 }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { reverse: Z.mirror(), grid: { drawTicks: false }, border: { display: false }, beginAtZero: true },
          y: { position: Z.mirror() ? 'right' : 'left', grid: { display: false }, border: { display: false } }
        }
      }
    });
  }
})();
