/*!
 * مرصاد | Mirsad Admin v2.0.0 — init.js
 * يُحمَّل داخل <head> مباشرة بعد ملف Bootstrap CSS لتطبيق الاتجاه والوضع الداكن قبل رسم الصفحة (بدون وميض).
 * Loaded in <head> right after the Bootstrap CSS link: applies direction/theme before first paint.
 */
(function () {
  var d = document.documentElement, dir = 'rtl', theme = 'light', collapsed = false, color = '';
  try {
    dir = localStorage.getItem('mirsad-dir') || 'rtl';
    theme = localStorage.getItem('mirsad-theme') || 'light';
    collapsed = localStorage.getItem('mirsad-sidebar') === 'collapsed';
    color = localStorage.getItem('mirsad-color') || '';
  } catch (e) { /* التخزين غير متاح — storage unavailable (private mode / file://) */ }
  if (dir !== 'ltr') dir = 'rtl';
  if (theme !== 'dark') theme = 'light';
  d.setAttribute('dir', dir);
  d.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
  d.setAttribute('data-bs-theme', theme);
  if (collapsed) d.classList.add('sidebar-collapsed');
  if (/^[a-z]+$/.test(color) && color !== 'teal') d.setAttribute('data-zm-color', color);
  var link = document.getElementById('bs-css');
  if (link && dir === 'ltr') {
    link.setAttribute('href', link.getAttribute('href').replace('bootstrap.rtl.min.css', 'bootstrap.min.css'));
  }
})();
