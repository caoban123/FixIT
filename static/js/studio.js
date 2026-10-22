/* Homepage service discovery. Prices and booking continue to use the shared cart. */
(function () {
  'use strict';
  var grid = document.querySelector('[data-home-grid]');
  if (!grid) return;
  var buttons = document.querySelectorAll('[data-home-filter]');
  var cards = grid.querySelectorAll('[data-service]');
  var count = document.querySelector('[data-home-count]');
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var group = button.getAttribute('data-home-filter');
      var visible = 0;
      buttons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      cards.forEach(function (card) {
        card.hidden = group !== 'all' && card.getAttribute('data-group') !== group;
        if (!card.hidden) {
          visible++;
          card.classList.add('is-visible');
        }
      });
      count.textContent = String(visible);
    });
  });
})();
