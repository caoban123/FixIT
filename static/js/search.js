// Tìm kiếm + lọc dịch vụ theo tên, tag, nhóm, khoảng giá
(function () {
  var grid = document.getElementById('grid');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.service-card'));
  var q = document.getElementById('q');
  var price = document.getElementById('price');
  var sort = document.getElementById('sort');
  var chips = document.querySelectorAll('.chip-btn');
  var count = document.getElementById('result-count');
  var empty = document.getElementById('empty');
  var cat = 'all';

  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }

  function apply() {
    var term = norm(q.value.trim());
    var range = price.value === 'all' ? null : price.value.split('-').map(Number);
    var shown = [];
    cards.forEach(function (c) {
      var hay = norm(c.dataset.name + ' ' + c.dataset.tags);
      var p = Number(c.dataset.price);
      var ok = (!term || hay.indexOf(term) !== -1) &&
               (cat === 'all' || c.dataset.cat === cat) &&
               (!range || (p >= range[0] && p <= range[1]));
      c.hidden = !ok;
      if (ok) shown.push(c);
    });
    if (sort.value !== 'default') {
      shown.sort(function (a, b) {
        return sort.value === 'asc' ? a.dataset.price - b.dataset.price : b.dataset.price - a.dataset.price;
      });
      shown.forEach(function (c) { grid.appendChild(c); });
    } else {
      cards.forEach(function (c) { grid.appendChild(c); });
    }
    count.textContent = shown.length + ' dịch vụ';
    empty.hidden = shown.length !== 0;
  }

  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      cat = b.dataset.cat;
      apply();
    });
  });
  [q, price, sort].forEach(function (el) { el.addEventListener('input', apply); });
  apply();
})();
