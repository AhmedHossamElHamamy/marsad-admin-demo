/*!
 * مرصاد | Mirsad Admin — invoice-create.js
 * بنود فاتورة ديناميكية: إضافة/حذف بند وحساب المجموع والخصم والضريبة والإجمالي تلقائيًا.
 * Dynamic invoice lines with automatic subtotal / discount / tax / total.
 */
(function () {
  'use strict';
  var tbody = document.querySelector('#icTable tbody');
  function money(n) { return Mirsad.fmt(n, 2); }
  function calc() {
    var sub = 0;
    tbody.querySelectorAll('.ic-line').forEach(function (tr) {
      var q = parseFloat(tr.querySelector('.ic-qty').value) || 0, p = parseFloat(tr.querySelector('.ic-price').value) || 0;
      tr.querySelector('.ic-total').textContent = money(q * p); sub += q * p;
    });
    var disc = Math.min(100, Math.max(0, parseFloat(document.getElementById('icDisc').value) || 0));
    var tax = Math.max(0, parseFloat(document.getElementById('icTax').value) || 0);
    var net = sub * (1 - disc / 100), tv = net * tax / 100;
    document.getElementById('icSub').textContent = money(sub);
    document.getElementById('icTaxVal').textContent = money(tv);
    document.getElementById('icTotal').textContent = money(net + tv);
  }
  function bind(tr) {
    tr.querySelectorAll('input').forEach(function (i) { i.addEventListener('input', calc); });
    tr.querySelector('.ic-remove').addEventListener('click', function () {
      if (tbody.querySelectorAll('.ic-line').length > 1) { tr.remove(); calc(); } else { Mirsad.toast('يجب أن تحتوي الفاتورة على بند واحد على الأقل', 'warning'); }
    });
  }
  tbody.querySelectorAll('.ic-line').forEach(bind);
  document.getElementById('icAdd').addEventListener('click', function () {
    var tr = tbody.querySelector('.ic-line').cloneNode(true);
    tr.querySelectorAll('input').forEach(function (i) { i.value = i.classList.contains('ic-qty') ? 1 : (i.classList.contains('ic-price') ? 0 : ''); });
    tbody.appendChild(tr); bind(tr); calc(); tr.querySelector('input').focus();
  });
  ['icDisc', 'icTax'].forEach(function (id) { document.getElementById(id).addEventListener('input', calc); });
  calc();
})();
