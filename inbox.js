/*!
 * Mirsad Admin — pages/inbox.js
 * عرض الرسالة المختارة والبحث في البريد. Mail reading pane & search.
 */
(function () {
  'use strict';
  var list = document.getElementById('mailList');
  if (!list) return;
  function open(item) {
    list.querySelectorAll('.zm-mail-item').forEach(function (x) { x.classList.remove('active'); });
    item.classList.add('active');
    item.classList.remove('unread');
    document.getElementById('mvSubject').textContent = item.querySelector('.zm-mail-subject').textContent;
    document.getElementById('mvFrom').textContent = item.querySelector('.fw-bold').textContent;
    document.getElementById('mvTime').textContent = item.querySelector('.text-nowrap').textContent;
    document.getElementById('mvPreview').textContent = item.querySelector('.fs-7.text-truncate').textContent;
    var av = item.querySelector('.avatar').cloneNode(true);
    av.classList.remove('avatar-sm');
    document.getElementById('mvAvatar').replaceChildren(av);
    if (window.matchMedia('(max-width: 767.98px)').matches) document.getElementById('mailView').scrollIntoView({ behavior: 'smooth' });
  }
  list.addEventListener('click', function (e) { var it = e.target.closest('.zm-mail-item'); if (it) open(it); });
  list.addEventListener('keydown', function (e) {
    var it = e.target.closest('.zm-mail-item');
    if (it && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(it); }
  });
  document.getElementById('mailSearch').addEventListener('input', function (e) {
    var q = e.target.value.trim().toLowerCase();
    list.querySelectorAll('.zm-mail-item').forEach(function (it) {
      it.classList.toggle('d-none', !!q && it.textContent.toLowerCase().indexOf(q) === -1);
    });
  });
})();
