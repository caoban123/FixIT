/* FixIT Student — chatbot rule-based, chạy hoàn toàn trên trình duyệt.
   Chỉ trả lời dựa trên /chatbot-index.json (sinh tự động từ nội dung site).
   Phần LOGIC dùng được cả trong Node để kiểm thử; phần UI chỉ chạy khi có document. */
(function (root) {
  'use strict';

  /* ======================= LOGIC ======================= */
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD')
      .replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function has(padded, phrase) { return padded.indexOf(' ' + phrase + ' ') !== -1; }
  function hasAny(padded, list) { return list.some(function (p) { return has(padded, p); }); }

  var STOP = ['la', 'va', 'co', 'khong', 'the', 'nao', 'duoc', 'cho', 'toi', 'minh', 'ban', 'cua', 'nhu', 'gi',
    'bao', 'nhieu', 'o', 'dau', 'khi', 'nay', 'hay', 'voi', 'can', 'muon', 'thi', 'bi', 'em', 'anh', 'chi',
    'a', 'ah', 'vay', 'nha', 'ha', 'nhe', 'cac', 'nhung', 'mot', 'de', 'ma', 'rat', 'qua', 'lam', 'sao',
    'xin', 'oi', 'giup', 'dich', 'vu', 'may'];

  function tokens(s) {
    return norm(s).split(' ').filter(function (t) { return t.length > 1 && STOP.indexOf(t) === -1; });
  }

  function scoreService(padded, qTokens, s) {
    var score = 0, i;
    (s.triggers || []).forEach(function (t) {
      if (has(padded, t)) score += 2 + (t.split(' ').length - 1);
    });
    var titleTokens = tokens(s.title);
    for (i = 0; i < titleTokens.length; i++) {
      if (qTokens.indexOf(titleTokens[i]) !== -1) score += 1.5;
    }
    return score;
  }

  function scoreFaq(padded, qTokens, f) {
    var score = 0;
    (f.keywords || []).forEach(function (k) {
      if (has(padded, k)) score += 3 + (k.split(' ').length - 1) * 1.5;
    });
    var qt = tokens(f.q), overlap = 0;
    qt.forEach(function (t) { if (qTokens.indexOf(t) !== -1) overlap++; });
    return score + overlap * 0.8;
  }

  var PRICE_W = ['gia', 'bao nhieu', 'chi phi', 'phi', 'tien', 'het bao nhieu', 'bang gia', 'mac'];
  var TIME_W = ['bao lau', 'mat bao lau', 'thoi gian', 'mat may phut', 'mat may tieng', 'may tieng', 'may phut', 'nhanh khong', 'lau khong'];
  var INC_W = ['gom', 'bao gom', 'gom nhung gi', 'lam gi', 'co gi', 'gom gi', 'nhung gi', 'chi tiet', 'cu the', 'duoc lam gi'];
  var CHEAP_W = ['re nhat', 'thap nhat', 'it tien nhat'];
  var PRICEY_W = ['dat nhat', 'cao nhat', 'nhieu tien nhat'];
  var LIST_W = ['dich vu', 'cac dich vu', 'danh sach', 'bang gia', 'ban lam duoc gi', 'lam duoc gi', 'co nhung dich vu', 'dich vu nao', 'tat ca'];
  var PACK_W = ['student pack', 'studentpack', 'goi', 'combo', 'tron bo', 'goi sinh vien'];
  var HELLO_W = ['xin chao', 'chao', 'hello', 'hi', 'alo', 'hey', 'chao ban'];
  var THANKS_W = ['cam on', 'thanks', 'thank you', 'tks', 'cảm ơn'];
  var BYE_W = ['tam biet', 'bye', 'goodbye', 'hen gap lai'];
  var HUMAN_W = ['nguoi that', 'nhan vien', 'tu van vien', 'gap nguoi', 'noi chuyen voi nguoi'];
  var CHAT_BOT_W = ['ban la ai', 'ban ten gi', 'ban la bot', 'ban la ai vay'];

  function svcItem(s, opts) {
    var meta = s.priceText + ' · ' + s.duration;
    return { title: s.title, meta: meta, url: s.url, addId: s.slug, addTitle: s.title, addPrice: s.price, text: opts && opts.text };
  }

  function listAnswer(idx) {
    return {
      text: ['Hiện có ' + idx.services.length + ' dịch vụ lẻ, đều là giá sinh viên:'],
      items: idx.services.map(function (s) { return svcItem(s); }),
      links: [{ label: 'Xem trang dịch vụ', url: idx.site.links.services }]
    };
  }

  function packAnswer(idx) {
    var p = idx.pack;
    return {
      text: [
        'Student Pack giá ' + p.priceText + ' cho một thiết bị, thay vì ' + p.sumText + ' nếu đặt lẻ (tiết kiệm ' + p.savedText + ').',
        'Gói gồm: ' + p.includes.join('; ') + '.',
        'Điều kiện: ' + p.conditions.join('; ') + '.'
      ],
      links: [{ label: 'Xem Student Pack', url: p.url }]
    };
  }

  function serviceAnswer(padded, matches, idx) {
    var top = matches[0].s;
    var wantsPrice = hasAny(padded, PRICE_W);
    var wantsTime = hasAny(padded, TIME_W);
    var wantsInc = hasAny(padded, INC_W);

    if (matches.length > 1 && matches[1].score >= matches[0].score * 0.7 && !wantsPrice && !wantsTime && !wantsInc) {
      return {
        text: ['Từ mô tả của bạn, các dịch vụ sau có thể phù hợp (xếp theo mức khớp):'],
        items: matches.slice(0, 3).map(function (m) { return svcItem(m.s); }),
        links: [{ label: 'Không chắc? Thử Find your fix', url: idx.site.links.fix }]
      };
    }

    var lines = [];
    if (wantsPrice) {
      lines.push(top.title + ': giá ' + top.priceText + (top.priceFrom ? ' (tùy mức độ, báo giá cuối sau khi đánh giá)' : '') + '.');
      lines.push('Thời gian dự kiến: ' + top.duration + '. Linh kiện (nếu cần) tính riêng và chỉ thực hiện khi bạn đồng ý.');
    } else if (wantsTime) {
      lines.push(top.title + ' mất khoảng ' + top.duration + '.');
    } else if (wantsInc) {
      lines.push(top.title + ' bao gồm: ' + top.includes.join('; ') + '.');
    } else {
      lines.push(top.title + ': ' + top.summary);
      lines.push('Giá ' + top.priceText + ', thời gian dự kiến ' + top.duration + '.');
      if (top.suitable && top.suitable.length) lines.push('Phù hợp khi: ' + top.suitable.slice(0, 2).join('; ') + '.');
    }
    if (top.notes && (wantsInc || !wantsPrice && !wantsTime)) lines.push('Lưu ý: ' + top.notes);
    return {
      text: lines,
      items: [svcItem(top)],
      links: [{ label: 'Xem chi tiết dịch vụ', url: top.url }]
    };
  }

  function faqAnswer(f) {
    var res = { text: [f.a], links: [] };
    if (f.link) res.links.push({ label: f.linkLabel || 'Xem thêm', url: f.link });
    return res;
  }

  function fallback(idx) {
    return {
      text: [
        'Mình chỉ trả lời được các câu hỏi về nội dung trang web FixIT Student: dịch vụ, giá, Student Pack, đặt lịch, thanh toán, bảo hành và liên hệ.',
        'Bạn có thể thử hỏi lại bằng từ khóa khác, ví dụ: "máy nóng quạt kêu", "Python báo lỗi No module named", "giờ làm việc".'
      ],
      links: [
        { label: 'Find your fix', url: idx.site.links.fix },
        { label: 'Câu hỏi thường gặp', url: idx.site.links.faq },
        { label: 'Liên hệ', url: idx.site.links.contact }
      ]
    };
  }

  /* Trả về { text:[...], items:[...], links:[...] } */
  function answer(question, idx) {
    var q = norm(question);
    if (!q) return { text: ['Bạn hãy nhập câu hỏi nhé.'] };
    var padded = ' ' + q + ' ';
    var words = q.split(' ');
    var qTokens = tokens(question);

    if (words.length <= 4 && hasAny(padded, HELLO_W)) {
      return { text: ['Chào bạn! Mình là trợ lý tự động của FixIT Student. Bạn có thể hỏi về dịch vụ, giá, đặt lịch hoặc mô tả lỗi của máy.'] };
    }
    if (words.length <= 5 && hasAny(padded, THANKS_W)) return { text: ['Không có gì! Cần gì thêm bạn cứ hỏi nhé.'] };
    if (words.length <= 4 && hasAny(padded, BYE_W)) return { text: ['Tạm biệt bạn! Khi cần cứ mở trợ lý này lại.'] };
    if (hasAny(padded, CHAT_BOT_W)) {
      return { text: ['Mình là trợ lý tự động của FixIT Student, không phải người thật. Mình chỉ trả lời dựa trên nội dung của trang web này.'] };
    }
    if (hasAny(padded, HUMAN_W)) {
      return {
        text: ['Để nói chuyện với người thật, bạn nhắn qua Zalo hoặc gửi email ' + idx.site.email + '. Giờ làm việc: ' + idx.site.hours + '.'],
        links: [{ label: 'Trang liên hệ', url: idx.site.links.contact }]
      };
    }

    /* Học phí cao/thấp nhất */
    if (hasAny(padded, CHEAP_W) || hasAny(padded, PRICEY_W)) {
      var sorted = idx.services.slice().sort(function (a, b) { return a.price - b.price; });
      var pick = hasAny(padded, CHEAP_W) ? sorted[0] : sorted[sorted.length - 1];
      return {
        text: ['Dịch vụ ' + (hasAny(padded, CHEAP_W) ? 'rẻ nhất' : 'có giá cao nhất') + ' hiện là ' + pick.title + ' (' + pick.priceText + ').'],
        items: [svcItem(pick)],
        links: [{ label: 'Xem tất cả dịch vụ', url: idx.site.links.services }]
      };
    }

    /* Điểm cho dịch vụ và FAQ */
    var svc = idx.services.map(function (s) { return { s: s, score: scoreService(padded, qTokens, s) }; })
      .filter(function (m) { return m.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });
    var faqs = idx.faq.map(function (f) { return { f: f, score: scoreFaq(padded, qTokens, f) }; })
      .sort(function (a, b) { return b.score - a.score; });
    var sTop = svc.length ? svc[0].score : 0;
    var fTop = faqs[0].score;

    var packAsked = hasAny(padded, PACK_W);
    if (packAsked && sTop < 4) return packAnswer(idx);

    if (hasAny(padded, LIST_W) && sTop < 3 && fTop < 3) return listAnswer(idx);

    if (fTop >= 3 && fTop > sTop) return faqAnswer(faqs[0].f);
    if (sTop >= 2) return serviceAnswer(padded, svc, idx);
    if (fTop >= 2) return faqAnswer(faqs[0].f);
    if (hasAny(padded, PRICE_W)) return listAnswer(idx);
    return fallback(idx);
  }

  var api = { answer: answer, norm: norm };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.FixBot = api;

  /* ======================= UI ======================= */
  if (typeof document === 'undefined') return;

  var box = document.querySelector('[data-chat]');
  if (!box) return;

  var panel = document.getElementById('chat-panel');
  var launcher = box.querySelector('[data-chat-toggle]');
  var closeBtn = box.querySelector('[data-chat-close]');
  var log = box.querySelector('[data-chat-log]');
  var chips = box.querySelector('[data-chat-chips]');
  var form = box.querySelector('[data-chat-form]');
  var input = box.querySelector('[data-chat-input]');
  var index = null, loading = null, greeted = false;

  var CHIPS = [
    'Các dịch vụ và giá',
    'Student Pack có gì?',
    'Máy tôi nóng, quạt kêu to',
    'Đặt lịch như thế nào?',
    'Giờ làm việc'
  ];

  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    loading = fetch(box.getAttribute('data-index'), { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (j) { index = j; return j; })
      .catch(function (e) { loading = null; throw e; });
    return loading;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function addUser(text) {
    var m = el('div', 'msg msg--user');
    m.appendChild(el('p', null, text));
    log.appendChild(m); scrollDown();
  }

  function renderBot(res) {
    var m = el('div', 'msg msg--bot');
    (res.text || []).forEach(function (t) { m.appendChild(el('p', null, t)); });

    if (res.items && res.items.length) {
      var wrap = el('div', 'msg-items');
      res.items.forEach(function (it) {
        var card = el('div', 'msg-item');
        card.appendChild(el('p', 'msg-item-title', it.title));
        card.appendChild(el('p', 'msg-item-meta', it.meta));
        var act = el('div', 'msg-item-actions');
        var a = el('a', 'msg-link', 'Xem chi tiết'); a.href = it.url; act.appendChild(a);
        if (it.addId && window.FixCart) {
          var b = el('button', 'msg-link', window.FixCart.has(it.addId) ? 'Đã có trong giỏ' : 'Thêm vào giỏ');
          b.type = 'button';
          b.disabled = window.FixCart.has(it.addId);
          b.addEventListener('click', function () {
            window.FixCart.add({ id: it.addId, title: it.addTitle, price: it.addPrice });
            b.textContent = 'Đã có trong giỏ'; b.disabled = true;
            window.FixAnnounce && window.FixAnnounce('Đã thêm ' + it.addTitle + ' vào giỏ hàng.');
          });
          act.appendChild(b);
        }
        card.appendChild(act);
        wrap.appendChild(card);
      });
      m.appendChild(wrap);
    }
    if (res.links && res.links.length) {
      var l = el('div', 'msg-links');
      res.links.forEach(function (lk) {
        var a = el('a', 'msg-link', lk.label); a.href = lk.url; l.appendChild(a);
      });
      m.appendChild(l);
    }
    log.appendChild(m); scrollDown();
  }

  function ask(question) {
    question = String(question || '').trim();
    if (!question) return;
    addUser(question);
    var typing = el('div', 'msg msg--bot msg--typing', 'Đang trả lời…');
    log.appendChild(typing); scrollDown();
    loadIndex().then(function (idx) {
      window.setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        renderBot(answer(question, idx));
      }, 250);
    }).catch(function () {
      if (typing.parentNode) typing.parentNode.removeChild(typing);
      renderBot({
        text: ['Xin lỗi, mình chưa tải được dữ liệu để trả lời. Bạn thử tải lại trang hoặc xem mục câu hỏi thường gặp.'],
        links: [{ label: 'Câu hỏi thường gặp', url: box.getAttribute('data-index').replace('chatbot-index.json', 'faq/') }]
      });
    });
  }

  function buildChips() {
    CHIPS.forEach(function (c) {
      var b = el('button', 'chip', c); b.type = 'button';
      b.addEventListener('click', function () { ask(c); });
      chips.appendChild(b);
    });
  }

  function open() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    launcher.textContent = 'Thu nhỏ';
    if (!greeted) {
      greeted = true;
      buildChips();
      renderBot({ text: [
        'Chào bạn, mình là trợ lý tự động của FixIT Student.',
        'Bạn có thể hỏi về dịch vụ, giá, Student Pack, đặt lịch, thanh toán, bảo hành, hoặc mô tả lỗi của máy để mình gợi ý dịch vụ phù hợp.'
      ] });
      loadIndex().catch(function () {});
    }
    input.focus();
  }
  function close() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.textContent = 'Hỏi FixIT';
    launcher.focus();
  }

  launcher.addEventListener('click', function () { if (panel.hidden) open(); else close(); });
  closeBtn.addEventListener('click', close);
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value; input.value = '';
    ask(v); input.focus();
  });

  /* Nút "Hỏi trợ lý về ..." ở các trang khác */
  Array.prototype.forEach.call(document.querySelectorAll('[data-open-chat]'), function (b) {
    b.addEventListener('click', function () {
      if (panel.hidden) open();
      var q = b.getAttribute('data-chat-question');
      if (q) ask(q);
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
