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
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  window.FixitCart = { add: add, toast: toast, total: total };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.add-to-cart');
    if (!b) return;
    add({ id: b.dataset.id, name: b.dataset.name, price: b.dataset.price });
    toast('✔ Đã thêm "' + b.dataset.name + '" vào giỏ hàng');
  });

  // ---------- Trang giỏ hàng ----------
  function getIconFor(id, name) {
    var s = ((id || '') + ' ' + (name || '')).toLowerCase();
    if (s.indexOf('pack') !== -1 || s.indexOf('combo') !== -1) return '🎒';
    if (s.indexOf('python') !== -1) return '🐍';
    if (s.indexOf('c++') !== -1 || s.indexOf('cpp') !== -1) return '⚡';
    if (s.indexOf('git') !== -1) return '🐙';
    if (s.indexOf('vs code') !== -1 || s.indexOf('vscode') !== -1) return '💻';
    if (s.indexOf('health') !== -1 || s.indexOf('sức khỏe') !== -1 || s.indexOf('laptop') !== -1) return '🛡️';
    if (s.indexOf('backup') !== -1 || s.indexOf('sao lưu') !== -1) return '💾';
    if (s.indexOf('wifi') !== -1 || s.indexOf('mạng') !== -1) return '📡';
    if (s.indexOf('office') !== -1 || s.indexOf('win') !== -1) return '💿';
    return '🛠️';
  }

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

    // Update journey indicator if present
    var stepPills = document.querySelectorAll('.booking-journey-steps .journey-step-pill');
    if (stepPills.length >= 3) {
      stepPills[0].className = 'journey-step-pill step-completed';
      stepPills[1].className = 'journey-step-pill step-active';
      stepPills[2].className = 'journey-step-pill';
    }

    if (!cart.length) {
      root.className = 'cart-root-container';
      root.innerHTML =
        '<div class="empty-cart-card">' +
          '<div class="empty-cart-icon">🛒</div>' +
          '<h3>Giỏ hàng của bạn đang trống</h3>' +
          '<p class="muted">Chưa có dịch vụ nào trong giỏ. Hãy chọn dịch vụ bạn cần hoặc thêm nhanh các dịch vụ phổ biến nhất bên dưới:</p>' +
          '<div class="quick-add-grid">' +
            '<div class="quick-add-item">' +
              '<div class="qa-info">' +
                '<strong>🎒 Student Pack Combo (6 món)</strong>' +
                '<span class="qa-price">149.000đ</span>' +
              '</div>' +
              '<button type="button" class="btn-quick-add" data-id="pack-student" data-name="Student Pack Toàn Diện" data-price="149000">+ Thêm</button>' +
            '</div>' +
            '<div class="quick-add-item">' +
              '<div class="qa-info">' +
                '<strong>🐍 Cài Python & VS Code</strong>' +
                '<span class="qa-price">29.000đ</span>' +
              '</div>' +
              '<button type="button" class="btn-quick-add" data-id="fix-python" data-name="Cài đặt môi trường Python & VS Code" data-price="29000">+ Thêm</button>' +
            '</div>' +
            '<div class="quick-add-item">' +
              '<div class="qa-info">' +
                '<strong>🐙 Cứu hộ Git / GitHub</strong>' +
                '<span class="qa-price">39.000đ</span>' +
              '</div>' +
              '<button type="button" class="btn-quick-add" data-id="fix-git" data-name="Cứu hộ xung đột Git & kết nối GitHub" data-price="39000">+ Thêm</button>' +
            '</div>' +
            '<div class="quick-add-item">' +
              '<div class="qa-info">' +
                '<strong>🛡️ Khám sức khỏe Laptop</strong>' +
                '<span class="qa-price">35.000đ</span>' +
              '</div>' +
              '<button type="button" class="btn-quick-add" data-id="fix-health" data-name="Khám sức khỏe Laptop & Tối ưu nhiệt độ" data-price="35000">+ Thêm</button>' +
            '</div>' +
          '</div>' +
          '<div class="empty-cart-actions">' +
            '<a class="btn-glow-pill" href="' + base + 'services/"><span>📋 Xem tất cả dịch vụ</span></a>' +
            '<a class="btn-glass-pill" href="' + base + 'find-your-fix/">🔍 Chẩn đoán sự cố</a>' +
          '</div>' +
        '</div>';

      root.querySelectorAll('.btn-quick-add').forEach(function(btn) {
        btn.addEventListener('click', function() {
          add({ id: btn.dataset.id, name: btn.dataset.name, price: Number(btn.dataset.price) });
          toast('✔ Đã thêm "' + btn.dataset.name + '" vào giỏ!');
          renderCart();
        });
      });
      return;
    }

    root.className = 'cart-root-container';
    var code = read(CKEY, '');
    var disc = applyCoupon(code) || 0;
    var sum = total(cart, 0), final = total(cart, disc);

    var rows = cart.map(function (x) {
      var icon = getIconFor(x.id, x.name);
      return '<div class="cart-item-row" data-id="' + esc(x.id) + '">' +
        '<div class="cart-item-icon-box">' + icon + '</div>' +
        '<div class="cart-item-info">' +
          '<h4 class="cart-item-title">' + esc(x.name) + '</h4>' +
          '<div class="cart-item-meta">' +
            '<span class="cart-item-price-unit">' + fmt(x.price) + ' / lần</span>' +
            '<span class="cart-badge-mode">Sảnh trường & Online</span>' +
          '</div>' +
        '</div>' +
        '<div class="cart-qty-wrap">' +
          '<button type="button" class="qty-btn" data-act="dec" aria-label="Giảm số lượng">−</button>' +
          '<span class="qty-num">' + x.qty + '</span>' +
          '<button type="button" class="qty-btn" data-act="inc" aria-label="Tăng số lượng">+</button>' +
        '</div>' +
        '<div class="cart-line-total">' + fmt(x.price * x.qty) + '</div>' +
        '<button type="button" class="cart-del-btn" data-act="del" title="Xoá dịch vụ khỏi giỏ" aria-label="Xoá dịch vụ">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' +
        '</button>' +
      '</div>';
    }).join('');

    root.innerHTML =
      '<div class="cart-layout-grid">' +
        '<div class="cart-items-column">' +
          '<div class="cart-section-card">' +
            '<div class="cart-card-head">' +
              '<div>' +
                '<h3>Dịch vụ đã chọn (' + cart.length + ')</h3>' +
                '<span class="muted small">Kiểm tra danh sách và số lượng trước khi đặt lịch</span>' +
              '</div>' +
              '<a href="' + base + 'services/" class="add-more-link">+ Thêm dịch vụ khác</a>' +
            '</div>' +
            '<div class="cart-items-list">' + rows + '</div>' +
          '</div>' +

          '<div class="cart-guarantee-card">' +
            '<span class="guar-icon">🛡️</span>' +
            '<div>' +
              '<strong>Cam kết sinh viên · Bảo hành 7 ngày:</strong>' +
              '<p class="muted small">Kiểm tra máy chạy thử code ổn định tại sảnh mới gửi phí. Nếu lỗi cũ tái phát trong 7 ngày, FixIT hỗ trợ sửa lại hoàn toàn miễn phí hoặc hoàn tiền 100%.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<aside class="cart-checkout-column">' +
          '<div class="cart-summary-card">' +
            '<h3 class="summary-title">Tóm tắt thanh toán</h3>' +

            '<div class="coupon-box">' +
              '<div class="coupon-input-wrap">' +
                '<input id="coupon" placeholder="Nhập mã ưu đãi (VD: FIXIT10)" value="' + esc(code) + '" aria-label="Mã giảm giá">' +
                '<button class="btn-coupon" id="coupon-btn" type="button">Áp dụng</button>' +
              '</div>' +
              '<div class="coupon-suggestions">' +
                '<span class="sugg-label">Gợi ý mã:</span>' +
                '<button type="button" class="sugg-chip" data-code="FIXIT10">FIXIT10 (-10%)</button>' +
                '<button type="button" class="sugg-chip" data-code="SINHVIEN">SINHVIEN (-15%)</button>' +
              '</div>' +
              '<p id="coupon-msg" class="coupon-msg" aria-live="polite">' +
                (code ? (disc ? '✔ Đã áp dụng giảm ' + Math.round(disc * 100) + '% cho đơn hàng!' : '✖ Mã không tồn tại hoặc đã hết hạn') : '') +
              '</p>' +
            '</div>' +

            '<div class="calc-lines">' +
              '<div class="calc-line"><span>Tạm tính</span><strong>' + fmt(sum) + '</strong></div>' +
              (disc ? '<div class="calc-line discount"><span>Ưu đãi sinh viên (' + Math.round(disc * 100) + '%)</span><strong>−' + fmt(sum - final) + '</strong></div>' : '') +
              '<div class="calc-line total-line"><span>Tổng cộng</span><strong class="total-val">' + fmt(final) + '</strong></div>' +
            '</div>' +

            '<form id="checkout" class="checkout-form">' +
              '<div class="form-title-row">' +
                '<div>' +
                  '<h4>Thông tin hẹn gặp</h4>' +
                  '<span class="small muted">Hỗ trợ trực tiếp hoặc Online</span>' +
                '</div>' +
                '<button type="button" id="btn-demo-fill" class="btn-demo-fill" title="Tự động điền thông tin thử nghiệm nhanh">⚡ Điền mẫu</button>' +
              '</div>' +

              '<div class="form-group">' +
                '<label for="chk-name">Tên bạn <span class="req">*</span></label>' +
                '<input id="chk-name" name="name" required placeholder="VD: Nguyễn Hoàng Nam">' +
              '</div>' +

              '<div class="form-group">' +
                '<label for="chk-phone">Số điện thoại / Zalo <span class="muted small">(để KTV liên hệ hẹn điểm)</span></label>' +
                '<input id="chk-phone" name="phone" placeholder="VD: 0901 234 567">' +
              '</div>' +

              '<div class="form-group">' +
                '<label for="chk-place">Địa điểm hẹn gặp <span class="req">*</span></label>' +
                '<select id="chk-place" name="place" class="cyber-select">' +
                  '<option value="Sảnh trường ĐH KHTN (CS1 Nguyễn Văn Cừ, Q5)">Sảnh trường ĐH KHTN (CS1 Nguyễn Văn Cừ, Q5)</option>' +
                  '<option value="Sảnh trường ĐH KHTN (CS2 Linh Trung Thủ Đức)">Sảnh trường ĐH KHTN (CS2 Linh Trung Thủ Đức)</option>' +
                  '<option value="Hỗ trợ từ xa Online (UltraViewer / Google Meet)">Hỗ trợ từ xa Online (UltraViewer / Google Meet)</option>' +
                '</select>' +
              '</div>' +

              '<div class="form-group">' +
                '<label for="chk-slot">Khung giờ bạn rảnh <span class="req">*</span></label>' +
                '<select id="chk-slot" name="slot" class="cyber-select">' +
                  '<option value="Hôm nay 17:30 – 19:30">Hôm nay 17:30 – 19:30 (Sau giờ tan học)</option>' +
                  '<option value="Hôm nay 19:30 – 21:00">Hôm nay 19:30 – 21:00</option>' +
                  '<option value="Trưa mai 11:30 – 13:00">Trưa mai 11:30 – 13:00</option>' +
                  '<option value="Chiều mai 17:00 – 19:30">Chiều mai 17:00 – 19:30</option>' +
                  '<option value="Cuối tuần (Hẹn trước qua Zalo)">Cuối tuần (Hẹn trước qua Zalo)</option>' +
                '</select>' +
              '</div>' +

              '<div class="form-group">' +
                '<label for="chk-note">Ghi chú tình trạng máy / mã lỗi <span class="muted small">(nếu có)</span></label>' +
                '<input id="chk-note" name="note" placeholder="VD: VS Code không nhận GCC, máy chạy nóng quạt kêu to">' +
              '</div>' +

              '<div class="form-group">' +
                '<label class="label-heading">Phương thức thanh toán (giả lập)</label>' +
                '<div class="payment-cards-grid">' +
                  '<label class="pay-card-label">' +
                    '<input type="radio" name="pay" value="Tiền mặt khi gặp tại sảnh" checked>' +
                    '<div class="pay-card-content">' +
                      '<span class="pay-icon">💵</span>' +
                      '<div class="pay-info">' +
                        '<strong>Tiền mặt tại sảnh trường</strong>' +
                        '<span class="small muted">Kiểm tra máy chạy thử ưng ý mới gửi phí</span>' +
                      '</div>' +
                      '<span class="pay-radio-indicator"></span>' +
                    '</div>' +
                  '</label>' +
                  '<label class="pay-card-label">' +
                    '<input type="radio" name="pay" value="Chuyển khoản VietQR (Mô phỏng)">' +
                    '<div class="pay-card-content">' +
                      '<span class="pay-icon">🏦</span>' +
                      '<div class="pay-info">' +
                        '<strong>Chuyển khoản VietQR (Mô phỏng)</strong>' +
                        '<span class="small muted">Quét mã QR ngân hàng giả lập</span>' +
                      '</div>' +
                      '<span class="pay-radio-indicator"></span>' +
                    '</div>' +
                  '</label>' +
                  '<label class="pay-card-label">' +
                    '<input type="radio" name="pay" value="Ví MoMo (Mô phỏng)">' +
                    '<div class="pay-card-content">' +
                      '<span class="pay-icon">📱</span>' +
                      '<div class="pay-info">' +
                        '<strong>Ví MoMo (Mô phỏng)</strong>' +
                        '<span class="small muted">Thanh toán ví điện tử sinh viên</span>' +
                      '</div>' +
                      '<span class="pay-radio-indicator"></span>' +
                    '</div>' +
                  '</label>' +
                '</div>' +

                '<!-- Cash Info Box -->' +
                '<div id="pay-cash-box" class="pay-method-preview-card">' +
                  '<p class="small muted mb-0">🛡️ <b>An tâm sinh viên:</b> Kỹ thuật viên FixIT sẽ kiểm tra máy trực tiếp, hướng dẫn bạn chạy thử code thành công tại sảnh rồi mới nhận phí.</p>' +
                '</div>' +

                '<!-- VietQR Simulation Box -->' +
                '<div id="pay-vietqr-box" class="fake-qr-card" hidden>' +
                  '<div class="qr-mock-box">' +
                    '<div class="qr-bank-title">VIETQR SIMULATION · VIETCOMBANK KHTN</div>' +
                    '<div class="qr-code-art">▦▧▨▥▩<br>▣ FIXIT ▣<br>▦▧▨▥▩</div>' +
                    '<div class="qr-account-info">STK: 9999 8888 666 · Tên: FIXIT STUDENT CS1</div>' +
                    '<div class="qr-amount-info">Số tiền: <strong class="text-accent">' + fmt(final) + '</strong></div>' +
                  '</div>' +
                  '<p class="small muted">Mã QR giả lập phục vụ báo cáo đồ án — Không thanh toán tiền thật.</p>' +
                '</div>' +

                '<!-- MoMo Simulation Box -->' +
                '<div id="pay-momo-box" class="fake-qr-card fake-momo-card" hidden>' +
                  '<div class="qr-mock-box">' +
                    '<div class="qr-bank-title momo-title">VÍ ĐIỆN TỬ MOMO DEMO</div>' +
                    '<div class="qr-code-art momo-qr-art">▦▧▨▥▩<br>▣ MOMO ▣<br>▦▧▨▥▩</div>' +
                    '<div class="qr-account-info">SĐT Ví: 0901 234 567 · FIXIT SUPPORT</div>' +
                    '<div class="qr-amount-info">Số tiền: <strong class="text-accent">' + fmt(final) + '</strong></div>' +
                  '</div>' +
                  '<p class="small muted">Mô phỏng ví điện tử sinh viên — Không phát sinh giao dịch thực tế.</p>' +
                '</div>' +
              '</div>' +

              '<button class="btn-glow-pill w-full mt-sm" type="submit">' +
                '<span>Xác nhận đặt lịch hẹn (Demo) →</span>' +
              '</button>' +
            '</form>' +
          '</div>' +
        '</aside>' +
      '</div>';

    // Event listeners
    root.querySelectorAll('.cart-item-row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        var act = e.target.closest('[data-act]'); if (!act) return;
        var c = getCart(), it = c.find(function (x) { return x.id === row.dataset.id; });
        if (!it) return;
        if (act.dataset.act === 'inc') it.qty++;
        if (act.dataset.act === 'dec') {
          if (it.qty > 1) {
            it.qty--;
          } else {
            c = c.filter(function (x) { return x.id !== it.id; });
          }
        }
        if (act.dataset.act === 'del') c = c.filter(function (x) { return x.id !== it.id; });
        saveCart(c); renderCart();
      });
    });

    document.getElementById('coupon-btn').addEventListener('click', function () {
      write(CKEY, document.getElementById('coupon').value.trim()); renderCart();
    });

    root.querySelectorAll('.sugg-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        write(CKEY, chip.dataset.code);
        renderCart();
      });
    });

    // Auto-fill demo button
    var demoFillBtn = document.getElementById('btn-demo-fill');
    if (demoFillBtn) {
      demoFillBtn.addEventListener('click', function () {
        var nameInput = document.getElementById('chk-name');
        var phoneInput = document.getElementById('chk-phone');
        var noteInput = document.getElementById('chk-note');
        if (nameInput) nameInput.value = 'Nguyễn Hoàng Nam';
        if (phoneInput) phoneInput.value = '0901 234 567';
        if (noteInput) noteInput.value = 'VS Code bị lỗi compiler GCC và cần kiểm tra quạt tản nhiệt.';
        toast('✔ Đã tự động điền dữ liệu mẫu demo!');
      });
    }

    // Payment radio switch
    root.querySelectorAll('input[name=pay]').forEach(function (r) {
      r.addEventListener('change', function () {
        var v = r.value;
        var cashBox = document.getElementById('pay-cash-box');
        var qrBox = document.getElementById('pay-vietqr-box');
        var momoBox = document.getElementById('pay-momo-box');
        if (cashBox) cashBox.hidden = v.indexOf('Tiền mặt') === -1;
        if (qrBox) qrBox.hidden = v.indexOf('VietQR') === -1;
        if (momoBox) momoBox.hidden = v.indexOf('MoMo') === -1;
      });
    });

    document.getElementById('checkout').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(e.target);
      var nameVal = (f.get('name') || '').trim();
      if (!nameVal) {
        toast('⚠️ Vui lòng nhập tên của bạn');
        document.getElementById('chk-name').focus();
        return;
      }

      var order = {
        code: orderCode(),
        createdAt: Date.now(),
        items: cart,
        subtotal: sum,
        discount: sum - final,
        couponCode: code || null,
        total: final,
        name: nameVal,
        phone: (f.get('phone') || '').trim(),
        place: f.get('place'),
        slot: f.get('slot'),
        pay: f.get('pay'),
        note: (f.get('note') || '').trim()
      };
      var orders = read(OKEY, []);
      orders.push(order);
      write(OKEY, orders);
      saveCart([]);
      write(CKEY, '');
      success(order);
    });
  }

  function success(o) {
    var root = document.getElementById('cart-root');
    var base = (window.FIXIT && FIXIT.base) || '/';

    // Update journey indicator to step 3 completed
    var stepPills = document.querySelectorAll('.booking-journey-steps .journey-step-pill');
    if (stepPills.length >= 3) {
      stepPills[0].className = 'journey-step-pill step-completed';
      stepPills[1].className = 'journey-step-pill step-completed';
      stepPills[2].className = 'journey-step-pill step-active';
    }

    root.className = 'cart-root-container';
    root.innerHTML =
      '<div class="order-success-card">' +
        '<div class="success-glow-icon">🎉</div>' +
        '<div class="page-badge"><span class="badge-pulse"></span> GIAO DỊCH GIẢ LẬP THÀNH CÔNG</div>' +
        '<h2 class="success-title">Đặt lịch hẹn hỗ trợ thành công!</h2>' +
        '<p class="muted">Hệ thống FixIT đã ghi nhận yêu cầu và xếp lịch kỹ thuật viên. Bạn có thể lưu lại vé hẹn bên dưới để tiện đối chiếu.</p>' +

        '<div class="order-ticket-card">' +
          '<div class="ticket-header">' +
            '<div>' +
              '<span class="ticket-label">MÃ ĐƠN HÀNG CỦA BẠN</span>' +
              '<div class="ticket-code-row">' +
                '<span class="order-code-glow" id="order-code-text">' + o.code + '</span>' +
                '<button type="button" class="btn-copy-code" id="btn-copy-code" title="Sao chép mã đơn">📋 Sao chép</button>' +
              '</div>' +
            '</div>' +
            '<span class="ticket-status-badge">✅ ĐÃ XÁC NHẬN</span>' +
          '</div>' +

          '<div class="ticket-items-summary">' +
            '<div class="ticket-sec-title">Dịch vụ đã đăng ký:</div>' +
            o.items.map(function(it) {
              return '<div class="ticket-item-row">' +
                '<span>' + getIconFor(it.id, it.name) + ' ' + esc(it.name) + ' <b class="item-qty-tag">x' + it.qty + '</b></span>' +
                '<strong>' + fmt(it.price * it.qty) + '</strong>' +
              '</div>';
            }).join('') +
          '</div>' +

          '<div class="ticket-divider"></div>' +

          '<div class="ticket-body">' +
            '<div class="ticket-row"><span>👤 Khách hàng:</span><strong>' + esc(o.name) + (o.phone ? ' · ' + esc(o.phone) : '') + '</strong></div>' +
            '<div class="ticket-row"><span>📍 Địa điểm hẹn:</span><strong>' + esc(o.place) + '</strong></div>' +
            '<div class="ticket-row"><span>🕒 Khung giờ:</span><strong>' + esc(o.slot) + '</strong></div>' +
            '<div class="ticket-row"><span>💳 Phương thức:</span><strong>' + esc(o.pay) + '</strong></div>' +
            (o.note ? '<div class="ticket-row"><span>📝 Ghi chú:</span><em>' + esc(o.note) + '</em></div>' : '') +
            '<div class="ticket-row total-highlight"><span>💰 Tổng chi phí:</span><strong class="ticket-total-val">' + fmt(o.total) + '</strong></div>' +
          '</div>' +

          '<div class="ticket-roadmap">' +
            '<div class="roadmap-head">Quy trình hỗ trợ tiếp theo:</div>' +
            '<div class="roadmap-steps">' +
              '<div class="r-step"><span class="r-num">1</span> Kỹ thuật viên chuẩn bị công cụ & bộ cài</div>' +
              '<div class="r-step"><span class="r-num">2</span> Gặp trực tiếp tại sảnh trường theo giờ hẹn</div>' +
              '<div class="r-step"><span class="r-num">3</span> Kiểm tra máy chạy tốt mới gửi phí (Bảo hành 7 ngày)</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="success-actions">' +
          '<a class="btn-glow-pill" href="' + base + 'track/?code=' + o.code + '"><span>🔎 Theo dõi tiến độ đơn hàng này</span></a>' +
          '<a class="btn-glass-pill" href="' + base + 'services/">Tiếp tục xem dịch vụ</a>' +
        '</div>' +
        '<p class="small muted mt-sm">💡 Đây là đồ án mô phỏng hoạt động dịch vụ công nghệ, không phát sinh chi phí thực tế.</p>' +
      '</div>';

    var copyBtn = document.getElementById('btn-copy-code');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(o.code).then(function() {
            toast('✔ Đã sao chép mã đơn "' + o.code + '" vào bộ nhớ tạm!');
            copyBtn.textContent = '✔ Đã chép';
            setTimeout(function() { copyBtn.textContent = '📋 Sao chép'; }, 2000);
          });
        } else {
          toast('Mã đơn của bạn: ' + o.code);
        }
      });
    }
  }

  // ---------- Theo dõi đơn ----------
  var STAGES = [
    { title: 'Tiếp nhận đơn', desc: 'Đã nhận yêu cầu và xếp lịch kỹ thuật viên FixIT' },
    { title: 'Đang hỗ trợ / Sửa lỗi', desc: 'Kỹ thuật viên đang trực tiếp kiểm tra và khắc phục' },
    { title: 'Hoàn tất & Bàn giao', desc: 'Đã kiểm thử hoạt động bình thường, kích hoạt bảo hành 7 ngày' }
  ];

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
      code = (code || '').trim().toUpperCase();
      if (!code) return;
      var o = (code === 'FIX-DEMO') ?
        { code: 'FIX-DEMO', demo: true, place: 'Sảnh ĐH KHTN (CS1)', slot: 'Hôm nay 17:30', pay: 'Tiền mặt khi gặp', items: [{ name: 'Cài đặt môi trường Python & VS Code', qty: 1 }], total: 29000 }
        : read(OKEY, []).find(function (x) { return x.code === code; });

      if (!o) {
        out.innerHTML =
          '<div class="track-not-found-card">' +
            '<span class="warn-icon">🔍</span>' +
            '<h4>Không tìm thấy đơn hàng "' + esc(code) + '"</h4>' +
            '<p class="muted small">Vui lòng kiểm tra lại mã đơn hoặc đặt thử một dịch vụ demo từ giỏ hàng. Bạn cũng có thể bấm nút thử mã mẫu <b>FIX-DEMO</b> bên dưới.</p>' +
          '</div>';
        return;
      }

      var st = stageFor(o);
      var itemsText = o.items ? o.items.map(function(i) { return i.name + ' (x' + i.qty + ')'; }).join(', ') : 'Gói hỗ trợ sinh viên';

      out.innerHTML =
        '<div class="track-status-card">' +
          '<div class="track-card-header">' +
            '<div>' +
              '<span class="track-tag">TIẾN ĐỘ ĐƠN HÀNG</span>' +
              '<h3 class="track-order-code">' + esc(o.code) + '</h3>' +
            '</div>' +
            '<div class="track-badge-pill">' +
              (st === 0 ? '⏳ Chờ đến giờ hẹn' : st === 1 ? '⚡ Đang thực hiện' : '✅ Đã hoàn tất') +
            '</div>' +
          '</div>' +

          '<div class="track-pipeline-steps">' +
            STAGES.map(function (s, i) {
              var isDone = i < st;
              var isCurrent = i === st;
              var cls = isDone ? 'step-done' : isCurrent ? 'step-active' : 'step-pending';
              return '<div class="track-step-node ' + cls + '">' +
                '<div class="node-indicator">' +
                  '<span class="node-dot">' + (isDone ? '✓' : (i + 1)) + '</span>' +
                '</div>' +
                '<div class="node-info">' +
                  '<strong class="node-title">' + s.title + '</strong>' +
                  '<p class="node-desc muted">' + s.desc + '</p>' +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +

          '<div class="track-details-box">' +
            '<div class="detail-line"><span>Dịch vụ:</span><strong>' + esc(itemsText) + '</strong></div>' +
            (o.place ? '<div class="detail-line"><span>Địa điểm hẹn:</span><strong>' + esc(o.place) + '</strong></div>' : '') +
            (o.slot ? '<div class="detail-line"><span>Khung giờ:</span><strong>' + esc(o.slot) + '</strong></div>' : '') +
          '</div>' +

          '<div class="track-sim-note">' +
            '💡 <i>Ghi chú demo: Trạng thái đơn tự động chuyển sau 30 giây để mô phỏng quy trình xử lý thực tế trong đồ án.</i>' +
          '</div>' +
        '</div>';

      if (st < 2 && !o.demo) {
        setTimeout(function () { lookup(code); }, 5000);
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      lookup(document.getElementById('track-code').value);
    });

    // Check URL query param ?code=FIX-XXXX
    try {
      var params = new URLSearchParams(window.location.search);
      var qCode = params.get('code');
      if (qCode) {
        var input = document.getElementById('track-code');
        if (input) input.value = qCode;
        lookup(qCode);
      }
    } catch (e) {}

    // Quick demo code button
    var quickBtn = document.getElementById('btn-try-demo');
    if (quickBtn) {
      quickBtn.addEventListener('click', function () {
        var input = document.getElementById('track-code');
        if (input) input.value = 'FIX-DEMO';
        lookup('FIX-DEMO');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateBadge();
    renderCart();
    renderTrack();
  });
})();
