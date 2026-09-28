/*!
 * Mirsad Admin — pages/calendar.js
 * تقويم شهري خفيف بلغة JavaScript خالصة (بدون مكتبات).
 * Lightweight month-grid calendar in vanilla JS (no plugins).
 * الأحداث التجريبية تُنشأ نسبةً إلى الشهر الحالي لتظهر دائمًا.
 */
(function () {
  'use strict';
  var Z = window.Mirsad;
  var grid = document.getElementById('calGrid');
  if (!grid) return;

  var CAT_CLASS = { work: 'bg-soft-primary', personal: 'bg-soft-accent', deadline: 'bg-soft-danger', holiday: 'bg-soft-warning' };
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var active = { work: true, personal: true, deadline: true, holiday: true };

  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  /* تاريخ بإزاحة أيام عن اليوم — date N days from today */
  function rel(days) { return iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)); }

  /* أحداث تجريبية نسبةً إلى اليوم — demo events relative to today */
  var EVENTS = [
    { date: rel(-26), title: 'مراجعة الربع الثالث', cat: 'work' },
    { date: rel(-21), title: 'اجتماع الفريق الأسبوعي', cat: 'work' },
    { date: rel(-18), title: 'تسليم تصاميم الصفحة الرئيسية', cat: 'deadline' },
    { date: rel(-14), title: 'اجتماع الفريق الأسبوعي', cat: 'work' },
    { date: rel(-14), title: 'عرض تقديمي للعميل', cat: 'work' },
    { date: rel(-11), title: 'موعد طبيب الأسنان', cat: 'personal' },
    { date: rel(-7), title: 'اجتماع الفريق الأسبوعي', cat: 'work' },
    { date: rel(-5), title: 'إطلاق النسخة التجريبية', cat: 'deadline' },
    { date: rel(-3), title: 'ورشة تجربة المستخدم', cat: 'work' },
    { date: rel(0), title: 'اجتماع الفريق الأسبوعي', cat: 'work' },
    { date: rel(1), title: 'عشاء عائلي', cat: 'personal' },
    { date: rel(2), title: 'تقرير نهاية الشهر', cat: 'deadline' },
    { date: rel(4), title: 'إجازة اليوم الوطني', cat: 'holiday' },
    { date: rel(4), title: 'مراجعة الميزانية', cat: 'work' },
    { date: rel(4), title: 'متابعة الموردين', cat: 'work' },
    { date: rel(4), title: 'مكالمة مع المستثمرين', cat: 'work' },
    { date: rel(7), title: 'اجتماع الفريق الأسبوعي', cat: 'work' },
    { date: rel(9), title: 'مؤتمر التقنية السنوي', cat: 'work' },
    { date: rel(15), title: 'إجازة قصيرة', cat: 'holiday' }
  ];
  var fmtDay = new Intl.DateTimeFormat(Z.lang === 'en' ? 'en-GB' : 'ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' });
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function render() {
    var y = view.getFullYear(), m = view.getMonth();
    document.getElementById('calTitle').textContent = Z.monthsFull()[m] + ' ' + y;
    var first = new Date(y, m, 1);
    var start = new Date(y, m, 1 - first.getDay()); // الأسبوع يبدأ الأحد — week starts on Sunday
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var cells = Math.ceil((first.getDay() + daysInMonth) / 7) * 7;
    var html = Z.days().map(function (d) { return '<div class="zm-cal-dow" role="columnheader">' + d + '</div>'; }).join('');
    for (var i = 0; i < cells; i++) {
      var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      var key = iso(d);
      var evs = EVENTS.filter(function (e) { return e.date === key && active[e.cat]; });
      var cls = 'zm-cal-day' + (d.getMonth() !== m ? ' other' : '') + (d.getTime() === today.getTime() ? ' today' : '');
      var evHtml = evs.slice(0, 3).map(function (e) {
        return '<span class="zm-cal-event ' + CAT_CLASS[e.cat] + '" title="' + esc(Z.t(e.title)) + '">' + esc(Z.t(e.title)) + '</span>';
      }).join('');
      if (evs.length > 3) evHtml += '<span class="fs-7 text-muted d-block mt-1">+' + (evs.length - 3) + ' ' + Z.t('المزيد') + '</span>';
      html += '<div class="' + cls + '" role="gridcell" tabindex="0" data-date="' + key + '" aria-label="' + esc(fmtDay.format(d)) + '"><span class="zm-cal-num">' + d.getDate() + '</span>' + evHtml + '</div>';
    }
    grid.innerHTML = html;
    renderUpcoming();
  }

  function renderUpcoming() {
    var list = EVENTS.filter(function (e) { return e.date >= iso(today) && active[e.cat]; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; }).slice(0, 5);
    document.getElementById('upcoming').innerHTML = list.length ? list.map(function (e) {
      var p = e.date.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
      return '<li class="d-flex gap-3 align-items-center py-2 border-bottom"><span class="zm-kpi-icon ' + CAT_CLASS[e.cat] + '" style="width:40px;height:40px;font-size:.95rem;font-weight:800">' + d.getDate() + '</span>' +
        '<div class="min-w-0"><div class="fw-medium small text-truncate">' + esc(Z.t(e.title)) + '</div><div class="fs-7 text-muted">' + esc(fmtDay.format(d)) + '</div></div></li>';
    }).join('') : '<li class="small text-muted">' + Z.t('لا توجد أحداث قادمة') + '</li>';
  }

  document.getElementById('calPrev').addEventListener('click', function () { view.setMonth(view.getMonth() - 1); render(); });
  document.getElementById('calNext').addEventListener('click', function () { view.setMonth(view.getMonth() + 1); render(); });
  document.getElementById('calToday').addEventListener('click', function () { view = new Date(today.getFullYear(), today.getMonth(), 1); render(); });
  document.querySelectorAll('.zm-cat-filter').forEach(function (c) {
    c.addEventListener('change', function () { active[c.value] = c.checked; render(); });
  });

  /* النقر على يوم يفتح نافذة إضافة حدث — click a day to add an event */
  var modalEl = document.getElementById('eventModal');
  var openFor = function (date) {
    document.getElementById('evDate').value = date;
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  };
  grid.addEventListener('click', function (e) { var c = e.target.closest('.zm-cal-day'); if (c) openFor(c.getAttribute('data-date')); });
  grid.addEventListener('keydown', function (e) {
    var c = e.target.closest('.zm-cal-day');
    if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openFor(c.getAttribute('data-date')); }
  });
  modalEl.addEventListener('show.bs.modal', function () {
    if (!document.getElementById('evDate').value) document.getElementById('evDate').value = iso(today);
  });
  modalEl.addEventListener('shown.bs.modal', function () { document.getElementById('evTitle').focus(); });
  var form = document.getElementById('eventForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    var date = document.getElementById('evDate').value;
    EVENTS.push({ date: date, title: document.getElementById('evTitle').value.trim(), cat: document.getElementById('evCat').value });
    var p = date.split('-');
    view = new Date(+p[0], +p[1] - 1, 1);
    render();
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    form.reset();
    setTimeout(function () { form.classList.remove('was-validated'); }, 0);
    Z.toast('تمت إضافة الحدث إلى التقويم');
  });

  render();
})();
