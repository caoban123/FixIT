// Giỏ hàng demo: lưu bằng localStorage, không có backend, không thanh toán thật.
(function () {
  var KEY = 'fixit_cart', OKEY = 'fixit_orders', CKEY = 'fixit_coupon';
  var COUPONS = { FIXIT10: 0.10, SINHVIEN: 0.15 };

  function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function fmt(n) { return Number(n).toLocaleString('vi-VN') + 'đ'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var getCart = function () { return read(KEY, []); };
  function saveCart(c) { write(KEY, c); updateBadge(); }

  function add(item) {
    var cart = getCart();
    var f = cart.find(function (x) { return x.id === item.id; });
    if (f) f.qty++; else cart.push({ id: item.id, name: item.name, price: Number(item.price), qty: 1 });
    saveCart(cart);
  }
  function total(cart, discount) {
    var sum = cart.reduce(function (s, x) { return s + x.price * x.qty; }, 0);
    return Math.round(sum * (1 - (discount || 0)));
  }
  function applyCoupon(code) {
    var v = COUPONS[(code || '').trim().toUpperCase()];
    return v === undefined ? null : v;
  }
  function updateBadge() {
    var n = getCart().reduce(function (s, x) { return s + x.qty; }, 0);
    var el = document.getElementById('cart-badge');
    if (el) { el.textContent = n; el.hidden = n === 0; }
  }
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }
  window.FixitCart = { add: add, toast: toast, total: total };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.add-to-cart');
    if (!b) return;
    add({ id: b.dataset.id, name: b.dataset.name, price: b.dataset.price });
    toast('Đã thêm "' + b.dataset.name + '" vào giỏ');
  });

  // ---------- Trang giỏ hàng ----------
  function orderCode() {
    var chars = '0123456789';
    var s = 'FIX-';
    for (var i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  function renderCart() {
    var root = document.getElementById('cart-root');
    if (!root) return;
    var cart = getCart();
    var base = (window.FIXIT && FIXIT.base) || '/';
    if (!cart.length) {
      root.className = '';
      root.innerHTML = '<div class="card pad empty-cart"><p class="big">🛒</p><p>Giỏ hàng đang trống.</p>' +
        '<a class="btn" href="' + base + 'find-your-fix/">Tìm dịch vụ phù hợp</a> ' +
        '<a class="btn btn-ghost" href="' + base + 'services/">Xem dịch vụ</a></div>';
      return;
    }
    root.className = 'cart-grid';
    var code = read(CKEY, '');
    var disc = applyCoupon(code) || 0;
    var sum = total(cart, 0), final = total(cart, disc);

    var rows = cart.map(function (x) {
      return '<div class="card pad cart-row" data-id="' + esc(x.id) + '"><div class="grow"><b>' + esc(x.name) + '</b><div class="muted">' + fmt(x.price) + '</div></div>' +
        '<div class="qty"><button type="button" data-act="dec" aria-label="Giảm">−</button><span>' + x.qty + '</span><button type="button" data-act="inc" aria-label="Tăng">+</button></div>' +
        '<div class="line-total">' + fmt(x.price * x.qty) + '</div>' +
        '<button type="button" class="icon-btn" data-act="del" aria-label="Xoá">🗑</button></div>';
    }).join('');

    root.innerHTML =
      '<div class="cart-list">' + rows + '</div>' +
      '<aside class="card pad summary">' +
        '<h2>Thanh toán</h2>' +
        '<div class="coupon"><input id="coupon" placeholder="Mã giảm giá" value="' + esc(code) + '" aria-label="Mã giảm giá"><button class="btn btn-ghost" id="coupon-btn" type="button">Áp dụng</button></div>' +
        '<p id="coupon-msg" class="small" aria-live="polite">' + (code ? (disc ? '✔ Đã áp dụng ' + Math.round(disc * 100) + '%' : '✖ Mã không hợp lệ') : 'Thử FIXIT10 hoặc SINHVIEN') + '</p>' +
        '<div class="sum-line"><span>Tạm tính</span><span>' + fmt(sum) + '</span></div>' +
        (disc ? '<div class="sum-line"><span>Giảm giá</span><span>−' + fmt(sum - final) + '</span></div>' : '') +
        '<div class="sum-line total"><span>Tổng cộng</span><span>' + fmt(final) + '</span></div>' +
        '<form id="checkout" class="form">' +
          '<div class="demo-banner small">DEMO ONLY: có thể nhập tên giả, không nhập thông tin thật.</div>' +
          '<label>Tên<input name="name" required placeholder="Bạn A (tên giả)"></label>' +
          '<label>Địa điểm hẹn<select name="place"><option>Sảnh trường</option><option>Hỗ trợ từ xa (video call)</option></select></label>' +
          '<label>Khung giờ<select name="slot"><option>Hôm nay 17:00 – 19:00</option><option>Ngày mai 08:00 – 10:00</option><option>Ngày mai 17:00 – 19:00</option></select></label>' +
          '<fieldset class="pay"><legend>Thanh toán (giả lập)</legend>' +
            '<label class="check"><input type="radio" name="pay" value="Tiền mặt khi gặp" checked> 💵 Tiền mặt khi gặp</label>' +
            '<label class="check"><input type="radio" name="pay" value="Chuyển khoản (QR demo)"> 🏦 Chuyển khoản (QR demo)</label>' +
            '<label class="check"><input type="radio" name="pay" value="MoMo (demo)"> 📱 MoMo (demo)</label>' +
            '<div id="pay-qr" class="fake-qr" hidden><div>QR DEMO</div><small>Không quét được, chỉ minh hoạ</small></div>' +
          '</fieldset>' +
          '<button class="btn btn-lg" type="submit">Đặt hàng (demo)</button>' +
        '</form>' +
      '</aside>';

    root.querySelectorAll('.cart-row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        var act = e.target.closest('[data-act]'); if (!act) return;
        var c = getCart(), it = c.find(function (x) { return x.id === row.dataset.id; });
        if (!it) return;
        if (act.dataset.act === 'inc') it.qty++;
        if (act.dataset.act === 'dec') it.qty = Math.max(1, it.qty - 1);
        if (act.dataset.act === 'del') c = c.filter(function (x) { return x.id !== it.id; });
        saveCart(c); renderCart();
      });
    });
    document.getElementById('coupon-btn').addEventListener('click', function () {
      write(CKEY, document.getElementById('coupon').value.trim()); renderCart();
    });
    root.querySelectorAll('input[name=pay]').forEach(function (r) {
      r.addEventListener('change', function () {
        document.getElementById('pay-qr').hidden = r.value.indexOf('Chuyển khoản') !== 0 || !r.checked;
      });
    });
    document.getElementById('checkout').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(e.target);
      var order = { code: orderCode(), createdAt: Date.now(), items: cart, total: final,
        pay: f.get('pay'), place: f.get('place'), slot: f.get('slot') };
      var orders = read(OKEY, []); orders.push(order); write(OKEY, orders);
      saveCart([]); write(CKEY, '');
      success(order);
    });
  }

  function success(o) {
    var root = document.getElementById('cart-root');
    var base = (window.FIXIT && FIXIT.base) || '/';
    root.className = '';
    root.innerHTML = '<div class="card pad success"><p class="big">🎉</p><h2>Đặt hàng thành công (demo)</h2>' +
      '<p>Mã đơn của bạn</p><p class="order-code">' + o.code + '</p>' +
      '<p class="muted">' + esc(o.place) + ' · ' + esc(o.slot) + ' · ' + esc(o.pay) + ' · ' + fmt(o.total) + '</p>' +
      '<p class="muted small">Đây chỉ là bản demo, không có giao dịch thật.</p>' +
      '<a class="btn" href="' + base + 'track/">Theo dõi đơn</a> <a class="btn btn-ghost" href="' + base + 'services/">Tiếp tục xem dịch vụ</a></div>';
  }

  // ---------- Theo dõi đơn ----------
  var STAGES = ['Đã nhận', 'Đang fix', 'Hoàn tất'];
  function stageFor(order) {
    if (order.demo) return 1;
    var s = (Date.now() - order.createdAt) / 1000;
    return s < 30 ? 0 : s < 90 ? 1 : 2;
  }
  function renderTrack() {
    var form = document.getElementById('track-form');
    if (!form) return;
    var out = document.getElementById('track-result');
    function lookup(code) {
      code = code.trim().toUpperCase();
      var o = code === 'FIX-DEMO' ? { code: 'FIX-DEMO', demo: true, items: [{ name: 'Python Environment Setup', qty: 1 }] }
        : read(OKEY, []).find(function (x) { return x.code === code; });
      if (!o) { out.innerHTML = '<p class="card pad">Không tìm thấy đơn <b>' + esc(code) + '</b>. Hãy đặt thử một đơn demo trước nhé.</p>'; return; }
      var st = stageFor(o);
      out.innerHTML = '<div class="card pad"><h2>' + esc(o.code) + '</h2><ol class="timeline">' +
        STAGES.map(function (s, i) { return '<li class="' + (i < st ? 'done' : i === st ? 'now' : '') + '"><span></span>' + s + '</li>'; }).join('') +
        '</ol><p class="muted small">Mô phỏng: trạng thái tự chuyển theo thời gian, không phải đơn thật.</p></div>';
      if (st < 2 && !o.demo) setTimeout(function () { lookup(code); }, 5000);
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); lookup(document.getElementById('track-code').value); });
  }

  document.addEventListener('DOMContentLoaded', function () { updateBadge(); renderCart(); renderTrack(); });
})();
