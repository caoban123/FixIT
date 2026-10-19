/* FixIT Student — giỏ hàng dùng chung, hiệu ứng, điều hướng, biểu mẫu nhỏ */
(function () {
  'use strict';

  /* ---------- Lưu trữ an toàn (có thể bị chặn ở chế độ riêng tư) ---------- */
  function safeGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* bỏ qua */ } }
  window.FixStore = { get: safeGet, set: safeSet };

  function announce(msg) {
    var el = document.querySelector('[data-live]');
    if (!el) return;
    el.textContent = '';
    window.setTimeout(function () { el.textContent = msg; }, 30);
  }
  window.FixAnnounce = announce;

  function vnd(n) {
    var s = String(Math.round(n));
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  }
  window.FixVnd = vnd;

  /* ---------- Giỏ hàng ---------- */
  var KEY = 'fixit_cart_v1';
  var mem = null;
  var Cart = {
    read: function () {
      if (mem) return mem;
      try { mem = JSON.parse(safeGet(KEY) || '[]'); } catch (e) { mem = []; }
      if (!Array.isArray(mem)) mem = [];
      return mem;
    },
    write: function (items) {
      mem = items;
      safeSet(KEY, JSON.stringify(items));
      Cart.updateCount();
      document.dispatchEvent(new CustomEvent('fixcart:change'));
    },
    add: function (item) {
      var items = Cart.read().slice();
      for (var i = 0; i < items.length; i++) { if (items[i].id === item.id) return false; }
      items.push({ id: item.id, title: item.title, price: Number(item.price) || 0 });
      Cart.write(items);
      document.dispatchEvent(new CustomEvent('fixcart:added', { detail: { id: item.id, title: item.title } }));
      return true;
    },
    remove: function (id) {
      Cart.write(Cart.read().filter(function (x) { return x.id !== id; }));
    },
    clear: function () { Cart.write([]); },
    total: function () {
      return Cart.read().reduce(function (s, x) { return s + (Number(x.price) || 0); }, 0);
    },
    has: function (id) {
      return Cart.read().some(function (x) { return x.id === id; });
    },
    updateCount: function () {
      var n = Cart.read().length;
      var els = document.querySelectorAll('[data-cart-count]');
      for (var i = 0; i < els.length; i++) els[i].textContent = String(n);
    }
  };
  window.FixCart = Cart;

  /* ---------- Khởi tạo sau khi DOM sẵn sàng ---------- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    Cart.updateCount();

    /* Menu di động */
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
      var setNav = function (open) {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? 'Đóng' : 'Menu';
      };
      toggle.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
      });
    }

    /* Thêm vào giỏ */
    var addBtns = document.querySelectorAll('[data-add-to-cart]');
    function syncAddBtn(btn) {
      var inCart = Cart.has(btn.getAttribute('data-id'));
      if (!btn.hasAttribute('data-label')) btn.setAttribute('data-label', btn.textContent);
      btn.textContent = inCart ? 'Đã có trong giỏ' : btn.getAttribute('data-label');
      btn.setAttribute('aria-disabled', inCart ? 'true' : 'false');
    }
    Array.prototype.forEach.call(addBtns, function (btn) {
      syncAddBtn(btn);
      btn.addEventListener('click', function () {
        if (btn.getAttribute('aria-disabled') === 'true') {
          announce('Mục này đã có trong giỏ hàng.');
          return;
        }
        Cart.add({
          id: btn.getAttribute('data-id'),
          title: btn.getAttribute('data-title'),
          price: btn.getAttribute('data-price')
        });
        syncAddBtn(btn);
        announce('Đã thêm ' + btn.getAttribute('data-title') + ' vào giỏ hàng.');
      });
    });
    document.addEventListener('fixcart:change', function () {
      Array.prototype.forEach.call(addBtns, syncAddBtn);
    });

    /* Hiệu ứng hiện khi cuộn */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
    }

    /* Video nền: tạm dừng / phát (mỗi khối hero có nút riêng) */
    Array.prototype.forEach.call(document.querySelectorAll('[data-hero-video]'), function (video) {
      var sec = video.closest('section');
      var vbtn = sec && sec.querySelector('[data-hero-toggle]');
      if (reduce) { try { video.pause(); } catch (e) { /* bỏ qua */ } }
      if (!vbtn) return;
      vbtn.addEventListener('click', function () {
        var paused = vbtn.getAttribute('aria-pressed') === 'true';
        if (paused) { if (video.play) video.play().catch(function () {}); vbtn.setAttribute('aria-pressed', 'false'); vbtn.textContent = 'Tạm dừng video'; }
        else { video.pause(); vbtn.setAttribute('aria-pressed', 'true'); vbtn.textContent = 'Phát video'; }
      });
    });

    /* Số đếm tăng dần khi cuộn tới (giữ nguyên số nếu giảm chuyển động) */
    var counters = document.querySelectorAll('[data-count]');
    if (!reduce && 'IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          cio.unobserve(en.target);
          var el = en.target, to = Number(el.getAttribute('data-count')), fmt = el.getAttribute('data-format');
          if (!isFinite(to)) return;
          var t0 = null, dur = 1000;
          var step = function (t) {
            if (t0 === null) t0 = t;
            var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
            var v = Math.round(to * e);
            el.textContent = fmt === 'vnd' ? vnd(v) : String(v);
            if (p < 1) window.requestAnimationFrame(step);
          };
          window.requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });
      Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
    }

    /* ---------- Thông báo "Đã thêm vào giỏ hàng" ---------- */
    var toastHost = null, toastTimer = null;
    function hideToast(el) {
      if (!el || el.classList.contains('is-out')) return;
      el.classList.add('is-out');
      window.setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 420);
    }
    function showToast(detail) {
      if (!toastHost) {
        toastHost = document.createElement('div');
        toastHost.className = 'toast-host';
        document.body.appendChild(toastHost);
      }
      while (toastHost.firstChild) toastHost.removeChild(toastHost.firstChild);
      window.clearTimeout(toastTimer);

      var cartLink = document.querySelector('[data-cart-count]');
      cartLink = cartLink && cartLink.closest('a');
      var items = Cart.read();
      var el = document.createElement('div');
      el.className = 'toast'; el.setAttribute('role', 'status');

      var head = document.createElement('p'); head.className = 'toast-head'; head.textContent = 'Đã thêm vào giỏ hàng';
      var name = document.createElement('p'); name.className = 'toast-name'; name.textContent = detail.title;
      var meta = document.createElement('p'); meta.className = 'toast-meta';
      meta.textContent = 'Giỏ hàng có ' + items.length + ' mục, tổng ' + vnd(Cart.total());
      var actions = document.createElement('div'); actions.className = 'toast-actions';
      var view = document.createElement('a'); view.className = 'btn btn--on-dark btn--small'; view.textContent = 'Xem giỏ hàng';
      view.href = cartLink ? cartLink.getAttribute('href') : '#';
      var undo = document.createElement('button'); undo.type = 'button'; undo.className = 'btn btn--outline-dark btn--small'; undo.textContent = 'Hoàn tác';
      undo.addEventListener('click', function () { Cart.remove(detail.id); hideToast(el); announce('Đã bỏ ' + detail.title + ' khỏi giỏ hàng.'); });
      var close = document.createElement('button'); close.type = 'button'; close.className = 'toast-close'; close.textContent = 'Đóng';
      close.addEventListener('click', function () { hideToast(el); });
      actions.appendChild(view); actions.appendChild(undo);
      var bar = document.createElement('span'); bar.className = 'toast-bar'; bar.setAttribute('aria-hidden', 'true');
      el.appendChild(head); el.appendChild(name); el.appendChild(meta); el.appendChild(actions); el.appendChild(close); el.appendChild(bar);
      toastHost.appendChild(el);

      var start = function () { toastTimer = window.setTimeout(function () { hideToast(el); }, 4500); bar.style.animationPlayState = 'running'; };
      el.addEventListener('mouseenter', function () { window.clearTimeout(toastTimer); bar.style.animationPlayState = 'paused'; });
      el.addEventListener('mouseleave', start);
      start();

      /* nhịp nảy ở số trên nút Giỏ hàng */
      Array.prototype.forEach.call(document.querySelectorAll('[data-cart-count]'), function (c) {
        c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
      });
    }
    document.addEventListener('fixcart:added', function (e) { showToast(e.detail); });

    /* ---------- Giao diện Sáng / Tối ---------- */
    var themeBtns = document.querySelectorAll('[data-theme-set]');
    function currentTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
    function syncThemeBtns() {
      var cur = currentTheme();
      Array.prototype.forEach.call(themeBtns, function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-theme-set') === cur ? 'true' : 'false');
      });
    }
    Array.prototype.forEach.call(themeBtns, function (b) {
      b.addEventListener('click', function () {
        var next = b.getAttribute('data-theme-set');
        if (next === currentTheme()) return;
        var root = document.documentElement;
        if (!reduce) { root.classList.add('theme-fade'); window.setTimeout(function () { root.classList.remove('theme-fade'); }, 450); }
        root.setAttribute('data-theme', next);
        safeSet('fixit_theme', next);
        syncThemeBtns();
        announce(next === 'dark' ? 'Đã chuyển sang giao diện tối.' : 'Đã chuyển sang giao diện sáng.');
      });
    });
    syncThemeBtns();

    /* ---------- Tiêu đề tách từ ---------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-split]'), function (h) {
      if (reduce) return;
      var words = h.textContent.trim().split(/\s+/);
      h.setAttribute('aria-label', words.join(' '));
      h.textContent = '';
      words.forEach(function (w, i) {
        var outer = document.createElement('span'); outer.className = 'w'; outer.setAttribute('aria-hidden', 'true');
        var inner = document.createElement('span'); inner.textContent = w; inner.style.setProperty('--i', String(i));
        outer.appendChild(inner); h.appendChild(outer);
        if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
      });
    });

    /* ---------- Parallax nhẹ ---------- */
    if (!reduce) {
      var ticking = false;
      var onScroll = function () {
        if (ticking) return; ticking = true;
        window.requestAnimationFrame(function () {
          var y = Math.min(window.pageYOffset * 0.18, 60);
          document.documentElement.style.setProperty('--py', String(y));
          document.documentElement.style.setProperty('--by', String(Math.min(window.pageYOffset * 0.08, 140)));
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- Thanh chỉ vị trí trượt ở menu ---------- */
    var navList = document.querySelector('[data-nav-list]');
    if (navList && !reduce) {
      var ind = document.createElement('span'); ind.className = 'nav-ind'; ind.setAttribute('aria-hidden', 'true');
      navList.insertBefore(ind, navList.firstChild);
      var moveTo = function (a) {
        if (!a || window.innerWidth <= 768) { ind.style.opacity = '0'; return; }
        var li = a.parentNode;
        ind.style.opacity = '1';
        ind.style.width = li.offsetWidth + 'px';
        ind.style.transform = 'translateX(' + li.offsetLeft + 'px)';
      };
      var links = navList.querySelectorAll('.nav-link');
      Array.prototype.forEach.call(links, function (a) {
        a.addEventListener('mouseenter', function () { moveTo(a); });
        a.addEventListener('focus', function () { moveTo(a); });
      });
      navList.addEventListener('mouseleave', function () { ind.style.opacity = '0'; });
    }

    /* ---------- Chuyển trang mượt (dự phòng khi trình duyệt chưa hỗ trợ View Transitions) ---------- */
    var hasVT = window.CSS && CSS.supports && CSS.supports('view-transition-name', 'x') && 'CSSViewTransitionRule' in window;
    if (!hasVT && !reduce) {
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (a.target && a.target !== '_self') return;
        var url;
        try { url = new URL(a.href, window.location.href); } catch (err) { return; }
        if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
        if (a.hasAttribute('download') || a.getAttribute('href').charAt(0) === '#') return;
        e.preventDefault();
        var page = document.querySelector('.page');
        if (page) page.classList.add('is-leaving');
        window.setTimeout(function () { window.location.href = a.href; }, 180);
      });
      window.addEventListener('pageshow', function (ev) {
        if (ev.persisted) { var pg = document.querySelector('.page'); if (pg) pg.classList.remove('is-leaving'); }
      });
    }

    /* ---------- Lọc dịch vụ ---------- */
    var fwrap = document.querySelector('[data-svc-filters]');
    if (fwrap) {
      var grid = document.querySelector('[data-svc-grid]');
      var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-service]'));
      var chips = fwrap.querySelectorAll('[data-chip]');
      var selPrice = fwrap.querySelector('[data-f-price]');
      var selSort = fwrap.querySelector('[data-f-sort]');
      var shown = fwrap.querySelector('[data-f-shown]');
      var none = document.querySelector('[data-f-empty]');
      var group = 'all';
      var apply = function () {
        var pr = selPrice.value, n = 0;
        cards.forEach(function (c) {
          var price = Number(c.getAttribute('data-price'));
          var okG = group === 'all' || c.getAttribute('data-group') === group;
          var okP = pr === 'all' || (pr === 'low' && price < 30000) || (pr === 'mid' && price >= 30000 && price < 60000) || (pr === 'high' && price >= 60000);
          var ok = okG && okP;
          c.hidden = !ok;
          if (ok) { n++; c.classList.add('is-visible'); }
        });
        var sorted = cards.slice().sort(function (a, b) {
          if (selSort.value === 'asc') return Number(a.getAttribute('data-price')) - Number(b.getAttribute('data-price'));
          if (selSort.value === 'desc') return Number(b.getAttribute('data-price')) - Number(a.getAttribute('data-price'));
          return Number(a.getAttribute('data-weight')) - Number(b.getAttribute('data-weight'));
        });
        sorted.forEach(function (c) { grid.appendChild(c); });
        shown.textContent = String(n);
        none.hidden = n > 0;
      };
      Array.prototype.forEach.call(chips, function (ch) {
        ch.addEventListener('click', function () {
          group = ch.getAttribute('data-chip');
          Array.prototype.forEach.call(chips, function (o) {
            var on = o === ch; o.classList.toggle('is-active', on); o.setAttribute('aria-pressed', on ? 'true' : 'false');
          });
          apply();
        });
      });
      selPrice.addEventListener('change', apply);
      selSort.addEventListener('change', apply);
    }

    /* Lọc FAQ */
    var filter = document.querySelector('[data-faq-filter]');
    if (filter) {
      var norm = function (s) {
        return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
      };
      var items = document.querySelectorAll('[data-faq-item]');
      var groups = document.querySelectorAll('[data-faq-group]');
      var empty = document.querySelector('[data-faq-empty]');
      filter.addEventListener('input', function () {
        var q = norm(filter.value).trim();
        var shown = 0;
        Array.prototype.forEach.call(items, function (it) {
          var ok = !q || norm(it.textContent).indexOf(q) !== -1;
          it.hidden = !ok;
          if (ok) shown++;
        });
        Array.prototype.forEach.call(groups, function (g) {
          g.hidden = !g.querySelector('[data-faq-item]:not([hidden])');
        });
        if (empty) empty.hidden = shown > 0;
      });
    }

    /* Biểu mẫu liên hệ (demo): chỉ hiện mã yêu cầu mẫu, không gửi dữ liệu đi đâu */
    var cform = document.querySelector('[data-request-form]');
    if (cform) {
      cform.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        [[cform.elements.name, 'c-name-err', 'Vui lòng nhập họ tên hoặc biệt danh.'],
         [cform.elements.contact, 'c-contact-err', 'Vui lòng nhập Zalo hoặc số điện thoại.'],
         [cform.elements.message, 'c-msg-err', 'Vui lòng mô tả ngắn triệu chứng.']].forEach(function (r) {
          var err = document.getElementById(r[1]);
          var bad = !r[0].value.trim();
          r[0].setAttribute('aria-invalid', bad ? 'true' : 'false');
          err.hidden = !bad; err.textContent = bad ? r[2] : '';
          if (bad && ok) { r[0].focus(); ok = false; }
        });
        if (!ok) return;
        var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '', buf = new Uint32Array(4);
        window.crypto.getRandomValues(buf);
        for (var i = 0; i < 4; i++) s += chars[buf[i] % chars.length];
        var done = document.querySelector('[data-request-done]');
        document.querySelector('[data-request-code]').textContent = 'REQ-' + s;
        done.hidden = false; cform.reset(); done.focus();
        announce('Đã ghi nhận yêu cầu mẫu, mã REQ-' + s + '.');
      });
    }
  });
})();

