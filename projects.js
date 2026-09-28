/*!
 * مرصاد | Mirsad Admin — projects.js — قائمة مهام تفاعلية (إنجاز/إضافة) — interactive task list.
 */
(function () {
  'use strict';
  var list = document.getElementById('taskList'), count = document.getElementById('taskCount');
  function upd() { count.textContent = list.querySelectorAll('.zm-task:not(.done)').length; }
  function bind(l) { l.querySelector('input').addEventListener('change', function (e) { l.classList.toggle('done', e.target.checked); upd(); }); }
  list.querySelectorAll('.zm-task').forEach(bind);
  var inp = document.getElementById('taskInput');
  function add() {
    var v = inp.value.trim(); if (!v) { inp.focus(); return; }
    var l = document.createElement('label');
    l.className = 'd-flex align-items-center gap-3 py-2 border-bottom zm-task';
    l.innerHTML = '<input class="form-check-input mt-0" type="checkbox"><span class="flex-grow-1"></span><span class="badge rounded-pill bg-soft-secondary">' + Mirsad.t('منخفضة') + '</span>';
    l.querySelector('span').textContent = v;
    inp.closest('.input-group').before(l); bind(l); inp.value = ''; upd();
  }
  document.getElementById('taskAdd').addEventListener('click', add);
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
  upd();
})();
