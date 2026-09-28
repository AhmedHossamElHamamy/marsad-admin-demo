/*!
 * Mirsad Admin — pages/charts.js
 * أمثلة لكل أنواع الرسوم في Chart.js مع دعم RTL والوضع الداكن.
 * Chart.js examples (line, bar, stacked, area, doughnut, pie, polar, radar, bubble, mixed).
 */
(function () {
  'use strict';
  var Z = window.Mirsad, P = Z.palette;
  var M = Z.months().slice(0, 8);
  var el = function (id) { return document.getElementById(id); };
  var arcOpts = { plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'nearest' } } };

  if (el('lineChart')) new Chart(el('lineChart'), {
    type: 'line',
    data: { labels: M, datasets: [
      { label: Z.t('الزيارات'), data: [65, 59, 80, 81, 56, 75, 90, 98], borderColor: P.primary, backgroundColor: P.primary, pointRadius: 3 },
      { label: Z.t('المشتركون'), data: [28, 48, 40, 52, 46, 60, 58, 70], borderColor: P.accent, backgroundColor: P.accent, pointRadius: 3 }
    ] },
    options: { scales: Z.axes() }
  });

  if (el('barChart')) new Chart(el('barChart'), {
    type: 'bar',
    data: { labels: M, datasets: [
      { label: Z.t('المبيعات'), data: [42, 55, 48, 62, 70, 58, 76, 84], backgroundColor: P.primary, maxBarThickness: 18 },
      { label: Z.t('المرتجعات'), data: [8, 6, 9, 5, 7, 6, 4, 5], backgroundColor: P.warning, maxBarThickness: 18 }
    ] },
    options: { scales: Z.axes() }
  });

  if (el('stackedChart')) {
    var ax = Z.axes();
    ax.x.stacked = true; ax.y.stacked = true;
    new Chart(el('stackedChart'), {
      type: 'bar',
      data: { labels: M, datasets: [
        { label: Z.t('الرياض'), data: [30, 34, 32, 40, 44, 42, 48, 52], backgroundColor: P.primary, borderRadius: 0, maxBarThickness: 26 },
        { label: Z.t('جدة'), data: [20, 22, 25, 24, 30, 28, 33, 35], backgroundColor: P.accent, borderRadius: 0, maxBarThickness: 26 },
        { label: Z.t('الدمام'), data: [12, 14, 13, 16, 18, 17, 20, 22], backgroundColor: P.info, borderRadius: 0, maxBarThickness: 26 }
      ] },
      options: { scales: ax }
    });
  }

  if (el('areaChart')) new Chart(el('areaChart'), {
    type: 'line',
    data: { labels: M, datasets: [
      { label: Z.t('الإيرادات'), data: [30, 42, 38, 55, 50, 68, 64, 80], borderColor: P.accent, backgroundColor: Z.gradient(P.accent, 0.35, 0), fill: true },
      { label: Z.t('التكاليف'), data: [20, 26, 25, 30, 32, 36, 35, 40], borderColor: P.primary, backgroundColor: Z.gradient(P.primary, 0.25, 0), fill: true }
    ] },
    options: { scales: Z.axes() }
  });

  var card = Z.chartColors().card;
  if (el('doughnutChart')) new Chart(el('doughnutChart'), {
    type: 'doughnut',
    data: { labels: [Z.t('سطح المكتب'), Z.t('الجوال'), Z.t('الأجهزة اللوحية')], datasets: [{ data: [48, 41, 11], backgroundColor: [P.primary, P.accent, P.warning], borderColor: card }] },
    options: Object.assign({ cutout: '68%' }, arcOpts)
  });
  if (el('pieChart')) new Chart(el('pieChart'), {
    type: 'pie',
    data: { labels: [Z.t('جديد'), Z.t('عائد'), Z.t('غير نشط')], datasets: [{ data: [55, 30, 15], backgroundColor: [P.info, P.primary, P.slate], borderColor: card }] },
    options: arcOpts
  });
  if (el('polarChart')) new Chart(el('polarChart'), {
    type: 'polarArea',
    data: { labels: [Z.t('المبيعات'), Z.t('الدعم'), Z.t('التسويق'), Z.t('التقنية'), Z.t('المالية')], datasets: [{ data: [11, 16, 7, 14, 9], backgroundColor: [Z.alpha(P.primary, 0.7), Z.alpha(P.accent, 0.7), Z.alpha(P.warning, 0.7), Z.alpha(P.info, 0.7), Z.alpha(P.danger, 0.7)], borderColor: card }] },
    options: Object.assign({ scales: { r: { ticks: { display: false }, grid: { color: Z.chartColors().grid } } } }, arcOpts)
  });

  if (el('radarChart')) new Chart(el('radarChart'), {
    type: 'radar',
    data: { labels: [Z.t('السرعة'), Z.t('الجودة'), Z.t('السعر'), Z.t('الدعم'), Z.t('سهولة الاستخدام'), Z.t('الموثوقية')], datasets: [
      { label: Z.t('منتجنا'), data: [90, 85, 70, 95, 88, 92], borderColor: P.primary, backgroundColor: Z.alpha(P.primary, 0.2), pointRadius: 3, pointBackgroundColor: P.primary },
      { label: Z.t('المنافس'), data: [70, 75, 85, 60, 72, 68], borderColor: P.accent, backgroundColor: Z.alpha(P.accent, 0.15), pointRadius: 3, pointBackgroundColor: P.accent }
    ] },
    options: { interaction: { mode: 'nearest', intersect: false }, scales: { r: { beginAtZero: true, ticks: { display: false }, grid: { color: Z.chartColors().grid }, angleLines: { color: Z.chartColors().grid }, pointLabels: { font: { size: 12 } } } } }
  });

  if (el('bubbleChart')) new Chart(el('bubbleChart'), {
    type: 'bubble',
    data: { datasets: [
      { label: Z.t('حملة أ'), data: [{ x: 20, y: 30, r: 12 }, { x: 40, y: 10, r: 8 }, { x: 55, y: 42, r: 16 }, { x: 70, y: 25, r: 10 }], backgroundColor: Z.alpha(P.primary, 0.6) },
      { label: Z.t('حملة ب'), data: [{ x: 15, y: 18, r: 9 }, { x: 35, y: 38, r: 14 }, { x: 60, y: 15, r: 7 }, { x: 82, y: 40, r: 12 }], backgroundColor: Z.alpha(P.accent, 0.6) }
    ] },
    options: { interaction: { mode: 'nearest', intersect: true }, scales: Z.axes({ x: { type: 'linear', grid: { display: true }, min: 0, max: 100 }, y: { min: 0, max: 50 } }) }
  });

  if (el('mixedChart')) new Chart(el('mixedChart'), {
    data: { labels: Z.months(), datasets: [
      { type: 'line', label: Z.t('متوسط الطلب'), data: [120, 125, 118, 131, 128, 135, 140, 138, 145, 150, 148, 156], borderColor: P.danger, backgroundColor: P.danger, yAxisID: 'y1', pointRadius: 3 },
      { type: 'bar', label: Z.t('عدد الطلبات'), data: [320, 410, 380, 460, 520, 490, 560, 610, 580, 640, 700, 760], backgroundColor: Z.alpha(P.primary, 0.8), maxBarThickness: 24 }
    ] },
    options: { scales: Object.assign(Z.axes(), { y1: { position: Z.mirror() ? 'left' : 'right', grid: { display: false }, border: { display: false } } }) }
  });
})();
