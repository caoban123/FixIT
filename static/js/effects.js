/* Optional enhancement: everything remains usable with motion disabled. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var glowSelector = '.card, .package-included-card, .detail-inclusions li, .payment-methods label';
  var activeGlow = null;
  var frame = 0;
  var pointerX = 0, pointerY = 0;
  var filterAnimations = new WeakMap();

  function clearGlow() {
    if (activeGlow) activeGlow.classList.remove('fx-lit');
    activeGlow = null;
  }

  document.addEventListener('pointermove', function (event) {
    if (reduced.matches || !finePointer.matches) return;
    var target = event.target.closest(glowSelector);
    if (target !== activeGlow) {
      clearGlow();
      activeGlow = target;
      if (target) target.classList.add('fx-glow', 'fx-lit');
    }
    if (!target) return;
    pointerX = event.clientX; pointerY = event.clientY;
    if (frame) return;
    frame = window.requestAnimationFrame(function () {
      frame = 0;
      if (!activeGlow) return;
      var bounds = activeGlow.getBoundingClientRect();
      activeGlow.style.setProperty('--fx-x', (pointerX - bounds.left) + 'px');
      activeGlow.style.setProperty('--fx-y', (pointerY - bounds.top) + 'px');
    });
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', clearGlow);
  window.addEventListener('blur', clearGlow);
  window.addEventListener('scroll', clearGlow, { passive: true });

  var floating = document.querySelectorAll('.studio-laptop, .membership-card, .radar-ring');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle('fx-in-view', entry.isIntersecting); });
    });
    floating.forEach(function (element) {
      element.classList.add('fx-animated');
      observer.observe(element);
    });
  }
  document.addEventListener('visibilitychange', function () {
    document.documentElement.classList.toggle('fx-paused', document.hidden);
    if (document.hidden) clearGlow();
  });

  document.addEventListener('click', function (event) {
    if (reduced.matches || !event.target.closest('[data-home-filter], [data-chip]')) return;
    var grid = document.querySelector('[data-home-grid], [data-svc-grid]');
    if (!grid) return;
    grid.querySelectorAll('[data-service]:not([hidden])').forEach(function (card, index) {
      var previous = filterAnimations.get(card);
      if (previous) previous.cancel();
      var animation = card.animate([
        { opacity: 0, transform: 'translateY(9px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 300, delay: Math.min(index * 30, 180), easing: 'ease-out' });
      animation.id = 'fx-filter';
      filterAnimations.set(card, animation);
    });
  });

  document.addEventListener('fixit:booking-complete', function () {
    if (reduced.matches || document.hidden) return;
    var existing = document.querySelector('.fx-confetti');
    if (existing) existing.remove();
    var layer = document.createElement('div');
    layer.className = 'fx-confetti'; layer.setAttribute('aria-hidden', 'true');
    var badge = document.querySelector('.confirmation-check').getBoundingClientRect();
    var originX = Math.max(25, Math.min(window.innerWidth - 25, badge.left + badge.width / 2));
    var originY = Math.max(35, Math.min(window.innerHeight - 100, badge.top + badge.height / 2));
    var colors = ['#9D80DC', '#DFF294', '#B8A4E4', '#E8C56F', '#91B4C8'];
    for (var i = 0; i < 28; i++) {
      var piece = document.createElement('span'); piece.className = 'fx-confetti-piece';
      piece.style.setProperty('--fx-left', originX + 'px');
      piece.style.setProperty('--fx-top', originY + 'px');
      piece.style.setProperty('--fx-color', colors[i % colors.length]);
      piece.style.setProperty('--fx-dx', ((Math.random() - .5) * Math.min(window.innerWidth * .8, 520)) + 'px');
      piece.style.setProperty('--fx-dy', (110 + Math.random() * 160) + 'px');
      piece.style.setProperty('--fx-rotation', ((Math.random() - .5) * 650) + 'deg');
      piece.style.setProperty('--fx-delay', Math.random() * 100 + 'ms');
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    window.setTimeout(function () { layer.remove(); }, 1450);
  });

  reduced.addEventListener('change', function () {
    clearGlow();
    if (!reduced.matches) return;
    document.querySelectorAll('.fx-confetti').forEach(function (layer) { layer.remove(); });
    document.getAnimations().forEach(function (animation) {
      if (animation.id === 'fx-filter') animation.cancel();
    });
  });
})();
