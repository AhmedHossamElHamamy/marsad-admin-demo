/*!
 * مرصاد | Mirsad Admin v2.0.0 — app.js
 * السكربت الرئيسي المشترك بين كل الصفحات. Shared core script for every page.
 * ----------------------------------------------------------------------------
 *  - Mirsad.t(text)          ترجمة نص عربي إلى الإنجليزية عند تفعيل الاتجاه LTR
 *  - Mirsad.setTheme('dark') تبديل الوضع الداكن/الفاتح
 *  - Mirsad.setDir('ltr')    تبديل اتجاه الواجهة (RTL/LTR)
 *  - Mirsad.toast(msg,type)  إظهار إشعار منبثق
 *  - Mirsad.chartColors()    ألوان الرسوم البيانية حسب الوضع الحالي
 * Depends on: bootstrap.bundle.min.js, i18n.js (and Chart.js on chart pages).
 */
(function () {
  'use strict';

  var doc = document.documentElement;
  var Z = window.Mirsad = window.Mirsad || {};

  /* ---------- التخزين الآمن — safe localStorage wrapper ---------- */
  Z.store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  };

  Z.dir = doc.getAttribute('dir') === 'ltr' ? 'ltr' : 'rtl';
  Z.isRTL = Z.dir === 'rtl';
  Z.lang = Z.isRTL ? 'ar' : 'en';

  /* ---------- الترجمة — i18n (Arabic source text → English) ---------- */
  var dict = window.MIRSAD_I18N || {};
  var norm = function (s) { return s.replace(/\s+/g, ' ').trim(); };
  Z.t = function (s) {
    if (Z.lang !== 'en' || s == null) return s;
    var k = norm(String(s));
    return Object.prototype.hasOwnProperty.call(dict, k) ? dict[k] : s;
  };
  Z.translate = function (root) {
    if (Z.lang !== 'en') return;
    root = root || document.body;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node, list = [];
    while ((node = walker.nextNode())) list.push(node);
    list.forEach(function (n) {
      var p = n.parentElement;
      if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName) || p.closest('[data-no-i18n]')) return;
      var raw = n.nodeValue, k = norm(raw);
      if (k && Object.prototype.hasOwnProperty.call(dict, k)) {
        n.nodeValue = raw.replace(/^(\s*)[\s\S]*?(\s*)$/, '$1' + dict[k] + '$2');
      }
    });
    var attrs = ['placeholder', 'title', 'aria-label', 'data-bs-title', 'data-bs-content', 'alt'];
    root.querySelectorAll('[placeholder],[title],[aria-label],[data-bs-title],[data-bs-content],[alt]').forEach(function (el) {
      attrs.forEach(function (a) {
        var v = el.getAttribute(a);
        if (v && dict[norm(v)]) el.setAttribute(a, dict[norm(v)]);
      });
    });
  };
  function translateTitle() {
    if (Z.lang !== 'en') return;
    document.title = document.title.split(' | ').map(function (p) { return Z.t(p); }).join(' | ');
  }

  /* ---------- أدوات أرقام وتواريخ — number & date helpers ---------- */
  Z.fmt = function (n, d) { return new Intl.NumberFormat('en-US', { maximumFractionDigits: d == null ? 0 : d }).format(n); };
  Z.months = function () {
    return Z.lang === 'en'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  };
  Z.monthsFull = function () {
    return Z.lang === 'en'
      ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      : Z.months();
  };
  Z.days = function () {
    return Z.lang === 'en'
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  };

  /* ---------- الوضع الداكن — theme ---------- */
  Z.theme = doc.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
  function syncThemeIcons() {
    document.querySelectorAll('[data-zm-toggle="theme"] .bi').forEach(function (i) {
      i.className = 'bi ' + (Z.theme === 'dark' ? 'bi-sun' : 'bi-moon-stars');
    });
  }
  Z.setTheme = function (t) {
    Z.theme = t === 'dark' ? 'dark' : 'light';
    doc.setAttribute('data-bs-theme', Z.theme);
    Z.store.set('mirsad-theme', Z.theme);
    syncThemeIcons();
    Z.refreshCharts();
    document.dispatchEvent(new CustomEvent('mirsad:theme', { detail: Z.theme }));
  };

  /* ---------- اتجاه الواجهة — direction (RTL ⇄ LTR) ---------- */
  Z.setDir = function (dir) {
    dir = dir === 'ltr' ? 'ltr' : 'rtl';
    if (Z.store.set('mirsad-dir', dir)) { window.location.reload(); return; }
    // التخزين غير متاح: نطبق التغيير مباشرة دون إعادة تحميل — storage blocked: apply in place
    doc.setAttribute('dir', dir);
    doc.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    var link = document.getElementById('bs-css');
    if (link) {
      var h = link.getAttribute('href');
      link.setAttribute('href', dir === 'ltr' ? h.replace('bootstrap.rtl.min.css', 'bootstrap.min.css') : h.replace('bootstrap.min.css', 'bootstrap.rtl.min.css'));
    }
    Z.dir = dir; Z.isRTL = dir === 'rtl'; Z.lang = Z.isRTL ? 'ar' : 'en';
    Z.translate(); syncDirLabels();
  };
  function syncDirLabels() {
    document.querySelectorAll('[data-zm-toggle="dir"] .zm-dir-label').forEach(function (el) {
      el.textContent = Z.isRTL ? 'EN' : 'ع';
    });
  }

  /* ---------- الشريط الجانبي — sidebar ---------- */
  var isDesktop = function () { return window.matchMedia('(min-width: 992px)').matches; };
  Z.toggleSidebar = function () {
    if (isDesktop()) {
      var c = doc.classList.toggle('sidebar-collapsed');
      Z.store.set('mirsad-sidebar', c ? 'collapsed' : 'expanded');
      setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 260);
    } else {
      doc.classList.toggle('sidebar-open');
    }
  };
  Z.closeSidebar = function () { doc.classList.remove('sidebar-open'); };

  /* ---------- الإشعارات المنبثقة — toasts ---------- */
  Z.toast = function (message, type) {
    type = type || 'success';
    var icons = { success: 'bi-check-circle-fill text-success', danger: 'bi-x-circle-fill text-danger', warning: 'bi-exclamation-triangle-fill text-warning', info: 'bi-info-circle-fill text-info' };
    var wrap = document.querySelector('.zm-toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'zm-toast-wrap'; document.body.appendChild(wrap); }
    var el = document.createElement('div');
    el.className = 'toast align-items-center border-0 shadow';
    el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); el.setAttribute('aria-atomic', 'true');
    el.innerHTML = '<div class="d-flex align-items-center gap-2 p-3"><i class="bi ' + (icons[type] || icons.info) + ' fs-5"></i>' +
      '<div class="flex-grow-1 fw-medium"></div><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="' + Z.t('إغلاق') + '"></button></div>';
    el.querySelector('.flex-grow-1').textContent = Z.t(message);
    wrap.appendChild(el);
    var t = new bootstrap.Toast(el, { delay: 3500 });
    el.addEventListener('hidden.bs.toast', function () { el.remove(); });
    t.show();
    return t;
  };

  /* ---------- الرسوم البيانية — Chart.js theming ---------- */
  Z.cssVar = function (name) { return getComputedStyle(doc).getPropertyValue(name).trim(); };
  Z.palette = { primary: '#14B8A6', primaryDark: '#0A7F72', accent: '#6C5CE7', warning: '#F59E0B', danger: '#F0616D', info: '#3B9EF5', success: '#22C55E', slate: '#94A3B8' };
  Z.chartColors = function () {
    return { text: Z.cssVar('--zm-muted') || '#6B7686', grid: Z.theme === 'dark' ? 'rgba(148,163,184,.12)' : 'rgba(15,23,38,.06)', card: Z.cssVar('--zm-card-bg') || '#fff', heading: Z.cssVar('--zm-heading') };
  };
  Z.alpha = function (hex, a) {
    var h = hex.replace('#', ''), n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  };
  /* تدرج لوني للرسوم المساحية — vertical gradient fill for area charts */
  Z.gradient = function (color, from, to) {
    return function (ctx) {
      var chart = ctx.chart, area = chart.chartArea;
      if (!area) return Z.alpha(color, from);
      var g = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
      g.addColorStop(0, Z.alpha(color, from)); g.addColorStop(1, Z.alpha(color, to));
      return g;
    };
  };
  /* إعدادات عامة — global options (override before app.js: window.Mirsad = { config: { mirrorChartsInRTL: false } }) */
  Z.config = Object.assign({ mirrorChartsInRTL: true }, Z.config || {});
  /* هل نعكس محاور الرسوم في RTL؟ (الزمن يتجه من اليمين لليسار) — mirror time axes in RTL? */
  Z.mirror = function () { return Z.isRTL && Z.config.mirrorChartsInRTL; };
  /* محاور تحترم الاتجاه — direction-aware cartesian axes */
  Z.axes = function (opts) {
    opts = opts || {};
    return {
      x: Object.assign({ reverse: Z.mirror(), grid: { display: false }, border: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 12, align: 'inner' } }, opts.x || {}),
      y: Object.assign({ position: Z.mirror() ? 'right' : 'left', grid: { drawTicks: false }, border: { display: false }, ticks: { padding: 8 }, beginAtZero: true }, opts.y || {})
    };
  };
  Z.initCharts = function () {
    if (!window.Chart) return;
    var c = Z.chartColors();
    var C = window.Chart.defaults;
    // خط الرسوم يُقرأ من متغير CSS ‎--zm-font — chart font follows the --zm-font CSS variable
    C.font.family = getComputedStyle(document.documentElement).getPropertyValue('--zm-font').trim() || "'Tajawal', system-ui, sans-serif";
    C.font.size = 12;
    C.color = c.text;
    C.borderColor = c.grid;
    C.responsive = true;
    C.maintainAspectRatio = false;
    C.plugins.legend.rtl = Z.isRTL;
    C.plugins.legend.textDirection = Z.dir;
    C.plugins.legend.labels.usePointStyle = true;
    C.plugins.legend.labels.pointStyle = 'circle';
    C.plugins.legend.labels.boxWidth = 8;
    C.plugins.legend.labels.boxHeight = 8;
    C.plugins.legend.labels.padding = 16;
    C.plugins.tooltip.rtl = Z.isRTL;
    C.plugins.tooltip.textDirection = Z.dir;
    C.plugins.tooltip.backgroundColor = '#0F1A2A';
    C.plugins.tooltip.padding = 12;
    C.plugins.tooltip.cornerRadius = 10;
    C.plugins.tooltip.boxPadding = 6;
    C.plugins.tooltip.usePointStyle = true;
    C.plugins.tooltip.titleFont = { weight: 'bold' };
    C.elements.line.tension = 0.4;
    C.elements.line.borderWidth = 2.5;
    C.elements.point.radius = 0;
    C.elements.point.hoverRadius = 5;
    C.elements.point.hitRadius = 12;
    C.elements.bar.borderRadius = 6;
    C.elements.arc.borderWidth = 3;
    C.interaction = { mode: 'index', intersect: false };
  };
  Z.refreshCharts = function () {
    if (!window.Chart) return;
    var c = Z.chartColors();
    window.Chart.defaults.color = c.text;
    window.Chart.defaults.borderColor = c.grid;
    Object.values(window.Chart.instances).forEach(function (ch) {
      var scales = ch.options.scales || {};
      Object.keys(scales).forEach(function (k) {
        var s = scales[k];
        if (s.ticks) s.ticks.color = c.text;
        if (s.pointLabels) s.pointLabels.color = c.text;
        if (s.grid && s.grid.display !== false) s.grid.color = c.grid;
        if (s.angleLines) s.angleLines.color = c.grid;
      });
      if (ch.options.plugins && ch.options.plugins.legend && ch.options.plugins.legend.labels) ch.options.plugins.legend.labels.color = c.text;
      if (/doughnut|pie|polarArea/.test(ch.config.type)) {
        ch.data.datasets.forEach(function (ds) { ds.borderColor = c.card; });
      }
      ch.update('none');
    });
  };

  // تُضبط إعدادات الرسوم فورًا قبل سكربتات الصفحات — chart defaults are applied before page scripts run
  Z.initCharts();
  // لون الرسوم يتبع لون الواجهة المختار — chart primary follows the selected color preset
  if (doc.getAttribute('data-zm-color')) { Z.palette.primary = Z.cssVar('--zm-primary-bright') || Z.palette.primary; Z.palette.primaryDark = Z.cssVar('--zm-primary') || Z.palette.primaryDark; }

  /* ---------- التهيئة — boot ---------- */
  /* ---------- لوحة التخصيص — customizer (8 color presets, theme, direction, sidebar) ---------- */
  Z.setColor = function (c) {
    if (!c || c === 'teal') { doc.removeAttribute('data-zm-color'); c = 'teal'; } else { doc.setAttribute('data-zm-color', c); }
    Z.store.set('mirsad-color', c);
    Z.palette.primary = Z.cssVar('--zm-primary-bright') || Z.palette.primary;
    Z.palette.primaryDark = Z.cssVar('--zm-primary') || Z.palette.primaryDark;
    syncCustomizer();
    if (window.Chart && Object.keys(window.Chart.instances).length) { setTimeout(function () { window.location.reload(); }, 150); }
  };
  function syncCustomizer() {
    var c = doc.getAttribute('data-zm-color') || 'teal';
    document.querySelectorAll('[data-zm-preset]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-zm-preset') === c); b.setAttribute('aria-pressed', b.classList.contains('active')); });
    document.querySelectorAll('[data-zm-set-theme]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-zm-set-theme') === Z.theme); });
    document.querySelectorAll('[data-zm-set-dir]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-zm-set-dir') === Z.dir); });
    var col = doc.classList.contains('sidebar-collapsed') ? 'collapsed' : 'expanded';
    document.querySelectorAll('[data-zm-set-sidebar]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-zm-set-sidebar') === col); });
  }
  function bootCustomizer() {
    Z.palette.primary = Z.cssVar('--zm-primary-bright') || Z.palette.primary;
    Z.palette.primaryDark = Z.cssVar('--zm-primary') || Z.palette.primaryDark;
    document.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-zm-preset]'))) Z.setColor(b.getAttribute('data-zm-preset'));
      else if ((b = e.target.closest('[data-zm-set-theme]'))) { Z.setTheme(b.getAttribute('data-zm-set-theme')); syncCustomizer(); }
      else if ((b = e.target.closest('[data-zm-set-dir]'))) { if (b.getAttribute('data-zm-set-dir') !== Z.dir) Z.setDir(b.getAttribute('data-zm-set-dir')); }
      else if ((b = e.target.closest('[data-zm-set-sidebar]'))) {
        var want = b.getAttribute('data-zm-set-sidebar') === 'collapsed';
        if (want !== doc.classList.contains('sidebar-collapsed')) { doc.classList.toggle('sidebar-collapsed', want); Z.store.set('mirsad-sidebar', want ? 'collapsed' : 'expanded'); setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 260); }
        syncCustomizer();
      } else if (e.target.closest('[data-zm-reset]')) {
        ['mirsad-color', 'mirsad-theme', 'mirsad-dir', 'mirsad-sidebar'].forEach(function (k) { try { localStorage.removeItem(k); } catch (err) { } });
        window.location.reload();
      }
    });
    syncCustomizer();
  }

  function boot() {
    bootCustomizer();
    translateTitle();
    Z.translate();
    syncThemeIcons();
    syncDirLabels();

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-zm-toggle]');
      if (t) {
        var what = t.getAttribute('data-zm-toggle');
        if (what === 'theme') { e.preventDefault(); Z.setTheme(Z.theme === 'dark' ? 'light' : 'dark'); }
        if (what === 'dir') { e.preventDefault(); Z.setDir(Z.isRTL ? 'ltr' : 'rtl'); }
        if (what === 'sidebar') { e.preventDefault(); Z.toggleSidebar(); }
      }
      if (e.target.closest('.zm-backdrop')) Z.closeSidebar();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') Z.closeSidebar();
      var search = document.getElementById('zmSearch');
      if (search && ((e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)))) {
        e.preventDefault(); search.focus();
      }
    });
    window.addEventListener('resize', function () { if (isDesktop()) Z.closeSidebar(); });

    /* البحث السريع في القائمة — quick navigation: type a page name + Enter */
    var search = document.getElementById('zmSearch');
    if (search) {
      search.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var q = search.value.trim().toLowerCase();
        if (!q) return;
        var hit = Array.prototype.find.call(document.querySelectorAll('.zm-nav a.zm-nav-link[href]'), function (a) {
          return a.getAttribute('href') !== '#' && a.textContent.toLowerCase().indexOf(q) !== -1;
        });
        if (hit) window.location.href = hit.getAttribute('href');
        else Z.toast('لا توجد صفحة مطابقة', 'warning');
      });
    }

    /* مكونات Bootstrap — tooltips & popovers */
    if (window.bootstrap) {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) { new bootstrap.Tooltip(el); });
      document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (el) { new bootstrap.Popover(el); });
    }

    /* التحقق من النماذج — Bootstrap form validation for .needs-validation */
    document.querySelectorAll('form.needs-validation').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var extra = typeof form.zmValidate === 'function' ? form.zmValidate() : true;
        if (!form.checkValidity() || !extra) {
          e.preventDefault(); e.stopPropagation();
          form.classList.add('was-validated');
          var first = form.querySelector(':invalid');
          if (first) first.focus();
          return;
        }
        form.classList.add('was-validated');
        if (form.hasAttribute('data-zm-demo')) {
          e.preventDefault();
          Z.toast(form.getAttribute('data-zm-demo') || 'تم الحفظ بنجاح');
          var go = form.getAttribute('data-zm-redirect');
          if (go) setTimeout(function () { window.location.href = go; }, 900);
        }
      }, false);
    });

    /* إظهار/إخفاء كلمة المرور — password visibility */
    document.querySelectorAll('.zm-pass-toggle').forEach(function (b) {
      b.addEventListener('click', function () {
        var input = b.parentElement.querySelector('input');
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        b.querySelector('.bi').className = 'bi ' + (show ? 'bi-eye-slash' : 'bi-eye');
      });
    });

    /* تحديد الكل — "select all" checkboxes */
    document.querySelectorAll('[data-zm-check-all]').forEach(function (all) {
      all.addEventListener('change', function () {
        document.querySelectorAll(all.getAttribute('data-zm-check-all')).forEach(function (c) { c.checked = all.checked; });
      });
    });

    /* السنة الحالية في التذييل — current year */
    document.querySelectorAll('[data-zm-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
