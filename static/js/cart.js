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
  var catalog = JSON.parse(document.getElementById('cart-catalog').textContent);

  function discountOf(total) { return coupon ? Math.round(total * coupon.rate) : 0; }
  function payable() { var t = Cart.total(); return t - discountOf(t); }
  function setFlow(n) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-flow]'), function (li) {
      var k = Number(li.getAttribute('data-flow'));
      li.className = k < n ? 'is-done' : (k === n ? 'is-current' : '');
      if (k === n) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
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
    app.setAttribute('data-cart-view', name);
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
      var art = document.createElement('span'); art.className = 'cart-item-thumbnail'; art.setAttribute('aria-hidden', 'true');
      var template = document.getElementById('cart-art-' + it.id);
      if (template) {
        var artwork = template.content.cloneNode(true);
        // Empty-cart suggestions stay in the DOM; give cloned SVG filters their own IDs.
        artwork.querySelectorAll('[id]').forEach(function (node) {
          var previous = node.getAttribute('id');
          var next = 'cart-line-' + previous;
          node.setAttribute('id', next);
          artwork.querySelectorAll('[fill], [filter]').forEach(function (shape) {
            ['fill', 'filter'].forEach(function (attribute) {
              var value = shape.getAttribute(attribute);
              if (value) shape.setAttribute(attribute, value.replace('url(#' + previous + ')', 'url(#' + next + ')'));
            });
          });
        });
        art.appendChild(artwork);
      }
      else art.textContent = 'Fi';
      var details = document.createElement('span'); details.className = 'cart-item-details';
      var t = document.createElement('span'); t.className = 'cart-item-title'; t.textContent = it.title;
      var meta = document.createElement('span'); meta.className = 'cart-item-description';
      meta.textContent = catalog[it.id] ? catalog[it.id].duration + ' · ' + catalog[it.id].labelVi : '6 dịch vụ · Xem điều kiện tại trang Student Pack';
      details.appendChild(t); details.appendChild(meta);
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
      li.appendChild(art); li.appendChild(details); li.appendChild(end);
      list.appendChild(li);
    });
    $('[data-sum-count]').textContent = String(items.length);
    $('[data-sum-subtotal]').textContent = vnd(Cart.total());
    var d = discountOf(Cart.total());
    $('[data-discount-row]').hidden = !d;
    var dv = $('[data-sum-discount]'); dv.hidden = !d;
    if (d) dv.textContent = '-' + vnd(d) + ' (' + coupon.code + ')';
    $('[data-sum-total]').textContent = vnd(Cart.total() - d);
    $('[data-inline-total]').textContent = vnd(Cart.total() - d);
    app.querySelectorAll('[data-coupon-pick]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(!!coupon && coupon.code === button.getAttribute('data-coupon-pick')));
    });
  }

  function render() {
    if (!Cart.read().length) { show('empty'); return; }
    renderList();
    show('filled');
  }

  /* Kiểm tra biểu mẫu */
  var form = $('[data-cart-form]');
  function localToday() {
    var now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  }
  function appointmentDay(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    var parts = value.split('-').map(Number);
    var date = new Date(parts[0], parts[1] - 1, parts[2]);
    if (date.getFullYear() !== parts[0] || date.getMonth() !== parts[1] - 1 || date.getDate() !== parts[2]) return null;
    return date;
  }
  function validAppointmentDate(value) {
    var date = appointmentDay(value);
    return !!date && value >= localToday() && date.getDay() !== 0;
  }
  function syncSlots() {
    var date = appointmentDay(form.elements.date.value);
    var valid = validAppointmentDate(form.elements.date.value);
    var dayGroup = date && date.getDay() === 6 ? 'saturday' : 'weekday';
    var select = form.elements.slot;
    Array.from(select.options).forEach(function (option, index) {
      if (!index) { option.textContent = valid ? 'Chọn khung giờ' : 'Chọn ngày trước khi chọn giờ'; return; }
      option.disabled = !valid || option.getAttribute('data-days') !== dayGroup;
      option.hidden = option.disabled;
    });
    if (select.selectedOptions[0].disabled) select.value = '';
    select.disabled = !valid;
  }
  form.elements.date.min = localToday();
  form.elements.date.addEventListener('change', syncSlots);
  syncSlots();
  var rules = [
      [form.elements.name, 'o-name-err', function (v) { return v.trim().length >= 2; }, 'Vui lòng nhập họ và tên.'],
      [form.elements.contact, 'o-contact-err', function (v) {
        v = v.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^(\+?84|0)\d{9}$/.test(v.replace(/[\s.\-]/g, ''));
      }, 'Nhập số Zalo (10 số) hoặc email hợp lệ.'],
      [form.elements.date, 'o-date-err', validAppointmentDate, 'Chọn ngày từ hôm nay trở đi, từ Thứ 2 đến Thứ 7.'],
      [form.elements.place, 'o-place-err', function (v) { return ['cs1', 'cs2', 'online'].indexOf(v) !== -1; }, 'Vui lòng chọn địa điểm.'],
      [form.elements.slot, 'o-slot-err', function (v) { return validAppointmentDate(form.elements.date.value) && !!v && !form.elements.slot.selectedOptions[0].disabled; }, 'Vui lòng chọn khung giờ phù hợp với ngày hẹn.']
  ];
  function validateField(rule) {
    var ok = rule[2](rule[0].value), error = document.getElementById(rule[1]);
    rule[0].setAttribute('aria-invalid', ok ? 'false' : 'true');
    error.hidden = ok; error.textContent = ok ? '' : rule[3];
    return ok;
  }
  rules.forEach(function (rule) {
    ['input', 'change'].forEach(function (eventName) {
      rule[0].addEventListener(eventName, function () {
        if (rule[0].getAttribute('aria-invalid') === 'true') validateField(rule);
      });
    });
  });
  function validate() {
    var first = null;
    rules.forEach(function (r) {
      var ok = validateField(r);
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
      msg.setAttribute('data-state', 'success');
      msg.textContent = 'Đã áp dụng mã ' + code + ': giảm ' + Math.round(COUPONS[code] * 100) + '% (mã demo).';
    } else {
      coupon = null;
      msg.setAttribute('data-state', 'error');
      msg.textContent = 'Mã không hợp lệ. Thử FIXIT10 hoặc STUDENT15.';
    }
    renderList();
  });
  app.querySelectorAll('[data-coupon-pick]').forEach(function (button) {
    button.addEventListener('click', function () {
      form.elements.coupon.value = button.getAttribute('data-coupon-pick');
      $('[data-apply-coupon]').click();
    });
  });

  function finish(order) {
    Cart.clear();
    $('[data-done-code]').textContent = order.code;
    $('[data-done-name]').textContent = order.name;
    $('[data-done-date]').textContent = order.date.split('-').reverse().join('/');
    $('[data-done-place]').textContent = order.place;
    $('[data-done-slot]').textContent = order.slot;
    $('[data-done-count]').textContent = String(order.items.length);
    $('[data-done-total]').textContent = vnd(order.total);
    $('[data-track-link]').href = $('[data-track-link]').getAttribute('href').split('?')[0] + '?code=' + encodeURIComponent(order.code);
    show('done');
    var heading = views.done.querySelector('h2');
    heading.setAttribute('tabindex', '-1'); heading.focus();
    pending = null;
    document.dispatchEvent(new CustomEvent('fixit:booking-complete'));
  }

  $('[data-copy-order]').addEventListener('click', function () {
    var button = this;
    var code = $('[data-done-code]').textContent;
    if (!navigator.clipboard) {
      window.FixAnnounce('Mã vé hẹn của bạn là ' + code + '.');
      return;
    }
    navigator.clipboard.writeText(code).then(function () {
      button.textContent = 'Đã sao chép ✓';
      window.FixAnnounce('Đã sao chép mã vé hẹn.');
    }).catch(function () {
      window.FixAnnounce('Mã vé hẹn của bạn là ' + code + '. Bạn có thể chọn mã trên vé để sao chép.');
    });
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
      date: form.elements.date.value, place: form.elements.place.selectedOptions[0].textContent, placeId: form.elements.place.value,
      slot: form.elements.slot.value, note: form.elements.note.value.trim(),
      created: Date.now(), paidAt: null
    };
    pending = order;
    saveOrder(order);

    if (order.pay === 'cash') {
      order.paidAt = Date.now();
      saveOrder(order);
      finish(order);
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
    finish(pending);
  });

  document.addEventListener('fixcart:change', function () {
    if (!views.pay.hidden || !views.done.hidden) return;
    render();
  });

  render();
})();