/* Khi video dịch vụ đang phát: tạm dừng nền động và nền parallax để video phát mượt trên máy yếu */
(function () {
  var root = document.documentElement;
  function bind() {
    Array.prototype.forEach.call(document.querySelectorAll('.media--video video'), function (v) {
      v.addEventListener('play', function () { root.classList.add('video-playing'); });
      v.addEventListener('pause', function () { root.classList.remove('video-playing'); });
      v.addEventListener('ended', function () { root.classList.remove('video-playing'); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* Nút Thích ở phần phản hồi: chỉ đổi số tại chỗ, không lưu và không gửi đi đâu */
(function () {
  function bind() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-like]'), function (b) {
      var base = parseInt(b.getAttribute('data-base'), 10) || 0, n = b.querySelector('[data-like-count]');
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        n.textContent = String(base + (on ? 1 : 0));
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* Trong khung xem trước (iframe), bấm liên kết email sẽ làm trang bị thoát ra màn hình lỗi.
   Ở đó, thay vì mở thư, chỉ sao chép địa chỉ email. Ngoài khung xem trước, liên kết mailto hoạt động bình thường. */
(function () {
  var framed = false;
  try { framed = window.self !== window.top; } catch (e) { framed = true; }
  if (!framed) return;
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="mailto:"]') : null;
    if (!a) return;
    e.preventDefault();
    var addr = a.getAttribute('href').replace(/^mailto:/, '');
    try { navigator.clipboard.writeText(addr); } catch (err) { /* bỏ qua */ }
    var old = a.getAttribute('data-old') || a.textContent;
    a.setAttribute('data-old', old);
    a.textContent = 'Đã sao chép địa chỉ email';
    window.setTimeout(function () { a.textContent = old; }, 1800);
  });
})();
