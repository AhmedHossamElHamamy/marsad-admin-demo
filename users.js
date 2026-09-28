/*!
 * Mirsad Admin — pages/users.js
 * قائمة المستخدمين: بحث وتصفية وترتيب وترقيم صفحات بالكامل في المتصفح.
 * Users list: client-side search, filters, sorting and pagination.
 * استبدل مصفوفة USERS ببيانات من واجهتك البرمجية (API) عند الربط الفعلي.
 */
(function () {
  'use strict';
  var Z = window.Mirsad;
  var body = document.getElementById('uBody');
  if (!body) return;

  /* بيانات تجريبية وهمية — fictional demo data */
  var NAMES = [
    ['سارة القحطاني', 'sara.q'], ['محمد العتيبي', 'm.otaibi'], ['نورة الشمري', 'noura.sh'], ['عبدالله الزهراني', 'a.zahrani'],
    ['ليلى المصري', 'layla.m'], ['خالد الحربي', 'khaled.h'], ['ريم الدوسري', 'reem.d'], ['يوسف الأنصاري', 'yousef.a'],
    ['هند السبيعي', 'hind.s'], ['عمر الفارس', 'omar.f'], ['مريم البلوشي', 'maryam.b'], ['فيصل المطيري', 'faisal.m'],
    ['جود الغامدي', 'joud.g'], ['أحمد النجار', 'ahmad.n'], ['لمى العنزي', 'lama.e'], ['طارق الكردي', 'tareq.k'],
    ['دانة الرشيد', 'dana.r'], ['سلمان الشهري', 'salman.sh'], ['رهف العمري', 'rahaf.o'], ['ماجد السالم', 'majed.s'],
    ['أمل الحمدان', 'amal.h'], ['بدر الخالدي', 'badr.k'], ['شهد الجهني', 'shahad.j'], ['زياد التميمي', 'ziad.t'],
    ['حصة المالكي', 'hessa.m'], ['نايف القرني', 'naif.q'], ['وعد الحازمي', 'waad.h'], ['راكان السديري', 'rakan.s'],
    ['غدير الشريف', 'ghadeer.sh'], ['مازن العيسى', 'mazen.e'], ['تالا الهاشمي', 'tala.h'], ['إياد الصالح', 'iyad.s'],
    ['بشرى الكبيسي', 'bushra.k'], ['سامي البنا', 'sami.b'], ['روان العلي', 'rawan.a'], ['حمد الكعبي', 'hamad.k']
  ];
  var ROLES = ['admin', 'editor', 'sales', 'support'];
  var STATUSES = ['active', 'active', 'active', 'pending', 'suspended'];
  var ROLE_LABEL = { admin: 'مدير', editor: 'محرر', sales: 'مبيعات', support: 'دعم فني' };
  var STATUS_LABEL = { active: 'نشط', pending: 'معلق', suspended: 'موقوف' };
  var STATUS_CLASS = { active: 'bg-soft-success', pending: 'bg-soft-warning', suspended: 'bg-soft-danger' };
  var COLORS = ['#0A7F72', '#6C5CE7', '#F59E0B', '#E5484D', '#3B82F6', '#0EA5E9', '#D946EF', '#16A34A', '#F97316', '#64748B'];

  var USERS = NAMES.map(function (n, i) {
    var d = new Date(2024, (i * 5) % 12, 1 + (i * 7) % 27);
    d.setMonth(d.getMonth() + Math.floor(i / 3));
    return { id: i + 1, name: n[0], email: n[1] + '@example.com', role: ROLES[(i * 3 + 1) % 4], status: STATUSES[(i * 7) % 5], joined: d, orders: (i * 37 + 11) % 180 };
  });

  var state = { q: '', role: '', status: '', sort: 'joined', dir: 'desc', page: 1, size: 10 };

  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (p) { return (p.indexOf('ال') === 0 && p.length > 2 ? p.slice(2) : p).charAt(0); }).join('‌');
  }
  function colorFor(name) { var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0; return COLORS[h % COLORS.length]; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var dateFmt = new Intl.DateTimeFormat(Z.lang === 'en' ? 'en-GB' : 'ar-EG-u-nu-latn', { day: 'numeric', month: 'short', year: 'numeric' });

  function filtered() {
    var q = state.q.toLowerCase();
    var list = USERS.filter(function (u) {
      return (!q || u.name.toLowerCase().indexOf(q) !== -1 || u.email.indexOf(q) !== -1) &&
        (!state.role || u.role === state.role) && (!state.status || u.status === state.status);
    });
    var k = state.sort, dir = state.dir === 'asc' ? 1 : -1;
    list.sort(function (a, b) {
      var x = a[k], y = b[k];
      if (k === 'name') return x.localeCompare(y, 'ar') * dir;
      return (x > y ? 1 : x < y ? -1 : 0) * dir;
    });
    return list;
  }

  function render() {
    var list = filtered();
    var pages = Math.max(1, Math.ceil(list.length / state.size));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * state.size;
    var rows = list.slice(start, start + state.size);
    body.innerHTML = rows.map(function (u) {
      return '<tr data-id="' + u.id + '">' +
        '<td><input class="form-check-input u-check" type="checkbox" aria-label="' + esc(Z.t('تحديد')) + '"></td>' +
        '<td><div class="zm-user-cell"><span class="avatar avatar-sm" style="--av:' + colorFor(u.name) + '" aria-hidden="true">' + initials(u.name) + '</span>' +
        '<div class="min-w-0"><div class="fw-bold text-nowrap">' + esc(u.name) + '</div><div class="fs-7 text-muted"><span class="ltr-num">' + esc(u.email) + '</span></div></div></div></td>' +
        '<td>' + Z.t(ROLE_LABEL[u.role]) + '</td>' +
        '<td><span class="badge rounded-pill badge-dot ' + STATUS_CLASS[u.status] + '">' + Z.t(STATUS_LABEL[u.status]) + '</span></td>' +
        '<td class="text-muted text-nowrap">' + dateFmt.format(u.joined) + '</td>' +
        '<td class="fw-medium">' + u.orders + '</td>' +
        '<td class="text-end text-nowrap"><a href="profile.html" class="btn btn-sm btn-light btn-icon" aria-label="' + esc(Z.t('عرض الملف')) + '"><i class="bi bi-eye"></i></a> ' +
        '<button type="button" class="btn btn-sm btn-soft-danger btn-icon u-del" aria-label="' + esc(Z.t('حذف')) + '"><i class="bi bi-trash"></i></button></td></tr>';
    }).join('');
    document.getElementById('uEmpty').classList.toggle('d-none', list.length > 0);
    document.getElementById('uAll').checked = false;
    var from = list.length ? start + 1 : 0, to = Math.min(start + state.size, list.length);
    document.getElementById('uInfo').innerHTML = Z.lang === 'en'
      ? 'Showing <b>' + from + '–' + to + '</b> of <b>' + list.length + '</b>'
      : 'عرض <b class="ltr-num">' + from + '–' + to + '</b> من <b class="ltr-num">' + list.length + '</b> مستخدم';
    renderPager(pages);
    document.querySelectorAll('#uTable th[data-sort]').forEach(function (th) {
      th.classList.remove('asc', 'desc');
      th.removeAttribute('aria-sort');
      if (th.getAttribute('data-sort') === state.sort) {
        th.classList.add(state.dir);
        th.setAttribute('aria-sort', state.dir === 'asc' ? 'ascending' : 'descending');
      }
    });
  }

  function renderPager(pages) {
    var p = state.page, html = '';
    var item = function (label, page, disabled, active, aria) {
      return '<li class="page-item' + (disabled ? ' disabled' : '') + (active ? ' active' : '') + '"><a class="page-link" href="#" data-page="' + page + '"' +
        (aria ? ' aria-label="' + aria + '"' : '') + (active ? ' aria-current="page"' : '') + '>' + label + '</a></li>';
    };
    html += item('<i class="bi bi-chevron-right flip-ltr"></i>', p - 1, p === 1, false, Z.t('السابق'));
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - p) <= 1) html += item(i, i, false, i === p);
      else if (Math.abs(i - p) === 2) html += '<li class="page-item disabled"><span class="page-link">…</span></li>';
    }
    html += item('<i class="bi bi-chevron-left flip-ltr"></i>', p + 1, p === pages, false, Z.t('التالي'));
    document.getElementById('uPager').innerHTML = html;
  }

  /* الأحداث — events */
  var debounce;
  document.getElementById('uSearch').addEventListener('input', function (e) {
    clearTimeout(debounce);
    debounce = setTimeout(function () { state.q = e.target.value.trim(); state.page = 1; render(); }, 150);
  });
  document.getElementById('uRole').addEventListener('change', function (e) { state.role = e.target.value; state.page = 1; render(); });
  document.getElementById('uStatus').addEventListener('change', function (e) { state.status = e.target.value; state.page = 1; render(); });
  document.getElementById('uSize').addEventListener('change', function (e) { state.size = +e.target.value; state.page = 1; render(); });
  document.getElementById('uPager').addEventListener('click', function (e) {
    var a = e.target.closest('[data-page]');
    if (!a) return;
    e.preventDefault();
    if (a.parentElement.classList.contains('disabled')) return;
    state.page = +a.getAttribute('data-page');
    render();
  });
  document.querySelectorAll('#uTable th[data-sort]').forEach(function (th) {
    th.setAttribute('tabindex', '0');
    var go = function () {
      var k = th.getAttribute('data-sort');
      state.dir = state.sort === k && state.dir === 'asc' ? 'desc' : 'asc';
      state.sort = k; state.page = 1; render();
    };
    th.addEventListener('click', go);
    th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  document.getElementById('uAll').addEventListener('change', function (e) {
    body.querySelectorAll('.u-check').forEach(function (c) { c.checked = e.target.checked; });
  });
  body.addEventListener('click', function (e) {
    var del = e.target.closest('.u-del');
    if (!del) return;
    var id = +del.closest('tr').getAttribute('data-id');
    USERS = USERS.filter(function (u) { return u.id !== id; });
    render();
    Z.toast('تم حذف المستخدم', 'danger');
  });

  /* إضافة مستخدم — add user (modal form) */
  var form = document.getElementById('userForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    USERS.unshift({
      id: Date.now(), name: document.getElementById('nuName').value.trim(), email: document.getElementById('nuEmail').value.trim().toLowerCase(),
      role: document.getElementById('nuRole').value, status: document.getElementById('nuStatus').value, joined: new Date(), orders: 0
    });
    state.sort = 'joined'; state.dir = 'desc'; state.page = 1;
    render();
    bootstrap.Modal.getOrCreateInstance(document.getElementById('userModal')).hide();
    form.reset();
    setTimeout(function () { form.classList.remove('was-validated'); }, 0);
    Z.toast('تمت إضافة المستخدم بنجاح');
  });

  render();
})();
