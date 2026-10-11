(function () {
  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var particles = [];
  var count = 55;
  var width = 0;
  var height = 0;
  var animId = null;
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
    (!document.documentElement.getAttribute('data-theme') && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function getThemeColors() {
    isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      return [
        'rgba(52, 211, 153, ', // emerald
        'rgba(56, 189, 248, ', // sky/cyan
        'rgba(255, 255, 255, '  // pure white dust
      ];
    }
    return [
      'rgba(5, 150, 105, ',  // dark emerald
      'rgba(14, 165, 233, ', // cyan
      'rgba(16, 185, 129, '  // bright mint
    ];
  }

  function createParticle() {
    var colors = getThemeColors();
    var color = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.8,
      baseAlpha: Math.random() * 0.5 + 0.2,
      alpha: 0.2,
      color: color,
      dx: (Math.random() - 0.5) * 0.45,
      dy: (Math.random() - 0.5) * 0.45 - 0.15, // slight upward float
      pulseSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function update() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.angle += p.pulseSpeed;
      p.alpha = p.baseAlpha + Math.sin(p.angle) * 0.2;
      if (p.alpha < 0.05) p.alpha = 0.05;

      // Wrap around screen
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Draw particle with glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.shadowBlur = p.r * 3;
      ctx.shadowColor = p.color + '0.8)';
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    animId = requestAnimationFrame(update);
  }

  window.addEventListener('resize', function () {
    resize();
  });

  // Re-sync colors on theme toggle
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTimeout(function () {
        var colors = getThemeColors();
        for (var i = 0; i < particles.length; i++) {
          particles[i].color = colors[Math.floor(Math.random() * colors.length)];
        }
      }, 50);
    });
  }

  init();
  update();
})();
