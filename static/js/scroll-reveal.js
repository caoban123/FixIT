// FixIT Student - Smooth Scroll Reveal Observer with Stagger
(function () {
  'use strict';

  var SELECTORS = [
    '.reveal',
    '.section-title',
    '.section-subtitle',
    '.page-badge',
    '.page-title',
    '.page-subtitle',
    '.problem-card',
    '.pipeline-step',
    '.service-card',
    '.team-member-card',
    '.ai-step-card',
    '.faq-accordion-item',
    '.compare-card',
    '.channel-card',
    '.contact-form-card',
    '.story-glass-card',
    '.quiz-glass-card',
    '.pack-hero-banner',
    '.detail-hero-card',
    '.review-glass-card',
    '.track-lookup-card',
    '.cart-summary-card'
  ];

  var observer = null;

  function checkVisibility() {
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    var elements = document.querySelectorAll(SELECTORS.join(', '));

    elements.forEach(function (el, index) {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }

      var rect = el.getBoundingClientRect();
      // If within viewport or 150px below viewport
      if (rect.top <= windowHeight + 150 && rect.bottom >= -50) {
        if (!el.classList.contains('active')) {
          // Stagger cascade effect for siblings
          var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
          if (siblings > 0 && siblings < 6 && !el.style.transitionDelay) {
            el.style.transitionDelay = (siblings * 0.08) + 's';
          }
          el.classList.add('active');
        }
      }
    });
  }

  function initObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(SELECTORS.join(', ')).forEach(function (el) {
        el.classList.add('active');
      });
      return;
    }

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
          if (siblings > 0 && siblings < 6 && !el.style.transitionDelay) {
            el.style.transitionDelay = (siblings * 0.08) + 's';
          }
          el.classList.add('active');
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 150px 0px'
    });

    var elements = document.querySelectorAll(SELECTORS.join(', '));
    elements.forEach(function (el) {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
      observer.observe(el);
    });

    // Initial check
    checkVisibility();

    // Listen on scroll and resize for instantaneous response
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
  }

  function observeMutations() {
    if (!('MutationObserver' in window)) return;
    var mo = new MutationObserver(function () {
      if (observer) {
        document.querySelectorAll(SELECTORS.join(', ')).forEach(function (el) {
          if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
            observer.observe(el);
          }
        });
      }
      checkVisibility();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initObserver();
      observeMutations();
    });
  } else {
    initObserver();
    observeMutations();
  }

  window.FixitReveal = { scan: checkVisibility };
})();
