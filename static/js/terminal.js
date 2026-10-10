// Fake terminal ở trang chủ: gõ lệnh -> báo lỗi -> fixit --help -> đã fix
(function () {
  var out = document.getElementById('term-out');
  if (!out) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var script = [
    { t: '$ ', type: 'cmd', text: 'python main.py', pause: 500 },
    { t: '', type: 'out', text: 'Traceback (most recent call last):\n  File "main.py", line 1\nModuleNotFoundError: No module named \'numpy\'\n', pause: 900 },
    { t: '$ ', type: 'cmd', text: 'fixit --help', pause: 600 },
    { t: '', type: 'out', text: '✔ Đã fix. Chạy lại thôi!', pause: 2500 }
  ];

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function run() {
    while (true) {
      out.textContent = '';
      for (var i = 0; i < script.length; i++) {
        var s = script[i];
        out.textContent += s.t;
        if (s.type === 'cmd') {
          for (var c = 0; c < s.text.length; c++) { out.textContent += s.text[c]; await sleep(60); }
          out.textContent += '\n';
        } else {
          out.textContent += s.text + '\n';
        }
        await sleep(s.pause);
      }
      await sleep(1500);
    }
  }
  run();
})();
