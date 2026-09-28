/*!
 * Mirsad Admin — pages/chat.js
 * واجهة محادثات تفاعلية تجريبية. Demo chat UI (switch contacts, send, auto-reply).
 */
(function () {
  'use strict';
  var Z = window.Mirsad;
  var box = document.getElementById('chatMsgs');
  if (!box) return;
  var CONVOS = [
    [['them', 'صباح الخير سارة، أنهيت النسخة الأولى من تصاميم لوحة التحكم.', '10:02'], ['me', 'صباح النور! رائع، هل تشمل الوضع الداكن؟', '10:05'], ['them', 'نعم، مع دعم كامل للاتجاهين العربي والإنجليزي.', '10:07'], ['me', 'ممتاز، أرسليها لي لمراجعتها قبل اجتماع الظهر.', '10:31'], ['them', 'تمام، سأرسل التصاميم خلال ساعة', '10:40']],
    [['them', 'مرحبًا، هل تم اعتماد الميزانية؟', '10:12']],
    [['them', 'أغلقنا صفقة جديدة مع متاجر لؤلؤة الخليج', '9:30'], ['me', 'أحسنتم يا فريق!', '9:34']],
    [['me', 'أرسلت لك ملف العقد المحدث.', 'أمس'], ['them', 'شكرًا لك!', 'أمس']],
    [['me', 'هل اطلعتِ على تقرير المبيعات؟', 'أمس'], ['them', 'سأراجع التقرير وأعود إليك', 'أمس']],
    [['them', 'تذكير: الاجتماع بعد الظهر', 'الأحد']]
  ];
  var REPLIES = ['تمام، شكرًا لك!', 'سأتابع الأمر وأعود إليك قريبًا.', 'فكرة ممتازة!', 'وصلت، جارٍ العمل عليها.'];
  var current = 0;
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function bubble(m) {
    return '<div class="zm-msg' + (m[0] === 'me' ? ' me' : '') + '"><div class="zm-bubble"><div>' + esc(m[1]) + '</div><time>' + esc(Z.t(m[2])) + '</time></div></div>';
  }
  function render() {
    box.innerHTML = '<div class="zm-day-sep"><span>' + Z.t('اليوم') + '</span></div>' + CONVOS[current].map(bubble).join('');
    box.scrollTop = box.scrollHeight;
  }
  var list = document.getElementById('contactList');
  function select(c) {
    list.querySelectorAll('.zm-chat-contact').forEach(function (x) { x.classList.remove('active'); });
    c.classList.add('active');
    current = +c.getAttribute('data-i');
    var badge = c.querySelector('.badge'); if (badge) badge.remove();
    document.getElementById('chatName').textContent = c.querySelector('.fw-bold').textContent;
    document.getElementById('chatAvatar').replaceChildren(c.querySelector('.avatar').cloneNode(true));
    var online = !c.querySelector('.avatar').classList.contains('off');
    var st = document.getElementById('chatStatus');
    st.textContent = Z.t(online ? 'متصل الآن' : 'آخر ظهور منذ ساعات');
    st.className = 'fs-7 ' + (online ? 'text-success' : 'text-muted');
    render();
  }
  list.addEventListener('click', function (e) { var c = e.target.closest('.zm-chat-contact'); if (c) select(c); });
  list.addEventListener('keydown', function (e) { var c = e.target.closest('.zm-chat-contact'); if (c && e.key === 'Enter') select(c); });
  document.getElementById('chatSearch').addEventListener('input', function (e) {
    var q = e.target.value.trim();
    list.querySelectorAll('.zm-chat-contact').forEach(function (c) { c.classList.toggle('d-none', !!q && c.textContent.indexOf(q) === -1); });
  });
  document.getElementById('chatForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('chatInput'), text = input.value.trim();
    if (!text) return;
    var now = new Date(), time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    var convo = CONVOS[current];
    convo.push(['me', text, time]);
    input.value = '';
    render();
    setTimeout(function () { convo.push(['them', Z.t(REPLIES[Math.floor(Math.random() * REPLIES.length)]), time]); if (CONVOS[current] === convo) render(); }, 1200);
  });
  render();
})();
