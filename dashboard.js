/*!
 * Mirsad Admin — pages/dashboard.js
 * رسوم لوحة التحليلات (index.html). Charts for the analytics dashboard.
 */
(function () {
  'use strict';
  var Z = window.Mirsad, P = Z.palette;
  var cur = Z.t('ر.س');
  var money = function (v) { return Z.fmt(v) + ' ' + cur; };

  /* 1) الإيرادات — revenue line chart with period switch */
  var months = Z.months();
  var thisYear = [28400, 31200, 29800, 36500, 34100, 41800, 39600, 45200, 43900, 50100, 47600, 56300];
  var lastYear = [24100, 25800, 27300, 26900, 30200, 31800, 33500, 32900, 36100, 37800, 39400, 42300];
  var revEl = document.getElementById('revenueChart');
  if (revEl) {
    var rev = new Chart(revEl, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          { label: Z.t('هذا العام'), data: thisYear, borderColor: P.primary, backgroundColor: Z.gradient(P.primary, 0.28, 0), fill: true, pointBackgroundColor: P.primary },
          { label: Z.t('العام الماضي'), data: lastYear, borderColor: P.accent, borderDash: [6, 6], borderWidth: 2, fill: false, pointBackgroundColor: P.accent }
        ]
      },
      options: {
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return ' ' + c.dataset.label + ': ' + money(c.parsed.y); } } } },
        scales: Z.axes({ y: { ticks: { padding: 8, callback: function (v) { return Z.fmt(v / 1000) + 'K'; } } } })
      }
    });
    document.querySelectorAll('#revRange [data-range]').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('#revRange .btn').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        var n = +b.getAttribute('data-range');
        rev.data.labels = months.slice(-n);
        rev.data.datasets[0].data = thisYear.slice(-n);
        rev.data.datasets[1].data = lastYear.slice(-n);
        rev.update();
      });
    });
  }

  /* 2) مصادر الزيارات — traffic sources doughnut */
  var srcEl = document.getElementById('sourcesChart');
  if (srcEl) {
    new Chart(srcEl, {
      type: 'doughnut',
      data: {
        labels: [Z.t('بحث عضوي'), Z.t('وسائل التواصل'), Z.t('زيارات مباشرة'), Z.t('حملات إعلانية')],
        datasets: [{ data: [42, 26, 18, 14], backgroundColor: [P.primary, P.accent, P.warning, P.info], borderColor: Z.chartColors().card, hoverOffset: 6 }]
      },
      options: { cutout: '72%', plugins: { legend: { display: false }, tooltip: { mode: 'nearest', callbacks: { label: function (c) { return ' ' + c.label + ': ' + c.parsed + '%'; } } } } }
    });
  }

  /* 3) هدف المبيعات — goal ring */
  var goalEl = document.getElementById('goalChart');
  if (goalEl) {
    new Chart(goalEl, {
      type: 'doughnut',
      data: { datasets: [{ data: [78, 22], backgroundColor: [P.primary, Z.alpha(P.slate, 0.18)], borderWidth: 0, borderRadius: 20 }] },
      options: { cutout: '80%', responsive: false, events: [], plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    });
  }

  /* 4) الزيارات الأسبوعية — weekly bars (highlight best day) */
  var wkEl = document.getElementById('weeklyChart');
  if (wkEl) {
    var visits = [5200, 6100, 7400, 6900, 8800, 6300, 7600];
    var max = Math.max.apply(null, visits);
    new Chart(wkEl, {
      type: 'bar',
      data: { labels: Z.days(), datasets: [{ label: Z.t('الزيارات'), data: visits, backgroundColor: visits.map(function (v) { return v === max ? P.primary : Z.alpha(P.primary, 0.22); }), borderRadius: 8, maxBarThickness: 26 }] },
      options: {
        plugins: { legend: { display: false } },
        scales: Z.axes({ y: { display: false }, x: { ticks: { font: { size: 11 } } } })
      }
    });
  }
})();
