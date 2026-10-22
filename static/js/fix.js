/* FixIT Student — Find your fix (cây câu hỏi rule-based từ data/fix.yaml) */
(function () {
  'use strict';
  var root = document.querySelector('[data-fix-app]');
  var dataEl = document.getElementById('fix-data');
  if (!root || !dataEl) return;

  var data;
  try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var tree = data.tree, services = data.services;
  var history = []; // các nút đã đi qua, để quay lại
  var firstRender = true;
  var answers = [];

  function answerTrail(box) {
    if (!answers.length) return;
    var trail = el('div', 'quiz-answer-trail');
    trail.setAttribute('aria-label', 'Lựa chọn của bạn');
    answers.forEach(function (answer) { trail.appendChild(el('span', null, answer)); });
    box.appendChild(trail);
  }

  function previousQuestion() {
    answers.pop();
    renderQuestion(history.pop());
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function clear() { while (root.firstChild) root.removeChild(root.firstChild); }

  function focusHeading(h) {
    h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: firstRender });
    firstRender = false;
  }

  function updateStages(step) {
    document.querySelectorAll('[data-fix-stage]').forEach(function (item) {
      var number = Number(item.getAttribute('data-fix-stage'));
      item.classList.toggle('is-complete', number < step);
      if (number === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  }

  function renderQuestion(id) {
    var node = tree.nodes[id];
    clear();
    var box = el('div', 'quiz-step');
    var stepNo = Math.min(history.length + 1, 3);
    updateStages(stepNo);
    box.appendChild(el('p', 'quiz-count', 'Bước ' + stepNo + '/3' + (stepNo === 1 ? ': chọn danh mục' : ': chọn tình trạng')));
    box.appendChild(el('div', 'quiz-bar')).style.setProperty('--p', (stepNo / 3 * 100) + '%');
    var h = el('h2', 'quiz-question', node.question);
    box.appendChild(h);
    answerTrail(box);

    var list = el('div', 'quiz-options');
    var categorySlugs = ['windows-rescue', 'python-setup', 'laptop-health', 'tech-consultation'];
    var hints = ['Windows, cập nhật và ứng dụng', 'Python, C/C++, Git và VS Code', 'Hiệu năng, pin và dữ liệu', 'Cùng tìm hướng giải quyết'];
    var isStart = id === tree.start;
    if (isStart) list.classList.add('quiz-category-grid');
    node.options.forEach(function (opt, index) {
      var b = el('button', 'quiz-option' + (isStart ? ' quiz-category' : ''));
      if (isStart) {
        var template = document.getElementById('fix-art-' + categorySlugs[index]);
        var art = el('span', 'quiz-choice-art');
        art.setAttribute('aria-hidden', 'true');
        art.appendChild(template.content.querySelector('svg').cloneNode(true));
        b.appendChild(art);
        b.appendChild(el('strong', 'quiz-option-label', opt.label));
        b.appendChild(el('small', 'quiz-option-hint', hints[index]));
      } else {
        b.appendChild(el('span', 'quiz-option-label', opt.label));
      }
      b.type = 'button';
      b.addEventListener('click', function () {
        history.push(id);
        answers.push(opt.label);
        if (opt.result) renderResult(opt.result); else renderQuestion(opt.next);
      });
      list.appendChild(b);
    });
    box.appendChild(list);

    if (history.length) {
      var nav = el('div', 'quiz-nav');
      var back = el('button', 'btn btn--secondary btn--small', 'Quay lại');
      back.type = 'button';
      back.addEventListener('click', previousQuestion);
      nav.appendChild(back);
      box.appendChild(nav);
    }
    root.appendChild(box);
    focusHeading(h);
  }

  function serviceCard(slug, isPrimary) {
    var s = services[slug];
    if (!s) return null;
    var card = el('div', isPrimary ? 'result-card' : '');
    card.classList.add('result-card--service');
    var art = el('div', 'result-illustration');
    art.setAttribute('aria-hidden', 'true');
    art.appendChild(document.getElementById('fix-art-' + slug).content.cloneNode(true));
    card.appendChild(art);
    var content = el('div', 'result-card-content');
    content.appendChild(el('span', 'result-recommendation-label', 'GỢI Ý DÀNH CHO BẠN'));
    content.appendChild(el('h3', null, s.title));
    content.appendChild(el('p', 'service-meaning', s.labelVi));
    content.appendChild(el('p', 'card-text', s.summary));
    var meta = el('div', 'result-meta');
    meta.appendChild(el('span', 'card-price', s.priceText));
    meta.appendChild(el('span', 'muted', s.duration));
    content.appendChild(meta);
    var actions = el('div', 'result-actions');
    var add = el('button', 'btn btn--primary', window.FixCart && window.FixCart.has(slug) ? 'Đã thêm' : 'Thêm vào giỏ');
    add.type = 'button';
    add.addEventListener('click', function () {
      if (!window.FixCart || window.FixCart.has(slug)) return;
      window.FixCart.add({ id: slug, title: s.title, price: s.price });
      add.textContent = 'Đã thêm';
      if (window.FixAnnounce) window.FixAnnounce('Đã thêm ' + s.title + ' vào giỏ hàng.');
    });
    var more = el('a', 'btn btn--secondary', 'Xem chi tiết');
    more.href = s.url;
    actions.appendChild(add);
    actions.appendChild(more);
    var cartLink = el('a', 'studio-text-link', 'Đến giỏ hàng');
    cartLink.href = data.cartUrl;
    actions.appendChild(cartLink);
    content.appendChild(actions);
    card.appendChild(content);
    return card;
  }

  function renderResult(rid) {
    var r = tree.results[rid];
    updateStages(3);
    clear();
    var box = el('div', 'quiz-step is-result');
    var mark = el('span', 'result-found-mark', '✓');
    mark.setAttribute('aria-hidden', 'true');
    box.appendChild(mark);
    box.appendChild(el('p', 'quiz-count', 'Bước 3/3: gợi ý của FixIT'));
    box.appendChild(el('div', 'quiz-bar')).style.setProperty('--p', '100%');
    var h = el('h2', 'quiz-question', r.title);
    box.appendChild(h);
    answerTrail(box);
    box.appendChild(el('p', 'lead', r.text));

    if (r.primary) {
      var c = serviceCard(r.primary, true);
      if (c) box.appendChild(c);
    }
    if (r.contact) {
      var cc = el('div', 'result-card');
      cc.appendChild(el('h3', null, 'Nhắn FixIT để hẹn xem máy'));
      cc.appendChild(el('p', 'card-text', 'Mô tả ngắn triệu chứng và model máy, FixIT sẽ báo hướng xử lý và chi phí dự kiến trước khi bạn mang máy đến.'));
      var a = el('a', 'btn btn--primary', 'Đến trang liên hệ');
      a.href = data.contactUrl;
      var act = el('div', 'result-actions'); act.appendChild(a); cc.appendChild(act);
      box.appendChild(cc);
    }
    if (r.also && r.also.length) {
      box.appendChild(el('h3', 'h2-sm', 'Có thể bạn cũng cần'));
      var ul = el('ul', 'also-list');
      r.also.forEach(function (slug) {
        var s = services[slug]; if (!s) return;
        var li = el('li');
        var link = el('a', 'text-link', s.title); link.href = s.url;
        li.appendChild(link);
        li.appendChild(el('span', 'muted', s.priceText));
        ul.appendChild(li);
      });
      box.appendChild(ul);
    }

    var nav = el('div', 'quiz-nav');
    var back = el('button', 'btn btn--secondary btn--small', 'Quay lại');
    back.type = 'button';
    back.addEventListener('click', previousQuestion);
    var again = el('button', 'btn btn--secondary btn--small', 'Làm lại từ đầu');
    again.type = 'button';
    again.addEventListener('click', function () { history = []; answers = []; renderQuestion(tree.start); });
    nav.appendChild(back); nav.appendChild(again);
    box.appendChild(nav);

    root.appendChild(box);
    focusHeading(h);
  }

  renderQuestion(tree.start);

  /* Test nhanh 30 giây: đếm dấu hiệu máy quá tải */
  var qt = document.querySelector('[data-quick-test]');
  if (qt) {
    var boxes = qt.querySelectorAll('input[type=checkbox]');
    var out = qt.querySelector('[data-quick-out]');
    var update = function () {
      var n = 0;
      Array.prototype.forEach.call(boxes, function (b) { if (b.checked) n++; });
      var msg, slug;
      if (n === 0) { msg = 'Chưa chọn dấu hiệu nào. Đánh dấu những gì bạn thấy ở máy của mình.'; }
      else if (n <= 1) { msg = 'Máy của bạn ổn, mới có ' + n + ' dấu hiệu. Nên kiểm tra định kỳ mỗi học kỳ.'; }
      else if (n <= 3) { msg = 'Có ' + n + ' dấu hiệu: máy đang bắt đầu quá tải. Một lần Laptop Health Check sẽ giúp máy nhẹ hơn.'; slug = 'laptop-health'; }
      else { msg = 'Có ' + n + ' dấu hiệu: máy quá tải rõ rệt. Nên sao lưu dữ liệu và kiểm tra sớm.'; slug = 'laptop-health'; }
      while (out.firstChild) out.removeChild(out.firstChild);
      out.appendChild(el('span', null, msg + ' '));
      if (slug && services[slug]) { var a = el('a', 'text-link', 'Xem ' + services[slug].title); a.href = services[slug].url; out.appendChild(a); }
    };
    Array.prototype.forEach.call(boxes, function (b) { b.addEventListener('change', update); });
    update();
  }
})();
