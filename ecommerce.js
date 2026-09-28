/*!
 * Mirsad Admin — pages/ecommerce.js
 * رسوم صفحة التجارة الإلكترونية. eCommerce charts.
 */
(function () {
  'use strict';
  var Z = window.Mirsad, P = Z.palette, cur = Z.t('ر.س');

  var so = document.getElementById('salesOrdersChart');
  if (so) {
    var ax = Z.axes({ y: { ticks: { callback: function (v) { return Z.fmt(v / 1000) + 'K'; } } } });
    ax.y1 = { position: Z.mirror() ? 'left' : 'right', grid: { display: false }, border: { display: false }, beginAtZero: true };
    new Chart(so, {
      data: {
        labels: Z.months(),
        datasets: [
          { type: 'bar', label: Z.t('المبيعات'), data: [182, 196, 210, 188, 240, 262, 251, 288, 301, 276, 334, 362].map(function (v) { return v * 1000; }), backgroundColor: Z.alpha(P.primary, 0.85), borderRadius: 6, maxBarThickness: 22, yAxisID: 'y', order: 2 },
          { type: 'line', label: Z.t('الطلبات'), data: [1320, 1410, 1560, 1380, 1720, 1890, 1810, 2050, 2140, 1990, 2380, 2560], borderColor: P.accent, backgroundColor: P.accent, pointRadius: 3, yAxisID: 'y1', order: 1 }
        ]
      },
      options: {
        plugins: {
          legend: { position: 'top', align: 'end' },
          tooltip: { callbacks: { label: function (c) { return ' ' + c.dataset.label + ': ' + Z.fmt(c.parsed.y) + (c.dataset.yAxisID === 'y' ? ' ' + cur : ''); } } }
        },
        scales: ax
      }
    });
  }

  var cat = document.getElementById('categoryChart');
  if (cat) {
    new Chart(cat, {
      type: 'doughnut',
      data: {
        labels: [Z.t('إلكترونيات'), Z.t('عطور'), Z.t('أزياء'), Z.t('منزل ومكتب'), Z.t('قهوة')],
        datasets: [{ data: [36, 24, 17, 14, 9], backgroundColor: [P.info, '#D946EF', P.warning, P.primary, '#F97316'], borderColor: Z.chartColors().card }]
      },
      options: { cutout: '64%', plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'nearest', callbacks: { label: function (c) { return ' ' + c.label + ': ' + c.parsed + '%'; } } } } }
    });
  }
})();
