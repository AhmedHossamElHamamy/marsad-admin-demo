/*!
 * مرصاد | Mirsad Admin — product-add.js
 * معاينة الصور المختارة، حساب الهامش ونسبة الخصم، ومعاينة نتيجة البحث لحظيًا.
 * Image previews, live margin/discount maths and live search-result preview.
 */
(function () {
  'use strict';
  var input = document.getElementById('paImages'), box = document.getElementById('paPreview');
  var zone = document.querySelector('.zm-dropzone');
  function show(files) {
    Array.prototype.slice.call(files).forEach(function (f) {
      if (!/^image\//.test(f.type)) return;
      var r = new FileReader();
      r.onload = function (e) {
        var w = document.createElement('div'); w.className = 'zm-thumb';
        w.innerHTML = '<img alt=""><button type="button" class="btn btn-sm btn-light btn-icon" aria-label="' + Mirsad.t('حذف') + '"><i class="bi bi-x-lg"></i></button>';
        w.querySelector('img').src = e.target.result;
        w.querySelector('button').addEventListener('click', function () { w.remove(); });
        box.appendChild(w);
      };
      r.readAsDataURL(f);
    });
  }
  if (input) input.addEventListener('change', function () { show(input.files); });
  if (zone) {
    ['dragenter', 'dragover'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('is-over'); }); });
    zone.addEventListener('drop', function (e) { if (e.dataTransfer) show(e.dataTransfer.files); });
  }
  var price = document.getElementById('paPrice'), cmp = document.getElementById('paCompare'), cost = document.getElementById('paCost');
  function calc() {
    var p = parseFloat(price.value), c = parseFloat(cost.value), o = parseFloat(cmp.value);
    document.getElementById('paMargin').textContent = p > 0 && c >= 0 && cost.value !== '' ? Math.round((p - c) / p * 100) + '%' : '—';
    document.getElementById('paOff').textContent = p > 0 && o > p ? Math.round((o - p) / o * 100) + '%' : '—';
  }
  [price, cmp, cost].forEach(function (el) { el.addEventListener('input', calc); });
  var t = document.querySelector('[data-zm-seo-title]'), d = document.querySelector('[data-zm-seo-desc]');
  var st = document.getElementById('seoTitle'), sd = document.getElementById('seoDesc');
  var dt = st.textContent, dd = sd.textContent;
  t.addEventListener('input', function () { st.textContent = t.value || dt; });
  d.addEventListener('input', function () { sd.textContent = d.value ? d.value.slice(0, 155) : dd; });
})();
