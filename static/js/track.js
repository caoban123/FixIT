/* FixIT Student — tra cứu đơn MÔ PHỎNG (trạng thái suy ra từ thời gian đã trôi qua) */
(function () {
  'use strict';
  var form = document.querySelector('[data-track-form]');
  if (!form) return;

  var ORDERS_KEY = 'fixit_orders_v1';
  var STEPS = [
    'Đã nhận đơn',
    'Đã xác nhận lịch hẹn',
    'Đang xử lý',
    'Sẵn sàng nhận máy'
  ];
  var STAGE_AT_MIN = [0, 1, 3, 6]; // số phút sau khi thanh toán (mô phỏng)

  var input = document.getElementById('t-code');
  var err = document.getElementById('t-err');
  var result = document.querySelector('[data-track-result]');

  function orders() {
    try { return JSON.parse(window.FixStore.get(ORDERS_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function vnd(n) { return window.FixVnd ? window.FixVnd(n) : n + 'đ'; }

  function setError(msg) {
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    err.hidden = !msg; err.textContent = msg || '';
  }

  function lookup(raw) {
    var code = String(raw || '').trim().toUpperCase();
    result.hidden = true;
    if (!/^FIX-[A-Z0-9]{4}$/.test(code)) { setError('Mã đơn có dạng FIX-XXXX, ví dụ FIX-DEMO.'); input.focus(); return; }
    var o = orders()[code];
    if (!o && code === 'FIX-DEMO') {
      o = { code: 'FIX-DEMO', items: [{ title: 'Python Environment Setup', price: 29000 }, { title: 'VS Code Setup', price: 9000 }],
            total: 38000, slot: 'Thứ 2 – Thứ 6, 17:00 – 19:00', paidAt: Date.now() - 4 * 60000 };
    }
    if (!o) {
      setError('Không tìm thấy đơn này trên trình duyệt hiện tại. Dữ liệu đơn chỉ lưu trên thiết bị đã tạo đơn.');
      input.focus(); return;
    }
    setError('');

    document.querySelector('[data-t-code]').textContent = o.code;
    var list = document.querySelector('[data-t-items]');
    while (list.firstChild) list.removeChild(list.firstChild);
    o.items.forEach(function (it) {
      var li = document.createElement('li'); li.className = 'cart-item';
      var t = document.createElement('span'); t.className = 'cart-item-title'; t.textContent = it.title;
      var p = document.createElement('span'); p.className = 'cart-item-price'; p.textContent = vnd(it.price);
      li.appendChild(t); li.appendChild(p); list.appendChild(li);
    });
    document.querySelector('[data-t-meta]').textContent =
      'Khung giờ mong muốn: ' + o.slot + ' · Tổng: ' + vnd(o.total) +
      (o.paidAt ? '' : ' · Chưa xác nhận thanh toán (mô phỏng)');

    var stage = -1;
    if (o.paidAt) {
      var mins = (Date.now() - o.paidAt) / 60000;
      STAGE_AT_MIN.forEach(function (m, i) { if (mins >= m) stage = i; });
    }
    var ol = document.querySelector('[data-t-steps]');
    while (ol.firstChild) ol.removeChild(ol.firstChild);
    STEPS.forEach(function (label, i) {
      var li = document.createElement('li');
      li.textContent = label;
      if (i < stage || (i === stage && stage === STEPS.length - 1)) li.className = 'is-done';
      else if (i === stage) { li.className = 'is-current'; li.setAttribute('aria-current', 'step'); }
      ol.appendChild(li);
    });
    result.hidden = false;
    window.FixAnnounce && window.FixAnnounce('Đã tìm thấy đơn ' + o.code + '.');
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); lookup(input.value); });

  var q = new URLSearchParams(window.location.search).get('code');
  if (q) { input.value = q; lookup(q); }
})();
