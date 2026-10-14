/* FixIT Student — giỏ hàng, mã QR thanh toán MÔ PHỎNG, lưu đơn trên trình duyệt */
(function () {
  'use strict';
  var app = document.querySelector('[data-cart-app]');
  if (!app || !window.FixCart) return;

  var Cart = window.FixCart, vnd = window.FixVnd;
  var ORDERS_KEY = 'fixit_orders_v1';
  var $ = function (s) { return app.querySelector(s); };

  var views = {
    empty: $('[data-cart-empty]'), filled: $('[data-cart-filled]'),
    pay: $('[data-cart-pay]'), done: $('[data-cart-done]'), summary: $('[data-cart-summary]')
  };
  var pending = null; // đơn đang chờ xác nhận thanh toán
  var COUPONS = { FIXIT10: 0.10, STUDENT15: 0.15 }; // mã demo
  var coupon = null;  // { code, rate }

  function discountOf(total) { return coupon ? Math.round(total * coupon.rate) : 0; }
  function payable() { var t = Cart.total(); return t - discountOf(t); }
  function setFlow(n) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-flow]'), function (li) {
      var k = Number(li.getAttribute('data-flow'));
      li.className = k < n ? 'is-done' : (k === n ? 'is-current' : '');
    });
  }

  function readOrders() {
    try { return JSON.parse(window.FixStore.get(ORDERS_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveOrder(o) {
    var all = readOrders(); all[o.code] = o;
    window.FixStore.set(ORDERS_KEY, JSON.stringify(all));
  }
  function newCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '';
    var buf = new Uint32Array(4);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var i = 0; i < 4; i++) s += chars[buf[i] % chars.length];
    return 'FIX-' + s;
  }

  function show(name) {
    ['empty', 'filled', 'pay', 'done'].forEach(function (k) { views[k].hidden = k !== name; });
    views.summary.hidden = name === 'empty' || name === 'done';
    setFlow(name === 'done' ? 3 : (name === 'pay' || name === 'filled' ? 2 : 1));
  }

  function renderList() {
    var list = $('[data-cart-list]');
    while (list.firstChild) list.removeChild(list.firstChild);
    var items = Cart.read();
    items.forEach(function (it) {
      var li = document.createElement('li'); li.className = 'cart-item';
      var t = document.createElement('span'); t.className = 'cart-item-title'; t.textContent = it.title;
      var end = document.createElement('span'); end.className = 'cart-item-end';
      var p = document.createElement('span'); p.className = 'cart-item-price'; p.textContent = vnd(it.price);
      var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'btn btn--ghost btn--small';
      rm.textContent = 'Xóa';
      rm.setAttribute('aria-label', 'Xóa ' + it.title + ' khỏi giỏ hàng');
      rm.addEventListener('click', function () {
        Cart.remove(it.id);
        window.FixAnnounce && window.FixAnnounce('Đã xóa ' + it.title + ' khỏi giỏ hàng.');
        render();
      });
      end.appendChild(p); end.appendChild(rm);
      li.appendChild(t); li.appendChild(end);
      list.appendChild(li);
    });
    $('[data-sum-count]').textContent = String(items.length);
    var d = discountOf(Cart.total());
    $('[data-discount-row]').hidden = !d;
    var dv = $('[data-sum-discount]'); dv.hidden = !d;
    if (d) dv.textContent = '-' + vnd(d) + ' (' + coupon.code + ')';
    $('[data-sum-total]').textContent = vnd(Cart.total() - d);
  }

  function render() {
    if (!Cart.read().length) { show('empty'); return; }
    renderList();
    show('filled');
  }

  /* Kiểm tra biểu mẫu */
  var form = $('[data-cart-form]');
  function validate() {
    var rules = [
      [form.elements.name, 'o-name-err', function (v) { return v.trim().length >= 2; }, 'Vui lòng nhập họ và tên.'],
      [form.elements.contact, 'o-contact-err', function (v) {
        v = v.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^(\+?84|0)\d{9}$/.test(v.replace(/[\s.\-]/g, ''));
      }, 'Nhập số Zalo (10 số) hoặc email hợp lệ.'],
      [form.elements.slot, 'o-slot-err', function (v) { return !!v; }, 'Vui lòng chọn khung giờ.']
    ];
    var first = null;
    rules.forEach(function (r) {
      var ok = r[2](r[0].value), err = document.getElementById(r[1]);
      r[0].setAttribute('aria-invalid', ok ? 'false' : 'true');
      err.hidden = ok; err.textContent = ok ? '' : r[3];
      if (!ok && !first) first = r[0];
    });
    if (first) first.focus();
    return !first;
  }

  $('[data-apply-coupon]').addEventListener('click', function () {
    var code = form.elements.coupon.value.trim().toUpperCase();
    var msg = $('[data-coupon-msg]');
    if (!code) { coupon = null; msg.textContent = ''; renderList(); return; }
    if (COUPONS[code]) {
      coupon = { code: code, rate: COUPONS[code] };
      msg.textContent = 'Đã áp dụng mã ' + code + ': giảm ' + Math.round(COUPONS[code] * 100) + '% (mã demo).';
    } else {
      coupon = null;
      msg.textContent = 'Mã không hợp lệ. Thử FIXIT10 hoặc STUDENT15.';
    }
    renderList();
  });
  form.elements.pay.addEventListener('change', function () {
    $('[data-submit-label]').textContent = form.elements.pay.value === 'cash' ? 'Xác nhận đặt lịch' : 'Tạo mã QR thanh toán (mô phỏng)';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    var items = Cart.read().slice();
    if (!items.length) return;
    var order = {
      code: newCode(), items: items, total: payable(), discount: discountOf(Cart.total()), coupon: coupon ? coupon.code : null,
      pay: form.elements.pay.value,
      name: form.elements.name.value.trim(), contact: form.elements.contact.value.trim(),
      slot: form.elements.slot.value, note: form.elements.note.value.trim(),
      created: Date.now(), paidAt: null
    };
    pending = order;
    saveOrder(order);

    if (order.pay === 'cash') {
      order.paidAt = Date.now();
      saveOrder(order);
      Cart.clear();
      $('[data-done-code]').textContent = order.code;
      $('[data-track-link]').href = $('[data-track-link]').getAttribute('href').split('?')[0] + '?code=' + encodeURIComponent(order.code);
      show('done');
      var h0 = views.done.querySelector('h2'); h0.setAttribute('tabindex', '-1'); h0.focus();
      pending = null;
      return;
    }

    $('[data-order-code]').textContent = order.code;
    $('[data-order-amount]').textContent = vnd(order.total);
    var img = $('[data-qr-img]');
    try {
      /* Chuỗi minh họa, không phải chuẩn thanh toán ngân hàng */
      var qr = window.qrcode(0, 'M');
      qr.addData('FIXIT-DEMO|' + order.code + '|' + order.total + '|MO PHONG - KHONG THANH TOAN THAT');
      qr.make();
      img.src = qr.createDataURL(6, 4);
      img.alt = 'Mã QR minh họa cho đơn ' + order.code + ', số tiền ' + vnd(order.total) + '. Đây là mã mô phỏng, không dùng để thanh toán thật.';
    } catch (err) {
      img.removeAttribute('src');
      img.alt = 'Không tạo được mã QR minh họa.';
    }
    show('pay');
    $('[data-order-code]').scrollIntoView({ block: 'center' });
    window.FixAnnounce && window.FixAnnounce('Đã tạo mã QR mô phỏng cho đơn ' + order.code + '.');
  });

  $('[data-cancel-pay]').addEventListener('click', function () { pending = null; render(); });

  $('[data-confirm-pay]').addEventListener('click', function () {
    if (!pending) return;
    pending.paidAt = Date.now();
    saveOrder(pending);
    Cart.clear();
    $('[data-done-code]').textContent = pending.code;
    $('[data-track-link]').href = $('[data-track-link]').getAttribute('href').split('?')[0] + '?code=' + encodeURIComponent(pending.code);
    show('done');
    views.done.querySelector('h2').setAttribute('tabindex', '-1');
    views.done.querySelector('h2').focus();
    pending = null;
  });

  document.addEventListener('fixcart:change', function () {
    if (!views.pay.hidden || !views.done.hidden) return;
    render();
  });

  render();
})();
