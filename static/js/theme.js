(function () {
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');

  function currentTheme() {
    return root.getAttribute('data-theme') || 'dark';
  }

  function updateThemeButtonAria(theme) {
    if (!themeBtn) return;
    if (theme === 'dark') {
      themeBtn.setAttribute('aria-label', 'Chuyển sang giao diện sáng (Light mode)');
      themeBtn.setAttribute('title', 'Chuyển sang giao diện sáng');
    } else {
      themeBtn.setAttribute('aria-label', 'Chuyển sang giao diện tối (Dark mode)');
      themeBtn.setAttribute('title', 'Chuyển sang giao diện tối');
    }
  }

  // Initial aria setup
  updateThemeButtonAria(currentTheme());

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      updateThemeButtonAria(next);
      try { localStorage.setItem('fixit_theme', next); } catch (e) {}
    });
  }

  // Mobile navigation drawer & accessibility
  var nav = document.getElementById('nav');
  var tog = document.getElementById('nav-toggle');

  function closeNav() {
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (tog) tog.setAttribute('aria-expanded', 'false');
    }
  }

  if (nav && tog) {
    tog.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      tog.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !tog.contains(e.target)) {
        closeNav();
      }
    });

    // Close on clicking any link inside nav on mobile
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }
})();
