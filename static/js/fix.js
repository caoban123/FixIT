// Find your fix: rule-based, đọc cây câu hỏi từ fix-tree.json
(function () {
  var box = document.getElementById('fix-box');
  if (!box) return;
  var base = (window.FIXIT && FIXIT.base) || '/';
  var tree, services = {}, path = []; // path = các key đã đi qua

  function fmt(n) { return Number(n).toLocaleString('vi-VN') + 'đ'; }
  function setStep(n) {
    document.getElementById('fix-step').textContent = 'Bước ' + n + '/3';
    document.getElementById('fix-bar').style.width = (n / 3 * 100) + '%';
  }

  async function init() {
    try {
      var r = await Promise.all([
        fetch(base + 'data/fix-tree.json').then(function (x) { return x.json(); }),
        fetch(base + 'services.json').then(function (x) { return x.json(); })
      ]);
      tree = r[0];
      r[1].forEach(function (s) { services[s.id] = s; });
      show('start');
    } catch (e) {
      box.innerHTML = '<p>Không tải được dữ liệu. Thử tải lại trang nhé.</p>';
    }
  }

  function show(key) {
    var node = tree[key];
    var step = key === 'start' ? 1 : 2;
    setStep(step);
    var html = '<h2>' + node.question + '</h2><div class="opts">' +
      node.options.map(function (o, i) { return '<button class="opt" type="button" data-i="' + i + '">' + o.label + '</button>'; }).join('') +
      '</div>' + (key !== 'start' ? '<button class="btn btn-ghost" id="back" type="button">← Quay lại</button>' : '');
    box.innerHTML = html;
    box.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var o = node.options[b.dataset.i];
        path.push(key);
        if (o.next) show(o.next); else result(o);
      });
    });
    var back = document.getElementById('back');
    if (back) back.addEventListener('click', function () { show(path.pop() || 'start'); });
  }

  function result(o) {
    setStep(3);
    var items = o.result.map(function (id) { return services[id]; }).filter(Boolean);
    var sum = items.reduce(function (s, x) { return s + x.price; }, 0);
    var html = '<h2>FixIT gợi ý cho bạn</h2><p class="muted">Dựa trên vấn đề: <b>' + o.label + '</b></p><div class="result-list">' +
      items.map(function (s) {
        return '<div class="card pad result-item"><div><h3>' + s.icon + ' ' + s.name + '</h3><p class="muted">' + s.short + '</p>' +
          '<p class="price">' + fmt(s.price) + '</p></div>' +
          '<div class="card-actions"><a class="btn btn-ghost" href="' + s.url + '">Chi tiết</a>' +
          '<button class="btn add-to-cart" type="button" data-id="' + s.id + '" data-name="' + s.name + '" data-price="' + s.price + '">Thêm vào giỏ</button></div></div>';
      }).join('') + '</div>';
    if (items.length > 1) {
      html += '<p><button class="btn" id="add-all" type="button">Thêm tất cả (' + fmt(sum) + ')</button></p>';
    }
    if (sum > 100000 && services['student-pack']) {
      html += '<p class="muted">💡 Cần nhiều dịch vụ? <a href="' + services['student-pack'].url + '">Student Pack 149.000đ</a> có thể rẻ hơn.</p>';
    }
    html += '<p><button class="btn btn-ghost" id="restart" type="button">↺ Làm lại</button></p>';
    box.innerHTML = html;
    var all = document.getElementById('add-all');
    if (all) all.addEventListener('click', function () {
      items.forEach(function (s) { FixitCart.add({ id: s.id, name: s.name, price: s.price }); });
      FixitCart.toast('Đã thêm ' + items.length + ' dịch vụ vào giỏ');
    });
    document.getElementById('restart').addEventListener('click', function () { path = []; show('start'); });
  }

  // Tự chẩn đoán: 5 câu hỏi -> điểm -> Laptop Health Check
  var QUIZ = [
    'Máy bật lên mất hơn 1 phút?',
    'Quạt kêu to hoặc máy nóng khi làm việc bình thường?',
    'Ổ đĩa còn trống dưới 15%?',
    'Pin tụt nhanh hơn trước nhiều?',
    'Hay bị treo, giật khi mở nhiều ứng dụng?'
  ];
  function quiz() {
    var el = document.getElementById('quiz');
    if (!el) return;
    el.innerHTML = QUIZ.map(function (q, i) {
      return '<label class="check"><input type="checkbox" data-q="' + i + '"> ' + q + '</label>';
    }).join('') + '<button class="btn" id="quiz-go" type="button">Xem kết quả</button><div id="quiz-out" aria-live="polite"></div>';
    document.getElementById('quiz-go').addEventListener('click', function () {
      var n = el.querySelectorAll('input:checked').length;
      var out = document.getElementById('quiz-out');
      var msg = n <= 1 ? '✅ Máy bạn khá ổn (' + n + '/5 dấu hiệu). Cứ theo dõi thêm nhé.'
              : n <= 3 ? '⚠️ Có ' + n + '/5 dấu hiệu. Nên kiểm tra tổng quan.'
              : '🚨 Có ' + n + '/5 dấu hiệu. Nên kiểm tra sớm trước khi mất dữ liệu.';
      var s = services['laptop-health'];
      out.innerHTML = '<p>' + msg + '</p>' + (n >= 2 && s ? '<a class="btn" href="' + s.url + '">Xem ' + s.name + ' (' + fmt(s.price) + ')</a>' : '');
    });
  }

  document.addEventListener('DOMContentLoaded', function () { init(); quiz(); });
})();
